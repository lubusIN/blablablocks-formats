/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Button,
	FormToggle,
	__experimentalGrid as Grid, // eslint-disable-line
	__experimentalNumberControl as NumberControl, // eslint-disable-line
} from '@wordpress/components';

/**
 * SettingsTab component for managing text animation settings.
 *
 * @param {Object}   props                  - The component properties.
 * @param {Object}   props.activeAttributes - The currently active format attributes.
 * @param {Function} props.updateAttributes - Function to update the attributes.
 * @param {Function} props.removeAttributes - Function to remove attributes.
 * @return {JSX.Element}                    - The rendered component.
 */
function SettingsTab( {
	activeAttributes,
	updateAttributes,
	removeAttributes,
} ) {
	const isRepeat =
		activeAttributes.repeat === 'true' || activeAttributes.repeat === '';
	const hasCustomSettings =
		activeAttributes.speed !== undefined ||
		activeAttributes.repeat !== undefined;

	return (
		<>
			<Grid
				columns={ 2 }
				rows={ 2 }
				templateColumns="3fr 7fr"
				alignment="center"
				className="block-editor-format-toolbar__blablablocks-text-animation-settings-tab"
			>
				{ /* row 1 - Animation speed */ }
				<span className="text-animation-tab-label">
					{ __( 'Speed (ms)', 'blablablocks-formats' ) }
				</span>
				<NumberControl
					label={ __( 'Speed (ms)', 'blablablocks-formats' ) }
					value={ activeAttributes.speed ?? 100 }
					min={ 25 }
					max={ 2000 }
					step={ 25 }
					onChange={ ( newValue ) =>
						updateAttributes( { speed: newValue } )
					}
					hideLabelFromVision
					__next40pxDefaultSize
					style={ { justifySelf: 'start' } }
				/>

				{ /* row 2 - Repeat animation */ }
				<span className="text-animation-tab-label">
					{ __( 'Repeat', 'blablablocks-formats' ) }
				</span>
				<FormToggle
					checked={ isRepeat }
					onChange={ () =>
						isRepeat
							? removeAttributes( [ 'repeat' ] )
							: updateAttributes( { repeat: 'true' } )
					}
					label={ __( 'Repeat animation', 'blablablocks-formats' ) }
				/>
			</Grid>
			<Button
				className="reset-button"
				disabled={ ! hasCustomSettings }
				onClick={ () => removeAttributes( [ 'speed', 'repeat' ] ) }
				variant="tertiary"
			>
				{ __( 'Clear', 'blablablocks-formats' ) }
			</Button>
		</>
	);
}

export default SettingsTab;
