/**
 * WordPress dependencies
 */
import { Popover } from '@wordpress/components';
import { useAnchor } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */

/**
 * InlineUI Renders an inline UI component with a popover.
 *
 * @param {Object}   props         - The properties passed to the component.
 * @param {Function} props.onClose - Callback function triggered when the popover is closed.
 * @return {JSX.Element}           - The rendered InlineUI component.
 */
export function InlineUI( { onClose, contentRef, isActive } ) {
	const anchor = useAnchor( {
		editableContentElement: contentRef,
		settings: { isActive },
	} );

	return (
		<Popover
			position="middle center"
			onClose={ onClose }
			anchor={ anchor }
			offset={ 30 }
		>
			<h2>Content goes here.</h2>
		</Popover>
	);
}
