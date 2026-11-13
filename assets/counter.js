( function () {
	const prefersReducedMotion = () =>
		window.matchMedia &&
		window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

	const easeOutCubic = ( t ) => 1 - Math.pow( 1 - t, 3 );

	const randomLike = ( target, decimals ) => {
		const pow = Math.pow( 10, decimals );
		const n = Math.random() * Math.max( 1, Math.abs( target ) );
		return Math.round( n * pow ) / pow;
	};

	const formatNumber = ( val, decimals ) =>
		Number( val ).toLocaleString( undefined, {
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals,
		} );

	const animateOdometer = ( el, rawText, duration, reducedMotion ) => {
		const chars = rawText.split( '' );
		const container = document.createElement( 'span' );
		container.className = 'bbb-odometer';
		container.setAttribute( 'aria-label', rawText );

		let digitCount = 0;
		chars.forEach( ( ch ) => {
			if ( /\d/.test( ch ) ) {
				digitCount++;
			}
		} );

		let currentDigit = 0;
		const ribbons = [];

		chars.forEach( ( ch ) => {
			if ( ! /\d/.test( ch ) ) {
				const sym = document.createElement( 'span' );
				sym.className = 'bbb-odometer-symbol';
				sym.textContent = ch;
				container.appendChild( sym );
				return;
			}

			const targetDigit = parseInt( ch, 10 );
			const digitEl = document.createElement( 'span' );
			digitEl.className = 'bbb-odometer-digit';

			const spacer = document.createElement( 'span' );
			spacer.className = 'bbb-odometer-spacer';
			spacer.textContent = '0';
			digitEl.appendChild( spacer );

			const ribbon = document.createElement( 'span' );
			ribbon.className = 'bbb-odometer-ribbon';

			const cycles =
				1 +
				Math.floor(
					( currentDigit / Math.max( 1, digitCount - 1 ) ) * 2
				);
			currentDigit++;

			const items = [ 0 ];
			for ( let c = 0; c < cycles; c++ ) {
				for ( let d = 0; d <= 9; d++ ) {
					items.push( d );
				}
			}
			items.push( targetDigit );

			const totalItems = items.length;
			const targetIndex = totalItems - 1;

			items.forEach( ( num ) => {
				const item = document.createElement( 'span' );
				item.className = 'bbb-odometer-item';
				item.textContent = String( num );
				ribbon.appendChild( item );
			} );

			digitEl.appendChild( ribbon );
			container.appendChild( digitEl );

			ribbons.push( {
				ribbon,
				targetIndex,
				totalItems,
			} );
		} );

		el.textContent = '';
		el.appendChild( container );

		if ( reducedMotion ) {
			ribbons.forEach( ( { ribbon, targetIndex, totalItems } ) => {
				ribbon.style.transform = `translateY(-${
					( targetIndex / totalItems ) * 100
				}%)`;
			} );
			return;
		}

		requestAnimationFrame( () => {
			requestAnimationFrame( () => {
				ribbons.forEach(
					( { ribbon, targetIndex, totalItems }, idx ) => {
						const stagger =
							( idx / Math.max( 1, ribbons.length ) ) * 120;
						const digitDuration = duration + stagger;
						ribbon.style.transition = `transform ${ digitDuration }ms cubic-bezier(0.16, 1, 0.3, 1)`;
						ribbon.style.transform = `translateY(-${
							( targetIndex / totalItems ) * 100
						}%)`;
					}
				);
			} );
		} );
	};

	const animateNumeric = (
		el,
		target,
		decimals,
		duration,
		mode,
		reducedMotion
	) => {
		if ( reducedMotion ) {
			el.textContent = formatNumber( target, decimals );
			return;
		}

		let startTime = null;

		const step = ( timestamp ) => {
			if ( ! startTime ) {
				startTime = timestamp;
			}
			const progress = Math.min(
				( timestamp - startTime ) / duration,
				1
			);

			let current;
			switch ( mode ) {
				case 'steps': {
					const steps = 15;
					const snapped = Math.ceil( progress * steps ) / steps;
					current = target * snapped;
					break;
				}
				case 'scramble': {
					current =
						progress < 0.8
							? randomLike( target, decimals )
							: target * easeOutCubic( ( progress - 0.8 ) / 0.2 );
					break;
				}
				case 'linear':
				default:
					current = target * progress;
					break;
			}

			if ( progress < 1 ) {
				el.textContent = formatNumber( current, decimals );
				requestAnimationFrame( step );
			} else {
				el.textContent = formatNumber( target, decimals );
			}
		};

		el.textContent = formatNumber( 0, decimals );
		requestAnimationFrame( step );
	};

	const animate = ( el ) => {
		const rawText = ( el.dataset.countTo ?? el.textContent ).trim();
		const cleanText = rawText.replace( /,/g, '' );
		const target = parseFloat( cleanText );

		if ( isNaN( target ) ) {
			return;
		}

		const mode = ( el.dataset.anim || 'odometer' ).toLowerCase();
		const duration = Math.max(
			100,
			parseInt( el.dataset.duration || '1200', 10 )
		);
		const reducedMotion = prefersReducedMotion();

		if ( mode === 'odometer' ) {
			animateOdometer( el, rawText, duration, reducedMotion );
		} else {
			const decimals = ( cleanText.split( '.' )[ 1 ] || '' ).length;
			animateNumeric(
				el,
				target,
				decimals,
				duration,
				mode,
				reducedMotion
			);
		}
	};

	const init = () => {
		const elements = document.querySelectorAll(
			'.has-number-counter-format'
		);
		if ( ! elements.length ) {
			return;
		}

		let observer = null;
		if ( 'IntersectionObserver' in window ) {
			observer = new IntersectionObserver(
				( entries ) => {
					entries.forEach( ( entry ) => {
						if ( entry.isIntersecting ) {
							observer.unobserve( entry.target );
							animate( entry.target );
						}
					} );
				},
				{ threshold: 0.2 }
			);
		}

		elements.forEach( ( el ) => {
			const onScroll = el.dataset.onScroll !== 'false';
			if ( onScroll && observer ) {
				observer.observe( el );
			} else {
				animate( el );
			}
		} );
	};

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();
