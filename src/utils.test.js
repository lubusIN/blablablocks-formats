const mockApplyFormat = jest.fn( ( value, format ) => ( {
	...value,
	applied: format,
} ) );

jest.mock(
	'@wordpress/rich-text',
	() => ( {
		applyFormat: ( ...args ) => mockApplyFormat( ...args ),
	} ),
	{ virtual: true }
);

import { createFormatHelpers } from './utils';

describe( 'createFormatHelpers', () => {
	const dummyValue = { text: 'Hello world', formats: [] };
	const formatType = 'blablablocks/marker';
	let onChange;

	beforeEach( () => {
		onChange = jest.fn();
		mockApplyFormat.mockClear();
	} );

	it( 'updates attributes by merging new attributes with active attributes', () => {
		const activeAttributes = { type: 'circle', color: '#ff0000' };
		const helpers = createFormatHelpers( {
			value: dummyValue,
			onChange,
			formatType,
			activeAttributes,
		} );

		helpers.update( { color: '#00ff00', duration: '2s' } );

		expect( mockApplyFormat ).toHaveBeenCalledTimes( 1 );
		expect( mockApplyFormat ).toHaveBeenCalledWith( dummyValue, {
			type: formatType,
			attributes: {
				type: 'circle',
				color: '#00ff00',
				duration: '2s',
			},
		} );
		expect( onChange ).toHaveBeenCalledWith( {
			...dummyValue,
			applied: {
				type: formatType,
				attributes: {
					type: 'circle',
					color: '#00ff00',
					duration: '2s',
				},
			},
		} );
	} );

	it( 'replaces attributes entirely with new attributes', () => {
		const activeAttributes = { type: 'circle', color: '#ff0000' };
		const helpers = createFormatHelpers( {
			value: dummyValue,
			onChange,
			formatType,
			activeAttributes,
		} );

		helpers.replace( { type: 'underline' } );

		expect( mockApplyFormat ).toHaveBeenCalledWith( dummyValue, {
			type: formatType,
			attributes: { type: 'underline' },
		} );
	} );

	it( 'removes specified keys from active attributes', () => {
		const activeAttributes = {
			type: 'circle',
			color: '#ff0000',
			duration: '1s',
		};
		const helpers = createFormatHelpers( {
			value: dummyValue,
			onChange,
			formatType,
			activeAttributes,
		} );

		helpers.remove( [ 'color', 'duration' ] );

		expect( mockApplyFormat ).toHaveBeenCalledWith( dummyValue, {
			type: formatType,
			attributes: { type: 'circle' },
		} );
	} );

	it( 'handles remove when no keys are provided', () => {
		const activeAttributes = { type: 'circle' };
		const helpers = createFormatHelpers( {
			value: dummyValue,
			onChange,
			formatType,
			activeAttributes,
		} );

		helpers.remove();

		expect( mockApplyFormat ).toHaveBeenCalledWith( dummyValue, {
			type: formatType,
			attributes: { type: 'circle' },
		} );
	} );
} );
