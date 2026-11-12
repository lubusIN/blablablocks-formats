/**
 * WordPress dependencies
 */
import { useEffect, useRef } from '@wordpress/element';
import { applyFormat, create, insert, isCollapsed } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import { FORMAT_NAME } from './index';
import {
	findColorCandidateBeforeCaret,
	getColorTokenAttributes,
	isExplicitColorCode,
} from './utils';

const TRIGGER_KEYS = [ ' ', ',', ';', ')', 'Enter' ];

/**
 * Custom hook to handle auto-formatting color codes on paste and typing.
 *
 * @param {Object}      options            - Hook options.
 * @param {Object}      options.value      - Current rich text value.
 * @param {Function}    options.onChange   - Callback to update the value.
 * @param {HTMLElement} options.contentRef - The contenteditable container element or ref.
 */
export function useAutoColorFormat( { value, onChange, contentRef } ) {
	const valueRef = useRef( value );
	valueRef.current = value;

	const onChangeRef = useRef( onChange );
	onChangeRef.current = onChange;

	const element = contentRef?.current || contentRef;

	useEffect( () => {
		if ( ! element ) {
			return;
		}

		const handlePaste = ( event ) => {
			const text = event.clipboardData?.getData( 'text/plain' )?.trim();
			if ( ! isExplicitColorCode( text ) ) {
				return;
			}

			event.preventDefault();

			const format = {
				type: FORMAT_NAME,
				attributes: getColorTokenAttributes( text ),
			};
			const formatted = applyFormat( create( { text } ), format );
			onChangeRef.current( insert( valueRef.current, formatted ) );
		};

		const handleKeyDown = ( event ) => {
			if (
				event.ctrlKey ||
				event.metaKey ||
				event.altKey ||
				! TRIGGER_KEYS.includes( event.key )
			) {
				return;
			}

			const currentValue = valueRef.current;
			if ( ! isCollapsed( currentValue ) ) {
				return;
			}

			const textBefore = currentValue.text.slice( 0, currentValue.start );
			const match = findColorCandidateBeforeCaret( textBefore );
			if ( ! match ) {
				return;
			}

			const { candidate, startIndex, endIndex } = match;
			const isAlreadyFormatted = currentValue.formats?.[
				startIndex
			]?.some( ( f ) => f.type === FORMAT_NAME );
			if ( isAlreadyFormatted ) {
				return;
			}

			const format = {
				type: FORMAT_NAME,
				attributes: getColorTokenAttributes( candidate ),
			};

			let newValue = applyFormat(
				currentValue,
				format,
				startIndex,
				endIndex
			);

			if ( event.key !== 'Enter' ) {
				event.preventDefault();
				newValue = insert( newValue, event.key, endIndex, endIndex );
			}

			onChangeRef.current( newValue );
		};

		element.addEventListener( 'paste', handlePaste );
		element.addEventListener( 'keydown', handleKeyDown );

		return () => {
			element.removeEventListener( 'paste', handlePaste );
			element.removeEventListener( 'keydown', handleKeyDown );
		};
	}, [ element ] );
}
