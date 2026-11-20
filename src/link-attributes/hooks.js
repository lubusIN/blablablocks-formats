/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
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
	'classname',
	'className',
	'aria-label',
	'data-id',
	'data-type',
];

const LOWERCASE_RESERVED = RESERVED_LINK_ATTRIBUTES.map( ( attr ) =>
	attr.toLowerCase()
);

/**
 * Returns a localized error string if attribute name is invalid, or null if valid.
 *
 * @param {string} name Attribute name to inspect.
 * @return {string|null} Localized error message or null.
 */
export function getAttributeNameError( name ) {
	if ( typeof name !== 'string' ) {
		return __( 'Attribute name must be a string.', 'blablablocks-formats' );
	}

	const trimmed = name.trim();
	if ( ! trimmed ) {
		return null;
	}

	// Reject event handlers (e.g. onclick, onload, onmouseover)
	if ( /^on/i.test( trimmed ) ) {
		return __(
			'Event handler attributes (starting with "on") are not allowed.',
			'blablablocks-formats'
		);
	}

	// Reject reserved core link attributes
	if ( LOWERCASE_RESERVED.includes( trimmed.toLowerCase() ) ) {
		return __(
			'This is a reserved link attribute and cannot be used as a custom attribute.',
			'blablablocks-formats'
		);
	}

	// Reject names invalid for element.setAttribute
	if ( ! /^[a-zA-Z_:][a-zA-Z0-9_.:-]*$/.test( trimmed ) ) {
		return __(
			'Invalid attribute name for HTML elements.',
			'blablablocks-formats'
		);
	}

	return null;
}

/**
 * Validates whether an attribute name is safe and valid HTML attribute syntax.
 * Rejects event handlers (on*), reserved link attributes, and invalid characters.
 *
 * @param {string} name Attribute name to validate.
 * @return {boolean} True if the attribute name is valid and allowed.
 */
export function isValidAttributeName( name ) {
	if ( typeof name !== 'string' ) {
		return false;
	}

	const trimmed = name.trim();
	if ( ! trimmed ) {
		return false;
	}

	return getAttributeNameError( trimmed ) === null;
}

/**
 * Preserves registered core link attributes from an active link format.
 *
 * @param {Object|null} activeLink - The active core/link format object.
 * @return {Object} Clean object containing only core link attributes.
 */
