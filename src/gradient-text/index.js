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

export const FORMAT_NAME = 'blablablocks/gradient-text';
export const FORMAT_TITLE = __( 'Gradient Text', 'blablablocks-formats' );
export const FORMAT_CLASS_NAME = 'has-gradient-text-format';

/**
 * Registers the Gradient Text format type.
 */
registerFormatType( FORMAT_NAME, {
	title: FORMAT_TITLE,
	tagName: 'span',
	className: FORMAT_CLASS_NAME,
	edit: Edit,
	attributes: {
		style: 'style',
	},
} );
