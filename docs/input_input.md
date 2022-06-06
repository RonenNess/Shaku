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
    * [.mousePosition](#Input+mousePosition) ⇒ <code>Vector2</code>
    * [.prevMousePosition](#Input+prevMousePosition) ⇒ <code>Vector2</code>
    * [.mouseDelta](#Input+mouseDelta) ⇒ <code>Vector2</code>
    * [.mouseMoving](#Input+mouseMoving) ⇒ <code>Boolean</code>
    * [.shiftDown](#Input+shiftDown) ⇒ <code>Boolean</code>
    * [.ctrlDown](#Input+ctrlDown) ⇒ <code>Boolean</code>
    * [.altDown](#Input+altDown) ⇒ <code>Boolean</code>
    * [.anyKeyDown](#Input+anyKeyDown) ⇒ <code>Boolean</code>
    * [.anyMouseButtonDown](#Input+anyMouseButtonDown) ⇒ <code>Boolean</code>
    * [.mouseWheelSign](#Input+mouseWheelSign) ⇒ <code>Number</code>
    * [.mouseWheel](#Input+mouseWheel) ⇒ <code>Number</code>
    * [.setTargetElement(element)](#Input+setTargetElement)
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

<a name="new_Input_new"></a>

### new Input()
Create the manager.

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
<a name="Input+anyKeyDown"></a>

### input.anyKeyDown ⇒ <code>Boolean</code>
Get if any keyboard key is currently down.

**Kind**: instance property of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if there's a key pressed down.  
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
| element | <code>Element</code> | Element to attach input to. |

**Example**  
```js
// the following will use whatever canvas the gfx manager uses as input element.
// this means mouse offset will also be relative to this element.
Shaku.input.setTargetElement(() => Shaku.gfx.canvas);
```
<a name="Input+mousePressed"></a>

### input.mousePressed(button) ⇒ <code>Boolean</code>
Get if mouse button was pressed this frame.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if mouse button is currently down, but was up in previous frame.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| button | <code>MouseButtons</code> | <code>0</code> | Button code (defults to MouseButtons.left). |

<a name="Input+mouseDown"></a>

### input.mouseDown(button) ⇒ <code>Boolean</code>
Get if mouse button is currently pressed.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - true if mouse button is currently down, false otherwise.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| button | <code>MouseButtons</code> | <code>0</code> | Button code (defults to MouseButtons.left). |

<a name="Input+mouseUp"></a>

### input.mouseUp(button) ⇒ <code>Boolean</code>
Get if mouse button is currently not down.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - true if mouse button is currently up, false otherwise.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| button | <code>MouseButtons</code> | <code>0</code> | Button code (defults to MouseButtons.left). |

<a name="Input+mouseReleased"></a>

### input.mouseReleased(button) ⇒ <code>Boolean</code>
Get if mouse button was released in current frame.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if mouse was down last frame, but released in current frame.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| button | <code>MouseButtons</code> | <code>0</code> | Button code (defults to MouseButtons.left). |

<a name="Input+keyDown"></a>

### input.keyDown(key) ⇒ <code>boolean</code>
Get if keyboard key is currently pressed down.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>boolean</code> - True if keyboard key is currently down, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>KeyboardKeys</code> | Keyboard key code. |

<a name="Input+keyUp"></a>

### input.keyUp(key) ⇒ <code>Boolean</code>
Get if keyboard key is currently not down.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if keyboard key is currently up, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>KeyboardKeys</code> | Keyboard key code. |

<a name="Input+keyReleased"></a>

### input.keyReleased(button) ⇒ <code>Boolean</code>
Get if a keyboard button was released in current frame.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if key was down last frame, but released in current frame.  

| Param | Type | Description |
| --- | --- | --- |
| button | <code>KeyboardKeys</code> | Keyboard key code. |

<a name="Input+keyPressed"></a>

### input.keyPressed(key) ⇒ <code>Boolean</code>
Get if keyboard key was pressed this frame.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if key is currently down, but was up in previous frame.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>KeyboardKeys</code> | Keyboard key code. |

<a name="Input+down"></a>

### input.down(code) ⇒ <code>Boolean</code>
Return if a mouse or keyboard button is currently down.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if key or mouse button are down.  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>string</code> \| <code>Array.&lt;String&gt;</code> | Keyboard or mouse code. Can be array of codes to test if any of them is down.                          For mouse buttons: mouse_left, mouse_right or mouse_middle.                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..)                          For numbers (0-9): you can use the number. |

<a name="Input+released"></a>

### input.released(code) ⇒ <code>Boolean</code>
Return if a mouse or keyboard button was released in this frame.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if key or mouse button were down in previous frame, and released this frame.  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>string</code> \| <code>Array.&lt;String&gt;</code> | Keyboard or mouse code. Can be array of codes to test if any of them is released.                          For mouse buttons: mouse_left, mouse_right or mouse_middle.                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..)                          For numbers (0-9): you can use the number. |

<a name="Input+pressed"></a>

### input.pressed(code) ⇒ <code>Boolean</code>
Return if a mouse or keyboard button was pressed in this frame.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if key or mouse button where up in previous frame, and pressed this frame.  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>string</code> \| <code>Array.&lt;String&gt;</code> | Keyboard or mouse code. Can be array of codes to test if any of them is pressed.                          For mouse buttons: mouse_left, mouse_right or mouse_middle.                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..)                          For numbers (0-9): you can use the number. |

