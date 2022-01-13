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

/**
 * Possible text alignments.
 */
const TextAlignment = {

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

Object.freeze(TextAlignment);
module.exports = TextAlignment;