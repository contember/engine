import * as React from 'react'
import { ComponentType, ReactElement } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { useDataViewTextFilterInput } from '../../../hooks'
import { useDataViewFilterName } from '../../../contexts'

const SlotInput = Slot as ComponentType<React.InputHTMLAttributes<HTMLInputElement>>

export const DataViewTextFilterInput = ({ name, debounceMs, ...props }: {
	name?: string
	debounceMs?: number
	children: ReactElement
}) => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	name ??= useDataViewFilterName()
	return <SlotInput {...useDataViewTextFilterInput({ name, debounceMs })} {...props} />
}
