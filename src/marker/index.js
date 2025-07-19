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
 * Registers the Marker format type.
 */
registerFormatType( 'blablablocks/marker', {
	title: __( 'Marker', 'blablablocks-formats' ),
	tagName: 'tatva-marker',
	className: 'has-marker-text',
	edit: Edit,
	attributes: {
		type: 'type',
		animation: 'animation',
		'animation-duration': 'animation-duration',
		'animation-function': 'animation-function',
		color: 'color',
	},
} );
