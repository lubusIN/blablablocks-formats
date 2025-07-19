/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useAnchor } from '@wordpress/rich-text';
import { Popover, TabPanel } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { IconTab, OverlayTab, TextTab } from './components';
import { createFormatHelpers } from '../utils';

/**
 * InlineUI component for handling Marker text formatting options.
 *
 * @param {Object} props - The component properties.
 * @param {Object} props.activeAttributes - The currently active attributes.
 * @param {string} props.name - The name of the format type.
 * @param {Object} props.value - The current value of the rich text.	
 * @param {Function} props.onChange - Function to update the rich text value.
 * @param {Function} props.onClose - Function to close the popover.
 * @param {Object} props.contentRef - Reference to the editable content element.
 * @param {boolean} props.isActive - Indicates if the format is currently active. 
 * @returns {JSX.Element} - The rendered InlineUI component.
 */
function InlineUI({
	activeAttributes,
	value,
	onChange,
	onClose,
	contentRef,
	isActive,
}) {
	const name = 'blablablocks/infotip'; // Format type name

	const { update, remove } = createFormatHelpers({ value, onChange, formatType: name, activeAttributes });

	const anchor = useAnchor({
		editableContentElement: contentRef,
		settings: { isActive },
	});

	return (
		<Popover
			anchor={anchor}
			className="block-editor-format-toolbar__blablablocks-infotip-popover"
			position="middle center"
			onClose={onClose}
			offset={30}
			shift
			__unstableSlotName="__unstable-block-tools-after"
		>
			<TabPanel
				className="block-editor-format-toolbar__blablablocks-infotip-tab-panel"
				tabs={[
					{
						name: 'text',
						title: __('Text', 'blablablocks-formats'),
						content: (
							<TextTab
								activeAttributes={activeAttributes}
								name={name}
								onChange={onChange}
								onClose={onClose}
								removeAttributes={remove}
								updateAttributes={update}
								value={value}
							/>
						),
					},
					{
						name: 'overlay',
						title: __('Overlay', 'blablablocks-formats'),
						content: (
							<OverlayTab
								activeAttributes={activeAttributes}
								updateAttributes={update}
								removeAttributes={remove}
							/>
						),
						disabled: !activeAttributes.content,
					},
					{
						name: 'icon',
						title: __('Icon', 'blablablocks-formats'),
						content: (
							<IconTab
								activeAttributes={activeAttributes}
								updateAttributes={update}
								removeAttributes={remove}
							/>
						),
						disabled:
							!activeAttributes.content &&
							!activeAttributes['icon-enabled'],
					},
				]}
			>
				{(tab) => tab.content}
			</TabPanel>
		</Popover>
	);
}

export default InlineUI;
