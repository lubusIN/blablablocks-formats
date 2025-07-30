/**
 * Tatva: Infotip web component
 */
class TatvaInfotip extends HTMLElement {
	static get observedAttributes() {
		return [
			'content',
			'underline',
			'icon-enabled',
			'icon-position',
			'icon-color',
			'icon-type',
			'offset',
			'overlay-placement',
			'overlay-text-color',
			'overlay-background-color',
		];
	}

	static ICONS = {
		info: `<path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 12a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0ZM12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm.75 4v1.5h-1.5V8h1.5Zm0 8v-5h-1.5v5h1.5Z"/>`,
		help: `<path d="M12 4.75a7.25 7.25 0 100 14.5 7.25 7.25 0 000-14.5zM3.25 12a8.75 8.75 0 1117.5 0 8.75 8.75 0 01-17.5 0zM12 8.75a1.5 1.5 0 01.167 2.99c-.465.052-.917.44-.917 1.01V14h1.5v-.845A3 3 0 109 10.25h1.5a1.5 1.5 0 011.5-1.5zM11.25 15v1.5h1.5V15h-1.5z"/>`,
		caution: `<path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 12a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0ZM12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm-.75 12v-1.5h1.5V16h-1.5Zm0-8v5h1.5V8h-1.5Z"/>`,
		error: `<path fill-rule="evenodd" clip-rule="evenodd" d="M12.218 5.377a.25.25 0 0 0-.436 0l-7.29 12.96a.25.25 0 0 0 .218.373h14.58a.25.25 0 0 0 .218-.372l-7.29-12.96Zm-1.743-.735c.669-1.19 2.381-1.19 3.05 0l7.29 12.96a1.75 1.75 0 0 1-1.525 2.608H4.71a1.75 1.75 0 0 1-1.525-2.608l7.29-12.96ZM12.75 17.46h-1.5v-1.5h1.5v1.5Zm-1.5-3h1.5v-5h-1.5v5Z"/>`,
		notAllowed: `<path fill-rule="evenodd" clip-rule="evenodd" d="M12 18.5A6.5 6.5 0 0 1 6.93 7.931l9.139 9.138A6.473 6.473 0 0 1 12 18.5Zm5.123-2.498a6.5 6.5 0 0 0-9.124-9.124l9.124 9.124ZM4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0Z"/>`,
		starEmpty: `<path fill-rule="evenodd" d="M9.706 8.646a.25.25 0 01-.188.137l-4.626.672a.25.25 0 00-.139.427l3.348 3.262a.25.25 0 01.072.222l-.79 4.607a.25.25 0 00.362.264l4.138-2.176a.25.25 0 01.233 0l4.137 2.175a.25.25 0 00.363-.263l-.79-4.607a.25.25 0 01.072-.222l3.347-3.262a.25.25 0 00-.139-.427l-4.626-.672a.25.25 0 01-.188-.137l-2.069-4.192a.25.25 0 00-.448 0L9.706 8.646zM12 7.39l-.948 1.921a1.75 1.75 0 01-1.317.957l-2.12.308 1.534 1.495c.412.402.6.982.503 1.55l-.362 2.11 1.896-.997a1.75 1.75 0 011.629 0l1.895.997-.362-2.11a1.75 1.75 0 01.504-1.55l1.533-1.495-2.12-.308a1.75 1.75 0 01-1.317-.957L12 7.39z" clip-rule="evenodd"/>`,
	};

	connectedCallback() {
		this.attachShadow( { mode: 'open' } );
		this.shadowRoot.innerHTML = this.getTemplate();

		requestAnimationFrame( () => {
			this.updateIcon();
			this.updatePosition();
			this.initEvents();
			this.hideTooltip();
		} );

		const slot = this.shadowRoot.querySelector( 'slot' );
		slot.addEventListener( 'slotchange', () => {
			// gather all assigned nodes
			const nodes = slot.assignedNodes( { flatten: true } );
			// check if there’s any non‑empty text left
			const hasText = nodes.some(
				( node ) =>
					node.nodeType === Node.TEXT_NODE &&
					node.textContent.trim() !== ''
			);
			if ( ! hasText ) this.remove();
		} );
	}

