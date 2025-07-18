/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { PanelColorSettings } from '@wordpress/block-editor';
import {
    Button,
    SelectControl,
    __experimentalNumberControl as NumberControl, // eslint-disable-line
    __experimentalGrid as Grid,                   // eslint-disable-line
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { PLACEMENT_OPTIONS } from '../../constant';

/**
 * OverlayTab component for the Overlay tab in the Infotip format.
 * 
 * @param {Object} props                    - The component properties.
 * @param {Object} props.activeAttributes   - The currently active attributes.
 * @param {Function} props.updateAttributes - Function to update the attributes.
 * @param {Function} props.removeAttributes - Function to remove attributes.
 * @returns {JSX.Element} - The rendered OverlayTab component.
 */
function OverlayTab({
    activeAttributes,
    updateAttributes,
    removeAttributes,
}) {
    const overLaySettingsEnabled =
        activeAttributes['overlay-placement'] ||
        activeAttributes['overlay-background-color'] ||
        activeAttributes['overlay-text-color'] ||
        activeAttributes.offset;

    const handleColorChange = (type, newColor) => {
        updateAttributes({
            [type]:
                newColor ||
                (type === 'overlay-background-color' ? '#222222' : '#FFFFFF'),
        });
    };

    const handleReset = () => {
        removeAttributes([
            'overlay-placement',
            'overlay-background-color',
            'overlay-text-color',
            'offset',
        ]);
    };

    return (
        <>
            <Grid columns={2} templateColumns="3fr 7fr" alignment="center">
                <div className="overlay-tab-label">
                    {__('Offset', 'blablablocks-formats')}
                </div>
                <NumberControl
                    hideLabelFromVision
                    label={__('Offset', 'blablablocks-formats')}
                    value={activeAttributes.offset || 6}
                    __next40pxDefaultSize
                    onChange={(value) => updateAttributes({ offset: value || 6 })}
                    style={{ width: '5rem' }}
                    min={6}
                    max={20}
                />

                <div className="overlay-tab-label">
                    {__('Placement', 'blablablocks-formats')}
                </div>
                <SelectControl
                    label={__('Placement', 'blablablocks-formats')}
                    hideLabelFromVision
                    __next40pxDefaultSize
                    __nextHasNoMarginBottom
                    value={activeAttributes['overlay-placement'] || 'top'}
                    options={PLACEMENT_OPTIONS}
                    onChange={(selectedOption) => updateAttributes({ 'overlay-placement': selectedOption })}
                    onClick={(event) => event.stopPropagation()}
                />

                <div className="overlay-tab-label">
                    {__('Color', 'blablablocks-formats')}
                </div>
                <PanelColorSettings
                    className="overlay-color-settings"
                    label={__('Color', 'blablablocks-formats')}
                    colorSettings={[
                        {
                            label: __('Background', 'blablablocks-formats'),
                            value:
                                activeAttributes[
                                'overlay-background-color'
                                ] || '#222222',
                            onChange: (newColor) =>
                                handleColorChange(
                                    'overlay-background-color',
                                    newColor
                                ),
                        },
                        {
                            label: __('Text', 'blablablocks-formats'),
                            value:
                                activeAttributes['overlay-text-color'] ||
                                '#FFFFFF',
                            onChange: (newColor) =>
                                handleColorChange(
                                    'overlay-text-color',
                                    newColor
                                ),
                        },
                    ]}
                />
            </Grid>
            <Button
                accessibleWhenDisabled
                className="reset-button"
                disabled={!overLaySettingsEnabled}
                onClick={handleReset}
                variant="tertiary"
                __next40pxDefaultSize
            >
                {__('Clear', 'blablablocks-formats')}
            </Button>
        </>
    );
}

export default OverlayTab;
