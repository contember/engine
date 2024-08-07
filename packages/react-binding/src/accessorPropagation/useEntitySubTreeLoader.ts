import { createElement, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { SugaredQualifiedSingleEntity, TreeRootId } from '@contember/binding'
import { useExtendTree } from './useExtendTree'
import { EntitySubTree } from '../coreComponents'

export type UseEntitySubTreeLoaderStateInitial = {
	state: 'initial'
	entity: undefined
	treeRootId: undefined
	customState: undefined
	isLoading: false
}

export type UseEntitySubTreeLoaderStateLoading = {
	state: 'loading'
	entity: undefined
	treeRootId: undefined
	customState: undefined
	isLoading: true
}

export type UseEntitySubTreeLoaderStateRefreshing<State> = {
	state: 'refreshing'
	entity: SugaredQualifiedSingleEntity
	treeRootId: TreeRootId | undefined
	customState: State
	isLoading: true
}


export type UseEntitySubTreeLoaderStateLoaded<State> = {
	state: 'loaded'
	entity: SugaredQualifiedSingleEntity
	treeRootId: TreeRootId | undefined
	customState: State
	isLoading: false
}


export type UseEntitySubTreeLoaderState<State> =
	| UseEntitySubTreeLoaderStateInitial
	| UseEntitySubTreeLoaderStateLoading
	| UseEntitySubTreeLoaderStateRefreshing<State>
	| UseEntitySubTreeLoaderStateLoaded<State>

export type EntityListSubTreeLoaderState = UseEntitySubTreeLoaderState<any>['state']

export type UseEntitySubTreeLoaderStateMethods = {
	reload: () => void
}

export const useEntitySubTreeLoader = <State>(entity: SugaredQualifiedSingleEntity | undefined, children: ReactNode, state?: State): [UseEntitySubTreeLoaderState<State>, UseEntitySubTreeLoaderStateMethods] => {
	const [displayedState, setDisplayedState] = useState<UseEntitySubTreeLoaderState<State>>({
		state: 'initial',
		isLoading: false,
		entity: undefined,
		treeRootId: undefined,
		customState: undefined,
	})
	const currentlyLoading = useRef<{
		entity: SugaredQualifiedSingleEntity
		state?: State
	}>()

	const extendTree = useExtendTree()
	const [reloadTrigger, setReloadTrigger] = useState<object | null>(null)

	useEffect(() => {
		(async () => {
			if (!entity) {
				return
			}

			currentlyLoading.current = {
				entity,
				state,
			}

			setDisplayedState(it => {
				if (it.state === 'initial' || it.state === 'loading') {
					return {
						...it,
						isLoading: true,
						state: 'loading',
					}
				} else {
					return {
						...it,
						isLoading: true,
						state: 'refreshing',
					}
				}
			})

			const newTreeRootId = await extendTree(
				createElement(EntitySubTree, {
					...entity,
					children,
				}),
				{ force: reloadTrigger !== null },
			)
			if (currentlyLoading.current?.entity !== entity || currentlyLoading.current?.state !== state) {
				return
			}
			currentlyLoading.current = undefined
			if (newTreeRootId) {
				setDisplayedState({
					entity: entity,
					treeRootId: newTreeRootId,
					state: 'loaded',
					customState: state as State,
					isLoading: false,
				})
			}
		})()
	}, [extendTree, entity, children, state, reloadTrigger])

	return [displayedState, {
		reload: useCallback(() => setReloadTrigger({}), []),
	}]
}
