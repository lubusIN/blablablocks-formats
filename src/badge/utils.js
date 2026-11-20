/**
 * Internal dependencies
 */
import {
	FORMAT_NAME,
	FORMAT_CLASS_NAME,
	DEFAULT_ATTRIBUTES,
} from './constants';

/**
 * Extracts badge attributes encoded in CSS classes.
 *
 * @param {string} classString Element class attribute string.
 * @return {Object} Parsed attribute values.
 */
export function parseBadgeClasses( classString = '' ) {
	if ( ! classString ) {
		return {};
	}

	const classes = classString.split( /\s+/ );
	const parsed = {};

	if ( classes.includes( 'is-style-solid' ) ) {
		parsed.variant = 'solid';
	} else if ( classes.includes( 'is-style-outline' ) ) {
		parsed.variant = 'outline';
	} else if ( classes.includes( 'is-style-subtle' ) ) {
		parsed.variant = 'subtle';
	}

	if ( classes.includes( 'is-radius-pill' ) ) {
		parsed.radius = 'pill';
	} else if ( classes.includes( 'is-radius-square' ) ) {
		parsed.radius = 'square';
	} else if ( classes.includes( 'is-radius-rounded' ) ) {
		parsed.radius = 'rounded';
	}

	if ( classes.includes( 'is-aligned-superscript' ) ) {
		parsed.alignment = 'superscript';
	} else if ( classes.includes( 'is-aligned-subscript' ) ) {
		parsed.alignment = 'subscript';
	} else if ( classes.includes( 'is-aligned-inline' ) ) {
		parsed.alignment = 'inline';
	}

	if ( classes.includes( 'is-size-extra-small' ) ) {
		parsed.size = 'extra-small';
	} else if ( classes.includes( 'is-size-small' ) ) {
		parsed.size = 'small';
	} else if ( classes.includes( 'is-size-large' ) ) {
		parsed.size = 'large';
	} else if ( classes.includes( 'is-size-medium' ) ) {
		parsed.size = 'medium';
	}

	return parsed;
}

/**
 * Extracts badge color from inline style attribute.
 *
 * @param {string} styleString Element style attribute string.
 * @return {Object} Parsed style attributes.
 */
export function parseBadgeStyle( styleString = '' ) {
	if ( ! styleString ) {
		return {};
	}

	const varMatch = styleString.match( /--badge-color:\s*([^;]+)/i );
	if ( varMatch && varMatch[ 1 ] ) {
		return {
			color: varMatch[ 1 ].trim(),
		};
	}

	return {};
}

/**
 * Returns complete badge attributes normalized from input attributes.
 *
 * @param {Object} attrs Raw or partial attributes.
 * @return {Object} Normalized attributes.
 */
export function getBadgeAttributes( attrs = {} ) {
	const parsedFromClass = parseBadgeClasses( attrs.class );
	const parsedFromStyle = parseBadgeStyle( attrs.style );

	const variant =
		attrs.variant || parsedFromClass.variant || DEFAULT_ATTRIBUTES.variant;

	const color =
		attrs.color ||
		parsedFromStyle.color ||
		parsedFromClass.color ||
		DEFAULT_ATTRIBUTES.color;

	const radius =
		attrs.radius || parsedFromClass.radius || DEFAULT_ATTRIBUTES.radius;

	const alignment =
		attrs.alignment ||
		parsedFromClass.alignment ||
		DEFAULT_ATTRIBUTES.alignment;

	const size = attrs.size || parsedFromClass.size || DEFAULT_ATTRIBUTES.size;

	const classList = [
		FORMAT_CLASS_NAME,
		`is-style-${ variant }`,
		`is-radius-${ radius }`,
		`is-aligned-${ alignment }`,
		`is-size-${ size }`,
	];

	const className = [ ...new Set( classList.filter( Boolean ) ) ].join( ' ' );

	const style = color ? `--badge-color: ${ color };` : undefined;

	return {
		variant,
		color,
		radius,
		alignment,
		size,
		class: className,
		style,
	};
}

