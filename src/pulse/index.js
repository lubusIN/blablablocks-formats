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
 * Registers the Pulse format type.
 */
registerFormatType( 'blablablocks/pulse', {
	title: __( 'Pulse', 'blablablocks-formats' ),
	tagName: 'tatva-pulse',
	className: 'has-pulse-format',
	edit: Edit,
	attributes: {
		position: 'position',
		color: 'color',
		size: 'size',
		gap: 'gap',
		'animation-duration': 'animation-duration',
		'superscript-offset': 'superscript-offset',
	},
} );
