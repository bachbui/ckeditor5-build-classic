import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

import InsertParaBoxCommand from './commands/insertParaBox';
import Components from './ui/components';
import { define } from '../web-component';

export default class ParaBoxEditing extends Plugin {
	static get requires() {
		return [ Widget ];
	}

	init() {
		console.log( 'init Parallax Box editing plugin' );

		this._defineSchema();
		this._defineConverters();
		define( 'para-box', Components.ParaBox );
		this.editor.commands.add( 'insertParaBox', new InsertParaBoxCommand( this.editor ) );
	}

	_defineSchema() {
		const schema = this.editor.model.schema;

		schema.register( 'paraBox', {
			isObject: true,
			allowWhere: '$block',
			allowContentOf: '$root'
		} );

		schema.addChildCheck( ( context, childDefinition ) => {
			if ( context.endsWith( 'paraBoxBody' ) && childDefinition.name == 'paraBox' ) {
				return false;
			}
		} );
	}

	_defineConverters() {
		const conversion = this.editor.conversion;

		conversion.for( 'upcast' ).elementToElement( {
			model: 'paraBox',
			view: {
				name: 'para-box'
			}
		} );

		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'paraBox',
			view: {
				name: 'para-box'
			}
		} );

		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'paraBox',
			view: ( _, viewWriter ) => {
				const component = viewWriter.createEditableElement( 'para-box' );
				return toWidgetEditable( toWidget( component, viewWriter ), viewWriter );
			}
		} );
	}
}
