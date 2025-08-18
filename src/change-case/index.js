/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { Icon } from '@wordpress/icons';
import { Popover, MenuItem } from '@wordpress/components';
import {
	create,
	insert,
	isCollapsed,
	useAnchorRef,
	toggleFormat,
	slice,
	getTextContent,
	registerFormatType,
} from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import './editor.scss';

const name = 'lubus/change-case';
const title = 'Change Case';

/**
 * Icon
 */
function formatIcon() {
	return (
		<Icon
			icon={
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<defs />
					<path fill="none" d="M0 0h24v24H0V0z" />
					<path d="M9 4v3h5v12h3V7h5V4H9zm-6 8h3v7h3v-7h3V9H3v3z" />
				</svg>
			}
		/>
	);
}

/**
 *  Format edit
 */
function EditButton( props ) {
	const { value, onChange, onFocus, isActive, contentRef } = props;

	const [ isChangingCase, setIsChangingCase ] = useState( false );

	const anchorRef = useAnchorRef( {
		ref: contentRef,
		value,
		settings: {
			title,
		},
	} );

	function toTitleCase( str ) {
		const text = str
			.match(
				/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
			)
			.map( ( x ) => x.charAt( 0 ).toUpperCase() + x.slice( 1 ) )
			.join( ' ' );

		return text;
	}

	function onToggle( type ) {
		let text = getTextContent( slice( value ) );

		switch ( type ) {
			case 'upper':
				text = text.toUpperCase();
				break;

			case 'lower':
				text = text.toLowerCase();
				break;

			case 'title':
				text = toTitleCase( text );
				break;
		}

		const toInsert = toggleFormat(
			create( { text } ),
			{
				type: name,
			},
			0,
			text.length
		);

		onChange( insert( value, toInsert ) );
	}

	function onClick( type ) {
		if ( isCollapsed( value ) ) {
			return;
		}

		onToggle( type );
		onFocus();
		setIsChangingCase( false );
	}

	function openOptions() {
		setIsChangingCase( true );
	}

	function closeOptions() {
		setIsChangingCase( false );
	}

	return (
		<>
			<RichTextToolbarButton
				icon={ formatIcon }
				title={ title }
				onClick={ openOptions }
				isActive={ isActive }
			/>
			{ isChangingCase && (
				<Popover
					position="bottom center"
					anchorRef={ anchorRef }
					onClose={ closeOptions }
					className="block-editor-format-toolbar__lubus-changecase-popover"
				>
					<MenuItem onClick={ () => onClick( 'upper' ) }>
						UPPER CASE
					</MenuItem>
					<MenuItem onClick={ () => onClick( 'lower' ) }>
						lower case
					</MenuItem>
					<MenuItem onClick={ () => onClick( 'title' ) }>
						Title Case
					</MenuItem>
				</Popover>
			) }
		</>
	);
}

/**
 * Register Richtext Color Format.
 */
registerFormatType( name, {
	title,
	tagName: 'ChangeText',
	className: null,
	edit: EditButton,
} );
