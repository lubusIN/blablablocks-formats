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
import { useEffect } from '@wordpress/element';

// =====================
// Constants
// =====================

const PLACEMENT_OPTIONS = [
	{ label: __( 'Top', 'blablablocks-formats' ), value: 'top' },
	{ label: __( 'Top-start', 'blablablocks-formats' ), value: 'top-start' },
	{ label: __( 'Top-end', 'blablablocks-formats' ), value: 'top-end' },
	{ label: __( 'Right', 'blablablocks-formats' ), value: 'right' },
	{
		label: __( 'Right-start', 'blablablocks-formats' ),
		value: 'right-start',
	},
	{ label: __( 'Right-end', 'blablablocks-formats' ), value: 'right-end' },
	{ label: __( 'Bottom', 'blablablocks-formats' ), value: 'bottom' },
	{
		label: __( 'Bottom-start', 'blablablocks-formats' ),
		value: 'bottom-start',
	},
	{ label: __( 'Bottom-end', 'blablablocks-formats' ), value: 'bottom-end' },
	{ label: __( 'Left', 'blablablocks-formats' ), value: 'left' },
	{ label: __( 'Left-start', 'blablablocks-formats' ), value: 'left-start' },
	{ label: __( 'Left-end', 'blablablocks-formats' ), value: 'left-end' },
];

