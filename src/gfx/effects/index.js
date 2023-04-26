/**
 * Include all built-in effects.
 * 
 * |-- copyright and license --|
 * @module     Shaku
 * @file       shaku\src\gfx\effects\index.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
 'use strict';

 module.exports = {
    Effect: require('./effect'),
    SpritesEffect: require('./sprites'),
    SpritesEffectNoVertexColor: require('./sprites_no_vertex_color'),
    SpritesWithOutlineEffect: require('./sprites_with_outline'),
    ShapesEffect: require('./shapes'),
    MsdfFontEffect: require('./msdf_font'),
 }