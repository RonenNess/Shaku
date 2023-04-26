/**
 * Define possible texture filter modes.
 * 
 * |-- copyright and license --|
 * @module     Shaku
 * @file       shaku\src\gfx\texture_filter_modes.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
 'use strict'; 

/** @typedef {String} TextureFilterMode */

/**
 * Texture filter modes, determine how to scale textures.
 * @readonly
 * @enum {TextureFilterMode}
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
module.exports = {TextureFilterModes: TextureFilterModes};
