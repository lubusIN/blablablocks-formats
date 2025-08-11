/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { removeFormat, useAnchor } from '@wordpress/rich-text';
import {
    __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients
} from '@wordpress/block-editor';
import { Button, Popover, GradientPicker } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { createFormatHelpers } from '../utils';

/**
 * InlineUI component for handling Gradient text formatting options.
 *
 * @param {Object}   props                  - The component properties.
 * @param {Object}   props.activeAttributes - The currently active attributes.
 * @param {Object}   props.value            - The current value of the rich text.
 * @param {Function} props.onChange         - Function to update the rich text value.
 * @param {Function} props.onClose          - Function to close the popover.
 * @param {Object}   props.contentRef       - Reference to the editable content element.
 * @param {boolean}  props.isActive         - Indicates if the format is currently active.
 * @return {JSX.Element} - The rendered InlineUI component.
 */
function InlineUI({
    activeAttributes,
    value,
    onChange,
    onClose,
    contentRef,
    isActive,
}) {
    const name = 'blablablocks/gradient-text'; // Format type name
    const PREFIX = 'background:';

    // safely extract the raw gradient for the picker
    const stored = activeAttributes?.style ?? '';
    const pickerValue = stored.startsWith(PREFIX) ? stored.slice(PREFIX.length) : stored;

    const { update } = createFormatHelpers({
        value,
        onChange,
        formatType: name,
        activeAttributes,
    });

    const anchor = useAnchor({
        editableContentElement: contentRef,
        settings: { isActive },
    });

    const colorGradientSettings = useMultipleOriginColorsAndGradients();

    return (
        <Popover
            anchor={anchor}
            className="block-editor-format-toolbar__blablablocks-gradient-text-popover"
            position="middle center"
            onClose={onClose}
            offset={30}
            shift
            __unstableSlotName="__unstable-block-tools-after"
        >
            <GradientPicker
                value={pickerValue || undefined}
                gradients={colorGradientSettings.gradients}
                onChange={(gradient) => {
                    if (!gradient) {
                        // remove the style
                        return update({ style: '' });
                    }
                    update({ style: `${PREFIX}${gradient}` });
                }}
                clearable={false}
            />
            <Button
                accessibleWhenDisabled
                className="reset-button"
                onClick={() => {
                    onChange(removeFormat(value, name))
                    onClose();
                }}
                variant="tertiary"
                __next40pxDefaultSize
            >
                {__('Clear', 'blablablocks-formats')}
            </Button>
        </Popover>
    );
}

export default InlineUI;
