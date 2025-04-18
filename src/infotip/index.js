/**
 * WordPress dependencies
 */
import { Icon, info } from '@wordpress/icons';
import {
	toggleFormat,
	getTextContent,
	registerFormatType,
} from '@wordpress/rich-text';
import {
	RichTextToolbarButton,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './editor.scss';
import './style.scss';

const name = 'lubus/infotip';
const title = __( 'Infotip', 'blablablocks-formats' );

/**
 *  Format edit
 */
function EditButton(props) {
	const {
		value,
		onChange,
		onFocus,
		isActive,
		activeAttributes,
	} = props;

	function onToggle() {
		onChange(
			toggleFormat(value, {
				type: name,
				attributes:{
					content: 'Welcome to <strong>Gutenberg</strong>!',
					allowHtml: 'true',
				}
			})
		);
	}

	function onClick() {
		onToggle();
		onFocus();
	}

	return (
		<RichTextToolbarButton
			icon={info}
			title={title}
			onClick={() => onClick()}
			isActive={isActive}
		/>
	);
};

export const infotip = {
	name,
	title,
	tagName: 'span',
	className: 'has-infotip',
	edit: EditButton,
	attributes: {
		content: 'data-tippy-content',
		allowHtml: 'data-tippy-allowHTML',
	},
};
