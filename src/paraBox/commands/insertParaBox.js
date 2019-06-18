import Command from '@ckeditor/ckeditor5-core/src/command';

export default class InsertParaBoxCommand extends Command {
	execute() {
		this.editor.model.change( writer => {
			const paraBox = writer.createElement( 'paraBox' );
			writer.insert( writer.createElement( 'paragraph' ), paraBox );
			this.editor.model.insertContent( paraBox );
		} );
	}

	refresh() {
		const model = this.editor.model;
		const selection = model.document.selection;
		const allowedParent = model.schema.findAllowedParent( selection.getFirstPosition(), 'paraBox' );

		this.isEnabled = !!allowedParent;
	}
}
