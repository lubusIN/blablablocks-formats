/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Button,
	__experimentalUnitControl as UnitControl, // eslint-disable-line
	__experimentalNumberControl as NumberControl, // eslint-disable-line
	__experimentalGrid as Grid, // eslint-disable-line
} from '@wordpress/components';

/**
 * SettingsTab component for managing pulse settings.
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
	const hasCustomSettings = [
		'size',
		'gap',
		'animation-duration',
		'superscript-offset',
	].some( ( key ) => key in activeAttributes );

	const isSuperscript = activeAttributes.position === 'superscript';

	const rawDuration = activeAttributes[ 'animation-duration' ];
	const durationValue = rawDuration ? parseFloat( rawDuration ) : 1;

	const handleDurationChange = ( nextValue ) => {
		if (
			nextValue === undefined ||
			nextValue === null ||
			nextValue === ''
		) {
			removeAttributes( [ 'animation-duration' ] );
		} else {
			updateAttributes( { 'animation-duration': `${ nextValue }s` } );
		}
	};

	const handleSizeChange = ( nextValue ) => {
		if ( ! nextValue ) {
			removeAttributes( [ 'size' ] );
		} else {
			updateAttributes( { size: nextValue } );
		}
	};

	const handleGapChange = ( nextValue ) => {
		if ( ! nextValue ) {
			removeAttributes( [ 'gap' ] );
		} else {
			updateAttributes( { gap: nextValue } );
		}
	};

	const handleOffsetChange = ( nextValue ) => {
		if ( ! nextValue ) {
			removeAttributes( [ 'superscript-offset' ] );
		} else {
			updateAttributes( { 'superscript-offset': nextValue } );
		}
	};

	const handleReset = () => {
		removeAttributes( [
			'size',
			'gap',
			'animation-duration',
			'superscript-offset',
		] );
	};

	return (
		<>
			<Grid
				columns={ 2 }
				templateColumns="3fr 7fr"
				alignment="center"
				className="block-editor-format-toolbar__blablablocks-pulse-settings-tab"
			>
				{ /* Row 1: Size */ }
				<span className="settings-tab-label">
					{ __( 'Size', 'blablablocks-formats' ) }
				</span>
				<UnitControl
					hideLabelFromVision
					label={ __( 'Size', 'blablablocks-formats' ) }
					value={ activeAttributes.size ?? '0.75rem' }
					onChange={ handleSizeChange }
					__next40pxDefaultSize
				/>

				{ /* Row 2: Gap */ }
				<span className="settings-tab-label">
					{ __( 'Gap', 'blablablocks-formats' ) }
				</span>
				<UnitControl
					hideLabelFromVision
					label={ __( 'Gap', 'blablablocks-formats' ) }
					value={ activeAttributes.gap ?? '10px' }
					onChange={ handleGapChange }
					__next40pxDefaultSize
				/>

				{ /* Row 3: Duration */ }
				<span className="settings-tab-label">
					{ __( 'Duration (s)', 'blablablocks-formats' ) }
				</span>
				<NumberControl
					hideLabelFromVision
					label={ __( 'Duration (seconds)', 'blablablocks-formats' ) }
					value={ durationValue }
					min={ 0.1 }
					max={ 10 }
					step={ 0.1 }
					onChange={ handleDurationChange }
					__next40pxDefaultSize
				/>

				{ /* Row 4: Superscript Offset (only in superscript mode) */ }
				{ isSuperscript && (
					<>
						<span className="settings-tab-label">
							{ __( 'Offset', 'blablablocks-formats' ) }
						</span>
						<UnitControl
							hideLabelFromVision
							label={ __(
								'Superscript Offset',
								'blablablocks-formats'
							) }
							value={
								activeAttributes[ 'superscript-offset' ] ??
								'-0.5em'
							}
							min={ -100 }
							onChange={ handleOffsetChange }
							__next40pxDefaultSize
						/>
					</>
				) }
			</Grid>

			<Button
				className="reset-button"
				disabled={ ! hasCustomSettings }
				onClick={ handleReset }
				variant="tertiary"
			>
				{ __( 'Clear', 'blablablocks-formats' ) }
			</Button>
		</>
	);
}

export default SettingsTab;
