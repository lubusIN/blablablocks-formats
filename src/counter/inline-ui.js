/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useRef } from '@wordpress/element';
import { removeFormat, useAnchor } from '@wordpress/rich-text';
import {
	Button,
	Popover,
	RangeControl,
	ToggleControl,
	__experimentalToggleGroupControl as ToggleGroupControl, // eslint-disable-line @wordpress/no-unsafe-wp-apis
	__experimentalToggleGroupControlOption as ToggleGroupControlOption, // eslint-disable-line @wordpress/no-unsafe-wp-apis
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { FORMAT_NAME } from './index';
import { createFormatHelpers } from '../utils';

/**
 * InlineUI component for handling number counter formatting options.
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

	const { update } = createFormatHelpers( {
		value,
		onChange,
		formatType: FORMAT_NAME,
		activeAttributes,
	} );

	const currentAnim = activeAttributes?.animation || 'odometer';
	const currentDuration = parseInt(
		activeAttributes?.duration || '1200',
		10
	);
	const currentOnScroll =
		( activeAttributes?.[ 'on-scroll' ] ?? 'true' ).toString() !== 'false';

	const handleClear = () => {
		onChange( removeFormat( value, FORMAT_NAME ) );
		onClose();
	};

	const handleFocusOutside = ( event ) => {
		if (
			! event?.relatedTarget?.closest?.(
				'.components-popover, [role="dialog"]'
			)
		) {
			onClose();
		}
	};

	return (
		<Popover
			anchor={ liveAnchor || anchorRef.current }
			className="block-editor-format-toolbar__blablablocks-number-counter-popover"
			onClose={ onClose }
			onFocusOutside={ handleFocusOutside }
			offset={ 20 }
			placement="bottom"
			shift
			flip
		>
			<ToggleGroupControl
				label={ __( 'Animation', 'blablablocks-formats' ) }
				value={ currentAnim }
				onChange={ ( anim ) => update( { animation: anim } ) }
				isBlock
				__next40pxDefaultSize
			>
				<ToggleGroupControlOption
					value="odometer"
					label={ __( 'Odometer', 'blablablocks-formats' ) }
				/>
				<ToggleGroupControlOption
					value="linear"
					label={ __( 'Linear', 'blablablocks-formats' ) }
				/>
				<ToggleGroupControlOption
					value="steps"
					label={ __( 'Steps', 'blablablocks-formats' ) }
				/>
				<ToggleGroupControlOption
					value="scramble"
					label={ __( 'Scramble', 'blablablocks-formats' ) }
				/>
			</ToggleGroupControl>

			<RangeControl
				label={ __( 'Duration (ms)', 'blablablocks-formats' ) }
				value={ currentDuration }
				onChange={ ( duration ) =>
					update( { duration: String( duration ) } )
				}
				min={ 300 }
				max={ 10000 }
				step={ 100 }
				__next40pxDefaultSize
			/>

			<ToggleControl
				label={ __(
					'Start when scrolled into view',
					'blablablocks-formats'
				) }
				checked={ currentOnScroll }
				onChange={ ( checked ) =>
					update( {
						'on-scroll': checked ? 'true' : 'false',
					} )
				}
				help={
					currentOnScroll
						? __(
								'Animate when this number enters the viewport.',
								'blablablocks-formats'
						  )
						: __(
								'Animate immediately on load.',
								'blablablocks-formats'
						  )
				}
			/>

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
