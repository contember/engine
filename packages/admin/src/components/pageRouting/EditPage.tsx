import {
	DataBindingProvider,
	SingleEntitySubTree,
	SingleEntitySubTreeAdditionalProps,
	SugaredQualifiedSingleEntity,
} from '@contember/binding'
import * as React from 'react'
import { FeedbackRenderer, MutableContentLayoutRendererProps, MutableSingleEntityRenderer } from '../bindingFacade'
import { PageProvider } from './PageProvider'

export interface EditPageProps extends SugaredQualifiedSingleEntity, SingleEntitySubTreeAdditionalProps {
	pageName: string
	children: React.ReactNode
	rendererProps?: Omit<MutableContentLayoutRendererProps, 'accessor'>
}

const EditPage: Partial<PageProvider<EditPageProps>> & React.ComponentType<EditPageProps> = React.memo(
	({ pageName, children, rendererProps, ...entityProps }: EditPageProps) => (
		<DataBindingProvider stateComponent={FeedbackRenderer}>
			<SingleEntitySubTree {...entityProps} entityComponent={MutableSingleEntityRenderer} entityProps={rendererProps}>
				{children}
			</SingleEntitySubTree>
		</DataBindingProvider>
	),
)

EditPage.displayName = 'EditPage'
EditPage.getPageName = (props: EditPageProps) => props.pageName

export { EditPage }
