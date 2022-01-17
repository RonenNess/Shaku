![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Resolver

<a name="CollisionResolver"></a>

## CollisionResolver
The collision resolver is responsible to implement collision detection between pair of shapes of same or different types.

**Kind**: global class  

* [CollisionResolver](#CollisionResolver)
    * [new CollisionResolver()](#new_CollisionResolver_new)
    * [.setHandler(firstShapeClass, secondShapeClass, handler)](#CollisionResolver+setHandler)
    * [.test(first, second)](#CollisionResolver+test) ⇒ <code>CollisionTestResult</code>

<a name="new_CollisionResolver_new"></a>

### new CollisionResolver()
Create the resolver.

<a name="CollisionResolver+setHandler"></a>

### collisionResolver.setHandler(firstShapeClass, secondShapeClass, handler)
Set the method used to test collision between two shapes.
Note: you don't need to register the same handler twice for reverse order, its done automatically inside.

**Kind**: instance method of [<code>CollisionResolver</code>](#CollisionResolver)  

| Param | Type | Description |
| --- | --- | --- |
| firstShapeClass | <code>Class</code> | The shape type the handler recieves as first argument. |
| secondShapeClass | <code>Class</code> | The shape type the handler recieves as second argument. |
| handler | <code>function</code> | Method to test collision between the shapes. Return false if don't collide, return either Vector2 with collision position or 'true' for collision. |

<a name="CollisionResolver+test"></a>

### collisionResolver.test(first, second) ⇒ <code>CollisionTestResult</code>
Check a collision between two shapes.

**Kind**: instance method of [<code>CollisionResolver</code>](#CollisionResolver)  
**Returns**: <code>CollisionTestResult</code> - collision detection result or null if they don't collide.  

| Param | Type | Description |
| --- | --- | --- |
| first | <code>CollisionShape</code> | First collision shape to test. |
| second | <code>CollisionShape</code> | Second collision shape to test. |

