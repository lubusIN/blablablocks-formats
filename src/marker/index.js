/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import {
	Button,
	ColorPalette,
	Flex,
	FormToggle,
	Popover,
	SelectControl,
	TabPanel,
	__experimentalGrid as Grid, // eslint-disable-line
	__experimentalNumberControl as NumberControl, // eslint-disable-line
} from '@wordpress/components';
import { applyFormat, removeFormat, useAnchor } from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import './editor.scss';
import './style.scss';
import { ReactComponent as MarkerLogo } from '../../assets/images/marker.svg';

/**
 * Format constants
 */
const name = 'blablablocks/marker';
const title = __( 'Marker', 'blablablocks-formats' );
const presets = [
	{
		id: 'circle',
		label: __( 'Circle', 'blablablocks-formats' ),
	},
	{
		id: 'curly',
		label: __( 'Curly', 'blablablocks-formats' ),
	},
	{
		id: 'underline',
		label: __( 'Underline', 'blablablocks-formats' ),
	},
	{
		id: 'double',
		label: __( 'Double', 'blablablocks-formats' ),
	},
	{
		id: 'double-underline',
		label: __( 'Double Underline', 'blablablocks-formats' ),
	},
	{
		id: 'underline-zigzag',
		label: __( 'Underline Zigzag', 'blablablocks-formats' ),
	},
	{
		id: 'strikethrough',
		label: __( 'Strikethrough', 'blablablocks-formats' ),
	},
	{
		id: 'cross',
		label: __( 'Cross', 'blablablocks-formats' ),
	},
	{
		id: 'strike',
		label: __( 'Strike', 'blablablocks-formats' ),
	},
];

const defaultAttributes = {
	type: 'circle',
	animation: 'true',
	'animation-duration': '5',
	'animation-function': 'linear',
	color: 'red',
};

/**
 * ColorTabContent component for selecting colors.
 *
 * @param {Object}   props                  - The component properties.
 * @param {string}   props.currentColor     - The current color selected.
 * @param {Function} props.updateAttributes - Function to update the attributes.
 * @param {Function} props.removeAttributes - Function to remove attributes.
 * @return {JSX.Element}                    - The rendered component.
 */
function ColorTabContent( {
	currentColor,
	updateAttributes,
	removeAttributes,
} ) {
	const themeColors = useSelect(
		( select ) => select( 'core/block-editor' ).getSettings().colors,
		[]
	);
	return (
		<>
			<ColorPalette
				as="div"
				value={ currentColor ?? defaultAttributes.color }
				onChange={ ( newValue ) => {
					updateAttributes( {
						color: newValue,
					} );
				} }
				label={ __( 'Color', 'blablablocks-formats' ) }
				aria-label="Marker format color selection"
				colors={ [
					{
						name: __( 'Primary colors', 'blablablocks-formats' ),
						colors: [
							{
								name: __( 'Red', 'blablablocks-formats' ),
								color: '#f00',
							},
							{
								name: __( 'Green', 'blablablocks-formats' ),
								color: '#0f0',
							},
							{
								name: __( 'Blue', 'blablablocks-formats' ),
								color: '#00f',
							},
						],
					},
					{
						name: __( 'Theme colors', 'blablablocks-formats' ),
						colors: themeColors.map( ( color ) => {
							return {
								name: color.name,
								color: color.color,
							};
						} ),
					},
				] }
				clearable={ false }
			/>
			<Flex justify="flex-end">
				<Button
					disabled={ ! currentColor }
					variant="tertiary"
					onClick={ () => {
						removeAttributes( [ 'color' ] );
					} }
					className="reset-button"
				>
					{ __( 'Reset', 'blablablocks-formats' ) }
				</Button>
			</Flex>
		</>
	);
}

/**
 * AnimationTabContent component for managing animation settings tab.
 *
 * @param {Object}   props                  - The component properties.
 * @param {Object}   props.activeAttributes - The currently active format attributes.
 * @param {Function} props.updateAttributes - Function to update the attributes.
 * @param {Function} props.removeAttributes - Function to remove attributes.
 * @return {JSX.Element} - The rendered component.
 */