const ICONS = [
	{ label: __( 'Info', 'blablablocks-formats' ), graphic: info, id: 'info' },
	{ label: __( 'Help', 'blablablocks-formats' ), graphic: help, id: 'help' },
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

// =====================
// Tab Components
// =====================

/**
 * TextTabContent
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

	const handleTextChange = ( newValue ) => {
		const sanitizedValue = safeHTML( newValue );
		updateAttributes( { content: sanitizedValue } );
	};

	const handleUnderlineToggle = () => {
		if ( isUnderlined ) {
			updateAttributes( { underline: 'false' } );
		} else {
			removeAttributes( [ 'underline' ] );
		}
	};

	const handleClear = () => {
		onChange( removeFormat( value, name ) );
		if ( onClose ) onClose();
	};

	return (
		<VStack spacing={ 6 }>
			<TextareaControl
				label={ __( 'Text', 'blablablocks-formats' ) }
				onChange={ handleTextChange }
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
				onChange={ handleUnderlineToggle }
				__nextHasNoMarginBottom={ true }
			/>
			<Flex justify="flex-end">
				<Button
					accessibleWhenDisabled={ true }
					className="reset-button"
					onClick={ handleClear }
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
 * OverlayTabContent
 */
function OverlayTabContent( {
	activeAttributes,
	updateAttributes,
	removeAttributes,
} ) {
	const overLaySettingsEnabled =
		activeAttributes[ 'overlay-placement' ] ||
		activeAttributes[ 'overlay-background-color' ] ||
		activeAttributes[ 'overlay-text-color' ] ||
		activeAttributes.offset;

	const handleOffsetChange = ( newValue ) => {
		updateAttributes( { offset: newValue || 6 } );
	};

	const handlePlacementChange = ( selectedOption ) => {
		updateAttributes( { 'overlay-placement': selectedOption } );
	};

	const handleColorChange = ( type, newColor ) => {
		updateAttributes( {
			[ type ]:
				newColor ||
				( type === 'overlay-background-color' ? '#222222' : '#FFFFFF' ),
		} );
	};

	const handleReset = () => {
		removeAttributes( [
			'overlay-placement',
			'overlay-background-color',
			'overlay-text-color',
			'offset',
		] );
	};

	return (
		<>
			<Grid columns={ 2 } templateColumns="3fr 7fr" alignment="center">
				<div className="overlay-tab-label">
					{ __( 'Offset', 'blablablocks-formats' ) }
				</div>
				<NumberControl
					hideLabelFromVision={ true }
					label={ __( 'Offset', 'blablablocks-formats' ) }
					value={ activeAttributes.offset || 6 }
					__next40pxDefaultSize={ true }
					onChange={ handleOffsetChange }
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
					options={ PLACEMENT_OPTIONS }
					onChange={ handlePlacementChange }
					onClick={ ( event ) => event.stopPropagation() }
				/>

				<div
					className="overlay-tab-label"
					style={ { alignSelf: 'flex-start' } }
				>
					{ __( 'Color', 'blablablocks-formats' ) }
				</div>
				<PanelColorSettings
					className="overlay-color-settings"
					label={ __( 'Color', 'blablablocks-formats' ) }
					colorSettings={ [
						{
							label: __( 'Background', 'blablablocks-formats' ),
							value:
								activeAttributes[
									'overlay-background-color'
								] || '#222222',
							onChange: ( newColor ) =>
								handleColorChange(
									'overlay-background-color',
									newColor
								),
						},
						{
							label: __( 'Text', 'blablablocks-formats' ),
							value:
								activeAttributes[ 'overlay-text-color' ] ||
								'#FFFFFF',
							onChange: ( newColor ) =>
								handleColorChange(
									'overlay-text-color',
									newColor
								),
						},
					] }
				/>
			</Grid>
			<Flex justify="flex-end" style={ { marginTop: '1rem' } }>
				<Button
					accessibleWhenDisabled={ true }
					className="reset-button"
					disabled={ ! overLaySettingsEnabled }
					onClick={ handleReset }
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
 * IconTabContent
 */
function IconTabContent( {
	activeAttributes,
	updateAttributes,
	removeAttributes,
} ) {
	const selectedBlock = useSelect(
		( select ) => select( 'core/block-editor' ).getSelectedBlock(),
		[]
	);

	const { colors = [] } = useSelect(
		( select ) => select( 'core/block-editor' ).getSettings() || {},
		[]
	);

	const blockStyle = selectedBlock?.attributes?.style || {};
	const explicitTextColor = blockStyle?.color?.text;
	const textColorSlug = selectedBlock?.attributes?.textColor;
	const slugColor =
		textColorSlug &&
		colors.find( ( c ) => c.slug === textColorSlug )?.color;
	const defaultIconColor = explicitTextColor || slugColor;

	const iconEnabled = activeAttributes[ 'icon-enabled' ] === 'true';
	const currentIconColor =
		activeAttributes[ 'icon-color' ] || defaultIconColor;

	const handleToggleIcon = () => {
		if ( iconEnabled ) {
			removeAttributes( [
				'icon-enabled',
				'icon-position',
				'icon-color',
				'icon-type',
			] );
		} else {
			updateAttributes( { 'icon-enabled': 'true' } );
		}
	};

	const handleIconType = ( iconId ) => {
		updateAttributes( { 'icon-type': iconId } );
	};

	const handlePositionChange = ( newValue ) => {
		updateAttributes( { 'icon-position': newValue } );
	};

	const handleColorChange = ( newColor ) => {
		updateAttributes( { 'icon-color': newColor || defaultIconColor } );
	};

	const handleReset = () => {
		removeAttributes( [
			'icon-enabled',
			'icon-position',
			'icon-color',
			'icon-type',
		] );
	};

	// Show the info icon enabled as a default when no icon type is set, and icons are just enabled.
	if ( iconEnabled && ! activeAttributes[ 'icon-type' ] ) {
		updateAttributes( { 'icon-type': 'info' } );
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
						onChange={ handleToggleIcon }
					/>
				</div>

				<div className="icon-tab-label">
					{ __( 'Type', 'blablablocks-formats' ) }
				</div>
				<div>
					{ ICONS.map( ( icon ) => (
						<Button
							accessibleWhenDisabled={ true }
							disabled={ ! iconEnabled }
							key={ icon.id }
							icon={ icon.graphic }
							isPressed={
								activeAttributes[ 'icon-type' ] === icon.id
							}
							onClick={ () => handleIconType( icon.id ) }
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
					onChange={ handlePositionChange }
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
								onChange: handleColorChange,
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
					onClick={ handleReset }
					variant="tertiary"
					__next40pxDefaultSize={ true }
				>
					{ __( 'Reset', 'blablablocks-formats' ) }
				</Button>
			</Flex>
		</>
	);
}

// =====================
// Main InlineUI Component
// =====================

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

	useEffect( () => {
		return () => {
			const { ownerDocument } = contentRef;
			const infotips = ownerDocument.querySelectorAll(
				'blablablocks-infotip'
			);
			infotips.forEach( ( infotip ) => {
				if ( infotip && typeof infotip.hideTooltip === 'function' ) {
					infotip.hideTooltip();
				}
			} );
		};
	}, [ contentRef ] );

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
		const updatedAttributes = { ...activeAttributes };
		attributes.forEach( ( attribute ) => {
			delete updatedAttributes[ attribute ];
		} );
		updateAttributes( updatedAttributes );
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
								removeAttributes={ removeAttributes }
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
