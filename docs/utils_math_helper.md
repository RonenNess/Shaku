![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Math Helper

<a name="MathHelper"></a>

## MathHelper
Implement some math utilities functions.

**Kind**: global class  

* [MathHelper](#MathHelper)
    * [.PI2](#MathHelper.PI2)
    * [.lerp(start, end, amount)](#MathHelper.lerp) ⇒ <code>Number</code>
    * [.dot(x1, y1, x2, y2)](#MathHelper.dot) ⇒ <code>Number</code>
    * [.toRadians(degrees)](#MathHelper.toRadians) ⇒ <code>Number</code>
    * [.toDegrees(radians)](#MathHelper.toDegrees) ⇒ <code>Number</code>
    * [.radiansDistanceSigned(a1, a2)](#MathHelper.radiansDistanceSigned) ⇒ <code>Number</code>
    * [.radiansDistance(a1, a2)](#MathHelper.radiansDistance) ⇒ <code>Number</code>
    * [.lerpRadians(a1, a2, alpha)](#MathHelper.lerpRadians) ⇒ <code>Number</code>
    * [.lerpDegrees(a1, a2, alpha)](#MathHelper.lerpDegrees) ⇒ <code>Number</code>
    * [.round10(num)](#MathHelper.round10) ⇒ <code>Number</code>
    * [.wrapDegrees(degrees)](#MathHelper.wrapDegrees) ⇒ <code>Number</code>

<a name="MathHelper.PI2"></a>

### MathHelper.PI2
PI * 2 value.

**Kind**: static property of [<code>MathHelper</code>](#MathHelper)  
<a name="MathHelper.lerp"></a>

### MathHelper.lerp(start, end, amount) ⇒ <code>Number</code>
Perform linear interpolation between start and end values.

**Kind**: static method of [<code>MathHelper</code>](#MathHelper)  
**Returns**: <code>Number</code> - interpolated value between start and end.  

| Param | Type | Description |
| --- | --- | --- |
| start | <code>Number</code> | Starting value. |
| end | <code>Number</code> | Ending value. |
| amount | <code>Number</code> | How much to interpolate from start to end. |

<a name="MathHelper.dot"></a>

### MathHelper.dot(x1, y1, x2, y2) ⇒ <code>Number</code>
Calculate 2d dot product.

**Kind**: static method of [<code>MathHelper</code>](#MathHelper)  
**Returns**: <code>Number</code> - dot product result.  

| Param | Type | Description |
| --- | --- | --- |
| x1 | <code>Number</code> | First vector x. |
| y1 | <code>Number</code> | First vector y. |
| x2 | <code>Number</code> | Second vector x. |
| y2 | <code>Number</code> | Second vector y. |

<a name="MathHelper.toRadians"></a>

### MathHelper.toRadians(degrees) ⇒ <code>Number</code>
Convert degrees to radians.

**Kind**: static method of [<code>MathHelper</code>](#MathHelper)  
**Returns**: <code>Number</code> - Value as radians.  

| Param | Type | Description |
| --- | --- | --- |
| degrees | <code>Number</code> | Degrees value to convert to radians. |

<a name="MathHelper.toDegrees"></a>

### MathHelper.toDegrees(radians) ⇒ <code>Number</code>
Convert radians to degrees.

**Kind**: static method of [<code>MathHelper</code>](#MathHelper)  
**Returns**: <code>Number</code> - Value as degrees.  

| Param | Type | Description |
| --- | --- | --- |
| radians | <code>Number</code> | Radians value to convert to degrees. |

<a name="MathHelper.radiansDistanceSigned"></a>

### MathHelper.radiansDistanceSigned(a1, a2) ⇒ <code>Number</code>
Find shortest distance between two radians, with sign (ie distance can be negative).

**Kind**: static method of [<code>MathHelper</code>](#MathHelper)  
**Returns**: <code>Number</code> - Shortest distance between radians.  

| Param | Type | Description |
| --- | --- | --- |
| a1 | <code>Number</code> | First radian. |
| a2 | <code>Number</code> | Second radian. |

<a name="MathHelper.radiansDistance"></a>

### MathHelper.radiansDistance(a1, a2) ⇒ <code>Number</code>
Find shortest distance between two radians.

**Kind**: static method of [<code>MathHelper</code>](#MathHelper)  
**Returns**: <code>Number</code> - Shortest distance between radians.  

| Param | Type | Description |
| --- | --- | --- |
| a1 | <code>Number</code> | First radian. |
| a2 | <code>Number</code> | Second radian. |

<a name="MathHelper.lerpRadians"></a>

### MathHelper.lerpRadians(a1, a2, alpha) ⇒ <code>Number</code>
Perform linear interpolation between radian values.
Unlike the regular lerp method, this method will take wrapping into consideration, and will always lerp via the shortest distance.

**Kind**: static method of [<code>MathHelper</code>](#MathHelper)  
**Returns**: <code>Number</code> - interpolated radians between start and end.  

| Param | Type | Description |
| --- | --- | --- |
| a1 | <code>Number</code> | Starting value. |
| a2 | <code>Number</code> | Ending value. |
| alpha | <code>Number</code> | How much to interpolate from start to end. |

<a name="MathHelper.lerpDegrees"></a>

### MathHelper.lerpDegrees(a1, a2, alpha) ⇒ <code>Number</code>
Perform linear interpolation between degrees.
Unlike the regular lerp method, this method will take wrapping into consideration, and will always lerp via the shortest distance.

**Kind**: static method of [<code>MathHelper</code>](#MathHelper)  
**Returns**: <code>Number</code> - interpolated degrees between start and end.  

| Param | Type | Description |
| --- | --- | --- |
| a1 | <code>Number</code> | Starting value. |
| a2 | <code>Number</code> | Ending value. |
| alpha | <code>Number</code> | How much to interpolate from start to end. |

<a name="MathHelper.round10"></a>

### MathHelper.round10(num) ⇒ <code>Number</code>
Round numbers from 10'th digit.
This is useful for calculations that should return round or almost round numbers, but have a long tail of 0's and 1 due to floating points accuracy.

**Kind**: static method of [<code>MathHelper</code>](#MathHelper)  
**Returns**: <code>Number</code> - Rounded number.  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>Number</code> | Number to round. |

<a name="MathHelper.wrapDegrees"></a>

### MathHelper.wrapDegrees(degrees) ⇒ <code>Number</code>
Wrap degrees value to be between 0 to 360.

**Kind**: static method of [<code>MathHelper</code>](#MathHelper)  
**Returns**: <code>Number</code> - degrees wrapped to be 0-360 values.  

| Param | Type | Description |
| --- | --- | --- |
| degrees | <code>Number</code> | Degrees to wrap. |

