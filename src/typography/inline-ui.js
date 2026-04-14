/**
 * WordPress dependencies
 */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import { __ } from '@wordpress/i18n';
import { useEffect, useRef } from '@wordpress/element';
import { useAnchor } from '@wordpress/rich-text';
import {
	Button,
	FontSizePicker,
	Popover,
	ToggleControl,
} from '@wordpress/components';
import {
	LineHeightControl,
	__experimentalFontAppearanceControl as FontAppearanceControl,
	__experimentalFontFamilyControl as FontFamilyControl,
	__experimentalLetterSpacingControl as LetterSpacingControl,
	__experimentalTextDecorationControl as TextDecorationControl,
	__experimentalTextTransformControl as TextTransformControl,
	__experimentalWritingModeControl as WritingModeControl,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { useTypography } from './hooks';

/**
 * Inline UI component for typography controls.
 *
 * @param {Object}   props                  - The component properties.
 * @param {Object}   props.value            - The current rich text value.
 * @param {Function} props.onChange         - Callback to update the format.
 * @param {Function} props.onClose          - Callback to close the UI.
 * @param {Object}   props.activeAttributes - The currently active format attributes.
 * @param {Object}   props.contentRef       - Reference to the content element.
 * @param {boolean}  props.isActive         - Indicates if the format is active.
 * @return {JSX.Element}                    - The rendered typography popover.
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

	const {
		values,
		fontFamilies,
		fontSizes,
		fontFamilyFaces,
		hasAnyValue,
		updateTypography,
		clearAll,
	} = useTypography( {
		value,
		onChange,
		activeAttributes,
	} );

	const handleFocusOutside = ( event ) => {
		const nextFocusedElement =
			event?.relatedTarget instanceof HTMLElement
				? event.relatedTarget
				: null;

		if (
			nextFocusedElement?.closest(
				'.components-custom-select-control, [role="listbox"], [role="option"]'
			)
		) {
			event.preventDefault();
			return;
		}

		onClose();
	};

	return (
		<Popover
			anchor={ anchor }
			className="block-editor-format-toolbar__blablablocks-typography-popover"
			flip
			offset={ 20 }
			onClose={ onClose }
			onFocusOutside={ handleFocusOutside }
			placement="bottom"
			shift
		>
			<div className="block-editor-format-toolbar__blablablocks-typography-fields">
				<div className="block-editor-format-toolbar__blablablocks-typography-field">
					<FontFamilyControl
						value={ values.fontFamily }
						onChange={ ( newValue ) =>
							updateTypography( {
								fontFamily: newValue || '',
							} )
						}
						{ ...( fontFamilies.length > 0
							? { fontFamilies }
							: {} ) }
						__next40pxDefaultSize
					/>
				</div>

				<div className="block-editor-format-toolbar__blablablocks-typography-field">
					<FontSizePicker
						value={ values.fontSize }
						onChange={ ( newValue ) =>
							updateTypography( {
								fontSize: newValue || '',
							} )
						}
						fontSizes={ fontSizes }
						disableCustomFontSizes={ false }
						withSlider
						withReset={ false }
						__next40pxDefaultSize
					/>
				</div>

				<div className="block-editor-format-toolbar__blablablocks-typography-field">
					<FontAppearanceControl
						value={ {
							fontStyle: values.fontStyle || undefined,
							fontWeight: values.fontWeight || undefined,
						} }
						onChange={ ( nextValue ) =>
							updateTypography( {
								fontStyle: nextValue.fontStyle || '',
								fontWeight: nextValue.fontWeight || '',
							} )
						}
						fontFamilyFaces={ fontFamilyFaces }
						__next40pxDefaultSize
					/>
				</div>

				<div className="block-editor-format-toolbar__blablablocks-typography-field is-inline-pair">
					<LineHeightControl
						value={ values.lineHeight || undefined }
						onChange={ ( newValue ) =>
							updateTypography( {
								lineHeight: newValue || '',
							} )
						}
						__unstableInputWidth="auto"
						__next40pxDefaultSize
					/>
				</div>

				<div className="block-editor-format-toolbar__blablablocks-typography-field is-inline-pair">
					<LetterSpacingControl
						value={ values.letterSpacing || undefined }
						onChange={ ( newValue ) =>
							updateTypography( {
								letterSpacing: newValue || '',
							} )
						}
						__unstableInputWidth="auto"
						__next40pxDefaultSize
					/>
				</div>

				<div className="block-editor-format-toolbar__blablablocks-typography-field is-inline-pair">
					<WritingModeControl
						value={ values.writingMode || undefined }
						onChange={ ( newValue ) =>
							updateTypography( {
								writingMode: newValue || '',
							} )
						}
						size="__unstable-large"
					/>
				</div>

				<div className="block-editor-format-toolbar__blablablocks-typography-field is-inline-pair">
					<TextDecorationControl
						value={ values.textDecoration || undefined }
						onChange={ ( newValue ) =>
							updateTypography( {
								textDecoration: newValue || '',
							} )
						}
						__unstableInputWidth="auto"
						__next40pxDefaultSize
					/>
				</div>

				<div className="block-editor-format-toolbar__blablablocks-typography-field">
					<TextTransformControl
						value={ values.textTransform || undefined }
						onChange={ ( newValue ) =>
							updateTypography( {
								textTransform: newValue || '',
							} )
						}
						showNone
						isBlock
						size="__unstable-large"
					/>
				</div>

				<div className="block-editor-format-toolbar__blablablocks-typography-field">
					<ToggleControl
						label={ __( 'Drop cap', 'blablablocks-formats' ) }
						checked={ values.dropCap }
						onChange={ ( nextValue ) =>
							updateTypography( {
								dropCap: nextValue,
							} )
						}
						help={ __(
							'Show a large initial letter.',
							'blablablocks-formats'
						) }
					/>
				</div>
			</div>

			<Button
				className="reset-button"
				disabled={ ! hasAnyValue }
				onClick={ clearAll }
				variant="tertiary"
			>
				{ __( 'Clear', 'blablablocks-formats' ) }
			</Button>
		</Popover>
	);
}

export default InlineUI;
