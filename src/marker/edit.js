/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { RichTextToolbarButton } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import MarkerIcon from '../../assets/images/marker';
import InlineUI from './inline-ui';

/**
 * Edit component for the Marker format in the block editor.
 *
 * @param {Object} props - The component properties.
 * @return {JSX.Element} The rendered component.
 */
export function Edit(props) {
    const { value, onChange, isActive, contentRef, activeAttributes } = props;
    const [isSettingOpen, setIsSettingOpen] = useState(false);

    return (
        <>
            <RichTextToolbarButton
                icon={<MarkerIcon />}
                title={__('Marker', 'blablablocks-formats')}
                onClick={() => setIsSettingOpen(true)}
                isActive={isActive}
            />

            {isSettingOpen && (
                <InlineUI
                    value={value}
                    onChange={onChange}
                    onClose={() => setIsSettingOpen(false)}
                    activeAttributes={activeAttributes}
                    contentRef={contentRef.current}
                    isActive={isActive}
                />
            )}
        </>
    );
}