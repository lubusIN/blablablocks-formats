import {
	isExplicitColorCode,
	getColorTokenAttributes,
	findColorCandidateBeforeCaret,
} from './utils';

describe( 'color-token utils', () => {
	describe( 'isExplicitColorCode', () => {
		it( 'returns true for valid hex colors (3, 4, 6, 8 digits)', () => {
			expect( isExplicitColorCode( '#fff' ) ).toBe( true );
			expect( isExplicitColorCode( '#FFF' ) ).toBe( true );
			expect( isExplicitColorCode( '#ffff' ) ).toBe( true );
			expect( isExplicitColorCode( '#1a2b3c' ) ).toBe( true );
			expect( isExplicitColorCode( '#1a2b3c4d' ) ).toBe( true );
		} );

		it( 'returns true for valid rgb and rgba colors', () => {
			expect( isExplicitColorCode( 'rgb(255, 0, 0)' ) ).toBe( true );
			expect( isExplicitColorCode( 'rgba(255, 0, 0, 0.5)' ) ).toBe(
				true
			);
			expect( isExplicitColorCode( 'rgb(100% 0% 0%)' ) ).toBe( true );
		} );

		it( 'returns true for valid hsl and hsla colors', () => {
			expect( isExplicitColorCode( 'hsl(120, 100%, 50%)' ) ).toBe( true );
			expect( isExplicitColorCode( 'hsla(120, 100%, 50%, 0.8)' ) ).toBe(
				true
			);
		} );

		it( 'returns false for named colors', () => {
			expect( isExplicitColorCode( 'red' ) ).toBe( false );
			expect( isExplicitColorCode( 'blue' ) ).toBe( false );
			expect( isExplicitColorCode( 'transparent' ) ).toBe( false );
		} );

		it( 'returns false for empty, null, undefined, or invalid strings', () => {
			expect( isExplicitColorCode( '' ) ).toBe( false );
			expect( isExplicitColorCode( null ) ).toBe( false );
			expect( isExplicitColorCode( undefined ) ).toBe( false );
			expect( isExplicitColorCode( '#12' ) ).toBe( false );
			expect( isExplicitColorCode( '#12345' ) ).toBe( false );
			expect( isExplicitColorCode( 'not-a-color' ) ).toBe( false );
			expect( isExplicitColorCode( 'rgb(not, a, color)' ) ).toBe( false );
		} );
	} );

	describe( 'getColorTokenAttributes', () => {
		it( 'returns correct format attributes for a hex color', () => {
			const attrs = getColorTokenAttributes( '#3498db' );
			expect( attrs ).toEqual( {
				style: '--lubus-color: #3498db; --lubus-border-color: #196090',
				color: '#3498db',
				border: '#196090',
				theme: 'minimal',
			} );
		} );

		it( 'returns attributes with darkened border for rgba color', () => {
			const attrs = getColorTokenAttributes( 'rgba(255, 255, 255, 1)' );
			expect( attrs.theme ).toBe( 'minimal' );
			expect( attrs.color ).toBe( 'rgb(255, 255, 255)' );
			expect( attrs.border ).toBe( 'rgb(204, 204, 204)' );
			expect( attrs.style ).toBe(
				'--lubus-color: rgb(255, 255, 255); --lubus-border-color: rgb(204, 204, 204)'
			);
		} );
	} );

	describe( 'findColorCandidateBeforeCaret', () => {
		it( 'detects hex code at the end of string', () => {
			const text = 'Here is some text #ff0000';
			const result = findColorCandidateBeforeCaret( text );
			expect( result ).toEqual( {
				candidate: '#ff0000',
				startIndex: text.length - 7,
				endIndex: text.length,
			} );
		} );

		it( 'detects hex code immediately at start of string', () => {
			const text = '#abc';
			const result = findColorCandidateBeforeCaret( text );
			expect( result ).toEqual( {
				candidate: '#abc',
				startIndex: 0,
				endIndex: 4,
			} );
		} );

		it( 'detects rgb code before caret preceded by parenthesis or space', () => {
			const textInParen = 'Color: (rgb(0, 128, 255)';
			const result = findColorCandidateBeforeCaret( textInParen );
			expect( result ).toEqual( {
				candidate: 'rgb(0, 128, 255)',
				startIndex: textInParen.length - 'rgb(0, 128, 255)'.length,
				endIndex: textInParen.length,
			} );
		} );

		it( 'returns null if no color code is at the caret', () => {
			expect( findColorCandidateBeforeCaret( 'Hello world' ) ).toBeNull();
			expect( findColorCandidateBeforeCaret( '#12345' ) ).toBeNull();
			expect( findColorCandidateBeforeCaret( '' ) ).toBeNull();
			expect( findColorCandidateBeforeCaret( null ) ).toBeNull();
		} );

		it( 'returns null if color is followed by extra non-color text', () => {
			expect(
				findColorCandidateBeforeCaret( '#ff0000 trailing' )
			).toBeNull();
		} );
	} );
} );
