/**
 * Implement the input manager.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\input\input.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const IManager = require('../manager.js');
const Vector2 = require('../utils/vector2.js');
const { MouseButton, MouseButtons, KeyboardKey, KeyboardKeys } = require('./key_codes.js');
const Gamepad = require('./gamepad');
const _logger = require('../logger.js').getLogger('input');


// get timestamp
function timestamp()
{
    return (new Date()).getTime();
}

// touch key code
const _touchKeyCode = "touch";


/**
 * Input manager. 
 * Used to recieve input from keyboard and mouse.
 * 
 * To access the Input manager use `Shaku.input`. 
 */
class Input extends IManager
{
    /**
     * Create the manager.
     */
    constructor()
    {
        super();
        
        // callbacks and target we listen to input on
        this._callbacks = null;
        this._targetElement = window;

        /**
         * If true, will prevent default input events by calling preventDefault().
         * @name Input#preventDefaults
         * @type {Boolean}
         */
        this.preventDefaults = false;

        /**
         * By default, when holding wheel button down browsers will turn into special page scroll mode and will not emit mouse move events.
         * if this property is set to true (default), the Input manager will prevent this behavior, so we could still get mouse delta while mouse wheel is held down.
         * @name Input#enableMouseDeltaWhileMouseWheelDown
         * @type {Boolean}
         */
        this.enableMouseDeltaWhileMouseWheelDown = true;

        /**
         * If true (default), will disable the context menu (what typically opens when you right click the page).
         * @name Input#disableContextMenu
         * @type {Boolean}
         */
        this.disableContextMenu = true;

        /**
         * If true (default), will treat touch events (touch start / touch end / touch move) as if the user clicked and moved a mouse.
         * @name Input#delegateTouchInputToMouse
         * @type {Boolean}
         */
        this.delegateTouchInputToMouse = true;

        /**
         * If true (default), will delegate events from mapped gamepads to custom keys. 
         * This will add the following codes to all basic query methods (down, pressed, released, doublePressed, doubleReleased):
         * - gamepadX_up: state of arrow keys up key (left buttons).
         * - gamepadX_down: state of arrow keys down key (left buttons).
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
        this.delegateGamepadInputToKeys = true;

        /**
         * If true (default), will reset all states if the window loses focus.
         * @name Input#resetOnFocusLoss
         * @type {Boolean}
         */
        this.resetOnFocusLoss = true;

        /**
         * Default time, in milliseconds, to consider two consecutive key presses as a double-press.
         * @name Input#defaultDoublePressInterval
         * @type {Number}
         */
        this.defaultDoublePressInterval = 250;

        // set base state members
        this._resetAll();
    }

    /**
     * Get the Mouse Buttons enum.
     * @see MouseButtons
     */
    get MouseButtons()
    {
        return MouseButtons;
    }
 
    /**
     * Get the Keyboard Buttons enum.
     * @see KeyboardKeys
     */
    get KeyboardKeys()
    {
        return KeyboardKeys;
    }

    /**
     * Return the string code to use in order to get touch events.
     * @returns {String} Key code to use for touch events.
     */
    get TouchKeyCode()
    {
        return _touchKeyCode;
    }
    
    /**
     * @inheritdoc
     * @private
     **/
    setup()
    {        
        return new Promise((resolve, reject) => {

            _logger.info("Setup input manager..");

            // if target element is a method, invoke it
            if (typeof this._targetElement === 'function') {
                this._targetElement = this._targetElement();
                if (!this._targetElement) {
                    throw new Error("Input target element was set to be a method, but the returned value was invalid!");
                }
            }

            // get element to attach to
            let element = this._targetElement;

            // to make sure keyboard input would work if provided with canvas entity
            if (element.tabIndex === -1 || element.tabIndex === undefined) {
                element.tabIndex = 1000;
            }

            // focus on target element
            window.setTimeout(() => element.focus(), 0);

            // set all the events to listen to
            var _this = this;
            this._callbacks = {
                'mousedown': function(event) {_this._onMouseDown(event); if (this.preventDefaults) event.preventDefault(); },
                'mouseup': function(event) {_this._onMouseUp(event); if (this.preventDefaults) event.preventDefault(); },
                'mousemove': function(event) {_this._onMouseMove(event); if (this.preventDefaults) event.preventDefault(); },
                'keydown': function(event) {_this._onKeyDown(event); if (this.preventDefaults) event.preventDefault(); },
                'keyup': function(event) {_this._onKeyUp(event); if (this.preventDefaults) event.preventDefault(); },
                'blur': function(event) {_this._onBlur(event); if (this.preventDefaults) event.preventDefault(); },
                'wheel': function(event) {_this._onMouseWheel(event); if (this.preventDefaults) event.preventDefault(); },
                'touchstart': function(event) {_this._onTouchStart(event); if (this.preventDefaults) event.preventDefault(); },
                'touchend': function(event) {_this._onTouchEnd(event); if (this.preventDefaults) event.preventDefault(); },
                'touchmove': function(event) {_this._onTouchMove(event); if (this.preventDefaults) event.preventDefault(); },
                'contextmenu': function(event) { if (_this.disableContextMenu) { event.preventDefault(); } },
            };

            // reset all data to init initial state
            this._resetAll();
                    
            // register all callbacks
            for (var event in this._callbacks) {
                element.addEventListener(event, this._callbacks[event], false);
            }

            // if we have a specific element, still capture mouse release outside of it
            if (element !== window) {
                window.addEventListener('mouseup', this._callbacks['mouseup'], false);
                window.addEventListener('touchend', this._callbacks['touchend'], false);
            }

            // ready!
            resolve();
        });
    }

