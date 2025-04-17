<?php
/**
 * BlaBlaBlocks highlighted format init.
 *
 * @package BlaBlaBlocks_formats
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Register BlaBlaBlocks formats scripts and styles.
 */
function blablablocks_highlighted_format_init() {
	// automatically load dependencies and version.
	$asset_file = include plugin_dir_path( __FILE__ ) . '../build/index.asset.php';

	wp_register_script(
		'blablablocks-highlighted-format-asset',
		plugins_url( '../assets/highlighted-format/highlighted-format.js', __FILE__ ),
		array(),
		$asset_file['version'],
		array( 'in_footer' => true )
	);

	$asset_file['dependencies'][] = 'blablablocks-highlighted-format-asset';

	wp_register_script(
		'blablablocks-highlighted-format-script',
		plugins_url( '../build/index.js', __FILE__ ),
		$asset_file['dependencies'],
		$asset_file['version'],
		array( 'in_footer' => true )
	);

	wp_register_style(
		'blablablocks-highlighted-format-editor-styles',
		plugins_url( '../build/index.css', __FILE__ ),
		array(),
		$asset_file['version']
	);
}

/**
 * Enqueue scripts required for frontend as well as editor.
 */
function blablablocks_highlighted_format_enqueue_assets() {
	wp_enqueue_script( 'blablablocks-highlighted-format-script' );

	if ( is_admin() ) {
		// Enqueue the style only for the editor.
		wp_enqueue_style( 'blablablocks-highlighted-format-editor-styles' );
	}
}
