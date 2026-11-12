/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useRef } from '@wordpress/element';
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
import { useLinkAttributes } from './hooks';

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
	const anchorRef = useRef();
	if ( liveAnchor ) {
		anchorRef.current = liveAnchor;
	}

	const {
		attributes,
		hasCustomAttributes,
		addAttribute,
		updateAttribute,
		removeAttribute,
		applyAttributes,
		clearAllAttributes,
	} = useLinkAttributes( { value, onChange } );

	const handleSubmit = ( event ) => {
		event.preventDefault();
		applyAttributes();
		onClose();
	};

	const handleClear = () => {
		clearAllAttributes();
		onClose();
	};

	return (
		<Popover
			className="block-editor-format-toolbar__blablablocks-link-attributes-popover"
			anchor={ liveAnchor || anchorRef.current }
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
								<Flex key={ index } gap={ 2 } align="center">
									<FlexBlock>
										<TextControl
											label={ __(
												'Attribute name',
												'blablablocks-formats'
											) }
											hideLabelFromVision
											placeholder={ __(
												'Attribute',
												'blablablocks-formats'
											) }
											value={ attr.key }
											onChange={ ( val ) =>
												updateAttribute(
													index,
													'key',
													val
												)
											}
											__nextHasNoMarginBottom
										/>
									</FlexBlock>
									<FlexBlock>
										<TextControl
											label={ __(
												'Attribute value',
												'blablablocks-formats'
											) }
											hideLabelFromVision
											placeholder={ __(
												'Value',
												'blablablocks-formats'
											) }
											value={ attr.value }
											onChange={ ( val ) =>
												updateAttribute(
													index,
													'value',
													val
												)
											}
											__nextHasNoMarginBottom
										/>
									</FlexBlock>
									<FlexItem>
										<Button
											icon={ trash }
											label={ __(
												'Delete attribute',
												'blablablocks-formats'
											) }
											onClick={ () =>
												removeAttribute( index )
											}
											isDestructive
											size="compact"
										/>
									</FlexItem>
								</Flex>
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
