![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Gamepad

## Classes

<dl>
<dt><a href="#Gamepad">Gamepad</a></dt>
<dd><p>Gamepad data object.
This object represents a snapshot of a gamepad state, it does not update automatically.</p>
</dd>
<dt><a href="#FourButtonsCluster">FourButtonsCluster</a></dt>
<dd><p>Buttons cluster container - 4 buttons.</p>
</dd>
<dt><a href="#ThreeButtonsCluster">ThreeButtonsCluster</a></dt>
<dd><p>Buttons cluster container - 3 buttons.</p>
</dd>
<dt><a href="#FrontButtons">FrontButtons</a></dt>
<dd><p>Front buttons.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#_gamepadButtonPressed">_gamepadButtonPressed()</a></dt>
<dd><p>Get if a gamepad button is currently pressed.</p>
</dd>
</dl>

<a name="Gamepad"></a>

## Gamepad
Gamepad data object.
This object represents a snapshot of a gamepad state, it does not update automatically.

**Kind**: global class  

* [Gamepad](#Gamepad)
    * [new Gamepad(gp)](#new_Gamepad_new)
    * [.id](#Gamepad+id) : <code>String</code>
    * [.axis1](#Gamepad+axis1) : <code>Vector2</code>
    * [.axis2](#Gamepad+axis2) : <code>Vector2</code>
    * [.mapping](#Gamepad+mapping) : <code>String</code>
    * [.isMapped](#Gamepad+isMapped) : <code>Boolean</code>
    * [.leftStick](#Gamepad+leftStick) : <code>Vector2</code>
    * [.rightStick](#Gamepad+rightStick) : <code>Vector2</code>
    * [.leftStickPressed](#Gamepad+leftStickPressed) : <code>Boolean</code>
    * [.leftStickPressed](#Gamepad+leftStickPressed) : <code>Boolean</code>
    * [.rightButtons](#Gamepad+rightButtons) : [<code>FourButtonsCluster</code>](#FourButtonsCluster)
    * [.leftButtons](#Gamepad+leftButtons) : [<code>FourButtonsCluster</code>](#FourButtonsCluster)
    * [.leftButtons](#Gamepad+leftButtons) : [<code>FourButtonsCluster</code>](#FourButtonsCluster)
    * [.frontButtons](#Gamepad+frontButtons) : [<code>FrontButtons</code>](#FrontButtons)
    * [.isMapped](#Gamepad+isMapped) : <code>Boolean</code>
    * [.buttonsCount](#Gamepad+buttonsCount) ⇒ <code>Number</code>
    * [.button(index)](#Gamepad+button) ⇒ <code>Boolean</code>

<a name="new_Gamepad_new"></a>

### new Gamepad(gp)
Create gamepad state object.


| Param | Type | Description |
| --- | --- | --- |
| gp | <code>\*</code> | Browser gamepad state object. |

<a name="Gamepad+id"></a>

### gamepad.id : <code>String</code>
Gamepad Id.

**Kind**: instance property of [<code>Gamepad</code>](#Gamepad)  
<a name="Gamepad+axis1"></a>

### gamepad.axis1 : <code>Vector2</code>
Gamepad first axis value.

**Kind**: instance property of [<code>Gamepad</code>](#Gamepad)  
<a name="Gamepad+axis2"></a>

### gamepad.axis2 : <code>Vector2</code>
Gamepad second axis value.

**Kind**: instance property of [<code>Gamepad</code>](#Gamepad)  
<a name="Gamepad+mapping"></a>

### gamepad.mapping : <code>String</code>
Mapping type.

**Kind**: instance property of [<code>Gamepad</code>](#Gamepad)  
<a name="Gamepad+isMapped"></a>

### gamepad.isMapped : <code>Boolean</code>
True if the gamepad is of a known type and we have extra mapped attributes.
False if unknown / not supported.

**Kind**: instance property of [<code>Gamepad</code>](#Gamepad)  
<a name="Gamepad+leftStick"></a>

### gamepad.leftStick : <code>Vector2</code>
Gamepad left stick.
Only available with "standard" mapping.

**Kind**: instance property of [<code>Gamepad</code>](#Gamepad)  
<a name="Gamepad+rightStick"></a>

### gamepad.rightStick : <code>Vector2</code>
Gamepad right stick.
Only available with "standard" mapping.

**Kind**: instance property of [<code>Gamepad</code>](#Gamepad)  
<a name="Gamepad+leftStickPressed"></a>

### gamepad.leftStickPressed : <code>Boolean</code>
Gamepad left stick is pressed.
Only available with "standard" mapping.

**Kind**: instance property of [<code>Gamepad</code>](#Gamepad)  
<a name="Gamepad+leftStickPressed"></a>

### gamepad.leftStickPressed : <code>Boolean</code>
Gamepad right stick is pressed.
Only available with "standard" mapping.

**Kind**: instance property of [<code>Gamepad</code>](#Gamepad)  
<a name="Gamepad+rightButtons"></a>

### gamepad.rightButtons : [<code>FourButtonsCluster</code>](#FourButtonsCluster)
Right cluster button states.

**Kind**: instance property of [<code>Gamepad</code>](#Gamepad)  
<a name="Gamepad+leftButtons"></a>

### gamepad.leftButtons : [<code>FourButtonsCluster</code>](#FourButtonsCluster)
Left cluster button states.

**Kind**: instance property of [<code>Gamepad</code>](#Gamepad)  
<a name="Gamepad+leftButtons"></a>

### gamepad.leftButtons : [<code>FourButtonsCluster</code>](#FourButtonsCluster)
Center cluster button states.

**Kind**: instance property of [<code>Gamepad</code>](#Gamepad)  
<a name="Gamepad+frontButtons"></a>

### gamepad.frontButtons : [<code>FrontButtons</code>](#FrontButtons)
Front buttons states.

**Kind**: instance property of [<code>Gamepad</code>](#Gamepad)  
<a name="Gamepad+isMapped"></a>

### gamepad.isMapped : <code>Boolean</code>
True if the gamepad is of a known type and we have extra mapped attributes.
False if unknown.

**Kind**: instance property of [<code>Gamepad</code>](#Gamepad)  
<a name="Gamepad+buttonsCount"></a>

### gamepad.buttonsCount ⇒ <code>Number</code>
Get buttons count.

**Kind**: instance property of [<code>Gamepad</code>](#Gamepad)  
**Returns**: <code>Number</code> - Buttons count.  
<a name="Gamepad+button"></a>

### gamepad.button(index) ⇒ <code>Boolean</code>
Get button state (if pressed down) by index.

**Kind**: instance method of [<code>Gamepad</code>](#Gamepad)  
**Returns**: <code>Boolean</code> - True if pressed, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>Number</code> | Button index to check. |

<a name="FourButtonsCluster"></a>

## FourButtonsCluster
Buttons cluster container - 4 buttons.

**Kind**: global class  
<a name="new_FourButtonsCluster_new"></a>

### new FourButtonsCluster(bottom, right, left, top)
Create the cluster states.


| Param | Type | Description |
| --- | --- | --- |
| bottom | <code>Boolean</code> | Bottom button state. |
| right | <code>Boolean</code> | Right button state. |
| left | <code>Boolean</code> | Left button state. |
| top | <code>Boolean</code> | Top button state. |

<a name="ThreeButtonsCluster"></a>

## ThreeButtonsCluster
Buttons cluster container - 3 buttons.

**Kind**: global class  
<a name="new_ThreeButtonsCluster_new"></a>

### new ThreeButtonsCluster(left, right, center)
Create the cluster states.


| Param | Type | Description |
| --- | --- | --- |
| left | <code>Boolean</code> | Left button state. |
| right | <code>Boolean</code> | Right button state. |
| center | <code>Boolean</code> | Center button state. |

<a name="FrontButtons"></a>

## FrontButtons
Front buttons.

**Kind**: global class  
<a name="new_FrontButtons_new"></a>

### new FrontButtons()
Create the cluster states.

<a name="_gamepadButtonPressed"></a>

## \_gamepadButtonPressed()
Get if a gamepad button is currently pressed.

**Kind**: global function  
**Prviate**:   
