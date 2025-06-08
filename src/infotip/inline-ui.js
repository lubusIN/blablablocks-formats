/**
 * WordPress dependencies
 */
import {
	Button,
	Flex,
	FormToggle,
	ToggleControl,
	Popover,
	TabPanel,
	TextareaControl,
	__experimentalVStack as VStack, // eslint-disable-line @wordpress/no-unsafe-wp-apis
	__experimentalGrid as Grid, // eslint-disable-line @wordpress/no-unsafe-wp-apis
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
 * @param {Object}   props                  - The properties passed to the component.
 * @param {Object}   props.activeAttributes - The active attributes of the infotip.
 * @param {string}   props.name             - The name of the infotip.
 * @param {string}   props.value            - The value of the infotip.
 * @param {Function} props.onChange         - The function to call when the text tab is changed.
 * @param {Function} props.onClose          - The function to call when the text tab is closed.
 * @param {Function} props.removeAttributes - The function to call when the text tab is removed.
 * @param {Function} props.updateAttributes - The function to call when the text tab is updated.
 * @return {JSX.Element} - The rendered text tab content.
 */
function TextTabContent( {
	activeAttributes,
	name,
	onChange,
	onClose,
	removeAttributes,
	updateAttributes,
	value,
} ) {
	const isUnderlined = activeAttributes.underline !== 'false';
	return (
		<VStack spacing={ 6 }>
			<TextareaControl
				label={ __( 'Text', 'blablablocks-formats' ) }
				value={ activeAttributes.content }
				onChange={ ( newValue ) => {
					const sanitizedValue = safeHTML( newValue );
					updateAttributes( {
						content: sanitizedValue,
					} );
				} }
				help={ __(
					'Enter the text to display.',
					'blablablocks-formats'
				) }
				__nextHasNoMarginBottom={ true }
			/>
			<ToggleControl
				id="underline-toggle"
				label={ __( 'Underline anchor text', 'blablablocks-formats' ) }
				checked={ isUnderlined }
				onChange={ () => {
					if ( isUnderlined ) {
						updateAttributes( { underline: 'false' } );
					} else {
						removeAttributes( [ 'underline' ] );
					}
				} }
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
		</VStack>
	);
}

/**
 * IconTabContent Renders the content for the icon tab.
 *
 * @return {JSX.Element} - The rendered icon tab content.
 */
function IconTabContent() {
	return (
		<Grid
			columns={ 2 }
			rows={ 4 }
			templateColumns="3fr 7fr"
			alignment="center"
		>
			<div className="icon-tab-label">Enable icon</div>
			<div>
				<FormToggle checked={ true } onChange={ () => {} } />
			</div>

			<div className="icon-tab-label">Icon</div>
			<div></div>

			<div className="icon-tab-label">Position</div>
			<div></div>

			<div className="icon-tab-label">Color</div>
			<div></div>
		</Grid>
	);
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

	const updateAttributes = ( newAttributes ) => {
		const updatedFormat = applyFormat( value, {
			type: name,
			attributes: {
				...activeAttributes,
				...newAttributes,
			},
		} );
		onChange( updatedFormat );
	};

	const removeAttributes = ( attributes ) => {
		attributes.forEach( ( attribute ) => {
			delete activeAttributes[ attribute ];
		} );
		updateAttributes( activeAttributes );
	};

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
								activeAttributes={ activeAttributes }
								name={ name }
								onChange={ onChange }
								onClose={ onClose }
								removeAttributes={ removeAttributes }
								updateAttributes={ updateAttributes }
								value={ value }
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
