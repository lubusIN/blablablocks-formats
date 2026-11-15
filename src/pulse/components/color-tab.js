/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { Button, ColorPalette } from '@wordpress/components';

/**
 * ColorTab component for selecting pulse color.
 *
 * @param {Object}   props                  - The component properties.
 * @param {string}   props.currentColor     - The current color selected.
 * @param {Function} props.updateAttributes - Function to update the attributes.
 * @param {Function} props.removeAttributes - Function to remove attributes.
 * @return {JSX.Element}                    - The rendered component.
 */
function ColorTab( { currentColor, updateAttributes, removeAttributes } ) {
	const themeColors = useSelect(
		( select ) => select( 'core/block-editor' ).getSettings().colors,
		[]
	);

	return (
		<>
			<ColorPalette
				as="div"
				value={ currentColor ?? '#000000' }
				onChange={ ( newValue ) =>
					updateAttributes( { color: newValue } )
				}
				aria-label={ __(
					'Pulse format color selection',
					'blablablocks-formats'
				) }
				colors={ themeColors }
				clearable={ false }
			/>
			<Button
				disabled={ ! currentColor }
				variant="tertiary"
				onClick={ () => removeAttributes( [ 'color' ] ) }
				className="reset-button"
			>
				{ __( 'Clear', 'blablablocks-formats' ) }
			</Button>
		</>
	);
}

export default ColorTab;