/**
 * Checks whether candidate format matches the seed format's attributes or normalized identity.
 *
 * @param {Object} candidateFormat Format object to test.
 * @param {Object} seedFormat      Seed format object to match against.
 * @param {string} formatType      The format type identifier.
 * @return {boolean} True if candidate format matches seed format.
 */
function matchesFormatIdentity( candidateFormat, seedFormat, formatType ) {
	if ( ! candidateFormat || ! seedFormat ) {
		return false;
	}
	if ( candidateFormat.type !== seedFormat.type ) {
		return false;
	}
	if ( candidateFormat === seedFormat ) {
		return true;
	}
	if ( formatType === FORMAT_NAME ) {
		const cAttrs = getBadgeAttributes( candidateFormat.attributes );
		const sAttrs = getBadgeAttributes( seedFormat.attributes );
		return (
			cAttrs.variant === sAttrs.variant &&
			cAttrs.color === sAttrs.color &&
			cAttrs.radius === sAttrs.radius &&
			cAttrs.alignment === sAttrs.alignment &&
			cAttrs.size === sAttrs.size
		);
	}
	return (
		JSON.stringify( candidateFormat.attributes || {} ) ===
		JSON.stringify( seedFormat.attributes || {} )
	);
}

/**
 * Computes the character range [startIndex, endIndex] of the format within the rich text value.
 * Expands to include the entire format instance when the selection is collapsed or partial.
 *
 * @param {Object} value      The RichText value object.
 * @param {string} formatType The format type identifier.
 * @return {{ startIndex: number, endIndex: number }} Format boundary indices.
 */
export function getFormatRange( value, formatType = FORMAT_NAME ) {
	const { formats, text, start, end, activeFormats } = value || {};
	if ( ! formats || ! text || text.length === 0 ) {
		return { startIndex: start, endIndex: end };
	}

	const getFormatAtIndex = ( index ) => {
		if ( index < 0 || index >= formats.length ) {
			return undefined;
		}
		return formats[ index ]?.find?.( ( f ) => f.type === formatType );
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
			? activeFormats.find( ( f ) => f.type === formatType )
			: undefined;

		if ( activeFormat ) {
			const formatAtStart = getFormatAtIndex( start );
			const formatBeforeStart =
				start > 0 ? getFormatAtIndex( start - 1 ) : undefined;

			if (
				matchesFormatIdentity( formatAtStart, activeFormat, formatType )
			) {
				startSeedIndex = start;
				endSeedIndex = start;
			} else if (
				matchesFormatIdentity(
					formatBeforeStart,
					activeFormat,
					formatType
				)
			) {
				startSeedIndex = start - 1;
				endSeedIndex = start - 1;
			}
		} else if ( activeFormats === undefined ) {
			if ( getFormatAtIndex( start ) ) {
				startSeedIndex = start;
				endSeedIndex = start;
			}
		}
	}

	if ( startSeedIndex === -1 && endSeedIndex === -1 ) {
		return { startIndex: start, endIndex: end };
	}

	let expandedStart = start;
	if ( startSeedIndex !== -1 ) {
		const seedStartFormat = getFormatAtIndex( startSeedIndex );
		expandedStart = startSeedIndex;
		while (
			expandedStart > 0 &&
			matchesFormatIdentity(
				getFormatAtIndex( expandedStart - 1 ),
				seedStartFormat,
				formatType
			)
		) {
			expandedStart--;
		}
	}

	let expandedEnd = end;
	if ( endSeedIndex !== -1 ) {
		const seedEndFormat = getFormatAtIndex( endSeedIndex );
		expandedEnd = endSeedIndex + 1;
		while (
			expandedEnd < formats.length &&
			matchesFormatIdentity(
				getFormatAtIndex( expandedEnd ),
				seedEndFormat,
				formatType
			)
		) {
			expandedEnd++;
		}
	}

	return {
		startIndex: Math.min( start, expandedStart ),
		endIndex: Math.max( end, expandedEnd ),
	};
}
