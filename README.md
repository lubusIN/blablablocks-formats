# BlaBlaBlocks Formats
<!-- TODO add graphics -->
<!-- TODO add playground demo link -->

## Overview
A collection of rich text formats for WordPress that enhance the block editor with interactive elements, starting with InfoTip tooltips and Marker highlights. More in the future!

## Features

### 🎯 Marker Format
- **Text Highlighting**: Emphasize important content with customizable markers
- **Visual Styling**: Multiple marker animations, styles and colors.
- **Easy Integration**: Simple toolbar button integration in the block editor

### 🔍 InfoTip Format
- **Interactive Tooltips**: Add contextual information that appears on hover or click
- **Customizable Appearance**: Control background color, text color, and placement
- **Flexible Positioning**: 12 placement options (top, bottom, left, right with start/end variants)
- **Smart Placement**: Automatic fallback positioning to ensure tooltips stay visible
- **Responsive Design**: Works seamlessly across desktop and mobile devices


## Installation

1. Download the latest release zip file from GitHub  <!--TODO - GH link to be added for release -->
2. Upload to your WordPress `/wp-content/plugins/` directory
3. Activate the plugin through the 'Plugins' menu in WordPress
4. Start using the new formats in your block editor

## Usage

### InfoTip Format

1. Select any text in the block editor
2. Click the InfoTip button in the formatting toolbar
3. Configure your tooltip with custom text, colors, and overlay placement


### Marker Format

1. Select text you want to highlight
2. Click the Marker button in the formatting toolbar
3. Choose your preferred highlighting style and animation

## Technical Details

### Requirements
- WordPress 5.0+
- Modern browser with JavaScript enabled
- Floating UI library (included)

### Technologies Used
- **WordPress Block Editor API**: Native integration with Gutenberg via the [Rich Text API](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-rich-text/). 
- **Floating UI**: Advanced positioning system for tooltips
- **Web Components**: Custom elements for frontend rendering
- **React**: Editor interface components
- **SCSS**: Modular styling system


## Development

### Building the Plugin

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch for changes
npm run start
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Changelog

### 1.0.0
- Initial release
- InfoTip format with advanced positioning
- Marker format for text highlighting
- Web Components for frontend rendering
- Comprehensive editor integration

## Support

For support, feature requests, or bug reports, please open an issue on the project repository.

## License

This project is licensed under the MIT license.

## Credits

* [Marker](https://thenounproject.com/icon/marker-7644139/) icon by [Amir Ali](https://thenounproject.com/amirali) from [Noun Project](https://thenounproject.com/browse/icons/term/marker/) (CC BY 3.0)
