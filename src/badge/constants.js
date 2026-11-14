/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

export const FORMAT_NAME = 'blablablocks/badge';
export const FORMAT_TITLE = __( 'Badge', 'blablablocks-formats' );
export const FORMAT_CLASS_NAME = 'has-badge';

export const BADGE_PRESETS = [
	{
		name: 'gray',
		label: __( 'Gray', 'blablablocks-formats' ),
	},
	{
		name: 'red',
		label: __( 'Red', 'blablablocks-formats' ),
	},
	{
		name: 'yellow',
		label: __( 'Yellow', 'blablablocks-formats' ),
	},
	{
		name: 'green',
		label: __( 'Green', 'blablablocks-formats' ),
	},
	{
		name: 'blue',
		label: __( 'Blue', 'blablablocks-formats' ),
	},
	{
		name: 'indigo',
		label: __( 'Indigo', 'blablablocks-formats' ),
	},
	{
		name: 'purple',
		label: __( 'Purple', 'blablablocks-formats' ),
	},
	{
		name: 'pink',
		label: __( 'Pink', 'blablablocks-formats' ),
	},
];
