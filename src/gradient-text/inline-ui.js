/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useMemo, useRef } from '@wordpress/element';
import { applyFormat, removeFormat, useAnchor } from '@wordpress/rich-text';
import { GradientPicker, Popover } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { FORMAT_NAME } from './index';

/**
 * Extract gradient string from inline style value.
 *
 * @param {string} style The style attribute string.
 * @return {string} The extracted gradient value.
 */
const getGradient = ( style ) =>
	style?.match( /background(?:-image)?:\s*([^;]+)/i )?.[ 1 ]?.trim() ||
	style ||
	'';

/**
 * Parse gradient string into type and top-level parts.
 *
 * @param {string} gradientString The gradient CSS string.
 * @return {Object|null} Object containing gradient type and array of comma-separated parts.
 */
const getGradientParts = ( gradientString ) => {
	if ( ! gradientString || typeof gradientString !== 'string' ) {
		return null;
	}

	const match = gradientString.match(
		/^(linear|radial)-gradient\s*\((.*)\)$/is
	);
	if ( ! match ) {
		return null;
	}

	const type = match[ 1 ];
	const body = match[ 2 ];

	const parts = [];
	let current = '';
	let depth = 0;

	for ( let i = 0; i < body.length; i++ ) {
		const char = body[ i ];
		if ( char === '(' ) {
			depth++;
			current += char;
		} else if ( char === ')' ) {
			depth--;
			current += char;
		} else if ( char === ',' && depth === 0 ) {
			parts.push( current.trim() );
			current = '';
		} else {
			current += char;
		}
	}

	if ( current.trim() ) {
		parts.push( current.trim() );
	}

	return { type, parts };
};

/**
 * Convert a gradient CSS string to radial gradient.
 *
 * @param {string} gradientString The gradient CSS string.
 * @return {string} The radial gradient string.
 */
const toRadialGradient = ( gradientString ) => {
	const parsed = getGradientParts( gradientString );
	if ( ! parsed ) {
		return gradientString;
	}

	if ( parsed.type === 'radial' ) {
		return gradientString;
	}

	const firstPart = parsed.parts[ 0 ]?.trim();
	const hasOrientation =
		/(?:deg|grad|rad|turn)$/i.test( firstPart ) ||
		/^to\s+/i.test( firstPart );

	const colorStops = hasOrientation ? parsed.parts.slice( 1 ) : parsed.parts;
	return `radial-gradient(${ colorStops.join( ',' ) })`;
};

/**
 * Normalize a gradient string for comparison by removing whitespace and lowercasing.
 *
 * @param {string} str The gradient string.
 * @return {string} The normalized gradient string.
 */
const normalizeGradient = ( str ) =>
	str
		? str
				.trim()
				.toLowerCase()
				.replace( /\s+/g, ' ' )
				.replace( /\s*([(),])\s*/g, '$1' )
		: '';

/**
 * Convert a gradient list to radial gradients.
 *
 * @param {Array} gradientList The gradients array (single or multiple origins).
 * @return {Array} The converted gradients array.
 */
const convertGradientsToRadial = ( gradientList ) => {
	if ( ! Array.isArray( gradientList ) ) {
		return gradientList;
	}

	return gradientList.map( ( item ) => {
		if ( Array.isArray( item?.gradients ) ) {
			return {
				...item,
				gradients: item.gradients.map( ( g ) => ( {
					...g,
					gradient: toRadialGradient( g?.gradient ),
				} ) ),
			};
		}

		if ( item?.gradient ) {
			return {
				...item,
				gradient: toRadialGradient( item.gradient ),
			};
		}

		return item;
	} );
};

/**
 * InlineUI component for handling Gradient text formatting options.
 *
 * @param {Object}   props                  The component properties.
 * @param {Object}   props.activeAttributes The currently active attributes.
 * @param {Object}   props.value            The current value of the rich text.
 * @param {Function} props.onChange         Function to update the rich text value.
 * @param {Function} props.onClose          Function to close the popover.
 * @param {Object}   props.contentRef       Reference to the editable content element.
 * @param {boolean}  props.isActive         Indicates if the format is currently active.
 * @return {JSX.Element} The rendered InlineUI component.
 */
function InlineUI( {
	activeAttributes,
	value,
	onChange,
	onClose,
	contentRef,
	isActive,
} ) {
	const anchorRef = useRef( null );
	const liveAnchor = useAnchor( {
		editableContentElement: contentRef?.current || contentRef,
		settings: { isActive },
	} );

	if ( liveAnchor ) {
		anchorRef.current = liveAnchor;
	}

	const gradients = useSelect(
		( select ) => select( 'core/block-editor' )?.getSettings()?.gradients,
		[]
	);

	const currentGradient = getGradient( activeAttributes?.style );
	const isRadial = currentGradient.startsWith( 'radial-gradient' );

	const pickerGradients = useMemo( () => {
		if ( ! isRadial ) {
			return gradients;
		}

		return convertGradientsToRadial( gradients );
	}, [ gradients, isRadial ] );

	const handleClear = () => {
		onChange( removeFormat( value, FORMAT_NAME ) );
		onClose();
	};

	const handleGradientChange = ( newGradient ) => {
		if ( ! newGradient ) {
			handleClear();
			return;
		}

		let finalGradient = newGradient;

		// If currently in radial mode and a different linear gradient was selected,
		// convert it to radial so clicking other gradients doesn't revert back to linear.
		// If the user explicitly switched the Type dropdown to Linear, the color stops
		// remain identical to currentGradient, which we respect.
		if ( isRadial && newGradient.startsWith( 'linear-gradient' ) ) {
			const convertedRadial = toRadialGradient( newGradient );
			if (
				normalizeGradient( convertedRadial ) !==
				normalizeGradient( currentGradient )
			) {
				finalGradient = convertedRadial;
			}
		}

		onChange(
			applyFormat( value, {
				type: FORMAT_NAME,
				attributes: {
					style: `background-image: ${ finalGradient };`,
				},
			} )
		);
	};

	const handleFocusOutside = ( event ) => {
		if (
			! event?.relatedTarget?.closest?.(
				'.components-custom-gradient-picker, .components-popover, [role="dialog"]'
			)
		) {
			onClose();
		}
	};

	return (
		<Popover
			anchor={ liveAnchor || anchorRef.current }
			className="block-editor-format-toolbar__blablablocks-gradient-text-popover"
			onClose={ onClose }
			onFocusOutside={ handleFocusOutside }
			offset={ 20 }
			placement="bottom"
			shift
			flip
		>
			<GradientPicker
				value={ currentGradient || undefined }
				gradients={ pickerGradients }
				onChange={ handleGradientChange }
				clearable={ Boolean( currentGradient ) }
				aria-label={ __(
					'Gradient text selection',
					'blablablocks-formats'
				) }
			/>
		</Popover>
	);
}

export default InlineUI;
