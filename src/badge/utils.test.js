jest.mock(
	'@wordpress/i18n',
	() => ( {
		__: ( str ) => str,
	} ),
	{ virtual: true }
);

import {
	parseBadgeClasses,
	parseBadgeStyle,
	getBadgeAttributes,
	getFormatRange,
} from './utils';
import { FORMAT_NAME } from './constants';

describe( 'badge utils', () => {
	describe( 'parseBadgeClasses', () => {
		it( 'parses variant, radius, alignment, and size from class string', () => {
			const classString =
				'has-badge is-style-solid is-radius-pill is-aligned-superscript is-size-large';
			expect( parseBadgeClasses( classString ) ).toEqual( {
				variant: 'solid',
				radius: 'pill',
				alignment: 'superscript',
				size: 'large',
			} );
		} );

		it( 'parses extra-small size', () => {
			const classString = 'has-badge is-size-extra-small';
			expect( parseBadgeClasses( classString ) ).toEqual( {
				size: 'extra-small',
			} );
		} );

		it( 'returns empty object for empty or missing class string', () => {
			expect( parseBadgeClasses( '' ) ).toEqual( {} );
			expect( parseBadgeClasses( undefined ) ).toEqual( {} );
		} );
	} );

	describe( 'parseBadgeStyle', () => {
		it( 'parses --badge-color from style string', () => {
			expect( parseBadgeStyle( '--badge-color: #ef4444;' ) ).toEqual( {
				color: '#ef4444',
			} );
		} );

		it( 'returns empty object if --badge-color is not present', () => {
			expect( parseBadgeStyle( 'font-weight: bold;' ) ).toEqual( {} );
			expect( parseBadgeStyle( '' ) ).toEqual( {} );
		} );
	} );

	describe( 'getBadgeAttributes', () => {
		it( 'returns normalized default attributes when empty', () => {
			const attrs = getBadgeAttributes();
			expect( attrs.variant ).toBe( 'subtle' );
			expect( attrs.color ).toBe( '#3b82f6' );
			expect( attrs.radius ).toBe( 'rounded' );
			expect( attrs.alignment ).toBe( 'inline' );
			expect( attrs.size ).toBe( 'medium' );
			expect( attrs.class ).toBe(
				'has-badge is-style-subtle is-radius-rounded is-aligned-inline is-size-medium'
			);
			expect( attrs.style ).toBe( '--badge-color: #3b82f6;' );
		} );
	} );

	describe( 'getFormatRange', () => {
		const badge1 = {
			type: FORMAT_NAME,
			attributes: {
				class: 'has-badge is-style-solid is-radius-rounded is-aligned-inline is-size-medium',
				style: '--badge-color: #ef4444;',
			},
		};

		const badge2 = {
			type: FORMAT_NAME,
			attributes: {
				class: 'has-badge is-style-outline is-radius-pill is-aligned-superscript is-size-small',
				style: '--badge-color: #3b82f6;',
			},
		};

		it( 'returns collapsed range at caret when formats or text are empty', () => {
			const value = { text: '', formats: [], start: 0, end: 0 };
			expect( getFormatRange( value ) ).toEqual( {
				startIndex: 0,
				endIndex: 0,
			} );
		} );

		it( 'targets caret without reusing preceding badge range when caret is inactive', () => {
			// "Badge " where "Badge" (0..5) has badge1, and caret is at 5 with isActive = false
			const value = {
				text: 'Badge ',
				formats: [
					[ badge1 ],
					[ badge1 ],
					[ badge1 ],
					[ badge1 ],
					[ badge1 ],
					[],
				],
				start: 5,
				end: 5,
				activeFormats: [],
			};

			const range = getFormatRange( value );
			expect( range ).toEqual( { startIndex: 5, endIndex: 5 } );
		} );

		it( 'expands to preceding badge when caret is collapsed and format is active at boundary', () => {
			const value = {
				text: 'Badge ',
				formats: [
					[ badge1 ],
					[ badge1 ],
					[ badge1 ],
					[ badge1 ],
					[ badge1 ],
					[],
				],
				start: 5,
				end: 5,
				activeFormats: [ badge1 ],
			};

			const range = getFormatRange( value );
			expect( range ).toEqual( { startIndex: 0, endIndex: 5 } );
		} );

		it( 'expands to badge boundaries when caret is inside a badge', () => {
			const value = {
				text: 'Badge ',
				formats: [
					[ badge1 ],
					[ badge1 ],
					[ badge1 ],
					[ badge1 ],
					[ badge1 ],
					[],
				],
				start: 2,
				end: 2,
			};

			const range = getFormatRange( value );
			expect( range ).toEqual( { startIndex: 0, endIndex: 5 } );
		} );

		it( 'stops expansion before an adjacent badge with different attributes', () => {
			// "AB CD" where AB is badge1 and CD is badge2
			const value = {
				text: 'ABCD',
				formats: [ [ badge1 ], [ badge1 ], [ badge2 ], [ badge2 ] ],
				start: 0,
				end: 2,
			};

			// Selection is exactly AB (0..2)
			const range = getFormatRange( value );
			expect( range ).toEqual( { startIndex: 0, endIndex: 2 } );
		} );

		it( 'expands both boundary badges when selection spans from one badge to another', () => {
			// Text: "AB CD"
			// Index 0: 'A' (badge1)
			// Index 1: 'B' (badge1)
			// Index 2: ' ' (no format)
			// Index 3: 'C' (badge2)
			// Index 4: 'D' (badge2)
			// Selection from B (index 1) through C (index 4 exclusive, covering 1, 2, 3)
			const value = {
				text: 'AB CD',
				formats: [ [ badge1 ], [ badge1 ], [], [ badge2 ], [ badge2 ] ],
				start: 1,
				end: 4,
			};

			const range = getFormatRange( value );
			// Must expand badge1 backwards to index 0, and badge2 forwards to index 5
			expect( range ).toEqual( { startIndex: 0, endIndex: 5 } );
		} );

		it( 'preserves original unformatted selection boundary while expanding formatted boundary', () => {
			// Text: "xyz AB"
			// Index 0,1,2: "xyz"
			// Index 3: " "
			// Index 4,5: "AB" (badge1)
			// Selection from index 1 ('y') to index 5 ('A' selected)
			const value = {
				text: 'xyz AB',
				formats: [ [], [], [], [], [ badge1 ], [ badge1 ] ],
				start: 1,
				end: 5,
			};

			const range = getFormatRange( value );
			expect( range ).toEqual( { startIndex: 1, endIndex: 6 } );
		} );
	} );
} );
