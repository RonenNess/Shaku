![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Point

<a name="PointShape"></a>

## PointShape
Collision point class.

**Kind**: global class  

* [PointShape](#PointShape)
    * [new PointShape(position)](#new_PointShape_new)
    * [.setPosition(position)](#PointShape+setPosition)
    * [.getPosition()](#PointShape+getPosition) ⇒ <code>Vector2</code>
    * [.getBoundingBox()](#PointShape+getBoundingBox) ⇒ <code>Rectangle</code>
    * [.debugDraw(opacity)](#PointShape+debugDraw)

<a name="new_PointShape_new"></a>

### new PointShape(position)
Create the collision shape.


| Param | Type | Description |
| --- | --- | --- |
| position | <code>Vector2</code> | Point position. |

<a name="PointShape+setPosition"></a>

### pointShape.setPosition(position)
Set this collision shape from vector2.

**Kind**: instance method of [<code>PointShape</code>](#PointShape)  

| Param | Type | Description |
| --- | --- | --- |
| position | <code>Vector2</code> | Point position. |

<a name="PointShape+getPosition"></a>

### pointShape.getPosition() ⇒ <code>Vector2</code>
Get point position.

**Kind**: instance method of [<code>PointShape</code>](#PointShape)  
**Returns**: <code>Vector2</code> - Point position.  
<a name="PointShape+getBoundingBox"></a>

### pointShape.getBoundingBox() ⇒ <code>Rectangle</code>
Get collision shape's bounding box.

**Kind**: instance method of [<code>PointShape</code>](#PointShape)  
**Returns**: <code>Rectangle</code> - Shape's bounding box.  
<a name="PointShape+debugDraw"></a>

### pointShape.debugDraw(opacity)
Debug draw this shape.

**Kind**: instance method of [<code>PointShape</code>](#PointShape)  

| Param | Type | Description |
| --- | --- | --- |
| opacity | <code>Number</code> | Shape opacity factor. |

