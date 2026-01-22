/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerFormatType } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import { Edit } from './edit';

/**
 * Registers the Clear All Formats button.
 * This is not a traditional format but a toolbar button to clear formats.
 */
registerFormatType('blablablocks/clear-formats', {
	title: __('Clear All Formats', 'blablablocks-formats'),
	tagName: 'mark', // Using 'mark' to avoid conflict with core formats that use 'span'
	className: null,
	edit: Edit,
});