	// Renders the main template for the component
	getTemplate() {
		const content = this.getAttribute( 'content' );
		return `
			<style>
				${ this.getStyles() }
			</style>
			<span class="wrapper">
				<span class="text" tabindex="0" role="button" aria-describedby="infotip-popover">
					<span class="icon"></span>
					<slot></slot>
				</span>
				<div class="infotip" id="infotip-popover">
					<div class="infotip-popover-content">
						${ content }
					</div>
					<div class="arrow"></div>
				</div>
			</span>
		`;
	}

	// Updates the icon based on current attributes
	updateIcon() {
		const iconEnabled = this.getAttribute( 'icon-enabled' ) === 'true';
		const iconType = this.getAttribute( 'icon-type' ) || 'info';
		const icon = this.shadowRoot.querySelector( '.icon' );

		if ( ! icon ) return;

		icon.innerHTML = iconEnabled
			? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" role="img">
				${ TatvaInfotip.ICONS[ iconType ] || TatvaInfotip.ICONS.info }
			</svg>`
			: '';
	}

	// Updates the infotip overlay position using FloatingUIDOM
	updatePosition() {
		const content = this.getAttribute( 'content' );
		const floatingUI = window.FloatingUIDOM;
		if ( ! content || ! floatingUI ) {
			this.hideTooltip();
			return;
		}

		const anchor = this.shadowRoot.querySelector( '.text' );
		const tooltip = this.shadowRoot.querySelector( '.infotip' );
		const arrow = tooltip.querySelector( '.arrow' );

		const rawPlacement = this.getAttribute( 'overlay-placement' ) || 'top';
		const offset = parseInt( this.getAttribute( 'offset' ) || '6', 10 );

		const middleware = [
			floatingUI.flip( {
				fallbackPlacements: [
					'top-start',
					'top',
					'top-end',
					'right-start',
					'right',
					'right-end',
					'bottom-start',
					'bottom',
					'bottom-end',
					'left-start',
					'left',
					'left-end',
				],
			} ),
			floatingUI.shift( { padding: 5 } ),
			floatingUI.arrow( { element: arrow, padding: 5 } ),
		];

		floatingUI
			.computePosition( anchor, tooltip, {
				placement: rawPlacement,
				strategy: 'fixed',
				middleware,
			} )
			.then( ( { placement } ) => {
				const { x, y } = this.calculateTooltipPosition(
					placement,
					anchor,
					tooltip,
					arrow,
					offset
				);
				this.applyTooltipStyles( tooltip, x, y );

				const { mainProp, pinProp, center } =
					this.calculateArrowPosition(
						placement,
						anchor,
						tooltip,
						arrow,
						x,
						y
					);
				this.applyArrowStyles( arrow, mainProp, pinProp, center );
			} );
	}

	calculateTooltipPosition( placement, anchor, tooltip, arrow, offset ) {
		const [ base, align ] = placement.split( '-' );
		const ref = anchor.getBoundingClientRect();
		const tip = tooltip.getBoundingClientRect();
		const arrowGap = ( ( arrow.offsetWidth || 8 ) * Math.SQRT2 ) / 2;

		let x = 0,
			y = 0;

		if ( [ 'top', 'bottom' ].includes( base ) ) {
			if ( align === 'start' ) {
				x = ref.left;
			} else if ( align === 'end' ) {
				x = ref.right - tip.width;
			} else {
				x = ref.left + ( ref.width - tip.width ) / 2;
			}

			if ( base === 'top' ) {
				y = ref.top - tip.height - arrowGap - offset;
			} else {
				y = ref.bottom + arrowGap + offset;
			}
		} else {
			if ( align === 'start' ) {
				y = ref.top;
			} else if ( align === 'end' ) {
				y = ref.bottom - tip.height;
			} else {
				y = ref.top + ( ref.height - tip.height ) / 2;
			}

			if ( base === 'left' ) {
				x = ref.left - tip.width - arrowGap - offset;
			} else {
				x = ref.right + arrowGap + offset;
			}
		}

		// Clamp within viewport
		const vw = window.innerWidth,
			vh = window.innerHeight;
		x = Math.min( Math.max( 0, x ), vw - tip.width );
		y = Math.min( Math.max( 0, y ), vh - tip.height );

		return { x, y };
	}

	applyTooltipStyles( tooltip, x, y ) {
		Object.assign( tooltip.style, {
			left: `${ x }px`,
			top: `${ y }px`,
		} );
	}

	calculateArrowPosition(
		placement,
		anchor,
		tooltip,
		arrow,
		tooltipX,
		tooltipY
	) {
		const ref = anchor.getBoundingClientRect();
		const arrowSize = ( arrow.offsetWidth || 8 ) / 2;
		const side = placement.split( '-' )[ 0 ];
		const isHorizontal = [ 'top', 'bottom' ].includes( side );

		const center =
			( isHorizontal
				? ref.left + ref.width / 2 - tooltipX
				: ref.top + ref.height / 2 - tooltipY ) - arrowSize;

		const mainProp = isHorizontal ? 'left' : 'top';
		const pinProp = {
			top: 'bottom',
			bottom: 'top',
			left: 'right',
			right: 'left',
		}[ side ];

		return { mainProp, pinProp, center };
	}

	applyArrowStyles( arrow, mainProp, pinProp, center ) {
		Object.assign( arrow.style, {
			top: '',
			right: '',
			bottom: '',
			left: '',
			[ mainProp ]: `${ center }px`,
			[ pinProp ]: '-4px',
		} );
	}

	showTooltip() {
		this.shadowRoot.querySelector( '.infotip' ).style.display = 'block';
		this.updatePosition();
	}

	hideTooltip() {
		this.shadowRoot.querySelector( '.infotip' ).style.display = 'none';
	}

	// Sets up mouse and keyboard event listeners for showing/hiding the tooltip
	initEvents() {
		const events = [
			[ 'mouseenter', this.showTooltip ],
			[ 'mouseleave', this.hideTooltip ],
			[ 'focus', this.showTooltip ],
			[ 'blur', this.hideTooltip ],
		];
		events.forEach( ( [ event, handler ] ) => {
			this.addEventListener( event, handler.bind( this ) );
		} );
	}

	// Generates the component's CSS based on current attributes
	getStyles() {
		const underline = this.getAttribute( 'underline' );
		const iconEnabled = this.getAttribute( 'icon-enabled' ) === 'true';
		const iconPosition = this.getAttribute( 'icon-position' ) || 'left';
		const iconColor = this.getAttribute( 'icon-color' ) || 'currentColor';
		const textColor =
			this.getAttribute( 'overlay-text-color' ) || '#FFFFFF';
		const bgColor =
			this.getAttribute( 'overlay-background-color' ) || '#222';

		let css = `
			.wrapper {
				position: relative;
			}
			.text {
				text-decoration: ${ underline ? 'dotted underline' : 'none' };
				cursor: pointer;
				display: inline-flex;
				vertical-align: bottom;
				gap: 2px;
				flex-direction: ${ iconPosition === 'right' ? 'row-reverse' : 'row' };
			}
			.infotip {
				display: none;
				max-width: 300px;
				position: fixed;
				top: 0px;
				left: 0px;
				background: ${ bgColor };
				color: ${ textColor };
				padding: 10px;
				border-radius: 4px;
				font-size: 70%;
			}
			.infotip .arrow {
				position: absolute;
				background: ${ bgColor };
				width: 8px;
				height: 8px;
				transform: rotate(45deg);
			}
		`;

		if ( iconEnabled ) {
			css += `
				.icon {
					display: inline-flex;
					align-items: center;
				}
				.icon svg {
					width: 24px;
					height: 24px;
					fill: ${ iconColor };
				}
			`;
		}
		return css;
	}

	// Handles attribute changes and updates the component accordingly
	attributeChangedCallback( name, oldValue, newValue ) {
		if ( ! this.shadowRoot || oldValue === newValue ) return;

		this.showTooltip();

		const updateActions = {
			content: () => {
				this.shadowRoot.querySelector(
					'.infotip-popover-content'
				).innerHTML = newValue;
				this.updatePosition();
			},
			'icon-enabled': () => this.updateIcon(),
			'icon-type': () => this.updateIcon(),
			'overlay-placement': () => this.updatePosition(),
			offset: () => this.updatePosition(),
		};

		if ( updateActions[ name ] ) {
			updateActions[ name ]();
		}

		// Always update styles
		this.shadowRoot.querySelector( 'style' ).textContent = this.getStyles();
	}
}

window.TatvaInfotip = TatvaInfotip;

if ( ! window.customElements.get( 'tatva-infotip' ) ) {
	window.customElements.define( 'tatva-infotip', TatvaInfotip );
}
