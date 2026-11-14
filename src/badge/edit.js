/**
 * WordPress dependencies
 */
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';
import { applyFormat } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import BadgeIcon from './icon';
import InlineUI from './inline-ui';
import { FORMAT_NAME, FORMAT_TITLE } from './constants';
import { getBadgeAttributes, getFormatRange } from './utils';

/**
 * Edit component for the Badge format.
 *
 * @param {Object}   props                  The component properties.
 * @param {Object}   props.value            The current value of the rich text.
 * @param {Function} props.onChange         Function to update the rich text value.
 * @param {boolean}  props.isActive         Indicates if the format is currently active.
 * @param {Object}   props.contentRef       Reference to the editable content element.
 * @param {Object}   props.activeAttributes The currently active attributes.
 * @return {JSX.Element} The rendered badge button and popover.
 */
export function Edit( {
	value,
	onChange,
	isActive,
	contentRef,
	activeAttributes,
} ) {
	const [ isPopoverOpen, setIsPopoverOpen ] = useState( false );

	const handleToggle = () => {
		if ( ! isPopoverOpen && ! isActive ) {
			const initialAttrs = getBadgeAttributes();
			const { startIndex, endIndex } = getFormatRange(
				value,
				FORMAT_NAME
			);
			onChange(
				applyFormat(
					value,
					{
						type: FORMAT_NAME,
						attributes: {
							class: initialAttrs.class,
							...( initialAttrs.style
								? { style: initialAttrs.style }
								: {} ),
						},
					},
					startIndex,
					endIndex
				)
			);
		}
		setIsPopoverOpen( ( prev ) => ! prev );
	};

	return (
		<>
			<RichTextToolbarButton
				icon={ <BadgeIcon /> }
				title={ FORMAT_TITLE }
				onClick={ handleToggle }
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
