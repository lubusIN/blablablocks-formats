/**
 * WordPress dependencies
 */
import {
	Button,
	Flex,
	Popover,
	TabPanel,
	TextareaControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { applyFormat, removeFormat, useAnchor } from '@wordpress/rich-text';
import { safeHTML } from '@wordpress/dom';

/**
 * Internal dependencies
 */

/**
 * TextTabContent Renders the content for the text tab.
 *
 * @param {Object}   props          - The properties passed to the component.
 * @param {string}   props.content  - The content of the text.
 * @param {string}   props.name     - The name of the text.
 * @param {string}   props.value    - The value of the text.
 * @param {Function} props.onChange - The function to call when the text changes.
 * @param {Function} props.onClose  - The function to call when the text is closed.
 * @return {JSX.Element} - The rendered text tab content.
 */
function TextTabContent( { content, name, value, onChange, onClose } ) {
	return (
		<>
			<TextareaControl
				label={ __( 'Text', 'blablablocks-formats' ) }
				value={ content }
				onChange={ ( newValue ) => {
					const sanitizedValue = safeHTML( newValue );
					onChange(
						applyFormat( value, {
							type: name,
							attributes: {
								content: sanitizedValue,
							},
						} )
					);
				} }
				help={ __(
					'Enter the text to display.',
					'blablablocks-formats'
				) }
				__nextHasNoMarginBottom={ true }
			/>
			<Flex justify="flex-end">
				<Button
					className="reset-button"
					onClick={ () => {
						onChange( removeFormat( value, name ) );
						if ( onClose ) onClose();
					} }
					variant="tertiary"
				>
					{ __( 'Clear', 'blablablocks-formats' ) }
				</Button>
			</Flex>
		</>
	);
}

/**
 * IconTabContent Renders the content for the text tab.
 *
 * @return {JSX.Element} - The rendered text tab content.
 */
function IconTabContent() {
	return <>Icon tab content goes here</>;
}

/**
 * InlineUI Renders an inline UI component with a popover.
 *
 * @param {Object}   props                  - The properties passed to the component.
 * @param {Function} props.onClose          - Callback function triggered when the popover is closed.
 * @param            props.activeAttributes
 * @param            props.name
 * @param            props.value
 * @param            props.onChange
 * @param            props.contentRef
 * @param            props.isActive
 * @return {JSX.Element}           - The rendered InlineUI component.
 */
export function InlineUI( {
	activeAttributes,
	name,
	value,
	onChange,
	onClose,
	contentRef,
	isActive,
} ) {
	const anchor = useAnchor( {
		editableContentElement: contentRef,
		settings: { isActive },
	} );

	return (
		<Popover
			anchor={ anchor }
			className="block-editor-format-toolbar__blablablocks-infotip-popover"
			position="middle center"
			onClose={ onClose }
			offset={ 30 }
			shift={ true }
		>
			<TabPanel
				className="block-editor-format-toolbar__blablablocks-infotip-tab-panel"
				tabs={ [
					{
						name: 'text',
						title: __( 'Text', 'blablablocks-formats' ),
						content: (
							<TextTabContent
								content={ activeAttributes.content }
								name={ name }
								value={ value }
								onChange={ onChange }
								onClose={ onClose }
							/>
						),
					},
					{
						name: 'icon',
						title: __( 'Icon', 'blablablocks-formats' ),
						content: <IconTabContent />,
					},
				] }
			>
				{ ( tab ) => tab.content }
			</TabPanel>
		</Popover>
	);
}
