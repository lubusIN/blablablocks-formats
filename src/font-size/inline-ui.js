/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useAnchor } from '@wordpress/rich-text';
import { Popover, Button, FontSizePicker } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { useFontSize } from './hooks';

/**
 * InlineUI component for handling FontSize text formatting options.
 *
 * @param {Object}   props                  - The component properties.
 * @param {string}   props.value            - The current rich text value.
 * @param {Function} props.onChange         - Callback to update the format.
 * @param {Function} props.onClose          - Callback to close the UI.
 * @param {Object}   props.activeAttributes - The currently active format attributes.
 * @param {Object}   props.contentRef       - Reference to the content element.
 * @param {boolean}  props.isActive         - Indicates if the format is active.
 * @return {JSX.Element}                    - The rendered component.
 */
function InlineUI( {
	value,
	onChange,
	onClose,
	activeAttributes,
	contentRef,
	isActive,
} ) {
	const anchor = useAnchor( {
		editableContentElement: contentRef,
		settings: { isActive },
	} );

	const {
		fontSizes,
		fontSizeValue,
		onFontSizeChange,
		onClear,
	} = useFontSize( {
		value,
		onChange,
		activeAttributes,
	} );

	const handleClear = () => {
		onClear();
		onClose();
	};

	return (
		<Popover
			anchor={ anchor }
			className="block-editor-format-toolbar__blablablocks-font-size-popover"
			offset={ 20 }
			onClose={ onClose }
			placement="bottom"
			shift
		>
			<div style={ { padding: '16px', minWidth: '220px' } }>
				<FontSizePicker
					value={ fontSizeValue }
					onChange={ onFontSizeChange }
					fontSizes={ fontSizes }
					__next40pxDefaultSize
				/>
				<Button
					className="reset-button"
					disabled={ ! fontSizeValue }
					onClick={ handleClear }
					variant="tertiary"
				>
					{ __( 'Clear', 'blablablocks-formats' ) }
				</Button>
			</div>
		</Popover>
	);
}

export default InlineUI;
