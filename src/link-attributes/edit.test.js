/* eslint-disable import/no-extraneous-dependencies */
window.IS_REACT_ACT_ENVIRONMENT = true;

let mockActiveLink = null;
jest.mock(
	'@wordpress/rich-text',
	() => ( {
		getActiveFormat: ( value, formatType ) => {
			if ( formatType === 'core/link' ) {
				return mockActiveLink;
			}
			return undefined;
		},
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
					id="link-attributes-toolbar-button"
					onClick={ props.onClick }
					aria-expanded={ props[ 'aria-expanded' ] }
					data-is-active={ props.isActive ? 'true' : 'false' }
				>
					{ props.title }
				</button>
			);
		},
	} ),
	{ virtual: true }
);

let lastInlineUIProps = null;
jest.mock(
	'./inline-ui',
	() => ( props ) => {
		lastInlineUIProps = props;
		return (
			<div id="link-attributes-inline-ui">
				<button id="inline-ui-close" onClick={ props.onClose }>
					Close
				</button>
			</div>
		);
	},
	{ virtual: true }
);

import { act } from 'react';
import { createRoot } from '@wordpress/element';
import { Edit } from './edit';

describe( 'Link Attributes Edit Component', () => {
	let container;
	let root;
	let onChange;
	let onFocus;

	beforeEach( () => {
		container = document.createElement( 'div' );
		document.body.appendChild( container );
		root = createRoot( container );
		onChange = jest.fn();
		onFocus = jest.fn();
		mockActiveLink = null;
		lastToolbarButtonProps = null;
		lastInlineUIProps = null;
	} );

	afterEach( () => {
		act( () => {
			root.unmount();
		} );
		container.remove();
	} );

	it( 'renders nothing when no core/link format is active', () => {
		mockActiveLink = null;
		const value = { text: 'Plain text', formats: [], start: 0, end: 0 };

		act( () => {
			root.render(
				<Edit
					value={ value }
					onChange={ onChange }
					onFocus={ onFocus }
					contentRef={ { current: null } }
				/>
			);
		} );

		expect( lastToolbarButtonProps ).toBeNull();
		expect(
			container.querySelector( '#link-attributes-toolbar-button' )
		).toBeNull();
	} );

	it( 'renders toolbar button with isActive=false when link has no custom attributes', () => {
		mockActiveLink = {
			attributes: { url: 'https://example.com' },
		};
		const value = { text: 'Link text', formats: [], start: 0, end: 0 };

		act( () => {
			root.render(
				<Edit
					value={ value }
					onChange={ onChange }
					onFocus={ onFocus }
					contentRef={ { current: null } }
				/>
			);
		} );

		expect( lastToolbarButtonProps ).not.toBeNull();
		expect( lastToolbarButtonProps.isActive ).toBe( false );
		expect(
			container.querySelector( '#link-attributes-toolbar-button' )
		).not.toBeNull();
		expect(
			container.querySelector( '#link-attributes-inline-ui' )
		).toBeNull();
	} );

	it( 'renders toolbar button with isActive=true when link has custom attributes', () => {
		mockActiveLink = {
			attributes: {
				url: 'https://example.com',
				'data-analytics': 'cta-click',
			},
		};
		const value = { text: 'Link text', formats: [], start: 0, end: 0 };

		act( () => {
			root.render(
				<Edit
					value={ value }
					onChange={ onChange }
					onFocus={ onFocus }
					contentRef={ { current: null } }
				/>
			);
		} );

		expect( lastToolbarButtonProps ).not.toBeNull();
		expect( lastToolbarButtonProps.isActive ).toBe( true );
	} );

	it( 'opens popover on click and invokes onFocus callback', () => {
		mockActiveLink = {
			attributes: { url: 'https://example.com' },
		};
		const value = { text: 'Link text', formats: [], start: 0, end: 0 };

		act( () => {
			root.render(
				<Edit
					value={ value }
					onChange={ onChange }
					onFocus={ onFocus }
					contentRef={ { current: null } }
				/>
			);
		} );

		act( () => {
			lastToolbarButtonProps.onClick();
		} );

		expect( onFocus ).toHaveBeenCalledTimes( 1 );
		expect(
			container.querySelector( '#link-attributes-inline-ui' )
		).not.toBeNull();
		expect( lastToolbarButtonProps[ 'aria-expanded' ] ).toBe( true );
	} );

	it( 'closes popover when clicking button again or when onClose callback fires', () => {
		mockActiveLink = {
			attributes: { url: 'https://example.com' },
		};
		const value = { text: 'Link text', formats: [], start: 0, end: 0 };

		act( () => {
			root.render(
				<Edit
					value={ value }
					onChange={ onChange }
					onFocus={ onFocus }
					contentRef={ { current: null } }
				/>
			);
		} );

		// Open popover
		act( () => {
			lastToolbarButtonProps.onClick();
		} );
		expect(
			container.querySelector( '#link-attributes-inline-ui' )
		).not.toBeNull();

		// Close popover via onClose
		act( () => {
			lastInlineUIProps.onClose();
		} );
		expect(
			container.querySelector( '#link-attributes-inline-ui' )
		).toBeNull();
	} );
} );
