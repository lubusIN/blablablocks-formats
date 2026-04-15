/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { removeFormat } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import { createFormatHelpers } from '../utils';

/**
 * Typography format slug.
 */
export const TYPOGRAPHY_FORMAT_TYPE = 'blablablocks/typography';

/**
 * Base class automatically applied by the typography format.
 */
export const TYPOGRAPHY_CLASS_NAME = 'has-typography-format';

/**
 * Class used by legacy drop-cap content.
 */
const TYPOGRAPHY_DROP_CAP_CLASS = 'has-drop-cap';

/**
 * Legacy drop-cap class retained for backward-compatible parsing.
 */
const LEGACY_TYPOGRAPHY_DROP_CAP_CLASS = 'has-typography-drop-cap';

/**
 * Pattern for preset-backed font-size classes.
 */
const FONT_SIZE_CLASS_PATTERN = /has-([a-z0-9-]+)-font-size/;

/**
 * Pattern for preset-backed font-family classes.
 */
const FONT_FAMILY_CLASS_PATTERN = /has-([a-z0-9-]+)-font-family/;

/**
 * Class patterns managed directly by this format serializer.
 */
const MANAGED_CLASS_PATTERNS = [
	FONT_SIZE_CLASS_PATTERN,
	FONT_FAMILY_CLASS_PATTERN,
	new RegExp( `^${ TYPOGRAPHY_CLASS_NAME }$` ),
	new RegExp( `^${ TYPOGRAPHY_DROP_CAP_CLASS }$` ),
	new RegExp( `^${ LEGACY_TYPOGRAPHY_DROP_CAP_CLASS }$` ),
];

/**
 * Style properties persisted by the typography format.
 */
const STYLE_ATTRIBUTES = {
	fontSize: 'font-size',
	fontFamily: 'font-family',
	fontStyle: 'font-style',
	fontWeight: 'font-weight',
	letterSpacing: 'letter-spacing',
	textTransform: 'text-transform',
};

/**
 * Default typography values used when no attributes are present.
 */
const DEFAULT_VALUES = {
	fontSize: '',
	fontFamily: '',
	fontStyle: '',
	fontWeight: '',
	letterSpacing: '',
	textTransform: '',
};

/**
 * Parse an inline style string into a property map.
 *
 * @param {string} style Inline style attribute value.
 * @return {Object<string, string>} Parsed style properties.
 */
const parseStyleString = ( style = '' ) =>
	style
		.split( ';' )
		.map( ( declaration ) => declaration.trim() )
		.filter( Boolean )
		.reduce( ( styles, declaration ) => {
			const separatorIndex = declaration.indexOf( ':' );

			if ( separatorIndex === -1 ) {
				return styles;
			}

			const property = declaration.slice( 0, separatorIndex ).trim();
			const value = declaration.slice( separatorIndex + 1 ).trim();

			if ( property && value ) {
				styles[ property ] = value;
			}

			return styles;
		}, {} );

/**
 * Serialize a style-property map back into an inline style string.
 *
 * @param {Object<string, string>} styles Style properties.
 * @return {string} Serialized inline style string.
 */
const stringifyStyleString = ( styles ) =>
	Object.entries( styles )
		.filter( ( [ , value ] ) => value !== undefined && value !== '' )
		.map( ( [ property, value ] ) => `${ property }: ${ value }` )
		.join( '; ' );

/**
 * Convert a label or slug-like value into kebab-case.
 *
 * @param {string} value Source value.
 * @return {string} Normalized kebab-case string.
 */
const kebabCase = ( value = '' ) =>
	value
		.toString()
		.trim()
		.toLowerCase()
		.replace( /[^a-z0-9]+/g, '-' )
		.replace( /(^-|-$)/g, '' );

/**
 * Split a class string into individual class tokens.
 *
 * @param {string} className Space-separated class string.
 * @return {string[]} Normalized class tokens.
 */
const getClassNames = ( className = '' ) =>
	className.split( /\s+/ ).filter( Boolean );

