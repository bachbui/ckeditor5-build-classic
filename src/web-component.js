function getEventNameAndElement( element, definition ) {
	const [ eventName, ...selectors ] = definition.split( ' ' );
	const selector = selectors.join( ' ' );
	if ( selector === 'document' ) {
		return { eventName, element: document };
	}
	else if ( selector === 'window' ) {
		return { eventName, element: window };
	}
	else if ( selector === '' ) {
		return { eventName, element };
	}
	else {
		let querySelector;
		if ( element.shadowRoot ) {
			querySelector = element.shadowRoot.querySelector( selector ) || element.querySelector( selector );
		}
		else {
			querySelector = element.querySelector( selector );
		}
		return { eventName, element: querySelector };
	}
}
export function define( name, component ) {
	if ( !window.customElements.get( name ) ) {
		window.customElements.define( name, component );
	}
	return component;
}

/**
* The events mixin is a Backbone-flavored event management system
* that automatically sets up and tears down events on web components
* when they are connected and disconnected from a document.
*
* To use this, include the events mixin on your web component,
* and add a static property called `events` that provides a lookup
* table to the events that you'd like to attach to your component.
*
* ```js
* import events from './mixins/events';
*
* export default TextSelection extends events(HTMLElement) {
*   static events = {
*     'selectionchange document': 'selectedTextDidChange',
*     'mousedown': 'willSelectText',
*     'mouseup': 'didSelectText'
*   };
* }
* ```
*
* The selectors for `window` and `document` will select only those
* elements; all other selectors will lookup in the scope of the web
* component. This allows components to look at events like scrolling,
* resizing, and selection events without using `addEventListener` /
* `removeEventListener`.
*/
export default class Component extends HTMLElement {
	static get compiledTemplate() {
		if ( !this.compiledElement ) {
			this.compiledElement = document.createElement( 'template' );
			const scopedStyles = this.style;
			let html = this.template;
			if ( scopedStyles ) {
				html = `<style>${ scopedStyles }</style>${ html }`;
			}
			this.compiledElement.innerHTML = html;
		}
		return this.compiledElement;
	}
	constructor() {
		super();
		this.eventHandlers = {};
		const ComponentClass = this.constructor;
		const shadowRoot = this.attachShadow( { mode: 'open' } );
		shadowRoot.appendChild( ComponentClass.compiledTemplate.content.cloneNode( true ) );
	}
	connectedCallback() {
		const ComponentClass = this.constructor;
		const events = ComponentClass.events || {};
		Object.keys( events ).forEach( definition => {
			const { eventName, element } = getEventNameAndElement( this, definition );
			const method = events[ definition ];
			this.eventHandlers[ definition ] = evt => {
				if ( typeof method === 'string' ) {
					if ( this[ method ] ) {
						return this[ method ]( evt );
					}
					else {
						throw new Error( `😭 \`${ method }\` was not defined on ${ this.tagName }- did you misspell  or forget to add it?` );
					}
				}
				else {
					return method.call( this, evt );
				}
			};
			element.addEventListener( eventName, this.eventHandlers[ definition ] );
		} );
	}

	disconnectedCallback() {
		Object.keys( this.eventHandlers ).forEach( definition => {
			const { eventName, element } = getEventNameAndElement( this, definition );
			element.removeEventListener( eventName, this.eventHandlers[ definition ] );
		} );
		this.eventHandlers = {};
	}
}
