/**
 * WordPress dependencies
 */
import { info } from '@wordpress/icons';
import { toggleFormat } from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './editor.scss';
import './style.scss';
import { InlineUI } from './inline-ui';

const name = 'blablablocks/infotip';
const title = __( 'Infotip', 'blablablocks-formats' );

/**
 *  Format edit
 *
 * @param {Object} props - The component properties.
 * @return {JSX.Element} - The rendered infotip button.
 */
function EditButton( props ) {
	const { value, onChange, onFocus, isActive, contentRef } = props;

	const [ isSettingOpen, setIsSettingOpen ] = useState( false );

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
		<>
			<RichTextToolbarButton
				icon={ info }
				title={ title }
				onClick={ () => setIsSettingOpen( true ) }
				isActive={ isActive }
			/>
			{ isSettingOpen && (
				<InlineUI
					onClose={ () => setIsSettingOpen( false ) }
					contentRef={ contentRef.current }
					isActive={ isActive }
					value={ value }
					name={ name }
					onChange={ onChange }
				/>
			) }
		</>
	);
}

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
