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
 * Registers the Text Animation format type.
 */
registerFormatType( 'blablablocks/text-animation', {
	title: __( 'Text Animation', 'blablablocks-formats' ),
	tagName: 'tatva-text-animation',
	className: 'has-text-animation-format',
	edit: Edit,
	attributes: {
		type: 'type',
		words: 'words',
		speed: 'speed',
		repeat: 'repeat',
	},
} );
