/**
 * Define supported usage modes.
 * 
 * |-- copyright and license --|
 * @module     Shaku
 * @file       shaku\src\gfx\draw_batches\buffers_usage.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';

/** @typedef {String} BuffersUsage */

/**
 * Buffers usage we can use for drawing batches.
 * This determine how WebGL will treat the buffers we pass to the GPU.
 * @readonly
 * @enum {BuffersUsage}
 */
const BuffersUsage = {
    StaticDraw: 'static',
    DynamicDraw: 'dynamic',
    StreamDraw: 'stream',
};

Object.defineProperty(BuffersUsage, '_values', {
    value: new Set(Object.values(BuffersUsage)),
    writable: false,
});
Object.freeze(BuffersUsage);

module.exports = {BuffersUsage: BuffersUsage};