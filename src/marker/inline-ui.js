/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useAnchor } from '@wordpress/rich-text';
import { Popover, TabPanel } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { StyleTab, ColorTab, AnimationTab } from './components';
import { createFormatHelpers } from '../utils';

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
	const { update, remove } = createFormatHelpers( {
		value,
		onChange,
		formatType: 'blablablocks/marker',
		activeAttributes,
	} );

	const anchor = useAnchor( {
		editableContentElement: contentRef,
		settings: { isActive },
	} );

	return (
		<Popover
			anchor={ anchor }
			className="block-editor-format-toolbar__blablablocks-marker-popover"
			offset={ 20 }
			onClose={ onClose }
			placement="bottom"
			shift
		>
			<TabPanel
				tabs={ [
					{
						name: 'style',
						title: __( 'Style', 'blablablocks-formats' ),
						content: (
							<StyleTab
								activeAttributes={ activeAttributes }
								onChange={ onChange }
								onClose={ onClose }
								updateAttributes={ update }
								value={ value }
							/>
						),
					},
					{
						name: 'color',
						title: __( 'Color', 'blablablocks-formats' ),
						content: (
							<ColorTab
								currentColor={ activeAttributes.color }
								updateAttributes={ update }
								removeAttributes={ remove }
							/>
						),
						disabled: ! activeAttributes.type,
					},
					{
						name: 'animation',
						title: __( 'Animation', 'blablablocks-formats' ),
						content: (
							<AnimationTab
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
