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
 * Registers the Gradient Text format type.
 */
registerFormatType('blablablocks/gradient-text', {
    title: __('Gradient Text', 'blablablocks-formats'),
    tagName: 'gradient-text',
    className: 'has-gradient-text',
    edit: Edit,
    attributes: {
        style: 'style',
    },
});
