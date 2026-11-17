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
import { PULSE_POSITIONS } from '../../constants';

/**
 * StyleTab component for managing pulse position selection.
 *
 * @param {Object}   props                  - The component properties.
 * @param {Object}   props.activeAttributes - The currently active format attributes.
 * @param {Function} props.onChange         - Callback to update the format.
 * @param {Function} props.onClose          - Callback to close the UI.
 * @param {Function} props.updateAttributes - Function to update the attributes.
 * @param {Object}   props.value            - The current rich text value.
 * @param {boolean}  props.isActive         - Indicates if the format is active.
 * @return {JSX.Element}                    - The rendered component.
 */
function StyleTab( {
	activeAttributes,
	onChange,
	onClose,
	updateAttributes,
	value,
	isActive,
} ) {
	const { position, ...attrs } = activeAttributes;
	const currentPosition = position || ( isActive ? 'left' : undefined );

	return (
		<>
			<Grid templateColumns="repeat( 2, minmax( 0, 1fr ) )">
				{ PULSE_POSITIONS.map( ( { id, label } ) => (
					<Button
						key={ id }
						id={ id }
						onClick={ () => updateAttributes( { position: id } ) }
						isPressed={ currentPosition === id }
						className="block-editor-format-toolbar__blablablocks-pulse-button"
					>
						<tatva-pulse { ...attrs } position={ id }>
							{ label }
						</tatva-pulse>
					</Button>
				) ) }
			</Grid>
			<Button
				className="reset-button"
				disabled={ ! isActive && ! position }
				onClick={ () => {
					onChange( removeFormat( value, 'blablablocks/pulse' ) );
					onClose();
				} }
				variant="tertiary"
			>
				{ __( 'Clear', 'blablablocks-formats' ) }
			</Button>
		</>
	);
}

export default StyleTab;
