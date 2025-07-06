/**
 * WordPress dependencies
 */
import { info } from '@wordpress/icons';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';
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
	const { value, onChange, onFocus, isActive, contentRef, activeAttributes } =
		props;

	const [ isSettingOpen, setIsSettingOpen ] = useState( false );

	useEffect( () => {
		if ( ! isActive ) {
			setIsSettingOpen( false );
		}
	}, [ isActive ] );

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
					activeAttributes={ activeAttributes }
					onClose={ () => setIsSettingOpen( false ) }
					contentRef={ contentRef.current }
					isActive={ isActive }
					value={ value }
					name={ name }
					onChange={ onChange }
					onFocus={ onFocus }
				/>
			) }
		</>
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
		underline: 'underline',
		'icon-enabled': 'icon-enabled',
		'icon-position': 'icon-position',
		'icon-color': 'icon-color',
		'icon-type': 'icon-type',
		offset: 'offset',
		'overlay-placement': 'overlay-placement',
		'overlay-text-color': 'overlay-text-color',
		'overlay-background-color': 'overlay-background-color',
	},
};
