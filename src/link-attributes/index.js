/**
 * WordPress dependencies
 */
import {
	registerFormatType,
	applyFormat,
	getActiveFormat,
	useAnchor,
} from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { Fragment, useState } from '@wordpress/element';
import { closeSmall, customLink } from '@wordpress/icons';
import {
	Popover,
	TextControl,
	Button,
	IconButton,
	__experimentalHStack as HStack,
} from '@wordpress/components';

const CustomLinkAttrButton = ( { value, onChange, contentRef, isActive } ) => {
	const activeLink = getActiveFormat( value, 'core/link' );

	if ( ! activeLink ) return null;

	const [ showPopover, setShowPopover ] = useState( false );
	const [ attributes, setAttributes ] = useState( () => {
		if ( ! activeLink.attributes && ! activeLink.unregisteredAttributes )
			return [ { key: '', value: '' } ];

		const excluded = [
			'href',
			'rel',
			'target',
			'class',
			'aria-label',
			'url',
			'type',
			'id',
		];
		const attrList = Object.entries( {
			...activeLink.attributes,
			...activeLink.unregisteredAttributes,
		} )
			.filter( ( [ key ] ) => ! excluded.includes( key ) )
			.map( ( [ key, value ] ) => ( { key, value } ) );

		return attrList.length ? attrList : [ { key: '', value: '' } ];
	} );

	const anchor = useAnchor( {
		editableContentElement: contentRef.current,
		settings: { isActive },
	} );

	const updateAttribute = ( index, field, newValue ) => {
		const updated = [ ...attributes ];
		updated[ index ][ field ] = newValue;
		setAttributes( updated );
	};

	const addAttribute = () => {
		setAttributes( [ ...attributes, { key: '', value: '' } ] );
	};

	const removeAttribute = ( index ) => {
		const updated = attributes.filter( ( _, i ) => i !== index );
		setAttributes( updated );
	};

	const applyAttributes = () => {
		const customAttrs = attributes.reduce( ( acc, attr ) => {
			if ( attr.key ) acc[ attr.key ] = attr.value;
			return acc;
		}, {} );

		if ( ! activeLink ) return;

		const newValue = applyFormat( value, {
			type: 'core/link',
			attributes: {
				...activeLink.attributes,
				...customAttrs,
			},
		} );

		onChange( newValue );
	};

	return (
		<Fragment>
			<RichTextToolbarButton
				icon={ customLink }
				title="Attributes"
				isActive={ activeLink && activeLink.unregisteredAttributes }
				onClick={ () => setShowPopover( ! showPopover ) }
			/>
			{ showPopover && (
				<Popover
					offset={ 80 }
					anchor={ anchor }
					position="bottom center"
					onClose={ () => setShowPopover( false ) }
				>
					<div
						style={ {
							padding: '16px',
							maxWidth: '350px',
							minWidth: 'auto',
							width: '90vw',
						} }
					>
						<p>
							<strong>Attributes</strong> <br />
							Manage custom attributes for the selected link.
						</p>
						{ attributes.map( ( attr, index ) => (
							<div
								key={ index }
								style={ {
									display: 'flex',
									gap: '4px',
									marginBottom: '8px',
								} }
							>
								<TextControl
									placeholder="Attribute"
									value={ attr.key }
									onChange={ ( val ) =>
										updateAttribute( index, 'key', val )
									}
									style={ { flex: 1 } }
								/>
								<TextControl
									placeholder="Value"
									value={ attr.value }
									onChange={ ( val ) =>
										updateAttribute( index, 'value', val )
									}
									style={ { flex: 1 } }
								/>
								<IconButton
									icon={ closeSmall }
									onClick={ () => removeAttribute( index ) }
								/>
							</div>
						) ) }
						<HStack justify="space-between">
							<Button
								variant="secondary"
								onClick={ addAttribute }
							>
								Add
							</Button>
							<Button
								variant="primary"
								onClick={ applyAttributes }
								style={ { marginTop: '10px' } }
							>
								Apply
							</Button>
						</HStack>
					</div>
				</Popover>
			) }
		</Fragment>
	);
};

/**
 * Registers the link attributes format type.
 */
registerFormatType( 'blablablocks/link-attributes', {
	title: 'Attributes',
	tagName: 'a',
	className: 'has-link-attributes',
	edit: CustomLinkAttrButton,
} );
