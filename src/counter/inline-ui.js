/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
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
import { DEFAULT_ATTRIBUTES, ANIMATION_OPTIONS } from './constants';

/**
 * InlineUI component for handling number counter formatting options.
 *
 * @param {Object}      props                  The component properties.
 * @param {Object}      props.activeAttributes The currently active attributes.
 * @param {Object}      props.value            The current value of the rich text.
 * @param {Function}    props.onChange         Function to update the rich text value.
 * @param {Function}    props.onClose          Function to close the popover.
 * @param {HTMLElement} props.contentRef       Reference to the editable content element.
 * @param {boolean}     props.isActive         Indicates if the format is currently active.
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
	const anchor = useAnchor( {
		editableContentElement: contentRef?.current || contentRef,
		settings: { isActive },
	} );

	const { update } = createFormatHelpers( {
		value,
		onChange,
		formatType: FORMAT_NAME,
		activeAttributes,
	} );

	const currentAnim =
		activeAttributes?.animation || DEFAULT_ATTRIBUTES.animation;
	const parsedDuration = parseInt( activeAttributes?.duration, 10 );
	const currentDuration = Number.isFinite( parsedDuration )
		? parsedDuration
		: parseInt( DEFAULT_ATTRIBUTES.duration, 10 );
	const currentOnScroll = activeAttributes?.[ 'on-scroll' ] !== 'false';

	const handleClear = () => {
		onChange( removeFormat( value, FORMAT_NAME ) );
		onClose();
	};

	return (
		<Popover
			anchor={ anchor }
			className="block-editor-format-toolbar__blablablocks-number-counter-popover"
			onClose={ onClose }
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
				{ ANIMATION_OPTIONS.map( ( { value: optValue, label } ) => (
					<ToggleGroupControlOption
						key={ optValue }
						value={ optValue }
						label={ label }
					/>
				) ) }
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
				__nextHasNoMarginBottom
				label={ __( 'Animate on scroll', 'blablablocks-formats' ) }
				checked={ currentOnScroll }
				onChange={ ( checked ) =>
					update( {
						'on-scroll': String( checked ),
					} )
				}
				help={ __(
					'Trigger animation only when scrolled into view.',
					'blablablocks-formats'
				) }
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
