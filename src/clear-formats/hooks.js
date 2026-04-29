/**
 * WordPress dependencies
 */
import { useCallback, useMemo } from '@wordpress/element';
import { removeFormat, create, getActiveFormats } from '@wordpress/rich-text';

/**
 * Provides helpers for clearing formats from a rich text value.
 *
 * @param {Object}   options          - Hook options.
 * @param {Object}   options.value    - Current rich text value.
 * @param {Function} options.onChange - Callback to update the value.
 * @return {{hasSelection: boolean, clearFormats: Function}} Hook results.
 */
export const useClearFormats = ( { value, onChange } ) => {
	const hasSelection = useMemo(
		() => value.start !== value.end,
		[ value.start, value.end ]
	);

	const clearFormats = useCallback( () => {
		let newValue = value;

		if ( hasSelection ) {
			const formats = getActiveFormats( value );

			formats.forEach( ( format ) => {
				newValue = removeFormat(
					newValue,
					format.type,
					value.start,
					value.end
				);
			} );

			if ( value.formats ) {
				const formatTypes = new Set();

				for ( let index = value.start; index < value.end; index++ ) {
					if ( value.formats[ index ] ) {
						value.formats[ index ].forEach( ( format ) => {
							formatTypes.add( format.type );
						} );
					}
				}

				formatTypes.forEach( ( formatType ) => {
					newValue = removeFormat(
						newValue,
						formatType,
						value.start,
						value.end
					);
				} );
			}

			onChange( newValue );
			return;
		}

		newValue = create( { text: value.text } );
		onChange( newValue );
	}, [ hasSelection, onChange, value ] );

	return { hasSelection, clearFormats };
};
