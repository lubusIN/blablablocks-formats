/**
 * WordPress dependencies
 */
import { useMemo, useState, useEffect, useCallback } from '@wordpress/element';
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

	const initialAttributes = useMemo( () => {
		return customAttributes.length
			? customAttributes
			: [ { key: '', value: '' } ];
	}, [ customAttributes ] );

	const [ attributes, setAttributes ] = useState( initialAttributes );

	// Resync when the active link changes
	useEffect( () => {
		setAttributes( initialAttributes );
	}, [ initialAttributes ] );

	const updateAttribute = useCallback( ( index, field, fieldValue ) => {
		setAttributes( ( prev ) => {
			const updated = [ ...prev ];
			if ( updated[ index ] ) {
				updated[ index ] = {
					...updated[ index ],
					[ field ]: fieldValue,
				};
			}
			return updated;
		} );
	}, [] );

	const addAttribute = useCallback( () => {
		setAttributes( ( prev ) => [ ...prev, { key: '', value: '' } ] );
	}, [] );

	const removeAttribute = useCallback( ( index ) => {
		setAttributes( ( prev ) => prev.filter( ( _, i ) => i !== index ) );
	}, [] );

	const getCoreLinkAttributes = useCallback( () => {
		const coreAttrs = {};
		if ( activeLink && activeLink.attributes ) {
			CORE_LINK_KEYS.forEach( ( key ) => {
				if ( activeLink.attributes[ key ] !== undefined ) {
					coreAttrs[ key ] = activeLink.attributes[ key ];
				}
			} );
		}
		return coreAttrs;
	}, [ activeLink ] );

	const applyAttributes = useCallback( () => {
		if ( ! activeLink ) {
			return;
		}

		const customAttrs = {};
		attributes.forEach( ( { key, value: attrVal } ) => {
			const trimmedKey = key.trim();
			if (
				trimmedKey &&
				! RESERVED_LINK_ATTRIBUTES.includes( trimmedKey.toLowerCase() )
			) {
				customAttrs[ trimmedKey ] = attrVal;
			}
		} );

		const coreAttrs = getCoreLinkAttributes();
		const finalAttributes = {
			...coreAttrs,
			...customAttrs,
		};

		const newValue = applyFormat( value, {
			type: 'core/link',
			attributes: finalAttributes,
		} );

		onChange( newValue );
	}, [ activeLink, attributes, getCoreLinkAttributes, onChange, value ] );

	const clearAllAttributes = useCallback( () => {
		if ( ! activeLink ) {
			return;
		}

		const coreAttrs = getCoreLinkAttributes();
		const newValue = applyFormat( value, {
			type: 'core/link',
			attributes: coreAttrs,
		} );

		setAttributes( [] );
		onChange( newValue );
	}, [ activeLink, getCoreLinkAttributes, onChange, value ] );

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
