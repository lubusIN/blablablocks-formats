/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { starEmpty } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import InlineUI from './inline-ui';
import { FORMAT_TITLE } from './constants';

/**
 * Edit component for the Rating format.
 *
 * @param {Object}   props                  - Component properties.
 * @param {Object}   props.value            - Current rich text value.
 * @param {Function} props.onChange         - Function to update rich text.
 * @param {boolean}  props.isActive         - Indicates if format is currently active.
 * @param {Object}   props.contentRef       - Reference to editable content element.
 * @param {Object}   props.activeAttributes - Currently active format attributes.
 * @return {JSX.Element} The toolbar button and popover.
 */
export function Edit( {
	value,
	onChange,
	isActive,
	contentRef,
	activeAttributes,
} ) {
	const [ isSettingOpen, setIsSettingOpen ] = useState( false );

	useEffect( () => {
		const cleanupFns = [];

		const handleStarClick = ( event ) => {
			const ratingSpan = event.target?.closest?.( '.has-rating-format' );
			if ( ! ratingSpan ) {
				return;
			}

			const doc = ratingSpan.ownerDocument || document;
			const win = doc.defaultView || window;
			const textNode = ratingSpan.firstChild;
			let isClickOnStars = true;

			if (
				textNode &&
				textNode.nodeType === Node.TEXT_NODE &&
				textNode.textContent.length > 0
			) {
				const textRange = doc.createRange();
				textRange.selectNodeContents( textNode );
				const textRect = textRange.getBoundingClientRect();
				const isRtl =
					win.getComputedStyle( ratingSpan ).direction === 'rtl';

				if ( textRect.width > 0 ) {
					isClickOnStars = isRtl
						? event.clientX > textRect.right
						: event.clientX < textRect.left;
				}
			}

			if ( isClickOnStars ) {
				event.preventDefault();
				event.stopPropagation();

				const editable = ratingSpan.closest(
					'[contenteditable="true"]'
				);
				if ( editable && doc.activeElement !== editable ) {
					editable.focus();
				}

				const range = doc.createRange();
				range.selectNodeContents( ratingSpan );
				const sel = win.getSelection();
				if ( sel ) {
					sel.removeAllRanges();
					sel.addRange( range );
					doc.dispatchEvent( new Event( 'selectionchange' ) );
				}

				setIsSettingOpen( true );
			}
		};

		const attachToDoc = ( doc ) => {
			if ( ! doc || doc.__blablablocksRatingListenerAttached ) {
				return;
			}
			doc.__blablablocksRatingListenerAttached = true;

			doc.addEventListener( 'mousedown', handleStarClick, true );
			doc.addEventListener( 'click', handleStarClick, true );

			cleanupFns.push( () => {
				delete doc.__blablablocksRatingListenerAttached;
				doc.removeEventListener( 'mousedown', handleStarClick, true );
				doc.removeEventListener( 'click', handleStarClick, true );
			} );
		};

		attachToDoc( document );

		const contentDoc = contentRef?.current?.ownerDocument;
		if ( contentDoc ) {
			attachToDoc( contentDoc );
		}

		const iframe = document.querySelector( 'iframe[name="editor-canvas"]' );
		if ( iframe?.contentDocument ) {
			attachToDoc( iframe.contentDocument );
		} else if ( iframe ) {
			const onIframeLoad = () => {
				if ( iframe.contentDocument ) {
					attachToDoc( iframe.contentDocument );
				}
			};
			iframe.addEventListener( 'load', onIframeLoad );
			cleanupFns.push( () => {
				iframe.removeEventListener( 'load', onIframeLoad );
			} );
		}

		return () => {
			cleanupFns.forEach( ( fn ) => fn() );
		};
	}, [ contentRef, value ] );

	return (
		<>
			<RichTextToolbarButton
				icon={ starEmpty }
				title={ FORMAT_TITLE }
				onClick={ () => setIsSettingOpen( true ) }
				isActive={ isActive }
			/>

			{ isSettingOpen && (
				<InlineUI
					value={ value }
					onChange={ onChange }
					onClose={ () => setIsSettingOpen( false ) }
					activeAttributes={ activeAttributes }
					contentRef={ contentRef?.current || contentRef }
					isActive={ isActive }
				/>
			) }
		</>
	);
}
