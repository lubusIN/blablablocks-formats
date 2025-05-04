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
		const defaultAttributes = {
			type: 'circle',
			animation: 'true',
			'animation-duration': '5',
			'animation-function': 'linear',
			color: 'red',
		};

		const updatedFormat = applyFormat( value, {
			type: name,
			attributes: {
				...defaultAttributes,
				...activeAttributes,
				...newAttributes,
			},
		} );

		return onChange( updatedFormat );
	};

	const StyleTabContent = () => (
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
						type={ preset.id }
						animation={ activeAttributes.animation ?? 'true' }
						animation-duration={
							activeAttributes[ 'animation-duration' ] ?? '5'
						}
						animation-function={
							activeAttributes[ 'animation-function' ] ?? 'linear'
						}
						color={ activeAttributes.color ?? 'red' }
					>
						{ preset.label }
					</blablablocks-marker>
				</Button>
			) ) }
		</Grid>
	);

	const ColorTabContent = () => {
		const themeColors = useSelect(
			( select ) => select( 'core/block-editor' ).getSettings().colors,
			[]
		);
		return (
			<ColorPalette
				value={ activeAttributes.color ?? 'red' }
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
								name: 'Red',
								color: '#f00',
							},
							{
								name: 'Green',
								color: '#0f0',
							},
							{
								name: 'Blue',
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
		);
	};

	const AnimationTabContent = () => (
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
					updateAttributes( {
						animation:
							activeAttributes.animation !== 'false'
								? 'false'
								: 'true',
					} );
				} }
				label={ __( 'Enable Animation', 'blablablocks-formats' ) }
				hideLabelFromVision={ true }
			/>

			{ /* row 2 - Animation duration  */ }
			<span className="animation-tab-label">
				{ __( 'Duration (seconds)', 'blablablocks-formats' ) }
			</span>
			<NumberControl
				value={ activeAttributes[ 'animation-duration' ] ?? '5' }
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
				label={ __( 'Type', 'blablablocks-formats' ) }
				value={ activeAttributes[ 'animation-function' ] ?? 'linear' }
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
	);

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
						content: <StyleTabContent />,
					},
					{
						name: 'color',
						title: __( 'Color', 'blablablocks-formats' ),
						content: <ColorTabContent />,
						disabled: ! activeAttributes.type,
					},
					{
						name: 'animation',
						title: __( 'Animation', 'blablablocks-formats' ),
						content: <AnimationTabContent />,
						disabled: ! activeAttributes.type,
					},
				] }
			>
				{ ( tab ) => tab.content }
			</TabPanel>

			{ activeAttributes.type && (
				// Show a clear button, if there is a marker format applied.
				<Flex justify="flex-end">
					<Button
						variant="tertiary"
						onClick={ () =>
							onChange( removeFormat( value, name ) )
						}
						className="block-editor-format-toolbar__clear-button"
					>
						{ __( 'Clear', 'blablablocks-formats' ) }
					</Button>
				</Flex>
			) }
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

	function openSettings() {
		setIsSettingOpen( true );
	}

	function closeSettings() {
		setIsSettingOpen( false );
	}

	return (
		<>
			<RichTextToolbarButton
				icon={ <MarkerLogo /> }
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
