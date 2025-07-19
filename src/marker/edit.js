/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { RichTextToolbarButton } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import MarkerIcon from '../../assets/images/marker';
import InlineUI from './inline-ui';

/**
 * Edit component for the Marker format in the block editor.
 *
 * @param {Object}   props                  - The component properties.
 * @param {Object}   props.value            - The current value of the rich text.
 * @param {Function} props.onChange         - Function to update the rich text value.
 * @param {boolean}  props.isActive         - Indicates if the format is currently active.
 * @param {Object}   props.contentRef       - Reference to the editable content element.
 * @param {Object}   props.activeAttributes - The currently active attributes.
 * @return {JSX.Element} - The rendered Marker formats.
 */
export function Edit( {
	value,
	onChange,
	isActive,
	contentRef,
	activeAttributes,
} ) {
	const [ isSettingOpen, setIsSettingOpen ] = useState( false );

	return (
		<>
			<RichTextToolbarButton
				icon={ <MarkerIcon /> }
				title={ __( 'Marker', 'blablablocks-formats' ) }
				onClick={ () => setIsSettingOpen( true ) }
				isActive={ isActive }
			/>

			{ isSettingOpen && (
				<InlineUI
					value={ value }
					onChange={ onChange }
					onClose={ () => setIsSettingOpen( false ) }
					activeAttributes={ activeAttributes }
					contentRef={ contentRef.current }
					isActive={ isActive }
				/>
			) }
		</>
	);
}
