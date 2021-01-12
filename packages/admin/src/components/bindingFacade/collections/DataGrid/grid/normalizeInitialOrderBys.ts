import { DataGridColumns, DataGridOrderBys } from '../base'

export const normalizeInitialOrderBys = (columns: DataGridColumns): DataGridOrderBys => {
	const orderBys: DataGridOrderBys = new Map()

	for (const [i, value] of columns) {
		if (value.enableOrdering) {
			orderBys.set(i, value.initialOrder)
		}
	}

	return orderBys
}