    /**
     * @inheritdoc
     * @private
     **/
    startFrame()
    {
        // query gamepads
        this._gamepadsData = navigator.getGamepads();

        // get default gamepad
        this._defaultGamepad = null;
        var i = 0;
        for (let gp of this._gamepadsData) 
        {
            if (gp) {
                this._defaultGamepad = gp;
                this._defaultGamepadIndex = i;
                break;
            }
            i++;
        }

        // reset queried gamepad states
        this._queriedGamepadStates = {};

        // delegate gamepad keys
        if (this.delegateGamepadInputToKeys) {
            for (let i = 0; i < 4; ++i) {

                const gp = this.gamepad(i);
                if (!gp || !gp.isMapped) { continue; }

                this.setCustomState(`gamepad${i}_up`, gp.leftButtons.up);
                this.setCustomState(`gamepad${i}_down`, gp.leftButtons.down);
                this.setCustomState(`gamepad${i}_left`, gp.leftButtons.left);
                this.setCustomState(`gamepad${i}_right`, gp.leftButtons.right);

                this.setCustomState(`gamepad${i}_y`, gp.rightButtons.up);
                this.setCustomState(`gamepad${i}_a`, gp.rightButtons.down);
                this.setCustomState(`gamepad${i}_x`, gp.rightButtons.left);
                this.setCustomState(`gamepad${i}_b`, gp.rightButtons.right);
                
                this.setCustomState(`gamepad${i}_frontTopLeft`, gp.frontButtons.topLeft);
                this.setCustomState(`gamepad${i}_frontTopRight`, gp.frontButtons.topRight);
                this.setCustomState(`gamepad${i}_frontBottomLeft`, gp.frontButtons.bottomLeft);
                this.setCustomState(`gamepad${i}_frontBottomRight`, gp.frontButtons.bottomRight);

                this.setCustomState(`gamepad${i}_leftStickUp`, gp.leftStick.y < -0.8);
                this.setCustomState(`gamepad${i}_leftStickDown`, gp.leftStick.y > 0.8);
                this.setCustomState(`gamepad${i}_leftStickLeft`, gp.leftStick.x < -0.8);
                this.setCustomState(`gamepad${i}_leftStickRight`, gp.leftStick.x > 0.8);

                this.setCustomState(`gamepad${i}_rightStickUp`, gp.rightStick.y < -0.8);
                this.setCustomState(`gamepad${i}_rightStickDown`, gp.rightStick.y > 0.8);
                this.setCustomState(`gamepad${i}_rightStickright`, gp.rightStick.x < -0.8);
                this.setCustomState(`gamepad${i}_rightStickRight`, gp.rightStick.x > 0.8);
            }
        }
    }

    /**
     * @inheritdoc
     * @private
     **/
    destroy()
    {
        // unregister all callbacks
        if (this._callbacks)
        {
            let element = this._targetElement;

            for (var event in this._callbacks) {
                element.removeEventListener(event, this._callbacks[event]);
            }

            if (element !== window) {
                window.removeEventListener('mouseup', this._callbacks['mouseup'], false);
                window.removeEventListener('touchend', this._callbacks['touchend'], false);
            }
            
            this._callbacks = null;
        }
    }

