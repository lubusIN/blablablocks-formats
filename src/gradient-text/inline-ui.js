/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useRef } from '@wordpress/element';
import { applyFormat, removeFormat, useAnchor } from '@wordpress/rich-text';
import { GradientPicker, Popover } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { FORMAT_NAME } from './index';

/**
 * Extract gradient string from inline style value.
 *
 * @param {string} style The style attribute string.
 * @return {string} The extracted gradient value.
 */
const getGradient = ( style ) =>
	style?.match( /background(?:-image)?:\s*([^;]+)/i )?.[ 1 ]?.trim() ||
	style ||
	'';

/**
 * InlineUI component for handling Gradient text formatting options.
 *
 * @param {Object}   props                  The component properties.
 * @param {Object}   props.activeAttributes The currently active attributes.
 * @param {Object}   props.value            The current value of the rich text.
 * @param {Function} props.onChange         Function to update the rich text value.
 * @param {Function} props.onClose          Function to close the popover.
 * @param {Object}   props.contentRef       Reference to the editable content element.
 * @param {boolean}  props.isActive         Indicates if the format is currently active.
 * @return {JSX.Element} The rendered InlineUI component.
 */
function InlineUI( {
	activeAttributes,
	value,
	onChange,
	onClose,
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

	const gradients = useSelect(
		( select ) => select( 'core/block-editor' )?.getSettings()?.gradients,
		[]
	);

	const currentGradient = getGradient( activeAttributes?.style );

	const handleClear = () => {
		onChange( removeFormat( value, FORMAT_NAME ) );
		onClose();
	};

	const handleGradientChange = ( newGradient ) => {
		if ( ! newGradient ) {
			handleClear();
			return;
		}

		onChange(
			applyFormat( value, {
				type: FORMAT_NAME,
				attributes: {
					style: `background-image: ${ newGradient };`,
				},
			} )
		);
	};

	const handleFocusOutside = ( event ) => {
		if (
			! event?.relatedTarget?.closest?.(
				'.components-custom-gradient-picker, .components-popover, [role="dialog"]'
			)
		) {
			onClose();
		}
	};

	return (
		<Popover
			anchor={ liveAnchor || anchorRef.current }
			className="block-editor-format-toolbar__blablablocks-gradient-text-popover"
			onClose={ onClose }
			onFocusOutside={ handleFocusOutside }
			offset={ 20 }
			placement="bottom"
			shift
			flip
		>
			<GradientPicker
				value={ currentGradient || undefined }
				gradients={ gradients }
				onChange={ handleGradientChange }
				clearable={ Boolean( currentGradient ) }
				aria-label={ __(
					'Gradient text selection',
					'blablablocks-formats'
				) }
			/>
		</Popover>
	);
}

export default InlineUI;
