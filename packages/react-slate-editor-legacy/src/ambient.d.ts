interface Document {
	caretPositionFromPoint?: (x: number, y: number) => {
		offsetNode: Node
		offset: number
		getClientRect(): DOMRect
	}
}
