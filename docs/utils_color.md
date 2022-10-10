![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Color

## Classes

<dl>
<dt><a href="#Color">Color</a></dt>
<dd><p>Implement a color.
All color components are expected to be in 0.0 - 1.0 range (and not 0-255).</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#hexToColor">hexToColor(hex)</a></dt>
<dd><p>Convert Hex value to Color instance.</p>
</dd>
</dl>

<a name="Color"></a>

## Color
Implement a color.
All color components are expected to be in 0.0 - 1.0 range (and not 0-255).

**Kind**: global class  

* [Color](#Color)
    * [new Color(r, g, b, [a])](#new_Color_new)
    * _instance_
        * [.r](#Color+r) ⇒ <code>Number</code>
        * [.g](#Color+g) ⇒ <code>Number</code>
        * [.b](#Color+b) ⇒ <code>Number</code>
        * [.a](#Color+a) ⇒ <code>Number</code>
        * [.r](#Color+r) ⇒ <code>Number</code>
        * [.g](#Color+g) ⇒ <code>Number</code>
        * [.b](#Color+b) ⇒ <code>Number</code>
        * [.a](#Color+a) ⇒ <code>Number</code>
        * [.asHex](#Color+asHex) ⇒ <code>String</code>
        * [.asDecimalRGBA](#Color+asDecimalRGBA) ⇒ <code>Number</code>
        * [.asDecimalABGR](#Color+asDecimalABGR) ⇒ <code>Number</code>
        * [.floatArray](#Color+floatArray)
        * [.isBlack](#Color+isBlack)
        * [.isTransparentBlack](#Color+isTransparentBlack)
        * [.set(r, g, b, a)](#Color+set) ⇒ [<code>Color</code>](#Color)
        * [.setByte(r, g, b, a)](#Color+setByte) ⇒ [<code>Color</code>](#Color)
        * [.copy(other)](#Color+copy) ⇒ [<code>Color</code>](#Color)
        * [.toDict(minimized)](#Color+toDict) ⇒ <code>\*</code>
        * [.clone()](#Color+clone) ⇒ <code>Number</code>
        * [.string()](#Color+string)
        * [.equals(other)](#Color+equals)
    * _static_
        * [.webColorNames](#Color.webColorNames) ⇒ <code>Array.&lt;String&gt;</code>
        * [.componentToHex(c)](#Color.componentToHex) ⇒ <code>String</code>
        * [.fromHex(val)](#Color.fromHex) ⇒ [<code>Color</code>](#Color)
        * [.fromDecimal(val, includeAlpha)](#Color.fromDecimal) ⇒ [<code>Color</code>](#Color)
        * [.fromDict(data)](#Color.fromDict) ⇒ [<code>Color</code>](#Color)
        * [.random(includeAlpha)](#Color.random) ⇒ [<code>Color</code>](#Color)
        * [.fromBytesArray(bytes)](#Color.fromBytesArray) ⇒ [<code>Color</code>](#Color)
        * [.lerp(p1, p2, a)](#Color.lerp) ⇒ [<code>Color</code>](#Color)

<a name="new_Color_new"></a>

### new Color(r, g, b, [a])
Create the color.


| Param | Type | Description |
| --- | --- | --- |
| r | <code>Number</code> | Color red component (value range: 0-1). |
| g | <code>Number</code> | Color green component (value range: 0-1). |
| b | <code>Number</code> | Color blue component (value range: 0-1). |
| [a] | <code>Number</code> | Color alpha component (value range: 0-1). |

<a name="Color+r"></a>

### color.r ⇒ <code>Number</code>
Get r component.

**Kind**: instance property of [<code>Color</code>](#Color)  
**Returns**: <code>Number</code> - Red component.  
<a name="Color+g"></a>

### color.g ⇒ <code>Number</code>
Get g component.

**Kind**: instance property of [<code>Color</code>](#Color)  
**Returns**: <code>Number</code> - Green component.  
<a name="Color+b"></a>

### color.b ⇒ <code>Number</code>
Get b component.

**Kind**: instance property of [<code>Color</code>](#Color)  
**Returns**: <code>Number</code> - Blue component.  
<a name="Color+a"></a>

### color.a ⇒ <code>Number</code>
Get a component.

**Kind**: instance property of [<code>Color</code>](#Color)  
**Returns**: <code>Number</code> - Alpha component.  
<a name="Color+r"></a>

### color.r ⇒ <code>Number</code>
Set r component.

**Kind**: instance property of [<code>Color</code>](#Color)  
**Returns**: <code>Number</code> - Red component after change.  
<a name="Color+g"></a>

### color.g ⇒ <code>Number</code>
Set g component.

**Kind**: instance property of [<code>Color</code>](#Color)  
**Returns**: <code>Number</code> - Green component after change.  
<a name="Color+b"></a>

### color.b ⇒ <code>Number</code>
Set b component.

**Kind**: instance property of [<code>Color</code>](#Color)  
**Returns**: <code>Number</code> - Blue component after change.  
<a name="Color+a"></a>

### color.a ⇒ <code>Number</code>
Set a component.

**Kind**: instance property of [<code>Color</code>](#Color)  
**Returns**: <code>Number</code> - Alpha component after change.  
<a name="Color+asHex"></a>

### color.asHex ⇒ <code>String</code>
Convert this color to hex string (starting with '#').

**Kind**: instance property of [<code>Color</code>](#Color)  
**Returns**: <code>String</code> - Color as hex.  
<a name="Color+asDecimalRGBA"></a>

### color.asDecimalRGBA ⇒ <code>Number</code>
Convert this color to decimal number.

**Kind**: instance property of [<code>Color</code>](#Color)  
**Returns**: <code>Number</code> - Color as decimal RGBA.  
<a name="Color+asDecimalABGR"></a>

### color.asDecimalABGR ⇒ <code>Number</code>
Convert this color to decimal number.

**Kind**: instance property of [<code>Color</code>](#Color)  
**Returns**: <code>Number</code> - Color as decimal ARGB.  
<a name="Color+floatArray"></a>

### color.floatArray
Convert this color to a float array.

**Kind**: instance property of [<code>Color</code>](#Color)  
<a name="Color+isBlack"></a>

### color.isBlack
Get if this color is pure black (ignoring alpha).

**Kind**: instance property of [<code>Color</code>](#Color)  
<a name="Color+isTransparentBlack"></a>

### color.isTransparentBlack
Get if this color is transparent black.

**Kind**: instance property of [<code>Color</code>](#Color)  
<a name="Color+set"></a>

### color.set(r, g, b, a) ⇒ [<code>Color</code>](#Color)
Set the color components.

**Kind**: instance method of [<code>Color</code>](#Color)  
**Returns**: [<code>Color</code>](#Color) - this.  

| Param | Type | Description |
| --- | --- | --- |
| r | <code>Number</code> | Color red component (value range: 0-1). |
| g | <code>Number</code> | Color green component (value range: 0-1). |
| b | <code>Number</code> | Color blue component (value range: 0-1). |
| a | <code>Number</code> | Color alpha component (value range: 0-1). |

<a name="Color+setByte"></a>

### color.setByte(r, g, b, a) ⇒ [<code>Color</code>](#Color)
Set the color components from byte values (0-255).

**Kind**: instance method of [<code>Color</code>](#Color)  
**Returns**: [<code>Color</code>](#Color) - this.  

| Param | Type | Description |
| --- | --- | --- |
| r | <code>Number</code> | Color red component (value range: 0-255). |
| g | <code>Number</code> | Color green component (value range: 0-255). |
| b | <code>Number</code> | Color blue component (value range: 0-255). |
| a | <code>Number</code> | Color alpha component (value range: 0-255). |

<a name="Color+copy"></a>

### color.copy(other) ⇒ [<code>Color</code>](#Color)
Copy all component values from another color.

**Kind**: instance method of [<code>Color</code>](#Color)  
**Returns**: [<code>Color</code>](#Color) - this.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Color</code>](#Color) | Color to copy values from. |

<a name="Color+toDict"></a>

### color.toDict(minimized) ⇒ <code>\*</code>
Convert to dictionary.

**Kind**: instance method of [<code>Color</code>](#Color)  
**Returns**: <code>\*</code> - Dictionary with {r,g,b,a}  

| Param | Type | Description |
| --- | --- | --- |
| minimized | <code>Boolean</code> | If true, will not include keys that their values are 1. You can use fromDict on minimized dicts. |

<a name="Color+clone"></a>

### color.clone() ⇒ <code>Number</code>
Return a clone of this color.

**Kind**: instance method of [<code>Color</code>](#Color)  
**Returns**: <code>Number</code> - Cloned color.  
<a name="Color+string"></a>

### color.string()
Convert to string.

**Kind**: instance method of [<code>Color</code>](#Color)  
<a name="Color+equals"></a>

### color.equals(other)
Check if equal to another color.

**Kind**: instance method of [<code>Color</code>](#Color)  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Color</code>](#Color) | Other color to compare to. |

<a name="Color.webColorNames"></a>

### Color.webColorNames ⇒ <code>Array.&lt;String&gt;</code>
Get array with all built-in web color names.

**Kind**: static property of [<code>Color</code>](#Color)  
**Returns**: <code>Array.&lt;String&gt;</code> - Array with color names.  
<a name="Color.componentToHex"></a>

### Color.componentToHex(c) ⇒ <code>String</code>
Convert a single component to hex value.

**Kind**: static method of [<code>Color</code>](#Color)  
**Returns**: <code>String</code> - Component as hex value.  

| Param | Type | Description |
| --- | --- | --- |
| c | <code>Number</code> | Value to convert to hex. |

<a name="Color.fromHex"></a>

### Color.fromHex(val) ⇒ [<code>Color</code>](#Color)
Create color from hex value.

**Kind**: static method of [<code>Color</code>](#Color)  
**Returns**: [<code>Color</code>](#Color) - New color value.  

| Param | Type | Description |
| --- | --- | --- |
| val | <code>String</code> | Number value (hex), as #rrggbbaa. |

<a name="Color.fromDecimal"></a>

### Color.fromDecimal(val, includeAlpha) ⇒ [<code>Color</code>](#Color)
Create color from decimal value.

**Kind**: static method of [<code>Color</code>](#Color)  
**Returns**: [<code>Color</code>](#Color) - New color value.  

| Param | Type | Description |
| --- | --- | --- |
| val | <code>Number</code> | Number value (int). |
| includeAlpha | <code>Number</code> | If true, will include alpha value. |

<a name="Color.fromDict"></a>

### Color.fromDict(data) ⇒ [<code>Color</code>](#Color)
Create color from a dictionary.

**Kind**: static method of [<code>Color</code>](#Color)  
**Returns**: [<code>Color</code>](#Color) - Newly created color.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>\*</code> | Dictionary with {r,g,b,a}. |

<a name="Color.random"></a>

### Color.random(includeAlpha) ⇒ [<code>Color</code>](#Color)
Return a random color.

**Kind**: static method of [<code>Color</code>](#Color)  
**Returns**: [<code>Color</code>](#Color) - Randomized color.  

| Param | Type | Description |
| --- | --- | --- |
| includeAlpha | <code>Boolean</code> | If true, will also randomize alpha. |

<a name="Color.fromBytesArray"></a>

### Color.fromBytesArray(bytes) ⇒ [<code>Color</code>](#Color)
Build and return new color from bytes array.

**Kind**: static method of [<code>Color</code>](#Color)  
**Returns**: [<code>Color</code>](#Color) - Newly created color.  

| Param | Type | Description |
| --- | --- | --- |
| bytes | <code>Array.&lt;Number&gt;</code> | Bytes array to build color from. |

<a name="Color.lerp"></a>

### Color.lerp(p1, p2, a) ⇒ [<code>Color</code>](#Color)
Lerp between two colors.

**Kind**: static method of [<code>Color</code>](#Color)  
**Returns**: [<code>Color</code>](#Color) - result color.  

| Param | Type | Description |
| --- | --- | --- |
| p1 | [<code>Color</code>](#Color) | First color. |
| p2 | [<code>Color</code>](#Color) | Second color. |
| a | <code>Number</code> | Lerp factor (0.0 - 1.0). |

<a name="hexToColor"></a>

## hexToColor(hex)
Convert Hex value to Color instance.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| hex | <code>String</code> | Hex value to parse. |

