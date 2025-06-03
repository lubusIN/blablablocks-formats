/**
 * WordPress dependencies
 */
import { info } from '@wordpress/icons';
import { toggleFormat } from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './editor.scss';
import './style.scss';

const name = 'blablablocks/infotip';
const title = __( 'Infotip', 'blablablocks-formats' );

/**
 *  Format edit
 *
 * @param {Object} props - The component properties.
 * @return {JSX.Element} - The rendered infotip button.
 */
function EditButton( props ) {
	const { value, onChange, onFocus, isActive } = props;

	function onToggle() {
		onChange(
			toggleFormat( value, {
				type: name,
				attributes: {
					content: 'Welcome to Gutenberg!',
				},
			} )
		);
	}

	function onClick() {
		onToggle();
		onFocus();
	}

	return (
		<RichTextToolbarButton
			icon={ info }
			title={ title }
			onClick={ () => onClick() }
			isActive={ isActive }
		/>
	);
}

export const infotip = {
	name,
	title,
	tagName: 'blablablocks-infotip',
	className: 'has-infotip',
	edit: EditButton,
	attributes: {
		content: 'content',
	},
};
