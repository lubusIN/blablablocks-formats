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

require_once plugin_dir_path( __FILE__ ) . 'includes/highlighted-format-init.php';

/**
 * Register BlaBlaBlocks_formats
 */
function blablablocks_formats_init() {
	blablablocks_highlighted_format_init();

	// Enqueue scripts required within iFrame for frontend as well as editor.
	blablablocks_highlighted_format_enqueue_assets();
}

add_action( 'init', 'blablablocks_formats_init' );
add_action( 'enqueue_block_assets', 'blablablocks_highlighted_format_enqueue_assets' );
