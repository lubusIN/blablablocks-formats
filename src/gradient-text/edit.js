/**
 * WordPress dependencies
 */
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import InlineUI from './inline-ui';
import GradientTextIcon from './icon';
import { FORMAT_TITLE } from './index';

/**
 * Edit component for the Gradient Text format.
 *
 * @param {Object}   props                  The component properties.
 * @param {Object}   props.value            The current value of the rich text.
 * @param {Function} props.onChange         Function to update the rich text value.
 * @param {boolean}  props.isActive         Indicates if the format is currently active.
 * @param {Object}   props.contentRef       Reference to the editable content element.
 * @param {Object}   props.activeAttributes The currently active attributes.
 * @return {JSX.Element} The rendered gradient text button and popover.
 */
export function Edit( {
	value,
	onChange,
	isActive,
	contentRef,
	activeAttributes,
} ) {
	const [ isPopoverOpen, setIsPopoverOpen ] = useState( false );

	return (
		<>
			<RichTextToolbarButton
				icon={ <GradientTextIcon /> }
				title={ FORMAT_TITLE }
				onClick={ () => setIsPopoverOpen( ( prev ) => ! prev ) }
				isActive={ isActive }
				aria-haspopup="true"
				aria-expanded={ isPopoverOpen }
			/>
			{ isPopoverOpen && (
				<InlineUI
					value={ value }
					onChange={ onChange }
					onClose={ () => setIsPopoverOpen( false ) }
					activeAttributes={ activeAttributes }
					contentRef={ contentRef }
					isActive={ isActive }
				/>
			) }
		</>
	);
}
