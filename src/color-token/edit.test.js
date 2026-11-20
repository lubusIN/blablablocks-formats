/* eslint-disable import/no-extraneous-dependencies */
global.IS_REACT_ACT_ENVIRONMENT = true;

import React, { act } from 'react';
import { createRoot } from '@wordpress/element';

const mockApplyFormat = jest.fn( ( value, format ) => ( {
	...value,
	applied: format,
} ) );
const mockRemoveFormat = jest.fn( ( value, formatName ) => ( {
	...value,
	removed: formatName,
} ) );
const mockUseAnchor = jest.fn( () => ( {} ) );

jest.mock(
	'@wordpress/i18n',
	() => ( {
		__: ( str ) => str,
	} ),
	{ virtual: true }
);

jest.mock(
	'@wordpress/icons',
	() => ( {
		brush: 'brush-icon',
	} ),
	{ virtual: true }
);

jest.mock(
	'@wordpress/rich-text',
	() => ( {
		applyFormat: ( ...args ) => mockApplyFormat( ...args ),
		removeFormat: ( ...args ) => mockRemoveFormat( ...args ),
		useAnchor: ( ...args ) => mockUseAnchor( ...args ),
		slice: ( value ) => ( { text: value?.selectedText || '' } ),
		getTextContent: ( sliced ) => sliced?.text || '',
		registerFormatType: jest.fn(),
	} ),
	{ virtual: true }
);

jest.mock(
	'@wordpress/block-editor',
	() => ( {
		RichTextToolbarButton: ( props ) => (
			<button data-testid="toolbar-button" onClick={ props.onClick }>
				{ props.title }
			</button>
		),
	} ),
	{ virtual: true }
);

jest.mock(
	'@wordpress/components',
	() => ( {
		Popover: ( { children } ) => (
			<div data-testid="popover">{ children }</div>
		),
		ColorPalette: ( { onChange } ) => (
			<div data-testid="color-palette">
				<button
					data-testid="select-color"
					onClick={ () => onChange( '#3498db' ) }
				>
					Select
				</button>
				<button
					data-testid="clear-color"
					onClick={ () => onChange( undefined ) }
				>
					Clear
				</button>
			</div>
		),
	} ),
	{ virtual: true }
);

jest.mock(
	'@wordpress/data',
	() => ( {
		useSelect: jest.fn( ( selector ) =>
			selector( () => ( {
				getSettings: () => ( { colors: [] } ),
			} ) )
		),
	} ),
	{ virtual: true }
);

import { Edit } from './edit';
import { FORMAT_NAME } from './index';

