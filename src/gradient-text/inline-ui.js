/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useRef } from '@wordpress/element';
import { useAnchor } from '@wordpress/rich-text';
import { Popover, TabPanel } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { FORMAT_NAME } from './index';
import { GradientTab, AnimationTab } from './components';
import { getGradient } from './components/gradient-tab';
import { createFormatHelpers } from '../utils';

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
	const fallbackAnchorRef = useRef( null );
	const { update, remove } = createFormatHelpers( {
		value,
		onChange,
		formatType: FORMAT_NAME,
		activeAttributes,
	} );

	const liveAnchor = useAnchor( {
		editableContentElement: contentRef?.current || contentRef,
		settings: { isActive },
	} );

	useEffect( () => {
		if ( liveAnchor ) {
			fallbackAnchorRef.current = liveAnchor;
		}
	}, [ liveAnchor ] );

	const anchor = liveAnchor || fallbackAnchorRef.current;

	const currentGradient = getGradient( activeAttributes?.style );
	const hasGradient = Boolean( currentGradient );

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
			anchor={ anchor }
			className="block-editor-format-toolbar__blablablocks-gradient-text-popover"
			onClose={ onClose }
			onFocusOutside={ handleFocusOutside }
			offset={ 20 }
			placement="bottom"
			shift
			flip
		>
			<TabPanel
				tabs={ [
					{
						name: 'gradient',
						title: __( 'Gradient', 'blablablocks-formats' ),
						content: (
							<GradientTab
								activeAttributes={ activeAttributes }
								value={ value }
								onChange={ onChange }
								onClose={ onClose }
								updateAttributes={ update }
							/>
						),
					},
					{
						name: 'animation',
						title: __( 'Animation', 'blablablocks-formats' ),
						content: (
							<AnimationTab
								activeAttributes={ activeAttributes }
								updateAttributes={ update }
								removeAttributes={ remove }
							/>
						),
						disabled: ! hasGradient,
					},
				] }
			>
				{ ( tab ) => tab.content }
			</TabPanel>
		</Popover>
	);
}

export default InlineUI;
