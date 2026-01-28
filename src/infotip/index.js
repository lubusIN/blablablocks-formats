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
 * Registers the Infotip format type.
 */
registerFormatType('blablablocks/infotip', {
	title: __('Infotip', 'blablablocks-formats'),
	tagName: 'tatva-infotip',
	className: 'has-infotip-format',
	edit: Edit,
	attributes: {
		content: 'content',
		"underline": 'underline',
		'icon-enabled': 'icon-enabled',
		'icon-position': 'icon-position',
		'icon-color': 'icon-color',
		'icon-type': 'icon-type',
		offset: 'offset',
		'overlay-placement': 'overlay-placement',
		'overlay-text-color': 'overlay-text-color',
		'overlay-background-color': 'overlay-background-color',
	},
});
