/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
	Panel,
	PanelRow,
	TextControl,
	Popover,
	Button,
} from '@wordpress/components';

import {
	registerFormatType,
	applyFormat,
	removeFormat,
	useAnchorRef,
} from '@wordpress/rich-text';

import {
	MediaUpload,
	RichTextToolbarButton,
	MediaUploadCheck,
} from '@wordpress/block-editor';

import { audio, keyboardReturn } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import './editor.scss';

const ALLOWED_MEDIA_TYPES = [ 'audio' ];

/**
 * Inline UI For Settings
 */
function InlineUI( {
	value,
	onReplace,
	onChange,
	onClose,
	activeAttributes,
	contentRef,
} ) {
	const { start, startLength, end, endLength, plays } = activeAttributes;

	const [ startTime, setStartTime ] = useState( {
		time: start,
		length: startLength,
	} );

	const [ endTime, setEndTime ] = useState( {
		time: end,
		length: endLength,
	} );

	const [ playCount, setPlayCount ] = useState( plays );

	const anchorRef = useAnchorRef( {
		ref: contentRef,
		value,
		settings: {
			title: 'Soundcite',
			tagName: 'span',
			className: 'soundcite',
		},
	} );

	return (
		<Popover
			position="bottom center"
			anchorRef={ anchorRef }
			className="block-editor-format-toolbar__soundcite-popover"
			onClose={ onClose }
		>
			<form
				className="block-editor-format-toolbar__soundcite-container"
				onSubmit={ ( event ) => {
					onChange(
						applyFormat( value, {
							type: 'lubus/soundcite',
							attributes: {
								...activeAttributes,
								start: startTime.time,
								startLength: startTime.length,
								end: endTime.time,
								endLength: endTime.length,
								plays: playCount,
							},
						} )
					);

					onClose(); // Close the inline ui

					event.preventDefault();
				} }
			>
				<Panel>
					<PanelRow>
						<TextControl
							className="block-editor-format-toolbar__soundcite-value"
							type="number"
							label={ __( 'StartTime' ) }
							value={ startTime.length }
							min={ 0 }
							step={ 0.01 }
							onChange={ ( newStartTime ) =>
								setStartTime( {
									time: getMilliseconds( newStartTime ),
									length: newStartTime,
								} )
							}
						/>
						<TextControl
							className="block-editor-format-toolbar__soundcite-value"
							type="number"
							label={ __( 'EndTime' ) }
							value={ endTime.length }
							min={ 0.05 }
							step={ 0.01 }
							onChange={ ( newEndTime ) =>
								setEndTime( {
									time: getMilliseconds( newEndTime ),
									length: newEndTime,
								} )
							}
						/>
						<TextControl
							className="block-editor-format-toolbar__soundcite-value"
							type="number"
							label={ __( 'Playcount' ) }
							value={ playCount }
							min={ 1 }
							onChange={ ( newPlayCount ) =>
								setPlayCount( newPlayCount )
							}
						/>
						<Button
							icon={ keyboardReturn }
							label={ __( 'Apply' ) }
							type="submit"
						/>
					</PanelRow>
					<PanelRow className="block-editor-format-toolbar__soundcite-action">
						<MediaUploadCheck>
							<Button isTertiary isLink onClick={ onReplace }>
								Replace
							</Button>
						</MediaUploadCheck>

						<Button
							isDestructive
							isLink
							onClick={ () => {
								onChange(
									removeFormat( value, 'lubus/soundcite' )
								);

								onClose(); // Close the inline ui
							} }
						>
							Remove
						</Button>
					</PanelRow>
				</Panel>
			</form>
		</Popover>
	);
}

/**
 * Format Edit Button
 */
const SoundciteButton = ( props ) => {
	const { value, onChange, onFocus, isActive, activeAttributes, contentRef } =
		props;

	const [ isModalOpen, setIsModalOpen ] = useState( false );
	const [ isSettingOpen, setIsSettingOpen ] = useState( false );

	function openModal() {
		setIsModalOpen( true );
	}

	function closeModal() {
		setIsModalOpen( false );
	}

	function openSettings() {
		setIsSettingOpen( true );
	}

	function closeSettings() {
		setIsSettingOpen( false );
	}

	return (
		<MediaUploadCheck>
			<RichTextToolbarButton
				key={
					isActive ? 'text-soundcite' : 'text-soundcite-not-active'
				}
				icon={ audio }
				title="Soundcite"
				onClick={ () => {
					!! activeAttributes.url ? openSettings() : openModal();
				} }
				isActive={ isActive }
				isPressed={ isActive }
			/>

			{ isModalOpen && (
				<MediaUpload
					allowedTypes={ ALLOWED_MEDIA_TYPES }
					onSelect={ ( { url, fileLength } ) => {
						closeModal();

						if ( ! activeAttributes.url ) {
							onChange(
								applyFormat( value, {
									type: 'lubus/soundcite',
									attributes: {
										url,
										start: '0',
										startLength: '0',
										end: getMilliseconds( fileLength ),
										endLength: fileLength.replace(
											':',
											'.'
										),
										plays: '1',
									},
								} )
							);

							openSettings();
						} else {
							onChange(
								applyFormat( value, {
									type: 'lubus/soundcite',
									attributes: {
										...activeAttributes,
										url,
										startLength: '0',
										end: getMilliseconds( fileLength ),
										endLength: fileLength.replace(
											':',
											'.'
										),
									},
								} )
							);

							onFocus();
						}
					} }
					onClose={ closeModal }
					render={ ( { open } ) => {
						open();
						return null;
					} }
				/>
			) }

			{ isSettingOpen && (
				<InlineUI
					value={ value }
					onReplace={ openModal }
					onChange={ onChange }
					onClose={ closeSettings }
					activeAttributes={ activeAttributes }
					contentRef={ contentRef }
				/>
			) }
		</MediaUploadCheck>
	);
};

/**
 * Get Time In Milliseconds
 */
function getMilliseconds( length ) {
	const time = length.replace( ':', '.' ).split( '.' );
	const [ m = 0, s = 0 ] = time;
	const milliseconds = ( m * 60 + s ) * 1000;

	return milliseconds.toString();
}

/**
 * Register Richtext Format.
 */
registerFormatType( 'lubus/soundcite', {
	title: 'Soundcite',
	tagName: 'span',
	className: 'soundcite',
	edit: SoundciteButton,
	attributes: {
		url: 'data-url',
		start: 'data-start',
		end: 'data-end',
		startLength: 'data-start-length',
		endLength: 'data-end-length',
		plays: 'data-plays',
	},
} );
