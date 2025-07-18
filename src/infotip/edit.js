/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { info } from '@wordpress/icons';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './editor.scss';
import './style.scss';
import InlineUI from './inline-ui';

const name = 'blablablocks/infotip';
const title = __('Infotip', 'blablablocks-formats');

/**
 * Edit component for the Infotip format.
 *
 * @param {Object} props - The component properties.
 * @param {Object} props.value - The current value of the rich text.
 * @param {Function} props.onChange - Function to update the rich text value.   
 * @param {Function} props.onFocus - Function to handle focus events.
 * @param {boolean} props.isActive - Indicates if the format is currently active.
 * @param {Object} props.contentRef - Reference to the editable content element.
 * @param {Object} props.activeAttributes - The currently active attributes.
 * @return {JSX.Element} - The rendered infotip button.
 */
export function Edit({ value, onChange, onFocus, isActive, contentRef, activeAttributes }) {
    const [isSettingOpen, setIsSettingOpen] = useState(false);

    useEffect(() => {
        if (!isActive) {
            setIsSettingOpen(false);
        }
    }, [isActive]);

    return (
        <>
            <RichTextToolbarButton
                icon={info}
                title={title}
                onClick={() => setIsSettingOpen(true)}
                isActive={isActive}
            />
            {isSettingOpen && (
                <InlineUI
                    activeAttributes={activeAttributes}
                    onClose={() => setIsSettingOpen(false)}
                    contentRef={contentRef.current}
                    isActive={isActive}
                    value={value}
                    name={name}
                    onChange={onChange}
                    onFocus={onFocus}
                />
            )}
        </>
    );
}