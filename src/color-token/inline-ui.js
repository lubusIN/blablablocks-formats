/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useEffect, useRef } from '@wordpress/element';
import { ColorPalette, Popover } from '@wordpress/components';
import { applyFormat, removeFormat, useAnchor } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import { FORMAT_NAME } from './index';
import { getColorTokenAttributes } from './utils';

/**
 * InlineUI component for handling Color Token formatting options.
 *
 * @param {Object}   props                  - The component properties.
 * @param {Object}   props.value            - The current rich text value.
 * @param {Function} props.onChange         - Callback to update the format.
 * @param {Function} props.onClose          - Callback to close the UI.
 * @param {Object}   props.activeAttributes - The currently active format attributes.
 * @param {Object}   props.contentRef       - Reference to the content element.
 * @param {boolean}  props.isActive         - Indicates if the format is active.
 * @return {JSX.Element} - The rendered popover.
 */
function InlineUI( {
	value,
	onChange,
	onClose,
	activeAttributes,
	contentRef,
	isActive,
} ) {
	const liveAnchor = useAnchor( {
		editableContentElement: contentRef,
		settings: { isActive },
	} );
	const fallbackAnchorRef = useRef( null );

	useEffect( () => {
		if ( liveAnchor ) {
			fallbackAnchorRef.current = liveAnchor;
		}
	}, [ liveAnchor ] );

	const anchor = liveAnchor || fallbackAnchorRef.current;

	const themeColors = useSelect(
		( select ) => select( 'core/block-editor' ).getSettings().colors,
		[]
	);

	const currentColor = activeAttributes?.color || '';

	const handleColorChange = ( newColor ) => {
		if ( newColor ) {
			const colorAttrs = getColorTokenAttributes( newColor );

			onChange(
				applyFormat( value, {
					type: FORMAT_NAME,
					attributes: colorAttrs,
				} )
			);
		} else {
			handleClear();
		}
	};

	const handleClear = () => {
		onChange( removeFormat( value, FORMAT_NAME ) );
		onClose();
	};

	return (
		<Popover
			anchor={ anchor }
			className="block-editor-format-toolbar__blablablocks-color-token-popover"
			onClose={ onClose }
			offset={ 20 }
			placement="bottom"
			shift
			flip
		>
			<ColorPalette
				value={ currentColor }
				onChange={ handleColorChange }
				colors={ themeColors }
				clearable
				aria-label={ __(
					'Color token color selection',
					'blablablocks-formats'
				) }
			/>
		</Popover>
	);
}

export default InlineUI;