    /**
     * Set the target element to attach input to. If not called, will just use the entire document.
     * Must be called *before* initializing Shaku. This can also be a method to invoke while initializing.
     * @example
     * // the following will use whatever canvas the gfx manager uses as input element.
     * // this means mouse offset will also be relative to this element.
     * Shaku.input.setTargetElement(() => Shaku.gfx.canvas);
     * @param {Element | elementCallback} element Element to attach input to.
     */
    setTargetElement(element)
    {
        if (this._callbacks) { throw new Error("'setTargetElement() must be called before initializing the input manager!"); }
        this._targetElement = element;
    }

    /**
     * Reset all internal data and states.
     * @private
     */
    _resetAll()
    {
        // mouse states
        this._mousePos = new Vector2();
        this._mousePrevPos = new Vector2();
        this._mouseState = {};
        this._mouseWheel = 0;

        // touching states
        this._touchPosition = new Vector2();
        this._isTouching = false;
        this._touchStarted = false;
        this._touchEnded = false;

        // keyboard keys
        this._keyboardState = {};
        this._keyboardPrevState = {};

        // reset pressed / release events
        this._keyboardPressed = {};
        this._keyboardReleased = {};
        this._mousePressed = {};
        this._mouseReleased = {};

        // for custom states
        this._customStates = {};
        this._customPressed = {};
        this._customReleased = {};
        this._lastCustomReleasedTime = {};
        this._lastCustomPressedTime = {};
        this._prevLastCustomReleasedTime = {};
        this._prevLastCustomPressedTime = {};

        // for last release time and to count double click / double pressed events
        this._lastMouseReleasedTime = {};
        this._lastKeyReleasedTime = {};
        this._lastTouchReleasedTime = 0;
        this._lastMousePressedTime = {};
        this._lastKeyPressedTime = {};
        this._lastTouchPressedTime = 0;
        this._prevLastMouseReleasedTime = {};
        this._prevLastKeyReleasedTime = {};
        this._prevLastTouchReleasedTime = 0;
        this._prevLastMousePressedTime = {};
        this._prevLastKeyPressedTime = {};
        this._prevLastTouchPressedTime = 0;

        // currently connected gamepads data
        this._defaultGamepad = null;
        this._gamepadsData = [];
        this._queriedGamepadStates = {};
    }

    /**
     * Get Gamepad current states, or null if not connected.
     * Note: this object does not update itself, you'll need to query it again every frame.
     * @param {Number=} index Gamepad index or undefined for first connected device.
     * @returns {Gamepad} Gamepad current state.
     */
    gamepad(index)
    {
        // default index
        if (index === null || index === undefined) {
            index = this._defaultGamepadIndex;
        }

        // try to get cached value
        let cached = this._queriedGamepadStates[index];

        // not found? create
        if (!cached) {
            const gp = this._gamepadsData[index];
            if (!gp) { return null; }
            this._queriedGamepadStates[index] = cached = new Gamepad(gp);
        }

        // return gamepad state
        return cached;
    }

    /**
     * Get gamepad id, or null if not connected to this slot.
     * @param {Number=} index Gamepad index or undefined for first connected device.
     * @returns Gamepad id or null.
     */
    gamepadId(index)
    {
        return this.gamepadIds()[index || 0] || null;
    }

    /**
     * Return a list with connected devices ids.
     * @returns {Array<String>} List of connected devices ids.
     */
    gamepadIds()
    {
        let ret = [];
        for (let gp of this._gamepadsData) {
            if (gp) { ret.push(gp.id); }
        }
        return ret;
    }

    /**
     * Get touch screen touching position.
     * Note: if not currently touching, will return last known position.
     * @returns {Vector2} Touch position.
     */
    get touchPosition()
    {
        return this._touchPosition.clone();
    }

    /**
     * Get if currently touching a touch screen.
     * @returns {Boolean} True if currently touching the screen.
     */
    get touching()
    {
        return this._isTouching;
    }

    /**
     * Get if started touching a touch screen in current frame.
     * @returns {Boolean} True if started touching the screen now.
     */
    get touchStarted()
    {
        return this._touchStarted;
    }
    
    /**
     * Get if stopped touching a touch screen in current frame.
     * @returns {Boolean} True if stopped touching the screen now.
     */
    get touchEnded()
    {
        return this._touchEnded;
    }