function AnimationTabContent( {
	activeAttributes,
	updateAttributes,
	removeAttributes,
} ) {
	const hasCustomAnimationSetting = Object.keys( activeAttributes ).some(
		( key ) => key.includes( 'animation' )
	);

	return (
		<>
			<Grid
				columns={ 2 }
				rows={ 3 }
				templateColumns="3fr 7fr"
				alignment="center"
				className="block-editor-format-toolbar__blablablocks-marker-animation-tab"
			>
				{ /* row 1 - Animation enable */ }
				<span className="animation-tab-label">
					{ __( 'Enabled', 'blablablocks-formats' ) }
				</span>
				<FormToggle
					checked={ activeAttributes.animation !== 'false' }
					onChange={ () => {
						if ( activeAttributes.animation === 'false' ) {
							removeAttributes( [ 'animation' ] );
						} else {
							updateAttributes( { animation: 'false' } );
						}
					} }
					label={ __( 'Enable Animation', 'blablablocks-formats' ) }
				/>

				{ /* row 2 - Animation duration  */ }
				<span className="animation-tab-label">
					{ __( 'Duration (seconds)', 'blablablocks-formats' ) }
				</span>
				<NumberControl
					disabled={ activeAttributes.animation === 'false' }
					value={
						activeAttributes[ 'animation-duration' ] ??
						defaultAttributes[ 'animation-duration' ]
					}
					min={ 1 }
					max={ 10 }
					step={ 0.5 }
					onChange={ ( newValue ) => {
						updateAttributes( {
							'animation-duration': newValue,
						} );
					} }
					label={ __( 'Duration', 'blablablocks-formats' ) }
					hideLabelFromVision={ true }
					__next40pxDefaultSize={ true }
					style={ { justifySelf: 'start' } }
				/>

				{ /* row 3 - Animation timing function  */ }
				<span className="animation-tab-label">
					{ __( 'Type', 'blablablocks-formats' ) }
				</span>
				<SelectControl
					disabled={ activeAttributes.animation === 'false' }
					label={ __( 'Type', 'blablablocks-formats' ) }
					value={
						activeAttributes[ 'animation-function' ] ??
						defaultAttributes[ 'animation-function' ]
					}
					options={ [
						{
							label: __( 'Linear', 'blablablocks-formats' ),
							value: 'linear',
						},
						{
							label: __( 'Ease', 'blablablocks-formats' ),
							value: 'ease',
						},
						{
							label: __( 'Ease In', 'blablablocks-formats' ),
							value: 'ease-in',
						},
						{
							label: __( 'Ease Out', 'blablablocks-formats' ),
							value: 'ease-out',
						},
						{
							label: __( 'Ease In Out', 'blablablocks-formats' ),
							value: 'ease-in-out',
						},
						{
							label: __( '3 Steps', 'blablablocks-formats' ),
							value: 'steps(3, start)',
						},
						{
							label: __( '5 Steps', 'blablablocks-formats' ),
							value: 'steps(5, end)',
						},
					] }
					hideLabelFromVision={ true }
					onChange={ ( newValue ) => {
						updateAttributes( {
							'animation-function': newValue,
						} );
					} }
					__next40pxDefaultSize={ true }
					__nextHasNoMarginBottom={ true }
				/>
			</Grid>
			<Flex justify="flex-end">
				<Button
					className="reset-button"
					disabled={ ! hasCustomAnimationSetting }
					onClick={ () =>
						removeAttributes( [
							'animation',
							'animation-duration',
							'animation-function',
						] )
					}
					variant="tertiary"
				>
					{ __( 'Reset', 'blablablocks-formats' ) }
				</Button>
			</Flex>
		</>
	);
}

/**
 * StyleTabContent component for managing marker style selection.
 *
 * @param {Object}   props                  - The component properties.
 * @param {Object}   props.activeAttributes - The currently active format attributes.
 * @param {Function} props.onChange         - Callback to update the marker format.
 * @param {Function} props.onClose          - Callback to close the UI.
 * @param {Function} props.updateAttributes - Function to update the attributes.
 * @param {Object}   props.value            - The current rich text value.
 * @return {JSX.Element}                   - The rendered component.
 */
