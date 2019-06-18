
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import WidgetToolbarRepository from '@ckeditor/ckeditor5-widget/src/widgettoolbarrepository';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import fullWidthIcon from '@ckeditor/ckeditor5-core/theme/icons/object-full-width.svg';
import leftIcon from '@ckeditor/ckeditor5-core/theme/icons/object-left.svg';
import rightIcon from '@ckeditor/ckeditor5-core/theme/icons/object-right.svg';

import { getBlockQuoteElementFromSelection } from '../utils';

const DEFAULT_POSITIONS = {
	'inset-left': {
		name: 'inset-left',
		title: 'Positioned inset left',
		icon: leftIcon
	},
	'full-width': {
		name: 'full-width',
		title: 'Positioned full width',
		icon: fullWidthIcon
	},
	'inset-right': {
		name: 'inset-right',
		title: 'Positioned inset right',
		icon: rightIcon
	}
};

export default class BlockQuoteToolbar extends Plugin {
	static get requires() {
		return [ WidgetToolbarRepository ];
	}

	static get pluginName() {
		return 'BlockQuoteToolbar';
	}

	_getPositionOption( position ) {
		if ( typeof position === 'string' ) {
			return DEFAULT_POSITIONS[ position ] || {};
		}

		return position;
	}

	init() {
		const editor = this.editor;
		const positions = editor.config.get( 'blockQuote.positions' );
		positions.map( this._getPositionOption ).forEach( position => {
			editor.ui.componentFactory.add( `blockQuotePosition:${ position.name }`, locale => {
				const command = editor.commands.get( 'blockQuotePosition' );
				const view = new ButtonView( locale );

				view.set( {
					label: position.title,
					icon: position.icon,
					tooltip: true
				} );

				view.bind( 'isEnabled' ).to( command, 'isEnabled' );
				view.bind( 'isOn' ).to( command, 'value', value => value === position.name );

				this.listenTo( view, 'execute', () => editor.execute( 'blockQuotePosition', { value: position.name } ) );
				return view;
			} );
		} );
	}

	afterInit() {
		const editor = this.editor;
		const widgetToolbarRepository = editor.plugins.get( WidgetToolbarRepository );

		widgetToolbarRepository.register( 'blockQuote', {
			items: ( editor.config.get( 'blockQuote.positions' ) || [] ).map( position => `blockQuotePosition:${ position }` ),
			getRelatedElement: getBlockQuoteElementFromSelection
		} );
	}
}
