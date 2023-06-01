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
    /**
     * If true, will prevent default input events by calling preventDefault().
     * @name Input#preventDefaults
     * @type {Boolean}
     */
    preventDefaults: boolean;
    /**
     * By default, when holding wheel button down browsers will turn into special page scroll mode and will not emit mouse move events.
     * if this property is set to true (default), the Input manager will prevent this behavior, so we could still get mouse delta while mouse wheel is held down.
     * @name Input#disableMouseWheelAutomaticScrolling
     * @type {Boolean}
     */
    disableMouseWheelAutomaticScrolling: boolean;
    /**
     * If true (default), will disable the context menu (what typically opens when you right click the page).
     * @name Input#disableContextMenu
     * @type {Boolean}
     */
    disableContextMenu: boolean;
    /**
     * If true (default), will treat touch events (touch start / touch end / touch move) as if the user clicked and moved a mouse.
     * @name Input#delegateTouchInputToMouse
     * @type {Boolean}
     */
    delegateTouchInputToMouse: boolean;
    /**
     * If true (default), will delegate events from mapped gamepads to custom keys.
     * This will add the following codes to all basic query methods (down, pressed, released, doublePressed, doubleReleased):
     * - gamepadX_top: state of arrow keys top key (left buttons).
     * - gamepadX_bottom: state of arrow keys bottom key (left buttons).
     * - gamepadX_left: state of arrow keys left key (left buttons).
     * - gamepadX_right: state of arrow keys right key (left buttons).
     * - gamepadX_leftStickUp: true if left stick points directly up.
     * - gamepadX_leftStickDown: true if left stick points directly down.
     * - gamepadX_leftStickLeft: true if left stick points directly left.
     * - gamepadX_leftStickRight: true if left stick points directly right.
     * - gamepadX_rightStickUp: true if right stick points directly up.
     * - gamepadX_rightStickDown: true if right stick points directly down.
     * - gamepadX_rightStickLeft: true if right stick points directly left.
     * - gamepadX_rightStickRight: true if right stick points directly right.
     * - gamepadX_a: state of A key (from right buttons).
     * - gamepadX_b: state of B key (from right buttons).
     * - gamepadX_x: state of X key (from right buttons).
     * - gamepadX_y: state of Y key (from right buttons).
     * - gamepadX_frontTopLeft: state of the front top-left button.
     * - gamepadX_frontTopRight: state of the front top-right button.
     * - gamepadX_frontBottomLeft: state of the front bottom-left button.
     * - gamepadX_frontBottomRight: state of the front bottom-right button.
     * Where X in `gamepad` is the gamepad index: gamepad0, gamepad1, gamepad2..
     * @name Input#delegateGamepadInputToKeys
     * @type {Boolean}
     */
    delegateGamepadInputToKeys: boolean;
    /**
     * If true (default), will reset all states if the window loses focus.
     * @name Input#resetOnFocusLoss
     * @type {Boolean}
     */
    resetOnFocusLoss: boolean;
    /**
     * Default time, in milliseconds, to consider two consecutive key presses as a double-press.
     * @name Input#defaultDoublePressInterval
     * @type {Number}
     */
    defaultDoublePressInterval: number;
    /**
     * Get the Mouse Buttons enum.
     * @see MouseButtons
     */
    get MouseButtons(): {
        left: number;
        middle: number;
        right: number;
    };
    /**
     * Get the Keyboard Buttons enum.
     * @see KeyboardKeys
     */
    get KeyboardKeys(): {
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
        /**
         * By default, when holding wheel button down browsers will turn into special page scroll mode and will not emit mouse move events.
         * if this property is set to true (default), the Input manager will prevent this behavior, so we could still get mouse delta while mouse wheel is held down.
         * @name Input#disableMouseWheelAutomaticScrolling
         * @type {Boolean}
         */
        u: number; /**
         * By default, when holding wheel button down browsers will turn into special page scroll mode and will not emit mouse move events.
         * if this property is set to true (default), the Input manager will prevent this behavior, so we could still get mouse delta while mouse wheel is held down.
         * @name Input#disableMouseWheelAutomaticScrolling
         * @type {Boolean}
         */
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
        f2: number;
        f3: number;
        /**
         * If true (default), will disable the context menu (what typically opens when you right click the page).
         * @name Input#disableContextMenu
         * @type {Boolean}
         */
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
        dash: number; /**
         * If true (default), will treat touch events (touch start / touch end / touch move) as if the user clicked and moved a mouse.
         * @name Input#delegateTouchInputToMouse
         * @type {Boolean}
         */
        minus: number;
        period: number;
        forward_slash: number;
        grave_accent: number;
        open_bracket: number;
        back_slash: number;
        close_braket: number;
        single_quote: number;
    };
    /**
     * Return the string code to use in order to get touch events.
     * @returns {String} Key code to use for touch events.
     */
    get TouchKeyCode(): string;
    /**
     * @inheritdoc
     * @private
     **/
    private setup;
    _customKeys: any;
    _gamepadsData: any[] | globalThis.Gamepad[];
    _defaultGamepad: any;
    _defaultGamepadIndex: number;
    _queriedGamepadStates: {};
    /**
     * Set the target element to attach input to. If not called, will just use the entire document.
     * Must be called *before* initializing Shaku. This can also be a method to invoke while initializing.
     * @example
     * // the following will use whatever canvas the gfx manager uses as input element.
     * // this means mouse offset will also be relative to this element.
     * Shaku.input.setTargetElement(() => Shaku.gfx.canvas);
     * @param {Element | elementCallback} element Element to attach input to.
     */
    setTargetElement(element: Element | elementCallback): void;
    _mousePos: Vector2;
    _mousePrevPos: Vector2;
    _mouseState: {};
    _mouseWheel: any;
    _touchPosition: Vector2;
    _isTouching: boolean;
    _touchStarted: boolean;
    _touchEnded: boolean;
    _keyboardState: {};
    _keyboardPrevState: {};
    _keyboardPressed: {};
    _keyboardReleased: {};
    _mousePressed: {};
    _mouseReleased: {};
    _customStates: {};
    _customPressed: {};
    _customReleased: {};
    _lastCustomReleasedTime: {};
    _lastCustomPressedTime: {};
    _prevLastCustomReleasedTime: {};
    _prevLastCustomPressedTime: {};
    _lastMouseReleasedTime: {};
    _lastKeyReleasedTime: {};
    _lastTouchReleasedTime: number;
    _lastMousePressedTime: {};
    _lastKeyPressedTime: {};
    _lastTouchPressedTime: number;
    _prevLastMouseReleasedTime: {};
    _prevLastKeyReleasedTime: {};
    _prevLastTouchReleasedTime: number;
    _prevLastMousePressedTime: {};
    _prevLastKeyPressedTime: {};
    _prevLastTouchPressedTime: number;
    /**
     * Get Gamepad current states, or null if not connected.
     * Note: this object does not update itself, you'll need to query it again every frame.
     * @param {Number=} index Gamepad index or undefined for first connected device.
     * @returns {Gamepad} Gamepad current state.
     */
    gamepad(index?: number | undefined): Gamepad;
    /**
     * Get gamepad id, or null if not connected to this slot.
     * @param {Number=} index Gamepad index or undefined for first connected device.
     * @returns Gamepad id or null.
     */
    gamepadId(index?: number | undefined): string;
    /**
     * Return a list with connected devices ids.
     * @returns {Array<String>} List of connected devices ids.
     */
    gamepadIds(): Array<string>;
    /**
     * Get touch screen touching position.
     * Note: if not currently touching, will return last known position.
     * @returns {Vector2} Touch position.
     */
    get touchPosition(): Vector2;
    /**
     * Get if currently touching a touch screen.
     * @returns {Boolean} True if currently touching the screen.
     */
    get touching(): boolean;
    /**
     * Get if started touching a touch screen in current frame.
     * @returns {Boolean} True if started touching the screen now.
     */
    get touchStarted(): boolean;
    /**
     * Get if stopped touching a touch screen in current frame.
     * @returns {Boolean} True if stopped touching the screen now.
     */
    get touchEnded(): boolean;
    /**
     * Set a custom key code state you can later use with all the built in methods (down / pressed / released / doublePressed, etc.)
     * For example, lets say you want to implement a simulated keyboard and use it alongside the real keyboard.
     * When your simulated keyboard space key is pressed, you can call `setCustomState('sim_space', true)`. When released, call `setCustomState('sim_space', false)`.
     * Now you can use `Shaku.input.down(['space', 'sim_space'])` to check if either a real space or simulated space is pressed down.
     * @param {String} code Code to set state for.
     * @param {Boolean|null} value Current value to set, or null to remove custom key.
     */
    setCustomState(code: string, value: boolean | null): void;
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
     * Return if a mouse or keyboard button is currently down.
     * @example
     * if (Shaku.input.down(['mouse_left', 'touch', 'space'])) { alert('mouse, touch screen or space are pressed!'); }
     * @param {string|Array<String>} code Keyboard, touch or mouse code. Can be array of codes to test any of them.
     *                          For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.
     *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).
     *                          For touch screen: set code to 'touch'.
     *                          For numbers (0-9): you can use the number itself.
     *                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
     * @returns {Boolean} True if key or mouse button are down.
     */
    down(code: string | Array<string>): boolean;
    /**
     * Return if a mouse or keyboard button was released in this frame.
     * @example
     * if (Shaku.input.released(['mouse_left', 'touch', 'space'])) { alert('mouse, touch screen or space were released!'); }
     * @param {string|Array<String>} code Keyboard, touch, gamepad or mouse button code. Can be array of codes to test any of them.
     *                          For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.
     *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).
     *                          For touch screen: set code to 'touch'.
     *                          For numbers (0-9): you can use the number itself.
     *                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
     * @returns {Boolean} True if key or mouse button were down in previous frame, and released this frame.
     */
    released(code: string | Array<string>): boolean;
    /**
     * Return if a mouse or keyboard button was pressed in this frame.
     * @example
     * if (Shaku.input.pressed(['mouse_left', 'touch', 'space'])) { alert('mouse, touch screen or space were pressed!'); }
     * @param {string|Array<String>} code Keyboard, touch, gamepad or mouse button code. Can be array of codes to test any of them.
     *                          For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.
     *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).
     *                          For touch screen: set code to 'touch'.
     *                          For numbers (0-9): you can use the number itself.
     *                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
     * @returns {Boolean} True if key or mouse button where up in previous frame, and pressed this frame.
     */
    pressed(code: string | Array<string>): boolean;
    /**
     * Return timestamp, in milliseconds, of the last time this key code was released.
     * @example
     * let lastReleaseTime = Shaku.input.lastReleaseTime('mouse_left');
     * @param {string} code Keyboard, touch, gamepad or mouse button code.
     *                          For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.
     *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).
     *                          For touch screen: set code to 'touch'.
     *                          For numbers (0-9): you can use the number itself.
     *                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
     * @returns {Number} Timestamp of last key release, or 0 if was never released.
     */
    lastReleaseTime(code: string): number;
    /**
     * Return timestamp, in milliseconds, of the last time this key code was pressed.
     * @example
     * let lastPressTime = Shaku.input.lastPressTime('mouse_left');
     * @param {string} code Keyboard, touch, gamepad or mouse button code.
     *                          For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.
     *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).
     *                          For touch screen: set code to 'touch'.
     *                          For numbers (0-9): you can use the number itself.
     *                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
     * @returns {Number} Timestamp of last key press, or 0 if was never pressed.
     */
    lastPressTime(code: string): number;
    /**
     * Return if a key was double-pressed.
     * @example
     * let doublePressed = Shaku.input.doublePressed(['mouse_left', 'touch', 'space']);
     * @param {string|Array<string>} code Keyboard, touch, gamepad or mouse button code. Can be array of codes to test any of them.
     *                          For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.
     *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).
     *                          For touch screen: set code to 'touch'.
     *                          For numbers (0-9): you can use the number itself.
     *                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
     * @param {Number} maxInterval Max interval time, in milliseconds, to consider it a double-press. Defaults to `defaultDoublePressInterval`.
     * @returns {Boolean} True if one or more key codes double-pressed, false otherwise.
     */
    doublePressed(code: string | Array<string>, maxInterval: number): boolean;
    /**
     * Return if a key was double-released.
     * @example
     * let doubleReleased = Shaku.input.doubleReleased(['mouse_left', 'touch', 'space']);
     * @param {string|Array<string>} code Keyboard, touch, gamepad or mouse button code. Can be array of codes to test any of them.
     *                          For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.
     *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).
     *                          For touch screen: set code to 'touch'.
     *                          For numbers (0-9): you can use the number itself.
     *                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
     * @param {Number} maxInterval Max interval time, in milliseconds, to consider it a double-release. Defaults to `defaultDoublePressInterval`.
     * @returns {Boolean} True if one or more key codes double-released, false otherwise.
     */
    doubleReleased(code: string | Array<string>, maxInterval: number): boolean;
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
     * Extract position from touch event.
     * @private
     * @param {*} event Event data from browser.
     * @returns {Vector2} Position x,y or null if couldn't extract touch position.
     */
    private _getTouchEventPosition;
    /**
     * Handle touch start event.
     * @private
     * @param {*} event Event data from browser.
     */
    private _onTouchStart;
    /**
     * Handle touch end event.
     * @private
     * @param {*} event Event data from browser.
     */
    private _onTouchEnd;
    /**
     * Handle touch move event.
     * @private
     * @param {*} event Event data from browser.
     */
    private _onTouchMove;
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
     * Mouse button pressed logic.
     * @private
     * @param {*} button Button pressed.
     */
    private _mouseButtonDown;
    /**
     * Mouse button released logic.
     * @private
     * @param {*} button Button released.
     */
    private _mouseButtonUp;
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
    #private;
}
import IManager = require("../manager.js");
import Vector2 = require("../utils/vector2.js");
import Gamepad = require("./gamepad");
import { MouseButton } from "./key_codes.js";
import { KeyboardKey } from "./key_codes.js";
//# sourceMappingURL=input.d.ts.map