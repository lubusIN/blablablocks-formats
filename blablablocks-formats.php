<?php
/**
 * Plugin Name:       BlaBlaBlocks Formats
 * Description:       Rich text formats from BlaBlaBlocks.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            Lubus
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       blablablocks-formats
 *
 * @package BlaBlaBlocks Formats.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Register BlaBlaBlocks formats
 */
function blablablocks_formats_init() {
	// automatically load dependencies and version.
	$asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

	wp_register_script(
		'blablablocks-highlighted-format-asset',
		plugins_url( 'assets/highlighted-format/highlighted-format.js', __FILE__ ),
		array(),
		$asset_file['version'],
		array( 'in_footer' => true )
	);

	$asset_file['dependencies'][] = 'blablablocks-highlighted-format-asset';

	wp_register_script(
		'blablablocks-highlighted-format-script',
		plugins_url( 'build/index.js', __FILE__ ),
		$asset_file['dependencies'],
		$asset_file['version'],
		array( 'in_footer' => true )
	);

	wp_register_style(
		'blablablocks-highlighted-format-editor-styles',
		plugins_url( 'build/index.css', __FILE__ ),
		array(),
		$asset_file['version']
	);
}
add_action( 'init', 'blablablocks_formats_init' );


/**
 * Enqueue scripts required for frontend as well as editor.
 */
function blablablocks_highlighted_format_enqueue_assets() {
	wp_enqueue_script( 'blablablocks-highlighted-format-script' );

	if( is_admin() ) {
		// Enqueue the style only for the editor.
		wp_enqueue_style( 'blablablocks-highlighted-format-editor-styles' );
	}
}
add_action( 'enqueue_block_assets', 'blablablocks_highlighted_format_enqueue_assets' );