function StyleTabContent( {
	activeAttributes,
	onChange,
	onClose,
	updateAttributes,
	value,
} ) {
	return (
		<>
			<Grid
				templateColumns="repeat( 3, minmax( 0, 1fr ) )"
				templateRows="repeat( 3, minmax( 0, 1fr ) )"
			>
				{ presets.map( ( preset ) => (
					<Button
						key={ preset.id }
						id={ preset.id }
						onClick={ () => {
							updateAttributes( {
								type: preset.id,
							} );
						} }
						isPressed={ activeAttributes.type === preset.id }
						className="block-editor-format-toolbar__blablablocks-marker-button"
					>
						<blablablocks-marker
							{ ...activeAttributes }
							type={ preset.id }
						>
							{ preset.label }
						</blablablocks-marker>
					</Button>
				) ) }
			</Grid>
			<Flex justify="flex-end">
				<Button
					className="reset-button"
					disabled={ ! activeAttributes.type }
					onClick={ () => {
						onChange( removeFormat( value, name ) );
						onClose();
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
 * InlineUI component for handling Marker text formatting options.
 *
 * @param {Object}   props                  - The component properties.
 * @param {string}   props.value            - The current marker format preset name.
 * @param {Function} props.onChange         - Callback to update the marker format preset.
 * @param {Function} props.onClose          - Callback to close the UI.
 * @param {Object}   props.activeAttributes - The currently active format attributes.
 * @param {Object}   props.contentRef       - Reference to the content element.
 * @param {boolean}  props.isActive         - Indicates if the format is active.
 * @return {JSX.Element}                    - The rendered component.
 */
function InlineUI( {
	value,
	onChange,
	onClose,
	activeAttributes,
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

		return onChange( updatedFormat );
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
			className="block-editor-format-toolbar__blablablocks-marker-popover"
			offset={ 20 }
			onClose={ onClose }
			placement="bottom"
			shift={ true }
		>
			<TabPanel
				tabs={ [
					{
						name: 'style',
						title: __( 'Style', 'blablablocks-formats' ),
						content: (
							<StyleTabContent
								activeAttributes={ activeAttributes }
								onChange={ onChange }
								onClose={ onClose }
								updateAttributes={ updateAttributes }
								value={ value }
							/>
						),
					},
					{
						name: 'color',
						title: __( 'Color', 'blablablocks-formats' ),
						content: (
							<ColorTabContent
								currentColor={ activeAttributes.color }
								updateAttributes={ updateAttributes }
								removeAttributes={ removeAttributes }
							/>
						),
						disabled: ! activeAttributes.type,
					},
					{
						name: 'animation',
						title: __( 'Animation', 'blablablocks-formats' ),
						content: (
							<AnimationTabContent
								activeAttributes={ activeAttributes }
								updateAttributes={ updateAttributes }
								removeAttributes={ removeAttributes }
							/>
						),
						disabled: ! activeAttributes.type,
					},
				] }
			>
				{ ( tab ) => tab.content }
			</TabPanel>
		</Popover>
	);
}
/**
 * Button for editing the marker text format.
 *
 * @param {Object} props - The component properties.
 * @return {JSX.Element} The rendered component.
 */
function EditButton( props ) {
	const { value, onChange, isActive, contentRef, activeAttributes } = props;

	const [ isSettingOpen, setIsSettingOpen ] = useState( false );

	return (
		<>
			<RichTextToolbarButton
				icon={ <MarkerLogo /> }
				title={ title }
				onClick={ () => {
					setIsSettingOpen( true );
				} }
				isActive={ isActive }
			/>

			{ isSettingOpen && (
				<InlineUI
					value={ value }
					onChange={ onChange }
					onClose={ () => {
						setIsSettingOpen( false );
					} }
					activeAttributes={ activeAttributes }
					contentRef={ contentRef.current }
					isActive={ isActive }
				/>
			) }
		</>
	);
}

export const marker = {
	name,
	title,
	tagName: 'blablablocks-marker',
	className: 'has-marker-text',
	edit: EditButton,
	attributes: {
		type: 'type',
		animation: 'animation',
		'animation-duration': 'animation-duration',
		'animation-function': 'animation-function',
		color: 'color',
	},
};
