<?php

/**
 * Plugin Name:			BlaBlaBlocks Formats
 * Plugin URI: 			https://lubus.in
 * Description:			Rich text formats from BlaBlaBlocks.
 * Version:				1.2.0
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

	$marker_file   = plugin_dir_path(__FILE__) . 'build/marker.asset.php';
	$marker_asset  = file_exists($marker_file) ? include $marker_file : ['dependencies' => [], 'version' => $version];

	$infotip_file  = plugin_dir_path(__FILE__) . 'build/infotip.asset.php';
	$infotip_asset = file_exists($infotip_file) ? include $infotip_file : ['dependencies' => [], 'version' => $version];

	// Register Marker format web component script
	wp_register_script(
		'blablablocks-marker-format-asset',
		plugins_url('build/marker.js', __FILE__),
		$marker_asset['dependencies'],
		$marker_asset['version'],
		true
	);

	// Register infotip format web component script
	wp_register_script(
		'blablablocks-infotip-format-asset',
		plugins_url('build/infotip.js', __FILE__),
		$infotip_asset['dependencies'],
		$infotip_asset['version'],
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
		$post_id = get_the_ID();
		if ($post_id && is_preview()) {
			$autosave = wp_get_post_autosave($post_id);
			if ($autosave instanceof WP_Post) {
				$post = $autosave->post_content;
			}
		}
		if (!$post) {
			$wp_post = get_post();
			if ($wp_post instanceof WP_Post) {
				$post = $wp_post->post_content;
			}
		}
	}

	if (empty($format_class) || empty($post) || !is_string($post)) {
		return false;
	}

	if (strpos($post, $format_class) === false) {
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
		return;
	}

	$needs_marker     = blablablocks_has_format('has-marker-format');
	$needs_infotip    = blablablocks_has_format('has-infotip-format');
	$needs_typography = blablablocks_has_format('has-typography-format');
	$needs_badge      = blablablocks_has_format('has-badge');

	// If no format is present, do nothing.
	if (! $needs_marker && ! $needs_infotip && ! $needs_typography && ! $needs_badge) {
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

/**
 * Ensure format styles and scripts are enqueued when rendered inside blocks.
 *
 * @param string $block_content
 * @param array  $block
 * @return string
 */
function blablablocks_formats_render_block($block_content, $block)
{
	if (empty($block_content) || !is_string($block_content)) {
		return $block_content;
	}

	if (strpos($block_content, 'has-badge') !== false) {
		wp_enqueue_style('blablablocks-formats-styles');
	}

	if (strpos($block_content, 'has-marker-format') !== false) {
		wp_enqueue_style('blablablocks-formats-styles');
		wp_enqueue_script('blablablocks-marker-format-asset');
	}

	if (strpos($block_content, 'has-infotip-format') !== false) {
		wp_enqueue_style('blablablocks-formats-styles');
		wp_enqueue_script('blablablocks-infotip-format-asset');
	}

	if (strpos($block_content, 'has-typography-format') !== false) {
		wp_enqueue_style('blablablocks-formats-styles');
	}

	return $block_content;
}
add_filter('render_block', 'blablablocks_formats_render_block', 10, 2);
