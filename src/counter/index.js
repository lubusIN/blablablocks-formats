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
registerFormatType('blablablocks/number-counter', {
    title: __('Counter', 'blablablocks-formats'),
    tagName: 'number-counter',
    className: 'has-number-counter',
    edit: Edit,
    attributes: {
        'data-anim': 'data-anim',
        'data-duration': 'data-duration',
        'data-count-to': 'data-count-to',
        'data-on-scroll': 'data-on-scroll',
    }
});
