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
	DEFAULT_ATTRIBUTES,
	VARIANT_OPTIONS,
	RADIUS_OPTIONS,
	ALIGNMENT_OPTIONS,
	SIZE_OPTIONS,
	COLOR_PRESETS,
} from './constants';
import {
	getBadgeAttributes,
	getFormatRange,
	parseBadgeClasses,
	parseBadgeStyle,
} from './utils';

export {
	FORMAT_NAME,
	FORMAT_TITLE,
	FORMAT_CLASS_NAME,
	DEFAULT_ATTRIBUTES,
	VARIANT_OPTIONS,
	RADIUS_OPTIONS,
	ALIGNMENT_OPTIONS,
	SIZE_OPTIONS,
	COLOR_PRESETS,
	getBadgeAttributes,
	getFormatRange,
	parseBadgeClasses,
	parseBadgeStyle,
};

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
		style: 'style',
	},
} );
