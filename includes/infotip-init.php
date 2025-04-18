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
	// automatically load dependencies and version.
	$asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

	if ( ! is_admin() ) {
		wp_register_script(
			'lubus-infotip-popperjs',
			'https://unpkg.com/@popperjs/core@2',
			array(),
			'2',
			array( 'in_footer' => true )
		);

		wp_register_script(
			'lubus-infotip-tippy',
			'https://unpkg.com/tippy.js@6',
			array( 'lubus-infotip-popperjs' ),
			'6',
			array( 'in_footer' => true )
		);

		wp_add_inline_script(
			'lubus-infotip-tippy',
			"tippy('[data-tippy-content]');"
		);

		$asset_file['dependencies'][] = 'lubus-infotip-tippy';
	}

	wp_register_script(
		'lubus-infotip-format-js',
		plugins_url( 'build/index.js', __FILE__ ),
		$asset_file['dependencies'],
		$asset_file['version'],
		array( 'in_footer' => true )
	);

	wp_register_style(
		'lubus-infotip-format-editor',
		plugins_url( 'build/index.css', __FILE__ ),
		array( 'lubus-infotip-format-js' ),
		$asset_file['version']
	);

	wp_register_style(
		'lubus-infotip-format',
		plugins_url( 'build/style-index.css', __FILE__ ),
		array(),
		$asset_file['version']
	);
}

/**
 * Enqueue scripts required for frontend as well as editor.
 */
function blablablocks_infotip_format_enqueue_assets() {
	wp_enqueue_script( 'lubus-infotip-tippy' );
	wp_enqueue_style( 'lubus-infotip-format' );
	if ( is_admin() ) {
		// Enqueue the style only for the editor.
		wp_enqueue_script( 'lubus-infotip-format-js' );
		wp_enqueue_style( 'lubus-infotip-format-editor' );
	}
}
