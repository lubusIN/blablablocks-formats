/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useAnchor } from '@wordpress/rich-text';
import { Popover, TabPanel } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { StyleTab, ColorTab, SettingsTab } from './components';
import { createFormatHelpers } from '../utils';

/**
 * InlineUI component for handling Pulse text formatting options.
 *
 * @param {Object}   props                  - The component properties.
 * @param {Object}   props.value            - The current rich text value.
 * @param {Function} props.onChange         - Callback to update the format.
 * @param {Function} props.onClose          - Callback to close the UI.
 * @param {Object}   props.activeAttributes - The currently active format attributes.
 * @param {Object}   props.contentRef       - Reference to the content element.
 * @param {boolean}  props.isActive         - Indicates if the format is active.
 * @return {JSX.Element}                    - The rendered component.
 */
function InlineUI( {
	value,
	onChange,
	onClose,
	activeAttributes,
	contentRef,
	isActive,
} ) {
	const { update, remove } = createFormatHelpers( {
		value,
		onChange,
		formatType: 'blablablocks/pulse',
		activeAttributes,
	} );

	const anchor = useAnchor( {
		editableContentElement: contentRef,
		settings: { isActive },
	} );

	return (
		<Popover
			anchor={ anchor }
			className="block-editor-format-toolbar__blablablocks-pulse-popover"
			offset={ 20 }
			onClose={ onClose }
			placement="bottom"
			shift
		>
			<TabPanel
				tabs={ [
					{
						name: 'style',
						title: __( 'Style', 'blablablocks-formats' ),
						content: (
							<StyleTab
								activeAttributes={ activeAttributes }
								onChange={ onChange }
								onClose={ onClose }
								updateAttributes={ update }
								value={ value }
								isActive={ isActive }
							/>
						),
					},
					{
						name: 'color',
						title: __( 'Color', 'blablablocks-formats' ),
						content: (
							<ColorTab
								currentColor={ activeAttributes.color }
								updateAttributes={ update }
								removeAttributes={ remove }
							/>
						),
						disabled: ! isActive,
					},
					{
						name: 'settings',
						title: __( 'Settings', 'blablablocks-formats' ),
						content: (
							<SettingsTab
								activeAttributes={ activeAttributes }
								updateAttributes={ update }
								removeAttributes={ remove }
							/>
						),
						disabled: ! isActive,
					},
				] }
			>
				{ ( tab ) => tab.content }
			</TabPanel>
		</Popover>
	);
}

export default InlineUI;
