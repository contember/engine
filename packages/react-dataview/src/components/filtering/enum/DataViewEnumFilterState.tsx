import * as React from 'react'
import { isValidElement, ReactNode } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { DataViewEnumFilterCurrent, useDataViewEnumFilter } from '../../../hooks'


export const DataViewEnumFilterState = ({ name, children, state, value }: {
	name: string
	value: string
	children: ReactNode
	state?: DataViewEnumFilterCurrent | DataViewEnumFilterCurrent[]
}) => {
	const [current] = useDataViewEnumFilter(name, value)

	if (!state || state === current || (Array.isArray(state) && state.includes(current))) {
		if (isValidElement(children)) {
			return <Slot data-current={current}>{children}</Slot>
		}
		return <>{children}</>
	}
	return null
}
