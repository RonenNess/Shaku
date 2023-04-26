export = Gamepad;
/**
 * Gamepad data object.
 * This object represents a snapshot of a gamepad state, it does not update automatically.
 */
declare class Gamepad {
    /**
     * Create gamepad state object.
     * @param {*} gp Browser gamepad state object.
     */
    constructor(gp: any);
    /**
     * Gamepad Id.
     * @name Gamepad#id
     * @type {String}
     */
    id: string;
    _buttonsDown: any[];
    /**
     * Gamepad first axis value.
     * @name Gamepad#axis1
     * @type {Vector2}
     */
    axis1: Vector2;
    /**
     * Gamepad second axis value.
     * @name Gamepad#axis2
     * @type {Vector2}
     */
    axis2: Vector2;
    /**
     * Mapping type.
     * @name Gamepad#mapping
     * @type {String}
     */
    mapping: string;
    /**
     * True if the gamepad is of a known type and we have extra mapped attributes.
     * False if unknown / not supported.
     * @name Gamepad#isMapped
     * @type {Boolean}
     */
    isMapped: boolean;
    /**
     * Gamepad left stick.
     * Only available with "standard" mapping.
     * @name Gamepad#leftStick
     * @type {Vector2}
     */
    leftStick: Vector2;
    /**
     * Gamepad right stick.
     * Only available with "standard" mapping.
     * @name Gamepad#rightStick
     * @type {Vector2}
     */
    rightStick: Vector2;
    /**
     * Gamepad left stick is pressed.
     * Only available with "standard" mapping.
     * @name Gamepad#leftStickPressed
     * @type {Boolean}
     */
    leftStickPressed: boolean;
    /**
     * Gamepad right stick is pressed.
     * Only available with "standard" mapping.
     * @name Gamepad#leftStickPressed
     * @type {Boolean}
     */
    rightStickPressed: boolean;
    /**
     * Right cluster button states.
     * @name Gamepad#rightButtons
     * @type {FourButtonsCluster}
     */
    rightButtons: FourButtonsCluster;
    /**
     * Left cluster button states.
     * @name Gamepad#leftButtons
     * @type {FourButtonsCluster}
     */
    leftButtons: FourButtonsCluster;
    /**
     * Center cluster button states.
     * @name Gamepad#leftButtons
     * @type {FourButtonsCluster}
     */
    centerButtons: FourButtonsCluster;
    /**
     * Front buttons states.
     * @name Gamepad#frontButtons
     * @type {FrontButtons}
     */
    frontButtons: FrontButtons;
    /**
     * Get button state (if pressed down) by index.
     * @param {Number} index Button index to check.
     * @returns {Boolean} True if pressed, false otherwise.
     */
    button(index: number): boolean;
    /**
     * Get buttons count.
     * @returns {Number} Buttons count.
     */
    get buttonsCount(): number;
}
import Vector2 = require("../utils/vector2");
/**
 * Buttons cluster container - 4 buttons.
 */
declare class FourButtonsCluster {
    /**
     * Create the cluster states.
     * @param {Boolean} bottom Bottom button state.
     * @param {Boolean} right Right button state.
     * @param {Boolean} left Left button state.
     * @param {Boolean} top Top button state.
     */
    constructor(bottom: boolean, right: boolean, left: boolean, top: boolean);
    bottom: boolean;
    right: boolean;
    left: boolean;
    top: boolean;
}
/**
 * Front buttons.
 */
declare class FrontButtons {
    /**
     * Create the cluster states.
     */
    constructor(topLeft: any, topRight: any, bottomLeft: any, bottomRight: any);
    topLeft: boolean;
    topRight: boolean;
    bottomLeft: boolean;
    bottomRight: boolean;
}
//# sourceMappingURL=gamepad.d.ts.map