    /**
     * Set a custom key code state you can later use with all the built in methods (down / pressed / released / doublePressed, etc.)
     * For example, lets say you want to implement a simulated keyboard and use it alongside the real keyboard. 
     * When your simulated keyboard space key is pressed, you can call `setCustomState('sim_space', true)`. When released, call `setCustomState('sim_space', false)`.
     * Now you can use `Shaku.input.down(['space', 'sim_space'])` to check if either a real space or simulated space is pressed down.
     * @param {String} code Code to set state for.
     * @param {Boolean} value Current value to set.
     */
    setCustomState(code, value)
    {
        // set state
        const prev = Boolean(this._customStates[code]);
        this._customStates[code] = value;

        // pressed now?
        if (!prev && value) {
            this._customPressed[code] = true;
            this._prevLastCustomPressedTime[code] = this._lastCustomPressedTime[code];
            this._lastCustomPressedTime[code] = timestamp();
        }

        // released now?
        if (prev && !value) {
            this._customReleased[code] = true;
            this._prevLastCustomReleasedTime[code] = this._lastCustomReleasedTime[code];
            this._lastCustomReleasedTime[code] = timestamp();
        }
    }

    /**
     * Get mouse position.
     * @returns {Vector2} Mouse position.
     */
    get mousePosition()
    {
        return this._mousePos.clone();
    }
        
    /**
     * Get mouse previous position (before the last endFrame() call).
     * @returns {Vector2} Mouse position in previous frame.
     */
    get prevMousePosition()
    {
        return (this._mousePrevPos || this._mousePos).clone();
    }

    /**
     * Get mouse movement since last endFrame() call.
     * @returns {Vector2} Mouse change since last frame.
     */
    get mouseDelta()
    {
        // no previous position? return 0,0.
        if (!this._mousePrevPos) {
            return Vector2.zero;
        }

        // return mouse delta
        return new Vector2(this._mousePos.x - this._mousePrevPos.x, this._mousePos.y - this._mousePrevPos.y);
    }

    /**
     * Get if mouse is currently moving.
     * @returns {Boolean} True if mouse moved since last frame, false otherwise.
     */
    get mouseMoving()
    {
        return (this._mousePrevPos && !this._mousePrevPos.equals(this._mousePos));
    }

    /**
     * Get if mouse button was pressed this frame.
     * @param {MouseButton} button Button code (defults to MouseButtons.left).
     * @returns {Boolean} True if mouse button is currently down, but was up in previous frame.
     */
    mousePressed(button = 0)
    {
        if (button === undefined) throw new Error("Invalid button code!");
        return Boolean(this._mousePressed[button]);
    }

    /**
     * Get if mouse button is currently pressed.
     * @param {MouseButton} button Button code (defults to MouseButtons.left).  
     * @returns {Boolean} true if mouse button is currently down, false otherwise.
     */
    mouseDown(button = 0)
    {
        if (button === undefined) throw new Error("Invalid button code!");
        return Boolean(this._mouseState[button]);
    }

    /**
     * Get if mouse button is currently not down.
     * @param {MouseButton} button Button code (defults to MouseButtons.left).
     * @returns {Boolean} true if mouse button is currently up, false otherwise.
     */
    mouseUp(button = 0)
    {
        if (button === undefined) throw new Error("Invalid button code!");
        return Boolean(!this.mouseDown(button));
    }
    
    /**
     * Get if mouse button was released in current frame.
     * @param {MouseButton} button Button code (defults to MouseButtons.left).
     * @returns {Boolean} True if mouse was down last frame, but released in current frame.
     */
    mouseReleased(button = 0)
    {
        if (button === undefined) throw new Error("Invalid button code!");
        return Boolean(this._mouseReleased[button]);
    }

    /**
     * Get if keyboard key is currently pressed down.
     * @param {KeyboardKey} key Keyboard key code.
     * @returns {boolean} True if keyboard key is currently down, false otherwise.
     */
    keyDown(key)
    {
        if (key === undefined) throw new Error("Invalid key code!");
        return Boolean(this._keyboardState[key]);
    }

    /**
     * Get if keyboard key is currently not down.
     * @param {KeyboardKey} key Keyboard key code.
     * @returns {Boolean} True if keyboard key is currently up, false otherwise.
     */
    keyUp(key)
    {
        if (key === undefined) throw new Error("Invalid key code!");
        return Boolean(!this.keyDown(key));
    }

    /**
     * Get if a keyboard button was released in current frame.
     * @param {KeyboardKey} button Keyboard key code.
     * @returns {Boolean} True if key was down last frame, but released in current frame.
     */
    keyReleased(key)
    {
        if (key === undefined) throw new Error("Invalid key code!");
        return Boolean(this._keyboardReleased[key]);
    }
    
    /**
     * Get if keyboard key was pressed this frame.
     * @param {KeyboardKey} key Keyboard key code.
     * @returns {Boolean} True if key is currently down, but was up in previous frame.
     */
    keyPressed(key)
    {
        if (key === undefined) throw new Error("Invalid key code!");
        return Boolean(this._keyboardPressed[key]);
    }

