/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { removeFormat } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import { createFormatHelpers } from '../utils';

/**
 * Custom hook for handling font size formatting.
 *
 * @param {Object}   props                  - The hook properties.
 * @param {string}   props.value            - The current rich text value.
 * @param {Function} props.onChange         - Callback to update the format.
 * @param {Object}   props.activeAttributes - The currently active format attributes.
 * @return {Object} The font size state and handlers.
 */
export const useFontSize = ( { value, onChange, activeAttributes } ) => {
	const { replace } = createFormatHelpers( {
		value,
		onChange,
		formatType: 'blablablocks/font-size',
		activeAttributes,
	} );

	const fontSizes = useSelect(
		( select ) => select( 'core/block-editor' ).getSettings().fontSizes,
		[]
	);

	/**
	 * Extract current font size from class or style attribute.
	 *
	 * @return {string|null} Current font size.
	 */
	const getCurrentFontSize = () => {
		const { class: classAttr, style: styleAttr } = activeAttributes;

		if ( classAttr ) {
			const match = classAttr.match( /has-([a-z0-9-]+)-font-size/ );
			if ( match ) {
				const slug = match[ 1 ];
				const fontSizeObj = fontSizes?.find(
					( size ) => size.slug === slug
				);
				return fontSizeObj ? fontSizeObj.size : null;
			}
		}

		if ( styleAttr ) {
			const match = styleAttr.match( /font-size:\s*([^;]+)/ );
			if ( match ) {
				return match[ 1 ].trim();
			}
		}

		return null;
	};

	/**
	 * Handle font size changes.
	 *
	 * @param {string} newFontSize The new font size value.
	 */
	const onFontSizeChange = ( newFontSize ) => {
		if ( ! newFontSize ) {
			onChange( removeFormat( value, 'blablablocks/font-size' ) );
			return;
		}

		const fontSizeObj = fontSizes?.find(
			( size ) =>
				size.size === newFontSize || size.slug === newFontSize
		);

		if ( fontSizeObj && fontSizeObj.slug ) {
			replace( {
				class: `has-${ fontSizeObj.slug }-font-size`,
			} );
		} else {
			replace( {
				style: `font-size: ${ newFontSize }`,
			} );
		}
	};

	/**
	 * Clear the font size format.
	 */
	const onClear = () => {
		onChange( removeFormat( value, 'blablablocks/font-size' ) );
	};

	return {
		fontSizes,
		fontSizeValue: getCurrentFontSize(),
		onFontSizeChange,
		onClear,
	};
};
