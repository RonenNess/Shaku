/**
 * Define possible text alignments.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\text_alignment.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';

/** @typedef {String} TextAlignment */

/**
 * Possible text alignments.
 * @readonly
 * @enum {TextAlignment}
 */
const TextAlignments = {

    /**
     * Align text left-to-right.
     */
    Left: "left",

    /**
     * Align text right-to-left.
     */
    Right: "right",

    /**
     * Align text to center.
     */
    Center: "center",
};

Object.freeze(TextAlignments);
module.exports = {TextAlignments: TextAlignments};