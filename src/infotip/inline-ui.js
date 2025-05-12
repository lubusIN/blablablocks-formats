/**
 * WordPress dependencies
 */
import { Popover, TabPanel } from '@wordpress/components';
import { useAnchor } from '@wordpress/rich-text';
import { __ } from '@wordpress/i18n';

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
			anchor={ anchor }
			className="block-editor-format-toolbar__blablablocks-infotip-popover"
			position="middle center"
			onClose={ onClose }
			offset={ 30 }
			shift={ true }
		>
			<TabPanel
				className="block-editor-format-toolbar__blablablocks-infotip-tab-panel"
				tabs={ [
					{
						name: 'text',
						title: __( 'Text', 'blablablocks-formats' ),
						content: 'Content for Tab 1',
					},
					{
						name: 'icon',
						title: __( 'Icon', 'blablablocks-formats' ),
						content: 'Content for Tab 2',
					},
				] }
			>
				{ ( tab ) => tab.content }
			</TabPanel>
		</Popover>
	);
}
