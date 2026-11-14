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

	if ( classes.includes( 'is-size-small' ) ) {
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
 * Computes the character range [startIndex, endIndex] of the format within the rich text value.
 * Expands to include the entire format instance when the selection is collapsed or partial.
 *
 * @param {Object} value      The RichText value object.
 * @param {string} formatType The format type identifier.
 * @return {{ startIndex: number, endIndex: number }} Format boundary indices.
 */
export function getFormatRange( value, formatType = FORMAT_NAME ) {
	const { formats, text, start, end } = value || {};
	if ( ! formats || ! text || text.length === 0 ) {
		return { startIndex: start, endIndex: end };
	}

	const hasFormatAtIndex = ( index ) => {
		if ( index < 0 || index >= formats.length ) {
			return false;
		}
		return Boolean(
			formats[ index ]?.some?.( ( f ) => f.type === formatType )
		);
	};

	let seedIndex = -1;

	if ( start !== end ) {
		for ( let i = start; i < end; i++ ) {
			if ( hasFormatAtIndex( i ) ) {
				seedIndex = i;
				break;
			}
		}
	} else if ( hasFormatAtIndex( start ) ) {
		seedIndex = start;
	} else if ( start > 0 && hasFormatAtIndex( start - 1 ) ) {
		seedIndex = start - 1;
	}

	if ( seedIndex === -1 ) {
		return { startIndex: start, endIndex: end };
	}

	let expandedStart = seedIndex;
	while ( expandedStart > 0 && hasFormatAtIndex( expandedStart - 1 ) ) {
		expandedStart--;
	}

	let expandedEnd = seedIndex + 1;
	while ( expandedEnd < formats.length && hasFormatAtIndex( expandedEnd ) ) {
		expandedEnd++;
	}

	return {
		startIndex: Math.min( start, expandedStart ),
		endIndex: Math.max( end, expandedEnd ),
	};
}
