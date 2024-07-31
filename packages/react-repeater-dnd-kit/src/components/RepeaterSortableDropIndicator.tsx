import React, { ReactNode } from 'react'
import { useRepeaterSortableItem } from '../contexts'

export const RepeaterSortableDropIndicator = ({ children, position }: {
	children: ReactNode
	position: 'before' | 'after'
}) => {
	const sortable = useRepeaterSortableItem()
	const isOver = sortable.isOver
	const activeSortable = sortable.active?.data.current?.sortable
	const isAfter = (sortable.data?.sortable.index ?? 0) > activeSortable?.index
	const renderedPosition = isAfter ? 'after' : 'before'

	return renderedPosition === position && isOver ? <>{children}</> : null
}
