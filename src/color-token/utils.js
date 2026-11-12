/**
 * External dependencies
 */
import tinycolor from 'tinycolor2';

/**
 * Checks if a string is an explicit color code (hex, rgb/rgba, or hsl/hsla).
 * Named color words (e.g. "red", "blue") are intentionally excluded to avoid false positives.
 *
 * @param {string} str - Candidate string.
 * @return {boolean} True if the string is an explicit color code.
 */
export function isExplicitColorCode( str ) {
	if ( ! str ) {
		return false;
	}

	const trimmed = str.trim();
	const isHex = /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(
		trimmed
	);
	const isRgb = /^rgba?\s*\([\d\s,./%+-]+\)$/i.test( trimmed );
	const isHsl = /^hsla?\s*\([\d\s,./%+-]+\)$/i.test( trimmed );

	if ( ! isHex && ! isRgb && ! isHsl ) {
		return false;
	}

	return tinycolor( trimmed ).isValid();
}

/**
 * Generates the format attributes for a given color.
 *
 * @param {string} colorInput - The color code to tokenize.
 * @return {Object} Format attributes object.
 */
export function getColorTokenAttributes( colorInput ) {
	const colorObj = tinycolor( colorInput );
	const parsedColor = colorObj.toString();
	const border = colorObj.darken( 20 ).toString();

	return {
		style: `--lubus-color: ${ parsedColor }; --lubus-border-color: ${ border }`,
		color: parsedColor,
		border,
		theme: 'minimal',
	};
}

/**
 * Finds an explicit color code candidate immediately preceding the caret.
 *
 * @param {string} textBefore - Text up to the current caret position.
 * @return {Object|null} Candidate details or null if no match.
 */
export function findColorCandidateBeforeCaret( textBefore ) {
	if ( ! textBefore ) {
		return null;
	}

	const match = textBefore.match(
		/(?:^|[\s(])(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\))$/i
	);
	if ( ! match || ! isExplicitColorCode( match[ 1 ] ) ) {
		return null;
	}

	const candidate = match[ 1 ];
	return {
		candidate,
		startIndex: textBefore.length - candidate.length,
		endIndex: textBefore.length,
	};
}
