import { createNonNullableContextFactory } from '@contember/react-utils'
import { createContext, useContext } from 'react'
import { RegistryContextType } from './types'

export const StateContext = createContext<Record<string, unknown>>({})
StateContext.displayName = 'Interface.Directives.StateContext'

export const [RegistryContext, useRegistryContext] = createNonNullableContextFactory<RegistryContextType<Record<string, unknown>>>('Interface.Directives.RegistryContext', {
	register: undefined,
	unregister: undefined,
	update: undefined,
})

export function useDirectives<T extends Record<string, unknown>>() {
	return useContext(StateContext) as T
}
