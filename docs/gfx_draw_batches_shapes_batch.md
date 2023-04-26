![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Shapes Batch

<a name="ShapesBatch"></a>

## ShapesBatch
Colored shapes renderer. 
Responsible to drawing a batch of basic geometric shapes with as little draw calls as possible.

**Kind**: global class  

* [ShapesBatch](#ShapesBatch)
    * [new ShapesBatch([batchPolygonsCount])](#new_ShapesBatch_new)
    * [.onOverflow](#ShapesBatch+onOverflow) : <code>function</code>
    * [.snapPixels](#ShapesBatch+snapPixels) : <code>Boolean</code>
    * [.isDestroyed](#ShapesBatch+isDestroyed)
    * [.defaultEffect](#ShapesBatch+defaultEffect)
    * [.polygonsInBatch](#ShapesBatch+polygonsInBatch) ⇒ <code>Number</code>
    * [.maxPolygonsCount](#ShapesBatch+maxPolygonsCount) ⇒ <code>Number</code>
    * [.isFull](#ShapesBatch+isFull) ⇒ <code>Boolean</code>
    * [.clear()](#ShapesBatch+clear)
    * [.destroy()](#ShapesBatch+destroy)
    * [.drawLine(fromPoint, toPoint, color, [width])](#ShapesBatch+drawLine)
    * [.drawVertices(vertices)](#ShapesBatch+drawVertices)
    * [.drawQuad(position, size, color, [rotation], [origin], [skew])](#ShapesBatch+drawQuad)
    * [.addPoint(position, color)](#ShapesBatch+addPoint)
    * [.drawRectangle(destRect, color, [rotation], [origin])](#ShapesBatch+drawRectangle)
    * [.drawCircle(circle, color, [segmentsCount], [outsideColor], ratio, [rotation])](#ShapesBatch+drawCircle)

<a name="new_ShapesBatch_new"></a>

### new ShapesBatch([batchPolygonsCount])
Create the sprites batch.


| Param | Type | Description |
| --- | --- | --- |
| [batchPolygonsCount] | <code>Number</code> | Internal buffers size, in polygons count (polygon = 3 vertices). Bigger value = faster rendering but more RAM. |

<a name="ShapesBatch+onOverflow"></a>

### shapesBatch.onOverflow : <code>function</code>
Optional method to trigger when shapes batch overflows and can't contain any more polygons.

**Kind**: instance property of [<code>ShapesBatch</code>](#ShapesBatch)  
<a name="ShapesBatch+snapPixels"></a>

### shapesBatch.snapPixels : <code>Boolean</code>
If true, will floor vertices positions before pushing them to batch.

**Kind**: instance property of [<code>ShapesBatch</code>](#ShapesBatch)  
<a name="ShapesBatch+isDestroyed"></a>

### shapesBatch.isDestroyed
**Kind**: instance property of [<code>ShapesBatch</code>](#ShapesBatch)  
<a name="ShapesBatch+defaultEffect"></a>

### shapesBatch.defaultEffect
**Kind**: instance property of [<code>ShapesBatch</code>](#ShapesBatch)  
<a name="ShapesBatch+polygonsInBatch"></a>

### shapesBatch.polygonsInBatch ⇒ <code>Number</code>
Get how many polygons are currently in batch.

**Kind**: instance property of [<code>ShapesBatch</code>](#ShapesBatch)  
**Returns**: <code>Number</code> - Polygons in batch count.  
<a name="ShapesBatch+maxPolygonsCount"></a>

### shapesBatch.maxPolygonsCount ⇒ <code>Number</code>
Get how many polygons this sprite batch can contain.

**Kind**: instance property of [<code>ShapesBatch</code>](#ShapesBatch)  
**Returns**: <code>Number</code> - Max polygons count.  
<a name="ShapesBatch+isFull"></a>

### shapesBatch.isFull ⇒ <code>Boolean</code>
Check if this batch is full.

**Kind**: instance property of [<code>ShapesBatch</code>](#ShapesBatch)  
**Returns**: <code>Boolean</code> - True if batch is full.  
<a name="ShapesBatch+clear"></a>

### shapesBatch.clear()
**Kind**: instance method of [<code>ShapesBatch</code>](#ShapesBatch)  
<a name="ShapesBatch+destroy"></a>

### shapesBatch.destroy()
**Kind**: instance method of [<code>ShapesBatch</code>](#ShapesBatch)  
<a name="ShapesBatch+drawLine"></a>

### shapesBatch.drawLine(fromPoint, toPoint, color, [width])
Draw a line between two points.
This method actually uses a rectangle internally, which is less efficient than using a proper LinesBatch, but have the advantage of supporting width.

**Kind**: instance method of [<code>ShapesBatch</code>](#ShapesBatch)  

| Param | Type | Description |
| --- | --- | --- |
| fromPoint | <code>Vector2</code> | Starting position. |
| toPoint | <code>Vector2</code> | Ending position. |
| color | <code>Color</code> | Line color. |
| [width] | <code>Number</code> | Line width. |

<a name="ShapesBatch+drawVertices"></a>

### shapesBatch.drawVertices(vertices)
Push vertices to drawing batch.

**Kind**: instance method of [<code>ShapesBatch</code>](#ShapesBatch)  

| Param | Type | Description |
| --- | --- | --- |
| vertices | <code>Array.&lt;Vertex&gt;</code> | Vertices to push. Vertices count must be dividable by 3 to keep the batch consistent of polygons. |

<a name="ShapesBatch+drawQuad"></a>

### shapesBatch.drawQuad(position, size, color, [rotation], [origin], [skew])
Add a rectangle to draw.

**Kind**: instance method of [<code>ShapesBatch</code>](#ShapesBatch)  

| Param | Type | Description |
| --- | --- | --- |
| position | <code>Vector2</code> \| <code>Vector3</code> | Drawing position (at origin). If vector3 is provided, will pass z value to the shader code position attribute. |
| size | <code>Vector2</code> \| <code>Vector3</code> \| <code>Number</code> | Drawing size. If vector3 is provided, will pass z value to the shader code position attribute for the bottom vertices, as position.z + size.z. |
| color | <code>Color</code> \| <code>Array.&lt;Color&gt;</code> \| <code>undefined</code> | Rectangle color, or undefined to not change color. If array is set, will assign each color to different vertex, starting from top-left. |
| [rotation] | <code>Number</code> | Rotate rectangle. |
| [origin] | <code>Vector2</code> | Drawing origin. This will be the point at 'position' and rotation origin. |
| [skew] | <code>Vector2</code> | Skew the drawing corners on X and Y axis, around the origin point. |

<a name="ShapesBatch+addPoint"></a>

### shapesBatch.addPoint(position, color)
Adds a 1x1 point.

**Kind**: instance method of [<code>ShapesBatch</code>](#ShapesBatch)  

| Param | Type | Description |
| --- | --- | --- |
| position | <code>Vector2</code> \| <code>Vector3</code> | Point position. |
| color | <code>Color</code> | Point color. |

<a name="ShapesBatch+drawRectangle"></a>

### shapesBatch.drawRectangle(destRect, color, [rotation], [origin])
Add a rectangle that covers a given destination rectangle.

**Kind**: instance method of [<code>ShapesBatch</code>](#ShapesBatch)  

| Param | Type | Description |
| --- | --- | --- |
| destRect | <code>Rectangle</code> \| <code>Vector2</code> | Destination rectangle to draw on. If vector is provided, will draw from 0,0 with vector as size. |
| color | <code>Color</code> \| <code>Array.&lt;Color&gt;</code> \| <code>undefined</code> | Rectangle color, or undefined to not change color. If array is set, will assign each color to different vertex, starting from top-left. |
| [rotation] | <code>Number</code> | Rotate rectangle. |
| [origin] | <code>Vector2</code> | Drawing origin. This will be the point at 'position' and rotation origin. |

<a name="ShapesBatch+drawCircle"></a>

### shapesBatch.drawCircle(circle, color, [segmentsCount], [outsideColor], ratio, [rotation])
Draw a colored circle.

**Kind**: instance method of [<code>ShapesBatch</code>](#ShapesBatch)  

| Param | Type | Description |
| --- | --- | --- |
| circle | <code>Circle</code> | Circle to draw. |
| color | <code>Color</code> | Circle fill color. |
| [segmentsCount] | <code>Number</code> | How many segments to build the circle from (more segments = smoother circle). |
| [outsideColor] | <code>Color</code> | If provided, will create a gradient-colored circle and this value will be the outter side color. |
| ratio | <code>Number</code> \| <code>Vector2</code> | If procided, will scale the circle on X and Y axis to turn it into an oval. If a number is provided, will use this number to scale Y axis. |
| [rotation] | <code>Number</code> | If provided will rotate the oval / circle. |

