module.exports = {
	root: true,
	extends: [
		'plugin:@wordpress/eslint-plugin/recommended',
		'plugin:prettier/recommended',
	],
	plugins: [ '@wordpress', 'prettier' ],
	env: {
		browser: true,
		es6: true,
		jquery: true,
	},
	globals: {
		wp: true,
		wpApiSettings: true,
	},
	rules: {
		'prettier/prettier': 'error',
		'@wordpress/no-global-active-element': 'off',
		'@wordpress/no-global-get-selection': 'off',
		'jsdoc/require-param-type': 'off',
		'jsdoc/require-param': 'off',
		'no-unused-vars': [ 'error', { varsIgnorePattern: '^_' } ],
	},
	parserOptions: {
		requireConfigFile: false,
		ecmaVersion: 2021,
		sourceType: 'module',
	},
	ignorePatterns: [
		'build/**',
		'node_modules/**',
		'*.min.js',
		'*.config.js',
		'*.webpack.js',
	],
};
