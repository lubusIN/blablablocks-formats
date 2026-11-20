/* eslint-disable import/no-extraneous-dependencies */
window.IS_REACT_ACT_ENVIRONMENT = true;

const mockApplyFormat = jest.fn( ( value, format, start, end ) => ( {
	...value,
	appliedFormat: format,
	appliedRange: [ start, end ],
} ) );

let mockActiveLink = null;
jest.mock(
	'@wordpress/i18n',
	() => ( {
		__: ( str ) => str,
	} ),
	{ virtual: true }
);

jest.mock(
	'@wordpress/rich-text',
	() => ( {
		applyFormat: ( ...args ) => mockApplyFormat( ...args ),
		getActiveFormat: ( value, formatType ) => {
			if ( formatType === 'core/link' ) {
				return mockActiveLink;
			}
			return undefined;
		},
	} ),
	{ virtual: true }
);

import { act } from 'react';
import { createRoot } from '@wordpress/element';
import {
	RESERVED_LINK_ATTRIBUTES,
	getAttributeNameError,
	isValidAttributeName,
	getCoreLinkAttributes,
	getCustomLinkAttributes,
	getLinkFormatRange,
	useLinkAttributes,
} from './hooks';

describe( 'link-attributes hooks and utilities', () => {
	beforeEach( () => {
		mockApplyFormat.mockClear();
		mockActiveLink = null;
	} );

	describe( 'isValidAttributeName and getAttributeNameError', () => {
		it( 'returns true and no error for valid attribute names such as data-tracking', () => {
			expect( isValidAttributeName( 'data-tracking' ) ).toBe( true );
			expect( getAttributeNameError( 'data-tracking' ) ).toBeNull();

			expect( isValidAttributeName( 'data-user-id' ) ).toBe( true );
			expect( isValidAttributeName( 'download' ) ).toBe( true );
			expect( isValidAttributeName( 'title' ) ).toBe( true );
			expect( isValidAttributeName( 'data_analytics' ) ).toBe( true );
			expect( isValidAttributeName( 'aria-describedby' ) ).toBe( true );
			expect( isValidAttributeName( 'custom:ns' ) ).toBe( true );
			expect( isValidAttributeName( 'item-1' ) ).toBe( true );
		} );

		it( 'rejects event handlers starting with on (case-insensitive)', () => {
			expect( isValidAttributeName( 'onclick' ) ).toBe( false );
			expect( getAttributeNameError( 'onclick' ) ).toContain(
				'Event handler'
			);

			expect( isValidAttributeName( 'ONCLICK' ) ).toBe( false );
			expect( isValidAttributeName( 'onClick' ) ).toBe( false );
			expect( isValidAttributeName( 'onload' ) ).toBe( false );
			expect( isValidAttributeName( 'onerror' ) ).toBe( false );
			expect( isValidAttributeName( 'onmouseover' ) ).toBe( false );
			expect( isValidAttributeName( 'onblur' ) ).toBe( false );
		} );

		it( 'rejects reserved core link attributes (case-insensitive)', () => {
			RESERVED_LINK_ATTRIBUTES.forEach( ( attr ) => {
				expect( isValidAttributeName( attr ) ).toBe( false );
				expect( getAttributeNameError( attr ) ).toContain( 'reserved' );
				expect( isValidAttributeName( attr.toUpperCase() ) ).toBe(
					false
				);
			} );
		} );

		it( 'rejects invalid characters, empty strings, and non-string inputs', () => {
			expect( isValidAttributeName( '' ) ).toBe( false );
			expect( isValidAttributeName( '   ' ) ).toBe( false );
			expect( isValidAttributeName( null ) ).toBe( false );
			expect( isValidAttributeName( undefined ) ).toBe( false );
			expect( isValidAttributeName( 123 ) ).toBe( false );
			expect( isValidAttributeName( {} ) ).toBe( false );
			expect( isValidAttributeName( 'has space' ) ).toBe( false );
			expect( getAttributeNameError( 'has space' ) ).toContain(
				'Invalid attribute name'
			);
			expect( isValidAttributeName( 'quote"attr' ) ).toBe( false );
			expect( isValidAttributeName( 'greater>attr' ) ).toBe( false );
			expect( isValidAttributeName( 'slash/attr' ) ).toBe( false );
			expect( isValidAttributeName( 'foo=bar' ) ).toBe( false );
		} );
	} );

	describe( 'getCoreLinkAttributes', () => {
		it( 'returns empty object when activeLink is null or undefined', () => {
			expect( getCoreLinkAttributes( null ) ).toEqual( {} );
			expect( getCoreLinkAttributes( undefined ) ).toEqual( {} );
		} );

		it( 'extracts registered core link attributes and preserves them', () => {
			const activeLink = {
				attributes: {
					url: 'https://example.com',
					target: '_blank',
					rel: 'noopener noreferrer',
					type: 'post',
					id: 42,
					class: 'my-custom-link-class',
					'aria-label': 'Read more about example',
					'data-custom': 'ignore-me',
				},
			};

			const core = getCoreLinkAttributes( activeLink );
			expect( core ).toEqual( {
				url: 'https://example.com',
				target: '_blank',
				rel: 'noopener noreferrer',
				type: 'post',
				id: 42,
				class: 'my-custom-link-class',
				'aria-label': 'Read more about example',
			} );
		} );

		it( 'checks unregisteredAttributes in addition to attributes', () => {
			const activeLink = {
				attributes: {
					url: 'https://example.com',
				},
				unregisteredAttributes: {
					target: '_blank',
					'aria-label': 'Example Label',
				},
			};

			const core = getCoreLinkAttributes( activeLink );
			expect( core ).toEqual( {
				url: 'https://example.com',
				target: '_blank',
				'aria-label': 'Example Label',
			} );
		} );

		it( 'normalizes redundant url/href and class/className pairs', () => {
			const activeLink = {
				attributes: {
					url: 'https://example.com',
					href: 'https://example.com',
					class: 'button',
					className: 'button',
				},
			};

			const core = getCoreLinkAttributes( activeLink );
			expect( core ).toEqual( {
				url: 'https://example.com',
				class: 'button',
			} );
			expect( core.href ).toBeUndefined();
			expect( core.className ).toBeUndefined();
		} );
	} );

	describe( 'getCustomLinkAttributes', () => {
		it( 'returns empty array when activeLink is null or undefined', () => {
			expect( getCustomLinkAttributes( null ) ).toEqual( [] );
			expect( getCustomLinkAttributes( undefined ) ).toEqual( [] );
		} );

		it( 'extracts custom attributes and ignores reserved attributes', () => {
			const activeLink = {
				attributes: {
					url: 'https://example.com',
					target: '_blank',
					'data-track': 'signup-btn',
					download: 'report.pdf',
				},
			};

			const custom = getCustomLinkAttributes( activeLink );
			expect( custom ).toEqual( [
				{ key: 'data-track', value: 'signup-btn' },
				{ key: 'download', value: 'report.pdf' },
			] );
		} );

		it( 'filters out unsafe event handlers', () => {
			const activeLink = {
				attributes: {
					url: 'https://example.com',
					onclick: 'alert(1)',
					'data-safe': 'yes',
				},
			};

			const custom = getCustomLinkAttributes( activeLink );
			expect( custom ).toEqual( [ { key: 'data-safe', value: 'yes' } ] );
		} );

		it( 'merges custom attributes from unregisteredAttributes and attributes', () => {
			const activeLink = {
				attributes: {
					url: 'https://example.com',
					'data-source': 'gutenberg',
				},
				unregisteredAttributes: {
					'data-imported': 'html',
				},
			};

			const custom = getCustomLinkAttributes( activeLink );
			expect( custom ).toEqual( [
				{ key: 'data-imported', value: 'html' },
				{ key: 'data-source', value: 'gutenberg' },
			] );
		} );

		it( 'stringifies non-string values safely', () => {
			const activeLink = {
				attributes: {
					url: 'https://example.com',
					'data-count': 10,
					'data-empty': null,
				},
			};

			const custom = getCustomLinkAttributes( activeLink );
			expect( custom ).toEqual( [
				{ key: 'data-count', value: '10' },
				{ key: 'data-empty', value: '' },
			] );
		} );
	} );

	describe( 'getLinkFormatRange', () => {
		const linkFormat = {
			type: 'core/link',
			attributes: { url: 'https://example.com' },
		};

		it( 'returns original indices when value is empty or has no formats', () => {
			expect( getLinkFormatRange( null ) ).toEqual( {
				startIndex: undefined,
				endIndex: undefined,
			} );
			expect(
				getLinkFormatRange( {
					text: '',
					formats: [],
					start: 0,
					end: 0,
				} )
			).toEqual( { startIndex: 0, endIndex: 0 } );
			expect(
				getLinkFormatRange( {
					text: 'Plain text',
					formats: [ [], [], [], [], [] ],
					start: 2,
					end: 2,
				} )
			).toEqual( { startIndex: 2, endIndex: 2 } );
		} );

		it( 'expands to full link boundary when collapsed caret is inside the link', () => {
			const formats = Array.from( { length: 16 }, () => [] );
			for ( let i = 6; i < 11; i++ ) {
				formats[ i ] = [ linkFormat ];
			}

			const value = {
				text: 'Hello world test',
				formats,
				start: 8,
				end: 8,
				activeFormats: [ linkFormat ],
			};

			const range = getLinkFormatRange( value );
			expect( range ).toEqual( { startIndex: 6, endIndex: 11 } );
		} );

		it( 'expands to full link boundary when collapsed caret is at start of the link', () => {
			const formats = Array.from( { length: 16 }, () => [] );
			for ( let i = 6; i < 11; i++ ) {
				formats[ i ] = [ linkFormat ];
			}

			const value = {
				text: 'Hello world test',
				formats,
				start: 6,
				end: 6,
				activeFormats: [ linkFormat ],
			};

			const range = getLinkFormatRange( value );
			expect( range ).toEqual( { startIndex: 6, endIndex: 11 } );
		} );

		it( 'expands to full link boundary when collapsed caret is at the trailing boundary of the link', () => {
			const formats = Array.from( { length: 16 }, () => [] );
			for ( let i = 6; i < 11; i++ ) {
				formats[ i ] = [ linkFormat ];
			}

			const value = {
				text: 'Hello world test',
				formats,
				start: 11,
				end: 11,
				activeFormats: [ linkFormat ],
			};

			const range = getLinkFormatRange( value );
			expect( range ).toEqual( { startIndex: 6, endIndex: 11 } );
		} );

		it( 'expands to full link boundary when partial range inside link is selected', () => {
			const formats = Array.from( { length: 16 }, () => [] );
			for ( let i = 6; i < 11; i++ ) {
				formats[ i ] = [ linkFormat ];
			}

			const value = {
				text: 'Hello world test',
				formats,
				start: 7,
				end: 10,
				activeFormats: [ linkFormat ],
			};

			const range = getLinkFormatRange( value );
			expect( range ).toEqual( { startIndex: 6, endIndex: 11 } );
		} );

		it( 'does not expand into adjacent link with different attributes', () => {
			const linkA = {
				type: 'core/link',
				attributes: { url: 'https://a.com' },
			};
			const linkB = {
				type: 'core/link',
				attributes: { url: 'https://b.com' },
			};

			const formats = [
				[ linkA ],
				[ linkA ],
				[ linkA ],
				[ linkB ],
				[ linkB ],
				[ linkB ],
			];

			const valueA = {
				text: 'foobar',
				formats,
				start: 1,
				end: 1,
				activeFormats: [ linkA ],
			};
			expect( getLinkFormatRange( valueA ) ).toEqual( {
				startIndex: 0,
				endIndex: 3,
			} );

			const valueB = {
				text: 'foobar',
				formats,
				start: 4,
				end: 4,
				activeFormats: [ linkB ],
			};
			expect( getLinkFormatRange( valueB ) ).toEqual( {
				startIndex: 3,
				endIndex: 6,
			} );
		} );
	} );

	describe( 'useLinkAttributes hook', () => {
		let container;
		let root;
		let currentHookState;

		function TestHarness( { value, onChange } ) {
			currentHookState = useLinkAttributes( { value, onChange } );
			return null;
		}

		beforeEach( () => {
			container = document.createElement( 'div' );
			document.body.appendChild( container );
			root = createRoot( container );
			currentHookState = null;
		} );

		afterEach( () => {
			act( () => {
				root.unmount();
			} );
			container.remove();
		} );

		it( 'initializes with default empty attribute row when link has no custom attributes', () => {
			mockActiveLink = {
				attributes: { url: 'https://example.com' },
			};

			const value = {
				text: 'Click here',
				formats: [],
				start: 2,
				end: 2,
			};

			act( () => {
				root.render(
					<TestHarness value={ value } onChange={ jest.fn() } />
				);
			} );

			expect( currentHookState.hasCustomAttributes ).toBe( false );
			expect( currentHookState.attributes ).toHaveLength( 1 );
			expect( currentHookState.attributes[ 0 ].key ).toBe( '' );
			expect( currentHookState.attributes[ 0 ].value ).toBe( '' );
			expect( currentHookState.attributes[ 0 ].id ).toBeDefined();
		} );

		it( 'initializes with existing custom attributes from active link', () => {
			mockActiveLink = {
				attributes: {
					url: 'https://example.com',
					'data-analytics': 'btn-click',
				},
			};

			const value = {
				text: 'Click here',
				formats: [],
				start: 2,
				end: 2,
			};

			act( () => {
				root.render(
					<TestHarness value={ value } onChange={ jest.fn() } />
				);
			} );

			expect( currentHookState.hasCustomAttributes ).toBe( true );
			expect( currentHookState.attributes ).toHaveLength( 1 );
			expect( currentHookState.attributes[ 0 ].key ).toBe(
				'data-analytics'
			);
			expect( currentHookState.attributes[ 0 ].value ).toBe(
				'btn-click'
			);
		} );

		it( 'supports adding, updating, and removing attribute rows', () => {
			mockActiveLink = {
				attributes: { url: 'https://example.com' },
			};

			const value = {
				text: 'Click here',
				formats: [],
				start: 0,
				end: 0,
			};

			act( () => {
				root.render(
					<TestHarness value={ value } onChange={ jest.fn() } />
				);
			} );

			// Add attribute
			act( () => {
				currentHookState.addAttribute();
			} );
			expect( currentHookState.attributes ).toHaveLength( 2 );

			// Update attribute
			act( () => {
				currentHookState.updateAttribute( 0, 'key', 'data-modal' );
				currentHookState.updateAttribute( 0, 'value', 'login' );
			} );
			expect( currentHookState.attributes[ 0 ].key ).toBe( 'data-modal' );
			expect( currentHookState.attributes[ 0 ].value ).toBe( 'login' );

			// Remove attribute
			act( () => {
				currentHookState.removeAttribute( 1 );
			} );
			expect( currentHookState.attributes ).toHaveLength( 1 );
			expect( currentHookState.attributes[ 0 ].key ).toBe( 'data-modal' );
		} );

		it( 'rejects invalid attribute names before calling onChange and identifies invalid row', () => {
			const linkFormat = {
				type: 'core/link',
				attributes: {
					url: 'https://example.com',
				},
			};
			mockActiveLink = linkFormat;

			const formats = Array.from( { length: 10 }, () => [ linkFormat ] );
			const value = {
				text: 'Click here',
				formats,
				start: 3,
				end: 3,
				activeFormats: [ linkFormat ],
			};
			const onChange = jest.fn();

			act( () => {
				root.render(
					<TestHarness value={ value } onChange={ onChange } />
				);
			} );

			// Set an invalid event handler attribute
			act( () => {
				currentHookState.updateAttribute( 0, 'key', 'onclick' );
				currentHookState.updateAttribute( 0, 'value', 'alert(1)' );
			} );

			let success;
			act( () => {
				success = currentHookState.applyAttributes();
			} );

			expect( success ).toBe( false );
			expect( onChange ).not.toHaveBeenCalled();
			expect( mockApplyFormat ).not.toHaveBeenCalled();
			expect( currentHookState.invalidRowIndices ).toEqual( [ 0 ] );
		} );

		it( 'applies attributes across full link range and preserves user selection separately', () => {
			const linkFormat = {
				type: 'core/link',
				attributes: {
					url: 'https://example.com',
					target: '_blank',
				},
			};
			mockActiveLink = linkFormat;

			const formats = Array.from( { length: 10 }, () => [ linkFormat ] );
			const value = {
				text: 'Click here',
				formats,
				start: 3,
				end: 6,
				activeFormats: [ linkFormat ],
			};
			const onChange = jest.fn();

			act( () => {
				root.render(
					<TestHarness value={ value } onChange={ onChange } />
				);
			} );

			act( () => {
				currentHookState.updateAttribute( 0, 'key', 'data-tracking' );
				currentHookState.updateAttribute( 0, 'value', 'cta-1' );
			} );

			let success;
			act( () => {
				success = currentHookState.applyAttributes();
			} );

			expect( success ).toBe( true );
			expect( mockApplyFormat ).toHaveBeenCalledTimes( 1 );
			expect( mockApplyFormat ).toHaveBeenCalledWith(
				value,
				{
					type: 'core/link',
					attributes: {
						url: 'https://example.com',
						target: '_blank',
						'data-tracking': 'cta-1',
					},
				},
				0,
				10
			);
			expect( onChange ).toHaveBeenCalledWith(
				expect.objectContaining( {
					start: 3,
					end: 6,
				} )
			);
		} );

		it( 'clears all custom attributes targeting full link range and preserving selection', () => {
			const linkFormat = {
				type: 'core/link',
				attributes: {
					url: 'https://example.com',
					'data-track': 'cta-1',
				},
			};
			mockActiveLink = linkFormat;

			const formats = Array.from( { length: 10 }, () => [ linkFormat ] );
			const value = {
				text: 'Click here',
				formats,
				start: 2,
				end: 5,
				activeFormats: [ linkFormat ],
			};
			const onChange = jest.fn();

			act( () => {
				root.render(
					<TestHarness value={ value } onChange={ onChange } />
				);
			} );

			let success;
			act( () => {
				success = currentHookState.clearAllAttributes();
			} );

			expect( success ).toBe( true );
			expect( mockApplyFormat ).toHaveBeenCalledTimes( 1 );
			expect( mockApplyFormat ).toHaveBeenCalledWith(
				value,
				{
					type: 'core/link',
					attributes: {
						url: 'https://example.com',
					},
				},
				0,
				10
			);
			expect( onChange ).toHaveBeenCalledWith(
				expect.objectContaining( {
					start: 2,
					end: 5,
				} )
			);
			expect( currentHookState.attributes ).toHaveLength( 1 );
			expect( currentHookState.attributes[ 0 ].key ).toBe( '' );
		} );
	} );
} );
