/**
 * Define supported blend modes.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\blend_modes.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';

/** @typedef {String} BlendMode */

/**
 * Blend modes we can draw with, determine how we blend new draws with existing buffer.
 * @readonly
 * @enum {BlendMode}
 */
const BlendModes = {
    AlphaBlend: "alpha",
    Opaque: "opaque",
    Additive: "additive",
    Multiply: "multiply",
    Subtract: "subtract",
    Screen: "screen",
    Overlay: "overlay",
    Invert: "invert",
    Darken: "darken",
    DestIn: "dest-in",
    DestOut: "dest-out"
};

Object.defineProperty(BlendModes, '_values', {
    value: new Set(Object.values(BlendModes)),
    writable: false,
});
Object.freeze(BlendModes);

module.exports = {BlendModes: BlendModes};