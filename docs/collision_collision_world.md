![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Collision World

<a name="CollisionWorld"></a>

## CollisionWorld
A collision world is a set of collision shapes that interact with each other.
You can use different collision worlds to represent different levels or different parts of your game world.

**Kind**: global class  

* [CollisionWorld](#CollisionWorld)
    * [new CollisionWorld(resolver, gridCellSize)](#new_CollisionWorld_new)
    * [.resolver](#CollisionWorld+resolver)
    * [.stats](#CollisionWorld+stats) ⇒ <code>\*</code>
    * [.resetStats()](#CollisionWorld+resetStats)
    * [.iterateShapes(callback)](#CollisionWorld+iterateShapes)
    * [.addShape(shape)](#CollisionWorld+addShape)
    * [.removeShape(shape)](#CollisionWorld+removeShape)
    * [.testCollision(sourceShape, sortByDistance, mask, predicate)](#CollisionWorld+testCollision) ⇒ <code>CollisionTestResult</code>
    * [.testCollisionMany(sourceShape, sortByDistance, mask, predicate, intermediateProcessor)](#CollisionWorld+testCollisionMany) ⇒ <code>Array.&lt;CollisionTestResult&gt;</code>
    * [.pick(position, radius, sortByDistance, mask, predicate)](#CollisionWorld+pick) ⇒ <code>Array.&lt;CollisionShape&gt;</code>
    * [.setDebugDrawBatch(batch)](#CollisionWorld+setDebugDrawBatch)
    * [.getOrCreateDebugDrawBatch()](#CollisionWorld+getOrCreateDebugDrawBatch) ⇒ <code>ShapesBatch</code>
    * [.debugDraw(gridColor, gridHighlitColor, opacity, camera)](#CollisionWorld+debugDraw)

<a name="new_CollisionWorld_new"></a>

### new CollisionWorld(resolver, gridCellSize)
Create the collision world.


| Param | Type | Description |
| --- | --- | --- |
| resolver | <code>CollisionResolver</code> | Collision resolver to use for this world. |
| gridCellSize | <code>Number</code> \| <code>Vector2</code> | For optimize collision testing, the collision world is divided into a collision grid. This param determine the grid cell size. |

<a name="CollisionWorld+resolver"></a>

### collisionWorld.resolver
Collision resolver used in this collision world.
By default, will inherit the collision manager default resolver.

**Kind**: instance property of [<code>CollisionWorld</code>](#CollisionWorld)  
<a name="CollisionWorld+stats"></a>

### collisionWorld.stats ⇒ <code>\*</code>
Get current stats.

**Kind**: instance property of [<code>CollisionWorld</code>](#CollisionWorld)  
**Returns**: <code>\*</code> - Dictionary with the following stats:
 updatedShapes: number of times we updated or added new shapes.
 addedShapes: number of new shapes added.
 deletedGridCells: grid cells that got deleted after they were empty.
 createdGridCell: new grid cells created.
 broadPhaseShapesChecksPrePredicate: how many shapes were tested in a broadphase check, before the predicate method was called.
 broadPhaseShapesChecksPostPredicate: how many shapes were tested in a broadphase check, after the predicate method was called.
 broadPhaseCalls: how many broadphase calls were made
 collisionChecks: how many shape-vs-shape collision checks were actually made.
 collisionMatches: how many collision checks were positive.  
<a name="CollisionWorld+resetStats"></a>

### collisionWorld.resetStats()
Reset stats.

**Kind**: instance method of [<code>CollisionWorld</code>](#CollisionWorld)  
<a name="CollisionWorld+iterateShapes"></a>

### collisionWorld.iterateShapes(callback)
Iterate all shapes in world.

**Kind**: instance method of [<code>CollisionWorld</code>](#CollisionWorld)  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | Callback to invoke on all shapes. Return false to break iteration. |

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

### collisionWorld.testCollision(sourceShape, sortByDistance, mask, predicate) ⇒ <code>CollisionTestResult</code>
Test collision with shapes in world, and return just the first result found.

**Kind**: instance method of [<code>CollisionWorld</code>](#CollisionWorld)  
**Returns**: <code>CollisionTestResult</code> - A collision test result, or null if not found.  

| Param | Type | Description |
| --- | --- | --- |
| sourceShape | <code>CollisionShape</code> | Source shape to check collision for. If shape is in world, it will not collide with itself. |
| sortByDistance | <code>Boolean</code> | If true will return the nearest collision found (based on center of shapes). |
| mask | <code>Number</code> | Optional mask of bits to match against shapes collisionFlags. Will only return shapes that have at least one common bit. |
| predicate | <code>function</code> | Optional filter to run on any shape we're about to test collision with. If the predicate returns false, we will skip this shape. |

<a name="CollisionWorld+testCollisionMany"></a>

### collisionWorld.testCollisionMany(sourceShape, sortByDistance, mask, predicate, intermediateProcessor) ⇒ <code>Array.&lt;CollisionTestResult&gt;</code>
Test collision with shapes in world, and return all results found.

**Kind**: instance method of [<code>CollisionWorld</code>](#CollisionWorld)  
**Returns**: <code>Array.&lt;CollisionTestResult&gt;</code> - An array of collision test results, or empty array if none found.  

| Param | Type | Description |
| --- | --- | --- |
| sourceShape | <code>CollisionShape</code> | Source shape to check collision for. If shape is in world, it will not collide with itself. |
| sortByDistance | <code>Boolean</code> | If true will sort results by distance. |
| mask | <code>Number</code> | Optional mask of bits to match against shapes collisionFlags. Will only return shapes that have at least one common bit. |
| predicate | <code>function</code> | Optional filter to run on any shape we're about to test collision with. If the predicate returns false, we will skip this shape. |
| intermediateProcessor | <code>function</code> | Optional method to run after each positive result with the collision result as param. Return false to stop and return results. |

<a name="CollisionWorld+pick"></a>

### collisionWorld.pick(position, radius, sortByDistance, mask, predicate) ⇒ <code>Array.&lt;CollisionShape&gt;</code>
Return array of shapes that touch a given position, with optional radius.

**Kind**: instance method of [<code>CollisionWorld</code>](#CollisionWorld)  
**Returns**: <code>Array.&lt;CollisionShape&gt;</code> - Array with collision shapes we picked.  

| Param | Type | Description |
| --- | --- | --- |
| position | <code>\*</code> | Position to pick. |
| radius | <code>\*</code> | Optional picking radius to use a circle instead of a point. |
| sortByDistance | <code>\*</code> | If true, will sort results by distance from point. |
| mask | <code>\*</code> | Collision mask to filter by. |
| predicate | <code>\*</code> | Optional predicate method to filter by. |

**Example**  
```js
let shapes = world.pick(Shaku.input.mousePosition);
```
<a name="CollisionWorld+setDebugDrawBatch"></a>

### collisionWorld.setDebugDrawBatch(batch)
Set the shapes batch to use for debug-drawing this collision world.

**Kind**: instance method of [<code>CollisionWorld</code>](#CollisionWorld)  

| Param | Type | Description |
| --- | --- | --- |
| batch | <code>ShapesBatch</code> | Batch to use for debug draw. |

<a name="CollisionWorld+getOrCreateDebugDrawBatch"></a>

### collisionWorld.getOrCreateDebugDrawBatch() ⇒ <code>ShapesBatch</code>
Return the currently set debug draw batch, or create a new one if needed.

**Kind**: instance method of [<code>CollisionWorld</code>](#CollisionWorld)  
**Returns**: <code>ShapesBatch</code> - Shapes batch instance used to debug-draw collision world.  
<a name="CollisionWorld+debugDraw"></a>

### collisionWorld.debugDraw(gridColor, gridHighlitColor, opacity, camera)
Debug-draw the current collision world.

**Kind**: instance method of [<code>CollisionWorld</code>](#CollisionWorld)  

| Param | Type | Description |
| --- | --- | --- |
| gridColor | <code>Color</code> | Optional grid color (default to black). |
| gridHighlitColor | <code>Color</code> | Optional grid color for cells with shapes in them (default to red). |
| opacity | <code>Number</code> | Optional opacity factor (default to 0.5). |
| camera | <code>Camera</code> | Optional camera for offset and viewport. |

