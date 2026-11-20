/* eslint-disable import/no-extraneous-dependencies */
window.IS_REACT_ACT_ENVIRONMENT = true;

const mockApplyFormat = jest.fn( ( value, format, start, end ) => ( {
	...value,
	appliedFormat: format,
	appliedRange: [ start, end ],
} ) );

jest.mock(
	'@wordpress/rich-text',
	() => ( {
		applyFormat: ( ...args ) => mockApplyFormat( ...args ),
	} ),
	{ virtual: true }
);

jest.mock(
	'@wordpress/i18n',
	() => ( {
		__: ( str ) => str,
	} ),
	{ virtual: true }
);

let lastToolbarButtonProps = null;
jest.mock(
	'@wordpress/block-editor',
	() => ( {
		RichTextToolbarButton: ( props ) => {
			lastToolbarButtonProps = props;
			return (
				<button
					id="badge-toolbar-button"
					onClick={ props.onClick }
					aria-expanded={ props[ 'aria-expanded' ] }
				>
					{ props.title }
				</button>
			);
		},
	} ),
	{ virtual: true }
);

jest.mock( './icon', () => () => <span id="badge-icon" /> );
jest.mock( './inline-ui', () => () => <div id="badge-inline-ui" /> );

import { act } from 'react';
import { createRoot } from '@wordpress/element';
import { Edit } from './edit';
import { FORMAT_NAME } from './constants';

describe( 'Badge Edit Component', () => {
	let container;
	let root;
	let onChange;

	beforeEach( () => {
		container = document.createElement( 'div' );
		document.body.appendChild( container );
		root = createRoot( container );
		onChange = jest.fn();
		mockApplyFormat.mockClear();
		lastToolbarButtonProps = null;
	} );

	afterEach( () => {
		act( () => {
			root.unmount();
		} );
		container.remove();
	} );

	it( 'applies format to collapsed caret without reusing preceding badge range', () => {
		const value = {
			text: 'Hello world',
			formats: [],
			start: 5,
			end: 5,
		};

		act( () => {
			root.render(
				<Edit
					value={ value }
					onChange={ onChange }
					isActive={ false }
					activeAttributes={ {} }
					contentRef={ { current: null } }
				/>
			);
		} );

		expect( lastToolbarButtonProps ).not.toBeNull();
		act( () => {
			lastToolbarButtonProps.onClick();
		} );

		expect( mockApplyFormat ).toHaveBeenCalledTimes( 1 );
		expect( mockApplyFormat ).toHaveBeenCalledWith(
			value,
			expect.objectContaining( {
				type: FORMAT_NAME,
				attributes: expect.objectContaining( {
					class: expect.stringContaining( 'has-badge' ),
				} ),
			} ),
			5,
			5
		);
		expect( onChange ).toHaveBeenCalledTimes( 1 );
	} );

	it( 'applies format to selected range when text is highlighted', () => {
		const value = {
			text: 'Hello world',
			formats: [ [], [], [], [], [], [], [], [], [], [], [] ],
			start: 0,
			end: 5,
		};

		act( () => {
			root.render(
				<Edit
					value={ value }
					onChange={ onChange }
					isActive={ false }
					activeAttributes={ {} }
					contentRef={ { current: null } }
				/>
			);
		} );

		expect( lastToolbarButtonProps ).not.toBeNull();
		act( () => {
			lastToolbarButtonProps.onClick();
		} );

		expect( mockApplyFormat ).toHaveBeenCalledTimes( 1 );
		expect( mockApplyFormat ).toHaveBeenCalledWith(
			value,
			expect.objectContaining( {
				type: FORMAT_NAME,
			} ),
			0,
			5
		);
	} );

	it( 'toggles popover open without re-applying format when format is already active', () => {
		const value = {
			text: 'Hello world',
			formats: [],
			start: 2,
			end: 2,
		};

		act( () => {
			root.render(
				<Edit
					value={ value }
					onChange={ onChange }
					isActive={ true }
					activeAttributes={ {} }
					contentRef={ { current: null } }
				/>
			);
		} );

		expect( lastToolbarButtonProps ).not.toBeNull();
		act( () => {
			lastToolbarButtonProps.onClick();
		} );

		expect( mockApplyFormat ).not.toHaveBeenCalled();
		expect( container.querySelector( '#badge-inline-ui' ) ).not.toBeNull();
	} );

	it( 'preserves existing badge attributes when collapsed caret is on an existing badge', () => {
		const existingBadge = {
			type: FORMAT_NAME,
			attributes: {
				class: 'has-badge is-style-solid is-radius-pill is-size-large',
				style: '--badge-color: #ef4444;',
			},
		};
		const value = {
			text: 'Badge text',
			formats: [ [ existingBadge ], [ existingBadge ], [] ],
			start: 0,
			end: 0,
		};

		act( () => {
			root.render(
				<Edit
					value={ value }
					onChange={ onChange }
					isActive={ false }
					activeAttributes={ {} }
					contentRef={ { current: null } }
				/>
			);
		} );

		expect( lastToolbarButtonProps ).not.toBeNull();
		act( () => {
			lastToolbarButtonProps.onClick();
		} );

		expect( mockApplyFormat ).not.toHaveBeenCalled();
		expect( container.querySelector( '#badge-inline-ui' ) ).not.toBeNull();
	} );
} );
