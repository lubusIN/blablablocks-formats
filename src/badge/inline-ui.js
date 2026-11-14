/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useRef } from '@wordpress/element';
import { Popover, MenuItemsChoice } from '@wordpress/components';
import {
	slice,
	applyFormat,
	removeFormat,
	useAnchor,
	getTextContent,
} from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import { FORMAT_NAME, BADGE_PRESETS } from './constants';

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

	const text = getTextContent( slice( value ) );
	let displayText = null;
	if ( text ) {
		displayText = text.length > 20 ? `${ text.slice( 0, 20 ) }…` : text;
	}

	const choices = [
		{
			value: 'none',
			label: (
				<span className="has-badge">
					{ __( 'None', 'blablablocks-formats' ) }
				</span>
			),
		},
		...BADGE_PRESETS.map( ( preset ) => ( {
			value: `has-badge-${ preset.name }`,
			label: (
				<span className={ `has-badge has-badge-${ preset.name }` }>
					{ displayText || preset.label }
				</span>
			),
		} ) ),
	];

	const handleSelect = ( presetClass ) => {
		if (
			! presetClass ||
			'none' === presetClass ||
			activeAttributes?.class === presetClass
		) {
			onChange( removeFormat( value, FORMAT_NAME ) );
		} else {
			onChange(
				applyFormat( value, {
					type: FORMAT_NAME,
					attributes: {
						class: presetClass,
					},
				} )
			);
		}

		onClose();
	};

	const handleFocusOutside = ( event ) => {
		if (
			! event?.relatedTarget?.closest?.(
				'.components-popover, [role="dialog"], [role="menu"]'
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
			<MenuItemsChoice
				choices={ choices }
				value={ activeAttributes?.class || 'none' }
				onSelect={ handleSelect }
			/>
		</Popover>
	);
}

export default InlineUI;
