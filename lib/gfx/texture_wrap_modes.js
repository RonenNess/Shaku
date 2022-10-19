/**
 * Define possible texture wrap modes.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\texture_wrap_modes.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';

/** @typedef {String} TextureWrapMode */

/**
 * Texture wrap modes, determine what to do when texture coordinates are outside texture boundaries.
 * @readonly
 * @enum {TextureWrapMode}
 */
const TextureWrapModes = {
    Clamp: "CLAMP_TO_EDGE",
    Repeat: "REPEAT",
    RepeatMirrored: "MIRRORED_REPEAT",
};

Object.defineProperty(TextureWrapModes, '_values', {
    value: new Set(Object.values(TextureWrapModes)),
    writable: false,
});

Object.freeze(TextureWrapModes);
module.exports = {TextureWrapModes: TextureWrapModes};