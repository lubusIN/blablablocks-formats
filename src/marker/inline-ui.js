/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
    Popover,
    TabPanel,
} from '@wordpress/components';
import { applyFormat, useAnchor } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import { StyleTab, ColorTab, AnimationTab } from './components';

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
function InlineUI({
    value,
    onChange,
    onClose,
    activeAttributes,
    contentRef,
    isActive,
}) {
    const anchor = useAnchor({
        editableContentElement: contentRef,
        settings: { isActive },
    });

    const updateAttributes = (newAttributes) => {
        const updatedFormat = applyFormat(value, {
            type: 'blablablocks/marker',
            attributes: {
                ...activeAttributes,
                ...newAttributes,
            },
        });
        return onChange(updatedFormat);
    };

    const removeAttributes = (attributes) => {
        attributes.forEach(attribute => delete activeAttributes[attribute]);
        updateAttributes(activeAttributes);
    };

    return (
        <Popover
            anchor={anchor}
            className="block-editor-format-toolbar__blablablocks-marker-popover"
            offset={20}
            onClose={onClose}
            placement="bottom"
            shift
        >
            <TabPanel
                tabs={[
                    {
                        name: 'style',
                        title: __('Style', 'blablablocks-formats'),
                        content: (
                            <StyleTab
                                activeAttributes={activeAttributes}
                                onChange={onChange}
                                onClose={onClose}
                                updateAttributes={updateAttributes}
                                value={value}
                            />
                        ),
                    },
                    {
                        name: 'color',
                        title: __('Color', 'blablablocks-formats'),
                        content: (
                            <ColorTab
                                currentColor={activeAttributes.color}
                                updateAttributes={updateAttributes}
                                removeAttributes={removeAttributes}
                            />
                        ),
                        disabled: !activeAttributes.type,
                    },
                    {
                        name: 'animation',
                        title: __('Animation', 'blablablocks-formats'),
                        content: (
                            <AnimationTab
                                activeAttributes={activeAttributes}
                                updateAttributes={updateAttributes}
                                removeAttributes={removeAttributes}
                            />
                        ),
                        disabled: !activeAttributes.type,
                    },
                ]}
            >
                {(tab) => tab.content}
            </TabPanel>
        </Popover>
    );
}

export default InlineUI;