import Command from '@ckeditor/ckeditor5-core/src/command';
import { getBlockQuoteModelFromSelection } from '../utils';

export default class UpdateBlockquotePositionCommand extends Command {
	refresh() {
		const model = this.editor.model;
		const blockQuote = getBlockQuoteModelFromSelection( model.document.selection );

		this.isEnabled = !!blockQuote;
		this.value = blockQuote && blockQuote.getAttribute( 'position' );
	}

	execute( options ) {
		const position = options.value;

		const model = this.editor.model;
		const blockQuote = getBlockQuoteModelFromSelection( model.document.selection );

		model.change( writer => {
			if ( !position ) {
				writer.removeAttribute( 'position', blockQuote );
			} else {
				writer.setAttribute( 'position', position, blockQuote );
			}
		} );
	}
}
