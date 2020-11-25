import { TreeFilter } from '@contember/client'
import { EntityAccessor } from './EntityAccessor'
import { GetEntityByKey } from './GetEntityByKey'
import { GetEntityListSubTree } from './GetEntityListSubTree'
import { GetEntitySubTree } from './GetEntitySubTree'
import { Persist } from './Persist'

export interface BindingOperations {
	// addEventListener: ...
	getEntityByKey: GetEntityByKey
	getEntityListSubTree: GetEntityListSubTree
	getEntitySubTree: GetEntitySubTree
	getAllEntities: () => Generator<EntityAccessor>
	getTreeFilters: () => TreeFilter[]

	batchDeferredUpdates: (performUpdates: (bindingOperations: BindingOperations) => void) => void
	persist: Persist
}
