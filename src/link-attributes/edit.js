/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { getActiveFormat } from '@wordpress/rich-text';
import { customLink } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import InlineUI from './inline-ui';
import { getCustomLinkAttributes } from './hooks';

/**
 * Edit component for the Link Attributes format toolbar control.
 *
 * @param {Object}   props            - Component props.
 * @param {Object}   props.value      - RichText value.
 * @param {Function} props.onChange   - RichText onChange callback.
 * @param {Function} props.onFocus    - Function to handle focus events.
 * @param {Object}   props.contentRef - Reference to editable content element.
 * @return {JSX.Element|null} The toolbar button and popover or null if no link is active.
 */
export function Edit( { value, onChange, onFocus, contentRef } ) {
	const [ isPopoverOpen, setIsPopoverOpen ] = useState( false );
	const activeLink = getActiveFormat( value, 'core/link' );

	if ( ! activeLink ) {
		return null;
	}

	const hasCustomAttributes =
		getCustomLinkAttributes( activeLink ).length > 0;

	const handleButtonClick = () => {
		setIsPopoverOpen( ( prev ) => ! prev );
		if ( typeof onFocus === 'function' ) {
			onFocus();
		}
	};

	return (
		<>
			<RichTextToolbarButton
				icon={ customLink }
				title={ __( 'Link Attributes', 'blablablocks-formats' ) }
				onClick={ handleButtonClick }
				isActive={ hasCustomAttributes }
			/>

			{ isPopoverOpen && (
				<InlineUI
					value={ value }
					onChange={ onChange }
					onClose={ () => setIsPopoverOpen( false ) }
					contentRef={ contentRef }
				/>
			) }
		</>
	);
}
