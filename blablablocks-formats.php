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

require_once plugin_dir_path( __FILE__ ) . 'includes/highlighted-format-init.php';
require_once plugin_dir_path( __FILE__ ) . 'includes/infotip-init.php';

/**
 * Register BlaBlaBlocks_formats
 */
function blablablocks_formats_init() {
	blablablocks_highlighted_format_init();
	blablablocks_infotip_format_init();
}
add_action( 'init', 'blablablocks_formats_init' );

/**
 * Enqueue scripts and styles for BlaBlaBlocks formats.
 *
 * We use enqueue_block_assets, available since WP 6.3, to load scripts easily within the iFramed editor too.
 *
 * @see https://developer.wordpress.org/block-editor/how-to-guides/enqueueing-assets-in-the-editor/#editor-content-scripts-and-styles
 */
function blablablocks_formats_enqueue_assets() {
	blablablocks_highlighted_format_enqueue_assets();
	blablablocks_infotip_format_enqueue_assets();
}
add_action( 'enqueue_block_assets', 'blablablocks_formats_enqueue_assets' );