    /**
     * Get if any of the shift keys are currently down.
     * @returns {Boolean} True if there's a shift key pressed down.
     */
    get shiftDown()
    {
        return Boolean(this.keyDown(this.KeyboardKeys.shift));
    }

    /**
     * Get if any of the Ctrl keys are currently down.
     * @returns {Boolean} True if there's a Ctrl key pressed down.
     */
    get ctrlDown()
    {
        return Boolean(this.keyDown(this.KeyboardKeys.ctrl));
    }

    /**
     * Get if any of the Alt keys are currently down.
     * @returns {Boolean} True if there's an Alt key pressed down.
     */
    get altDown()
    {
        return Boolean(this.keyDown(this.KeyboardKeys.alt));
    }

    /**
     * Get if any keyboard key was pressed this frame.
     * @returns {Boolean} True if any key was pressed down this frame.
     */
    get anyKeyPressed()
    {
        return Object.keys(this._keyboardPressed).length !== 0;
    }

    /**
     * Get if any keyboard key is currently down.
     * @returns {Boolean} True if there's a key pressed down.
     */
    get anyKeyDown()
    {
        for (var key in this._keyboardState) {
            if (this._keyboardState[key]) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get if any mouse button was pressed this frame.
     * @returns {Boolean} True if any of the mouse buttons were pressed this frame.
     */
     get anyMouseButtonPressed()
     {
        return Object.keys(this._mousePressed).length !== 0;
     }

    /**
     * Get if any mouse button is down.
     * @returns {Boolean} True if any of the mouse buttons are pressed.
     */
    get anyMouseButtonDown()
    {
        for (var key in this._mouseState) {
            if (this._mouseState[key]) {
                return true;
            }
        }
        return false;
    }

    /**
     * Return if a mouse or keyboard state in a generic way. Used internally.
     * @private
     * @param {string} code Keyboard, mouse or touch code. 
     *                          For mouse buttons: mouse_left, mouse_right or mouse_middle.
     *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).
     *                          For touch: just use 'touch' as code.
     *                          For numbers (0-9): you can use the number.
     * @param {Function} mouseCheck Callback to use to return value if its a mouse button code.
     * @param {Function} keyboardCheck Callback to use to return value if its a keyboard key code.
     * @param {*} touchValue Value to use to return value if its a touch code.
     * @param {*} customValues Dictionary to check for custom values injected via setCustomState().
     */
    _getValueWithCode(code, mouseCheck, keyboardCheck, touchValue, customValues)
    {
        // make sure code is string
        code = String(code);

        // check for custom values
        const customVal = customValues[code];
        if (customVal !== undefined) {
            return customVal;
        }

        // if its 'touch' its for touch events
        if (code === _touchKeyCode) {
            return touchValue;
        }

        // if starts with 'mouse' its for mouse button events
        if (code.indexOf('mouse_') === 0) {

            // get mouse code name
            const codename = code.split('_')[1];

            // return if mouse down
            return mouseCheck.call(this, this.MouseButtons[codename]);
        }

        // if its just a number, add the 'n' prefix
        if (!isNaN(parseInt(code)) && code.length === 1) {
            code = 'n' + code;
        }

        // if not start with 'mouse', treat it as a keyboard key
        return keyboardCheck.call(this, this.KeyboardKeys[code]);
    }

    /**
     * Return if a mouse or keyboard button is currently down.
     * @example
     * if (Shaku.input.down(['mouse_left', 'touch', 'space'])) { alert('mouse, touch screen or space are pressed!'); }
     * @param {string|Array<String>} code Keyboard, touch or mouse code. Can be array of codes to test if any of them is pressed.
     *                          For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.
     *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).
     *                          For touch screen: set code to 'touch'.
     *                          For numbers (0-9): you can use the number itself.
     *                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
     * @returns {Boolean} True if key or mouse button are down.
     */
    down(code)
    {
        if (!(code instanceof Array)) { code = [code]; }
        for (let c of code) {
            if (Boolean(this._getValueWithCode(c, this.mouseDown, this.keyDown, this.touching, this._customStates))) {
                return true;
            }
        }
        return false;
    }

    /**
     * Return if a mouse or keyboard button was released in this frame.
     * @example
     * if (Shaku.input.released(['mouse_left', 'touch', 'space'])) { alert('mouse, touch screen or space were released!'); }
     * @param {string|Array<String>} code Keyboard, touch or mouse code. Can be array of codes to test if any of them is pressed.
     *                          For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.
     *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).
     *                          For touch screen: set code to 'touch'.
     *                          For numbers (0-9): you can use the number itself.
     *                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
     * @returns {Boolean} True if key or mouse button were down in previous frame, and released this frame.
     */
    released(code)
    {
        if (!(code instanceof Array)) { code = [code]; }
        for (let c of code) {
            if (Boolean(this._getValueWithCode(c, this.mouseReleased, this.keyReleased, this.touchEnded, this._customReleased))) {
                return true;
            }
        }
        return false;
    }

    /**
     * Return if a mouse or keyboard button was pressed in this frame.
     * @example
     * if (Shaku.input.pressed(['mouse_left', 'touch', 'space'])) { alert('mouse, touch screen or space were pressed!'); }
     * @param {string|Array<String>} code Keyboard, touch or mouse code. Can be array of codes to test if any of them is pressed.
     *                          For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.
     *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).
     *                          For touch screen: set code to 'touch'.
     *                          For numbers (0-9): you can use the number itself.
     *                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
     * @returns {Boolean} True if key or mouse button where up in previous frame, and pressed this frame.
     */
    pressed(code)
    {
        if (!(code instanceof Array)) { code = [code]; }
        for (let c of code) {
            if (Boolean(this._getValueWithCode(c, this.mousePressed, this.keyPressed, this.touchStarted, this._customPressed))) {
                return true;
            }
        }
        return false;
    }

    /**
     * Return timestamp, in milliseconds, of the last time this key code was released.
     * @example
     * let lastReleaseTime = Shaku.input.lastReleaseTime('mouse_left');
     * @param {string} code Keyboard, touch or mouse code.
     *                          For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.
     *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).
     *                          For touch screen: set code to 'touch'.
     *                          For numbers (0-9): you can use the number itself.
     *                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
     * @returns {Number} Timestamp of last key release, or 0 if was never released.
     */
    lastReleaseTime(code)
    {
        if (code instanceof Array) { throw new Error("Array not supported in 'lastReleaseTime'!"); }
        return this._getValueWithCode(code, (c) => this._lastMouseReleasedTime[c], (c) => this._lastKeyReleasedTime[c], this._lastTouchReleasedTime, this._prevLastCustomReleasedTime) || 0;
    }

    /**
     * Return timestamp, in milliseconds, of the last time this key code was pressed.
     * @example
     * let lastPressTime = Shaku.input.lastPressTime('mouse_left');
     * @param {string} code Keyboard, touch or mouse code.
     *                          For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.
     *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).
     *                          For touch screen: set code to 'touch'.
     *                          For numbers (0-9): you can use the number itself.
     *                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
     * @returns {Number} Timestamp of last key press, or 0 if was never pressed.
     */
    lastPressTime(code)
    {
        if (code instanceof Array) { throw new Error("Array not supported in 'lastPressTime'!"); }
        return this._getValueWithCode(code, (c) => this._lastMousePressedTime[c], (c) => this._lastKeyPressedTime[c], this._lastTouchPressedTime, this._prevLastCustomPressedTime) || 0;
    }
    
    /**
     * Return if a key was double-pressed.
     * @example
     * let doublePressed = Shaku.input.doublePressed(['mouse_left', 'touch', 'space']);
     * @param {string} code Keyboard, touch or mouse code. Can be array of codes to test if any of them is double-pressed.
     *                          For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.
     *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).
     *                          For touch screen: set code to 'touch'.
     *                          For numbers (0-9): you can use the number itself.
     *                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
     * @param {Number} maxInterval Max interval time, in milliseconds, to consider it a double-press. Defaults to `defaultDoublePressInterval`.
     * @returns {Boolean} True if one or more key codes double-pressed, false otherwise.
     */ 
    doublePressed(code, maxInterval)
    {
        // default interval
        maxInterval = maxInterval || this.defaultDoublePressInterval;

        // current timestamp
        let currTime = timestamp();

        // check all keys
        if (!(code instanceof Array)) { code = [code]; }
        for (let c of code) {
            if (this.pressed(c)) {
                let currKeyTime = this._getValueWithCode(c, (c) => this._prevLastMousePressedTime[c], (c) => this._prevLastKeyPressedTime[c], this._prevLastTouchPressedTime, this._prevLastCustomPressedTime);
                if (currTime - currKeyTime <= maxInterval) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Return if a key was double-released.
     * @example
     * let doubleReleased = Shaku.input.doubleReleased(['mouse_left', 'touch', 'space']);
     * @param {string} code Keyboard, touch or mouse code. Can be array of codes to test if any of them is double-released.
     *                          For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.
     *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).
     *                          For touch screen: set code to 'touch'.
     *                          For numbers (0-9): you can use the number itself.
     *                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
     * @param {Number} maxInterval Max interval time, in milliseconds, to consider it a double-release. Defaults to `defaultDoublePressInterval`.
     * @returns {Boolean} True if one or more key codes double-released, false otherwise.
     */ 
    doubleReleased(code, maxInterval)
    {
        // default interval
        maxInterval = maxInterval || this.defaultDoublePressInterval;

        // current timestamp
        let currTime = timestamp();

        // check all keys
        if (!(code instanceof Array)) { code = [code]; }
        for (let c of code) {
            if (this.released(c)) {
                let currKeyTime = this._getValueWithCode(c, (c) => this._prevLastMousePressedTime[c], (c) => this._prevLastKeyPressedTime[c], this._prevLastTouchPressedTime, this._prevLastCustomPressedTime);
                if (currTime - currKeyTime <= maxInterval) {
                    return true;
                }
            }
        }
        return false;
    }
    
    /**
     * Get mouse wheel sign.
     * @returns {Number} Mouse wheel sign (-1 or 1) for wheel scrolling that happened during this frame.
     * Will return 0 if mouse wheel is not currently being used.
     */
    get mouseWheelSign()
    {
        return Math.sign(this._mouseWheel);
    }

    /**
     * Get mouse wheel value.
     * @returns {Number} Mouse wheel value.
     */
    get mouseWheel()
    {
        return this._mouseWheel;
    }

    /**
     * @inheritdoc
     * @private
     **/
    endFrame()
    {
        // set mouse previous position and clear mouse move cache
        this._mousePrevPos = this._mousePos.clone();

        // reset pressed / release events
        this._keyboardPressed = {};
        this._keyboardReleased = {};
        this._mousePressed = {};
        this._mouseReleased = {};
        this._customPressed = {};
        this._customReleased = {};

        // reset touch start / end states
        this._touchStarted = false;
        this._touchEnded = false;

        // reset mouse wheel
        this._mouseWheel = 0;
    }

    /**
     * Get keyboard key code from event.
     * @private
     */
    _getKeyboardKeyCode(event)
    {
        event = this._getEvent(event);
        return event.keyCode !== undefined ? event.keyCode : event.key.charCodeAt(0);
    }

    /**
     * Called when window loses focus - clear all input states to prevent keys getting stuck.
     * @private
     */
    _onBlur(event)
    {
        if (this.resetOnFocusLoss) {
            this._resetAll();
        }
    }

    /**
     * Handle mouse wheel events.
     * @private
     * @param {*} event Event data from browser.
     */
    _onMouseWheel(event)
    {
        this._mouseWheel = event.deltaY;
    }

    /**
     * Handle keyboard down event.
     * @private
     * @param {*} event Event data from browser.
     */
    _onKeyDown(event)
    {
        var keycode = this._getKeyboardKeyCode(event);
        if (!this._keyboardState[keycode]) {
            this._keyboardPressed[keycode] = true;
            this._prevLastKeyPressedTime[keycode] = this._lastKeyPressedTime[keycode];
            this._lastKeyPressedTime[keycode] = timestamp();
        }
        this._keyboardState[keycode] = true;
    }

    /**
     * Handle keyboard up event.
     * @private
     * @param {*} event Event data from browser.
     */
    _onKeyUp(event)
    {
        var keycode = this._getKeyboardKeyCode(event) || 0;
        this._keyboardState[keycode] = false;
        this._keyboardReleased[keycode] = true;
        this._prevLastKeyReleasedTime[keycode] = this._lastKeyReleasedTime[keycode];
        this._lastKeyReleasedTime[keycode] = timestamp();
    }

    /**
     * Extract position from touch event.
     * @private
     * @param {*} event Event data from browser.
     * @returns {Vector2} Position x,y or null if couldn't extract touch position.
     */
    _getTouchEventPosition(event)
    {
        var touches = event.changedTouches || event.touches;
        if (touches && touches.length) {
            var touch = touches[0];
            var x = touch.pageX || touch.offsetX || touch.clientX;
            var y = touch.pageY || touch.offsetY || touch.clientY;
            return new Vector2(x, y);
        }
        return null;
    }

    /**
     * Handle touch start event.
     * @private
     * @param {*} event Event data from browser.
     */
    _onTouchStart(event)
    {
        // update position
        let position = this._getTouchEventPosition(event);
        if (position) {
            if (this.delegateTouchInputToMouse) {
                this._mousePos.x = position.x;
                this._mousePos.y = position.y;
                this._normalizeMousePos();
            }
        }

        // set touching flag
        this._isTouching = true;
        this._touchStarted = true;

        // update time
        this._prevLastTouchPressedTime = this._lastTouchPressedTime;
        this._lastTouchPressedTime = timestamp();

        // mark that touch started
        if (this.delegateTouchInputToMouse) {
            this._mouseButtonDown(this.MouseButtons.left);
        }
    }

    /**
     * Handle touch end event.
     * @private
     * @param {*} event Event data from browser.
     */
    _onTouchEnd(event)
    {
        // update position
        let position = this._getTouchEventPosition(event);
        if (position) {
            this._touchPosition.copy(position);
            if (this.delegateTouchInputToMouse) {
                this._mousePos.x = position.x;
                this._mousePos.y = position.y;
                this._normalizeMousePos();
            }
        }

        // clear touching flag
        this._isTouching = false;
        this._touchEnded = true;

        // update touch end time
        this._prevLastTouchReleasedTime = this._lastTouchReleasedTime;
        this._lastTouchReleasedTime = timestamp();

        // mark that touch ended
        if (this.delegateTouchInputToMouse) {
            this._mouseButtonUp(this.MouseButtons.left);
        }
    }
    
    /**
     * Handle touch move event.
     * @private
     * @param {*} event Event data from browser.
     */
    _onTouchMove(event)
    {
        // update position
        let position = this._getTouchEventPosition(event);
        if (position) {
            this._touchPosition.copy(position);
            if (this.delegateTouchInputToMouse) {
                this._mousePos.x = position.x;
                this._mousePos.y = position.y;
                this._normalizeMousePos();
            }
        }

        // set touching flag
        this._isTouching = true;
    }
    
    /**
     * Handle mouse down event.
     * @private
     * @param {*} event Event data from browser.
     */
    _onMouseDown(event)
    {
        event = this._getEvent(event);
        if (this.enableMouseDeltaWhileMouseWheelDown && (event.button === this.MouseButtons.middle))
        { 
            event.preventDefault(); 
        }
        this._mouseButtonDown(event.button);
    }

    /**
     * Handle mouse up event.
     * @private
     * @param {*} event Event data from browser.
     */
    _onMouseUp(event)
    {
        event = this._getEvent(event);
        this._mouseButtonUp(event.button);
    }

    /**
     * Mouse button pressed logic.
     * @private
     * @param {*} button Button pressed.
     */
    _mouseButtonDown(button)
    {
        this._mouseState[button] = true;
        this._mousePressed[button] = true;
        this._prevLastMousePressedTime[button] = this._lastMousePressedTime[button];
        this._lastMousePressedTime[button] = timestamp();
    }

    /**
     * Mouse button released logic.
     * @private
     * @param {*} button Button released.
     */
    _mouseButtonUp(button)
    {
        this._mouseState[button] = false;
        this._mouseReleased[button] = true;
        this._prevLastMouseReleasedTime[button] = this._lastMouseReleasedTime[button];
        this._lastMouseReleasedTime[button] = timestamp();
    }
    
    /**
     * Handle mouse move event.
     * @private
     * @param {*} event Event data from browser.
     */
    _onMouseMove(event)
    {
        // get event in a cross-browser way
        event = this._getEvent(event);

        // try to get position from event with some fallbacks
        var pageX = event.clientX; 
        if (pageX === undefined) { pageX = event.x; } 
        if (pageX === undefined) { pageX = event.offsetX; } 
        if (pageX === undefined) { pageX = event.pageX; }

        var pageY = event.clientY; 
        if (pageY === undefined) { pageY = event.y; } 
        if (pageY === undefined) { pageY = event.offsetY; } 
        if (pageY === undefined) { pageY = event.pageY; }

        // if pageX and pageY are not supported, use clientX and clientY instead
        if (pageX === undefined) {
            pageX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            pageY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

        // set current mouse position
        this._mousePos.x = pageX;
        this._mousePos.y = pageY;
        this._normalizeMousePos();
    }

    /**
     * Normalize current _mousePos value to be relative to target element.
     * @private
     */
    _normalizeMousePos()
    {
        if (this._targetElement && this._targetElement.getBoundingClientRect) {
            var rect = this._targetElement.getBoundingClientRect();
            this._mousePos.x -= rect.left;
            this._mousePos.y -= rect.top;
        }
        this._mousePos.roundSelf();
    }

    /**
     * Get event either from event param or from window.event. 
     * This is for older browsers support.
     * @private
     */
    _getEvent(event)
    {
        return event || window.event;
    }
}


// export main object
module.exports = new Input();