<?php

/**
 * Plugin Name:			BlaBlaBlocks Formats
 * Plugin URI: 			https://lubus.in
 * Description:			Rich text formats from BlaBlaBlocks.
 * Version:				1.3.0
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
 *
 * @return void
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

	$counter_file  = plugin_dir_path(__FILE__) . 'build/counter.asset.php';
	$counter_asset = file_exists($counter_file) ? include $counter_file : ['dependencies' => [], 'version' => $version];

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

	// Register counter format web component script
	wp_register_script(
		'blablablocks-counter-format-asset',
		plugins_url('build/counter.js', __FILE__),
		$counter_asset['dependencies'],
		$counter_asset['version'],
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
 * Check if post has the given format.
 *
 * @param string      $format_class Format class to search for.
 * @param string|null $post         Post content to check (or null for current post).
 * @param array<int>  $seen_posts   Track visited post IDs to prevent infinite recursion.
 * @return boolean
 */
function blablablocks_has_format($format_class, $post = null, &$seen_posts = [])
{
	if ($post === null) {
		$wp_post = get_post();
		if ($wp_post instanceof WP_Post) {
			$seen_posts[] = $wp_post->ID;
			$post = $wp_post->post_content;
		}
	}

	if (trim($format_class) === '' || !is_string($post) || trim($post) === '') {
		return false;
	}

	// Regex looks for the class inside any class attribute
	$pattern = '/class\s*=\s*(["\'])(.*?)\1/i';

	if (preg_match_all($pattern, $post, $matches)) {
		foreach ($matches[2] as $classAttr) {
			$classes = preg_split('/\s+/', $classAttr);
			if (is_array($classes) && in_array($format_class, $classes, true)) {
				return true;
			}
		}
	}

	// Check inside referenced synced patterns (reusable blocks).
	if (function_exists('parse_blocks')) {
		$blocks = parse_blocks($post);
		$queue  = $blocks;

		while (!empty($queue)) {
			$block = array_shift($queue);
			if (!is_array($block)) {
				continue;
			}

			if (!empty($block['innerBlocks']) && is_array($block['innerBlocks'])) {
				foreach ($block['innerBlocks'] as $inner_block) {
					$queue[] = $inner_block;
				}
			}

			if (
				isset($block['blockName']) &&
				('core/block' === $block['blockName'] || 'block' === $block['blockName']) &&
				!empty($block['attrs']['ref']) &&
				is_numeric($block['attrs']['ref'])
			) {
				$ref_id = (int) $block['attrs']['ref'];
				if ($ref_id > 0) {
					if (in_array($ref_id, $seen_posts, true)) {
						continue;
					}
					$seen_posts[]   = $ref_id;
					$reusable_block = get_post($ref_id);
					if ($reusable_block instanceof WP_Post && blablablocks_has_format($format_class, $reusable_block->post_content, $seen_posts)) {
						return true;
					}
				}
			}
		}
	}

	return false;
}

/**
 * Enqueue scripts and styles for BlaBlaBlocks formats.
 *
 * @return void
 */
function blablablocks_formats_enqueue_assets()
{
	if (is_admin()) {
		wp_enqueue_script('blablablocks-marker-format-asset');
		wp_enqueue_script('blablablocks-infotip-format-asset');
		wp_enqueue_script('blablablocks-counter-format-asset');
		wp_enqueue_script('blablablocks-formats');
		wp_enqueue_style('blablablocks-formats-editor');
		wp_enqueue_style('blablablocks-formats-styles');
	}

	$needs_marker        = blablablocks_has_format('has-marker-format');
	$needs_infotip       = blablablocks_has_format('has-infotip-format');
	$needs_typography    = blablablocks_has_format('has-typography-format');
	$needs_gradient_text = blablablocks_has_format('has-gradient-text-format');
	$needs_counter       = blablablocks_has_format('has-number-counter-format');
	$needs_color_token   = blablablocks_has_format('has-color-token-format');

	// If no format is present, do nothing.
	if (! $needs_marker && ! $needs_infotip && ! $needs_typography && ! $needs_gradient_text && ! $needs_counter && ! $needs_color_token) {
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

	if ($needs_counter) {
		wp_enqueue_script('blablablocks-counter-format-asset');
	}
}
add_action('enqueue_block_assets', 'blablablocks_formats_enqueue_assets');

/**
 * Allow custom elements and attributes in post content for users without unfiltered_html.
 *
 * @param array<string, array<string, bool>> $allowed_tags Allowed HTML elements.
 * @param string                             $context      Context name (e.g. 'post').
 * @return array<string, array<string, bool>> Modified allowed HTML elements.
 */
function blablablocks_formats_allowed_html($allowed_tags, $context)
{
	if ($context !== 'post') {
		return $allowed_tags;
	}

	$allowed_tags['tatva-counter'] = [
		'animation' => true,
		'duration'  => true,
		'target'    => true,
		'on-scroll' => true,
		'editable'  => true,
		'class'     => true,
		'style'     => true,
	];

	$allowed_tags['tatva-marker'] = [
		'type'               => true,
		'color'              => true,
		'animation'          => true,
		'animation-duration' => true,
		'class'              => true,
		'style'              => true,
	];

	$allowed_tags['tatva-infotip'] = [
		'content'   => true,
		'placement' => true,
		'underline' => true,
		'class'     => true,
		'style'     => true,
	];

	$allowed_tags['span'] = array_merge($allowed_tags['span'] ?? [], [
		'data-animated'           => true,
		'data-animation'          => true,
		'data-animation-duration' => true,
		'data-animation-type'     => true,
		'data-color'              => true,
		'data-border'             => true,
		'data-theme'              => true,
	]);

	return $allowed_tags;
}
add_filter('wp_kses_allowed_html', 'blablablocks_formats_allowed_html', 10, 2);
