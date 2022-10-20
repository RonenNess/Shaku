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
const _logger = require('../logger.js').getLogger('input');


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
         * If true (default), will reset all states if the window loses focus.
         * @name Input#disableContextMenu
         * @type {Boolean}
         */
        this.resetOnFocusLoss = true;

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

            resolve();
        });
    }

    /**
     * @inheritdoc
     * @private
     **/
    startFrame()
    {

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
    get isTouching()
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
     * Return if a mouse or keyboard state in a generic way, used internally.
     * @private
     * @param {string} code Keyboard or mouse code. 
     *                          For mouse buttons: mouse_left, mouse_right or mouse_middle.
     *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..)
     *                          For numbers (0-9): you can use the number.
     * @param {Function} mouseCheck Callback to use to return value if its a mouse button code.
     * @param {Function} keyboardCheck Callback to use to return value if its a keyboard key code.
     */
    _getValueWithCode(code, mouseCheck, keyboardCheck)
    {
        // make sure code is string
        code = String(code);

        // if starts with 'mouse' its for mouse button events
        if (code.indexOf('mouse_') === 0) {

            // get mouse code name
            var codename = code.split('_')[1];

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
     * @param {string|Array<String>} code Keyboard or mouse code. Can be array of codes to test if any of them is down.
     *                          For mouse buttons: mouse_left, mouse_right or mouse_middle.
     *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..)
     *                          For numbers (0-9): you can use the number.
     * @returns {Boolean} True if key or mouse button are down.
     */
    down(code)
    {
        if (!(code instanceof Array)) { code = [code]; }
        for (let c of code) {
            if (Boolean(this._getValueWithCode(c, this.mouseDown, this.keyDown))) {
                return true;
            }
        }
        return false;
    }

    /**
     * Return if a mouse or keyboard button was released in this frame.
     * @param {string|Array<String>} code Keyboard or mouse code. Can be array of codes to test if any of them is released.
     *                          For mouse buttons: mouse_left, mouse_right or mouse_middle.
     *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..)
     *                          For numbers (0-9): you can use the number.
     * @returns {Boolean} True if key or mouse button were down in previous frame, and released this frame.
     */
    released(code)
    {
        if (!(code instanceof Array)) { code = [code]; }
        for (let c of code) {
            if (Boolean(this._getValueWithCode(c, this.mouseReleased, this.keyReleased))) {
                return true;
            }
        }
        return false;
    }

    /**
     * Return if a mouse or keyboard button was pressed in this frame.
     * @param {string|Array<String>} code Keyboard or mouse code. Can be array of codes to test if any of them is pressed.
     *                          For mouse buttons: mouse_left, mouse_right or mouse_middle.
     *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..)
     *                          For numbers (0-9): you can use the number.
     * @returns {Boolean} True if key or mouse button where up in previous frame, and pressed this frame.
     */
    pressed(code)
    {
        if (!(code instanceof Array)) { code = [code]; }
        for (let c of code) {
            if (Boolean(this._getValueWithCode(c, this.mousePressed, this.keyPressed))) {
                return true;
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
        this._keyboardState[keycode] = true;
        this._keyboardPressed[keycode] = true;
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

        // mark that touch started
        if (this.delegateTouchInputToMouse) {
            this._mouseState[this.MouseButtons.left] = true;
            this._mousePressed[this.MouseButtons.left] = true;
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
        
        // mark that touch ended
        if (this.delegateTouchInputToMouse) {
            this._mouseState[this.MouseButtons.left] = false;
            this._mouseReleased[this.MouseButtons.left] = true;
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
        // update mouse down state
        event = this._getEvent(event);
        if (this.enableMouseDeltaWhileMouseWheelDown && (event.button === this.MouseButtons.middle))
        { 
            event.preventDefault(); 
        }
        this._mouseState[event.button] = true;
        this._mousePressed[event.button] = true;
    }

    /**
     * Handle mouse up event.
     * @private
     * @param {*} event Event data from browser.
     */
    _onMouseUp(event)
    {
        event = this._getEvent(event);
        this._mouseState[event.button] = false;
        this._mousePressed[event.button] = true;
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