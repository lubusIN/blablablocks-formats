/**
 * External dependencies
 */
import tinycolor from 'tinycolor2';

/**
 * WordPress dependencies
 */
import { brush } from '@wordpress/icons';
import { useState } from '@wordpress/element';
import { Panel, Popover } from '@wordpress/components';
import {
	slice,
	useAnchorRef,
	applyFormat,
	removeFormat,
	getTextContent,
	registerFormatType,
} from '@wordpress/rich-text';
import {
	ColorPalette,
	RichTextToolbarButton,
	__unstableRichTextInputEvent,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import './editor.scss';
import './style.scss';

const name = 'lubus/color';
const title = 'Color';

function InlineUI( {
	value,
	onChange,
	onClose,
	activeAttributes,
	contentRef,
} ) {
	const { color } = activeAttributes;

	const anchorRef = useAnchorRef( {
		ref: contentRef,
		value,
		settings: {
			title,
			tagName: 'span',
			className: 'lubus-color-token',
		},
	} );

	function onSetColor( newColor ) {
		const colorObj = tinycolor( newColor );

		const color = colorObj.toString();
		const border = colorObj.darken( 20 ).toString();

		if ( newColor ) {
			onChange(
				applyFormat( value, {
					type: name,
					attributes: {
						style: `--lubus-color: ${ color }; --lubus-border-color: ${ border }`,
						color,
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
			position="bottom center"
			anchorRef={ anchorRef }
			className="block-editor-format-toolbar__lubus-color-popover"
			onClose={ onClose }
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
			const color = colorObj.toString();
			const border = colorObj.darken( 20 ).toString();

			onChange(
				applyFormat( value, {
					type: name,
					attributes: {
						style: `--lubus-color: ${ color }; --lubus-border-color: ${ border }`,
						color,
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
		onFocus();
	}

	return (
		<>
			<RichTextToolbarButton
				icon={ brush }
				title={ title }
				onClick={ () =>
					!! activeAttributes.color ? openSettings() : onClick()
				}
				isActive={ isActive }
			/>
			<__unstableRichTextInputEvent
				inputType="formatBold"
				onInput={ onToggle }
			/>

			{ isSettingOpen && (
				<InlineUI
					value={ value }
					onChange={ onChange }
					onClose={ closeSettings }
					activeAttributes={ activeAttributes }
					contentRef={ contentRef }
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
	className: 'lubus-color-token',
	edit: EditColor,
	attributes: {
		style: 'style',
		color: 'data-color',
		border: 'data-border',
		theme: 'data-theme',
	},
} );
