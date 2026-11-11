const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );

module.exports = {
	...defaultConfig,
	entry: {
		...defaultConfig.entry(),
		marker: path.resolve( process.cwd(), 'src/marker/web-component.js' ),
		infotip: path.resolve( process.cwd(), 'src/infotip/web-component.js' ),
	},
};
