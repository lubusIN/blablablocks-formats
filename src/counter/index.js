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

export const FORMAT_NAME = 'blablablocks/number-counter';
export const FORMAT_TITLE = __( 'Counter', 'blablablocks-formats' );
export const FORMAT_CLASS_NAME = 'has-number-counter-format';

/**
 * Registers the Counter format type.
 */
registerFormatType( FORMAT_NAME, {
	title: FORMAT_TITLE,
	tagName: 'tatva-counter',
	className: FORMAT_CLASS_NAME,
	edit: Edit,
	attributes: {
		animation: 'animation',
		duration: 'duration',
		target: 'target',
		'on-scroll': 'on-scroll',
	},
} );
