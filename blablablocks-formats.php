<?php

/**
 * Plugin Name:       BlaBlaBlocks Formats
 * Description:       Rich text formats from BlaBlaBlocks.
 * Version:           1.0.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            Lubus
 * License:           MIT
 * License URI:       https://www.gnu.org/licenses/MIT
 * Text Domain:       blablablocks-formats
 *
 * @package Lubusin\BlaBlaBlocksFormats
 */

if (! defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

/**
 * Register BlaBlaBlocks formats scripts and styles.
 */
function blablablocks_register_assets()
{
	$file          = plugin_dir_path(__FILE__) . 'build/index.asset.php';
	$asset        = file_exists($file) ? include $file : ['dependencies' => [], 'version' => '1.0.0'];
	$version      = $asset['version'];
	$build_deps   = $asset['dependencies'];

	// Register Marker format web component script
	wp_register_script(
		'blablablocks-marker-format-asset',
		plugins_url('assets/web-components/marker.js', __FILE__),
		[],
		$version,
		true
	);

	// Register infotip format web component script
	wp_register_script(
		'blablablocks-infotip-format-asset',
		plugins_url('assets/web-components/infotip.js', __FILE__),
		['blablablocks-floating-ui-dom-asset'],
		$version,
		true
	);

	// Register Floating UI DOM script
	wp_register_script(
		'blablablocks-floating-ui-dom-asset',
		'https://cdn.jsdelivr.net/npm/@floating-ui/dom@1.7.0',
		[],
		'1.7.0',
		true
	);

	// Register main formats script.
	wp_register_script(
		'blablablocks-formats',
		plugins_url('build/index.js', __FILE__),
		array_merge(
			$build_deps,
			[
				'blablablocks-marker-format-asset',
				'blablablocks-infotip-format-asset',
				'blablablocks-floating-ui-dom-asset',
			]
		),
		$version,
		true
	);

	// Register styles.
	wp_register_style(
		'blablablocks-formats-editor',
		plugins_url('build/index.css', __FILE__),
		[],
		$version
	);
	wp_register_style(
		'blablablocks-formats-editor-styles',
		plugins_url('build/style-index.css', __FILE__),
		[],
		$version
	);
}
add_action('init', 'blablablocks_register_assets');

/**
 * Enqueue scripts and styles for BlaBlaBlocks formats.
 */
function blablablocks_formats_enqueue_assets()
{
	// Enqueue main script and frontend styles.
	wp_enqueue_script('blablablocks-formats');
	wp_enqueue_style('blablablocks-formats-editor-styles');

	// Enqueue editor styles in admin.
	if (is_admin()) {
		wp_enqueue_style('blablablocks-formats-editor');
	}
}
add_action('enqueue_block_assets', 'blablablocks_formats_enqueue_assets');
