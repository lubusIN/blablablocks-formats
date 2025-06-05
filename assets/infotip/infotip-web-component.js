/**
 * BlaBlaBlocks: Infotip web component
 */
class BlaBlaBlocksInfotip extends HTMLElement {
	static get observedAttributes() {
		return [ 'content', 'underline' ];
	}

	connectedCallback() {
		const template = this.renderElement();
		this.attachShadow( { mode: 'open' } );
		this.shadowRoot.appendChild( template.content.cloneNode( true ) );
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
		const isAdmin = document.body.classList.contains(
			'block-editor-iframe__body'
		);

		const showUnderline = this.getAttribute( 'underline' ) !== 'false';

		const style = `
			.wrapper {
				position: relative;
			}
			.text {
				text-decoration: ${ showUnderline ? 'dotted underline' : 'none' };
				background-color: ${ isAdmin ? '#f0f0f0' : 'transparent' };
				cursor: pointer;
			}
			.infotip {
				display: none;
				max-width: 300px;
				position: fixed;
				top: 0px;
				left: 0px;
				background: #222;
				color: white;
				padding: 5px;
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

		return style;
	}

	renderElement() {
		const content = this.getAttribute( 'content' );
		const template = document.createElement( 'template' );
		template.innerHTML = `
			<style>
				${ this.renderStyle() }
			</style>
			<span class="wrapper">
				<span class="text" tabindex="0" role="button" aria-describedby="infotip-content">
					<slot></slot>
				</span>
				<div class="infotip" id="infotip-content">
					${ content }
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
			const infotip = shadow.querySelector( '.infotip' );
			infotip.innerHTML = newValue;

			if ( ! infotip.querySelector( '.arrow' ) ) {
				infotip
					.appendChild( document.createElement( 'div' ) )
					.classList.add( 'arrow' );
			}

			this.updatePosition();
			this.showTooltip();
		}

		const style = shadow.querySelector( 'style' );
		style.textContent = this.renderStyle();
	}
}

window.BlaBlaBlocksInfotip = BlaBlaBlocksInfotip;

if ( ! window.customElements.get( 'blablablocks-infotip' ) ) {
	window.customElements.define( 'blablablocks-infotip', BlaBlaBlocksInfotip );
}
