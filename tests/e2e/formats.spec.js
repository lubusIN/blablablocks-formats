const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe( 'BlaBlaBlocks Formats E2E', () => {
	test.beforeEach( async ( { admin } ) => {
		await admin.createNewPost();
	} );

	test( 'registers all BlaBlaBlocks format types in Gutenberg editor', async ( {
		page,
	} ) => {
		const registeredFormats = await page.evaluate( () => {
			if ( window.wp && window.wp.data && window.wp.data.select ) {
				const richText = window.wp.data.select( 'core/rich-text' );
				if ( richText && richText.getFormatTypes ) {
					return richText.getFormatTypes().map( ( f ) => f.name );
				}
			}
			return [];
		} );

		expect( registeredFormats ).toContain( 'blablablocks/marker' );
		expect( registeredFormats ).toContain( 'blablablocks/infotip' );
		expect( registeredFormats ).toContain( 'blablablocks/counter' );
		expect( registeredFormats ).toContain( 'blablablocks/color-token' );
		expect( registeredFormats ).toContain( 'blablablocks/typography' );
		expect( registeredFormats ).toContain( 'blablablocks/gradient-text' );
		expect( registeredFormats ).toContain( 'blablablocks/clear-formats' );
	} );

	test( 'can insert paragraph block and access format toolbar controls', async ( {
		editor,
		page,
	} ) => {
		await editor.insertBlock( {
			name: 'core/paragraph',
			attributes: { content: 'Testing BlaBlaBlocks Formats' },
		} );

		const paragraph = editor.canvas.locator(
			'role=document[name="Paragraph block"i]'
		);
		await expect( paragraph ).toBeVisible();
		await paragraph.click();

		// Highlight text
		await page.keyboard.press( 'Meta+A' );

		// Open more rich text controls if collapsed in dropdown
		const moreControlsButton = page.locator( 'role=button[name="More"i]' );
		if ( await moreControlsButton.isVisible() ) {
			await moreControlsButton.click();
		}

		// Verify Marker format option exists in menu
		const markerOption = page.locator(
			'role=menuitemcheckbox[name="Marker"i]'
		);
		await expect( markerOption ).toBeVisible();
	} );

	test( 'disables animated gradient text when prefers-reduced-motion is enabled and preserves normal motion', async ( {
		page,
	} ) => {
		// Attach an animated gradient text element covering flow type and 4s duration
		await page.evaluate( () => {
			const span = document.createElement( 'span' );
			span.id = 'e2e-animated-gradient-motion-test';
			span.className = 'has-gradient-text-format';
			span.setAttribute( 'data-animation', 'true' );
			span.setAttribute( 'data-animation-type', 'flow' );
			span.setAttribute( 'data-animation-duration', '4' );
			span.textContent = 'Reduced Motion Flow Test';
			document.body.appendChild( span );
		} );

		// Normal motion: animation remains available and set to flow
		await page.emulateMedia( { reducedMotion: 'no-preference' } );
		const normalAnimation = await page.evaluate( () => {
			const el = document.getElementById(
				'e2e-animated-gradient-motion-test'
			);
			return window.getComputedStyle( el ).animationName;
		} );
		expect( normalAnimation ).toBe( 'blablablocks-gradient-flow' );

		// Reduced motion: animation reset overrides animation type and duration
		await page.emulateMedia( { reducedMotion: 'reduce' } );
		const reducedAnimation = await page.evaluate( () => {
			const el = document.getElementById(
				'e2e-animated-gradient-motion-test'
			);
			return window.getComputedStyle( el ).animationName;
		} );
		expect( reducedAnimation ).toBe( 'none' );
	} );
} );
