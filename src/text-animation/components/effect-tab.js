/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { removeFormat } from '@wordpress/rich-text';
import {
	Button,
	__experimentalGrid as Grid, // eslint-disable-line
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { TEXT_ANIMATION_TYPES } from '../../constants';

/**
 * EffectTab component for managing text animation effect selection.
 *
 * @param {Object}   props                  - The component properties.
 * @param {Object}   props.activeAttributes - The currently active format attributes.
 * @param {Function} props.onChange         - Callback to update the format.
 * @param {Function} props.onClose          - Callback to close the UI.
 * @param {Function} props.updateAttributes - Function to update the attributes.
 * @param {Object}   props.value            - The current rich text value.
 * @return {JSX.Element}                    - The rendered component.
 */
function EffectTab( {
	activeAttributes,
	onChange,
	onClose,
	updateAttributes,
	value,
} ) {
	const { type } = activeAttributes;

	return (
		<>
			<Grid templateColumns="repeat( 3, minmax( 0, 1fr ) )">
				{ TEXT_ANIMATION_TYPES.map( ( { id, label } ) => (
					<Button
						key={ id }
						id={ id }
						onClick={ () => updateAttributes( { type: id } ) }
						isPressed={ type === id }
						className="block-editor-format-toolbar__blablablocks-text-animation-button"
					>
						<tatva-text-animation
							type={ id }
							repeat="true"
							speed={ 150 }
							words={ label }
						>
							{ label }
						</tatva-text-animation>
					</Button>
				) ) }
			</Grid>
			<Button
				className="reset-button"
				disabled={ ! type }
				onClick={ () => {
					onChange(
						removeFormat( value, 'blablablocks/text-animation' )
					);
					onClose();
				} }
				variant="tertiary"
			>
				{ __( 'Clear', 'blablablocks-formats' ) }
			</Button>
		</>
	);
}

export default EffectTab;
