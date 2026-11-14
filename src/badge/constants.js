/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

export const FORMAT_NAME = 'blablablocks/badge';
export const FORMAT_TITLE = __( 'Badge', 'blablablocks-formats' );
export const FORMAT_CLASS_NAME = 'has-badge';

export const DEFAULT_ATTRIBUTES = {
	variant: 'subtle',
	color: '#3b82f6',
	radius: 'rounded',
	alignment: 'inline',
	size: 'medium',
};

export const VARIANT_OPTIONS = [
	{ value: 'subtle', label: __( 'Subtle', 'blablablocks-formats' ) },
	{ value: 'solid', label: __( 'Solid', 'blablablocks-formats' ) },
	{ value: 'outline', label: __( 'Outline', 'blablablocks-formats' ) },
];

export const RADIUS_OPTIONS = [
	{ value: 'rounded', label: __( 'Rounded', 'blablablocks-formats' ) },
	{ value: 'pill', label: __( 'Pill', 'blablablocks-formats' ) },
	{ value: 'square', label: __( 'Square', 'blablablocks-formats' ) },
];

export const ALIGNMENT_OPTIONS = [
	{ value: 'inline', label: __( 'Inline', 'blablablocks-formats' ) },
	{
		value: 'superscript',
		label: __( 'Superscript', 'blablablocks-formats' ),
	},
	{ value: 'subscript', label: __( 'Subscript', 'blablablocks-formats' ) },
];

export const SIZE_OPTIONS = [
	{ value: 'small', label: __( 'Small', 'blablablocks-formats' ) },
	{ value: 'medium', label: __( 'Medium', 'blablablocks-formats' ) },
	{ value: 'large', label: __( 'Large', 'blablablocks-formats' ) },
];

export const COLOR_PRESETS = [
	{
		name: __( 'Gray', 'blablablocks-formats' ),
		color: '#6b7280',
		slug: 'gray',
	},
	{
		name: __( 'Blue', 'blablablocks-formats' ),
		color: '#3b82f6',
		slug: 'blue',
	},
	{
		name: __( 'Green', 'blablablocks-formats' ),
		color: '#22c55e',
		slug: 'green',
	},
	{
		name: __( 'Orange', 'blablablocks-formats' ),
		color: '#f97316',
		slug: 'orange',
	},
	{
		name: __( 'Red', 'blablablocks-formats' ),
		color: '#ef4444',
		slug: 'red',
	},
	{
		name: __( 'Purple', 'blablablocks-formats' ),
		color: '#a855f7',
		slug: 'purple',
	},
];
