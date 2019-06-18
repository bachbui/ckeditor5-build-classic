import Command from '@ckeditor/ckeditor5-core/src/command';

function createBlockQuote( writer ) {
	const blockQuote = writer.createElement( 'blockQuote' );
	const blockQuoteBody = writer.createElement( 'blockQuoteBody' );
	const blockQuoteCredit = writer.createElement( 'blockQuoteCredit' );

	writer.insert( writer.createElement( 'paragraph' ), blockQuoteBody );
	writer.insert( writer.createElement( 'paragraph' ), blockQuoteCredit );

	writer.append( blockQuoteBody, blockQuote );
	writer.append( blockQuoteCredit, blockQuote );
	return blockQuote;
}

export default class InsertBlockQuoteCommand extends Command {
	execute() {
		this.editor.model.change( writer => {
			this.editor.model.insertContent( createBlockQuote( writer ) );
		} );
	}

	refresh() {
		const model = this.editor.model;
		const selection = model.document.selection;
		const allowedParent = model.schema.findAllowedParent( selection.getFirstPosition(), 'blockQuote' );

		this.isEnabled = !!allowedParent;
	}
}
