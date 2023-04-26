![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Draw Batch

<a name="DrawBatch"></a>

## DrawBatch
Base class for a drawing batch, used to draw a collection of sprites or shapes.

**Kind**: global class  

* [DrawBatch](#DrawBatch)
    * [new DrawBatch()](#new_DrawBatch_new)
    * [.defaultEffect](#DrawBatch+defaultEffect) ⇒ <code>Effect</code>
    * [.BuffersUsage](#DrawBatch+BuffersUsage)
    * [.isDestroyed](#DrawBatch+isDestroyed) ⇒ <code>Boolean</code>
    * [.isDrawing](#DrawBatch+isDrawing) ⇒ <code>Boolean</code>
    * [.isStatic](#DrawBatch+isStatic) ⇒ <code>Boolean</code>
    * [.defaultBlendMode](#DrawBatch+defaultBlendMode)
    * [.makeStatic()](#DrawBatch+makeStatic)
    * [.destroy()](#DrawBatch+destroy)
    * [.setBuffersUsage(usage)](#DrawBatch+setBuffersUsage)
    * [.begin([blendMode], [effect], [transform], [overrideEffectFlags])](#DrawBatch+begin)
    * [.endWithoutDraw()](#DrawBatch+endWithoutDraw)
    * [.end()](#DrawBatch+end)
    * [.present()](#DrawBatch+present)
    * [.clear()](#DrawBatch+clear)

<a name="new_DrawBatch_new"></a>

### new DrawBatch()
Create the draw batch.

<a name="DrawBatch+defaultEffect"></a>

### drawBatch.defaultEffect ⇒ <code>Effect</code>
Get the default effect to use for this drawing batch type.

**Kind**: instance property of [<code>DrawBatch</code>](#DrawBatch)  
**Returns**: <code>Effect</code> - Default effect to use for this drawing batch.  
<a name="DrawBatch+BuffersUsage"></a>

### drawBatch.BuffersUsage
Get the BuffersUsage enum.

**Kind**: instance property of [<code>DrawBatch</code>](#DrawBatch)  
**See**: BuffersUsage  
<a name="DrawBatch+isDestroyed"></a>

### drawBatch.isDestroyed ⇒ <code>Boolean</code>
Return if the batch was destroyed.

**Kind**: instance property of [<code>DrawBatch</code>](#DrawBatch)  
**Returns**: <code>Boolean</code> - True if batch was destoryed.  
<a name="DrawBatch+isDrawing"></a>

### drawBatch.isDrawing ⇒ <code>Boolean</code>
Return if the batch is currently drawing.

**Kind**: instance property of [<code>DrawBatch</code>](#DrawBatch)  
**Returns**: <code>Boolean</code> - If the batch began drawing.  
<a name="DrawBatch+isStatic"></a>

### drawBatch.isStatic ⇒ <code>Boolean</code>
Return if this batch was turned static.

**Kind**: instance property of [<code>DrawBatch</code>](#DrawBatch)  
**Returns**: <code>Boolean</code> - True if its a static batch you can no longer change.  
<a name="DrawBatch+defaultBlendMode"></a>

### drawBatch.defaultBlendMode
Get the default blend mode to use for this drawing batch.

**Kind**: instance property of [<code>DrawBatch</code>](#DrawBatch)  
<a name="DrawBatch+makeStatic"></a>

### drawBatch.makeStatic()
Make the batch buffers static.
This means you won't be able to change the drawings in this batch once end() is called, but you'll be able to redraw
the batch with different effects and transformations without copying any data, and much faster.
This also free up some internal arrays, thus reducing the memory used for this batch.
Note: must be called after 'begin()' and right before the 'end()' call.

**Kind**: instance method of [<code>DrawBatch</code>](#DrawBatch)  
<a name="DrawBatch+destroy"></a>

### drawBatch.destroy()
Destroy the batch and free any resources assigned to it.

**Kind**: instance method of [<code>DrawBatch</code>](#DrawBatch)  
<a name="DrawBatch+setBuffersUsage"></a>

### drawBatch.setBuffersUsage(usage)
Set the way we mark the buffers we pass to the GPU based on expected behavior.
Use StreamDraw if you want to set buffers once, and use them in GPU few times.
Use DynamicDraw if you want to set buffers many times, and use them in GPU many times.
Use StaticDraw if you want to set buffers once, and use them in GPU many times.

**Kind**: instance method of [<code>DrawBatch</code>](#DrawBatch)  

| Param | Type | Description |
| --- | --- | --- |
| usage | <code>BuffersUsage</code> | Buffers usage. |

<a name="DrawBatch+begin"></a>

### drawBatch.begin([blendMode], [effect], [transform], [overrideEffectFlags])
Start drawing this batch.
You must call this before doing any draw calls.

**Kind**: instance method of [<code>DrawBatch</code>](#DrawBatch)  

| Param | Type | Description |
| --- | --- | --- |
| [blendMode] | <code>BlendModes</code> | Blend mode to draw this batch in. |
| [effect] | <code>Effect</code> | Effect to use. If not defined will use this batch type default effect. |
| [transform] | <code>Matrix</code> | Optional transformations to apply on all sprites. |
| [overrideEffectFlags] | <code>\*</code> | Optional flags to override effect's defaults. Possible keys: {enableDepthTest, enableFaceCulling, enableStencilTest, enableDithering}. |

<a name="DrawBatch+endWithoutDraw"></a>

### drawBatch.endWithoutDraw()
Finish drawing without presenting on screen.

**Kind**: instance method of [<code>DrawBatch</code>](#DrawBatch)  
<a name="DrawBatch+end"></a>

### drawBatch.end()
End drawing and present whatever left in buffers on screen.

**Kind**: instance method of [<code>DrawBatch</code>](#DrawBatch)  
<a name="DrawBatch+present"></a>

### drawBatch.present()
Draw whatever is currently in buffers without ending the draw batch.

**Kind**: instance method of [<code>DrawBatch</code>](#DrawBatch)  
<a name="DrawBatch+clear"></a>

### drawBatch.clear()
Clear this buffer from any drawings in it.
Called internally if 'preserveBuffers' is not true.

**Kind**: instance method of [<code>DrawBatch</code>](#DrawBatch)  
