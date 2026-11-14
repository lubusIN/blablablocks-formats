/**
 * WordPress dependencies
 */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import { __ } from '@wordpress/i18n';
import { useRef } from '@wordpress/element';
import {
	Button,
	Popover,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { applyFormat, removeFormat, useAnchor } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import { FORMAT_NAME, FORMAT_TITLE, RATINGS } from './constants';
import { getFormatRange } from './utils';

/**
 * InlineUI component for handling Rating format options.
 *
 * @param {Object}   props                  - Component properties.
 * @param {Object}   props.value            - Current rich text value.
 * @param {Function} props.onChange         - Function to update rich text.
 * @param {Function} props.onClose          - Function to close the popover.
 * @param {Object}   props.activeAttributes - Currently active format attributes.
 * @param {Object}   props.contentRef       - Reference to editable content element.
 * @param {boolean}  props.isActive         - Indicates if format is currently active.
 * @return {JSX.Element} Rendered InlineUI popover.
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
		editableContentElement: contentRef,
		settings: { title: FORMAT_TITLE, isActive },
	} );

	if ( liveAnchor ) {
		anchorRef.current = liveAnchor;
	}

	const anchor = liveAnchor || anchorRef.current;
	const { startIndex, endIndex } = getFormatRange( value, FORMAT_NAME );

	const currentClass = activeAttributes?.class || '';
	const currentRatingObject = RATINGS.find( ( r ) =>
		currentClass.includes( r.class )
	);
	const currentRating = currentRatingObject?.class || '';

	const handleSetRating = ( selectedClass ) => {
		if ( ! selectedClass || selectedClass === currentRating ) {
			handleClear();
			return;
		}

		onChange(
			applyFormat(
				value,
				{
					type: FORMAT_NAME,
					attributes: {
						class: selectedClass,
					},
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

	return (
		<Popover
			anchor={ anchor }
			className="block-editor-format-toolbar__blablablocks-rating-popover"
			offset={ 20 }
			onClose={ onClose }
			placement="bottom"
			shift
		>
			<div className="blablablocks-rating-popover-content">
				<VStack spacing={ 3 }>
					<ToggleGroupControl
						label={ __( 'Rating', 'blablablocks-formats' ) }
						value={ currentRating }
						onChange={ handleSetRating }
						isBlock
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					>
						{ RATINGS.map( ( rating ) => (
							<ToggleGroupControlOption
								key={ rating.class }
								value={ rating.class }
								label={ rating.value }
								aria-label={ rating.label }
							/>
						) ) }
					</ToggleGroupControl>

					<Button
						accessibleWhenDisabled
						className="reset-button"
						disabled={ ! currentRating }
						isDestructive
						onClick={ handleClear }
						variant="tertiary"
						__next40pxDefaultSize
					>
						{ __( 'Clear', 'blablablocks-formats' ) }
					</Button>
				</VStack>
			</div>
		</Popover>
	);
}

export default InlineUI;
