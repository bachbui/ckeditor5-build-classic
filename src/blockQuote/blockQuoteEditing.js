import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

import InsertBlockQuoteCommand from './commands/insertBlockQuote';
import UpdateBlockQuotePositionCommand from './commands/updateBlockQuotePosition';
import Components from './ui/components';
import { define } from '../web-component';

export default class BlockQuoteEditing extends Plugin {
	static get requires() {
		return [ Widget ];
	}

	init() {
		console.log( 'init custom blockquote editing plugin' );

		this._defineSchema();
		this._defineConverters();

		define( 'block-quote', Components.BlockQuote );
		define( 'block-quote-body', Components.BlockQuoteBody );
		define( 'block-quote-credit', Components.BlockQuoteCredit );

		this.editor.commands.add( 'insertBlockQuote', new InsertBlockQuoteCommand( this.editor ) );
		this.editor.commands.add( 'blockQuotePosition', new UpdateBlockQuotePositionCommand( this.editor ) );
	}

	_defineSchema() {
		const schema = this.editor.model.schema;

		schema.register( 'blockQuote', {
			isObject: true,
			allowWhere: '$block',
			allowAttributes: [ 'position' ]
		} );

		schema.register( 'blockQuoteBody', {
			isLimit: true,
			allowIn: 'blockQuote',
			allowContentOf: '$root'
		} );

		schema.register( 'blockQuoteCredit', {
			isLimit: true,
			allowIn: 'blockQuote',
			allowContentOf: '$root'
		} );

		schema.addChildCheck( ( context, childDefinition ) => {
			if ( context.endsWith( 'blockQuote' ) && childDefinition.name == 'blockQuote' ) {
				return false;
			}
		} );
	}

	_defineConverters() {
		const conversion = this.editor.conversion;

		conversion.for( 'upcast' ).elementToElement( {
			model: ( viewElement, modelWriter ) => {
				const blockQuote = modelWriter.createElement( 'blockQuote' );

				if ( !Array.from( viewElement.getChildren() ).find( element => element.name === 'block-quote-credit' ) ) {
					const blockQuoteCredit = modelWriter.createElement( 'blockQuoteCredit' );
					modelWriter.insert( modelWriter.createElement( 'paragraph' ), blockQuoteCredit );
					modelWriter.append( blockQuoteCredit, blockQuote );
				}

				return blockQuote;
			},
			view: {
				name: 'block-quote'
			}
		} ).attributeToAttribute( {
			model: 'position',
			view: {
				name: 'block-quote',
				key: 'position'
			}
		} );

		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'blockQuote',
			view: ( model, viewWriter ) => {
				return viewWriter.createContainerElement( 'block-quote' );
			}
		} ).attributeToAttribute( {
			model: 'position',
			view: 'position'
		} );

		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'blockQuote',
			view: ( _, viewWriter ) => {
				const component = viewWriter.createContainerElement( 'block-quote' );
				return toWidget( component, viewWriter );
			}
		} ).attributeToAttribute( {
			model: 'position',
			view: 'position',
			converterPriority: 'low'
		} );

		conversion.for( 'upcast' ).elementToElement( {
			model: 'blockQuoteBody',
			view: {
				name: 'block-quote-body'
			}
		} );

		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'blockQuoteBody',
			view: {
				name: 'block-quote-body'
			}
		} );

		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'blockQuoteBody',
			view: ( modelElement, viewWriter ) => {
				const body = viewWriter.createEditableElement(
					'block-quote-body',
					{
						slot: 'block-quote-body'
					}
				);

				return toWidgetEditable( body, viewWriter );
			}
		} );

		conversion.for( 'upcast' ).elementToElement( {
			model: 'blockQuoteCredit',
			view: {
				name: 'block-quote-credit'
			}
		} );

		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'blockQuoteCredit',
			view: {
				name: 'block-quote-credit'
			}
		} );

		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'blockQuoteCredit',
			view: ( modelElement, viewWriter ) => {
				const credit = viewWriter.createEditableElement(
					'block-quote-credit',
					{
						slot: 'block-quote-credit'
					}
				);

				return toWidgetEditable( credit, viewWriter );
			}
		} );
	}
}
