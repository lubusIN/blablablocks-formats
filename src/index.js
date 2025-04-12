/**
 * WordPress dependencies
 */
import { registerFormatType } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import { formats } from './formats';

formats.forEach( ( format ) => {
	const { name, ...settings } = format;
	registerFormatType( name, {
		...settings,
	} );
} );
