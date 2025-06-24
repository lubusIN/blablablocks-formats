/**
 * WordPress dependencies
 */
import {
	Button,
	Disabled,
	Flex,
	FormToggle,
	SelectControl,
	ToggleControl,
	__experimentalNumberControl as NumberControl, // eslint-disable-line @wordpress/no-unsafe-wp-apis
	__experimentalToggleGroupControl as ToggleGroupControl, // eslint-disable-line @wordpress/no-unsafe-wp-apis
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon, // eslint-disable-line @wordpress/no-unsafe-wp-apis
	Popover,
	TabPanel,
	TextareaControl,
	__experimentalVStack as VStack, // eslint-disable-line @wordpress/no-unsafe-wp-apis
	__experimentalGrid as Grid, // eslint-disable-line @wordpress/no-unsafe-wp-apis
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { applyFormat, removeFormat, useAnchor } from '@wordpress/rich-text';
import { safeHTML } from '@wordpress/dom';
import {
	caution,
	error,
	justifyLeft,
	justifyRight,
	help,
	info,
	notAllowed,
	starEmpty,
} from '@wordpress/icons';
import { PanelColorSettings } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

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
				onChange={ ( newValue ) => {
					const sanitizedValue = safeHTML( newValue );

					updateAttributes( {
						content: sanitizedValue,
					} );
				} }
				placeholder={ __(
					'Enter the text to display, or click clear to remove the format.',
					'blablablocks-formats'
				) }
				value={ activeAttributes.content }
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
				__nextHasNoMarginBottom={ true }
			/>
			<Flex justify="flex-end">
				<Button
					accessibleWhenDisabled={ true }
					className="reset-button"
					onClick={ () => {
						onChange( removeFormat( value, name ) );
						if ( onClose ) onClose();
					} }
					variant="tertiary"
					__next40pxDefaultSize={ true }
				>
					{ __( 'Clear', 'blablablocks-formats' ) }
				</Button>
			</Flex>
		</VStack>
	);
}

/**
 * OverlayTabContent Renders the content for the overlay tab.
 *
 * @return {JSX.Element} - The rendered overlay tab content.
 */
function OverlayTabContent( { activeAttributes, updateAttributes } ) {
	const placementOptions = [
		{
			label: __( 'Top', 'blablablocks-formats' ),
			value: 'top',
		},
		{
			label: __( 'Top-start', 'blablablocks-formats' ),
			value: 'top-start',
		},
		{
			label: __( 'Top-end', 'blablablocks-formats' ),
			value: 'top-end',
		},
		{
			label: __( 'Right', 'blablablocks-formats' ),
			value: 'right',
		},
		{
			label: __( 'Right-start', 'blablablocks-formats' ),
			value: 'right-start',
		},
		{
			label: __( 'Right-end', 'blablablocks-formats' ),
			value: 'right-end',
		},
		{
			label: __( 'Bottom', 'blablablocks-formats' ),
			value: 'bottom',
		},
		{
			label: __( 'Bottom-start', 'blablablocks-formats' ),
			value: 'bottom-start',
		},
		{
			label: __( 'Bottom-end', 'blablablocks-formats' ),
			value: 'bottom-end',
		},
		{
			label: __( 'Left', 'blablablocks-formats' ),
			value: 'left',
		},
		{
			label: __( 'Left-start', 'blablablocks-formats' ),
			value: 'left-start',
		},
		{
			label: __( 'Left-end', 'blablablocks-formats' ),
			value: 'left-end',
		},
	];

	return (
		<Grid columns={ 2 } templateColumns="3fr 7fr" alignment="center">
			<div className="overlay-tab-label">
				{ __( 'Offset', 'blablablocks-formats' ) }
			</div>
			<NumberControl
				hideLabelFromVision={ true }
				label={ __( 'Offset', 'blablablocks-formats' ) }
				value={ activeAttributes.offset || 6 }
				__next40pxDefaultSize={ true }
				onChange={ ( newValue ) => {
					updateAttributes( {
						offset: newValue || 6,
					} );
				} }
				style={ { width: '5rem' } }
				min={ 6 }
				max={ 20 }
			/>

			<div
				className="overlay-tab-label"
				style={ { alignSelf: 'flex-start', paddingTop: '0.5rem' } }
			>
				{ __( 'Placement', 'blablablocks-formats' ) }
			</div>
			<SelectControl
				label={ __( 'Placement', 'blablablocks-formats' ) }
				hideLabelFromVision={ true }
				__next40pxDefaultSize={ true }
				__nextHasNoMarginBottom={ true }
				value={ activeAttributes[ 'overlay-placement' ] || 'top' }
				options={ placementOptions }
				onChange={ ( selectedOption ) => {
					updateAttributes( {
						'overlay-placement': selectedOption,
					} );
				} }
				onClick={ ( event ) => {
					// Prevent the popover from closing when clicking the select control.
					event.stopPropagation();
				} }
			/>

			<div
				className="overlay-tab-label"
				style={ { alignSelf: 'flex-start' } }
			>
				{ __( 'Colors', 'blablablocks-formats' ) }
			</div>
			<PanelColorSettings
				className="overlay-color-settings"
				label={ __( 'Colors', 'blablablocks-formats' ) }
				colorSettings={ [
					{
						label: __( 'Background', 'blablablocks-formats' ),
						value:
							activeAttributes[ 'overlay-background-color' ] ||
							'#222222',
						onChange: ( newColor ) => {
							updateAttributes( {
								'overlay-background-color':
									newColor || '#222222',
							} );
						},
					},
					{
						label: __( 'Text', 'blablablocks-formats' ),
						value:
							activeAttributes[ 'overlay-text-color' ] ||
							'#FFFFFF',
						onChange: ( newColor ) => {
							updateAttributes( {
								'overlay-text-color': newColor || '#FFFFFF',
							} );
						},
					},
				] }
			/>
		</Grid>
	);
}

