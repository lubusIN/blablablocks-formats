/**
 * External dependencies
 */
import tinycolor from 'tinycolor2';

/**
 * WordPress dependencies
 */
import { brush } from '@wordpress/icons';
import { useState } from '@wordpress/element';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { applyFormat, getTextContent, slice } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import InlineUI from './inline-ui';
import { useAutoColorFormat } from './hooks';
import { FORMAT_NAME, FORMAT_TITLE } from './index';
import { getColorTokenAttributes } from './utils';

/**
 * Edit component for the Color Token format in the block editor.
 *
 * @param {Object}   props                  - The component properties.
 * @param {Object}   props.value            - The current value of the rich text.
 * @param {Function} props.onChange         - Function to update the rich text value.
 * @param {Function} props.onFocus          - Function to handle focus events.
 * @param {boolean}  props.isActive         - Indicates if the format is currently active.
 * @param {Object}   props.activeAttributes - The currently active attributes.
 * @param {Object}   props.contentRef       - Reference to the editable content element.
 * @return {JSX.Element} - The rendered Color Token button and inline UI.
 */
export function Edit( {
	value,
	onChange,
	onFocus,
	isActive,
	activeAttributes,
	contentRef,
} ) {
	const [ isSettingOpen, setIsSettingOpen ] = useState( false );

	// Attach auto-formatting on paste and typing
	useAutoColorFormat( { value, onChange, contentRef } );

	const openSettings = () => setIsSettingOpen( true );
	const closeSettings = () => setIsSettingOpen( false );

	const onToggle = () => {
		const colorInput = getTextContent( slice( value ) );
		const colorObj = tinycolor( colorInput );

		if ( colorObj.isValid() ) {
			const colorAttrs = getColorTokenAttributes( colorInput );

			onChange(
				applyFormat( value, {
					type: FORMAT_NAME,
					attributes: colorAttrs,
				} )
			);
		} else {
			openSettings();
		}
	};

	const handleButtonClick = () => {
		if ( activeAttributes?.color ) {
			openSettings();
		} else {
			onToggle();
		}
		if ( typeof onFocus === 'function' ) {
			onFocus();
		}
	};

	return (
		<>
			<RichTextToolbarButton
				icon={ brush }
				title={ FORMAT_TITLE }
				onClick={ handleButtonClick }
				isActive={ isActive }
			/>

			{ isSettingOpen && (
				<InlineUI
					value={ value }
					onChange={ onChange }
					onClose={ closeSettings }
					activeAttributes={ activeAttributes }
					contentRef={ contentRef }
					isActive={ isActive }
				/>
			) }
		</>
	);
}
