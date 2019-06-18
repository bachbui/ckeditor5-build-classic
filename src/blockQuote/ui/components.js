
import Component from '../../web-component';

class BlockQuote extends Component {
	updatePosition( elem ) {
		const shadow = elem.shadowRoot;
		const className = `block-quote ${ elem.getAttribute( 'position' ) || '' }`.trim();
		shadow.querySelector( 'section' ).className = className;
	}

	connectedCallback() {
		super.connectedCallback();
		this.updatePosition( this );
	}

	attributeChangedCallback( name ) {
		if ( name === 'position' ) {
			this.updatePosition( this );
		}
	}
}

BlockQuote.observedAttributes = [ 'position' ];

BlockQuote.template = `
  <section class='block-quote'>
    <slot name='block-quote-body'></slot>
    <slot name='block-quote-credit'></slot>
  </section>
`;

BlockQuote.style = '';

class BlockQuoteBody extends Component {}

BlockQuoteBody.template = `
  <div class='block-quote-body' placeholder='Quote body'>
    <slot></slot>
  </div>
`;

BlockQuoteBody.style = `
  :host .block-quote-body {
    margin-left: 1em;
    border-left: 2px solid black;
    padding-left: 1em;
  }
`;

class BlockQuoteCredit extends Component {}

BlockQuoteCredit.template = `
  <div class='block-quote-credit'>
    <slot></slot>
  </div>
`;

BlockQuoteCredit.style = `
  :host .block-quote-credit {
    font-style: italic;
    text-align: right;
  }
`;

export default {
	BlockQuote,
	BlockQuoteBody,
	BlockQuoteCredit
};
