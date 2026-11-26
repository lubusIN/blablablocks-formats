/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useAnchor } from '@wordpress/rich-text';
import { Popover, TabPanel } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { EffectTab, SettingsTab, WordsTab } from './components';
import { createFormatHelpers } from '../utils';

/**
 * InlineUI component for handling Text Animation formatting options.
 *
 * @param {Object}   props                  - The component properties.
 * @param {string}   props.value            - The current rich text value.
 * @param {Function} props.onChange         - Callback to update the format.
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
	const { update, remove } = createFormatHelpers( {
		value,
		onChange,
		formatType: 'blablablocks/text-animation',
		activeAttributes,
	} );

	const anchor = useAnchor( {
		editableContentElement: contentRef,
		settings: { isActive },
	} );

	return (
		<Popover
			anchor={ anchor }
			className="block-editor-format-toolbar__blablablocks-text-animation-popover"
			offset={ 20 }
			onClose={ onClose }
			placement="bottom"
			shift
		>
			<TabPanel
				tabs={ [
					{
						name: 'effect',
						title: __( 'Effect', 'blablablocks-formats' ),
						content: (
							<EffectTab
								activeAttributes={ activeAttributes }
								onChange={ onChange }
								onClose={ onClose }
								updateAttributes={ update }
								value={ value }
							/>
						),
					},
					{
						name: 'settings',
						title: __( 'Settings', 'blablablocks-formats' ),
						content: (
							<SettingsTab
								activeAttributes={ activeAttributes }
								updateAttributes={ update }
								removeAttributes={ remove }
							/>
						),
						disabled: ! activeAttributes.type,
					},
					{
						name: 'words',
						title: __( 'Words', 'blablablocks-formats' ),
						content: (
							<WordsTab
								activeAttributes={ activeAttributes }
								updateAttributes={ update }
								removeAttributes={ remove }
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

export default InlineUI;
