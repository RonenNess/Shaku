![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Shape

<a name="CollisionShape"></a>

## CollisionShape
Collision shape base class.

**Kind**: global class  

* [CollisionShape](#CollisionShape)
    * [new CollisionShape()](#new_CollisionShape_new)
    * [.shapeId](#CollisionShape+shapeId) ⇒ <code>String</code>
    * [.collisionFlags](#CollisionShape+collisionFlags)
    * [.collisionFlags](#CollisionShape+collisionFlags)
    * [.setDebugColor(color)](#CollisionShape+setDebugColor)
    * [.debugDraw(opacity, shapesBatch)](#CollisionShape+debugDraw)
    * [.getCenter()](#CollisionShape+getCenter) ⇒ <code>Vector2</code>
    * [.remove()](#CollisionShape+remove)

<a name="new_CollisionShape_new"></a>

### new CollisionShape()
Create the collision shape.

<a name="CollisionShape+shapeId"></a>

### collisionShape.shapeId ⇒ <code>String</code>
Get the collision shape's unique identifier.

**Kind**: instance property of [<code>CollisionShape</code>](#CollisionShape)  
**Returns**: <code>String</code> - Shape's unique identifier  
<a name="CollisionShape+collisionFlags"></a>

### collisionShape.collisionFlags
Get collision flags (matched against collision mask when checking collision).

**Kind**: instance property of [<code>CollisionShape</code>](#CollisionShape)  
<a name="CollisionShape+collisionFlags"></a>

### collisionShape.collisionFlags
Set collision flags (matched against collision mask when checking collision).

**Kind**: instance property of [<code>CollisionShape</code>](#CollisionShape)  
<a name="CollisionShape+setDebugColor"></a>

### collisionShape.setDebugColor(color)
Set the debug color to use to draw this shape.

**Kind**: instance method of [<code>CollisionShape</code>](#CollisionShape)  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>Color</code> | Color to set or null to use default. |

<a name="CollisionShape+debugDraw"></a>

### collisionShape.debugDraw(opacity, shapesBatch)
Debug draw this shape.

**Kind**: instance method of [<code>CollisionShape</code>](#CollisionShape)  

| Param | Type | Description |
| --- | --- | --- |
| opacity | <code>Number</code> | Shape opacity factor. |
| shapesBatch | <code>ShapesBatch</code> | Optional shapes batch to use to debug draw the shape. By default will use the collision world. |

<a name="CollisionShape+getCenter"></a>

### collisionShape.getCenter() ⇒ <code>Vector2</code>
Get shape center position.

**Kind**: instance method of [<code>CollisionShape</code>](#CollisionShape)  
**Returns**: <code>Vector2</code> - Center position.  
<a name="CollisionShape+remove"></a>

### collisionShape.remove()
Remove self from parent world object.

**Kind**: instance method of [<code>CollisionShape</code>](#CollisionShape)  
