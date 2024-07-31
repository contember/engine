import { FunctionComponent, ReactNode } from 'react'
import { useCurrentRequest } from './RequestContext'

export interface PageProps<P> {
	name: string
	children: FunctionComponent<P> | ReactNode
}

/**
 * Page specifies one page. It must have a `name` prop and it's child must be a function which takes page's params and returns React node to render.
 */
export const Page = <P = unknown>(props: PageProps<P>) => {
	const request = useCurrentRequest()

	if (request === null) {
		return null
	}

	return typeof props.children === 'function' ? <props.children {...request.parameters as any} /> : <>{props.children}</>
}

Page.displayName = 'Page'
Page.getPageName = (props: PageProps<unknown>): string => props.name
