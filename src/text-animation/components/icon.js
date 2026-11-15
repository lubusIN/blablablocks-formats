/**
 * TextAnimationIcon component renders an SVG icon for text animation.
 *
 * @return {JSX.Element} SVG component for text animation format.
 */
function TextAnimationIcon() {
	return (
		<svg
			width="24px"
			height="24px"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M4 6V4h10v2M9 4v14m-2 0h4"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M17 11.5l1.2-2.5 1.2 2.5 2.5 1.2-2.5 1.2-1.2 2.5-1.2-2.5-2.5-1.2 2.5-1.2z"
				fill="currentColor"
			/>
			<circle cx="20.5" cy="18.5" r="1.5" fill="currentColor" />
		</svg>
	);
}

export default TextAnimationIcon;
