/**
 * GradientText component renders an SVG icon that represents a gradient text.
 *
 * @return {JSX.Element} SVG component for a gradient text icon.
 */
function GradientTextIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlSpace="preserve"
            style={{
                enableBackground: "new 0 0 32 32",
            }}
            width={"24px"}
            height={"24px"}
            viewBox="0 -4 32 40"
        >
            <path d="M26 3H6C4.3 3 3 4.3 3 6v20c0 1.7 1.3 3 3 3h20c1.7 0 3-1.3 3-3V6c0-1.7-1.3-3-3-3zm0 24h-1v-2h-3v2h-3v-2h-3v2h-3v-2h-3v2H7v-2H5v-3h2v-3H5V6c0-.6.4-1 1-1h20c.6 0 1 .4 1 1v10h-2v3h2v3h-2v3h2v1c0 .6-.4 1-1 1z" />
            <path d="M7 22h3v3H7zM13 22h3v3h-3zM19 22h3v3h-3zM10 19h3v3h-3zM16 19h3v3h-3zM22 19h3v3h-3zM7 16h3v3H7zM13 16h3v3h-3zM19 16h3v3h-3z" />
        </svg>
    );
}

export default GradientTextIcon;
