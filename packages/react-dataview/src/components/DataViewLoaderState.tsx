import React, { ReactNode } from 'react'
import { useDataViewLoaderState } from '../contexts'

export interface DataViewEachRowProps {
	children: ReactNode
	loaded?: boolean
	refreshing?: boolean
	initial?: boolean
}

export const DataViewLoaderState = ({ children, ...props }: DataViewEachRowProps) => {
	const state = useDataViewLoaderState()
	return props[state] ? <>{children}</> : null
}
