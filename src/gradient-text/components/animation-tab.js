/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Button,
	FormToggle,
	SelectControl,
	__experimentalGrid as Grid, // eslint-disable-line @wordpress/no-unsafe-wp-apis
	__experimentalNumberControl as NumberControl, // eslint-disable-line @wordpress/no-unsafe-wp-apis
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { GRADIENT_ANIMATION_TYPES, DEFAULT_ANIMATION } from '../constants';

/**
 * AnimationTab component for managing gradient animation settings.
 *
 * @param {Object}   props                  The component properties.
 * @param {Object}   props.activeAttributes The currently active format attributes.
 * @param {Function} props.updateAttributes Function to update format attributes.
 * @param {Function} props.removeAttributes Function to remove format attributes.
 * @return {JSX.Element} The rendered AnimationTab component.
 */
function AnimationTab( {
	activeAttributes,
	updateAttributes,
	removeAttributes,
} ) {
	const enabled =
		activeAttributes.animation === 'true' ||
		activeAttributes.animation === true ||
		activeAttributes.animated === 'true' ||
		activeAttributes.animated === true;

	const hasCustomAnimationSetting = Object.keys( activeAttributes ).some(
		( key ) => key.includes( 'animation' ) || key === 'animated'
	);

	const handleToggle = () => {
		if ( enabled ) {
			removeAttributes( [
				'animation',
				'animation-duration',
				'animation-type',
				'animated',
			] );
		} else {
			updateAttributes( {
				animation: 'true',
				animated: 'true',
				'animation-duration':
					activeAttributes[ 'animation-duration' ] ||
					DEFAULT_ANIMATION.speed,
				'animation-type':
					activeAttributes[ 'animation-type' ] ||
					DEFAULT_ANIMATION.type,
			} );
		}
	};

	return (
		<>
			<Grid
				columns={ 2 }
				rows={ 3 }
				templateColumns="3fr 7fr"
				alignment="center"
				className="block-editor-format-toolbar__blablablocks-gradient-text-animation-tab"
			>
				{ /* row 1 - Animation enable */ }
				<span className="animation-tab-label">
					{ __( 'Enabled', 'blablablocks-formats' ) }
				</span>
				<FormToggle
					checked={ enabled }
					onChange={ handleToggle }
					aria-label={ __(
						'Enable Animation',
						'blablablocks-formats'
					) }
				/>

				{ /* row 2 - Animation duration / speed */ }
				<span className="animation-tab-label">
					{ __( 'Speed (seconds)', 'blablablocks-formats' ) }
				</span>
				<NumberControl
					disabled={ ! enabled }
					value={
						activeAttributes[ 'animation-duration' ] ??
						DEFAULT_ANIMATION.speed
					}
					min={ 1 }
					max={ 10 }
					step={ 0.5 }
					onChange={ ( newValue ) => {
						if (
							newValue === '' ||
							newValue === undefined ||
							newValue === null
						) {
							removeAttributes( [ 'animation-duration' ] );
						} else {
							updateAttributes( {
								'animation-duration': String( newValue ),
							} );
						}
					} }
					label={ __( 'Speed', 'blablablocks-formats' ) }
					hideLabelFromVision
					__next40pxDefaultSize
					style={ { justifySelf: 'start' } }
				/>

				{ /* row 3 - Animation type */ }
				<span className="animation-tab-label">
					{ __( 'Type', 'blablablocks-formats' ) }
				</span>
				<SelectControl
					disabled={ ! enabled }
					label={ __( 'Type', 'blablablocks-formats' ) }
					value={
						activeAttributes[ 'animation-type' ] ??
						DEFAULT_ANIMATION.type
					}
					options={ GRADIENT_ANIMATION_TYPES }
					hideLabelFromVision
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					onChange={ ( newValue ) =>
						updateAttributes( { 'animation-type': newValue } )
					}
				/>
			</Grid>
			<Button
				className="reset-button"
				disabled={ ! hasCustomAnimationSetting }
				onClick={ () =>
					removeAttributes( [
						'animation',
						'animation-duration',
						'animation-type',
						'animated',
					] )
				}
				variant="tertiary"
			>
				{ __( 'Clear', 'blablablocks-formats' ) }
			</Button>
		</>
	);
}

export default AnimationTab;
