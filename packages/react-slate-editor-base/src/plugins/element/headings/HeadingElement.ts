import { Editor, Editor as SlateEditor, Element, Node as SlateNode, Path as SlatePath, Transforms } from 'slate'
import { ContemberEditor } from '../../../editor'
import { AlignDirection } from '../../attributes'
import { EditorElementPlugin, ElementRenderer } from '../../../types'

export const headingElementType = 'heading' as const

export interface HeadingElement extends Element {
	type: typeof headingElementType
	level: 1 | 2 | 3 | 4 | 5 | 6
	isNumbered?: boolean
	align?: AlignDirection
	children: SlateEditor['children']
}

export const isHeadingElement = (
	element: SlateNode,
	suchThat?: Partial<HeadingElement>,
): element is HeadingElement => ContemberEditor.isElementType(element, headingElementType, suchThat)

export const ejectHeadingElement = (editor: Editor, elementPath: SlatePath) => {
	ContemberEditor.ejectElement(editor, elementPath)
	Transforms.setNodes(editor, { type: editor.defaultElementType }, { at: elementPath })
}


export const headingElementPlugin = ({ render }: { render: ElementRenderer<HeadingElement> }): EditorElementPlugin<HeadingElement> => ({
	type: headingElementType,
	render,
	canContainAnyBlocks: false,
	acceptsAttributes: ({ editor, suchThat }) => {
		return 'align' in suchThat
	},
	// TODO in the following function, we need to conditionally trim the selection so that it doesn't potentially
	// 	include empty strings at the edges of top-level elements.
	toggleElement: ({ editor, suchThat }) => {
		SlateEditor.withoutNormalizing(editor, () => {
			const headings = Array.from(Editor.nodes(editor, { match: it => isHeadingElement(it, suchThat) }))
			if (headings.length) {
				for (const heading of headings) {
					ejectHeadingElement(editor, heading[1])
				}
			} else {
				Transforms.setNodes(editor, {
					...suchThat,
					children: [],
					type: headingElementType,
				})
			}
		})
	},
})
