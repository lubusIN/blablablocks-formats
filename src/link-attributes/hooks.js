/**
 * WordPress dependencies
 */
import { useMemo, useState, useEffect } from '@wordpress/element';
import { applyFormat, getActiveFormat } from '@wordpress/rich-text';

/**
 * Standard / reserved core link attributes that should not be treated as custom attributes.
 */
export const RESERVED_LINK_ATTRIBUTES = [
	'href',
	'url',
	'type',
	'id',
	'target',
	'rel',
	'class',
	'className',
	'aria-label',
];

/**
 * Core link attributes that need to be preserved when updating a link format.
 */
const CORE_LINK_KEYS = [ 'url', 'type', 'id', 'target', 'rel', 'class' ];

/**
 * Preserves registered core link attributes from an active link format.
 *
 * @param {Object|null} activeLink - The active core/link format object.
 * @return {Object} Clean object containing only core link attributes.
 */
function getCoreLinkAttributes( activeLink ) {
	const core = {};
	if ( activeLink?.attributes ) {
		for ( const key of CORE_LINK_KEYS ) {
			if ( activeLink.attributes[ key ] !== undefined ) {
				core[ key ] = activeLink.attributes[ key ];
			}
		}
	}
	return core;
}

/**
 * Extracts custom attributes from an active link format.
 *
 * @param {Object|null} activeLink - The active core/link format object.
 * @return {Array<{key: string, value: string}>} Array of custom attribute key-value pairs.
 */
export function getCustomLinkAttributes( activeLink ) {
	if ( ! activeLink ) {
		return [];
	}

	const allAttrs = {
		...( activeLink.unregisteredAttributes || {} ),
		...( activeLink.attributes || {} ),
	};

	return Object.entries( allAttrs )
		.filter(
			( [ key ] ) =>
				! RESERVED_LINK_ATTRIBUTES.includes( key.toLowerCase() )
		)
		.map( ( [ key, val ] ) => ( {
			key,
			value: val !== undefined && val !== null ? String( val ) : '',
		} ) );
}

/**
 * Hook to manage custom attributes for an active link format.
 *
 * @param {Object}   options          - Hook options.
 * @param {Object}   options.value    - Current RichText value.
 * @param {Function} options.onChange - RichText change callback.
 * @return {Object} Attribute state and control functions.
 */
export function useLinkAttributes( { value, onChange } ) {
	const activeLink = getActiveFormat( value, 'core/link' );

	const customAttributes = useMemo(
		() => getCustomLinkAttributes( activeLink ),
		[ activeLink ]
	);

	const [ attributes, setAttributes ] = useState( () =>
		customAttributes.length ? customAttributes : [ { key: '', value: '' } ]
	);

	// Resync when the active link changes
	useEffect( () => {
		setAttributes(
			customAttributes.length
				? customAttributes
				: [ { key: '', value: '' } ]
		);
	}, [ customAttributes ] );

	const addAttribute = () =>
		setAttributes( ( prev ) => [ ...prev, { key: '', value: '' } ] );

	const removeAttribute = ( index ) =>
		setAttributes( ( prev ) => prev.filter( ( _, i ) => i !== index ) );

	const updateAttribute = ( index, field, val ) =>
		setAttributes( ( prev ) =>
			prev.map( ( attr, i ) =>
				i === index ? { ...attr, [ field ]: val } : attr
			)
		);

	const applyAttributes = () => {
		if ( ! activeLink ) {
			return;
		}

		const customAttrs = {};
		for ( const { key, value: val } of attributes ) {
			const trimmed = key.trim();
			if (
				trimmed &&
				! RESERVED_LINK_ATTRIBUTES.includes( trimmed.toLowerCase() )
			) {
				customAttrs[ trimmed ] = val;
			}
		}

		onChange(
			applyFormat( value, {
				type: 'core/link',
				attributes: {
					...getCoreLinkAttributes( activeLink ),
					...customAttrs,
				},
			} )
		);
	};

	const clearAllAttributes = () => {
		if ( ! activeLink ) {
			return;
		}

		setAttributes( [ { key: '', value: '' } ] );
		onChange(
			applyFormat( value, {
				type: 'core/link',
				attributes: getCoreLinkAttributes( activeLink ),
			} )
		);
	};

	return {
		attributes,
		hasCustomAttributes: customAttributes.length > 0,
		addAttribute,
		updateAttribute,
		removeAttribute,
		applyAttributes,
		clearAllAttributes,
	};
}
