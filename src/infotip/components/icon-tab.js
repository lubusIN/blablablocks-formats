/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { PanelColorSettings } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import {
    Button,
    ToggleControl,
    __experimentalToggleGroupControl as ToggleGroupControl,                     // eslint-disable-line
    __experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon, // eslint-disable-line
    __experimentalGrid as Grid,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { ICONS } from '../../constants';
import { justifyLeft, justifyRight } from '@wordpress/icons';

/**
 * IconTab component for the Icon tab in the Infotip format.
 * 
 * @param {Object} props                    - The component properties.
 * @param {Object} props.activeAttributes   - The currently active attributes.
 * @param {Function} props.updateAttributes - Function to update the attributes.
 * @param {Function} props.removeAttributes - Function to remove attributes.
 * @returns {JSX.Element} - The rendered IconTab component.
 */
function IconTab({
    activeAttributes,
    updateAttributes,
    removeAttributes,
}) {
    const { selectedBlock, colors } = useSelect((select) => {
        const editor = select('core/block-editor');
        return {
            selectedBlock: editor.getSelectedBlock(),
            colors: (editor.getSettings() || {}).colors || [],
        };
    }, []);

    const blockStyle = selectedBlock?.attributes?.style || {};
    const explicitTextColor = blockStyle?.color?.text;
    const textColorSlug = selectedBlock?.attributes?.textColor;
    const slugColor =
        textColorSlug &&
        colors.find((c) => c.slug === textColorSlug)?.color;
    const defaultIconColor = explicitTextColor || slugColor;

    const isIconEnabled = activeAttributes['icon-enabled'] === 'true';

    const resetIcon = () => removeAttributes(['icon-enabled', 'icon-position', 'icon-color', 'icon-type']);

    const handleToggleIcon = () => {
        if (isIconEnabled) {
            resetIcon();
        } else {
            updateAttributes({ 'icon-enabled': 'true' });
        }
    };

    // Show the info icon enabled as a default when no icon type is set, and icons are just enabled.
    if (isIconEnabled && !activeAttributes['icon-type']) {
        updateAttributes({ 'icon-type': 'info' });
    }

    return (
        <>
            <Grid columns={2} templateColumns="3fr 7fr" alignment="center">
                <div className="icon-tab-label">
                    {__('Enable', 'blablablocks-formats')}
                </div>
                <ToggleControl __nextHasNoMarginBottom checked={isIconEnabled} onChange={handleToggleIcon} />

                {isIconEnabled && (
                    <>
                        <div className="icon-tab-label">
                            {__('Type', 'blablablocks-formats')}
                        </div>
                        <div>
                            {ICONS.map((icon) => (
                                <Button
                                    accessibleWhenDisabled
                                    key={icon.id}
                                    icon={icon.graphic}
                                    isPressed={
                                        activeAttributes['icon-type'] === icon.id
                                    }
                                    onClick={() => updateAttributes({ 'icon-type': icon.id })}
                                />
                            ))}
                        </div>

                        <div className="icon-tab-label">
                            {__('Position', 'blablablocks-formats')}
                        </div>
                        <ToggleGroupControl
                            __nextHasNoMarginBottom
                            __next40pxDefaultSize
                            hideLabelFromVision
                            label={__('Position', 'blablablocks-formats')}
                            value={activeAttributes['icon-position'] || 'left'}
                            onChange={(value) => updateAttributes({ 'icon-position': value })}
                        >
                            <ToggleGroupControlOptionIcon
                                aria-label={__(
                                    'Left icon position',
                                    'blablablocks-formats'
                                )}
                                label={__('Left', 'blablablocks-formats')}
                                icon={justifyLeft}
                                value="left"
                            />
                            <ToggleGroupControlOptionIcon
                                aria-label={__(
                                    'Right icon position',
                                    'blablablocks-formats'
                                )}
                                label={__('Right', 'blablablocks-formats')}
                                icon={justifyRight}
                                value="right"
                            />
                        </ToggleGroupControl>

                        <div className="icon-tab-label">
                            {__('Color', 'blablablocks-formats')}
                        </div>
                        <PanelColorSettings
                            label={__('Color', 'blablablocks-formats')}
                            className="icon-color-settings"
                            colorSettings={[
                                {
                                    label: __('Icon', 'blablablocks-formats'),
                                    value: activeAttributes['icon-color'] || defaultIconColor,
                                    onChange: (value) => updateAttributes({ 'icon-color': value || defaultIconColor }),
                                },
                            ]}
                        />
                    </>
                )}
            </Grid>
            <Button
                accessibleWhenDisabled
                className="reset-button"
                disabled={!isIconEnabled}
                onClick={resetIcon}
                variant="tertiary"
                __next40pxDefaultSize
            >
                {__('Clear', 'blablablocks-formats')}
            </Button>
        </>
    );
}

export default IconTab;
