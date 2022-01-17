![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Collision World

<a name="CollisionWorld"></a>

## CollisionWorld
A collision world is a set of collision shapes that interact with each other.
You can use different collision worlds to represent different levels or different parts of your game world.

**Kind**: global class  

* [CollisionWorld](#CollisionWorld)
    * [new CollisionWorld(gridCellSize)](#new_CollisionWorld_new)
    * [.addShape(shape)](#CollisionWorld+addShape)
    * [.removeShape(shape)](#CollisionWorld+removeShape)
    * [.testCollision(sourceShape, sortByDistance, predicate)](#CollisionWorld+testCollision) ⇒ <code>CollisionTestResult</code>
    * [.testCollisionMany(sourceShape, sortByDistance, predicate)](#CollisionWorld+testCollisionMany) ⇒ <code>Array.&lt;CollisionTestResult&gt;</code>
    * [.debugDraw(gridColor, gridHighlitColor, opacity)](#CollisionWorld+debugDraw)

<a name="new_CollisionWorld_new"></a>

### new CollisionWorld(gridCellSize)
Create the collision world.


| Param | Type | Description |
| --- | --- | --- |
| gridCellSize | <code>Number</code> \| <code>Vector2</code> | For optimize collision testing, the collision world is divided into a collision grid. This param determine the grid cell size. |

<a name="CollisionWorld+addShape"></a>

### collisionWorld.addShape(shape)
Add a collision shape to this world.

**Kind**: instance method of [<code>CollisionWorld</code>](#CollisionWorld)  

| Param | Type | Description |
| --- | --- | --- |
| shape | <code>CollisionShape</code> | Shape to add. |

<a name="CollisionWorld+removeShape"></a>

### collisionWorld.removeShape(shape)
Remove a collision shape from this world.

**Kind**: instance method of [<code>CollisionWorld</code>](#CollisionWorld)  

| Param | Type | Description |
| --- | --- | --- |
| shape | <code>CollisionShape</code> | Shape to remove. |

<a name="CollisionWorld+testCollision"></a>

### collisionWorld.testCollision(sourceShape, sortByDistance, predicate) ⇒ <code>CollisionTestResult</code>
Test collision with shapes in world, and return just the first result found.

**Kind**: instance method of [<code>CollisionWorld</code>](#CollisionWorld)  
**Returns**: <code>CollisionTestResult</code> - A collision test result, or null if not found.  

| Param | Type | Description |
| --- | --- | --- |
| sourceShape | <code>CollisionShape</code> | Source shape to check collision for. If shape is in world, it will not collide with itself. |
| sortByDistance | <code>Boolean</code> | If true will return the nearest collision found (based on center of shapes). |
| predicate | <code>function</code> | Optional filter to run on any shape we're about to test collision with. If the predicate returns false, we will skip this shape. |

<a name="CollisionWorld+testCollisionMany"></a>

### collisionWorld.testCollisionMany(sourceShape, sortByDistance, predicate) ⇒ <code>Array.&lt;CollisionTestResult&gt;</code>
Test collision with shapes in world, and return all results found.

**Kind**: instance method of [<code>CollisionWorld</code>](#CollisionWorld)  
**Returns**: <code>Array.&lt;CollisionTestResult&gt;</code> - An array of collision test results, or empty array if none found.  

| Param | Type | Description |
| --- | --- | --- |
| sourceShape | <code>CollisionShape</code> | Source shape to check collision for. If shape is in world, it will not collide with itself. |
| sortByDistance | <code>Boolean</code> | If true will sort results by distance. |
| predicate | <code>function</code> | Optional filter to run on any shape we're about to test collision with. If the predicate returns false, we will skip this shape. |

<a name="CollisionWorld+debugDraw"></a>

### collisionWorld.debugDraw(gridColor, gridHighlitColor, opacity)
Debug-draw the current collision world.

**Kind**: instance method of [<code>CollisionWorld</code>](#CollisionWorld)  

| Param | Type | Description |
| --- | --- | --- |
| gridColor | <code>Color</code> | Optional grid color (default to black). |
| gridHighlitColor | <code>Color</code> | Optional grid color for cells with shapes in them (default to red). |
| opacity | <code>Number</code> | Optional opacity factor (default to 0.5). |
