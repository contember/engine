import { Editor } from 'slate'
import { ScrollTargetElement, scrollTargetElementPlugin } from './ScrollTargetElement'
import { ElementRenderer } from '../../../types'

export const withScrollTargets = ({ render }: { render: ElementRenderer<ScrollTargetElement> }) => <E extends Editor>(editor: E): E => {
	editor.registerElement(scrollTargetElementPlugin({ render }))
	return editor
}
