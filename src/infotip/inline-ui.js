/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { applyFormat, useAnchor } from '@wordpress/rich-text';
import { useEffect } from '@wordpress/element';
import { Popover, TabPanel } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { IconTab, OverlayTab, TextTab } from './components';

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
	name,
	value,
	onChange,
	onClose,
	contentRef,
	isActive,
}) {
	const anchor = useAnchor({
		editableContentElement: contentRef,
		settings: { isActive },
	});

	useEffect(() => {
		return () => {
			const { ownerDocument } = contentRef;
			const infotips = ownerDocument.querySelectorAll(
				'tatva-infotip'
			);
			infotips.forEach((infotip) => {
				if (infotip && typeof infotip.hideTooltip === 'function') {
					infotip.hideTooltip();
				}
			});
		};
	}, [contentRef]);

	const updateAttributes = (newAttributes) => {
		const updatedFormat = applyFormat(value, {
			type: name,
			attributes: {
				...activeAttributes,
				...newAttributes,
			},
		});
		onChange(updatedFormat);
	};

	const replaceAttributes = (newAttributes) => {
		const updatedFormat = applyFormat(value, {
			type: name,
			attributes: newAttributes,
		});
		onChange(updatedFormat);
	};

	const removeAttributes = (attributes) => {
		const updatedAttributes = { ...activeAttributes };
		attributes.forEach((attribute) => {
			delete updatedAttributes[attribute];
		});
		replaceAttributes(updatedAttributes);
	};

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
								removeAttributes={removeAttributes}
								updateAttributes={updateAttributes}
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
								updateAttributes={updateAttributes}
								removeAttributes={removeAttributes}
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
								updateAttributes={updateAttributes}
								removeAttributes={removeAttributes}
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