/**
 * IconTabContent Renders the content for the icon tab.
 *
 * @param {Object}   props                  - The properties passed to the component.
 * @param {Object}   props.activeAttributes - The active attributes of the infotip.
 * @param {Function} props.updateAttributes - The function to call when the icon tab is updated.
 * @param {Function} props.removeAttributes - The function to call when the icon tab is removed.
 * @return {JSX.Element} - The rendered icon tab content.
 */
function IconTabContent( {
	activeAttributes,
	updateAttributes,
	removeAttributes,
} ) {
	// Get the selected block
	const selectedBlock = useSelect(
		( select ) => select( 'core/block-editor' ).getSelectedBlock(),
		[]
	);

	// Get editor colors array
	const { colors = [] } = useSelect(
		( select ) => select( 'core/block-editor' ).getSettings() || {},
		[]
	);

	// Compute the paragraph text color from block attributes:
	const blockStyle = selectedBlock?.attributes?.style || {};
	const explicitTextColor = blockStyle?.color?.text;
	const textColorSlug = selectedBlock?.attributes?.textColor;

	// Resolve a fallback from the themes colors if slug is used
	const slugColor =
		textColorSlug &&
		colors.find( ( c ) => c.slug === textColorSlug )?.color;

	// Pick whichever color we have (explicit > slug > undefined)
	const defaultIconColor = explicitTextColor || slugColor;

	const icons = [
		{
			label: __( 'Info', 'blablablocks-formats' ),
			graphic: info,
			id: 'info',
		},
		{
			label: __( 'Help', 'blablablocks-formats' ),
			graphic: help,
			id: 'help',
		},
		{
			label: __( 'Caution', 'blablablocks-formats' ),
			graphic: caution,
			id: 'caution',
		},
		{
			label: __( 'Error', 'blablablocks-formats' ),
			graphic: error,
			id: 'error',
		},
		{
			label: __( 'Not allowed', 'blablablocks-formats' ),
			graphic: notAllowed,
			id: 'notAllowed',
		},
		{
			label: __( 'Star', 'blablablocks-formats' ),
			graphic: starEmpty,
			id: 'starEmpty',
		},
	];

	const iconEnabled = activeAttributes[ 'icon-enabled' ] === 'true';
	const currentIconColor =
		activeAttributes[ 'icon-color' ] || defaultIconColor;

	const onToggleIcon = () => {
		if ( iconEnabled ) {
			removeAttributes( [
				'icon-enabled',
				'icon-position',
				'icon-color',
				'icon-type',
			] );
		} else {
			updateAttributes( {
				'icon-enabled': 'true',
			} );
		}
	};

	// Show the info icon enabled as a default when no icon type is set, and icons are just enabled.
	if ( iconEnabled && ! activeAttributes[ 'icon-type' ] ) {
		updateAttributes( {
			'icon-type': 'info',
		} );
	}

	return (
		<>
			<Grid columns={ 2 } templateColumns="3fr 7fr" alignment="center">
				<div className="icon-tab-label">
					{ __( 'Enable', 'blablablocks-formats' ) }
				</div>
				<div>
					<FormToggle
						checked={ iconEnabled }
						onChange={ onToggleIcon }
					/>
				</div>

				<div className="icon-tab-label">
					{ __( 'Type', 'blablablocks-formats' ) }
				</div>
				<div>
					{ icons.map( ( icon ) => (
						<Button
							accessibleWhenDisabled={ true }
							disabled={ ! iconEnabled }
							key={ icon.id }
							icon={ icon.graphic }
							isPressed={
								activeAttributes[ 'icon-type' ] === icon.id
							}
							onClick={ () => {
								updateAttributes( {
									'icon-type': icon.id,
								} );
							} }
						/>
					) ) }
				</div>

				<div className="icon-tab-label">
					{ __( 'Position', 'blablablocks-formats' ) }
				</div>

				<ToggleGroupControl
					__nextHasNoMarginBottom={ true }
					__next40pxDefaultSize={ true }
					hideLabelFromVision={ true }
					label={ __( 'Position', 'blablablocks-formats' ) }
					value={ activeAttributes[ 'icon-position' ] || 'left' }
					onChange={ ( newValue ) => {
						updateAttributes( { 'icon-position': newValue } );
					} }
					disabled={ ! iconEnabled }
				>
					<ToggleGroupControlOptionIcon
						aria-label={ __(
							'Left icon position',
							'blablablocks-formats'
						) }
						label={ __( 'Left', 'blablablocks-formats' ) }
						icon={ justifyLeft }
						value="left"
						disabled={ ! iconEnabled }
					/>
					<ToggleGroupControlOptionIcon
						aria-label={ __(
							'Right icon position',
							'blablablocks-formats'
						) }
						label={ __( 'Right', 'blablablocks-formats' ) }
						icon={ justifyRight }
						value="right"
						disabled={ ! iconEnabled }
					/>
				</ToggleGroupControl>

				<div className="icon-tab-label">
					{ __( 'Color', 'blablablocks-formats' ) }
				</div>

				<Disabled isDisabled={ ! iconEnabled }>
					<PanelColorSettings
						label={ __( 'Color', 'blablablocks-formats' ) }
						className="icon-color-settings"
						colorSettings={ [
							{
								label: __( 'Icon', 'blablablocks-formats' ),
								value: currentIconColor,
								onChange: ( newColor ) => {
									updateAttributes( {
										'icon-color':
											newColor || defaultIconColor,
									} );
								},
							},
						] }
						disabled={ ! iconEnabled }
					/>
				</Disabled>
			</Grid>
			<Flex justify="flex-end" style={ { marginTop: '1rem' } }>
				<Button
					accessibleWhenDisabled={ true }
					className="reset-button"
					disabled={ ! iconEnabled }
					onClick={ () => {
						removeAttributes( [
							'icon-enabled',
							'icon-position',
							'icon-color',
							'icon-type',
						] );
					} }
					variant="tertiary"
					__next40pxDefaultSize={ true }
				>
					{ __( 'Reset', 'blablablocks-formats' ) }
				</Button>
			</Flex>
		</>
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
			__unstableSlotName="__unstable-block-tools-after"
			onFocusOutside={ ( event ) => {
				// Prevent closing on focus events inside the popover's UI components
				if (
					event.target.closest(
						'.block-editor-format-toolbar__blablablocks-infotip-popover'
					)
				) {
					event.preventDefault();
					event.stopPropagation();
					return false;
				}
			} }
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
						name: 'overlay',
						title: __( 'Overlay', 'blablablocks-formats' ),
						content: (
							<OverlayTabContent
								activeAttributes={ activeAttributes }
								updateAttributes={ updateAttributes }
							/>
						),
						disabled: ! activeAttributes.content,
					},
					{
						name: 'icon',
						title: __( 'Icon', 'blablablocks-formats' ),
						content: (
							<IconTabContent
								activeAttributes={ activeAttributes }
								updateAttributes={ updateAttributes }
								removeAttributes={ removeAttributes }
							/>
						),
						disabled:
							! activeAttributes.content &&
							! activeAttributes[ 'icon-enabled' ],
					},
				] }
			>
				{ ( tab ) => tab.content }
			</TabPanel>
		</Popover>
	);
}
