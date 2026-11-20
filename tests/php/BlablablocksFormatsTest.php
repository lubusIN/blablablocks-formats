<?php

declare(strict_types=1);

namespace Blablablocks\Tests;

use PHPUnit\Framework\TestCase;
use Brain\Monkey;
use Brain\Monkey\Functions;

class BlablablocksFormatsTest extends TestCase
{
	protected function setUp(): void
	{
		parent::setUp();
		Monkey\setUp();
	}

	protected function tearDown(): void
	{
		Monkey\tearDown();
		parent::tearDown();
	}

	public function test_blablablocks_has_format_with_empty_inputs(): void
	{
		$this->assertFalse(blablablocks_has_format('', '<p>content</p>'));
		$this->assertFalse(blablablocks_has_format('   ', '<p>content</p>'));
		$this->assertFalse(blablablocks_has_format('has-marker-format', ''));
		$this->assertFalse(blablablocks_has_format('has-marker-format', '   '));
	}

	public function test_blablablocks_has_format_matches_direct_class(): void
	{
		$html = '<p class="has-marker-format">Highlighted text</p>';
		$this->assertTrue(blablablocks_has_format('has-marker-format', $html));
	}

	public function test_blablablocks_has_format_matches_among_multiple_classes(): void
	{
		$html = '<span class="entry-title has-marker-format text-bold">Text</span>';
		$this->assertTrue(blablablocks_has_format('has-marker-format', $html));
	}

	public function test_blablablocks_has_format_does_not_partial_match(): void
	{
		$html = '<span class="has-marker-format-extended">Text</span>';
		$this->assertFalse(blablablocks_has_format('has-marker-format', $html));
	}

	public function test_blablablocks_has_format_handles_single_quotes(): void
	{
		$html = "<span class='has-color-token-format'>Color</span>";
		$this->assertTrue(blablablocks_has_format('has-color-token-format', $html));
	}

	public function test_blablablocks_has_format_with_null_post_queries_get_post(): void
	{
		$mock_post = new \stdClass();
		$mock_post->ID = 42;
		$mock_post->post_content = '<p class="has-typography-format">Styled</p>';

		Functions\expect('get_post')
			->once()
			->andReturn(new \WP_Post($mock_post));

		$this->assertTrue(blablablocks_has_format('has-typography-format'));
	}

	public function test_blablablocks_has_format_with_null_post_returns_false_when_get_post_empty(): void
	{
		Functions\expect('get_post')
			->once()
			->andReturn(null);

		$this->assertFalse(blablablocks_has_format('has-typography-format'));
	}

	public function test_blablablocks_has_format_inspects_synced_patterns(): void
	{
		$main_post_content = '<!-- wp:block {"ref":99} /-->';

		$reusable_post = new \stdClass();
		$reusable_post->ID = 99;
		$reusable_post->post_content = '<p class="has-number-counter-format">123</p>';

		Functions\expect('parse_blocks')
			->once()
			->with($main_post_content)
			->andReturn([
				[
					'blockName'   => 'core/block',
					'attrs'       => ['ref' => 99],
					'innerBlocks' => [],
				],
			]);

		Functions\expect('get_post')
			->with(99)
			->andReturn(new \WP_Post($reusable_post));

		$this->assertTrue(blablablocks_has_format('has-number-counter-format', $main_post_content));
	}

	public function test_blablablocks_has_format_prevents_infinite_recursion(): void
	{
		$recursive_content = '<!-- wp:block {"ref":101} /-->';

		$reusable_post = new \stdClass();
		$reusable_post->ID = 101;
		$reusable_post->post_content = '<!-- wp:block {"ref":101} /-->';

		Functions\expect('parse_blocks')
			->andReturn([
				[
					'blockName'   => 'core/block',
					'attrs'       => ['ref' => 101],
					'innerBlocks' => [],
				],
			]);

		Functions\expect('get_post')
			->with(101)
			->andReturn(new \WP_Post($reusable_post));

		$seen_posts = [];
		$result = blablablocks_has_format('has-marker-format', $recursive_content, $seen_posts);
		$this->assertFalse($result);
		$this->assertContains(101, $seen_posts);
	}

	public function test_blablablocks_formats_allowed_html_ignores_non_post_context(): void
	{
		$allowed = ['a' => ['href' => true]];
		$result = blablablocks_formats_allowed_html($allowed, 'user_description');
		$this->assertSame($allowed, $result);
	}

	public function test_blablablocks_formats_allowed_html_adds_tatva_custom_elements(): void
	{
		$allowed = ['p' => []];
		$result = blablablocks_formats_allowed_html($allowed, 'post');

		$this->assertArrayHasKey('tatva-counter', $result);
		$this->assertArrayHasKey('tatva-marker', $result);
		$this->assertArrayHasKey('tatva-infotip', $result);

		$this->assertTrue($result['tatva-counter']['animation']);
		$this->assertTrue($result['tatva-counter']['target']);
		$this->assertTrue($result['tatva-marker']['type']);
		$this->assertTrue($result['tatva-infotip']['placement']);
	}

	public function test_blablablocks_has_format_matches_badge_format(): void
	{
		$html = '<p>Text with <span class="has-badge is-style-solid">New</span> badge</p>';
		$this->assertTrue(blablablocks_has_format('has-badge', $html));
	}

	public function test_blablablocks_has_format_matches_badge_in_synced_patterns(): void
	{
		$main_post_content = '<!-- wp:block {"ref":88} /-->';

		$reusable_post = new \stdClass();
		$reusable_post->ID = 88;
		$reusable_post->post_content = '<p class="has-badge">Sale</p>';

		Functions\expect('parse_blocks')
			->once()
			->with($main_post_content)
			->andReturn([
				[
					'blockName'   => 'core/block',
					'attrs'       => ['ref' => 88],
					'innerBlocks' => [],
				],
			]);

		Functions\expect('get_post')
			->with(88)
			->andReturn(new \WP_Post($reusable_post));

		$this->assertTrue(blablablocks_has_format('has-badge', $main_post_content));
	}

	public function test_blablablocks_formats_enqueue_assets_enqueues_style_for_badge(): void
	{
		Functions\expect('is_admin')
			->once()
			->andReturn(false);

		Functions\when('parse_blocks')->justReturn([]);

		$mock_post = new \stdClass();
		$mock_post->ID = 50;
		$mock_post->post_content = '<p><span class="has-badge">Hot</span></p>';

		Functions\expect('get_post')
			->atLeast()
			->once()
			->andReturn(new \WP_Post($mock_post));

		Functions\expect('wp_enqueue_style')
			->once()
			->with('blablablocks-formats-styles');

		blablablocks_formats_enqueue_assets();
		$this->assertTrue(true);
	}
}
