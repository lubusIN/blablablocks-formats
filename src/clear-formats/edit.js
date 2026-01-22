/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useMemo } from '@wordpress/element';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { removeFormat, create, getActiveFormats } from '@wordpress/rich-text';
import { Modal, Button } from '@wordpress/components';
import { cancelCircleFilled } from '@wordpress/icons';

/**
 * Edit component for clearing all formats.
 *
 * @param {Object}   props          - The component properties.
 * @param {Object}   props.value    - The current value of the rich text.
 * @param {Function} props.onChange - Function to update the rich text value.
 * @return {JSX.Element} - The rendered clear formats button.
 */
export function Edit({ value, onChange }) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Check if there's a text selection
	const hasSelection = useMemo(() => {
		return value.start !== value.end;
	}, [value.start, value.end]);

	const handleClearFormats = () => {
		let newValue = value;

		if (hasSelection) {
			// Get all active formats at the selection
			const formats = getActiveFormats(value);
			
			// Remove each format type from the selection
			formats.forEach((format) => {
				newValue = removeFormat(
					newValue,
					format.type,
					value.start,
					value.end
				);
			});

			// Also remove any formats that might not be "active" but exist in the range
			// by getting all format types from the formats array in the value
			if (value.formats) {
				const formatTypes = new Set();
				for (let i = value.start; i < value.end; i++) {
					if (value.formats[i]) {
						value.formats[i].forEach((format) => {
							formatTypes.add(format.type);
						});
					}
				}
				
				formatTypes.forEach((formatType) => {
					newValue = removeFormat(
						newValue,
						formatType,
						value.start,
						value.end
					);
				});
			}

			onChange(newValue);
		} else {
			// Clear formats for the entire block by creating plain text
			const plainText = value.text;
			const newValue = create({ text: plainText });
			onChange(newValue);
		}

		setIsModalOpen(false);
	};

	// Dynamic confirmation message based on selection
	const confirmationMessage = hasSelection
		? __(
				'Are you sure you want to remove all formatting from the selected text? This will remove bold, italic, links, and all other formats including BlaBlaBlocks formats.',
				'blablablocks-formats'
		  )
		: __(
				'Are you sure you want to remove all formatting from the entire block? This will remove bold, italic, links, and all other formats including BlaBlaBlocks formats.',
				'blablablocks-formats'
		  );

	return (
		<>
			<RichTextToolbarButton
				icon={cancelCircleFilled}
				title={__('Clear All Formats', 'blablablocks-formats')}
				onClick={() => setIsModalOpen(true)}
			/>

			{isModalOpen && (
				<Modal
					title={__('Clear All Formats', 'blablablocks-formats')}
					onRequestClose={() => setIsModalOpen(false)}
					size="small"
				>
					<p>{confirmationMessage}</p>
					<div
						style={{
							display: 'flex',
							justifyContent: 'flex-end',
							gap: '8px',
							marginTop: '20px',
						}}
					>
						<Button
							variant="tertiary"
							onClick={() => setIsModalOpen(false)}
						>
							{__('Cancel', 'blablablocks-formats')}
						</Button>
						<Button
							variant="primary"
							onClick={handleClearFormats}
							isDestructive
						>
							{__('Clear Formats', 'blablablocks-formats')}
						</Button>
					</div>
				</Modal>
			)}
		</>
	);
}
