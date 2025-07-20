/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './editor.scss';
import './style.scss';
import InlineUI from './inline-ui';
import InfotipIcon from '../../assets/images/infotip';

/**
 * Edit component for the Infotip format.
 *
 * @param {Object}   props                  - The component properties.
 * @param {Object}   props.value            - The current value of the rich text.
 * @param {Function} props.onChange         - Function to update the rich text value.
 * @param {Function} props.onFocus          - Function to handle focus events.
 * @param {boolean}  props.isActive         - Indicates if the format is currently active.
 * @param {Object}   props.contentRef       - Reference to the editable content element.
 * @param {Object}   props.activeAttributes - The currently active attributes.
 * @return {JSX.Element} - The rendered infotip button.
 */
export function Edit({
	value,
	onChange,
	onFocus,
	isActive,
	contentRef,
	activeAttributes,
}) {
	const [isSettingOpen, setIsSettingOpen] = useState(false);

	return (
		<>
			<RichTextToolbarButton
				icon={<InfotipIcon />}
				title={__('Infotip', 'blablablocks-formats')}
				onClick={() => setIsSettingOpen(true)}
				isActive={isActive}
			/>
			{isSettingOpen && (
				<InlineUI
					activeAttributes={activeAttributes}
					onClose={() => setIsSettingOpen(false)}
					contentRef={contentRef.current}
					isActive={isActive}
					value={value}
					onChange={onChange}
					onFocus={onFocus}
				/>
			)}
		</>
	);
}
