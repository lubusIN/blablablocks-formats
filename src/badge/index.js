/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { Icon } from '@wordpress/icons';
import { Popover, MenuItem, MenuItemsChoice } from '@wordpress/components';
import {
	slice,
	applyFormat,
	removeFormat,
	useAnchorRef,
	getTextContent,
	getActiveFormat,
	registerFormatType,
} from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import './editor.scss';
import './style.scss';

const name = 'lubus/badge';
const title = 'Badge';
const presets = [
	'gray',
	'red',
	'yellow',
	'green',
	'blue',
	'indigo',
	'purple',
	'pink',
];

/**
 * Icon
 */
function formatIcon() {
	return (
		<Icon
			icon={
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<defs />
					<path fill="none" d="M0 0h24v24H0z" />
					<path d="M17 10.43V2H7v8.43c0 .35.18.68.49.86l4.18 2.51-.99 2.34-3.41.29 2.59 2.24L9.07 22 12 20.23 14.93 22l-.78-3.33 2.59-2.24-3.41-.29-.99-2.34 4.18-2.51c.3-.18.48-.5.48-.86zm-6 .64l-2-1.2V4h2v7.07zm4-1.2l-2 1.2V4h2v5.87z" />
				</svg>
			}
		/>
	);
}

/**
 * InlineUI
 */
function InlineUI( {
	value,
	onChange,
	onClose,
	activeAttributes,
	contentRef,
} ) {
	const anchorRef = useAnchorRef( {
		ref: contentRef,
		value,
		settings: {
			title,
		},
	} );

	const text = getTextContent( slice( value ) );

	const presetChoices = presets.map( ( preset ) => {
		const choice = {
			value: `has-badge-${ preset }`,
			label: (
				<span className={ `has-badge has-badge-${ preset }` }>
					{ text || 'badge' }
				</span>
			),
		};

		return choice;
	} );

	console.log( activeAttributes.class );

	function onSetPreset( preset ) {
		if ( 'none' === preset ) {
			onChange( removeFormat( value, name ) );
		} else {
			onChange(
				applyFormat( value, {
					type: name,
					attributes: {
						class: preset,
					},
				} )
			);
		}

		onClose(); // Close InlineUI
	}

	return (
		<Popover
			position="bottom center"
			anchorRef={ anchorRef }
			className="block-editor-format-toolbar__lubus-badge-popover"
			onClose={ onClose }
		>
			<MenuItem onClick={ () => onSetPreset( 'none' ) }>
				<span className="has-badge">none</span>
			</MenuItem>
			<MenuItemsChoice
				choices={ presetChoices }
				value={ activeAttributes.class }
				onSelect={ ( preset ) => onSetPreset( preset ) }
			/>
		</Popover>
	);
}

/**
 *  Format edit
 */
function EditButton( props ) {
	const { value, onChange, onFocus, isActive, contentRef, activeAttributes } =
		props;

	const [ isSettingOpen, setIsSettingOpen ] = useState( false );

	function openSettings() {
		setIsSettingOpen( true );
	}

	function closeSettings() {
		setIsSettingOpen( false );
	}

	return (
		<>
			<RichTextToolbarButton
				icon={ formatIcon }
				title={ title }
				onClick={ openSettings }
				isActive={ isActive }
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
	className: 'has-badge',
	edit: EditButton,
	attributes: {
		style: 'style',
	},
} );
