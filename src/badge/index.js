/**
 * WordPress dependencies
 */
import { registerFormatType } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import './editor.scss';
import './style.scss';
import { Edit } from './edit';
import { FORMAT_NAME, FORMAT_TITLE, FORMAT_CLASS_NAME } from './constants';

export {
	FORMAT_NAME,
	FORMAT_TITLE,
	FORMAT_CLASS_NAME,
	BADGE_PRESETS,
} from './constants';

/**
 * Registers the Badge format type.
 */
registerFormatType( FORMAT_NAME, {
	title: FORMAT_TITLE,
	tagName: 'span',
	className: FORMAT_CLASS_NAME,
	edit: Edit,
	attributes: {
		class: 'class',
	},
} );
