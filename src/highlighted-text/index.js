/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { Icon } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import {
	Button,
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

/**
 * Format constants
 */
const name = 'blablablocks/highlighted';
const title = __( 'Highlighted', 'blablablocks-formats' );
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
 * Icon
 */
function formatIcon() {
	return (
		<Icon
			icon={
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<path fill="none" d="M0 0h24v24H0z" />
					<path d="M6 14l3 3v5h6v-5l3-3V9H6v5zm2-3h8v2.17l-3 3V20h-2v-3.83l-3-3V11zm3-9h2v3h-2zM3.502 5.874L4.916 4.46l2.122 2.12-1.414 1.415zm13.458.708l2.123-2.12 1.413 1.416-2.123 2.12z" />
				</svg>
			}
		/>
	);
}
/**
 * InlineUI component for handling highlighted text formatting options.
 *
 * @param {Object}   props                  - The component properties.
 * @param {string}   props.value            - The current highlighted format preset name.
 * @param {Function} props.onChange         - Callback to update the highlighted format preset.
 * @param {Function} props.onClose          - Callback to close the UI.
 * @param {Object}   props.activeAttributes - The currently active format attributes.
 * @param {Object}   props.contentRef       - Reference to the content element.
 * @return {JSX.Element}                     - The rendered component.
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
					className="block-editor-format-toolbar__blablablocks-highlighted-button"
				>
					<blablablocks-highlighted
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
					</blablablocks-highlighted>
				</Button>
			) ) }
		</Grid>
	);

	const AnimationTabContent = () => (
		<Grid
			columns={ 2 }
			rows={ 3 }
			templateColumns="3fr 7fr"
			alignment="center"
			className="block-editor-format-toolbar__blablablocks-highlighted-animation-tab"
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
			className="block-editor-format-toolbar__blablablocks-highlighted-popover"
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
				// Show a clear button, if there is a highlight format applied.
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
 * Button for editing the highlighted text format.
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
				icon={ formatIcon }
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

export const highlightedText = {
	name,
	title,
	tagName: 'blablablocks-highlighted',
	className: 'has-highlighted-text',
	edit: EditButton,
	attributes: {
		type: 'type',
		animation: 'animation',
		'animation-duration': 'animation-duration',
		'animation-function': 'animation-function',
		color: 'color',
	},
};
