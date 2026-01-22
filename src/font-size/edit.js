/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { typography } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import InlineUI from './inline-ui';

/**
 * Edit component for the FontSize format in the block editor.
 *
 * @param {Object}   props                  - The component properties.
 * @param {Object}   props.value            - The current value of the rich text.
 * @param {Function} props.onChange         - Function to update the rich text value.
 * @param {boolean}  props.isActive         - Indicates if the format is currently active.
 * @param {Object}   props.contentRef       - Reference to the editable content element.
 * @param {Object}   props.activeAttributes - The currently active attributes.
 * @return {JSX.Element} - The rendered FontSize format.
 */
export function Edit({
	value,
	onChange,
	isActive,
	contentRef,
	activeAttributes,
}) {
	const [isSettingOpen, setIsSettingOpen] = useState(false);

	return (
		<>
			<RichTextToolbarButton
				icon={typography}
				title={__('Font Size', 'blablablocks-formats')}
				onClick={() => setIsSettingOpen(true)}
				isActive={isActive}
			/>

			{isSettingOpen && (
				<InlineUI
					value={value}
					onChange={onChange}
					onClose={() => setIsSettingOpen(false)}
					activeAttributes={activeAttributes}
					contentRef={contentRef.current}
					isActive={isActive}
				/>
			)}
		</>
	);
}
