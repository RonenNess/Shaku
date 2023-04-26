![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Input

<a name="Input"></a>

## Input
Input manager. 
Used to recieve input from keyboard and mouse.

To access the Input manager use `Shaku.input`.

**Kind**: global class  

* [Input](#Input)
    * [new Input()](#new_Input_new)
    * [.preventDefaults](#Input+preventDefaults) : <code>Boolean</code>
    * [.disableMouseWheelAutomaticScrolling](#Input+disableMouseWheelAutomaticScrolling) : <code>Boolean</code>
    * [.disableContextMenu](#Input+disableContextMenu) : <code>Boolean</code>
    * [.delegateTouchInputToMouse](#Input+delegateTouchInputToMouse) : <code>Boolean</code>
    * [.delegateGamepadInputToKeys](#Input+delegateGamepadInputToKeys) : <code>Boolean</code>
    * [.resetOnFocusLoss](#Input+resetOnFocusLoss) : <code>Boolean</code>
    * [.defaultDoublePressInterval](#Input+defaultDoublePressInterval) : <code>Number</code>
    * [.MouseButtons](#Input+MouseButtons)
    * [.KeyboardKeys](#Input+KeyboardKeys)
    * [.TouchKeyCode](#Input+TouchKeyCode) ⇒ <code>String</code>
    * [.touchPosition](#Input+touchPosition) ⇒ <code>Vector2</code>
    * [.touching](#Input+touching) ⇒ <code>Boolean</code>
    * [.touchStarted](#Input+touchStarted) ⇒ <code>Boolean</code>
    * [.touchEnded](#Input+touchEnded) ⇒ <code>Boolean</code>
    * [.mousePosition](#Input+mousePosition) ⇒ <code>Vector2</code>
    * [.prevMousePosition](#Input+prevMousePosition) ⇒ <code>Vector2</code>
    * [.mouseDelta](#Input+mouseDelta) ⇒ <code>Vector2</code>
    * [.mouseMoving](#Input+mouseMoving) ⇒ <code>Boolean</code>
    * [.shiftDown](#Input+shiftDown) ⇒ <code>Boolean</code>
    * [.ctrlDown](#Input+ctrlDown) ⇒ <code>Boolean</code>
    * [.altDown](#Input+altDown) ⇒ <code>Boolean</code>
    * [.anyKeyPressed](#Input+anyKeyPressed) ⇒ <code>Boolean</code>
    * [.anyKeyDown](#Input+anyKeyDown) ⇒ <code>Boolean</code>
    * [.anyMouseButtonPressed](#Input+anyMouseButtonPressed) ⇒ <code>Boolean</code>
    * [.anyMouseButtonDown](#Input+anyMouseButtonDown) ⇒ <code>Boolean</code>
    * [.mouseWheelSign](#Input+mouseWheelSign) ⇒ <code>Number</code>
    * [.mouseWheel](#Input+mouseWheel) ⇒ <code>Number</code>
    * [.setTargetElement(element)](#Input+setTargetElement)
    * [.gamepad([index])](#Input+gamepad) ⇒ <code>Gamepad</code>
    * [.gamepadId([index])](#Input+gamepadId) ⇒
    * [.gamepadIds()](#Input+gamepadIds) ⇒ <code>Array.&lt;String&gt;</code>
    * [.setCustomState(code, value)](#Input+setCustomState)
    * [.mousePressed(button)](#Input+mousePressed) ⇒ <code>Boolean</code>
    * [.mouseDown(button)](#Input+mouseDown) ⇒ <code>Boolean</code>
    * [.mouseUp(button)](#Input+mouseUp) ⇒ <code>Boolean</code>
    * [.mouseReleased(button)](#Input+mouseReleased) ⇒ <code>Boolean</code>
    * [.keyDown(key)](#Input+keyDown) ⇒ <code>boolean</code>
    * [.keyUp(key)](#Input+keyUp) ⇒ <code>Boolean</code>
    * [.keyReleased(button)](#Input+keyReleased) ⇒ <code>Boolean</code>
    * [.keyPressed(key)](#Input+keyPressed) ⇒ <code>Boolean</code>
    * [.down(code)](#Input+down) ⇒ <code>Boolean</code>
    * [.released(code)](#Input+released) ⇒ <code>Boolean</code>
    * [.pressed(code)](#Input+pressed) ⇒ <code>Boolean</code>
    * [.lastReleaseTime(code)](#Input+lastReleaseTime) ⇒ <code>Number</code>
    * [.lastPressTime(code)](#Input+lastPressTime) ⇒ <code>Number</code>
    * [.doublePressed(code, maxInterval)](#Input+doublePressed) ⇒ <code>Boolean</code>
    * [.doubleReleased(code, maxInterval)](#Input+doubleReleased) ⇒ <code>Boolean</code>

<a name="new_Input_new"></a>

### new Input()
Create the manager.

<a name="Input+preventDefaults"></a>

### input.preventDefaults : <code>Boolean</code>
If true, will prevent default input events by calling preventDefault().

**Kind**: instance property of [<code>Input</code>](#Input)  
<a name="Input+disableMouseWheelAutomaticScrolling"></a>

### input.disableMouseWheelAutomaticScrolling : <code>Boolean</code>
By default, when holding wheel button down browsers will turn into special page scroll mode and will not emit mouse move events.
if this property is set to true (default), the Input manager will prevent this behavior, so we could still get mouse delta while mouse wheel is held down.

**Kind**: instance property of [<code>Input</code>](#Input)  
<a name="Input+disableContextMenu"></a>

### input.disableContextMenu : <code>Boolean</code>
If true (default), will disable the context menu (what typically opens when you right click the page).

**Kind**: instance property of [<code>Input</code>](#Input)  
<a name="Input+delegateTouchInputToMouse"></a>

### input.delegateTouchInputToMouse : <code>Boolean</code>
If true (default), will treat touch events (touch start / touch end / touch move) as if the user clicked and moved a mouse.

**Kind**: instance property of [<code>Input</code>](#Input)  
<a name="Input+delegateGamepadInputToKeys"></a>

### input.delegateGamepadInputToKeys : <code>Boolean</code>
If true (default), will delegate events from mapped gamepads to custom keys. 
This will add the following codes to all basic query methods (down, pressed, released, doublePressed, doubleReleased):
- gamepadX_top: state of arrow keys top key (left buttons).
- gamepadX_bottom: state of arrow keys bottom key (left buttons).
- gamepadX_left: state of arrow keys left key (left buttons).
- gamepadX_right: state of arrow keys right key (left buttons).
- gamepadX_leftStickUp: true if left stick points directly up.
- gamepadX_leftStickDown: true if left stick points directly down.
- gamepadX_leftStickLeft: true if left stick points directly left.
- gamepadX_leftStickRight: true if left stick points directly right.
- gamepadX_rightStickUp: true if right stick points directly up.
- gamepadX_rightStickDown: true if right stick points directly down.
- gamepadX_rightStickLeft: true if right stick points directly left.
- gamepadX_rightStickRight: true if right stick points directly right.
- gamepadX_a: state of A key (from right buttons).
- gamepadX_b: state of B key (from right buttons).
- gamepadX_x: state of X key (from right buttons).
- gamepadX_y: state of Y key (from right buttons).
- gamepadX_frontTopLeft: state of the front top-left button.
- gamepadX_frontTopRight: state of the front top-right button.
- gamepadX_frontBottomLeft: state of the front bottom-left button.
- gamepadX_frontBottomRight: state of the front bottom-right button.
Where X in `gamepad` is the gamepad index: gamepad0, gamepad1, gamepad2..

**Kind**: instance property of [<code>Input</code>](#Input)  
<a name="Input+resetOnFocusLoss"></a>

### input.resetOnFocusLoss : <code>Boolean</code>
If true (default), will reset all states if the window loses focus.

**Kind**: instance property of [<code>Input</code>](#Input)  
<a name="Input+defaultDoublePressInterval"></a>

### input.defaultDoublePressInterval : <code>Number</code>
Default time, in milliseconds, to consider two consecutive key presses as a double-press.

**Kind**: instance property of [<code>Input</code>](#Input)  
<a name="Input+MouseButtons"></a>

### input.MouseButtons
Get the Mouse Buttons enum.

**Kind**: instance property of [<code>Input</code>](#Input)  
**See**: MouseButtons  
<a name="Input+KeyboardKeys"></a>

### input.KeyboardKeys
Get the Keyboard Buttons enum.

**Kind**: instance property of [<code>Input</code>](#Input)  
**See**: KeyboardKeys  
<a name="Input+TouchKeyCode"></a>

### input.TouchKeyCode ⇒ <code>String</code>
Return the string code to use in order to get touch events.

**Kind**: instance property of [<code>Input</code>](#Input)  
**Returns**: <code>String</code> - Key code to use for touch events.  
<a name="Input+touchPosition"></a>

### input.touchPosition ⇒ <code>Vector2</code>
Get touch screen touching position.
Note: if not currently touching, will return last known position.

**Kind**: instance property of [<code>Input</code>](#Input)  
**Returns**: <code>Vector2</code> - Touch position.  
<a name="Input+touching"></a>

### input.touching ⇒ <code>Boolean</code>
Get if currently touching a touch screen.

**Kind**: instance property of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if currently touching the screen.  
<a name="Input+touchStarted"></a>

### input.touchStarted ⇒ <code>Boolean</code>
Get if started touching a touch screen in current frame.

**Kind**: instance property of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if started touching the screen now.  
<a name="Input+touchEnded"></a>

### input.touchEnded ⇒ <code>Boolean</code>
Get if stopped touching a touch screen in current frame.

**Kind**: instance property of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if stopped touching the screen now.  
<a name="Input+mousePosition"></a>

### input.mousePosition ⇒ <code>Vector2</code>
Get mouse position.

**Kind**: instance property of [<code>Input</code>](#Input)  
**Returns**: <code>Vector2</code> - Mouse position.  
<a name="Input+prevMousePosition"></a>

### input.prevMousePosition ⇒ <code>Vector2</code>
Get mouse previous position (before the last endFrame() call).

**Kind**: instance property of [<code>Input</code>](#Input)  
**Returns**: <code>Vector2</code> - Mouse position in previous frame.  
<a name="Input+mouseDelta"></a>

### input.mouseDelta ⇒ <code>Vector2</code>
Get mouse movement since last endFrame() call.

**Kind**: instance property of [<code>Input</code>](#Input)  
**Returns**: <code>Vector2</code> - Mouse change since last frame.  
<a name="Input+mouseMoving"></a>

### input.mouseMoving ⇒ <code>Boolean</code>
Get if mouse is currently moving.

**Kind**: instance property of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if mouse moved since last frame, false otherwise.  
<a name="Input+shiftDown"></a>

### input.shiftDown ⇒ <code>Boolean</code>
Get if any of the shift keys are currently down.

**Kind**: instance property of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if there's a shift key pressed down.  
<a name="Input+ctrlDown"></a>

### input.ctrlDown ⇒ <code>Boolean</code>
Get if any of the Ctrl keys are currently down.

**Kind**: instance property of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if there's a Ctrl key pressed down.  
<a name="Input+altDown"></a>

### input.altDown ⇒ <code>Boolean</code>
Get if any of the Alt keys are currently down.

**Kind**: instance property of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if there's an Alt key pressed down.  
<a name="Input+anyKeyPressed"></a>

### input.anyKeyPressed ⇒ <code>Boolean</code>
Get if any keyboard key was pressed this frame.

**Kind**: instance property of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if any key was pressed down this frame.  
<a name="Input+anyKeyDown"></a>

### input.anyKeyDown ⇒ <code>Boolean</code>
Get if any keyboard key is currently down.

**Kind**: instance property of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if there's a key pressed down.  
<a name="Input+anyMouseButtonPressed"></a>

### input.anyMouseButtonPressed ⇒ <code>Boolean</code>
Get if any mouse button was pressed this frame.

**Kind**: instance property of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if any of the mouse buttons were pressed this frame.  
<a name="Input+anyMouseButtonDown"></a>

### input.anyMouseButtonDown ⇒ <code>Boolean</code>
Get if any mouse button is down.

**Kind**: instance property of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if any of the mouse buttons are pressed.  
<a name="Input+mouseWheelSign"></a>

### input.mouseWheelSign ⇒ <code>Number</code>
Get mouse wheel sign.

**Kind**: instance property of [<code>Input</code>](#Input)  
**Returns**: <code>Number</code> - Mouse wheel sign (-1 or 1) for wheel scrolling that happened during this frame.
Will return 0 if mouse wheel is not currently being used.  
<a name="Input+mouseWheel"></a>

### input.mouseWheel ⇒ <code>Number</code>
Get mouse wheel value.

**Kind**: instance property of [<code>Input</code>](#Input)  
**Returns**: <code>Number</code> - Mouse wheel value.  
<a name="Input+setTargetElement"></a>

### input.setTargetElement(element)
Set the target element to attach input to. If not called, will just use the entire document.
Must be called *before* initializing Shaku. This can also be a method to invoke while initializing.

**Kind**: instance method of [<code>Input</code>](#Input)  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>Element</code> \| <code>elementCallback</code> | Element to attach input to. |

**Example**  
```js
// the following will use whatever canvas the gfx manager uses as input element.
// this means mouse offset will also be relative to this element.
Shaku.input.setTargetElement(() => Shaku.gfx.canvas);
```
<a name="Input+gamepad"></a>

### input.gamepad([index]) ⇒ <code>Gamepad</code>
Get Gamepad current states, or null if not connected.
Note: this object does not update itself, you'll need to query it again every frame.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Gamepad</code> - Gamepad current state.  

| Param | Type | Description |
| --- | --- | --- |
| [index] | <code>Number</code> | Gamepad index or undefined for first connected device. |

<a name="Input+gamepadId"></a>

### input.gamepadId([index]) ⇒
Get gamepad id, or null if not connected to this slot.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: Gamepad id or null.  

| Param | Type | Description |
| --- | --- | --- |
| [index] | <code>Number</code> | Gamepad index or undefined for first connected device. |

<a name="Input+gamepadIds"></a>

### input.gamepadIds() ⇒ <code>Array.&lt;String&gt;</code>
Return a list with connected devices ids.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Array.&lt;String&gt;</code> - List of connected devices ids.  
<a name="Input+setCustomState"></a>

### input.setCustomState(code, value)
Set a custom key code state you can later use with all the built in methods (down / pressed / released / doublePressed, etc.)
For example, lets say you want to implement a simulated keyboard and use it alongside the real keyboard. 
When your simulated keyboard space key is pressed, you can call `setCustomState('sim_space', true)`. When released, call `setCustomState('sim_space', false)`.
Now you can use `Shaku.input.down(['space', 'sim_space'])` to check if either a real space or simulated space is pressed down.

**Kind**: instance method of [<code>Input</code>](#Input)  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>String</code> | Code to set state for. |
| value | <code>Boolean</code> \| <code>null</code> | Current value to set, or null to remove custom key. |

<a name="Input+mousePressed"></a>

### input.mousePressed(button) ⇒ <code>Boolean</code>
Get if mouse button was pressed this frame.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if mouse button is currently down, but was up in previous frame.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| button | <code>MouseButton</code> | <code>0</code> | Button code (defults to MouseButtons.left). |

<a name="Input+mouseDown"></a>

### input.mouseDown(button) ⇒ <code>Boolean</code>
Get if mouse button is currently pressed.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - true if mouse button is currently down, false otherwise.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| button | <code>MouseButton</code> | <code>0</code> | Button code (defults to MouseButtons.left). |

<a name="Input+mouseUp"></a>

### input.mouseUp(button) ⇒ <code>Boolean</code>
Get if mouse button is currently not down.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - true if mouse button is currently up, false otherwise.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| button | <code>MouseButton</code> | <code>0</code> | Button code (defults to MouseButtons.left). |

<a name="Input+mouseReleased"></a>

### input.mouseReleased(button) ⇒ <code>Boolean</code>
Get if mouse button was released in current frame.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if mouse was down last frame, but released in current frame.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| button | <code>MouseButton</code> | <code>0</code> | Button code (defults to MouseButtons.left). |

<a name="Input+keyDown"></a>

### input.keyDown(key) ⇒ <code>boolean</code>
Get if keyboard key is currently pressed down.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>boolean</code> - True if keyboard key is currently down, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>KeyboardKey</code> | Keyboard key code. |

<a name="Input+keyUp"></a>

### input.keyUp(key) ⇒ <code>Boolean</code>
Get if keyboard key is currently not down.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if keyboard key is currently up, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>KeyboardKey</code> | Keyboard key code. |

<a name="Input+keyReleased"></a>

### input.keyReleased(button) ⇒ <code>Boolean</code>
Get if a keyboard button was released in current frame.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if key was down last frame, but released in current frame.  

| Param | Type | Description |
| --- | --- | --- |
| button | <code>KeyboardKey</code> | Keyboard key code. |

<a name="Input+keyPressed"></a>

### input.keyPressed(key) ⇒ <code>Boolean</code>
Get if keyboard key was pressed this frame.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if key is currently down, but was up in previous frame.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>KeyboardKey</code> | Keyboard key code. |

<a name="Input+down"></a>

### input.down(code) ⇒ <code>Boolean</code>
Return if a mouse or keyboard button is currently down.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if key or mouse button are down.  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>string</code> \| <code>Array.&lt;String&gt;</code> | Keyboard, touch or mouse code. Can be array of codes to test any of them.                          For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).                          For touch screen: set code to 'touch'.                          For numbers (0-9): you can use the number itself.                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too. |

**Example**  
```js
if (Shaku.input.down(['mouse_left', 'touch', 'space'])) { alert('mouse, touch screen or space are pressed!'); }
```
<a name="Input+released"></a>

### input.released(code) ⇒ <code>Boolean</code>
Return if a mouse or keyboard button was released in this frame.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if key or mouse button were down in previous frame, and released this frame.  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>string</code> \| <code>Array.&lt;String&gt;</code> | Keyboard, touch, gamepad or mouse button code. Can be array of codes to test any of them.                          For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).                          For touch screen: set code to 'touch'.                          For numbers (0-9): you can use the number itself.                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too. |

**Example**  
```js
if (Shaku.input.released(['mouse_left', 'touch', 'space'])) { alert('mouse, touch screen or space were released!'); }
```
<a name="Input+pressed"></a>

### input.pressed(code) ⇒ <code>Boolean</code>
Return if a mouse or keyboard button was pressed in this frame.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if key or mouse button where up in previous frame, and pressed this frame.  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>string</code> \| <code>Array.&lt;String&gt;</code> | Keyboard, touch, gamepad or mouse button code. Can be array of codes to test any of them.                          For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).                          For touch screen: set code to 'touch'.                          For numbers (0-9): you can use the number itself.                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too. |

**Example**  
```js
if (Shaku.input.pressed(['mouse_left', 'touch', 'space'])) { alert('mouse, touch screen or space were pressed!'); }
```
<a name="Input+lastReleaseTime"></a>

### input.lastReleaseTime(code) ⇒ <code>Number</code>
Return timestamp, in milliseconds, of the last time this key code was released.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Number</code> - Timestamp of last key release, or 0 if was never released.  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>string</code> | Keyboard, touch, gamepad or mouse button code.                           For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).                          For touch screen: set code to 'touch'.                          For numbers (0-9): you can use the number itself.                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too. |

**Example**  
```js
let lastReleaseTime = Shaku.input.lastReleaseTime('mouse_left');
```
<a name="Input+lastPressTime"></a>

### input.lastPressTime(code) ⇒ <code>Number</code>
Return timestamp, in milliseconds, of the last time this key code was pressed.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Number</code> - Timestamp of last key press, or 0 if was never pressed.  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>string</code> | Keyboard, touch, gamepad or mouse button code.                           For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).                          For touch screen: set code to 'touch'.                          For numbers (0-9): you can use the number itself.                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too. |

**Example**  
```js
let lastPressTime = Shaku.input.lastPressTime('mouse_left');
```
<a name="Input+doublePressed"></a>

### input.doublePressed(code, maxInterval) ⇒ <code>Boolean</code>
Return if a key was double-pressed.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if one or more key codes double-pressed, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>string</code> \| <code>Array.&lt;string&gt;</code> | Keyboard, touch, gamepad or mouse button code. Can be array of codes to test any of them.                          For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).                          For touch screen: set code to 'touch'.                          For numbers (0-9): you can use the number itself.                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too. |
| maxInterval | <code>Number</code> | Max interval time, in milliseconds, to consider it a double-press. Defaults to `defaultDoublePressInterval`. |

**Example**  
```js
let doublePressed = Shaku.input.doublePressed(['mouse_left', 'touch', 'space']);
```
<a name="Input+doubleReleased"></a>

### input.doubleReleased(code, maxInterval) ⇒ <code>Boolean</code>
Return if a key was double-released.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if one or more key codes double-released, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>string</code> \| <code>Array.&lt;string&gt;</code> | Keyboard, touch, gamepad or mouse button code. Can be array of codes to test any of them.                          For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).                          For touch screen: set code to 'touch'.                          For numbers (0-9): you can use the number itself.                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too. |
| maxInterval | <code>Number</code> | Max interval time, in milliseconds, to consider it a double-release. Defaults to `defaultDoublePressInterval`. |

**Example**  
```js
let doubleReleased = Shaku.input.doubleReleased(['mouse_left', 'touch', 'space']);
```
