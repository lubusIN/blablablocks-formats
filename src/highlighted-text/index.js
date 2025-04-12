/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { Icon } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { Popover, MenuItem, MenuItemsChoice } from '@wordpress/components';
import {
	slice,
	applyFormat,
	removeFormat,
	useAnchorRef,
	getTextContent,
} from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import './editor.scss';
import './style.scss';

/**
 * Format constants
 */
const name = 'lubus/highlighted';
const title = __( 'Highlighted', 'blablablocks-formats' );
const presets = [
	'circle',
	'curly',
	'underline',
	'double',
	'double-underline',
	'underline-zigzag',
	'strikethrough',
	'cross',
	'strike',
];

/**
 * Icon
 */
function formatIcon() {
	return (
		<Icon
			icon={
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<path fill="none" d="M0 0h24v24H0z" />
					<path d="M6 14l3 3v5h6v-5l3-3V9H6v5zm2-3h8v2.17l-3 3V20h-2v-3.83l-3-3V11zm3-9h2v3h-2zM3.502 5.874L4.916 4.46l2.122 2.12-1.414 1.415zm13.458.708l2.123-2.12 1.413 1.416-2.123 2.12z" />
				</svg>
			}
		/>
	);
}
/**
 * InlineUI component for handling highlighted text formatting options.
 *
 * @param {Object}   root0                  - The component properties.
 * @param {Object}   root0.value            - The current rich text value.
 * @param {Function} root0.onChange         - Callback to update the rich text value.
 * @param {Function} root0.onClose          - Callback to close the UI.
 * @param {Object}   root0.activeAttributes - The currently active format attributes.
 * @param {Object}   root0.contentRef       - Reference to the content element.
 * @return {JSX.Element} The rendered component.
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
			value: preset,
			label: (
				<tattva-highlighted type={ preset }>
					{ text || preset }
				</tattva-highlighted>
			),
		};

		return choice;
	} );

	function onSetPreset( preset ) {
		if ( 'none' === preset ) {
			onChange( removeFormat( value, name ) );
		} else {
			onChange(
				applyFormat( value, {
					type: name,
					attributes: {
						type: preset,
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
			className="block-editor-format-toolbar__lubus-highlighted-popover"
			onClose={ onClose }
		>
			<MenuItem onClick={ () => onSetPreset( 'none' ) }>
				<span className="has-highlighted-text">none</span>
			</MenuItem>
			<MenuItemsChoice
				choices={ presetChoices }
				value={ activeAttributes.type }
				onSelect={ ( preset ) => onSetPreset( preset ) }
			/>
		</Popover>
	);
}
/**
 * Button for editing the highlighted text format.
 *
 * @param {Object} props - The component properties.
 * @return {JSX.Element} The rendered component.
 */
function EditButton( props ) {
	const { value, onChange, isActive, contentRef, activeAttributes } = props;

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

export const highlightedText = {
	name,
	title,
	tagName: 'tattva-highlighted',
	className: 'has-highlighted-text',
	edit: EditButton,
	attributes: {
		type: 'type',
	},
};
