/**
 * Wordpress dependencies
 */
import { applyFormat } from '@wordpress/rich-text';

/**
 * @typedef {import('@wordpress/block-editor').RichTextValue} RichTextValue
 */

/**
 * Factory for rich‑text format helpers.
 *
 * @param {Object}                       args
 * @param {RichTextValue}                args.value            - Current RichText value.
 * @param {function(RichTextValue):void} args.onChange         - Setter for RichText.
 * @param {string}                       args.formatType       - Format type slug (e.g. 'blablablocks/marker').
 * @param {Object<string, any>}          args.activeAttributes - Currently applied attributes.
 * @return {{
 * update: function(Object<string, any>): void,
 * replace: function(Object<string, any>): void,
 * remove: function(string[]): void
 * }} - An object with methods to update, replace, and remove format attributes.
 */
export function createFormatHelpers( {
	value,
	onChange,
	formatType,
	activeAttributes,
} ) {
	const update = ( newAttrs ) => {
		onChange(
			applyFormat( value, {
				type: formatType,
				attributes: { ...activeAttributes, ...newAttrs },
			} )
		);
	};

	const replace = ( newAttrs ) => {
		onChange(
			applyFormat( value, {
				type: formatType,
				attributes: newAttrs,
			} )
		);
	};

	const remove = ( keys = [] ) => {
		const pruned = { ...activeAttributes };
		keys.forEach( ( key ) => delete pruned[ key ] );
		replace( pruned );
	};

	return { update, replace, remove };
}
