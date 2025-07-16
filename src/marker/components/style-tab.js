/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { removeFormat } from '@wordpress/rich-text';
import {
    Button,
    __experimentalGrid as Grid, // eslint-disable-line
} from '@wordpress/components';

/**
 * Marker style presets
 */
const MARKER_PRESETS = [
    {
        id: 'circle',
        label: __('Circle', 'blablablocks-formats'),
    },
    {
        id: 'curly',
        label: __('Curly', 'blablablocks-formats'),
    },
    {
        id: 'underline',
        label: __('Underline', 'blablablocks-formats'),
    },
    {
        id: 'double',
        label: __('Double', 'blablablocks-formats'),
    },
    {
        id: 'double-underline',
        label: __('Double Underline', 'blablablocks-formats'),
    },
    {
        id: 'underline-zigzag',
        label: __('Underline Zigzag', 'blablablocks-formats'),
    },
    {
        id: 'strikethrough',
        label: __('Strikethrough', 'blablablocks-formats'),
    },
    {
        id: 'cross',
        label: __('Cross', 'blablablocks-formats'),
    },
    {
        id: 'strike',
        label: __('Strike', 'blablablocks-formats'),
    },
];

/**
 * StyleTab component for managing marker style selection.
 *
 * @param {Object}   props                  - The component properties.
 * @param {Object}   props.activeAttributes - The currently active format attributes.
 * @param {Function} props.onChange         - Callback to update the marker format.
 * @param {Function} props.onClose          - Callback to close the UI.
 * @param {Function} props.updateAttributes - Function to update the attributes.
 * @param {Object}   props.value            - The current rich text value.
 * @return {JSX.Element}                   - The rendered component.
 */
function StyleTab({
    activeAttributes,
    onChange,
    onClose,
    updateAttributes,
    value,
}) {
    const { type, ...attrs } = activeAttributes;

    return (
        <>
            <Grid templateColumns="repeat( 3, minmax( 0, 1fr ) )">
                {MARKER_PRESETS.map(({ id, label }) => (
                    <Button
                        key={id}
                        id={id}
                        onClick={() => updateAttributes({ type: id })}
                        isPressed={type === id}
                        className="block-editor-format-toolbar__blablablocks-marker-button"
                    >
                        <tatva-marker {...attrs} type={id}>
                            {label}
                        </tatva-marker>
                    </Button>
                ))}
            </Grid >
            <Button
                className="reset-button"
                disabled={!type}
                onClick={() => {
                    onChange(removeFormat(value, 'blablablocks/marker'));
                    onClose();
                }}
                variant="tertiary"
            >
                {__('Clear', 'blablablocks-formats')}
            </Button>
        </>
    );
}

export default StyleTab;
