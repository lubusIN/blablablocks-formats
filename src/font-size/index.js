/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerFormatType } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import './editor.scss';
import './style.scss';
import { Edit } from './edit';

/**
 * Registers the FontSize format type.
 */
registerFormatType('blablablocks/font-size', {
	title: __('Font Size', 'blablablocks-formats'),
	tagName: 'span',
	className: 'has-font-size-format',
	edit: Edit,
	attributes: {
		class: 'class',
		style: 'style',
	},
});
