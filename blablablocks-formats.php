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
		'blablablocks-highlighted-formats-assets',
		plugins_url( 'assets/highlighted-formats/highlighted-formats.js', __FILE__ ),
		array(),
		$asset_file['version'],
		array( 'in_footer' => true )
	);

	$asset_file['dependencies'][] = 'blablablocks-highlighted-formats-assets';

	wp_register_script(
		'blablablocks-highlighted-formats',
		plugins_url( 'build/index.js', __FILE__ ),
		$asset_file['dependencies'],
		$asset_file['version'],
		array( 'in_footer' => true )
	);

	wp_register_style(
		'blablablocks-highlighted-formats-editor',
		plugins_url( 'build/index.css', __FILE__ ),
		array( 'blablablocks-highlighted-formats' ),
		$asset_file['version']
	);

	wp_register_style(
		'blablablocks-highlighted-formats',
		plugins_url( 'build/style-index.css', __FILE__ ),
		array(),
		$asset_file['version']
	);
}
add_action( 'init', 'blablablocks_formats_init' );

/**
 * Enqueue editor assets for BlaBlaBlocks Highlighted format.
 */
function blablablocks_highlighted_formats_enqueue_assets_editor() {
	wp_enqueue_script( 'blablablocks-highlighted-formats' );
	wp_enqueue_style( 'blablablocks-highlighted-formats-editor' );
}
add_action( 'enqueue_block_editor_assets', 'blablablocks_highlighted_formats_enqueue_assets_editor' );

/**
 * Frontend assets.
 */
function blablablocks_highlighted_formats_enqueue_assets() {
	wp_enqueue_script( 'blablablocks-highlighted-formats-assets' );
	wp_enqueue_style( 'blablablocks-highlighted-formats' );
}
add_action( 'wp_enqueue_scripts', 'blablablocks_highlighted_formats_enqueue_assets' );
