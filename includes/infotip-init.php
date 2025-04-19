<?php
/**
 * BlaBlaBlocks infotip format init.
 *
 * @package Lubusin\BlaBlaBlocksFormats
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Register infotip format scripts and styles.
 */
function blablablocks_infotip_format_init() {
	$asset_file = include plugin_dir_path( __FILE__ ) . '../build/index.asset.php';

	if ( ! is_admin() ) {
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
	}

	wp_register_script(
		'blablablocks-infotip-format-js',
		plugins_url( '../build/index.js', __FILE__ ),
		$asset_file['dependencies'],
		$asset_file['version'],
		array( 'in_footer' => true )
	);

	wp_register_style(
		'blablablocks-infotip-format-editor',
		plugins_url( '../build/index.css', __FILE__ ),
		array( 'blablablocks-infotip-format-js' ),
		$asset_file['version']
	);

	wp_register_style(
		'blablablocks-infotip-format',
		plugins_url( '../build/style-index.css', __FILE__ ),
		array(),
		$asset_file['version']
	);
}

/**
 * Enqueue scripts required for frontend as well as editor.
 */
function blablablocks_infotip_format_enqueue_assets() {
	wp_enqueue_script( 'blablablocks-infotip-tippy' );
	wp_enqueue_style( 'blablablocks-infotip-format' );
	if ( is_admin() ) {
		// Enqueue the style only for the editor.
		wp_enqueue_script( 'blablablocks-infotip-format-js' );
		wp_enqueue_style( 'blablablocks-infotip-format-editor' );
	}
}
