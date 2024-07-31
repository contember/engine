import { Editor, Element as SlateElement, Location, Node as SlateNode, NodeEntry, Path as SlatePath, Point, Range as SlateRange, Transforms } from 'slate'
import { ContemberEditor } from '@contember/react-slate-editor-base'
import { isElementWithReference } from '../elements'

export const prepareElementForInsertion = (editor: Editor, isReference: boolean) => {
	const selection = editor.selection

	let targetLocation: Location

	if (selection) {
		targetLocation = selection
	} else if (editor.children.length) {
		targetLocation = Editor.end(editor, [])
	} else {
		targetLocation = { path: [], offset: 0 }
	}

	if (SlateRange.isRange(targetLocation)) {
		if (SlateRange.isExpanded(targetLocation)) {
			const [, end] = SlateRange.edges(targetLocation)
			const pointRef = Editor.pointRef(editor, end)
			Transforms.delete(editor, { at: targetLocation })
			targetLocation = pointRef.unref()!
		} else {
			targetLocation = targetLocation.focus
		}
	}

	const targetPoint = targetLocation

	// TODO maybe introduce some sort of a systemic handling for top-level-only elements like this.
	if (!isReference) {
		if (targetPoint.offset === 0) {
			return targetPoint.path
		}
		Transforms.splitNodes(editor, {
			at: targetPoint,
		})
		return SlatePath.next(targetPoint.path)
	}

	const [closestBlockElement, closestBlockPath] = ContemberEditor.closestBlockEntry(editor, {
		at: targetPoint,
	})! as NodeEntry<SlateElement>

	if (editor.canContainAnyBlocks(closestBlockElement)) {
		return targetPoint.path
	}

	if (isElementWithReference(closestBlockElement)) {
		const newPath = SlatePath.next(closestBlockPath)
		Promise.resolve().then(() => {
			return Transforms.select(editor, newPath)
		}).catch(() => {})
		return newPath
	}

	if (SlateNode.string(closestBlockElement) === '') {
		// The current element is empty and we also cannot insert inside it, and so we remove it
		// and insert the new one in its place.
		Transforms.removeNodes(editor, {
			at: closestBlockPath,
		})
		return closestBlockPath
	}

	const [start, end] = Editor.edges(editor, closestBlockPath)

	if (Point.equals(start, targetPoint)) {
		// We're at the beginning of a block so we insert above it
		return closestBlockPath
	} else if (Point.equals(end, targetPoint)) {
		// We're at the end of a block so we insert underneath it.
		return SlatePath.next(closestBlockPath)
	} else {
		// We're in the middle so we split it and then insert between the two resulting chunks.
		Transforms.splitNodes(editor, {
			at: targetPoint,
		})
		// We get the parent because targetPoint original pointed at a point and so we want to get rid of the text path.
		// TODO this likely breaks for inline inserts.
		return SlatePath.next(SlatePath.parent(targetPoint.path))
	}
}
