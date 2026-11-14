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
import {
	FORMAT_NAME,
	FORMAT_TITLE,
	FORMAT_CLASS_NAME,
	RATINGS,
} from './constants';
import { getFormatRange } from './utils';

export {
	FORMAT_NAME,
	FORMAT_TITLE,
	FORMAT_CLASS_NAME,
	RATINGS,
	getFormatRange,
};

/**
 * Registers the Rating format type.
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
