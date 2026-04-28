/**
 * WordPress dependencies
 */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import { __ } from '@wordpress/i18n';
import { useEffect, useRef } from '@wordpress/element';
import { useAnchor } from '@wordpress/rich-text';
import { Button, FontSizePicker, Popover } from '@wordpress/components';
import {
	__experimentalFontAppearanceControl as FontAppearanceControl,
	__experimentalFontFamilyControl as FontFamilyControl,
	__experimentalLetterSpacingControl as LetterSpacingControl,
	__experimentalTextTransformControl as TextTransformControl,
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
function InlineUI({
	value,
	onChange,
	onClose,
	activeAttributes,
	contentRef,
	isActive,
}) {
	const liveAnchor = useAnchor({
		editableContentElement: contentRef,
		settings: { isActive },
	});
	const fallbackAnchorRef = useRef(null);

	useEffect(() => {
		if (liveAnchor) {
			fallbackAnchorRef.current = liveAnchor;
		}
	}, [liveAnchor]);

	const anchor = liveAnchor || fallbackAnchorRef.current;

	const {
		values,
		fontFamilies,
		fontSizes,
		fontFamilyFaces,
		hasAnyValue,
		updateTypography,
		clearAll,
	} = useTypography({
		value,
		onChange,
		activeAttributes,
	});

	const handleFocusOutside = (event) => {
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
			anchor={anchor}
			className="block-editor-format-toolbar__blablablocks-typography-popover"
			flip
			offset={20}
			onClose={onClose}
			onFocusOutside={handleFocusOutside}
			placement="bottom"
			shift
		>
			<FontFamilyControl
				className="is-full-width"
				value={values.fontFamily}
				onChange={(newValue) =>
					updateTypography({
						fontFamily: newValue || '',
					})
				}
				{...(fontFamilies.length > 0 ? { fontFamilies } : {})}
				__next40pxDefaultSize
			/>

			<div>
				<FontSizePicker
					className="is-full-width"
					value={values.fontSize}
					onChange={(newValue) =>
						updateTypography({
							fontSize: newValue || '',
						})
					}
					fontSizes={fontSizes}
					disableCustomFontSizes={false}
					withSlider
					withReset={false}
					__next40pxDefaultSize
				/>
			</div>

			<FontAppearanceControl
				className="is-full-width"
				value={{
					fontStyle: values.fontStyle || undefined,
					fontWeight: values.fontWeight || undefined,
				}}
				onChange={(nextValue) =>
					updateTypography({
						fontStyle: nextValue.fontStyle || '',
						fontWeight: nextValue.fontWeight || '',
					})
				}
				fontFamilyFaces={fontFamilyFaces}
				__next40pxDefaultSize
			/>

			<LetterSpacingControl
				className="is-inline-pair"
				value={values.letterSpacing || undefined}
				onChange={(newValue) =>
					updateTypography({
						letterSpacing: newValue || '',
					})
				}
				__unstableInputWidth="auto"
				__next40pxDefaultSize
			/>

			<TextTransformControl
				className="is-inline-pair"
				value={values.textTransform || undefined}
				onChange={(newValue) =>
					updateTypography({
						textTransform: newValue || '',
					})
				}
				showNone
				isBlock
				size="__unstable-large"
			/>

			<Button
				className="reset-button"
				disabled={!hasAnyValue}
				onClick={clearAll}
				variant="tertiary"
			>
				{__('Clear', 'blablablocks-formats')}
			</Button>
		</Popover>
	);
}

export default InlineUI;
