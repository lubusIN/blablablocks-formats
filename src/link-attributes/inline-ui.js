/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useRef, useEffect } from '@wordpress/element';
import { useAnchor } from '@wordpress/rich-text';
import {
	Popover,
	TextControl,
	Button,
	Flex,
	FlexBlock,
	FlexItem,
} from '@wordpress/components';
import { trash } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import {
	useLinkAttributes,
	isValidAttributeName,
	getAttributeNameError,
} from './hooks';

/**
 * Single attribute key-value row.
 *
 * @param {Object}   props           - Component props.
 * @param {number}   props.index     - Row index.
 * @param {Object}   props.attr      - Attribute object ({ id, key, value }).
 * @param {Function} props.onChange  - Attribute update callback.
 * @param {Function} props.onRemove  - Attribute removal callback.
 * @param {boolean}  props.isInvalid - Whether row has been flagged as invalid by hook.
 * @return {JSX.Element} Row component.
 */
export function AttributeRow( {
	index,
	attr,
	onChange,
	onRemove,
	isInvalid: isInvalidFromHook,
} ) {
	const trimmedKey = attr.key.trim();
	const nameError = trimmedKey ? getAttributeNameError( trimmedKey ) : null;
	const missingNameError =
		! trimmedKey && attr.value.trim() && isInvalidFromHook
			? __( 'Attribute name is required.', 'blablablocks-formats' )
			: null;

	const errorMessage = nameError || missingNameError;
	const isInvalid = Boolean( errorMessage || isInvalidFromHook );

	return (
		<Flex
			gap={ 2 }
			align="flex-start"
			className={ isInvalid ? 'has-invalid-attribute' : undefined }
		>
			<FlexBlock>
				<TextControl
					label={ __( 'Attribute name', 'blablablocks-formats' ) }
					hideLabelFromVision
					placeholder={ __( 'Attribute', 'blablablocks-formats' ) }
					value={ attr.key }
					onChange={ ( val ) => onChange( index, 'key', val ) }
					help={ isInvalid ? errorMessage : undefined }
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
			</FlexBlock>
			<FlexBlock>
				<TextControl
					label={ __( 'Attribute value', 'blablablocks-formats' ) }
					hideLabelFromVision
					placeholder={ __( 'Value', 'blablablocks-formats' ) }
					value={ attr.value }
					onChange={ ( val ) => onChange( index, 'value', val ) }
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
			</FlexBlock>
			<FlexItem>
				<Button
					icon={ trash }
					label={ __( 'Delete attribute', 'blablablocks-formats' ) }
					onClick={ () => onRemove( index ) }
					isDestructive
					size="compact"
				/>
			</FlexItem>
		</Flex>
	);
}

/**
 * Popover UI for managing custom link attributes.
 *
 * @param {Object}   props            - Component props.
 * @param {Object}   props.value      - RichText value.
 * @param {Function} props.onChange   - RichText onChange callback.
 * @param {Function} props.onClose    - Popover close callback.
 * @param {Object}   props.contentRef - Reference to editable content element.
 * @return {JSX.Element} Popover component.
 */
export default function InlineUI( { value, onChange, onClose, contentRef } ) {
	const liveAnchor = useAnchor( {
		editableContentElement: contentRef?.current || contentRef,
		settings: { isActive: true },
	} );
	const fallbackAnchorRef = useRef( null );

	useEffect( () => {
		if ( liveAnchor ) {
			fallbackAnchorRef.current = liveAnchor;
		}
	}, [ liveAnchor ] );

	const anchor = liveAnchor || fallbackAnchorRef.current;

	const {
		attributes,
		invalidRowIndices,
		hasCustomAttributes,
		addAttribute,
		updateAttribute,
		removeAttribute,
		applyAttributes,
		clearAllAttributes,
	} = useLinkAttributes( { value, onChange } );

	const hasLiveInvalidKey = attributes.some(
		( attr ) => attr.key.trim() && ! isValidAttributeName( attr.key.trim() )
	);

	const handleSubmit = ( event ) => {
		event.preventDefault();
		const success = applyAttributes();
		if ( success ) {
			onClose();
		}
	};

	const handleClear = () => {
		const success = clearAllAttributes();
		if ( success ) {
			onClose();
		}
	};

	return (
		<Popover
			className="block-editor-format-toolbar__blablablocks-link-attributes-popover"
			anchor={ anchor }
			onClose={ onClose }
			placement="bottom"
			shift
		>
			<form onSubmit={ handleSubmit } autoComplete="off">
				<Flex direction="column" gap={ 3 }>
					{ attributes.length === 0 ? (
						<p
							className="description"
							style={ { margin: 0, fontStyle: 'italic' } }
						>
							{ __(
								'No custom attributes.',
								'blablablocks-formats'
							) }
						</p>
					) : (
						<Flex direction="column" gap={ 2 }>
							{ attributes.map( ( attr, index ) => (
								<AttributeRow
									key={ attr.id || index }
									index={ index }
									attr={ attr }
									onChange={ updateAttribute }
									onRemove={ removeAttribute }
									isInvalid={ invalidRowIndices.includes(
										index
									) }
								/>
							) ) }
						</Flex>
					) }

					<Flex justify="space-between" align="center">
						<Button
							variant="secondary"
							size="compact"
							onClick={ addAttribute }
							aria-label={ __(
								'Add attribute',
								'blablablocks-formats'
							) }
						>
							{ __( 'Add', 'blablablocks-formats' ) }
						</Button>

						<Flex justify="flex-end" gap={ 2 } expanded={ false }>
							{ hasCustomAttributes && (
								<Button
									variant="tertiary"
									size="compact"
									isDestructive
									onClick={ handleClear }
								>
									{ __(
										'Clear all',
										'blablablocks-formats'
									) }
								</Button>
							) }
							<Button
								variant="primary"
								size="compact"
								type="submit"
								disabled={
									hasLiveInvalidKey ||
									invalidRowIndices.length > 0
								}
							>
								{ __( 'Apply', 'blablablocks-formats' ) }
							</Button>
						</Flex>
					</Flex>
				</Flex>
			</form>
		</Popover>
	);
}
