/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { Icon } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { Button, Flex, MenuItemsChoice, Popover } from '@wordpress/components';
import {
	slice,
	applyFormat,
	removeFormat,
	useAnchor,
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
const name = 'blablablocks/highlighted';
const title = __( 'Highlighted', 'blablablocks-formats' );
const presets = {
	circle: { label: __( 'Circle', 'blablablocks-formats' ) },
	curly: { label: __( 'Curly', 'blablablocks-formats' ) },
	underline: { label: __( 'Underline', 'blablablocks-formats' ) },
	double: { label: __( 'Double', 'blablablocks-formats' ) },
	'double-underline': {
		label: __( 'Double Underline', 'blablablocks-formats' ),
	},
	'underline-zigzag': {
		label: __( 'Underline Zigzag', 'blablablocks-formats' ),
	},
	strikethrough: { label: __( 'Strikethrough', 'blablablocks-formats' ) },
	cross: { label: __( 'Cross', 'blablablocks-formats' ) },
	strike: { label: __( 'Strike', 'blablablocks-formats' ) },
};

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
 * @param {Object}   props                  - The component properties.
 * @param {string}   props.value            - The current highlighted format preset name.
 * @param {Function} props.onChange         - Callback to update the highlighted format preset.
 * @param {Function} props.onClose          - Callback to close the UI.
 * @param {Object}   props.activeAttributes - The currently active format attributes.
 * @param {Object}   props.contentRef       - Reference to the content element.
 * @return {JSX.Element}                     - The rendered component.
 */
function InlineUI( {
	value,
	onChange,
	onClose,
	activeAttributes,
	contentRef,
} ) {
	const anchor = useAnchor( {
		editableContentElement: contentRef.current,
	} );

	const presetChoices = Object.entries( presets ).map(
		( [ preset, { label } ] ) => {
			return {
				value: preset,
				label: (
					<blablablocks-highlighted type={ preset }>
						{ label }
					</blablablocks-highlighted>
				),
			};
		}
	);

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
			anchor={ anchor }
			className="block-editor-format-toolbar__blablablocks-highlighted-popover"
			onClose={ onClose }
		>
			<MenuItemsChoice
				choices={ presetChoices }
				value={ activeAttributes.type }
				onSelect={ ( preset ) => onSetPreset( preset ) }
			/>
			{ activeAttributes.type && (
				// If the format is applied, show the clear button.
				<Flex justify="flex-end">
					<Button
						variant="tertiary"
						onClick={ () => onSetPreset( 'none' ) }
						className="block-editor-format-toolbar__clear-button"
					>
						Clear
					</Button>
				</Flex>
			) }
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
	tagName: 'blablablocks-highlighted',
	className: 'has-highlighted-text',
	edit: EditButton,
	attributes: {
		type: 'type',
	},
};
