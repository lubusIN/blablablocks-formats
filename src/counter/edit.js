/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { applyFormat } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import CounterIcon from './icon';
import InlineUI from './inline-ui';
import { FORMAT_NAME, FORMAT_TITLE } from './index';

/**
 * Check if a string is a valid numeric value (allowing commas).
 *
 * @param {string} str - String to check.
 * @return {boolean} True if numeric.
 */
const isNumeric = ( str ) => {
	const cleaned = String( str ).replace( /,/g, '' ).trim();
	return /^[+-]?(\d+(\.\d+)?|\.\d+)$/.test( cleaned );
};

/**
 * Edit component for the Counter format.
 *
 * @param {Object}   props                  The component properties.
 * @param {Object}   props.value            The current value of the rich text.
 * @param {Function} props.onChange         Function to update the rich text value.
 * @param {boolean}  props.isActive         Indicates if the format is currently active.
 * @param {Object}   props.contentRef       Reference to the editable content element.
 * @param {Object}   props.activeAttributes The currently active attributes.
 * @return {JSX.Element} The rendered toolbar button and popover.
 */
export function Edit( {
	value,
	onChange,
	isActive,
	contentRef,
	activeAttributes,
} ) {
	const [ isPopoverOpen, setIsPopoverOpen ] = useState( false );
	const { createNotice } = useDispatch( 'core/notices' );

	const handleToggle = () => {
		if ( isActive ) {
			setIsPopoverOpen( ( prev ) => ! prev );
			return;
		}

		const { start, end, text } = value;
		const selected = text.slice( start, end );

		if ( ! selected ) {
			createNotice(
				'warning',
				__( 'Select a number to animate.', 'blablablocks-formats' ),
				{ type: 'snackbar' }
			);
			return;
		}

		if ( ! isNumeric( selected ) ) {
			createNotice(
				'warning',
				__(
					'Selection must be a number (e.g. 1500, 1,000, or 12.5).',
					'blablablocks-formats'
				),
				{ type: 'snackbar' }
			);
			return;
		}

		onChange(
			applyFormat( value, {
				type: FORMAT_NAME,
				attributes: {
					'data-anim': 'odometer',
					'data-duration': '1200',
					'data-on-scroll': 'true',
				},
			} )
		);

		setIsPopoverOpen( true );
	};

	return (
		<>
			<RichTextToolbarButton
				icon={ <CounterIcon /> }
				title={ FORMAT_TITLE }
				onClick={ handleToggle }
				isActive={ isActive }
				aria-haspopup="true"
				aria-expanded={ isPopoverOpen }
			/>

			{ isPopoverOpen && (
				<InlineUI
					value={ value }
					onChange={ onChange }
					onClose={ () => setIsPopoverOpen( false ) }
					activeAttributes={ activeAttributes }
					contentRef={ contentRef }
					isActive={ isActive }
				/>
			) }
		</>
	);
}
