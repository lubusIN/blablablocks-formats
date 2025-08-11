/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { removeFormat, useAnchor } from '@wordpress/rich-text';
import {
    Button,
    Popover,
    RangeControl,
    ToggleControl,
    __experimentalVStack as VStack,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { createFormatHelpers } from '../utils';

/**
 * InlineUI component for handling number counter formatting options.
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
    const name = 'blablablocks/number-counter'; // Format type name

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

    const currentAnim = activeAttributes?.['data-anim'] || 'linear';
    const currentDuration = parseInt(activeAttributes?.['data-duration'] || '1200', 10);
    const currentOnScroll =
        (activeAttributes?.['data-on-scroll'] ?? 'true').toString() !== 'false';

    return (
        <Popover
            anchor={anchor}
            className="block-editor-format-toolbar__blablablocks-number-counter-popover"
            position="middle center"
            onClose={onClose}
            offset={30}
            shift
            __unstableSlotName="__unstable-block-tools-after"
        >
            <VStack spacing={2} align="stretch">
                <ToggleGroupControl
                    label={__('Animation', 'blablablocks-formats')}
                    className={'bbb-animation-toggle'}
                    value={currentAnim}
                    onChange={(anim) => update({ 'data-anim': anim })}
                    isBlock
                    __next40pxDefaultSize
                >
                    <ToggleGroupControlOption
                        value="linear"
                        label={__('Linear', 'blablablocks-formats')}
                    />
                    <ToggleGroupControlOption
                        value="odometer"
                        label={__('Odometer', 'blablablocks-formats')}
                    />
                    <ToggleGroupControlOption
                        value="steps"
                        label={__('Steps', 'blablablocks-formats')}
                    />
                    <ToggleGroupControlOption
                        value="scramble"
                        label={__('Scramble', 'blablablocks-formats')}
                    />
                </ToggleGroupControl>
                <RangeControl
                    label={__('Speed (ms)', 'blablablocks-formats')}
                    value={currentDuration}
                    onChange={(duration) => update({ 'data-duration': String(duration) })}
                    min={300}
                    max={20000}
                    step={100}
                />
                <ToggleControl
                    label={__('Start when scrolled into view', 'blablablocks-formats')}
                    checked={currentOnScroll}
                    onChange={(checked) => update({ 'data-on-scroll': checked ? 'true' : 'false' })}
                    help={
                        currentOnScroll
                            ? __('Animate when this number enters the viewport.', 'blablablocks-formats')
                            : __('Animate immediately on load.', 'blablablocks-formats')
                    }
                />
            </VStack>
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