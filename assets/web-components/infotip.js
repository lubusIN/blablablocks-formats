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

	connectedCallback() {
		this.attachShadow( { mode: 'open' } );
		this.shadowRoot.appendChild(
			this.renderElement().content.cloneNode( true )
		);
		this.updateIcon();
		requestAnimationFrame( () => {
			this.updatePosition();
			this.initializeEventListeners();
			this.hideTooltip();
		} );
	}

	// Renders the main template for the component
	renderElement() {
		const content = this.getAttribute( 'content' );
		const template = document.createElement( 'template' );
		template.innerHTML = `
			<style>
				${ this.renderStyle() }
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
		return template;
	}

	// Updates the icon based on current attributes
	updateIcon() {
		const iconEnabled = this.getAttribute( 'icon-enabled' ) === 'true';
		const icon = this.shadowRoot.querySelector( '.icon' );
		if ( ! icon ) return;
		icon.innerHTML = iconEnabled
			? this.renderIcon( this.getAttribute( 'icon-type' ) || 'info' )
			: '';
	}

	// Updates the infotip overlay position using FloatingUIDOM
	updatePosition() {
		if ( this.getAttribute( 'content' ) === '' ) {
			this.hideTooltip();
			return;
		}
		const floatingUIDOM = window.FloatingUIDOM;
		const anchorText = this.shadowRoot.querySelector( '.text' );
		const infotip = this.shadowRoot.querySelector( '.infotip' );
		const arrow = infotip.querySelector( '.arrow' );
		const overlayPlacement =
			this.getAttribute( 'overlay-placement' ) ?? 'top';
		const offset = parseInt( this.getAttribute( 'offset' ) ?? 6, 10 );

		floatingUIDOM
			.computePosition( anchorText, infotip, {
				placement: overlayPlacement,
				strategy: 'fixed',
				middleware: [
					floatingUIDOM.offset( offset ),
					floatingUIDOM.flip( {
						fallbackPlacements: [
							'top',
							'right',
							'bottom',
							'left',
						],
					} ),
					floatingUIDOM.shift( { padding: 5 } ),
					floatingUIDOM.arrow( { element: arrow, padding: 5 } ),
				],
			} )
			.then( ( { x, y, placement, middlewareData } ) => {
				Object.assign( infotip.style, {
					left: `${ x }px`,
					top: `${ y }px`,
				} );
				this.positionArrow( arrow, placement, middlewareData.arrow );
			} );
	}

	// Positions the arrow based on placement and middleware data
	positionArrow( arrow, placement, arrowData ) {
		if ( ! arrow || ! arrowData ) return;
		const basePlacement = placement.split( '-' )[ 0 ];
		arrow.style.left = '';
		arrow.style.top = '';
		arrow.style.right = '';
		arrow.style.bottom = '';
		switch ( basePlacement ) {
			case 'top':
				arrow.style.bottom = '-4px';
				arrow.style.left = arrowData.x ? `${ arrowData.x }px` : '';
				break;
			case 'bottom':
				arrow.style.top = '-4px';
				arrow.style.left = arrowData.x ? `${ arrowData.x }px` : '';
				break;
			case 'left':
				arrow.style.right = '-4px';
				arrow.style.top = arrowData.y ? `${ arrowData.y }px` : '';
				break;
			case 'right':
				arrow.style.left = '-4px';
				arrow.style.top = arrowData.y ? `${ arrowData.y }px` : '';
				break;
		}
	}

	showTooltip() {
		this.shadowRoot.querySelector( '.infotip' ).style.display = 'block';
		this.updatePosition();
	}

	hideTooltip() {
		this.shadowRoot.querySelector( '.infotip' ).style.display = 'none';
	}

	// Sets up mouse and keyboard event listeners for showing/hiding the tooltip
	initializeEventListeners() {
		const events = [
			[ 'mouseenter', this.showTooltip.bind( this ) ],
			[ 'mouseleave', this.hideTooltip.bind( this ) ],
			[ 'focus', this.showTooltip.bind( this ) ],
			[ 'blur', this.hideTooltip.bind( this ) ],
		];
		events.forEach( ( [ event, listener ] ) => {
			this.addEventListener( event, listener );
		} );
	}

	// Generates the component's CSS based on current attributes
	renderStyle() {
		const showUnderline = this.getAttribute( 'underline' ) !== 'false';
		const iconEnabled = this.getAttribute( 'icon-enabled' ) === 'true';
		const iconPosition = this.getAttribute( 'icon-position' ) ?? 'left';
		const iconColor = this.getAttribute( 'icon-color' ) ?? 'currentColor';
		const overlayTextColor =
			this.getAttribute( 'overlay-text-color' ) ?? '#FFFFFF';
		const overlayBackgroundColor =
			this.getAttribute( 'overlay-background-color' ) ?? '#222';

		let style = `
			.wrapper {
				position: relative;
			}
			.text {
				text-decoration: ${ showUnderline ? 'dotted underline' : 'none' };
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
				background: ${ overlayBackgroundColor };
				color: ${ overlayTextColor };
				padding: 10px;
				border-radius: 4px;
				font-size: 90%;
			}
			.infotip .arrow {
				position: absolute;
				background: ${ overlayBackgroundColor };
				width: 8px;
				height: 8px;
				transform: rotate(45deg);
			}
		`;

		if ( iconEnabled ) {
			style += `
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
		return style;
	}

	// Returns SVG markup for the given icon type
	renderIcon( iconType = 'info' ) {
		const iconPaths = {
			info: `<path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 12a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0ZM12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm.75 4v1.5h-1.5V8h1.5Zm0 8v-5h-1.5v5h1.5Z"/>`,

			help: `<path d="M12 4.75a7.25 7.25 0 100 14.5 7.25 7.25 0 000-14.5zM3.25 12a8.75 8.75 0 1117.5 0 8.75 8.75 0 01-17.5 0zM12 8.75a1.5 1.5 0 01.167 2.99c-.465.052-.917.44-.917 1.01V14h1.5v-.845A3 3 0 109 10.25h1.5a1.5 1.5 0 011.5-1.5zM11.25 15v1.5h1.5V15h-1.5z"/>`,

			caution: `<path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 12a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0ZM12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm-.75 12v-1.5h1.5V16h-1.5Zm0-8v5h1.5V8h-1.5Z"/>`,

			error: `<path fill-rule="evenodd" clip-rule="evenodd" d="M12.218 5.377a.25.25 0 0 0-.436 0l-7.29 12.96a.25.25 0 0 0 .218.373h14.58a.25.25 0 0 0 .218-.372l-7.29-12.96Zm-1.743-.735c.669-1.19 2.381-1.19 3.05 0l7.29 12.96a1.75 1.75 0 0 1-1.525 2.608H4.71a1.75 1.75 0 0 1-1.525-2.608l7.29-12.96ZM12.75 17.46h-1.5v-1.5h1.5v1.5Zm-1.5-3h1.5v-5h-1.5v5Z"/>`,

			notAllowed: `<path fill-rule="evenodd" clip-rule="evenodd" d="M12 18.5A6.5 6.5 0 0 1 6.93 7.931l9.139 9.138A6.473 6.473 0 0 1 12 18.5Zm5.123-2.498a6.5 6.5 0 0 0-9.124-9.124l9.124 9.124ZM4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0Z"/>`,

			starEmpty: `<path fill-rule="evenodd" d="M9.706 8.646a.25.25 0 01-.188.137l-4.626.672a.25.25 0 00-.139.427l3.348 3.262a.25.25 0 01.072.222l-.79 4.607a.25.25 0 00.362.264l4.138-2.176a.25.25 0 01.233 0l4.137 2.175a.25.25 0 00.363-.263l-.79-4.607a.25.25 0 01.072-.222l3.347-3.262a.25.25 0 00-.139-.427l-4.626-.672a.25.25 0 01-.188-.137l-2.069-4.192a.25.25 0 00-.448 0L9.706 8.646zM12 7.39l-.948 1.921a1.75 1.75 0 01-1.317.957l-2.12.308 1.534 1.495c.412.402.6.982.503 1.55l-.362 2.11 1.896-.997a1.75 1.75 0 011.629 0l1.895.997-.362-2.11a1.75 1.75 0 01.504-1.55l1.533-1.495-2.12-.308a1.75 1.75 0 01-1.317-.957L12 7.39z" clip-rule="evenodd"/>`,
		};
		return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" role="img">
			${ iconPaths[ iconType ] || iconPaths.info }
		</svg>`;
	}

	// Handles attribute changes and updates the component accordingly
	attributeChangedCallback( name, oldValue, newValue ) {
		const shadow = this.shadowRoot;
		if ( ! shadow ) return;

		switch ( name ) {
			case 'content':
				shadow.querySelector( '.infotip-popover-content' ).innerHTML =
					newValue;
				this.updatePosition();
				this.showTooltip();
				break;
			case 'icon-enabled':
			case 'icon-type':
				this.updateIcon();
				this.updatePosition();
				break;
			case 'overlay-text-color':
			case 'overlay-background-color':
				this.showTooltip();
				break;
			case 'offset':
			case 'overlay-placement':
				this.updatePosition();
				this.showTooltip();
				break;
		}
		// Always update styles on attribute change
		shadow.querySelector( 'style' ).textContent = this.renderStyle();
	}
}

window.TatvaInfotip = TatvaInfotip;

if ( ! window.customElements.get( 'tatva-infotip' ) ) {
	window.customElements.define( 'tatva-infotip', TatvaInfotip );
}
