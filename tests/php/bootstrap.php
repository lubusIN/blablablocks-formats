<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/vendor/autoload.php';

if (! defined('ABSPATH')) {
	define('ABSPATH', sys_get_temp_dir() . '/wordpress/');
}

if (! function_exists('add_action')) {
	function add_action($tag, $callback, $priority = 10, $accepted_args = 1) {}
}

if (! function_exists('add_filter')) {
	function add_filter($tag, $callback, $priority = 10, $accepted_args = 1) {}
}

if (! class_exists('WP_Post')) {
	class WP_Post
	{
		/** @var int */
		public $ID = 0;

		/** @var string */
		public $post_content = '';

		/**
		 * @param object|null $post
		 */
		public function __construct($post = null)
		{
			if (is_object($post)) {
				foreach (get_object_vars($post) as $key => $val) {
					$this->$key = $val;
				}
			}
		}
	}
}

require_once dirname(__DIR__, 2) . '/blablablocks-formats.php';
