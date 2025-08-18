/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';
import { dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import CounterIcon from './icon';
import InlineUI from './inline-ui';

/**
 * Edit component for the Counter format.
 * 
 * @param {Object}   props                  - The component properties.
 * @param {Object}   props.value            - The current value of the rich text.
 * @param {Function} props.onChange         - Function to update the rich text value.
 * @param {Function} props.onFocus          - Function to handle focus events.
 * @param {boolean}  props.isActive         - Indicates if the format is currently active.
 * @param {Object}   props.contentRef       - Reference to the editable content element.
 * @param {Object}   props.activeAttributes - The currently active attributes.
 * @returns {JSX.Element} The rendered component.
 */
export function Edit({
    value,
    onChange,
    onFocus,
    isActive,
    contentRef,
    activeAttributes,
}) {
    const [isSettingOpen, setIsSettingOpen] = useState(false);

    const isNumeric = (str) => /^[+-]?(\d+(\.\d+)?|\.\d+)$/.test(String(str).trim());

    const onToggle = () => {
        const { start, end, text } = value;
        const selected = text.slice(start, end);

        if (!selected) {
            dispatch('core/notices').createNotice(
                'warning',
                __('Select a number to animate.', 'blablablocks-formats'),
                { type: 'snackbar' }
            );
            return;
        }

        if (!isNumeric(selected)) {
            dispatch('core/notices').createNotice(
                'warning',
                __('Selection must be a number (e.g. 1500 or 12.5).', 'blablablocks-formats'),
                { type: 'snackbar' }
            );
            return;
        }

        setIsSettingOpen(true);
    };

    return (
        <>
            <RichTextToolbarButton
                icon={<CounterIcon />}
                title={__('Counter', 'blablablocks-formats')}
                onClick={onToggle}
                isActive={isActive}
            />

            {isSettingOpen && (
                <InlineUI
                    activeAttributes={activeAttributes}
                    onClose={() => setIsSettingOpen(false)}
                    contentRef={contentRef.current}
                    isActive={isActive}
                    value={value}
                    onChange={onChange}
                    onFocus={onFocus}
                />
            )}
        </ >
    );
}
