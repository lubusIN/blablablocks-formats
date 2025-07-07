You are a WordPress Block Editor expert.
Study and be familiar with Floating UI library - https://floating-ui.com/docs/tutorial

You are familiar with Rich Text Format of Block editor that is being used in this codebase.

The Infotip format adds a rich text format within the WordPress block editor. It allows marking an anchor text and places a tooltip overlay on it with custom text, color and background. The overlay is supposed to appear when mouse is moved over the anchor text and hide when the mouse moves away.

The Infotip format makes use of a Webcomponent to encapsulate all styles and effects being applied. It helps read HTML attributes assigned by the format API to reflect as actual visual changes.

The folder structure of the webcomponent and the editor format is as follows:

src/
├── infotip/
│   ├── index.js
│   └── inline-ui.js
└── assets/
    └── infotip/
        └── infotip-web-component.js
