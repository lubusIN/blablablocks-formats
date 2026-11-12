/**
 * External dependencies
 */
import tinycolor from 'tinycolor2';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { brush } from '@wordpress/icons';
import { useState } from '@wordpress/element';
import { Panel, Popover } from '@wordpress/components';
import {
	slice,
	useAnchor,
	applyFormat,
	removeFormat,
	getTextContent,
	registerFormatType,
} from '@wordpress/rich-text';
import { ColorPalette, RichTextToolbarButton } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import './editor.scss';
import './style.scss';

const name = 'blablablocks/color-token';
const title = __( 'Color Token', 'blablablocks-formats' );

function InlineUI( {
	value,
	onChange,
	onClose,
	activeAttributes,
	contentRef,
	isActive,
} ) {
	const { color } = activeAttributes;

	const anchor = useAnchor( {
		editableContentElement: contentRef,
		settings: { isActive },
	} );

	function onSetColor( newColor ) {
		const colorObj = tinycolor( newColor );

		const parsedColor = colorObj.toString();
		const border = colorObj.darken( 20 ).toString();

		if ( newColor ) {
			onChange(
				applyFormat( value, {
					type: name,
					attributes: {
						style: `--lubus-color: ${ parsedColor }; --lubus-border-color: ${ border }`,
						color: parsedColor,
						border,
						theme: 'minimal',
					},
				} )
			);
		} else {
			onChange( removeFormat( value, name ) );
			onClose(); // Close the InlineUI
		}
	}

	return (
		<Popover
			anchor={ anchor }
			className="block-editor-format-toolbar__lubus-color-popover"
			onClose={ onClose }
			placement="bottom"
			shift
		>
			<Panel className="block-editor-format-toolbar__lubus-color-picker">
				<ColorPalette value={ color } onChange={ onSetColor } />
			</Panel>
		</Popover>
	);
}

/**
 *  Format edit
 */
function EditColor( props ) {
	const { value, onChange, onFocus, isActive, activeAttributes, contentRef } =
		props;

	const [ isSettingOpen, setIsSettingOpen ] = useState( false );

	function openSettings() {
		setIsSettingOpen( true );
	}

	function closeSettings() {
		setIsSettingOpen( false );
	}

	function onToggle() {
		const colorInput = getTextContent( slice( value ) );
		const colorObj = tinycolor( colorInput );

		if ( colorObj.isValid() ) {
			const parsedColor = colorObj.toString();
			const border = colorObj.darken( 20 ).toString();

			onChange(
				applyFormat( value, {
					type: name,
					attributes: {
						style: `--lubus-color: ${ parsedColor }; --lubus-border-color: ${ border }`,
						color: parsedColor,
						border,
						theme: 'minimal',
					},
				} )
			);
		} else {
			openSettings();
		}
	}

	function onClick() {
		onToggle();
		if ( typeof onFocus === 'function' ) {
			onFocus();
		}
	}

	return (
		<>
			<RichTextToolbarButton
				icon={ brush }
				title={ title }
				onClick={ () =>
					activeAttributes?.color ? openSettings() : onClick()
				}
				isActive={ isActive }
			/>

			{ isSettingOpen && (
				<InlineUI
					value={ value }
					onChange={ onChange }
					onClose={ closeSettings }
					activeAttributes={ activeAttributes }
					contentRef={ contentRef?.current || contentRef }
					isActive={ isActive }
				/>
			) }
		</>
	);
}

/**
 * Register Richtext Color Format.
 */
registerFormatType( name, {
	title,
	tagName: 'span',
	className: 'has-color-token-format',
	edit: EditColor,
	attributes: {
		style: 'style',
		color: 'data-color',
		border: 'data-border',
		theme: 'data-theme',
	},
} );