describe( 'Color Token Edit component', () => {
	let container = null;
	let root = null;
	let onChange;
	let onFocus;
	let domElement;

	beforeEach( () => {
		container = document.createElement( 'div' );
		document.body.appendChild( container );
		root = createRoot( container );
		onChange = jest.fn();
		onFocus = jest.fn();
		domElement = document.createElement( 'p' );
		document.body.appendChild( domElement );
		mockApplyFormat.mockClear();
		mockRemoveFormat.mockClear();
		mockUseAnchor.mockClear();
	} );

	afterEach( () => {
		act( () => {
			root.unmount();
		} );
		container.remove();
		container = null;
		domElement.remove();
		domElement = null;
	} );

	it( 'auto-applies format directly on explicit color codes without opening popover', () => {
		const value = { selectedText: '#ff0000' };
		const contentRef = { current: domElement };

		act( () => {
			root.render(
				<Edit
					value={ value }
					onChange={ onChange }
					onFocus={ onFocus }
					isActive={ false }
					activeAttributes={ {} }
					contentRef={ contentRef }
				/>
			);
		} );

		const button = container.querySelector(
			'[data-testid="toolbar-button"]'
		);
		act( () => {
			button.dispatchEvent(
				new MouseEvent( 'click', { bubbles: true } )
			);
		} );

		expect( mockApplyFormat ).toHaveBeenCalledTimes( 1 );
		expect( mockApplyFormat ).toHaveBeenCalledWith(
			value,
			expect.objectContaining( {
				type: FORMAT_NAME,
				attributes: expect.objectContaining( {
					color: '#ff0000',
				} ),
			} )
		);
		expect( onFocus ).toHaveBeenCalled();
		expect(
			container.querySelector( '[data-testid="popover"]' )
		).toBeNull();
	} );

	it( 'auto-applies format directly on named colors (like red, blue) without opening popover', () => {
		const value = { selectedText: 'red' };
		const contentRef = { current: domElement };

		act( () => {
			root.render(
				<Edit
					value={ value }
					onChange={ onChange }
					onFocus={ onFocus }
					isActive={ false }
					activeAttributes={ {} }
					contentRef={ contentRef }
				/>
			);
		} );

		const button = container.querySelector(
			'[data-testid="toolbar-button"]'
		);
		act( () => {
			button.dispatchEvent(
				new MouseEvent( 'click', { bubbles: true } )
			);
		} );

		expect( mockApplyFormat ).toHaveBeenCalledTimes( 1 );
		expect( mockApplyFormat ).toHaveBeenCalledWith(
			value,
			expect.objectContaining( {
				type: FORMAT_NAME,
				attributes: expect.objectContaining( {
					color: 'red',
				} ),
			} )
		);
		expect( onFocus ).toHaveBeenCalled();
		expect(
			container.querySelector( '[data-testid="popover"]' )
		).toBeNull();
	} );

	it( 'opens popover and correctly unwraps contentRef when text is not color', () => {
		const value = { selectedText: 'not a color' };
		const contentRef = { current: domElement };

		act( () => {
			root.render(
				<Edit
					value={ value }
					onChange={ onChange }
					onFocus={ onFocus }
					isActive={ false }
					activeAttributes={ {} }
					contentRef={ contentRef }
				/>
			);
		} );

		const button = container.querySelector(
			'[data-testid="toolbar-button"]'
		);
		act( () => {
			button.dispatchEvent(
				new MouseEvent( 'click', { bubbles: true } )
			);
		} );

		// Should not auto-apply format
		expect( mockApplyFormat ).not.toHaveBeenCalled();

		// Popover should be open
		expect(
			container.querySelector( '[data-testid="popover"]' )
		).not.toBeNull();

		// Verify useAnchor was called with the unwrapped DOM element, not the ref object
		expect( mockUseAnchor ).toHaveBeenCalledWith(
			expect.objectContaining( {
				editableContentElement: domElement,
				settings: expect.objectContaining( {
					name: FORMAT_NAME,
					tagName: 'span',
					className: 'has-color-token-format',
					isActive: false,
				} ),
			} )
		);
	} );

	it( 'opens popover when selected text is a word that tinycolor would misinterpret as hex (e.g. "face", "bed")', () => {
		const value = { selectedText: 'face' };
		const contentRef = { current: domElement };

		act( () => {
			root.render(
				<Edit
					value={ value }
					onChange={ onChange }
					onFocus={ onFocus }
					isActive={ false }
					activeAttributes={ {} }
					contentRef={ contentRef }
				/>
			);
		} );

		const button = container.querySelector(
			'[data-testid="toolbar-button"]'
		);
		act( () => {
			button.dispatchEvent(
				new MouseEvent( 'click', { bubbles: true } )
			);
		} );

		// Should NOT treat "face" as hex color #ffaacc and should open popover instead
		expect( mockApplyFormat ).not.toHaveBeenCalled();
		expect(
			container.querySelector( '[data-testid="popover"]' )
		).not.toBeNull();
	} );

	it( 'applies selected color from popover on non-color text', () => {
		const value = { selectedText: 'my text' };
		const contentRef = { current: domElement };

		act( () => {
			root.render(
				<Edit
					value={ value }
					onChange={ onChange }
					onFocus={ onFocus }
					isActive={ false }
					activeAttributes={ {} }
					contentRef={ contentRef }
				/>
			);
		} );

		// Open popover
		const button = container.querySelector(
			'[data-testid="toolbar-button"]'
		);
		act( () => {
			button.dispatchEvent(
				new MouseEvent( 'click', { bubbles: true } )
			);
		} );

		// Click select color in palette
		const selectColorBtn = container.querySelector(
			'[data-testid="select-color"]'
		);
		act( () => {
			selectColorBtn.dispatchEvent(
				new MouseEvent( 'click', { bubbles: true } )
			);
		} );

		expect( mockApplyFormat ).toHaveBeenCalledTimes( 1 );
		expect( mockApplyFormat ).toHaveBeenCalledWith(
			value,
			expect.objectContaining( {
				type: FORMAT_NAME,
				attributes: expect.objectContaining( {
					color: '#3498db',
				} ),
			} )
		);
	} );

	it( 'safely handles contentRef when it is already a DOM element', () => {
		const value = { selectedText: 'sample text' };

		act( () => {
			root.render(
				<Edit
					value={ value }
					onChange={ onChange }
					onFocus={ onFocus }
					isActive={ false }
					activeAttributes={ {} }
					contentRef={ domElement }
				/>
			);
		} );

		const button = container.querySelector(
			'[data-testid="toolbar-button"]'
		);
		act( () => {
			button.dispatchEvent(
				new MouseEvent( 'click', { bubbles: true } )
			);
		} );

		expect( mockUseAnchor ).toHaveBeenCalledWith(
			expect.objectContaining( {
				editableContentElement: domElement,
			} )
		);
	} );

	it( 'safely handles contentRef with null current without crashing', () => {
		const value = { selectedText: 'sample text' };
		const contentRef = { current: null };

		expect( () => {
			act( () => {
				root.render(
					<Edit
						value={ value }
						onChange={ onChange }
						onFocus={ onFocus }
						isActive={ false }
						activeAttributes={ {} }
						contentRef={ contentRef }
					/>
				);
			} );
		} ).not.toThrow();
	} );
} );
