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
	'@wordpress/rich-text',
	() => ( {
		applyFormat: ( ...args ) => mockApplyFormat( ...args ),
		removeFormat: ( ...args ) => mockRemoveFormat( ...args ),
		useAnchor: ( ...args ) => mockUseAnchor( ...args ),
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
		Popover: ( { children, onFocusOutside } ) => (
			<div
				data-testid="popover"
				data-has-focus-outside={ Boolean( onFocusOutside ) }
			>
				{ children }
			</div>
		),
		TabPanel: ( { tabs, children } ) => {
			const ReactLib = require( 'react' );
			const [ selectedTab, setSelectedTab ] = ReactLib.useState(
				tabs[ 0 ].name
			);
			const active =
				tabs.find( ( t ) => t.name === selectedTab ) || tabs[ 0 ];
			return (
				<div data-testid="tab-panel">
					<div role="tablist">
						{ tabs.map( ( tab ) => (
							<button
								key={ tab.name }
								role="tab"
								data-testid={ `tab-${ tab.name }` }
								aria-selected={ selectedTab === tab.name }
								disabled={ tab.disabled }
								onClick={ () => setSelectedTab( tab.name ) }
							>
								{ tab.title }
							</button>
						) ) }
					</div>
					<div data-testid="tab-content">{ children( active ) }</div>
				</div>
			);
		},
		Button: ( { children, onClick, disabled, className } ) => (
			<button
				className={ className }
				data-testid={ className || 'button' }
				onClick={ onClick }
				disabled={ disabled }
			>
				{ children }
			</button>
		),
		FormToggle: ( { checked, onChange, 'aria-label': ariaLabel } ) => (
			<input
				type="checkbox"
				data-testid="form-toggle"
				checked={ checked }
				onChange={ onChange }
				aria-label={ ariaLabel }
			/>
		),
		__experimentalNumberControl: ( { value, onChange, disabled } ) => (
			<div data-testid="number-control">
				<input
					type="number"
					value={ value }
					disabled={ disabled }
					onChange={ ( e ) => onChange( e.target.value ) }
				/>
				<button
					data-testid="change-speed"
					disabled={ disabled }
					onClick={ () => onChange( '6' ) }
				>
					Set Speed
				</button>
				<button
					data-testid="clear-speed"
					disabled={ disabled }
					onClick={ () => onChange( '' ) }
				>
					Clear Speed
				</button>
			</div>
		),
		SelectControl: ( { value, onChange, options, disabled } ) => (
			<div data-testid="select-control">
				<select
					value={ value }
					disabled={ disabled }
					onChange={ ( e ) => onChange( e.target.value ) }
				>
					{ options.map( ( opt ) => (
						<option key={ opt.value } value={ opt.value }>
							{ opt.label }
						</option>
					) ) }
				</select>
				<button
					data-testid="change-type-pulse"
					disabled={ disabled }
					onClick={ () => onChange( 'pulse' ) }
				>
					Set Type Pulse
				</button>
				<button
					data-testid="change-type-rainbow"
					disabled={ disabled }
					onClick={ () => onChange( 'rainbow' ) }
				>
					Set Type Rainbow
				</button>
				<button
					data-testid="change-type-shimmer"
					disabled={ disabled }
					onClick={ () => onChange( 'shimmer' ) }
				>
					Set Type Shimmer
				</button>
				<button
					data-testid="change-type-orbit"
					disabled={ disabled }
					onClick={ () => onChange( 'orbit' ) }
				>
					Set Type Orbit
				</button>
				<button
					data-testid="change-type-neon"
					disabled={ disabled }
					onClick={ () => onChange( 'neon' ) }
				>
					Set Type Neon
				</button>
				<button
					data-testid="change-type-glitch"
					disabled={ disabled }
					onClick={ () => onChange( 'glitch' ) }
				>
					Set Type Glitch
				</button>
			</div>
		),
		__experimentalGrid: ( { children, className } ) => (
			<div className={ className }>{ children }</div>
		),
		GradientPicker: ( { onChange } ) => (
			<div data-testid="gradient-picker">
				<button
					data-testid="select-gradient"
					onClick={ () =>
						onChange(
							'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)'
						)
					}
				>
					Select
				</button>
				<button
					data-testid="clear-gradient"
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
				getSettings: () => ( {
					gradients: [
						{
							name: 'Cyan to blue',
							gradient:
								'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
							slug: 'cyan-to-blue',
						},
					],
				} ),
			} ) )
		),
	} ),
	{ virtual: true }
);

