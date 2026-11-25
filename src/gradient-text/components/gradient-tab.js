/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { removeFormat } from '@wordpress/rich-text';
import { Button, GradientPicker } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { FORMAT_NAME } from '../index';

/**
 * Extract gradient string from inline style value.
 *
 * @param {string} style The style attribute string.
 * @return {string} The extracted gradient value.
 */
export const getGradient = ( style ) =>
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
 * GradientTab component for selecting gradient backgrounds.
 *
 * @param {Object}   props                  The component properties.
 * @param {Object}   props.activeAttributes The currently active format attributes.
 * @param {Object}   props.value            The current rich text value.
 * @param {Function} props.onChange         Function to update rich text.
 * @param {Function} props.onClose          Function to close the popover.
 * @param {Function} props.updateAttributes Function to update format attributes.
 * @return {JSX.Element} The rendered GradientTab component.
 */
function GradientTab( {
	activeAttributes,
	value,
	onChange,
	onClose,
	updateAttributes,
} ) {
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

		if ( isRadial && newGradient.startsWith( 'linear-gradient' ) ) {
			const convertedRadial = toRadialGradient( newGradient );
			if (
				normalizeGradient( convertedRadial ) !==
				normalizeGradient( currentGradient )
			) {
				finalGradient = convertedRadial;
			}
		}

		updateAttributes( {
			style: `background-image: ${ finalGradient };`,
		} );
	};

	return (
		<>
			<GradientPicker
				value={ currentGradient || undefined }
				gradients={ pickerGradients }
				onChange={ handleGradientChange }
				clearable={ false }
				aria-label={ __(
					'Gradient text selection',
					'blablablocks-formats'
				) }
			/>
			<Button
				className="reset-button"
				disabled={ ! currentGradient }
				onClick={ handleClear }
				variant="tertiary"
			>
				{ __( 'Clear', 'blablablocks-formats' ) }
			</Button>
		</>
	);
}

export default GradientTab;
