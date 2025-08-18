// Counter animations: uses Odometer library for odometer mode; keeps other modes intact.
(function () {
    // Check if user prefers reduced motion
    const prefersReducedMotion = () => {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    };

    // Smooth easing function for polished marketing counters
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    // Generate random number similar to target
    const randomLike = (target, decimals) => {
        const pow = Math.pow(10, decimals);
        const max = Math.max(1, Math.abs(target));
        const n = Math.random() * max;
        return Math.round(n * pow) / pow;
    };

    // Parse duration from various formats: "2s", "2.5s", "2500", "2500ms"
    const parseDuration = (raw, fallback = 1600) => {
        if (raw == null || raw === '') return fallback;

        const s = String(raw).trim().toLowerCase();
        const sec = s.endsWith('s') && !s.endsWith('ms');
        const ms = s.endsWith('ms');
        const n = parseFloat(s.replace(/(ms|s)$/, ''));

        if (isNaN(n)) return fallback;

        let val = sec ? n * 1000 : n;
        // Treat small integers as seconds
        if (!sec && !ms && val < 50) val *= 1000;

        return Math.max(0, Math.round(val));
    };

    // Build Odometer format string based on decimal places
    const odometerFormat = (decimals) => {
        return decimals > 0 ? `(,ddd).${'d'.repeat(decimals)}` : '(,ddd)';
    };

    // Initialize or reuse Odometer instance
    const ensureOdometer = (el, decimals, durationMs) => {
        const Odo = window.Odometer;
        if (!Odo) return null;

        const desiredFormat = odometerFormat(decimals);
        const existing = el.__odometer;

        // Check if existing instance needs update
        if (existing) {
            let changed = false;

            if (existing.options) {
                if (existing.options.duration !== durationMs) {
                    existing.options.duration = durationMs;
                    changed = true;
                }
                if (existing.options.format !== desiredFormat) {
                    existing.options.format = desiredFormat;
                    changed = true;
                }
            } else {
                changed = true;
            }

            if (!changed) return existing;

            // Clean up existing instance
            try {
                el.__odometer = null;
                el.classList.remove('odometer');
            } catch (_) { }
        }

        // Create new Odometer instance
        const odo = new Odo({
            el,
            value: 0,
            duration: Number.isFinite(durationMs) ? Number(durationMs) : 1600,
            format: desiredFormat,
        });

        el.__odometer = odo;
        return odo;
    };

    // Main function to run counter animations
    const run = () => {
        const els = document.querySelectorAll('.has-number-counter, number-counter.has-number-counter');
        if (!els.length) return;

        // Check for reduced motion preference
        const reducedMotion = prefersReducedMotion();

        // Animate individual counter element
        const animate = (el) => {
            const target = parseFloat(el.dataset.countTo ?? el.textContent);
            if (isNaN(target)) return;

            const rawDuration = el.dataset.duration ?? '1600';
            const duration = parseDuration(rawDuration, 1600);

            // Determine animation mode
            const requested = String(el.dataset.anim ?? '').trim().toLowerCase();
            const forceOdo = el.hasAttribute('data-odometer') || requested === 'odometer';
            const mode = forceOdo ? 'odometer' : (requested || 'ease');

            const decimals = (String(target).split('.')[1] || '').length;

            // If user prefers reduced motion and element respects it, show final value immediately
            if (reducedMotion) {
                // Display final value without animation
                const formatted = Number(target).toLocaleString(undefined, {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals,
                });
                el.textContent = formatted;
                el.setAttribute('data-final', formatted);

                // Add a class to indicate animation was skipped for styling purposes
                el.classList.add('animation-skipped');
                return;
            }

            // Format number with locale-specific formatting
            const renderNumber = (val) => {
                el.textContent = Number(val).toLocaleString(undefined, {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals,
                });
            };

            // Cleanup if not using odometer mode
            if (mode !== 'odometer') {
                if (el.__odometer) {
                    try { el.__odometer = null; } catch (e) { }
                }
                if (el.classList.contains('odometer')) {
                    el.classList.remove('odometer');
                }
            }

            // ODOMETER MODE
            if (mode === 'odometer') {
                const odo = ensureOdometer(el, decimals, duration);

                // Fallback to ease animation if library missing
                if (!odo) {
                    let startTime = null;
                    const step = (ts) => {
                        if (!startTime) startTime = ts;
                        const raw = Math.min((ts - startTime) / duration, 1);
                        const p = easeOutCubic(raw);
                        const value = target * p;

                        renderNumber(value);

                        if (raw < 1) {
                            requestAnimationFrame(step);
                        } else {
                            renderNumber(target);
                            const formatted = Number(target).toLocaleString(undefined, {
                                minimumFractionDigits: decimals,
                                maximumFractionDigits: decimals,
                            });
                            el.setAttribute('data-final', formatted);
                        }
                    };
                    renderNumber(0);
                    requestAnimationFrame(step);
                    return;
                }

                // Initialize with zero and trigger animation
                renderNumber(0);

                requestAnimationFrame(() => {
                    // Ensure duration is applied
                    if (odo.options && odo.options.duration !== duration) {
                        odo.options.duration = duration;
                    }
                    odo.update(target);
                    const seconds = Math.max(0, Math.round(duration)) / 1000;
                    el.style.setProperty('--odo-duration', `${seconds}s`);
                });

                // Set final attribute when animation completes
                const setFinal = () => {
                    const formatted = Number(target).toLocaleString(undefined, {
                        minimumFractionDigits: decimals,
                        maximumFractionDigits: decimals,
                    });
                    el.setAttribute('data-final', formatted);
                };

                // Handle completion with event listener and timeout fallback
                let done = false;
                const onDone = () => {
                    if (done) return;
                    done = true;
                    setFinal();
                    el.removeEventListener('odometerdone', onDone);
                };

                el.addEventListener('odometerdone', onDone, { once: true });
                setTimeout(onDone, duration + 120);
                return;
            }

            // NON-ODOMETER MODES (ease/linear/steps/scramble)
            let startTime = null;

            const step = (ts) => {
                if (!startTime) startTime = ts;
                const raw = Math.min((ts - startTime) / duration, 1);

                let p = raw;

                let value;
                switch (mode) {
                    case 'steps': {
                        const steps = 20;
                        const snapped = Math.ceil(p * steps) / steps;
                        value = target * snapped;
                        break;
                    }
                    case 'scramble': {
                        value = raw < 0.8
                            ? randomLike(target, decimals)
                            : target * easeOutCubic((raw - 0.8) / 0.2);
                        break;
                    }
                    case 'linear':
                    default:
                        value = target * p;
                        break;
                }

                renderNumber(value);

                if (raw < 1) {
                    requestAnimationFrame(step);
                } else {
                    renderNumber(target);
                    const formatted = Number(target).toLocaleString(undefined, {
                        minimumFractionDigits: decimals,
                        maximumFractionDigits: decimals,
                    });
                    el.setAttribute('data-final', formatted);
                }
            };

            // Initialize starting value for non-odometer modes
            el.textContent = '';
            el.append(
                document.createTextNode(
                    (0).toLocaleString(undefined, {
                        minimumFractionDigits: decimals,
                        maximumFractionDigits: decimals,
                    })
                )
            );
            requestAnimationFrame(step);
        };

        // Intersection Observer for scroll-triggered animations
        const io = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    animate(entry.target);
                    obs.unobserve(entry.target);
                });
            },
            { threshold: 0.2 }
        );

        // Process each counter element
        els.forEach((el) => {
            // Check if animation should start on scroll (default: true)
            const onScrollAttr = (el.dataset.onScroll ?? 'true').toString().toLowerCase();
            const onScroll = onScrollAttr !== 'false';

            if (onScroll) {
                io.observe(el);  // Start when scrolled into view
            } else {
                animate(el);     // Start immediately
            }
        });
    };

    // Initialize after fonts are ready to prevent metric jumps
    const start = () => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', run);
        } else {
            run();
        }
    };

    // Wait for fonts to load before starting
    if (document.fonts && 'ready' in document.fonts) {
        document.fonts.ready.then(start);
    } else {
        start();
    }
})();