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
        * [.topLeft](#Rectangle+topLeft) ⇒ <code>Vector2</code>
        * [.topRight](#Rectangle+topRight) ⇒ <code>Vector2</code>
        * [.bottomLeft](#Rectangle+bottomLeft) ⇒ <code>Vector2</code>
        * [.bottomRight](#Rectangle+bottomRight) ⇒ <code>Vector2</code>
        * [.set(x, y, width, height)](#Rectangle+set) ⇒ [<code>Rectangle</code>](#Rectangle)
        * [.getPosition()](#Rectangle+getPosition) ⇒ <code>Vector2</code>
        * [.getSize()](#Rectangle+getSize) ⇒ <code>Vector2</code>
        * [.getCenter()](#Rectangle+getCenter) ⇒ <code>Vector2</code>
        * [.clone()](#Rectangle+clone) ⇒ [<code>Rectangle</code>](#Rectangle)
        * [.string()](#Rectangle+string)
        * [.containsVector(p)](#Rectangle+containsVector) ⇒ <code>Boolean</code>
        * [.collideRect(other)](#Rectangle+collideRect) ⇒ <code>Boolean</code>
        * [.collideCircle(circle)](#Rectangle+collideCircle) ⇒ <code>Boolean</code>
        * [.equals(other)](#Rectangle+equals)
    * _static_
        * [.fromPoints(points)](#Rectangle.fromPoints) ⇒ [<code>Rectangle</code>](#Rectangle)
        * [.lerp(p1, p2, a)](#Rectangle.lerp) ⇒ [<code>Rectangle</code>](#Rectangle)

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
<a name="Rectangle+topLeft"></a>

### rectangle.topLeft ⇒ <code>Vector2</code>
Get top-left corner.

**Kind**: instance property of [<code>Rectangle</code>](#Rectangle)  
**Returns**: <code>Vector2</code> - Corner position vector.  
<a name="Rectangle+topRight"></a>

### rectangle.topRight ⇒ <code>Vector2</code>
Get top-right corner.

**Kind**: instance property of [<code>Rectangle</code>](#Rectangle)  
**Returns**: <code>Vector2</code> - Corner position vector.  
<a name="Rectangle+bottomLeft"></a>

### rectangle.bottomLeft ⇒ <code>Vector2</code>
Get bottom-left corner.

**Kind**: instance property of [<code>Rectangle</code>](#Rectangle)  
**Returns**: <code>Vector2</code> - Corner position vector.  
<a name="Rectangle+bottomRight"></a>

### rectangle.bottomRight ⇒ <code>Vector2</code>
Get bottom-right corner.

**Kind**: instance property of [<code>Rectangle</code>](#Rectangle)  
**Returns**: <code>Vector2</code> - Corner position vector.  
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

<a name="Rectangle+collideCircle"></a>

### rectangle.collideCircle(circle) ⇒ <code>Boolean</code>
Checks if this rectangle collides with a circle.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: <code>Boolean</code> - if rectangle collides with circle.  

| Param | Type | Description |
| --- | --- | --- |
| circle | <code>Circle</code> | Circle to check collision with. |

<a name="Rectangle+equals"></a>

### rectangle.equals(other)
Check if equal to another rectangle.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Rectangle</code>](#Rectangle) | Other rectangle to compare to. |

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
| p1 | <code>Vector2</code> | First rectangles. |
| p2 | <code>Vector2</code> | Second rectangles. |
| a | <code>Number</code> | Lerp factor (0.0 - 1.0). |

