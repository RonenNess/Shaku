![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Rectangle

<a name="RectangleShape"></a>

## RectangleShape
Collision rectangle class.

**Kind**: global class  

* [RectangleShape](#RectangleShape)
    * [new RectangleShape(rectangle)](#new_RectangleShape_new)
    * [.setShape(rectangle)](#RectangleShape+setShape)
    * [.getBoundingBox()](#RectangleShape+getBoundingBox) ⇒ <code>Rectangle</code>
    * [.debugDraw(opacity)](#RectangleShape+debugDraw)

<a name="new_RectangleShape_new"></a>

### new RectangleShape(rectangle)
Create the collision shape.


| Param | Type | Description |
| --- | --- | --- |
| rectangle | <code>Rectangle</code> | the rectangle shape. |

<a name="RectangleShape+setShape"></a>

### rectangleShape.setShape(rectangle)
Set this collision shape from rectangle.

**Kind**: instance method of [<code>RectangleShape</code>](#RectangleShape)  

| Param | Type | Description |
| --- | --- | --- |
| rectangle | <code>Rectangle</code> | Rectangle shape. |

<a name="RectangleShape+getBoundingBox"></a>

### rectangleShape.getBoundingBox() ⇒ <code>Rectangle</code>
Get collision shape's bounding box.

**Kind**: instance method of [<code>RectangleShape</code>](#RectangleShape)  
**Returns**: <code>Rectangle</code> - Shape's bounding box.  
<a name="RectangleShape+debugDraw"></a>

### rectangleShape.debugDraw(opacity)
Debug draw this shape.

**Kind**: instance method of [<code>RectangleShape</code>](#RectangleShape)  

| Param | Type | Description |
| --- | --- | --- |
| opacity | <code>Number</code> | Shape opacity factor. |
