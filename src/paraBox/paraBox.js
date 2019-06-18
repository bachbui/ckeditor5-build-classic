import ParaBoxEditing from './paraBoxEditing';
import InsertParaBoxButton from './ui/insertParaBoxButton';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class ParaBox extends Plugin {
	static get requires() {
		return [ ParaBoxEditing, InsertParaBoxButton ];
	}
}