/**
 * Find a registered preset referenced by a generated class name.
 *
 * @param {string}   className Space-separated class string.
 * @param {RegExp}   pattern   Class-name pattern containing a slug capture group.
 * @param {Object[]} presets   Available presets to search.
 * @param {string}   key       Preset key to compare against the extracted slug.
 * @return {Object|null} Matching preset object, if found.
 */
const findPresetByClass = (
	className,
	pattern,
	presets = [],
	key = 'slug'
) => {
	const matchedClass = getClassNames( className ).find( ( token ) =>
		pattern.test( token )
	);

	if ( ! matchedClass ) {
		return null;
	}

	const matchedSlug = matchedClass.match( pattern )?.[ 1 ];

	if ( ! matchedSlug ) {
		return null;
	}

	return (
		presets.find(
			( preset ) => kebabCase( preset[ key ] ) === matchedSlug
		) || null
	);
};

/**
 * Determine whether the typography format currently has any persisted value.
 *
 * @param {Object} values Current typography values.
 * @return {boolean} True when any typography setting is enabled.
 */
const hasTypographyValue = ( values ) =>
	Object.keys( STYLE_ATTRIBUTES ).some( ( key ) => values[ key ] );

/**
 * Hydrate normalized typography values from the active rich-text attributes.
 *
 * @param {Object}   activeAttributes     Format attributes from the selected text.
 * @param {Object}   options              Helper options.
 * @param {Object[]} options.fontFamilies Available font-family presets.
 * @param {Object[]} options.fontSizes    Available font-size presets.
 * @return {Object} Normalized typography values for the UI.
 */
const getTypographyValues = (
	activeAttributes = {},
	{ fontFamilies = [], fontSizes = [] } = {}
) => {
	const styles = parseStyleString( activeAttributes.style );
	const fontSizePreset = findPresetByClass(
		activeAttributes.class,
		FONT_SIZE_CLASS_PATTERN,
		fontSizes
	);
	const fontFamilyPreset = findPresetByClass(
		activeAttributes.class,
		FONT_FAMILY_CLASS_PATTERN,
		fontFamilies
	);

	return {
		...DEFAULT_VALUES,
		fontSize:
			fontSizePreset?.size || styles[ STYLE_ATTRIBUTES.fontSize ] || '',
		fontFamily:
			fontFamilyPreset?.fontFamily ||
			styles[ STYLE_ATTRIBUTES.fontFamily ] ||
			'',
		fontStyle: styles[ STYLE_ATTRIBUTES.fontStyle ] || '',
		fontWeight: styles[ STYLE_ATTRIBUTES.fontWeight ] || '',
		letterSpacing: styles[ STYLE_ATTRIBUTES.letterSpacing ] || '',
		textTransform: styles[ STYLE_ATTRIBUTES.textTransform ] || '',
	};
};

/**
 * Build the rich-text format attributes from normalized typography values.
 *
 * @param {Object}   values                    Normalized typography values.
 * @param {Object}   options                   Serializer options.
 * @param {string}   options.existingClassName Existing class attribute value.
 * @param {Object[]} options.fontFamilies      Available font-family presets.
 * @param {Object[]} options.fontSizes         Available font-size presets.
 * @return {Object} Rich-text format attributes ready for applyFormat().
 */
const buildFormatAttributes = (
	values,
	{ existingClassName = '', fontFamilies = [], fontSizes = [] } = {}
) => {
	const classNames = getClassNames( existingClassName ).filter(
		( token ) =>
			! MANAGED_CLASS_PATTERNS.some( ( pattern ) =>
				pattern.test( token )
			)
	);

	const fontSizePreset = fontSizes.find(
		( preset ) =>
			preset.slug === values.fontSize || preset.size === values.fontSize
	);
	const fontFamilyPreset = fontFamilies.find(
		( preset ) =>
			preset.slug === values.fontFamily ||
			preset.fontFamily === values.fontFamily
	);

	if ( fontSizePreset?.slug ) {
		classNames.push(
			`has-${ kebabCase( fontSizePreset.slug ) }-font-size`
		);
	}

	if ( fontFamilyPreset?.slug ) {
		classNames.push(
			`has-${ kebabCase( fontFamilyPreset.slug ) }-font-family`
		);
	}

	const styles = Object.entries( STYLE_ATTRIBUTES ).reduce(
		( accumulator, [ key, property ] ) => {
			if ( key === 'fontSize' && fontSizePreset ) {
				return accumulator;
			}

			if ( key === 'fontFamily' && fontFamilyPreset ) {
				return accumulator;
			}

			if ( values[ key ] ) {
				accumulator[ property ] = values[ key ];
			}

			return accumulator;
		},
		{}
	);

	const styleString = stringifyStyleString( styles );
	const dedupedClassNames = [ ...new Set( classNames ) ];

	return {
		...( dedupedClassNames.length > 0
			? { class: dedupedClassNames.join( ' ' ) }
			: {} ),
		...( styleString ? { style: styleString } : {} ),
	};
};

