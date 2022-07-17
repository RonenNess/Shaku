![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Tilemap

<a name="TilemapShape"></a>

## TilemapShape
Collision tilemap class.
A collision tilemap shape is a grid of equal-sized cells that can either block or not (+ have collision flags).
Its the most efficient (both memory and CPU) way to implement grid based / tilemap collision.

**Kind**: global class  

* [TilemapShape](#TilemapShape)
    * [new TilemapShape(offset, gridSize, tileSize, borderThickness)](#new_TilemapShape_new)
    * [.shapeId](#TilemapShape+shapeId)
    * [.setTile(index, haveCollision, collisionFlags)](#TilemapShape+setTile)
    * [.getTileAt(position)](#TilemapShape+getTileAt) ⇒ <code>RectangleShape</code>
    * [.iterateTilesAtRegion(region, callback)](#TilemapShape+iterateTilesAtRegion)
    * [.getTilesAtRegion(region)](#TilemapShape+getTilesAtRegion) ⇒ <code>Array.&lt;RectangleShape&gt;</code>
    * [._getRadius()](#TilemapShape+_getRadius)
    * [._getBoundingBox()](#TilemapShape+_getBoundingBox)
    * [.getCenter()](#TilemapShape+getCenter)
    * [.debugDraw(opacity)](#TilemapShape+debugDraw)

<a name="new_TilemapShape_new"></a>

### new TilemapShape(offset, gridSize, tileSize, borderThickness)
Create the collision tilemap.


| Param | Type | Description |
| --- | --- | --- |
| offset | <code>Vector2</code> | Tilemap top-left corner. |
| gridSize | <code>Vector2</code> | Number of tiles on X and Y axis. |
| tileSize | <code>Vector2</code> | The size of a single tile. |
| borderThickness | <code>Number</code> | Set a border collider with this thickness. |

<a name="TilemapShape+shapeId"></a>

### tilemapShape.shapeId
**Kind**: instance property of [<code>TilemapShape</code>](#TilemapShape)  
<a name="TilemapShape+setTile"></a>

### tilemapShape.setTile(index, haveCollision, collisionFlags)
Set the state of a tile.

**Kind**: instance method of [<code>TilemapShape</code>](#TilemapShape)  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>Vector2</code> | Tile index. |
| haveCollision | <code>Boolean</code> | Does this tile have collision? |
| collisionFlags | <code>Number</code> | Optional collision flag to set for this tile. |

<a name="TilemapShape+getTileAt"></a>

### tilemapShape.getTileAt(position) ⇒ <code>RectangleShape</code>
Get the collision shape of a tile at a given position.

**Kind**: instance method of [<code>TilemapShape</code>](#TilemapShape)  
**Returns**: <code>RectangleShape</code> - Collision shape at this position, or null if not set.  

| Param | Type | Description |
| --- | --- | --- |
| position | <code>Vector2</code> | Position to get tile at. |

<a name="TilemapShape+iterateTilesAtRegion"></a>

### tilemapShape.iterateTilesAtRegion(region, callback)
Iterate all tiles in given region, represented by a rectangle.

**Kind**: instance method of [<code>TilemapShape</code>](#TilemapShape)  

| Param | Type | Description |
| --- | --- | --- |
| region | <code>Rectangle</code> | Rectangle to get tiles for. |
| callback | <code>function</code> | Method to invoke for every tile. Return false to break iteration. |

<a name="TilemapShape+getTilesAtRegion"></a>

### tilemapShape.getTilesAtRegion(region) ⇒ <code>Array.&lt;RectangleShape&gt;</code>
Get all tiles in given region, represented by a rectangle.

**Kind**: instance method of [<code>TilemapShape</code>](#TilemapShape)  
**Returns**: <code>Array.&lt;RectangleShape&gt;</code> - Array with rectangle shapes or empty if none found.  

| Param | Type | Description |
| --- | --- | --- |
| region | <code>Rectangle</code> | Rectangle to get tiles for. |

<a name="TilemapShape+_getRadius"></a>

### tilemapShape.\_getRadius()
**Kind**: instance method of [<code>TilemapShape</code>](#TilemapShape)  
<a name="TilemapShape+_getBoundingBox"></a>

### tilemapShape.\_getBoundingBox()
**Kind**: instance method of [<code>TilemapShape</code>](#TilemapShape)  
<a name="TilemapShape+getCenter"></a>

### tilemapShape.getCenter()
**Kind**: instance method of [<code>TilemapShape</code>](#TilemapShape)  
<a name="TilemapShape+debugDraw"></a>

### tilemapShape.debugDraw(opacity)
Debug draw this shape.

**Kind**: instance method of [<code>TilemapShape</code>](#TilemapShape)  

| Param | Type | Description |
| --- | --- | --- |
| opacity | <code>Number</code> | Shape opacity factor. |

