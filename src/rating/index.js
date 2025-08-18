/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { starEmpty } from '@wordpress/icons';
import { Popover, MenuItem, MenuItemsChoice } from '@wordpress/components';
import {
	applyFormat,
	removeFormat,
	useAnchorRef,
	registerFormatType,
} from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import './editor.scss';
import './style.scss';

const name = 'lubus/rating';
const title = 'Rating';
const ratings = [
	{
		class: 'has-1-star',
		text: '1/5',
	},
	{
		class: 'has-2-star',
		text: '2/5',
	},
	{
		class: 'has-3-star',
		text: '3/5',
	},
	{
		class: 'has-4-star',
		text: '4/5',
	},
	{
		class: 'has-5-star',
		text: '5/5',
	},
];

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

	const ratingChoices = ratings.map( ( rating ) => {
		const choice = {
			value: rating.class,
			label: (
				<span className={ `has-rating ${ rating.class }` }>
					{ rating.text }
				</span>
			),
		};

		return choice;
	} );

	function onSetRating( rating ) {
		if ( 'none' === rating ) {
			onChange( removeFormat( value, name ) );
		} else {
			onChange(
				applyFormat( value, {
					type: name,
					attributes: {
						class: rating,
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
			<MenuItem onClick={ () => onSetRating( 'none' ) }>
				<span className="has-rating">none</span>
			</MenuItem>
			<MenuItemsChoice
				choices={ ratingChoices }
				value={ activeAttributes.class }
				onSelect={ ( rating ) => onSetRating( rating ) }
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
				icon={ starEmpty }
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
	className: 'has-rating',
	edit: EditButton,
} );
