![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Shape

<a name="CollisionShape"></a>

## CollisionShape
Collision shape base class.

**Kind**: global class  

* [CollisionShape](#CollisionShape)
    * [new CollisionShape()](#new_CollisionShape_new)
    * [.setDebugColor(color)](#CollisionShape+setDebugColor)
    * [.getBoundingBox()](#CollisionShape+getBoundingBox) ⇒ <code>Rectangle</code>
    * [.debugDraw(opacity)](#CollisionShape+debugDraw)

<a name="new_CollisionShape_new"></a>

### new CollisionShape()
Create the collision shape.

<a name="CollisionShape+setDebugColor"></a>

### collisionShape.setDebugColor(color)
Set the debug color to use to draw this shape.

**Kind**: instance method of [<code>CollisionShape</code>](#CollisionShape)  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>Color</code> | Color to set or null to use default. |

<a name="CollisionShape+getBoundingBox"></a>

### collisionShape.getBoundingBox() ⇒ <code>Rectangle</code>
Get collision shape's bounding box.

**Kind**: instance method of [<code>CollisionShape</code>](#CollisionShape)  
**Returns**: <code>Rectangle</code> - Shape's bounding box.  
<a name="CollisionShape+debugDraw"></a>

### collisionShape.debugDraw(opacity)
Debug draw this shape.

**Kind**: instance method of [<code>CollisionShape</code>](#CollisionShape)  

| Param | Type | Description |
| --- | --- | --- |
| opacity | <code>Number</code> | Shape opacity factor. |

