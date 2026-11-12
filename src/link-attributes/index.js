/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerFormatType } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import './editor.scss';
import { Edit } from './edit';

export const FORMAT_NAME = 'blablablocks/link-attributes';
export const FORMAT_TITLE = __( 'Link Attributes', 'blablablocks-formats' );
export const FORMAT_CLASS_NAME = 'has-link-attributes';

/**
 * Registers the Link Attributes format type.
 * Acts as an enhancer for `core/link` rich-text format.
 */
registerFormatType( FORMAT_NAME, {
	title: FORMAT_TITLE,
	tagName: 'a',
	className: FORMAT_CLASS_NAME,
	edit: Edit,
} );
