=== Rich Text Formats ===
Contributors:      lubus, ajitbohra, punitv342, nagpai
Tags:              rich text format, gutenberg, highlight, tooltip, text effects
Requires at least: 6.6
Tested up to:      6.9
Requires PHP:      7.4
Stable tag:        1.1.3
License:           MIT
License URI:       https://www.gnu.org/licenses/MIT

Rich text enhancements for the WordPress block editor.

== Description ==

BlaBlaBlocks Formats lets you enhance your Gutenberg editor with **interactive rich text formats** like tooltips, markers, inline typography controls, and formatting utilities directly inside WordPress.  
No coding needed. Just select your text, choose a format, and instantly make your content more engaging.

With BlaBlaBlocks Formats, you can add animated markers, interactive tooltips, inline typography styling, and quick formatting controls to improve readability and emphasize key information.

### Key Features

* **Interactive text formats** - Add **InfoTips**, **markers**, **typography controls**, and **clear formatting** directly from the block toolbar.
* **Live customization** - Change color, animation, and behavior in real time.
* **Lightweight & optimized** - Assets load only when formats are used.
* **Native Gutenberg integration** - Seamlessly fits the WordPress Block Editor.

### Why Choose BlaBlaBlocks Formats?

Because plain text doesn’t always tell the full story!  
Highlight key phrases, provide helpful InfoTips, adjust inline typography, or quickly remove formatting, all within the familiar block editor UI.

* No shortcodes or custom HTML needed.  
* 100% visual control inside the editor.  
* Works with all themes and blocks.

### How It Works

1. Select any text in the Gutenberg editor.
2. Choose a format such as Marker, InfoTip, Typography, or Clear formatting.
3. Adjust style and behavior using the sidebar options.
4. See the preview instantly.

Formats are rendered on both editor and frontend views with minimal code overhead.

## # Use Cases

* Add **InfoTips** to glossary terms or product details.  
* Highlight **important phrases** in tutorials or documentation.  
* Apply **inline typography styles** to emphasize selected text.  
* Clear unwanted formatting from copied or edited content.

### Available Formats

#### 1. Marker
Underline or highlight text segments with customizable color and animation.

#### 2. InfoTip
Attach informative tooltips to any text selection perfect for definitions, links, or extra context.

#### 3. Typography
Apply inline typography styles such as font family, font size, appearance, letter spacing, and letter case.

#### 4. Clear formatting
Remove applied inline formatting from selected text with a single toolbar action.

### Customization Options

* Marker color & animation style  
* Tooltip position, size, and behavior  
* Typography presets and inline text styling  
* Backend-only or frontend-visible options  
* Per-format settings saved automatically

### Performance & Optimization

* BlaBlaBlocks Formats loads assets only when necessary, reducing frontend bloat.  
* No React, Redux, or large JS libraries 
* Powered by the web component, not loaded on the public site unless formats are active.

=== Open Source and Free ===
The BlaBlaBlocks Formats is open source. Not only is it free to use, but you are also welcome to collaborate and contribute to its development.

- **Source Code:**  
  [https://github.com/lubusIN/blablablocks-formats](https://github.com/lubusIN/blablablocks-formats)

- **Report Issues:**  
  [https://github.com/lubusIN/blablablocks-formats/issues](https://github.com/lubusIN/blablablocks-formats/issues)

- **Documentation:**  
  [https://github.com/lubusIN/blablablocks-formats/wiki](https://github.com/lubusIN/blablablocks-formats/wiki)

== Screenshots ==
1. **Marker settings** - Select and adjust the Marker type and settings.
2. **InfoTip settings** - Add InfoTip text and adjust settings.

== Installation ==
You can install this plugin either automatically through the WordPress admin or manually via FTP.

= Automatic =

1. Log in to your WordPress dashboard.
2. Navigate to Plugins > Add New.
3. In the search field, type “BlaBlaBlocks Formats, then hit Enter or click Search Plugins.
4. Click Install Now, then Activate.

= Manual =

Manual installation method requires downloading the BlaBlaBlocks Formats plugin and uploading it to your web server via your favorite FTP application. The WordPress codex contains [instructions on how to do this here](https://wordpress.org/support/article/managing-plugins/#manual-plugin-installation).

== Frequently Asked Questions ==

### 1. How do I add an InfoTip to text?
Select your text in the block editor, open the format dropdown, and choose **InfoTip**. Add your tooltip text and customize appearance instantly.

### 2. Will this work with third-party blocks?
Yes. BlaBlaBlocks Formats integrates with all core and third-party Gutenberg blocks that support rich text.

### 3. Can I customize highlight colors?
Absolutely! You can set custom colors or choose from prebuilt palettes via the sidebar controls.

### 4. Does it affect site performance?
Not at all. Scripts are only loaded when formats are applied, ensuring a minimal footprint.

### 5. Does it work with Full Site Editing (FSE)?
Yes, the formats are fully compatible with block themes and the Site Editor.

### 6. Is it open source?
Yes! BlaBlaBlocks Formats is MIT-licensed and open for contributions.

== Changelog ==

= 1.1.2 =
* Bump plugin version to 1.1.2
* Update "Tested up to" to 6.9

= 1.1.1 =
* Fixed unnecessary backend scripts (React, Redux, etc.) from loading on the frontend when applying formats.

= 1.1.0 =
- Added a conditional check to load assets only when specific formats are used.

= 1.0.0 =
Initial release 🎉
