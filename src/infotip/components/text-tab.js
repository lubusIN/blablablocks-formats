/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
    Button,
    ToggleControl,
    TextareaControl,
    __experimentalVStack as VStack, // eslint-disable-line
} from '@wordpress/components';
import { removeFormat } from '@wordpress/rich-text';
import { safeHTML } from '@wordpress/dom';

/**
 * TextTab component for the Text tab in the Infotip format.
 * 
 * @param {Object} props - The component properties.
 * @param {Object} props.activeAttributes - The currently active attributes.
 * @param {string} props.name - The name of the format.
 * @param {Function} props.onChange - Function to handle changes in the text.
 * @param {Function} props.onClose - Function to call when the tab is closed.
 * @param {Function} props.removeAttributes - Function to remove attributes.
 * @param {Function} props.updateAttributes - Function to update attributes.
 * @param {string} props.value - The current value of the text.
 * @return {JSX.Element} - The rendered TextTabContent component.
 */
function TextTab({
    activeAttributes,
    name,
    onChange,
    onClose,
    removeAttributes,
    updateAttributes,
    value,
}) {
    const handleTextChange = (newValue) => {
        const sanitizedValue = safeHTML(newValue);
        updateAttributes({ content: sanitizedValue });
    };

    const handleUnderlineToggle = (enabled) => {
        if (enabled) {
            updateAttributes({ underline: value });
        } else {
            removeAttributes(['underline']);
        }
    };

    const handleClear = () => {
        onChange(removeFormat(value, name));
        onClose?.();
    };

    return (
        <VStack spacing={6}>
            <TextareaControl
                label={__('Text', 'blablablocks-formats')}
                hideLabelFromVision
                onChange={handleTextChange}
                placeholder={__(
                    'Enter the text to display, or click clear to remove the format.',
                    'blablablocks-formats'
                )}
                value={activeAttributes.content}
                __nextHasNoMarginBottom
            />
            <ToggleControl
                id="underline-toggle"
                label={__('Underline anchor text', 'blablablocks-formats')}
                checked={activeAttributes.underline}
                onChange={handleUnderlineToggle}
                __nextHasNoMarginBottom
            />
            <Button
                accessibleWhenDisabled
                className="reset-button"
                onClick={handleClear}
                variant="tertiary"
                __next40pxDefaultSize
            >
                {__('Clear', 'blablablocks-formats')}
            </Button>
        </VStack>
    );
}

export default TextTab;
