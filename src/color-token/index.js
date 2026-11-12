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

export const FORMAT_NAME = 'blablablocks/color-token';
export const FORMAT_TITLE = __( 'Color Token', 'blablablocks-formats' );
export const FORMAT_CLASS_NAME = 'has-color-token-format';

/**
 * Registers the Color Token format type.
 */
registerFormatType( FORMAT_NAME, {
	title: FORMAT_TITLE,
	tagName: 'span',
	className: FORMAT_CLASS_NAME,
	edit: Edit,
	attributes: {
		style: 'style',
		color: 'data-color',
		border: 'data-border',
		theme: 'data-theme',
	},
} );
