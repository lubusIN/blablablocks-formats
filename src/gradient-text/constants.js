/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Gradient animation types.
 */
export const GRADIENT_ANIMATION_TYPES = [
	{
		label: __( 'Flow', 'blablablocks-formats' ),
		value: 'flow',
	},
	{
		label: __( 'Sweep', 'blablablocks-formats' ),
		value: 'sweep',
	},
	{
		label: __( 'Pulse', 'blablablocks-formats' ),
		value: 'pulse',
	},
	{
		label: __( 'Rainbow', 'blablablocks-formats' ),
		value: 'rainbow',
	},
	{
		label: __( 'Shimmer', 'blablablocks-formats' ),
		value: 'shimmer',
	},
	{
		label: __( 'Orbit', 'blablablocks-formats' ),
		value: 'orbit',
	},
	{
		label: __( 'Neon', 'blablablocks-formats' ),
		value: 'neon',
	},
	{
		label: __( 'Glitch', 'blablablocks-formats' ),
		value: 'glitch',
	},
];

/**
 * Default animation values.
 */
export const DEFAULT_ANIMATION = {
	speed: '4',
	type: 'flow',
};