/**
 * Read typography settings from whichever editor settings shape is available.
 *
 * @param {Object} settings Block-editor settings object.
 * @return {Object} Typography settings subtree.
 */
const getTypographySettings = ( settings = {} ) =>
	settings.typography || settings.__experimentalFeatures?.typography || {};

/**
 * Merge font-family presets from default, theme, and custom sources.
 *
 * @param {Object} settings Block-editor settings object.
 * @return {Object[]} Flattened font-family presets.
 */
const getMergedFontFamilies = ( settings = {} ) => {
	const typographySettings = getTypographySettings( settings );

	return [
		...( typographySettings.fontFamilies?.default || [] ),
		...( typographySettings.fontFamilies?.theme || [] ),
		...( typographySettings.fontFamilies?.custom || [] ),
	];
};

/**
 * Merge font-size presets from the available editor settings sources.
 *
 * @param {Object} settings Block-editor settings object.
 * @return {Object[]} Flattened font-size presets.
 */
const getMergedFontSizes = ( settings = {} ) => {
	if (
		Array.isArray( settings.fontSizes ) &&
		settings.fontSizes.length > 0
	) {
		return settings.fontSizes;
	}

	const typographySettings = getTypographySettings( settings );

	return [
		...( typographySettings.fontSizes?.custom || [] ),
		...( typographySettings.fontSizes?.theme || [] ),
		...( typographySettings.defaultFontSizes !== false
			? typographySettings.fontSizes?.default || []
			: [] ),
	];
};

/**
 * Hook for handling typography format state and updates.
 *
 * @param {Object}   props                  - Hook properties.
 * @param {Object}   props.value            - Current rich text value.
 * @param {Function} props.onChange         - Callback to update the format.
 * @param {Object}   props.activeAttributes - The currently active format attributes.
 * @return {Object} Typography state and handlers.
 */
export const useTypography = ( { value, onChange, activeAttributes } ) => {
	const { replace } = createFormatHelpers( {
		value,
		onChange,
		formatType: TYPOGRAPHY_FORMAT_TYPE,
		activeAttributes,
	} );

	const settings = useSelect(
		( select ) => select( 'core/block-editor' ).getSettings(),
		[]
	);
	const fontFamilies = getMergedFontFamilies( settings );
	const fontSizes = getMergedFontSizes( settings );
	const values = useMemo(
		() =>
			getTypographyValues( activeAttributes, {
				fontFamilies,
				fontSizes,
			} ),
		[ activeAttributes, fontFamilies, fontSizes ]
	);
	const fontFamilyFaces =
		fontFamilies.find(
			( { fontFamily } ) => fontFamily === values.fontFamily
		)?.fontFace || [];

	const updateTypography = ( partialValues ) => {
		const nextValues = {
			...values,
			...partialValues,
		};

		if ( ! hasTypographyValue( nextValues ) ) {
			onChange( removeFormat( value, TYPOGRAPHY_FORMAT_TYPE ) );
			return;
		}

		replace(
			buildFormatAttributes( nextValues, {
				existingClassName: activeAttributes.class,
				fontFamilies,
				fontSizes,
			} )
		);
	};

	const clearAll = () =>
		onChange( removeFormat( value, TYPOGRAPHY_FORMAT_TYPE ) );

	return {
		values,
		fontFamilies,
		fontSizes,
		fontFamilyFaces,
		hasAnyValue: hasTypographyValue( values ),
		updateTypography,
		clearAll,
	};
};
