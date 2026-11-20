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
		expect( registeredFormats ).toContain( 'blablablocks/badge' );
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

	test( 'can apply badge format to text in paragraph block', async ( {
		editor,
		page,
	} ) => {
		await editor.insertBlock( {
			name: 'core/paragraph',
			attributes: { content: 'Testing Badge Format' },
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

		// Click Badge option in format controls
		const badgeOption = page.locator(
			'role=menuitemcheckbox[name="Badge"i]'
		);
		if ( await badgeOption.isVisible() ) {
			await badgeOption.click();
		} else {
			const badgeButton = page.locator( 'role=button[name="Badge"i]' );
			await badgeButton.click();
		}

		// Verify that a badge element was applied inside the paragraph
		const badgeElement = paragraph.locator( '.has-badge' );
		await expect( badgeElement ).toBeVisible();
	} );
} );
