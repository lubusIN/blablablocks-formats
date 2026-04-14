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
import { TYPOGRAPHY_CLASS_NAME } from './hooks';

/**
 * Registers the Typography format type.
 */
registerFormatType( 'blablablocks/typography', {
	title: __( 'Typography', 'blablablocks-formats' ),
	tagName: 'span',
	className: TYPOGRAPHY_CLASS_NAME,
	edit: Edit,
	attributes: {
		class: 'class',
		style: 'style',
	},
} );
