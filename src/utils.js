/**
 * Wordpress dependencies
 */
import { applyFormat } from '@wordpress/rich-text';

/**
 * Factory for rich-text format helpers.
 *
 * @param {Object}   args
 * @param {WPBlockEdit.RichTextValue} args.value - current RichText value
 * @param {Function} args.onChange         - setter for RichText
 * @param {string}   args.formatType       - format type slug (e.g. 'blablablocks/marker')
 * @param {Object}   args.activeAttributes - currently applied attributes
 * @returns {{
 *   update: (newAttrs: Object) => void,
 *   replace: (newAttrs: Object) => void,
 *   remove: (keys: string[]) => void,
 * }}
 */
export function createFormatHelpers({ value, onChange, formatType, activeAttributes }) {
    const update = (newAttrs) => {
        onChange(
            applyFormat(value, {
                type: formatType,
                attributes: { ...activeAttributes, ...newAttrs },
            })
        );
    };

    const replace = (newAttrs) => {
        onChange(
            applyFormat(value, {
                type: formatType,
                attributes: newAttrs,
            })
        );
    };

    const remove = (keys = []) => {
        const pruned = { ...activeAttributes };
        keys.forEach((key) => delete pruned[key]);
        replace(pruned);
    };

    return { update, replace, remove };
}
