/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useAnchor, removeFormat } from '@wordpress/rich-text';
import { Popover, Button, FontSizePicker } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { createFormatHelpers } from '../utils';

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
	const { replace } = createFormatHelpers( {
		value,
		onChange,
		formatType: 'blablablocks/font-size',
		activeAttributes,
	} );

	const anchor = useAnchor( {
		editableContentElement: contentRef,
		settings: { isActive },
	} );

	const fontSizes = useSelect(
		( select ) => select( 'core/block-editor' ).getSettings().fontSizes,
		[]
	);

	const handleFontSizeChange = ( newFontSize ) => {
		if ( newFontSize ) {
			// Find the font size object to get the slug
			const fontSizeObj = fontSizes?.find(
				( size ) =>
					size.size === newFontSize || size.slug === newFontSize
			);

			if ( fontSizeObj && fontSizeObj.slug ) {
				// Use CSS class for theme-defined font sizes
				replace( {
					class: `has-${ fontSizeObj.slug }-font-size`,
					style: undefined,
				} );
			} else {
				// Use inline style for custom font sizes
				replace( {
					style: `font-size: ${ newFontSize }`,
					class: undefined,
				} );
			}
		}
	};

	const handleClear = () => {
		onChange( removeFormat( value, 'blablablocks/font-size' ) );
		onClose();
	};

	// Extract current font size from class or style attribute
	const getCurrentFontSize = () => {
		// Check if there's a class attribute with has-*-font-size pattern
		const classAttr = activeAttributes.class;
		if ( classAttr ) {
			const match = classAttr.match( /has-([a-z0-9-]+)-font-size/ );
			if ( match ) {
				const slug = match[ 1 ];
				const fontSizeObj = fontSizes?.find(
					( size ) => size.slug === slug
				);
				return fontSizeObj ? fontSizeObj.size : null;
			}
		}

		// Check if there's a style attribute with font-size
		const styleAttr = activeAttributes.style;
		if ( styleAttr ) {
			const match = styleAttr.match( /font-size:\s*([^;]+)/ );
			if ( match ) {
				return match[ 1 ].trim();
			}
		}

		return null;
	};

	const fontSizeValue = getCurrentFontSize();

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
					onChange={ handleFontSizeChange }
					fontSizes={ fontSizes }
				/>
				<Button
					className="reset-button"
					disabled={ ! fontSizeValue }
					onClick={ handleClear }
					variant="tertiary"
					style={ { marginTop: '12px', width: '100%' } }
				>
					{ __( 'Clear', 'blablablocks-formats' ) }
				</Button>
			</div>
		</Popover>
	);
}

export default InlineUI;
