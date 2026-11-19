/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import {
	Button,
	TextareaControl,
	__experimentalVStack as VStack, // eslint-disable-line
} from '@wordpress/components';

/**
 * Converts a words attribute value (JSON string or comma-separated) into comma-separated display text.
 *
 * @param {string|undefined} val - Attribute value.
 * @return {string} Friendly display value.
 */
const getDisplayWords = ( val ) => {
	if ( ! val ) {
		return '';
	}
	try {
		const parsed = JSON.parse( val );
		if ( Array.isArray( parsed ) ) {
			return parsed.join( ', ' );
		}
	} catch ( e ) {}
	return val;
};

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
	const [ wordsInput, setWordsInput ] = useState( () =>
		getDisplayWords( activeAttributes.words )
	);

	useEffect( () => {
		const currentDisplay = getDisplayWords( activeAttributes.words );
		const currentParsed = wordsInput
			.split( ',' )
			.map( ( s ) => s.trim() )
			.filter( Boolean );
		const attrParsed = ( () => {
			try {
				const p = JSON.parse( activeAttributes.words );
				return Array.isArray( p ) ? p : [];
			} catch ( e ) {
				return [];
			}
		} )();

		if (
			JSON.stringify( currentParsed ) !== JSON.stringify( attrParsed )
		) {
			setWordsInput( currentDisplay );
		}
	}, [ activeAttributes.words, wordsInput ] );

	const handleWordsChange = ( newValue ) => {
		setWordsInput( newValue );
		if ( newValue && newValue.trim() ) {
			const split = newValue
				.split( ',' )
				.map( ( s ) => s.trim() )
				.filter( Boolean );
			if ( split.length > 0 ) {
				updateAttributes( { words: JSON.stringify( split ) } );
			}
		} else {
			removeAttributes( [ 'words' ] );
		}
	};

	const handleClear = () => {
		setWordsInput( '' );
		removeAttributes( [ 'words' ] );
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
				value={ wordsInput }
				__nextHasNoMarginBottom
			/>
			<Button
				accessibleWhenDisabled
				className="reset-button"
				disabled={ ! activeAttributes.words }
				onClick={ handleClear }
				variant="tertiary"
				__next40pxDefaultSize
			>
				{ __( 'Clear', 'blablablocks-formats' ) }
			</Button>
		</VStack>
	);
}

export default WordsTab;
