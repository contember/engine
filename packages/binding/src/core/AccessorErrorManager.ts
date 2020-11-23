import { ErrorAccessor } from '../accessors'
import { ExecutionError, MutationDataResponse, ValidationError } from '../accessorTree'
import { ErrorsPreprocessor } from './ErrorsPreprocessor'
import {
	InternalEntityListState,
	InternalEntityState,
	InternalRootStateNode,
	InternalStateNode,
	InternalStateType,
} from './internalState'

export class AccessorErrorManager {
	private errorsByState: Map<InternalStateNode, ErrorAccessor.ErrorsById> = new Map()

	private getNewErrorId = (() => {
		let errorId = 1

		return () => errorId++
	})()

	public constructor(
		private readonly subTreeStates: Map<string, InternalRootStateNode>,
		private readonly entityStore: Map<string, InternalEntityState>,
	) {}

	public hasErrors() {
		return !!this.errorsByState.size
	}

	public clearErrors() {
		for (const [stateNode] of this.errorsByState) {
			stateNode.errors = undefined
			this.triggerUpdate(stateNode)
		}
		this.errorsByState.clear()
	}

	public setErrors(data: MutationDataResponse | undefined) {
		this.clearErrors()

		const preprocessor = new ErrorsPreprocessor(data)
		const errorTreeRoot = preprocessor.preprocess()

		this.setRootStateErrors(errorTreeRoot)

		this.dumpErrorData(data)
	}

	public addError(state: InternalStateNode, error: ErrorAccessor.BoxedError): () => void {
		const errorId = this.getNewErrorId()

		let errorsById: ErrorAccessor.ErrorsById | undefined = this.errorsByState.get(state)
		if (errorsById === undefined) {
			this.errorsByState.set(state, (errorsById = new Map()))
		}
		errorsById.set(errorId, error)
		state.errors = new ErrorAccessor(errorsById)
		this.triggerUpdate(state)

		return () => {
			const errorsById = this.errorsByState.get(state)
			if (errorsById === undefined) {
				return
			}
			errorsById.delete(errorId)
			if (errorsById.size) {
				state.errors = new ErrorAccessor(errorsById)
			} else {
				state.errors = undefined
				this.errorsByState.delete(state)
			}
			this.triggerUpdate(state)
		}
	}

	private addSeveralErrors(state: InternalStateNode, errors: ErrorsPreprocessor.BaseErrorNode) {
		if (errors.validation) {
			for (const error of errors.validation) {
				this.addError(state, { type: ErrorAccessor.ErrorType.Validation, error })
			}
		}
		if (errors.execution) {
			for (const error of errors.execution) {
				this.addError(state, { type: ErrorAccessor.ErrorType.Execution, error })
			}
		}
	}

	private setRootStateErrors(errorTreeRoot: ErrorsPreprocessor.ErrorTreeRoot) {
		for (const [subTreePlaceholder, rootError] of errorTreeRoot) {
			const rootState = this.subTreeStates.get(subTreePlaceholder)

			if (!rootState) {
				continue
			}
			switch (rootState.type) {
				case InternalStateType.SingleEntity: {
					this.setEntityStateErrors(rootState, rootError)
					break
				}
				case InternalStateType.EntityList: {
					this.setEntityListStateErrors(rootState, rootError)
					break
				}
			}
		}
	}

	private setEntityStateErrors(
		state: InternalEntityState,
		errors: ErrorsPreprocessor.ErrorINode | ErrorsPreprocessor.LeafErrorNode,
	) {
		this.addSeveralErrors(state, errors)

		if (errors.nodeType !== ErrorsPreprocessor.ErrorNodeType.INode) {
			return
		}

		if (state.childrenWithPendingUpdates === undefined) {
			state.childrenWithPendingUpdates = new Set()
		}

		for (const [childKey, child] of errors.children) {
			if (child.nodeType === ErrorsPreprocessor.ErrorNodeType.Leaf) {
				const fieldState = state.fields.get(childKey)

				if (fieldState?.type === InternalStateType.Field) {
					state.childrenWithPendingUpdates.add(fieldState)
					this.addSeveralErrors(fieldState, child)
					continue
				}
			}
			// Deliberately letting flow get here as well. Leaf errors *CAN* refer to relations as well.

			const placeholders = state.markersContainer.placeholders.get(childKey)
			if (placeholders === undefined) {
				continue
			}
			const normalizedPlaceholders = typeof placeholders === 'string' ? new Set([placeholders]) : placeholders

			for (const normalizedPlaceholder of normalizedPlaceholders) {
				const fieldState = state.fields.get(normalizedPlaceholder)
				if (fieldState === undefined) {
					continue
				}
				switch (fieldState.type) {
					case InternalStateType.SingleEntity:
						state.childrenWithPendingUpdates.add(fieldState)
						this.setEntityStateErrors(fieldState, child)
						break
					case InternalStateType.EntityList:
						state.childrenWithPendingUpdates.add(fieldState)
						this.setEntityListStateErrors(fieldState, child)
						break
				}
			}
		}
	}

	private setEntityListStateErrors(
		state: InternalEntityListState,
		errors: ErrorsPreprocessor.ErrorINode | ErrorsPreprocessor.LeafErrorNode,
	) {
		this.addSeveralErrors(state, errors)

		if (errors.nodeType !== ErrorsPreprocessor.ErrorNodeType.INode) {
			return
		}

		if (state.childrenWithPendingUpdates === undefined) {
			state.childrenWithPendingUpdates = new Set()
		}

		for (const [childKey, childError] of errors.children) {
			const childState = this.entityStore.get(childKey)

			if (childState && childError.nodeType === ErrorsPreprocessor.ErrorNodeType.INode) {
				state.childrenWithPendingUpdates.add(childState)
				this.setEntityStateErrors(childState, childError)
			}
		}
	}

	private dumpErrorData(data: MutationDataResponse | undefined) {
		if (!data) {
			return
		}

		// TODO this is just temporary
		for (const subTreePlaceholder in data) {
			const treeDatum = data[subTreePlaceholder]
			const executionErrors: Array<ExecutionError | ValidationError> = treeDatum.errors
			const allErrors = treeDatum?.validation?.errors
				? executionErrors.concat(treeDatum.validation.errors)
				: executionErrors
			const normalizedErrors = allErrors.map((error: ExecutionError | ValidationError) => {
				return {
					path: error.path
						.map(pathPart => {
							if (pathPart.__typename === '_FieldPathFragment') {
								return pathPart.field
							}
							if (pathPart.alias) {
								return `#${pathPart.index}(${pathPart.alias})`
							}
							return pathPart.index
						})
						.join('.'),
					type: 'type' in error ? error.type : undefined,
					message: typeof error.message === 'string' ? error.message : error.message?.text,
				}
			})
			if (Object.keys(normalizedErrors).length) {
				console.table(normalizedErrors)
			}
			if (treeDatum.errorMessage) {
				console.error(treeDatum.errorMessage)
			}
		}
	}

	private triggerUpdate(stateNode: InternalStateNode) {
		stateNode.hasStaleAccessor = true
		stateNode.hasPendingUpdate = true
		switch (stateNode.type) {
			case InternalStateType.Field:
				stateNode.onFieldUpdate(stateNode)
				break
			case InternalStateType.SingleEntity:
				for (const realm of stateNode.realms) {
					realm(stateNode)
				}
				break
			case InternalStateType.EntityList:
				stateNode.onEntityListUpdate(stateNode)
				break
		}
	}
}
