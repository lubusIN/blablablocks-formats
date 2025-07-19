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
import { MARKER_PRESETS } from '../../constants';

/**
 * StyleTab component for managing marker style selection.
 *
 * @param {Object}   props                  - The component properties.
 * @param {Object}   props.activeAttributes - The currently active format attributes.
 * @param {Function} props.onChange         - Callback to update the marker format.
 * @param {Function} props.onClose          - Callback to close the UI.
 * @param {Function} props.updateAttributes - Function to update the attributes.
 * @param {Object}   props.value            - The current rich text value.
 * @return {JSX.Element}                   - The rendered component.
 */
function StyleTab( {
	activeAttributes,
	onChange,
	onClose,
	updateAttributes,
	value,
} ) {
	const { type, ...attrs } = activeAttributes;

	return (
		<>
			<Grid templateColumns="repeat( 3, minmax( 0, 1fr ) )">
				{ MARKER_PRESETS.map( ( { id, label } ) => (
					<Button
						key={ id }
						id={ id }
						onClick={ () => updateAttributes( { type: id } ) }
						isPressed={ type === id }
						className="block-editor-format-toolbar__blablablocks-marker-button"
					>
						<tatva-marker { ...attrs } type={ id }>
							{ label }
						</tatva-marker>
					</Button>
				) ) }
			</Grid>
			<Button
				className="reset-button"
				disabled={ ! type }
				onClick={ () => {
					onChange( removeFormat( value, 'blablablocks/marker' ) );
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
