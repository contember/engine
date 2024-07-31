import type { EntityListPreferences, UnsugarableEntityListPreferences } from './EntityListPreferences'
import type { Filter, Limit, Offset, OrderBy, SugaredFilter, SugaredOrderBy } from './primitives'

export interface EntityListParameters extends EntityListPreferences {
	orderBy: OrderBy | undefined
	offset: Offset | undefined
	limit: Limit | undefined
	filter: Filter | undefined
}

export interface SugarableEntityListParameters {
	filter?: SugaredFilter
}

export interface UnsugarableEntityListParameters extends UnsugarableEntityListPreferences {
	orderBy?: SugaredOrderBy
	offset?: Offset
	limit?: Limit
}
