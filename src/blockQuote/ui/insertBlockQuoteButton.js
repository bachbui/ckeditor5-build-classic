import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class InsertBlockQuoteButton extends Plugin {
	init() {
		console.log( 'init custom blockquote ui plugin' );

		const editor = this.editor;
		editor.ui.componentFactory.add( 'blockQuote', locale => {
			const command = editor.commands.get( 'insertBlockQuote' );
			const button = new ButtonView( locale );

			button.set( {
				label: editor.t( 'Blockquote' ),
				withText: true,
				tooltip: true
			} );
			button.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );
			this.listenTo( button, 'execute', () => editor.execute( 'insertBlockQuote' ) );

			return button;
		} );
	}
}
