import type { BlockSlateEditor } from './BlockSlateEditor'

export interface OverrideCanContainAnyBlocksOptions {}

export const overrideCanContainAnyBlocks = <E extends BlockSlateEditor>(
	editor: E,
	options: OverrideCanContainAnyBlocksOptions,
) => {
	const { canContainAnyBlocks } = editor
	editor.canContainAnyBlocks = element => {
		if (editor.isContemberFieldElement(element) || editor.isContemberContentPlaceholderElement(element)) {
			return false
		}
		return canContainAnyBlocks(element)
	}
}
