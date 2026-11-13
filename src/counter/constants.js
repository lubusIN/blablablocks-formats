/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Default format attributes.
 */
export const DEFAULT_ATTRIBUTES = {
	animation: 'odometer',
	duration: '1200',
	'on-scroll': 'true',
};

/**
 * Animation options for ToggleGroupControl.
 */
export const ANIMATION_OPTIONS = [
	{ value: 'odometer', label: __( 'Odometer', 'blablablocks-formats' ) },
	{ value: 'linear', label: __( 'Linear', 'blablablocks-formats' ) },
	{ value: 'steps', label: __( 'Steps', 'blablablocks-formats' ) },
	{ value: 'scramble', label: __( 'Scramble', 'blablablocks-formats' ) },
];
