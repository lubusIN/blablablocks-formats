/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Button,
	TextareaControl,
	__experimentalVStack as VStack, // eslint-disable-line
} from '@wordpress/components';

/**
 * WordsTab component for managing text animation words/phrases.
 *
 * @param {Object}   props                  - The component properties.
 * @param {Object}   props.activeAttributes - The currently active format attributes.
 * @param {Function} props.removeAttributes - Function to remove attributes.
 * @param {Function} props.updateAttributes - Function to update attributes.
 * @return {JSX.Element}                    - The rendered component.
 */
function WordsTab( { activeAttributes, removeAttributes, updateAttributes } ) {
	const handleWordsChange = ( newValue ) => {
		if ( newValue && newValue.trim() ) {
			updateAttributes( { words: newValue } );
		} else {
			removeAttributes( [ 'words' ] );
		}
	};

	return (
		<VStack spacing={ 4 }>
			<TextareaControl
				label={ __( 'Words / Phrases', 'blablablocks-formats' ) }
				help={ __(
					'Enter words separated by commas (e.g. Design, Build, Launch) to cycle through in typing mode. If left empty, the selected text is used.',
					'blablablocks-formats'
				) }
				onChange={ handleWordsChange }
				placeholder={ __(
					'e.g. Design, Build, Launch',
					'blablablocks-formats'
				) }
				value={ activeAttributes.words || '' }
				__nextHasNoMarginBottom
			/>
			<Button
				accessibleWhenDisabled
				className="reset-button"
				disabled={ ! activeAttributes.words }
				onClick={ () => removeAttributes( [ 'words' ] ) }
				variant="tertiary"
				__next40pxDefaultSize
			>
				{ __( 'Clear', 'blablablocks-formats' ) }
			</Button>
		</VStack>
	);
}

export default WordsTab;
