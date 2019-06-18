import BlockQuoteEditing from './blockQuoteEditing';
import BlockQuoteToolbar from './ui/blockQuoteToolbar';
import InsertBlockQuoteButton from './ui/insertBlockQuoteButton';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import './theme/blockquote.css';

export default class BlockQuote extends Plugin {
	static get requires() {
		return [ BlockQuoteEditing, InsertBlockQuoteButton, BlockQuoteToolbar ];
	}
}
