/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
	reset,
	formatCapitalize,
	formatLowercase,
	formatUppercase,
} from '@wordpress/icons';
import {
	Popover,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';
import {
	useAnchor,
	applyFormat,
	removeFormat,
	registerFormatType,
} from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import './editor.scss';
import './style.scss';

const name = 'lubus/change-case';
const title = 'Change Case';

/**
 * Main icon for toolbar button
 */
const ChangeCaseIcon = () => (
	<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<path fill="none" d="M0 0h24v24H0V0z" />
		<path d="M9 4v3h5v12h3V7h5V4H9zm-6 8h3v7h3v-7h3V9H3v3z" fill="currentColor" />
	</svg>
);

/**
 * Text transform options matching WordPress core
 */
const TEXT_TRANSFORMS = [
	{
		label: __( 'None' ),
		value: 'none',
		icon: reset,
	},
	{
		label: __( 'Uppercase' ),
		value: 'uppercase',
		icon: formatUppercase,
	},
	{
		label: __( 'Lowercase' ),
		value: 'lowercase',
		icon: formatLowercase,
	},
	{
		label: __( 'Capitalize' ),
		value: 'capitalize',
		icon: formatCapitalize,
	},
];

/**
 *  Format edit
 */
function EditButton( props ) {
	const { value, onChange, onFocus, isActive, contentRef, activeAttributes } = props;

	const [ isPopoverOpen, setIsPopoverOpen ] = useState( false );

	const anchor = useAnchor( {
		editableContentElement: contentRef.current,
		settings: { isActive },
	} );

	// Get the currently active case type from the class attribute
	const activeClass = activeAttributes?.class || '';
	let activeCaseType = activeClass.replace( 'has-', '' ).replace( '-case', '' );
	
	// Map our class names to WordPress core values
	if ( activeCaseType === 'titlecase' ) {
		activeCaseType = 'capitalize';
	}
	if ( !activeCaseType ) {
		activeCaseType = 'none';
	}

	// Check if selection contains multiple words (for capitalize validation)
	const selectedText = value.text.slice( value.start, value.end );
	const hasMultipleWords = selectedText.trim().split( /\s+/ ).length > 1;

	// Filter options based on selection
	const availableOptions = TEXT_TRANSFORMS.filter( ( option ) => {
		// Show capitalize only for multi-word selections
		if ( option.value === 'capitalize' && ! hasMultipleWords ) {
			return false;
		}
		return true;
	} );

	function handleChange( newValue ) {
		// Remove any existing case format first
		let newFormattedValue = removeFormat( value, name );

		// If newValue is not 'none', apply the format
		if ( newValue && newValue !== 'none' ) {
			// Map WordPress core values to our class names
			let caseType = newValue;
			if ( newValue === 'capitalize' ) {
				caseType = 'titlecase';
			}

			const className = `has-${ caseType }-case`;
			newFormattedValue = applyFormat( newFormattedValue, {
				type: name,
				attributes: {
					class: className,
				},
			} );
		}

		onChange( newFormattedValue );
		onFocus();
		setIsPopoverOpen( false );
	}

	return (
		<>
			<RichTextToolbarButton
				icon={ ChangeCaseIcon }
				title={ title }
				onClick={ () => setIsPopoverOpen( true ) }
				isActive={ isActive }
			/>
			{ isPopoverOpen && (
				<Popover
					anchor={ anchor }
					onClose={ () => setIsPopoverOpen( false ) }
					placement="bottom"
					shift
					offset={ 10 }
				>
					<div style={ { padding: '8px' } }>
						<ToggleGroupControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							isBlock
							label={ __( 'Letter case' ) }
							value={ activeCaseType }
							onChange={ handleChange }
						>
							{ availableOptions.map( ( option ) => (
								<ToggleGroupControlOptionIcon
									key={ option.value }
									value={ option.value }
									icon={ option.icon }
									label={ option.label }
								/>
							) ) }
						</ToggleGroupControl>
					</div>
				</Popover>
			) }
		</>
	);
}

/**
 * Register Change Case Format.
 */
registerFormatType( name, {
	title,
	tagName: 'span',
	className: 'has-change-case-format',
	edit: EditButton,
	attributes: {
		class: 'class',
	},
} );
