import {
	ClientGeneratedUuid,
	EntityListPersistedData,
	ReceivedDataTree,
	RuntimeId,
	ServerGeneratedUuid,
	UnpersistedEntityDummyId,
} from '../accessorTree'
import { BindingError } from '../BindingError'
import type { MarkerTreeRoot } from '../markers'
import type { EntityId, PlaceholderName, TreeRootId } from '../treeParameters'
import { assertNever } from '../utils'
import { EventManager } from './EventManager'
import { OperationsHelpers } from './operations/OperationsHelpers'
import { EntityListState, EntityRealmState, EntityRealmStateStub, RootStateNode, StateType } from './state'
import type { StateInitializer } from './StateInitializer'
import type { TreeStore } from './TreeStore'

export class TreeAugmenter {
	public constructor(
		private readonly eventManager: EventManager,
		private readonly stateInitializer: StateInitializer,
		private readonly treeStore: TreeStore,
	) {}

	public extendPersistedData(newPersistedData: ReceivedDataTree) {
		// TODO this doesn't yet handle updates for entities whose persisted data just gets magically changed without notice.
		this.treeStore.mergeInQueryResponse(newPersistedData)
	}

	public extendTreeStates(newTreeId: TreeRootId | undefined, newMarkerTree: MarkerTreeRoot): void {
		const subTreeStates: Map<PlaceholderName, RootStateNode> = new Map()

		this.treeStore.markerTrees.set(newTreeId, newMarkerTree)
		this.treeStore.subTreeStatesByRoot.set(newTreeId, subTreeStates)

		for (const [placeholderName, newSubTreeMarker] of newMarkerTree.subTrees) {
			const newState = this.stateInitializer.initializeSubTree(newSubTreeMarker)
			subTreeStates.set(placeholderName, newState)
		}
	}

	public updatePersistedData(response: ReceivedDataTree) {
		this.treeStore.mergeInMutationResponse(response)

		this.eventManager.syncTransaction(() => {
			for (const rootStates of this.treeStore.subTreeStatesByRoot.values()) {
				// for (const rootPlaceholder in response) {
				// 	const rootState = rootStates.get(rootPlaceholder)
				//
				// 	if (rootState === undefined) {
				// 		continue
				// 	}
				// TODO the above would be better, only refreshing roots which participated in the mutation. However, due to
				// 	how mutations are currently generated, we cannot assume that only roots present in the response need
				// 	refreshed. So we just refresh all.
				for (const [rootPlaceholder, rootState] of rootStates) {
					const rootData = this.treeStore.subTreePersistedData.get(rootPlaceholder)

					if (rootState.type === StateType.EntityList) {
						if (!(rootData instanceof Set)) {
							continue // This should never happen.
						}
						this.updateEntityListPersistedData(rootState, rootData)
					} else if (rootState.type === StateType.EntityRealm) {
						if (rootData !== undefined && !(rootData instanceof ServerGeneratedUuid)) {
							continue // This should never happen.
						}
						this.updateRealmIdIfNecessary(rootState, rootData)
						this.updateEntityRealmPersistedData(rootState)
					} else {
						return assertNever(rootState)
					}
				}
			}
		})
	}

	private updateRealmIdIfNecessary(
		realm: EntityRealmState | EntityRealmStateStub,
		newId: ServerGeneratedUuid | undefined | null,
	) {
		const currentId = realm.entity.id
		let idToChangeTo: RuntimeId | undefined = undefined

		if (currentId instanceof ServerGeneratedUuid) {
			if (newId === undefined || newId === null) {
				idToChangeTo = new UnpersistedEntityDummyId()
			} else if (currentId.value !== newId.value) {
				idToChangeTo = newId
			}
		} else if (currentId instanceof ClientGeneratedUuid) {
			idToChangeTo = newId ?? new UnpersistedEntityDummyId()
		} else if (currentId instanceof UnpersistedEntityDummyId) {
			if (newId) {
				idToChangeTo = newId
			}
		} else {
			return assertNever(currentId)
		}
		if (idToChangeTo) {
			OperationsHelpers.changeRealmId(this.treeStore, this.eventManager, this.stateInitializer, realm, idToChangeTo)
		}
	}

	private updateEntityRealmPersistedData(realm: EntityRealmState) {
		const realmId = realm.entity.id
		const persistedData = realmId.existsOnServer ? this.treeStore.persistedEntityData.get(realmId.value) : undefined

		for (const [placeholderName, child] of realm.children) {
			const childData = persistedData?.get(placeholderName)

			switch (child.type) {
				case StateType.Field: {
					if (childData instanceof ServerGeneratedUuid || childData instanceof Set) {
						throw new BindingError()
					}

					if (child.persistedValue !== childData) {
						const shouldChangeBothValues = child.persistedValue === child.value

						child.persistedValue = childData
						if (shouldChangeBothValues) {
							child.value = childData ?? null
						}
						this.eventManager.registerJustUpdated(child, EventManager.NO_CHANGES_DIFFERENCE)
					}
					break
				}
				case StateType.EntityRealm:
				case StateType.EntityRealmStub: {
					if (!(childData instanceof ServerGeneratedUuid) && childData !== undefined && childData !== null) {
						throw new BindingError()
					}
					this.updateRealmIdIfNecessary(child, childData)
					if (child.type === StateType.EntityRealm) {
						this.updateEntityRealmPersistedData(child)
					}
					break
				}
				case StateType.EntityList: {
					if (childData !== undefined && !(childData instanceof Set)) {
						throw new BindingError()
					}
					this.updateEntityListPersistedData(child, childData ?? new Set()) // TODO!!
					break
				}
				default: {
					return assertNever(child)
				}
			}
		}
	}

	private updateEntityListPersistedData(state: EntityListState, newPersistedIds: EntityListPersistedData) {
		const persistedWithoutState: EntityId[] = []

		// TODO This isn't particularly efficient. We should probably use something like diff-sequence here.

		for (const persistedId of newPersistedIds) {
			if (!state.children.has(persistedId)) {
				persistedWithoutState.push(persistedId)
			}
		}
		for (const [stateId, child] of state.children) {
			const childRuntimeId = child.entity.id
			if (!newPersistedIds.has(stateId)) {
				if (
					// It's a uuid but it's not among the persisted so either it got deleted/disconnected or the client-side
					// id generation didn't quite pan out.
					childRuntimeId instanceof ServerGeneratedUuid ||
					childRuntimeId instanceof ClientGeneratedUuid ||
					// No persisted entity id to allocate to this so that's a goodbye.
					persistedWithoutState.length === 0
				) {
					state.getAccessor().disconnectEntity(child.getAccessor())
					continue
				} else {
					const drawnId = persistedWithoutState.shift()!
					OperationsHelpers.changeRealmId(
						this.treeStore,
						this.eventManager,
						this.stateInitializer,
						child,
						new ServerGeneratedUuid(drawnId),
					)
				}
			} else if (childRuntimeId instanceof ClientGeneratedUuid) {
				OperationsHelpers.changeRealmId(
					this.treeStore,
					this.eventManager,
					this.stateInitializer,
					child,
					new ServerGeneratedUuid(childRuntimeId.value),
				)
			}
			if (child.type === StateType.EntityRealm) {
				this.updateEntityRealmPersistedData(child)
			}
		}
		for (const unclaimedPersistedId of persistedWithoutState) {
			this.stateInitializer.initializeEntityRealm(new ServerGeneratedUuid(unclaimedPersistedId), state.entityName, {
				type: 'listEntity',
				parent: state,
			})
		}
		// All that remains now is the order.
		state.children.changeKeyOrder(newPersistedIds)
	}
}
