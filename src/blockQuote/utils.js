export function getBlockQuoteModelFromSelection( selection ) {
	const blocks = Array.from( selection.getSelectedBlocks() );

	if ( blocks.length === 1 ) {
		let model = blocks[ 0 ];
		while ( model != null && model.name !== 'blockQuote' ) {
			model = model.parent;
		}

		return model;
	}

	return null;
}

export function getBlockQuoteElementFromSelection( selection ) {
	let element = selection.editableElement;
	while ( element !== null && element.name !== 'block-quote' ) {
		element = element.parent;
	}

	return element;
}
