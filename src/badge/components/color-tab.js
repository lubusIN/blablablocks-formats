/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { ColorPalette } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { COLOR_PRESETS } from '../constants';

/**
 * ColorTab component for choosing badge color presets or custom palette colors.
 *
 * @param {Object}   props                  Component properties.
 * @param {Object}   props.activeAttributes Currently active attributes.
 * @param {Function} props.updateAttributes Callback to update attributes.
 * @return {JSX.Element} Rendered color tab content.
 */
function ColorTab( { activeAttributes, updateAttributes } ) {
	const currentColor = activeAttributes.color || '#3b82f6';

	const themeColors = useSelect(
		( select ) =>
			select( 'core/block-editor' )?.getSettings()?.colors || [],
		[]
	);

	const paletteColors = useMemo( () => {
		if ( ! themeColors.length ) {
			return COLOR_PRESETS;
		}

		return [ ...COLOR_PRESETS, ...themeColors ];
	}, [ themeColors ] );

	const handleColorChange = ( newColor ) => {
		updateAttributes( {
			color: newColor || '#3b82f6',
		} );
	};

	return (
		<div className="blablablocks-badge-color-tab">
			<ColorPalette
				value={ currentColor }
				onChange={ handleColorChange }
				colors={ paletteColors }
				clearable={ false }
				aria-label={ __(
					'Badge color selection',
					'blablablocks-formats'
				) }
			/>
		</div>
	);
}

export default ColorTab;
