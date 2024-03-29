![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Rectangle

<a name="Rectangle"></a>

## Rectangle
Implement a simple 2d Rectangle.

**Kind**: global class  

* [Rectangle](#Rectangle)
    * [new Rectangle(x, y, width, height)](#new_Rectangle_new)
    * _instance_
        * [.left](#Rectangle+left) ⇒ <code>Number</code>
        * [.right](#Rectangle+right) ⇒ <code>Number</code>
        * [.top](#Rectangle+top) ⇒ <code>Number</code>
        * [.bottom](#Rectangle+bottom) ⇒ <code>Number</code>
        * [.set(x, y, width, height)](#Rectangle+set) ⇒ [<code>Rectangle</code>](#Rectangle)
        * [.copy(other)](#Rectangle+copy) ⇒ [<code>Rectangle</code>](#Rectangle)
        * [.getPosition()](#Rectangle+getPosition) ⇒ <code>Vector2</code>
        * [.getSize()](#Rectangle+getSize) ⇒ <code>Vector2</code>
        * [.getCenter()](#Rectangle+getCenter) ⇒ <code>Vector2</code>
        * [.clone()](#Rectangle+clone) ⇒ [<code>Rectangle</code>](#Rectangle)
        * [.getTopLeft()](#Rectangle+getTopLeft) ⇒ <code>Vector2</code>
        * [.getTopRight()](#Rectangle+getTopRight) ⇒ <code>Vector2</code>
        * [.getBottomLeft()](#Rectangle+getBottomLeft) ⇒ <code>Vector2</code>
        * [.getBottomRight()](#Rectangle+getBottomRight) ⇒ <code>Vector2</code>
        * [.string()](#Rectangle+string)
        * [.containsVector(p)](#Rectangle+containsVector) ⇒ <code>Boolean</code>
        * [.collideRect(other)](#Rectangle+collideRect) ⇒ <code>Boolean</code>
        * [.collideLine(line)](#Rectangle+collideLine) ⇒ <code>Boolean</code>
        * [.collideCircle(circle)](#Rectangle+collideCircle) ⇒ <code>Boolean</code>
        * [.getBoundingCircle()](#Rectangle+getBoundingCircle) ⇒ <code>Circle</code>
        * [.resize(amount)](#Rectangle+resize) ⇒ [<code>Rectangle</code>](#Rectangle)
        * [.equals(other)](#Rectangle+equals)
        * [.toDict(minimized)](#Rectangle+toDict) ⇒ <code>\*</code>
    * _static_
        * [.fromPoints(points)](#Rectangle.fromPoints) ⇒ [<code>Rectangle</code>](#Rectangle)
        * [.lerp(p1, p2, a)](#Rectangle.lerp) ⇒ [<code>Rectangle</code>](#Rectangle)
        * [.fromDict(data)](#Rectangle.fromDict) ⇒ [<code>Rectangle</code>](#Rectangle)

<a name="new_Rectangle_new"></a>

### new Rectangle(x, y, width, height)
Create the Rect.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | Rect position X (top left corner). |
| y | <code>Number</code> | Rect position Y (top left corner). |
| width | <code>Number</code> | Rect width. |
| height | <code>Number</code> | Rect height. |

<a name="Rectangle+left"></a>

### rectangle.left ⇒ <code>Number</code>
Get left value.

**Kind**: instance property of [<code>Rectangle</code>](#Rectangle)  
**Returns**: <code>Number</code> - rectangle left.  
<a name="Rectangle+right"></a>

### rectangle.right ⇒ <code>Number</code>
Get right value.

**Kind**: instance property of [<code>Rectangle</code>](#Rectangle)  
**Returns**: <code>Number</code> - rectangle right.  
<a name="Rectangle+top"></a>

### rectangle.top ⇒ <code>Number</code>
Get top value.

**Kind**: instance property of [<code>Rectangle</code>](#Rectangle)  
**Returns**: <code>Number</code> - rectangle top.  
<a name="Rectangle+bottom"></a>

### rectangle.bottom ⇒ <code>Number</code>
Get bottom value.

**Kind**: instance property of [<code>Rectangle</code>](#Rectangle)  
**Returns**: <code>Number</code> - rectangle bottom.  
<a name="Rectangle+set"></a>

### rectangle.set(x, y, width, height) ⇒ [<code>Rectangle</code>](#Rectangle)
Set rectangle values.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: [<code>Rectangle</code>](#Rectangle) - this.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | Rectangle x position. |
| y | <code>Number</code> | Rectangle y position. |
| width | <code>Number</code> | Rectangle width. |
| height | <code>Number</code> | Rectangle height. |

<a name="Rectangle+copy"></a>

### rectangle.copy(other) ⇒ [<code>Rectangle</code>](#Rectangle)
Copy another rectangle.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: [<code>Rectangle</code>](#Rectangle) - this.  

| Param | Type | Description |
| --- | --- | --- |
| other | <code>other</code> | Rectangle to copy. |

<a name="Rectangle+getPosition"></a>

### rectangle.getPosition() ⇒ <code>Vector2</code>
Get position as Vector2.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: <code>Vector2</code> - Position vector.  
<a name="Rectangle+getSize"></a>

### rectangle.getSize() ⇒ <code>Vector2</code>
Get size as Vector2.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: <code>Vector2</code> - Size vector.  
<a name="Rectangle+getCenter"></a>

### rectangle.getCenter() ⇒ <code>Vector2</code>
Get center position.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: <code>Vector2</code> - Position vector.  
<a name="Rectangle+clone"></a>

### rectangle.clone() ⇒ [<code>Rectangle</code>](#Rectangle)
Return a clone of this rectangle.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: [<code>Rectangle</code>](#Rectangle) - Cloned rectangle.  
<a name="Rectangle+getTopLeft"></a>

### rectangle.getTopLeft() ⇒ <code>Vector2</code>
Get top-left corner.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: <code>Vector2</code> - Corner position vector.  
<a name="Rectangle+getTopRight"></a>

### rectangle.getTopRight() ⇒ <code>Vector2</code>
Get top-right corner.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: <code>Vector2</code> - Corner position vector.  
<a name="Rectangle+getBottomLeft"></a>

### rectangle.getBottomLeft() ⇒ <code>Vector2</code>
Get bottom-left corner.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: <code>Vector2</code> - Corner position vector.  
<a name="Rectangle+getBottomRight"></a>

### rectangle.getBottomRight() ⇒ <code>Vector2</code>
Get bottom-right corner.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: <code>Vector2</code> - Corner position vector.  
<a name="Rectangle+string"></a>

### rectangle.string()
Convert to string.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
<a name="Rectangle+containsVector"></a>

### rectangle.containsVector(p) ⇒ <code>Boolean</code>
Check if this rectangle contains a Vector2.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: <code>Boolean</code> - if point is contained within the rectangle.  

| Param | Type | Description |
| --- | --- | --- |
| p | <code>Vector2</code> | Point to check. |

<a name="Rectangle+collideRect"></a>

### rectangle.collideRect(other) ⇒ <code>Boolean</code>
Check if this rectangle collides with another rectangle.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: <code>Boolean</code> - if rectangles collide.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Rectangle</code>](#Rectangle) | Rectangle to check collision with. |

<a name="Rectangle+collideLine"></a>

### rectangle.collideLine(line) ⇒ <code>Boolean</code>
Check if this rectangle collides with a line.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: <code>Boolean</code> - if rectangle collides with line.  

| Param | Type | Description |
| --- | --- | --- |
| line | <code>Line</code> | Line to check collision with. |

<a name="Rectangle+collideCircle"></a>

### rectangle.collideCircle(circle) ⇒ <code>Boolean</code>
Checks if this rectangle collides with a circle.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: <code>Boolean</code> - if rectangle collides with circle.  

| Param | Type | Description |
| --- | --- | --- |
| circle | <code>Circle</code> | Circle to check collision with. |

<a name="Rectangle+getBoundingCircle"></a>

### rectangle.getBoundingCircle() ⇒ <code>Circle</code>
Get the smallest circle containing this rectangle.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: <code>Circle</code> - Bounding circle.  
<a name="Rectangle+resize"></a>

### rectangle.resize(amount) ⇒ [<code>Rectangle</code>](#Rectangle)
Return a resized rectangle with the same center point.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: [<code>Rectangle</code>](#Rectangle) - resized rectangle.  

| Param | Type | Description |
| --- | --- | --- |
| amount | <code>Number</code> \| <code>Vector2</code> | Amount to resize. |

<a name="Rectangle+equals"></a>

### rectangle.equals(other)
Check if equal to another rectangle.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Rectangle</code>](#Rectangle) | Other rectangle to compare to. |

<a name="Rectangle+toDict"></a>

### rectangle.toDict(minimized) ⇒ <code>\*</code>
Convert to dictionary.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: <code>\*</code> - Dictionary with {x,y,width,height}  

| Param | Type | Description |
| --- | --- | --- |
| minimized | <code>Boolean</code> | If true, will not include keys that their values are 0. You can use fromDict on minimized dicts. |

<a name="Rectangle.fromPoints"></a>

### Rectangle.fromPoints(points) ⇒ [<code>Rectangle</code>](#Rectangle)
Build and return a rectangle from points.

**Kind**: static method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: [<code>Rectangle</code>](#Rectangle) - new rectangle from points.  

| Param | Type | Description |
| --- | --- | --- |
| points | <code>Array.&lt;Vector2&gt;</code> | Points to build rectangle from. |

<a name="Rectangle.lerp"></a>

### Rectangle.lerp(p1, p2, a) ⇒ [<code>Rectangle</code>](#Rectangle)
Lerp between two rectangles.

**Kind**: static method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: [<code>Rectangle</code>](#Rectangle) - result rectangle.  

| Param | Type | Description |
| --- | --- | --- |
| p1 | [<code>Rectangle</code>](#Rectangle) | First rectangles. |
| p2 | [<code>Rectangle</code>](#Rectangle) | Second rectangles. |
| a | <code>Number</code> | Lerp factor (0.0 - 1.0). |

<a name="Rectangle.fromDict"></a>

### Rectangle.fromDict(data) ⇒ [<code>Rectangle</code>](#Rectangle)
Create rectangle from a dictionary.

**Kind**: static method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: [<code>Rectangle</code>](#Rectangle) - Newly created rectangle.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>\*</code> | Dictionary with {x,y,width,height}. |

