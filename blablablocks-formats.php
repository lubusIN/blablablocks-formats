<?php
/**
 * Plugin Name:       Blablablocks Formats
 * Description:       Example block scaffolded with Create Block tool.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       blablablocks-formats
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Register custom richtext format
 */
function lubus_highlighted_format_init() {
	// automatically load dependencies and version
    $asset_file = include( plugin_dir_path( __FILE__ ) . 'build/index.asset.php');

	wp_register_script(
        'lubus-highlighted-tattva',
        plugins_url( 'assets/highlighted-format/tattva-highlighted.js', __FILE__ ),
		[],
        $asset_file['version']
    );

	$asset_file['dependencies'][] = "lubus-highlighted-tattva";

	wp_register_script(
        'lubus-highlighted-format',
        plugins_url( 'build/index.js', __FILE__ ),
		$asset_file['dependencies'],
        $asset_file['version']
    );

	wp_register_style(
		'lubus-highlighted-format-editor',
		plugins_url( 'build/index.css', __FILE__ ),
		['lubus-highlighted-format'],
		$asset_file['version']
	);

	wp_register_style(
		'lubus-highlighted-format',
		plugins_url( 'build/style-index.css', __FILE__ ),
		[],
		$asset_file['version']
	);

}
add_action( 'init', 'lubus_highlighted_format_init' );

// Editor assets
function lubus_highlighted_format_enqueue_assets_editor() {
	wp_enqueue_script('lubus-highlighted-format');
	wp_enqueue_style( 'lubus-highlighted-format-editor' );
}
add_action( 'enqueue_block_editor_assets', 'lubus_highlighted_format_enqueue_assets_editor' );

// Frontend assets
function lubus_highlighted_format_enqueue_assets() {
	wp_enqueue_script('lubus-highlighted-tattva');
	wp_enqueue_style( 'lubus-highlighted-format' );
}
add_action('wp_enqueue_scripts', 'lubus_highlighted_format_enqueue_assets');