/**
 * Internal dependencies
 */
import { FORMAT_NAME } from './constants';

/**
 * Computes the character range [startIndex, endIndex] of the format within the rich text value.
 * Expands to include the entire format instance when the selection is collapsed or partial.
 *
 * @param {Object} value      - The RichText value object.
 * @param {string} formatType - The format type identifier.
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
