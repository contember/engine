import { Editor as SlateEditor, Editor, Text as SlateText } from 'slate'
import { TextSpecifics } from '../../types/editor'

export const removeMarks = <T extends SlateText, E extends SlateEditor>(editor: E, marks: TextSpecifics<T>) => {
	Editor.withoutNormalizing(editor, () => {
		for (const mark in marks) {
			Editor.removeMark(editor, mark)
		}
	})
}
