/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	caution,
	error,
	help,
	info,
	notAllowed,
	starEmpty,
} from '@wordpress/icons';

/**
 * Placement options for the overlay.
 */
export const PLACEMENT_OPTIONS = [
	{ label: __( 'Top', 'blablablocks-formats' ), value: 'top' },
	{ label: __( 'Top-start', 'blablablocks-formats' ), value: 'top-start' },
	{ label: __( 'Top-end', 'blablablocks-formats' ), value: 'top-end' },
	{ label: __( 'Right', 'blablablocks-formats' ), value: 'right' },
	{
		label: __( 'Right-start', 'blablablocks-formats' ),
		value: 'right-start',
	},
	{ label: __( 'Right-end', 'blablablocks-formats' ), value: 'right-end' },
	{ label: __( 'Bottom', 'blablablocks-formats' ), value: 'bottom' },
	{
		label: __( 'Bottom-start', 'blablablocks-formats' ),
		value: 'bottom-start',
	},
	{ label: __( 'Bottom-end', 'blablablocks-formats' ), value: 'bottom-end' },
	{ label: __( 'Left', 'blablablocks-formats' ), value: 'left' },
	{ label: __( 'Left-start', 'blablablocks-formats' ), value: 'left-start' },
	{ label: __( 'Left-end', 'blablablocks-formats' ), value: 'left-end' },
];

/**
 * Icons for the infotip format.
 */
export const ICONS = [
	{
		label: __( 'Info', 'blablablocks-formats' ),
		graphic: info,
		id: 'info',
	},
	{
		label: __( 'Help', 'blablablocks-formats' ),
		graphic: help,
		id: 'help',
	},
	{
		label: __( 'Caution', 'blablablocks-formats' ),
		graphic: caution,
		id: 'caution',
	},
	{
		label: __( 'Error', 'blablablocks-formats' ),
		graphic: error,
		id: 'error',
	},
	{
		label: __( 'Not allowed', 'blablablocks-formats' ),
		graphic: notAllowed,
		id: 'notAllowed',
	},
	{
		label: __( 'Star', 'blablablocks-formats' ),
		graphic: starEmpty,
		id: 'starEmpty',
	},
];

/**
 * Animation options for the marker format.
 */
export const ANIMATIONS = [
	{
		label: __( 'Linear', 'blablablocks-formats' ),
		value: 'linear',
	},
	{
		label: __( 'Ease', 'blablablocks-formats' ),
		value: 'ease',
	},
	{
		label: __( 'Ease In', 'blablablocks-formats' ),
		value: 'ease-in',
	},
	{
		label: __( 'Ease Out', 'blablablocks-formats' ),
		value: 'ease-out',
	},
	{
		label: __( 'Ease In Out', 'blablablocks-formats' ),
		value: 'ease-in-out',
	},
	{
		label: __( '3 Steps', 'blablablocks-formats' ),
		value: 'steps(3, start)',
	},
	{
		label: __( '5 Steps', 'blablablocks-formats' ),
		value: 'steps(5, end)',
	},
];

/**
 * Marker presets for the marker format.
 */
export const MARKER_PRESETS = [
	{
		id: 'circle',
		label: __( 'Circle', 'blablablocks-formats' ),
	},
	{
		id: 'curly',
		label: __( 'Curly', 'blablablocks-formats' ),
	},
	{
		id: 'underline',
		label: __( 'Underline', 'blablablocks-formats' ),
	},
	{
		id: 'double',
		label: __( 'Double', 'blablablocks-formats' ),
	},
	{
		id: 'double-underline',
		label: __( 'Double Underline', 'blablablocks-formats' ),
	},
	{
		id: 'underline-zigzag',
		label: __( 'Underline Zigzag', 'blablablocks-formats' ),
	},
	{
		id: 'strikethrough',
		label: __( 'Strikethrough', 'blablablocks-formats' ),
	},
	{
		id: 'cross',
		label: __( 'Cross', 'blablablocks-formats' ),
	},
	{
		id: 'strike',
		label: __( 'Strike', 'blablablocks-formats' ),
	},
];
