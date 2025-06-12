/**
 * BlaBlaBlocks: Infotip web component
 */
class BlaBlaBlocksInfotip extends HTMLElement {
	static get observedAttributes() {
		return [
			'content',
			'underline',
			'icon-enabled',
			'icon-position',
			'icon-color',
			'icon-type',
		];
	}

	connectedCallback() {
		const template = this.renderElement();
		this.attachShadow( { mode: 'open' } );
		this.shadowRoot.appendChild( template.content.cloneNode( true ) );

		// Add this section to handle initial icon state
		const iconEnabled = this.getAttribute( 'icon-enabled' ) === 'true';
		if ( iconEnabled ) {
			const icon = this.shadowRoot.querySelector( '.icon' );
			icon.innerHTML = this.renderIcon();
		}
		requestAnimationFrame( () => {
			// Wait for the element to be attached to the DOM.
			this.initializeFloatingUI();
			this.initializeEventListeners();
		} );
	}

	initializeFloatingUI() {
		this.updatePosition();
	}

	updatePosition() {
		const floatingUIDOM = window.FloatingUIDOM;
		const anchorText = this.shadowRoot.querySelector( '.text' );
		const infotip = this.shadowRoot.querySelector( '.infotip' );
		const arrow = infotip.querySelector( '.arrow' );

		floatingUIDOM
			.computePosition( anchorText, infotip, {
				placement: 'top',
				strategy: 'fixed',
				middleware: [
					floatingUIDOM.offset( 6 ),
					floatingUIDOM.flip(),
					floatingUIDOM.shift( { padding: 5 } ),
					floatingUIDOM.arrow( { element: arrow } ),
				],
			} )
			.then( ( { x, y, placement, middlewareData } ) => {
				Object.assign( infotip.style, {
					left: `${ x }px`,
					top: `${ y }px`,
				} );

				const { x: arrowX, y: arrowY } = middlewareData.arrow;

				const staticSide = {
					top: 'bottom',
					right: 'left',
					bottom: 'top',
					left: 'right',
				}[ placement.split( '-' )[ 0 ] ];

				Object.assign( arrow.style, {
					left: arrowX !== null ? `${ arrowX }px` : '',
					top: arrowY !== null ? `${ arrowY }px` : '',
					right: '',
					bottom: '',
					[ staticSide ]: '-4px',
				} );
			} );
	}

	showTooltip() {
		this.shadowRoot.querySelector( '.infotip' ).style.display = 'block';
		this.updatePosition();
	}

	hideTooltip() {
		this.shadowRoot.querySelector( '.infotip' ).style.display = 'none';
	}

	initializeEventListeners() {
		[
			[ 'mouseenter', this.showTooltip.bind( this ) ],
			[ 'mouseleave', this.hideTooltip.bind( this ) ],
			[ 'focus', this.showTooltip.bind( this ) ],
			[ 'blur', this.hideTooltip.bind( this ) ],
		].forEach( ( [ event, listener ] ) => {
			this.addEventListener( event, listener );
		} );
	}

	renderStyle() {
		const showUnderline = this.getAttribute( 'underline' ) !== 'false';
		const iconEnabled = this.getAttribute( 'icon-enabled' ) === 'true';
		const iconPosition = this.getAttribute( 'icon-position' ) ?? 'left';
		const iconColor = this.getAttribute( 'icon-color' ) ?? 'currentColor';

		let style = `
			.wrapper {
				position: relative;
			}
			.text {
				text-decoration: ${ showUnderline ? 'dotted underline' : 'none' };
				cursor: pointer;
				display: inline-flex;
				align-items: flex-end;
				vertical-align: bottom;
				gap: 4px;
				flex-direction: ${ iconPosition === 'right' ? 'row-reverse' : 'row' };
			}
			.infotip {
				display: none;
				max-width: 300px;
				position: fixed;
				top: 0px;
				left: 0px;
				background: #222;
				color: white;
				padding: 10px;
				border-radius: 4px;
				font-size: 90%;
			}
			.infotip .arrow {
				position: absolute;
				background: #222;
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

	renderIcon() {
		const iconType = this.getAttribute( 'icon-type' ) ?? 'info';
		const iconPaths = {
			info: `<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M5.5 12a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0ZM12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm.75 4v1.5h-1.5V8h1.5Zm0 8v-5h-1.5v5h1.5Z"
					/>`,
			help: ``,
			caution: ``,
			error: ``,
			notAllowed: ``,
			starEmpty: ``,
		};
		return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				${ iconPaths[ iconType ] }
				</svg>`;
	}

	renderElement() {
		const content = this.getAttribute( 'content' );
		const template = document.createElement( 'template' );
		template.innerHTML = `
			<style>
				${ this.renderStyle() }
			</style>
			<span class="wrapper">
			<span class="text" tabindex="0" aria-describedby="infotip">
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

	attributeChangedCallback( name, oldValue, newValue ) {
		const shadow = this.shadowRoot;
		if ( ! shadow ) {
			return;
		}

		if ( name === 'content' ) {
			const infotip = shadow.querySelector( '.infotip-popover-content' );
			infotip.innerHTML = newValue;

			this.updatePosition();
		}

		if ( name === 'icon-enabled' ) {
			const icon = shadow.querySelector( '.icon' );

			if ( newValue === 'true' ) {
				icon.innerHTML = this.renderIcon();
			} else {
				icon.innerHTML = '';
			}

			this.updatePosition();
		}

		const style = shadow.querySelector( 'style' );
		style.textContent = this.renderStyle();
		this.showTooltip();
	}
}

window.BlaBlaBlocksInfotip = BlaBlaBlocksInfotip;

if ( ! window.customElements.get( 'blablablocks-infotip' ) ) {
	window.customElements.define( 'blablablocks-infotip', BlaBlaBlocksInfotip );
}