export function getCoreLinkAttributes( activeLink ) {
	const core = {};
	if ( ! activeLink ) {
		return core;
	}

	const source = {
		...( activeLink.unregisteredAttributes || {} ),
		...( activeLink.attributes || {} ),
	};

	for ( const [ key, val ] of Object.entries( source ) ) {
		if (
			LOWERCASE_RESERVED.includes( key.toLowerCase() ) &&
			val !== undefined &&
			val !== null
		) {
			core[ key ] = val;
		}
	}

	// Normalize url/href: if url exists, don't duplicate href
	if ( core.url && 'href' in core ) {
		delete core.href;
	}

	// Normalize class/className: if class exists, don't duplicate className
	if ( core.class && 'className' in core ) {
		delete core.className;
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
		.filter( ( [ key ] ) => isValidAttributeName( key ) )
		.map( ( [ key, val ] ) => ( {
			key,
			value: val !== undefined && val !== null ? String( val ) : '',
		} ) );
}

/**
 * Checks whether candidate format matches the seed format's identity.
 *
 * @param {Object} formatA First format object.
 * @param {Object} formatB Second format object.
 * @return {boolean} True if both formats represent the same link.
 */
function matchesLinkIdentity( formatA, formatB ) {
	if ( ! formatA || ! formatB ) {
		return false;
	}
	if ( formatA.type !== 'core/link' || formatB.type !== 'core/link' ) {
		return false;
	}
	if ( formatA === formatB ) {
		return true;
	}
	return (
		JSON.stringify( formatA.attributes || {} ) ===
		JSON.stringify( formatB.attributes || {} )
	);
}

/**
 * Computes the character range [startIndex, endIndex] of the active core/link format.
 * Expands to include the entire link instance when the selection is collapsed or partial.
 *
 * @param {Object} value The RichText value object.
 * @return {{ startIndex: number, endIndex: number }} Format boundary indices.
 */
export function getLinkFormatRange( value ) {
	const { formats, text, start, end, activeFormats } = value || {};
	if ( ! formats || ! text || text.length === 0 ) {
		return { startIndex: start, endIndex: end };
	}

	const getFormatAtIndex = ( index ) => {
		if ( index < 0 || index >= formats.length ) {
			return undefined;
		}
		return formats[ index ]?.find?.( ( f ) => f.type === 'core/link' );
	};

	let startSeedIndex = -1;
	let endSeedIndex = -1;

	if ( start !== end ) {
		for ( let i = start; i < end; i++ ) {
			if ( getFormatAtIndex( i ) ) {
				startSeedIndex = i;
				break;
			}
		}
		for ( let i = end - 1; i >= start; i-- ) {
			if ( getFormatAtIndex( i ) ) {
				endSeedIndex = i;
				break;
			}
		}
	} else {
		const activeFormat = activeFormats
			? activeFormats.find( ( f ) => f.type === 'core/link' )
			: undefined;

		if ( activeFormat ) {
			const formatAtStart = getFormatAtIndex( start );
			const formatBeforeStart =
				start > 0 ? getFormatAtIndex( start - 1 ) : undefined;

			if ( matchesLinkIdentity( formatAtStart, activeFormat ) ) {
				startSeedIndex = start;
				endSeedIndex = start;
			} else if (
				matchesLinkIdentity( formatBeforeStart, activeFormat )
			) {
				startSeedIndex = start - 1;
				endSeedIndex = start - 1;
			}
		} else if ( activeFormats === undefined ) {
			if ( getFormatAtIndex( start ) ) {
				startSeedIndex = start;
				endSeedIndex = start;
			} else if ( start > 0 && getFormatAtIndex( start - 1 ) ) {
				startSeedIndex = start - 1;
				endSeedIndex = start - 1;
			}
		}
	}

	if ( startSeedIndex === -1 && endSeedIndex === -1 ) {
		return { startIndex: start, endIndex: end };
	}

	let expandedStart = startSeedIndex;
	const seedStartFormat = getFormatAtIndex( startSeedIndex );
	while (
		expandedStart > 0 &&
		matchesLinkIdentity(
			getFormatAtIndex( expandedStart - 1 ),
			seedStartFormat
		)
	) {
		expandedStart--;
	}

	let expandedEnd = endSeedIndex + 1;
	const seedEndFormat = getFormatAtIndex( endSeedIndex );
	while (
		expandedEnd < formats.length &&
		matchesLinkIdentity( getFormatAtIndex( expandedEnd ), seedEndFormat )
	) {
		expandedEnd++;
	}

	return {
		startIndex: expandedStart,
		endIndex: expandedEnd,
	};
}

let rowCounter = 0;
function createRowItem( key = '', value = '', id ) {
	return {
		id: id || `link-attr-${ ++rowCounter }-${ Date.now() }`,
		key,
		value,
	};
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
		customAttributes.length
			? customAttributes.map( ( attr, i ) =>
					createRowItem(
						attr.key,
						attr.value,
						`attr-init-${ i }-${ attr.key }`
					)
			  )
			: [ createRowItem( '', '', 'attr-init-0' ) ]
	);

	const [ invalidRowIndices, setInvalidRowIndices ] = useState( [] );

	// Resync when the active link changes
	useEffect( () => {
		setAttributes(
			customAttributes.length
				? customAttributes.map( ( attr, i ) =>
						createRowItem(
							attr.key,
							attr.value,
							`attr-sync-${ i }-${ attr.key }`
						)
				  )
				: [ createRowItem( '', '', 'attr-sync-0' ) ]
		);
		setInvalidRowIndices( [] );
	}, [ customAttributes ] );

	const addAttribute = () => {
		setAttributes( ( prev ) => [ ...prev, createRowItem() ] );
	};

	const removeAttribute = ( index ) => {
		setAttributes( ( prev ) => prev.filter( ( _, i ) => i !== index ) );
		setInvalidRowIndices( ( prev ) =>
			prev
				.filter( ( i ) => i !== index )
				.map( ( i ) => ( i > index ? i - 1 : i ) )
		);
	};

	const updateAttribute = ( index, field, val ) => {
		setAttributes( ( prev ) =>
			prev.map( ( attr, i ) =>
				i === index ? { ...attr, [ field ]: val } : attr
			)
		);
		if ( field === 'key' ) {
			const trimmed = val.trim();
			if ( ! trimmed || isValidAttributeName( trimmed ) ) {
				setInvalidRowIndices( ( prev ) =>
					prev.filter( ( i ) => i !== index )
				);
			}
		}
	};

	const applyAttributes = () => {
		if ( ! activeLink ) {
			return false;
		}

		// Validate all trimmed attribute names in the hook before calling onChange
		const invalidIndices = [];
		const customAttrs = {};

		for ( let i = 0; i < attributes.length; i++ ) {
			const { key, value: val } = attributes[ i ];
			const trimmedKey = key.trim();

			if ( ! trimmedKey ) {
				if ( val && val.trim() ) {
					invalidIndices.push( i );
				}
				continue;
			}

			if ( ! isValidAttributeName( trimmedKey ) ) {
				invalidIndices.push( i );
			} else {
				customAttrs[ trimmedKey ] = val;
			}
		}

		if ( invalidIndices.length > 0 ) {
			setInvalidRowIndices( invalidIndices );
			return false;
		}

		setInvalidRowIndices( [] );

		const originalStart = value?.start;
		const originalEnd = value?.end;
		const { startIndex, endIndex } = getLinkFormatRange( value );
		const format = {
			type: 'core/link',
			attributes: {
				...getCoreLinkAttributes( activeLink ),
				...customAttrs,
			},
		};

		const updatedValue =
			startIndex !== undefined && endIndex !== undefined
				? applyFormat( value, format, startIndex, endIndex )
				: applyFormat( value, format );

		onChange( {
			...updatedValue,
			start: originalStart,
			end: originalEnd,
		} );

		return true;
	};

	const clearAllAttributes = () => {
		if ( ! activeLink ) {
			return false;
		}

		setAttributes( [ createRowItem( '', '', 'attr-cleared-0' ) ] );
		setInvalidRowIndices( [] );

		const originalStart = value?.start;
		const originalEnd = value?.end;
		const { startIndex, endIndex } = getLinkFormatRange( value );
		const format = {
			type: 'core/link',
			attributes: getCoreLinkAttributes( activeLink ),
		};

		const updatedValue =
			startIndex !== undefined && endIndex !== undefined
				? applyFormat( value, format, startIndex, endIndex )
				: applyFormat( value, format );

		onChange( {
			...updatedValue,
			start: originalStart,
			end: originalEnd,
		} );

		return true;
	};

	return {
		attributes,
		invalidRowIndices,
		hasCustomAttributes: customAttributes.length > 0,
		addAttribute,
		updateAttribute,
		removeAttribute,
		applyAttributes,
		clearAllAttributes,
	};
}
