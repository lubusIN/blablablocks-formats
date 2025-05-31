/**
 * BlaBlaBlocks: Infotip web component
 */

class BlaBlaBlocksInfotip extends HTMLElement {
	static get observedAttributes() {
		return [ 'content' ];
	}

	connectedCallback() {
		const template = this.renderElement();
		this.attachShadow( { mode: 'open' } );
		this.shadowRoot.appendChild( template.content.cloneNode( true ) );
	}
	renderElement() {
		const content = this.getAttribute( 'content' );

		const template = document.createElement( 'template' );
		template.innerHTML = `
			<style>
			.wrapper {
				position: relative;
			}
			.text {
				position: relative;
				display: inline-block;
				text-decoration:  dotted underline;
			}
			.infotip {
				width: max-content;
				position: absolute;
				top: -2rem;
				left: -2rem;
				background: #222;
				color: white;
				padding: 5px;
				border-radius: 4px;
				font-size: 90%;
			}
			</style>
			<span class="wrapper">
				<span class="text">
					<slot></slot>
					<div class="infotip">
						${ content }
					</div>
				</span>
			</span>
		`;

		return template;
	}
}

window.BlaBlaBlocksInfotip = BlaBlaBlocksInfotip;

if ( ! window.customElements.get( 'blablablocks-infotip' ) ) {
	window.customElements.define( 'blablablocks-infotip', BlaBlaBlocksInfotip );
}
