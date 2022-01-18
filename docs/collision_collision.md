![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Collision

<a name="Collision"></a>

## Collision
Collision is the collision manager. 
It provides basic 2d collision detection functionality.
Note: this is *not* a physics engine, its only for detection and objects picking.

To access the Collision manager you use `Shaku.collision`.

**Kind**: global class  

* [Collision](#Collision)
    * [new Collision()](#new_Collision_new)
    * [.resolver](#Collision+resolver)
    * [.RectangleShape](#Collision+RectangleShape)
    * [.PointShape](#Collision+PointShape)
    * [.CircleShape](#Collision+CircleShape)
    * [.createWorld(gridCellSize)](#Collision+createWorld) ⇒ <code>CollisionWorld</code>

<a name="new_Collision_new"></a>

### new Collision()
Create the manager.

<a name="Collision+resolver"></a>

### collision.resolver
The collision resolver we use to detect collision between different shapes. 
You can use this object directly without creating a collision world, if you just need to test collision between shapes.

**Kind**: instance property of [<code>Collision</code>](#Collision)  
<a name="Collision+RectangleShape"></a>

### collision.RectangleShape
Get the collision reactanle shape class.

**Kind**: instance property of [<code>Collision</code>](#Collision)  
<a name="Collision+PointShape"></a>

### collision.PointShape
Get the collision point shape class.

**Kind**: instance property of [<code>Collision</code>](#Collision)  
<a name="Collision+CircleShape"></a>

### collision.CircleShape
Get the collision circle shape class.

**Kind**: instance property of [<code>Collision</code>](#Collision)  
<a name="Collision+createWorld"></a>

### collision.createWorld(gridCellSize) ⇒ <code>CollisionWorld</code>
Create a new collision world object.

**Kind**: instance method of [<code>Collision</code>](#Collision)  
**Returns**: <code>CollisionWorld</code> - Newly created collision world.  

| Param | Type | Description |
| --- | --- | --- |
| gridCellSize | <code>Number</code> \| <code>Vector2</code> | Collision world grid cell size. |

