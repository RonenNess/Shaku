![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Lines Batch

<a name="LinesBatch"></a>

## LinesBatch
Colored lines renderer. 
Responsible to drawing a batch of line segments or strips.

**Kind**: global class  

* [LinesBatch](#LinesBatch)
    * [new LinesBatch([lineSegmentsCount])](#new_LinesBatch_new)
    * [.isDestroyed](#LinesBatch+isDestroyed)
    * [.defaultEffect](#LinesBatch+defaultEffect)
    * [.linesInBatch](#LinesBatch+linesInBatch) ⇒ <code>Number</code>
    * [.maxLinesCount](#LinesBatch+maxLinesCount) ⇒ <code>Number</code>
    * [.isFull](#LinesBatch+isFull) ⇒ <code>Boolean</code>
    * [.clear()](#LinesBatch+clear)
    * [.destroy()](#LinesBatch+destroy)
    * [.drawVertices(vertices)](#LinesBatch+drawVertices)
    * [.drawQuad(position, size, color, [rotation], [origin], [skew])](#LinesBatch+drawQuad)
    * [.drawRectangle(destRect, [sourceRect], color, [rotation], [origin])](#LinesBatch+drawRectangle)
    * [.drawCircle(circle, color, [segmentsCount], ratio, [rotation])](#LinesBatch+drawCircle)

<a name="new_LinesBatch_new"></a>

### new LinesBatch([lineSegmentsCount])
Create the sprites batch.


| Param | Type | Description |
| --- | --- | --- |
| [lineSegmentsCount] | <code>Number</code> | Internal buffers size, in line segments count (line segment = 3 vertices). Bigger value = faster rendering but more RAM. |

<a name="LinesBatch+isDestroyed"></a>

### linesBatch.isDestroyed
**Kind**: instance property of [<code>LinesBatch</code>](#LinesBatch)  
<a name="LinesBatch+defaultEffect"></a>

### linesBatch.defaultEffect
**Kind**: instance property of [<code>LinesBatch</code>](#LinesBatch)  
<a name="LinesBatch+linesInBatch"></a>

### linesBatch.linesInBatch ⇒ <code>Number</code>
Get how many line segments are currently in batch.

**Kind**: instance property of [<code>LinesBatch</code>](#LinesBatch)  
**Returns**: <code>Number</code> - Line segments in batch count.  
<a name="LinesBatch+maxLinesCount"></a>

### linesBatch.maxLinesCount ⇒ <code>Number</code>
Get how many line segments this batch can contain.

**Kind**: instance property of [<code>LinesBatch</code>](#LinesBatch)  
**Returns**: <code>Number</code> - Max line segments count.  
<a name="LinesBatch+isFull"></a>

### linesBatch.isFull ⇒ <code>Boolean</code>
Check if this batch is full.

**Kind**: instance property of [<code>LinesBatch</code>](#LinesBatch)  
**Returns**: <code>Boolean</code> - True if batch is full.  
<a name="LinesBatch+clear"></a>

### linesBatch.clear()
**Kind**: instance method of [<code>LinesBatch</code>](#LinesBatch)  
<a name="LinesBatch+destroy"></a>

### linesBatch.destroy()
**Kind**: instance method of [<code>LinesBatch</code>](#LinesBatch)  
<a name="LinesBatch+drawVertices"></a>

### linesBatch.drawVertices(vertices)
Push vertices to drawing batch.

**Kind**: instance method of [<code>LinesBatch</code>](#LinesBatch)  

| Param | Type | Description |
| --- | --- | --- |
| vertices | <code>Array.&lt;Vertex&gt;</code> | Vertices to push. Vertices count must be dividable by 3 to keep the batch consistent of polygons. |

<a name="LinesBatch+drawQuad"></a>

### linesBatch.drawQuad(position, size, color, [rotation], [origin], [skew])
Add a rectangle to draw.

**Kind**: instance method of [<code>LinesBatch</code>](#LinesBatch)  

| Param | Type | Description |
| --- | --- | --- |
| position | <code>Vector2</code> \| <code>Vector3</code> | Drawing position (at origin). If vector3 is provided, will pass z value to the shader code position attribute. |
| size | <code>Vector2</code> \| <code>Vector3</code> \| <code>Number</code> | Drawing size. If vector3 is provided, will pass z value to the shader code position attribute for the bottom vertices, as position.z + size.z. |
| color | <code>Color</code> \| <code>Array.&lt;Color&gt;</code> \| <code>undefined</code> | Rectangle color, or undefined to not change color. If array is set, will assign each color to different vertex, starting from top-left. |
| [rotation] | <code>Number</code> | Rotate rectangle. |
| [origin] | <code>Vector2</code> | Drawing origin. This will be the point at 'position' and rotation origin. |
| [skew] | <code>Vector2</code> | Skew the drawing corners on X and Y axis, around the origin point. |

<a name="LinesBatch+drawRectangle"></a>

### linesBatch.drawRectangle(destRect, [sourceRect], color, [rotation], [origin])
Add a rectangle that covers a given destination rectangle.

**Kind**: instance method of [<code>LinesBatch</code>](#LinesBatch)  

| Param | Type | Description |
| --- | --- | --- |
| destRect | <code>Rectangle</code> \| <code>Vector2</code> | Destination rectangle to draw on. If vector is provided, will draw from 0,0 with vector as size. |
| [sourceRect] | <code>Rectangle</code> | Source rectangle, or undefined to use the entire texture. |
| color | <code>Color</code> \| <code>Array.&lt;Color&gt;</code> \| <code>undefined</code> | Rectangle color, or undefined to not change color. If array is set, will assign each color to different vertex, starting from top-left. |
| [rotation] | <code>Number</code> | Rotate rectangle. |
| [origin] | <code>Vector2</code> | Drawing origin. This will be the point at 'position' and rotation origin. |

<a name="LinesBatch+drawCircle"></a>

### linesBatch.drawCircle(circle, color, [segmentsCount], ratio, [rotation])
Draw a colored circle.

**Kind**: instance method of [<code>LinesBatch</code>](#LinesBatch)  

| Param | Type | Description |
| --- | --- | --- |
| circle | <code>Circle</code> | Circle to draw. |
| color | <code>Color</code> | Circle fill color. |
| [segmentsCount] | <code>Number</code> | How many segments to build the circle from (more segments = smoother circle). |
| ratio | <code>Number</code> \| <code>Vector2</code> | If procided, will scale the circle on X and Y axis to turn it into an oval. If a number is provided, will use this number to scale Y axis. |
| [rotation] | <code>Number</code> | If provided will rotate the oval / circle. |

