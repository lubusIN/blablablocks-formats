/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

export const FORMAT_NAME = 'blablablocks/rating';
export const FORMAT_TITLE = __( 'Rating', 'blablablocks-formats' );
export const FORMAT_CLASS_NAME = 'has-rating-format';

export const RATINGS = [
	{
		value: '1',
		class: 'has-1-star',
		text: '1/5',
		stars: '★☆☆☆☆',
		label: __( '1 star (1/5)', 'blablablocks-formats' ),
	},
	{
		value: '2',
		class: 'has-2-star',
		text: '2/5',
		stars: '★★☆☆☆',
		label: __( '2 stars (2/5)', 'blablablocks-formats' ),
	},
	{
		value: '3',
		class: 'has-3-star',
		text: '3/5',
		stars: '★★★☆☆',
		label: __( '3 stars (3/5)', 'blablablocks-formats' ),
	},
	{
		value: '4',
		class: 'has-4-star',
		text: '4/5',
		stars: '★★★★☆',
		label: __( '4 stars (4/5)', 'blablablocks-formats' ),
	},
	{
		value: '5',
		class: 'has-5-star',
		text: '5/5',
		stars: '★★★★★',
		label: __( '5 stars (5/5)', 'blablablocks-formats' ),
	},
];
