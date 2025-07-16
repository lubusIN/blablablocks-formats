/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
    Button,
    FormToggle,
    SelectControl,
    __experimentalGrid as Grid, 				  // eslint-disable-line
    __experimentalNumberControl as NumberControl, // eslint-disable-line
} from '@wordpress/components';

/**
 * AnimationTab component for managing animation settings tab.
 *
 * @param {Object}   props                  - The component properties.
 * @param {Object}   props.activeAttributes - The currently active format attributes.
 * @param {Function} props.updateAttributes - Function to update the attributes.
 * @param {Function} props.removeAttributes - Function to remove attributes.
 * @return {JSX.Element} - The rendered component.
 */
function AnimationTab({
    activeAttributes,
    updateAttributes,
    removeAttributes,
}) {
    const enabled = activeAttributes.animation !== 'false';
    const hasCustomAnimationSetting = Object.keys(activeAttributes).some(
        (key) => key.includes('animation')
    );

    return (
        <>
            <Grid
                columns={2}
                rows={3}
                templateColumns="3fr 7fr"
                alignment="center"
                className="block-editor-format-toolbar__blablablocks-marker-animation-tab"
            >
                { /* row 1 - Animation enable */}
                <span className="animation-tab-label">
                    {__('Enabled', 'blablablocks-formats')}
                </span>
                <FormToggle
                    checked={enabled}
                    onChange={() => !enabled ? removeAttributes(['animation']) : updateAttributes({ animation: 'false' })}
                    label={__('Enable Animation', 'blablablocks-formats')}
                />

                { /* row 2 - Animation duration  */}
                <span className="animation-tab-label">
                    {__('Duration (seconds)', 'blablablocks-formats')}
                </span>
                <NumberControl
                    disabled={!enabled}
                    value={activeAttributes['animation-duration'] ?? '5'}
                    min={1}
                    max={10}
                    step={0.5}
                    onChange={(newValue) => updateAttributes({ 'animation-duration': newValue })}
                    label={__('Duration', 'blablablocks-formats')}
                    hideLabelFromVision
                    __next40pxDefaultSize
                    style={{ justifySelf: 'start' }}
                />

                { /* row 3 - Animation timing function  */}
                <span className="animation-tab-label">
                    {__('Type', 'blablablocks-formats')}
                </span>
                <SelectControl
                    disabled={!enabled}
                    label={__('Type', 'blablablocks-formats')}
                    value={activeAttributes['animation-function'] ?? 'linear'}
                    options={[
                        {
                            label: __('Linear', 'blablablocks-formats'),
                            value: 'linear',
                        },
                        {
                            label: __('Ease', 'blablablocks-formats'),
                            value: 'ease',
                        },
                        {
                            label: __('Ease In', 'blablablocks-formats'),
                            value: 'ease-in',
                        },
                        {
                            label: __('Ease Out', 'blablablocks-formats'),
                            value: 'ease-out',
                        },
                        {
                            label: __('Ease In Out', 'blablablocks-formats'),
                            value: 'ease-in-out',
                        },
                        {
                            label: __('3 Steps', 'blablablocks-formats'),
                            value: 'steps(3, start)',
                        },
                        {
                            label: __('5 Steps', 'blablablocks-formats'),
                            value: 'steps(5, end)',
                        },
                    ]}
                    hideLabelFromVision
                    __next40pxDefaultSize
                    __nextHasNoMarginBottom
                    onChange={(newValue) => updateAttributes({ 'animation-function': newValue })}
                />
            </Grid>
            <Button
                className="reset-button"
                disabled={!hasCustomAnimationSetting}
                onClick={() =>
                    removeAttributes([
                        'animation',
                        'animation-duration',
                        'animation-function',
                    ])
                }
                variant="tertiary"
            >
                {__('Clear', 'blablablocks-formats')}
            </Button>
        </>
    );
}

export default AnimationTab;