/**
 * PulseIcon component renders an SVG icon that represents a pulse effect.
 *
 * @return {JSX.Element} SVG component for a pulse icon.
 */
function PulseIcon() {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle cx="12" cy="12" r="3" fill="currentColor" />
			<circle
				cx="12"
				cy="12"
				r="6"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeOpacity="0.75"
			/>
			<circle
				cx="12"
				cy="12"
				r="9"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeOpacity="0.35"
			/>
		</svg>
	);
}

export default PulseIcon;
