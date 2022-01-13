/**
 * Define possible texture filter modes.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\texture_filter_modes.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
 'use strict'; 

/**
 * Texture filter modes, determine how to scale textures.
 */
const TextureFilterModes = {
    Nearest: "NEAREST",
    Linear: "LINEAR",
    NearestMipmapNearest: "NEAREST_MIPMAP_NEAREST",
    LinearMipmapNearest: "LINEAR_MIPMAP_NEAREST",
    NearestMipmapLinear: "NEAREST_MIPMAP_LINEAR",
    LinearMipmapLinear: "LINEAR_MIPMAP_LINEAR",
};

Object.defineProperty(TextureFilterModes, '_values', {
    value: new Set(Object.values(TextureFilterModes)),
    writable: false,
});

Object.freeze(TextureFilterModes);
module.exports = TextureFilterModes;
