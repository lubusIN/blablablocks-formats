<?php

/**
 * Plugin Name:			BlaBlaBlocks Formats
 * Description:			Rich text formats from BlaBlaBlocks.
 * Version:				1.1.1
 * Requires at least:	6.6
 * Requires PHP:		7.4
 * Author:				Lubus
 * Author URI:			https://lubus.in
 * License:				MIT
 * License URI:			https://www.gnu.org/licenses/MIT
 * Text Domain:			blablablocks-formats
 *
 * @package.			BlaBlaBlocks Formats
 */

if (! defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

/**
 * Register BlaBlaBlocks formats scripts and styles.
 */
function blablablocks_formats_register_assets()
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

	// Register Floating UI script
	wp_register_script(
		'blablablocks-floating-ui-core-asset',
		plugins_url('assets/vendor/floating-ui/core.umd.min.js', __FILE__),
		[],
		filemtime(plugin_dir_path(__FILE__) . 'assets/vendor/floating-ui/core.umd.min.js'),
		true
	);

	// Register Floating UI DOM script
	wp_register_script(
		'blablablocks-floating-ui-dom-asset',
		plugins_url('assets/vendor/floating-ui/dom.umd.min.js', __FILE__),
		['blablablocks-floating-ui-core-asset'],
		filemtime(plugin_dir_path(__FILE__) . 'assets/vendor/floating-ui/dom.umd.min.js'),
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

	// Register main formats script.
	wp_register_script(
		'blablablocks-formats',
		plugins_url('build/index.js', __FILE__),
		$build_deps,
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
		'blablablocks-formats-styles',
		plugins_url('build/style-index.css', __FILE__),
		[],
		$version
	);
}
add_action('init', 'blablablocks_formats_register_assets');

/**
 * check if post has the given format
 *
 * @param string $format_class
 * @param string $post
 * @return boolean
 */
function blablablocks_has_format($format_class, $post = null)
{
	if (!$post) {
		$wp_post = get_post();
		if ($wp_post instanceof WP_Post) {
			$post = $wp_post->post_content;
		}
	}

	if (trim($format_class) === '' || trim($post) === '') {
		return false;
	}

	// Regex looks for the class inside any class attribute
	$pattern = '/class\s*=\s*(["\'])(.*?)\1/i';

	if (preg_match_all($pattern, $post, $matches)) {
		foreach ($matches[2] as $classAttr) {
			$classes = preg_split('/\s+/', $classAttr);
			if (in_array($format_class, $classes, true)) {
				return true;
			}
		}
	}

	return false;
}

/**
 * Enqueue scripts and styles for BlaBlaBlocks formats.
 */
function blablablocks_formats_enqueue_assets()
{
	if (is_admin()) {
		wp_enqueue_script('blablablocks-marker-format-asset');
		wp_enqueue_script('blablablocks-infotip-format-asset');
		wp_enqueue_script('blablablocks-formats');
		wp_enqueue_style('blablablocks-formats-editor');
		wp_enqueue_style('blablablocks-formats-styles');
	}

	$needs_marker  = blablablocks_has_format('has-marker-format');
	$needs_infotip = blablablocks_has_format('has-infotip-format');

	// If neither format is present, do nothing.
	if (! $needs_marker && ! $needs_infotip) {
		return;
	}

	// Base stylesheet for frontend.
	wp_enqueue_style('blablablocks-formats-styles');

	if ($needs_marker) {
		wp_enqueue_script('blablablocks-marker-format-asset');
	}

	if ($needs_infotip) {
		wp_enqueue_script('blablablocks-infotip-format-asset');
	}
}
add_action('enqueue_block_assets', 'blablablocks_formats_enqueue_assets');