import { Edit } from './edit';
import { FORMAT_NAME } from './index';

describe( 'Gradient Text Edit component', () => {
	let container = null;
	let root = null;
	let onChange;
	let domElement;

	beforeEach( () => {
		container = document.createElement( 'div' );
		document.body.appendChild( container );
		root = createRoot( container );
		onChange = jest.fn();
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

	it( 'opens popover with tabs and disables animation tab when no gradient is set', () => {
		const value = { text: 'Hello' };
		const contentRef = { current: domElement };

		act( () => {
			root.render(
				<Edit
					value={ value }
					onChange={ onChange }
					isActive={ false }
					activeAttributes={ {} }
					contentRef={ contentRef }
				/>
			);
		} );

		// Click toolbar button
		const button = container.querySelector(
			'[data-testid="toolbar-button"]'
		);
		act( () => {
			button.dispatchEvent(
				new MouseEvent( 'click', { bubbles: true } )
			);
		} );

		expect(
			container.querySelector( '[data-testid="popover"]' )
		).not.toBeNull();

		const gradientTab = container.querySelector(
			'[data-testid="tab-gradient"]'
		);
		const animationTab = container.querySelector(
			'[data-testid="tab-animation"]'
		);

		expect( gradientTab ).not.toBeNull();
		expect( animationTab ).not.toBeNull();
		expect( animationTab.disabled ).toBe( true );
	} );

	it( 'enables animation tab and applies format when a gradient is active', () => {
		const value = { text: 'Hello' };
		const contentRef = { current: domElement };
		const activeAttributes = {
			style: 'background-image: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);',
		};

		act( () => {
			root.render(
				<Edit
					value={ value }
					onChange={ onChange }
					isActive={ true }
					activeAttributes={ activeAttributes }
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

		const animationTab = container.querySelector(
			'[data-testid="tab-animation"]'
		);
		expect( animationTab.disabled ).toBe( false );
	} );

	it( 'toggles animation on and updates speed and type in animation tab', () => {
		const value = { text: 'Hello' };
		const contentRef = { current: domElement };
		const activeAttributes = {
			style: 'background-image: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);',
		};

		act( () => {
			root.render(
				<Edit
					value={ value }
					onChange={ onChange }
					isActive={ true }
					activeAttributes={ activeAttributes }
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

		// Switch to Animation tab
		const animationTab = container.querySelector(
			'[data-testid="tab-animation"]'
		);
		act( () => {
			animationTab.dispatchEvent(
				new MouseEvent( 'click', { bubbles: true } )
			);
		} );

		// Initially animation toggle is unchecked and controls disabled
		const toggle = container.querySelector( '[data-testid="form-toggle"]' );
		const speedBtn = container.querySelector(
			'[data-testid="change-speed"]'
		);
		const typeBtn = container.querySelector(
			'[data-testid="change-type-pulse"]'
		);

		expect( toggle.checked ).toBe( false );
		expect( toggle.getAttribute( 'aria-label' ) ).toBe(
			'Enable Animation'
		);
		expect( speedBtn.disabled ).toBe( true );
		expect( typeBtn.disabled ).toBe( true );

		// Enable animation
		act( () => {
			toggle.dispatchEvent(
				new MouseEvent( 'click', { bubbles: true } )
			);
		} );

		expect( mockApplyFormat ).toHaveBeenCalledWith(
			value,
			expect.objectContaining( {
				type: FORMAT_NAME,
				attributes: expect.objectContaining( {
					animation: 'true',
					animated: 'true',
					'animation-duration': '4',
					'animation-type': 'flow',
				} ),
			} )
		);
	} );

	it( 'updates speed and animation type when animation is enabled', () => {
		const value = { text: 'Hello' };
		const contentRef = { current: domElement };
		const activeAttributes = {
			style: 'background-image: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);',
			animation: 'true',
			'animation-duration': '4',
			'animation-type': 'flow',
		};

		act( () => {
			root.render(
				<Edit
					value={ value }
					onChange={ onChange }
					isActive={ true }
					activeAttributes={ activeAttributes }
					contentRef={ contentRef }
				/>
			);
		} );

		// Open popover and switch to animation tab
		const button = container.querySelector(
			'[data-testid="toolbar-button"]'
		);
		act( () => {
			button.dispatchEvent(
				new MouseEvent( 'click', { bubbles: true } )
			);
		} );

		const animationTab = container.querySelector(
			'[data-testid="tab-animation"]'
		);
		act( () => {
			animationTab.dispatchEvent(
				new MouseEvent( 'click', { bubbles: true } )
			);
		} );

		const speedBtn = container.querySelector(
			'[data-testid="change-speed"]'
		);
		const typeBtn = container.querySelector(
			'[data-testid="change-type-pulse"]'
		);

		expect( speedBtn.disabled ).toBe( false );
		expect( typeBtn.disabled ).toBe( false );

		// Change speed
		act( () => {
			speedBtn.dispatchEvent(
				new MouseEvent( 'click', { bubbles: true } )
			);
		} );

		expect( mockApplyFormat ).toHaveBeenCalledWith(
			value,
			expect.objectContaining( {
				type: FORMAT_NAME,
				attributes: expect.objectContaining( {
					'animation-duration': '6',
				} ),
			} )
		);

		// Change type to pulse
		act( () => {
			typeBtn.dispatchEvent(
				new MouseEvent( 'click', { bubbles: true } )
			);
		} );

		expect( mockApplyFormat ).toHaveBeenCalledWith(
			value,
			expect.objectContaining( {
				type: FORMAT_NAME,
				attributes: expect.objectContaining( {
					'animation-type': 'pulse',
				} ),
			} )
		);

		// Change type to rainbow
		const rainbowBtn = container.querySelector(
			'[data-testid="change-type-rainbow"]'
		);
		act( () => {
			rainbowBtn.dispatchEvent(
				new MouseEvent( 'click', { bubbles: true } )
			);
		} );

		expect( mockApplyFormat ).toHaveBeenCalledWith(
			value,
			expect.objectContaining( {
				type: FORMAT_NAME,
				attributes: expect.objectContaining( {
					'animation-type': 'rainbow',
				} ),
			} )
		);

		// Change type to shimmer
		const shimmerBtn = container.querySelector(
			'[data-testid="change-type-shimmer"]'
		);
		act( () => {
			shimmerBtn.dispatchEvent(
				new MouseEvent( 'click', { bubbles: true } )
			);
		} );

		expect( mockApplyFormat ).toHaveBeenCalledWith(
			value,
			expect.objectContaining( {
				type: FORMAT_NAME,
				attributes: expect.objectContaining( {
					'animation-type': 'shimmer',
				} ),
			} )
		);

		// Change type to orbit
		const orbitBtn = container.querySelector(
			'[data-testid="change-type-orbit"]'
		);
		act( () => {
			orbitBtn.dispatchEvent(
				new MouseEvent( 'click', { bubbles: true } )
			);
		} );

		expect( mockApplyFormat ).toHaveBeenCalledWith(
			value,
			expect.objectContaining( {
				type: FORMAT_NAME,
				attributes: expect.objectContaining( {
					'animation-type': 'orbit',
				} ),
			} )
		);

		// Change type to neon
		const neonBtn = container.querySelector(
			'[data-testid="change-type-neon"]'
		);
		act( () => {
			neonBtn.dispatchEvent(
				new MouseEvent( 'click', { bubbles: true } )
			);
		} );

		expect( mockApplyFormat ).toHaveBeenCalledWith(
			value,
			expect.objectContaining( {
				type: FORMAT_NAME,
				attributes: expect.objectContaining( {
					'animation-type': 'neon',
				} ),
			} )
		);

		// Change type to glitch
		const glitchBtn = container.querySelector(
			'[data-testid="change-type-glitch"]'
		);
		act( () => {
			glitchBtn.dispatchEvent(
				new MouseEvent( 'click', { bubbles: true } )
			);
		} );

		expect( mockApplyFormat ).toHaveBeenCalledWith(
			value,
			expect.objectContaining( {
				type: FORMAT_NAME,
				attributes: expect.objectContaining( {
					'animation-type': 'glitch',
				} ),
			} )
		);
	} );

	it( 'clears animation settings with reset button in animation tab', () => {
		const value = { text: 'Hello' };
		const contentRef = { current: domElement };
		const activeAttributes = {
			style: 'background-image: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);',
			animation: 'true',
			'animation-duration': '6',
			'animation-type': 'sweep',
		};

		act( () => {
			root.render(
				<Edit
					value={ value }
					onChange={ onChange }
					isActive={ true }
					activeAttributes={ activeAttributes }
					contentRef={ contentRef }
				/>
			);
		} );

		// Open popover and switch to animation tab
		const button = container.querySelector(
			'[data-testid="toolbar-button"]'
		);
		act( () => {
			button.dispatchEvent(
				new MouseEvent( 'click', { bubbles: true } )
			);
		} );

		const animationTab = container.querySelector(
			'[data-testid="tab-animation"]'
		);
		act( () => {
			animationTab.dispatchEvent(
				new MouseEvent( 'click', { bubbles: true } )
			);
		} );

		const clearBtn = container.querySelector( '.reset-button' );
		expect( clearBtn.disabled ).toBe( false );

		act( () => {
			clearBtn.dispatchEvent(
				new MouseEvent( 'click', { bubbles: true } )
			);
		} );

		expect( mockApplyFormat ).toHaveBeenCalledWith(
			value,
			expect.objectContaining( {
				type: FORMAT_NAME,
				attributes: {
					style: 'background-image: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);',
				},
			} )
		);
	} );

	it( 'clears format completely when clicking clear in gradient tab', () => {
		const value = { text: 'Hello' };
		const contentRef = { current: domElement };
		const activeAttributes = {
			style: 'background-image: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);',
			animation: 'true',
		};

		act( () => {
			root.render(
				<Edit
					value={ value }
					onChange={ onChange }
					isActive={ true }
					activeAttributes={ activeAttributes }
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

		const clearBtn = container.querySelector( '.reset-button' );
		act( () => {
			clearBtn.dispatchEvent(
				new MouseEvent( 'click', { bubbles: true } )
			);
		} );

		expect( mockRemoveFormat ).toHaveBeenCalledWith( value, FORMAT_NAME );
		expect(
			container.querySelector( '[data-testid="popover"]' )
		).toBeNull();
	} );

	it( 'preserves animation attributes when switching gradients in gradient tab', () => {
		const value = { text: 'Hello' };
		const contentRef = { current: domElement };
		const activeAttributes = {
			style: 'background-image: linear-gradient(135deg, #ff0000 0%, #00ff00 100%);',
			animation: 'true',
			'animation-duration': '3',
			'animation-type': 'sweep',
		};

		act( () => {
			root.render(
				<Edit
					value={ value }
					onChange={ onChange }
					isActive={ true }
					activeAttributes={ activeAttributes }
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

		// Select a new gradient
		const selectBtn = container.querySelector(
			'[data-testid="select-gradient"]'
		);
		act( () => {
			selectBtn.dispatchEvent(
				new MouseEvent( 'click', { bubbles: true } )
			);
		} );

		expect( mockApplyFormat ).toHaveBeenCalledWith(
			value,
			expect.objectContaining( {
				type: FORMAT_NAME,
				attributes: expect.objectContaining( {
					style: 'background-image: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);',
					animation: 'true',
					'animation-duration': '3',
					'animation-type': 'sweep',
				} ),
			} )
		);
	} );

	it( 'toggles animation off and removes animation attributes when already enabled', () => {
		const value = { text: 'Hello' };
		const contentRef = { current: domElement };
		const activeAttributes = {
			style: 'background-image: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);',
			animation: 'true',
			animated: 'true',
			'animation-duration': '4',
			'animation-type': 'flow',
		};

		act( () => {
			root.render(
				<Edit
					value={ value }
					onChange={ onChange }
					isActive={ true }
					activeAttributes={ activeAttributes }
					contentRef={ contentRef }
				/>
			);
		} );

		// Open popover and switch to animation tab
		const button = container.querySelector(
			'[data-testid="toolbar-button"]'
		);
		act( () => {
			button.dispatchEvent(
				new MouseEvent( 'click', { bubbles: true } )
			);
		} );

		const animationTab = container.querySelector(
			'[data-testid="tab-animation"]'
		);
		act( () => {
			animationTab.dispatchEvent(
				new MouseEvent( 'click', { bubbles: true } )
			);
		} );

		const toggle = container.querySelector( '[data-testid="form-toggle"]' );
		expect( toggle.checked ).toBe( true );

		// Toggle off
		act( () => {
			toggle.dispatchEvent(
				new MouseEvent( 'click', { bubbles: true } )
			);
		} );

		expect( mockApplyFormat ).toHaveBeenCalledWith(
			value,
			expect.objectContaining( {
				type: FORMAT_NAME,
				attributes: {
					style: 'background-image: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);',
				},
			} )
		);
	} );

	it( 'removes animation-duration attribute when speed input is cleared', () => {
		const value = { text: 'Hello' };
		const contentRef = { current: domElement };
		const activeAttributes = {
			style: 'background-image: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);',
			animation: 'true',
			'animation-duration': '6',
			'animation-type': 'flow',
		};

		act( () => {
			root.render(
				<Edit
					value={ value }
					onChange={ onChange }
					isActive={ true }
					activeAttributes={ activeAttributes }
					contentRef={ contentRef }
				/>
			);
		} );

		// Open popover and switch to animation tab
		const button = container.querySelector(
			'[data-testid="toolbar-button"]'
		);
		act( () => {
			button.dispatchEvent(
				new MouseEvent( 'click', { bubbles: true } )
			);
		} );

		const animationTab = container.querySelector(
			'[data-testid="tab-animation"]'
		);
		act( () => {
			animationTab.dispatchEvent(
				new MouseEvent( 'click', { bubbles: true } )
			);
		} );

		const clearSpeedBtn = container.querySelector(
			'[data-testid="clear-speed"]'
		);
		act( () => {
			clearSpeedBtn.dispatchEvent(
				new MouseEvent( 'click', { bubbles: true } )
			);
		} );

		expect( mockApplyFormat ).toHaveBeenCalledWith(
			value,
			expect.objectContaining( {
				type: FORMAT_NAME,
				attributes: {
					style: 'background-image: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);',
					animation: 'true',
					'animation-type': 'flow',
				},
			} )
		);
	} );

	it( 'converts linear to radial gradient when replacing gradient on radial style', () => {
		const value = { text: 'Hello' };
		const contentRef = { current: domElement };
		const activeAttributes = {
			style: 'background-image: radial-gradient(#ff0000 0%, #00ff00 100%);',
		};

		act( () => {
			root.render(
				<Edit
					value={ value }
					onChange={ onChange }
					isActive={ true }
					activeAttributes={ activeAttributes }
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

		const selectBtn = container.querySelector(
			'[data-testid="select-gradient"]'
		);
		act( () => {
			selectBtn.dispatchEvent(
				new MouseEvent( 'click', { bubbles: true } )
			);
		} );

		expect( mockApplyFormat ).toHaveBeenCalledWith(
			value,
			expect.objectContaining( {
				type: FORMAT_NAME,
				attributes: expect.objectContaining( {
					style: 'background-image: radial-gradient(#06b6d4 0%,#3b82f6 100%);',
				} ),
			} )
		);

		const lastCall =
			mockApplyFormat.mock.calls[ mockApplyFormat.mock.calls.length - 1 ];
		const appliedStyle = lastCall[ 1 ].attributes.style;
		expect( appliedStyle ).not.toContain( '135deg' );
		expect( appliedStyle ).toBe(
			'background-image: radial-gradient(#06b6d4 0%,#3b82f6 100%);'
		);
	} );

	it( 'ensures prefers-reduced-motion overrides animation with !important in compiled styles', () => {
		const fs = require( 'fs' );
		const path = require( 'path' );
		const scss = fs.readFileSync(
			path.resolve( __dirname, './style.scss' ),
			'utf8'
		);
		expect( scss ).toMatch(
			/@media\s*\(prefers-reduced-motion:\s*reduce\)[^{]*\{[\s\S]*animation:\s*none\s*!important/
		);
	} );
} );
