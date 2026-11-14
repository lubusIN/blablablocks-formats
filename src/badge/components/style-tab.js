/**
 * WordPress dependencies
 */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import { __ } from '@wordpress/i18n';
import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalVStack as VStack,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import {
	VARIANT_OPTIONS,
	RADIUS_OPTIONS,
	ALIGNMENT_OPTIONS,
	SIZE_OPTIONS,
} from '../constants';

/**
 * StyleTab component for customizing badge style, shape, alignment, and size.
 *
 * @param {Object}   props                  Component properties.
 * @param {Object}   props.activeAttributes Currently active attributes.
 * @param {Function} props.updateAttributes Callback to update attributes.
 * @return {JSX.Element} Rendered tab content.
 */
function StyleTab( { activeAttributes, updateAttributes } ) {
	const currentVariant = activeAttributes.variant || 'subtle';
	const currentRadius = activeAttributes.radius || 'rounded';
	const currentAlignment = activeAttributes.alignment || 'inline';
	const currentSize = activeAttributes.size || 'medium';

	return (
		<VStack spacing={ 4 }>
			<ToggleGroupControl
				label={ __( 'Variant', 'blablablocks-formats' ) }
				value={ currentVariant }
				onChange={ ( variant ) => updateAttributes( { variant } ) }
				isBlock
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			>
				{ VARIANT_OPTIONS.map( ( opt ) => (
					<ToggleGroupControlOption
						key={ opt.value }
						value={ opt.value }
						label={ opt.label }
					/>
				) ) }
			</ToggleGroupControl>

			<ToggleGroupControl
				label={ __( 'Shape', 'blablablocks-formats' ) }
				value={ currentRadius }
				onChange={ ( radius ) => updateAttributes( { radius } ) }
				isBlock
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			>
				{ RADIUS_OPTIONS.map( ( opt ) => (
					<ToggleGroupControlOption
						key={ opt.value }
						value={ opt.value }
						label={ opt.label }
					/>
				) ) }
			</ToggleGroupControl>

			<ToggleGroupControl
				label={ __( 'Alignment', 'blablablocks-formats' ) }
				value={ currentAlignment }
				onChange={ ( alignment ) => updateAttributes( { alignment } ) }
				isBlock
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			>
				{ ALIGNMENT_OPTIONS.map( ( opt ) => (
					<ToggleGroupControlOption
						key={ opt.value }
						value={ opt.value }
						label={ opt.label }
					/>
				) ) }
			</ToggleGroupControl>

			<ToggleGroupControl
				label={ __( 'Size', 'blablablocks-formats' ) }
				value={ currentSize }
				onChange={ ( size ) => updateAttributes( { size } ) }
				isBlock
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			>
				{ SIZE_OPTIONS.map( ( opt ) => (
					<ToggleGroupControlOption
						key={ opt.value }
						value={ opt.value }
						label={ opt.label }
					/>
				) ) }
			</ToggleGroupControl>
		</VStack>
	);
}

export default StyleTab;
