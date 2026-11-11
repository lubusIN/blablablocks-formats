/**
 * Vendor dependencies
 */
import * as FloatingUIDOM from '@floating-ui/dom';

// Expose FloatingUIDOM globally for TatvaInfotip positioning.
if ( typeof window !== 'undefined' && ! window.FloatingUIDOM ) {
	window.FloatingUIDOM = FloatingUIDOM;
}

/**
 * External dependencies
 */
import '@lubusin/tatva/tatva-infotip.js';
