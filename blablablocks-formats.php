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
 * @package Lubusin\BlaBlaBlocksFormats
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Register BlaBlaBlocks formats scripts and styles.
 */
function blablablocks_formats_init() {
	$asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

	// Register marker format custom element script.
	wp_register_script(
		'blablablocks-marker-format-asset',
		plugins_url( 'assets/marker/marker-web-component.js', __FILE__ ),
		array(),
		$asset_file['version'],
		array( 'in_footer' => true )
	);

	// Register infotip dependencies.
	wp_register_script(
		'blablablocks-infotip-popperjs',
		'https://unpkg.com/@popperjs/core@2',
		array(),
		'2',
		array( 'in_footer' => true )
	);

	wp_register_script(
		'blablablocks-infotip-tippy',
		'https://unpkg.com/tippy.js@6',
		array( 'blablablocks-infotip-popperjs' ),
		'6',
		array( 'in_footer' => true )
	);

	wp_add_inline_script(
		'blablablocks-infotip-tippy',
		"tippy('[data-tippy-content]');"
	);

	$asset_file['dependencies'][] = 'blablablocks-infotip-tippy';

	// Add marker format custom element as dependency.
	$asset_file['dependencies'][] = 'blablablocks-marker-format-asset';

	// Register main formats script.
	wp_register_script(
		'blablablocks-formats',
		plugins_url( 'build/index.js', __FILE__ ),
		$asset_file['dependencies'],
		$asset_file['version'],
		array( 'in_footer' => true )
	);

	// Register styles.
	wp_register_style(
		'blablablocks-formats-editor',
		plugins_url( 'build/index.css', __FILE__ ),
		array(),
		$asset_file['version']
	);

	wp_register_style(
		'blablablocks-formats-editor-styles',
		plugins_url( 'build/style-index.css', __FILE__ ),
		array(),
		$asset_file['version']
	);
}
add_action( 'init', 'blablablocks_formats_init' );

/**
 * Enqueue scripts and styles for BlaBlaBlocks formats.
 */
function blablablocks_formats_enqueue_assets() {
	// Enqueue main script and frontend styles.
	wp_enqueue_script( 'blablablocks-formats' );
	wp_enqueue_style( 'blablablocks-formats-editor-styles' );

	// Enqueue editor styles in admin.
	if ( is_admin() ) {
		wp_enqueue_style( 'blablablocks-formats-editor' );
	}
}
add_action( 'enqueue_block_assets', 'blablablocks_formats_enqueue_assets' );
