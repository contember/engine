import { Editor as SlateEditor, Element, Element as SlateElement, Node, Transforms } from 'slate'
import { ContemberEditor } from '../../../editor'
import { tableRowElementType } from './TableRowElement'
import { EditorElementPlugin, ElementRenderer } from '../../../types'

export const tableCellElementType = 'tableCell' as const

export interface TableCellElement extends SlateElement {
	type: typeof tableCellElementType
	children: SlateEditor['children']
	headerScope?: 'row'
	justify?: 'start' | 'center' | 'end'
}

export const isTableCellElement = (element: Node): element is TableCellElement => Element.isElement(element) && element.type === tableCellElementType

export const createEmptyTableCellElement = () => ({
	type: tableCellElementType,
	children: [{ text: '' }],
})


export const tableCellElementPlugin = ({ render }: {render: ElementRenderer<TableCellElement>}): EditorElementPlugin<TableCellElement> => ({
	type: tableCellElementType,
	render,
	normalizeNode: ({ element, editor, path, preventDefault }) => {
		if (element.children.length === 1) {
			const onlyChild = element.children[0]
			if (SlateElement.isElement(onlyChild) && editor.isDefaultElement(onlyChild)) {
				Transforms.unwrapNodes(editor, {
					at: [...path, 0],
				})
			}
		}
		if (!ContemberEditor.hasParentOfType(editor, [element, path], tableRowElementType)) {
			Transforms.unwrapNodes(editor, { at: path })
			return preventDefault()
		}
		if (path[path.length - 1] > 0 && element.headerScope) {
			Transforms.setNodes(editor, { headerScope: null }, { at: path })
			return preventDefault()
		}
	},
	canContainAnyBlocks: true,
})
