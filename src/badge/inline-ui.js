/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useRef } from '@wordpress/element';
import { Button, Popover, TabPanel } from '@wordpress/components';
import { applyFormat, removeFormat, useAnchor } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import { StyleTab, ColorTab } from './components';
import { FORMAT_NAME } from './constants';
import { getBadgeAttributes, getFormatRange } from './utils';

/**
 * InlineUI component for handling Badge formatting options.
 *
 * @param {Object}   props                  The component properties.
 * @param {Object}   props.value            The current value of the rich text.
 * @param {Function} props.onChange         Function to update the rich text value.
 * @param {Function} props.onClose          Function to close the popover.
 * @param {Object}   props.activeAttributes The currently active format attributes.
 * @param {Object}   props.contentRef       Reference to the editable content element.
 * @param {boolean}  props.isActive         Indicates if the format is currently active.
 * @return {JSX.Element} The rendered InlineUI component.
 */
function InlineUI( {
	value,
	onChange,
	onClose,
	activeAttributes,
	contentRef,
	isActive,
} ) {
	const anchorRef = useRef( null );
	const liveAnchor = useAnchor( {
		editableContentElement: contentRef?.current || contentRef,
		settings: { isActive },
	} );

	if ( liveAnchor ) {
		anchorRef.current = liveAnchor;
	}

	const { startIndex, endIndex } = getFormatRange( value, FORMAT_NAME );

	const activeFormat =
		value?.formats?.[ startIndex ]?.find?.(
			( f ) => f.type === FORMAT_NAME
		) || {};

	const currentAttributes = getBadgeAttributes( {
		...( activeAttributes || {} ),
		...( activeFormat.attributes || {} ),
	} );

	const handleUpdateAttributes = ( newAttrs ) => {
		const nextAttributes = getBadgeAttributes( {
			...currentAttributes,
			...newAttrs,
		} );

		const formatAttributes = {
			class: nextAttributes.class,
			...( nextAttributes.style ? { style: nextAttributes.style } : {} ),
		};

		onChange(
			applyFormat(
				value,
				{
					type: FORMAT_NAME,
					attributes: formatAttributes,
				},
				startIndex,
				endIndex
			)
		);
	};

	const handleClear = () => {
		onChange( removeFormat( value, FORMAT_NAME, startIndex, endIndex ) );
		onClose();
	};

	const handleFocusOutside = ( event ) => {
		if (
			! event?.relatedTarget?.closest?.(
				'.components-popover, .components-color-palette, [role="dialog"], [role="menu"]'
			)
		) {
			onClose();
		}
	};

	return (
		<Popover
			anchor={ liveAnchor || anchorRef.current }
			className="block-editor-format-toolbar__blablablocks-badge-popover"
			onClose={ onClose }
			onFocusOutside={ handleFocusOutside }
			offset={ 20 }
			placement="bottom"
			shift
			flip
		>
			<TabPanel
				className="block-editor-format-toolbar__blablablocks-badge-tab-panel"
				initialTabName="color"
				tabs={ [
					{
						name: 'color',
						title: __( 'Color', 'blablablocks-formats' ),
						content: (
							<ColorTab
								activeAttributes={ currentAttributes }
								updateAttributes={ handleUpdateAttributes }
							/>
						),
					},
					{
						name: 'style',
						title: __( 'Style', 'blablablocks-formats' ),
						content: (
							<StyleTab
								activeAttributes={ currentAttributes }
								updateAttributes={ handleUpdateAttributes }
							/>
						),
					},
				] }
			>
				{ ( tab ) => tab.content }
			</TabPanel>

			<Button
				accessibleWhenDisabled
				className="reset-button"
				onClick={ handleClear }
				variant="tertiary"
				isDestructive
				__next40pxDefaultSize
			>
				{ __( 'Clear', 'blablablocks-formats' ) }
			</Button>
		</Popover>
	);
}

export default InlineUI;
