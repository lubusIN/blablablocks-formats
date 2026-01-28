/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import {
	Modal,
	Button,
	__experimentalText as Text,
	__experimentalHStack as HStack,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { clearFormatsIcon } from './icon';
import { useClearFormats } from './hooks';

/**
 * Edit component for clearing all formats.
 *
 * @param {Object}   props          - The component properties.
 * @param {Object}   props.value    - The current value of the rich text.
 * @param {Function} props.onChange - Function to update the rich text value.
 * @return {JSX.Element} - The rendered clear formats button.
 */
export function Edit( { value, onChange } ) {
	const [ isModalOpen, setIsModalOpen ] = useState( false );
	const { hasSelection, clearFormats } = useClearFormats( {
		value,
		onChange,
	} );

	const handleClearFormats = () => {
		clearFormats();
		setIsModalOpen( false );
	};

	// Dynamic confirmation message based on selection
	const selectionType = hasSelection
		? __( 'text', 'blablablocks-formats' )
		: __( 'block', 'blablablocks-formats' );

	const confirmationMessage = sprintf(
		/* translators: %s: selection type (text/block) */
		__(
			'Are you sure you want to remove all formatting (bold, italic, links, etc.) from the selected %s?',
			'blablablocks-formats'
		),
		selectionType
	);

	return (
		<>
			<RichTextToolbarButton
				icon={ clearFormatsIcon }
				title={ __( 'Clear formatting', 'blablablocks-formats' ) }
				onClick={ () => setIsModalOpen( true ) }
			/>

			{ isModalOpen && (
				<Modal
					title={ __( 'Clear All Formats', 'blablablocks-formats' ) }
					onRequestClose={ () => setIsModalOpen( false ) }
					size="small"
				>
					<Text as="p" highlightWords={ [ 'text', 'block' ] }>
						{ confirmationMessage }
					</Text>
					<HStack
						spacing={ 2 }
						justify="flex-end"
						style={ { marginTop: '24px' } }
					>
						<Button
							variant="tertiary"
							onClick={ () => setIsModalOpen( false ) }
						>
							{ __( 'Cancel', 'blablablocks-formats' ) }
						</Button>
						<Button
							variant="primary"
							onClick={ handleClearFormats }
							isDestructive
						>
							{ __( 'Clear', 'blablablocks-formats' ) }
						</Button>
					</HStack>
				</Modal>
			) }
		</>
	);
}
