

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
module.exports = { TextAlignments: TextAlignments };
