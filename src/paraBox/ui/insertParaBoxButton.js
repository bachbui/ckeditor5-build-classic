import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class InsertParaBoxButton extends Plugin {
	init() {
		console.log( 'init custom parabox ui plugin' );

		const editor = this.editor;
		editor.ui.componentFactory.add( 'paraBox', locale => {
			const command = editor.commands.get( 'insertParaBox' );
			const button = new ButtonView( locale );

			button.set( {
				label: editor.t( 'ParaBox' ),
				withText: true,
				tooltip: true
			} );
			button.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );
			this.listenTo( button, 'execute', () => editor.execute( 'insertParaBox' ) );

			return button;
		} );
	}
}
