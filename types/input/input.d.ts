declare const _exports: Input;
export = _exports;
/**
 * Input manager.
 * Used to recieve input from keyboard and mouse.
 *
 * To access the Input manager use `Shaku.input`.
 */
declare class Input extends IManager {
    _callbacks: {
        mousedown: (event: any) => void;
        mouseup: (event: any) => void;
        mousemove: (event: any) => void;
        keydown: (event: any) => void;
        keyup: (event: any) => void;
        blur: (event: any) => void;
        wheel: (event: any) => void;
        touchstart: (event: any) => void;
        touchend: (event: any) => void;
        touchmove: (event: any) => void;
        contextmenu: (event: any) => void;
    };
    _targetElement: Window & typeof globalThis;
    MouseButtons: {
        left: number;
        middle: number;
        right: number;
    };
    KeyboardKeys: {
        backspace: number;
        tab: number;
        enter: number;
        shift: number;
        ctrl: number;
        alt: number;
        break: number;
        caps_lock: number;
        escape: number;
        page_up: number;
        page_down: number;
        end: number;
        home: number;
        left: number;
        up: number;
        right: number;
        down: number;
        insert: number;
        delete: number;
        space: number;
        n0: number;
        n1: number;
        n2: number;
        n3: number;
        n4: number;
        n5: number;
        n6: number;
        n7: number;
        n8: number;
        n9: number;
        a: number;
        b: number;
        c: number;
        d: number;
        e: number;
        f: number;
        g: number;
        h: number;
        i: number;
        j: number;
        k: number;
        l: number;
        m: number;
        n: number;
        o: number;
        p: number;
        q: number;
        r: number;
        s: number;
        t: number;
        u: number;
        v: number;
        w: number;
        x: number;
        y: number;
        z: number;
        left_window_key: number;
        right_window_key: number;
        select_key: number;
        numpad_0: number;
        numpad_1: number;
        numpad_2: number;
        numpad_3: number;
        numpad_4: number;
        numpad_5: number;
        numpad_6: number;
        numpad_7: number;
        numpad_8: number;
        numpad_9: number;
        multiply: number;
        add: number;
        subtract: number;
        decimal_point: number;
        divide: number;
        f1: number;
        f2: number; /**
         * @inheritdoc
         * @private
         **/
        f3: number;
        f4: number;
        f5: number;
        f6: number;
        f7: number;
        f8: number;
        f9: number;
        f10: number;
        f11: number;
        f12: number;
        numlock: number;
        scroll_lock: number;
        semicolon: number;
        equal_sign: number;
        plus: number;
        comma: number;
        dash: number;
        minus: number;
        period: number;
        forward_slash: number;
        grave_accent: number;
        open_bracket: number;
        back_slash: number;
        close_braket: number;
        single_quote: number;
    };
    preventDefaults: boolean;
    enableMouseDeltaWhileMouseWheelDown: boolean;
    disableContextMenu: boolean;
    resetOnFocusLoss: boolean;
    /**
     * @inheritdoc
     * @private
     **/
    private setup;
    /**
     * @callback elementCallback
     * @returns  {Element}
     */
    /**
     * Set the target element to attach input to. If not called, will just use the entire document.
     * Must be called *before* initializing Shaku. This can also be a method to invoke while initializing.
     * @example
     * // the following will use whatever canvas the gfx manager uses as input element.
     * // this means mouse offset will also be relative to this element.
     * Shaku.input.setTargetElement(() => Shaku.gfx.canvas);
     * @param {Element | elementCallback} element Element to attach input to.
     */
    setTargetElement(element: Element | (() => Element)): void;
    /**
     * Reset all internal data and states.
     * @private
     */
    private _resetAll;
    _mousePos: Vector2;
    _mousePrevPos: Vector2;
    _mouseState: {};
    _mousePrevState: {};
    _mouseWheel: any;
    _keyboardState: {};
    _keyboardPrevState: {};
    _touchStarted: boolean;
    /**
     * Get mouse position.
     * @returns {Vector2} Mouse position.
     */
    get mousePosition(): Vector2;
    /**
     * Get mouse previous position (before the last endFrame() call).
     * @returns {Vector2} Mouse position in previous frame.
     */
    get prevMousePosition(): Vector2;
    /**
     * Get mouse movement since last endFrame() call.
     * @returns {Vector2} Mouse change since last frame.
     */
    get mouseDelta(): Vector2;
    /**
     * Get if mouse is currently moving.
     * @returns {Boolean} True if mouse moved since last frame, false otherwise.
     */
    get mouseMoving(): boolean;
    /**
     * Get if mouse button was pressed this frame.
     * @param {MouseButton} button Button code (defults to MouseButtons.left).
     * @returns {Boolean} True if mouse button is currently down, but was up in previous frame.
     */
    mousePressed(button?: MouseButton): boolean;
    /**
     * Get if mouse button is currently pressed.
     * @param {MouseButton} button Button code (defults to MouseButtons.left).
     * @returns {Boolean} true if mouse button is currently down, false otherwise.
     */
    mouseDown(button?: MouseButton): boolean;
    /**
     * Get if mouse button is currently not down.
     * @param {MouseButton} button Button code (defults to MouseButtons.left).
     * @returns {Boolean} true if mouse button is currently up, false otherwise.
     */
    mouseUp(button?: MouseButton): boolean;
    /**
     * Get if mouse button was released in current frame.
     * @param {MouseButton} button Button code (defults to MouseButtons.left).
     * @returns {Boolean} True if mouse was down last frame, but released in current frame.
     */
    mouseReleased(button?: MouseButton): boolean;
    /**
     * Get if keyboard key is currently pressed down.
     * @param {KeyboardKey} key Keyboard key code.
     * @returns {boolean} True if keyboard key is currently down, false otherwise.
     */
    keyDown(key: KeyboardKey): boolean;
    /**
     * Get if keyboard key is currently not down.
     * @param {KeyboardKey} key Keyboard key code.
     * @returns {Boolean} True if keyboard key is currently up, false otherwise.
     */
    keyUp(key: KeyboardKey): boolean;
    /**
     * Get if a keyboard button was released in current frame.
     * @param {KeyboardKey} button Keyboard key code.
     * @returns {Boolean} True if key was down last frame, but released in current frame.
     */
    keyReleased(key: any): boolean;
    /**
     * Get if keyboard key was pressed this frame.
     * @param {KeyboardKey} key Keyboard key code.
     * @returns {Boolean} True if key is currently down, but was up in previous frame.
     */
    keyPressed(key: KeyboardKey): boolean;
    /**
     * Get if any of the shift keys are currently down.
     * @returns {Boolean} True if there's a shift key pressed down.
     */
    get shiftDown(): boolean;
    /**
     * Get if any of the Ctrl keys are currently down.
     * @returns {Boolean} True if there's a Ctrl key pressed down.
     */
    get ctrlDown(): boolean;
    /**
     * Get if any of the Alt keys are currently down.
     * @returns {Boolean} True if there's an Alt key pressed down.
     */
    get altDown(): boolean;
    /**
     * Get if any keyboard key was pressed this frame.
     * @returns {Boolean} True if any key was pressed down this frame.
     */
    get anyKeyPressed(): boolean;
    /**
     * Get if any keyboard key is currently down.
     * @returns {Boolean} True if there's a key pressed down.
     */
    get anyKeyDown(): boolean;
    /**
     * Get if any mouse button was pressed this frame.
     * @returns {Boolean} True if any of the mouse buttons were pressed this frame.
     */
    get anyMouseButtonPressed(): boolean;
    /**
     * Get if any mouse button is down.
     * @returns {Boolean} True if any of the mouse buttons are pressed.
     */
    get anyMouseButtonDown(): boolean;
    /**
     * Return if a mouse or keyboard state in a generic way, used internally.
     * @private
     * @param {string} code Keyboard or mouse code.
     *                          For mouse buttons: mouse_left, mouse_right or mouse_middle.
     *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..)
     *                          For numbers (0-9): you can use the number.
     * @param {Function} mouseCheck Callback to use to return value if its a mouse button code.
     * @param {Function} keyboardCheck Callback to use to return value if its a keyboard key code.
     */
    private _getValueWithCode;
    /**
     * Return if a mouse or keyboard button is currently down.
     * @param {string|Array<String>} code Keyboard or mouse code. Can be array of codes to test if any of them is down.
     *                          For mouse buttons: mouse_left, mouse_right or mouse_middle.
     *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..)
     *                          For numbers (0-9): you can use the number.
     * @returns {Boolean} True if key or mouse button are down.
     */
    down(code: string | Array<string>): boolean;
    /**
     * Return if a mouse or keyboard button was released in this frame.
     * @param {string|Array<String>} code Keyboard or mouse code. Can be array of codes to test if any of them is released.
     *                          For mouse buttons: mouse_left, mouse_right or mouse_middle.
     *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..)
     *                          For numbers (0-9): you can use the number.
     * @returns {Boolean} True if key or mouse button were down in previous frame, and released this frame.
     */
    released(code: string | Array<string>): boolean;
    /**
     * Return if a mouse or keyboard button was pressed in this frame.
     * @param {string|Array<String>} code Keyboard or mouse code. Can be array of codes to test if any of them is pressed.
     *                          For mouse buttons: mouse_left, mouse_right or mouse_middle.
     *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..)
     *                          For numbers (0-9): you can use the number.
     * @returns {Boolean} True if key or mouse button where up in previous frame, and pressed this frame.
     */
    pressed(code: string | Array<string>): boolean;
    /**
     * Get mouse wheel sign.
     * @returns {Number} Mouse wheel sign (-1 or 1) for wheel scrolling that happened during this frame.
     * Will return 0 if mouse wheel is not currently being used.
     */
    get mouseWheelSign(): number;
    /**
     * Get mouse wheel value.
     * @returns {Number} Mouse wheel value.
     */
    get mouseWheel(): number;
    /**
     * Get keyboard key code from event.
     * @private
     */
    private _getKeyboardKeyCode;
    /**
     * Called when window loses focus - clear all input states to prevent keys getting stuck.
     * @private
     */
    private _onBlur;
    /**
     * Handle mouse wheel events.
     * @private
     * @param {*} event Event data from browser.
     */
    private _onMouseWheel;
    /**
     * Handle keyboard down event.
     * @private
     * @param {*} event Event data from browser.
     */
    private _onKeyDown;
    /**
     * Handle keyboard up event.
     * @private
     * @param {*} event Event data from browser.
     */
    private _onKeyUp;
    /**
     * Handle touch start event.
     * @private
     * @param {*} event Event data from browser.
     */
    private _onTouchStart;
    /**
     * Handle mouse down event.
     * @private
     * @param {*} event Event data from browser.
     */
    private _onMouseDown;
    /**
     * Handle mouse up event.
     * @private
     * @param {*} event Event data from browser.
     */
    private _onMouseUp;
    /**
     * Handle touch move event.
     * @private
     * @param {*} event Event data from browser.
     */
    private _onTouchMove;
    /**
     * Handle mouse move event.
     * @private
     * @param {*} event Event data from browser.
     */
    private _onMouseMove;
    /**
     * Normalize current _mousePos value to be relative to target element.
     * @private
     */
    private _normalizeMousePos;
    /**
     * Get event either from event param or from window.event.
     * This is for older browsers support.
     * @private
     */
    private _getEvent;
}
import IManager = require("../manager.js");
import Vector2 = require("../utils/vector2.js");
import { MouseButton } from "./key_codes.js";
import { KeyboardKey } from "./key_codes.js";
//# sourceMappingURL=input.d.ts.map