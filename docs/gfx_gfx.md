![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Gfx

<a name="Gfx"></a>

## Gfx
Gfx is the graphics manager. 
Everything related to rendering and managing your game canvas goes here.

To access the Graphics manager you use `Shaku.gfx`.

**Kind**: global class  

* [Gfx](#Gfx)
    * [new Gfx()](#new_Gfx_new)
    * [.builtinEffects](#Gfx+builtinEffects) : <code>Dictionary</code>
    * [.defaultTextureFilter](#Gfx+defaultTextureFilter) : <code>TextureFilterModes</code>
    * [.TextureWrapModes](#Gfx+TextureWrapModes) : <code>TextureWrapModes</code>
    * [.whiteTexture](#Gfx+whiteTexture) : <code>TextureAsset</code>
    * [.webglVersion](#Gfx+webglVersion) ⇒ <code>Number</code>
    * [.maxLineSegments](#Gfx+maxLineSegments) ⇒ <code>Number</code>
    * [.canvas](#Gfx+canvas) ⇒ <code>HTMLCanvasElement</code>
    * [.DrawBatch](#Gfx+DrawBatch)
    * [.SpriteBatch](#Gfx+SpriteBatch)
    * [.SpriteBatch3D](#Gfx+SpriteBatch3D)
    * [.TextSpriteBatch](#Gfx+TextSpriteBatch)
    * [.ShapesBatch](#Gfx+ShapesBatch)
    * [.LinesBatch](#Gfx+LinesBatch)
    * [.Effect](#Gfx+Effect)
    * [.SpritesEffect](#Gfx+SpritesEffect)
    * [.SpritesEffectNoVertexColor](#Gfx+SpritesEffectNoVertexColor)
    * [.ShapesEffect](#Gfx+ShapesEffect)
    * [.Sprites3dEffect](#Gfx+Sprites3dEffect)
    * [.MsdfFontEffect](#Gfx+MsdfFontEffect)
    * [.Sprite](#Gfx+Sprite)
    * [.SpritesGroup](#Gfx+SpritesGroup)
    * [.Matrix](#Gfx+Matrix)
    * [.Vertex](#Gfx+Vertex)
    * [.TextAlignments](#Gfx+TextAlignments)
    * [.BlendModes](#Gfx+BlendModes)
    * [.TextureWrapModes](#Gfx+TextureWrapModes)
    * [.TextureFilterModes](#Gfx+TextureFilterModes)
    * [.drawCallsCount](#Gfx+drawCallsCount) ⇒ <code>Number</code>
    * [.quadsDrawCount](#Gfx+quadsDrawCount) ⇒ <code>Number</code>
    * [.shapePolygonsDrawCount](#Gfx+shapePolygonsDrawCount) ⇒ <code>Number</code>
    * [.setContextAttributes(flags)](#Gfx+setContextAttributes)
    * [.setCanvas(element)](#Gfx+setCanvas)
    * [.createCamera(withViewport)](#Gfx+createCamera) ⇒ <code>Camera</code>
    * [.createCamera3D(withViewport)](#Gfx+createCamera3D) ⇒ <code>Camera3D</code>
    * [.setCameraOrthographic(offset)](#Gfx+setCameraOrthographic) ⇒ <code>Camera</code>
    * [.maximizeCanvasSize([limitToParent], [allowOddNumbers])](#Gfx+maximizeCanvasSize)
    * [.setRenderTarget(texture, [keepCamera])](#Gfx+setRenderTarget)
    * [.setResolution(width, height, updateCanvasStyle)](#Gfx+setResolution)
    * [.resetCamera()](#Gfx+resetCamera)
    * [.applyCamera(camera)](#Gfx+applyCamera)
    * [.getRenderingRegion(includeOffset)](#Gfx+getRenderingRegion) ⇒ <code>Rectangle</code>
    * [.getRenderingSize()](#Gfx+getRenderingSize) ⇒ <code>Vector2</code>
    * [.getCanvasSize()](#Gfx+getCanvasSize) ⇒ <code>Vector2</code>
    * [.buildText(fontTexture, text, [fontSize], color, [alignment], [offset], [marginFactor])](#Gfx+buildText) ⇒ <code>SpritesGroup</code>
    * [.centerCanvas()](#Gfx+centerCanvas)
    * [.inScreen(shape)](#Gfx+inScreen) ⇒ <code>Boolean</code>
    * [.centerCamera(position, useCanvasSize)](#Gfx+centerCamera)
    * [.clear([color])](#Gfx+clear)
    * [.clearDepth([value])](#Gfx+clearDepth)

<a name="new_Gfx_new"></a>

### new Gfx()
Create the manager.

<a name="Gfx+builtinEffects"></a>

### gfx.builtinEffects : <code>Dictionary</code>
A dictionary containing all built-in effect instances.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
<a name="Gfx+defaultTextureFilter"></a>

### gfx.defaultTextureFilter : <code>TextureFilterModes</code>
Default texture filter to use when no texture filter is set.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
<a name="Gfx+TextureWrapModes"></a>

### gfx.TextureWrapModes : <code>TextureWrapModes</code>
Default wrap modes to use when no wrap mode is set.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
<a name="Gfx+whiteTexture"></a>

### gfx.whiteTexture : <code>TextureAsset</code>
A 1x1 white texture.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
<a name="Gfx+webglVersion"></a>

### gfx.webglVersion ⇒ <code>Number</code>
Get the init WebGL version.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**Returns**: <code>Number</code> - WebGL version number.  
<a name="Gfx+maxLineSegments"></a>

### gfx.maxLineSegments ⇒ <code>Number</code>
Maximum number of vertices we allow when drawing lines.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**Returns**: <code>Number</code> - max vertices per lines strip.  
<a name="Gfx+canvas"></a>

### gfx.canvas ⇒ <code>HTMLCanvasElement</code>
Get the canvas element controlled by the gfx manager.
If you didn't provide your own canvas before initialization, you must add this canvas to your document after initializing `Shaku`.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**Returns**: <code>HTMLCanvasElement</code> - Canvas we use for rendering.  
**Example**  
```js
document.body.appendChild(Shaku.gfx.canvas);
```
<a name="Gfx+DrawBatch"></a>

### gfx.DrawBatch
Get the draw batch base class.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**See**: DrawBatch  
<a name="Gfx+SpriteBatch"></a>

### gfx.SpriteBatch
Get the sprites batch class.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**See**: SpriteBatch  
<a name="Gfx+SpriteBatch3D"></a>

### gfx.SpriteBatch3D
Get the 3d sprites batch class.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**See**: SpriteBatch3D  
<a name="Gfx+TextSpriteBatch"></a>

### gfx.TextSpriteBatch
Get the text sprites batch class.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**See**: TextSpriteBatch  
<a name="Gfx+ShapesBatch"></a>

### gfx.ShapesBatch
Get the shapes batch class.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**See**: ShapesBatch  
<a name="Gfx+LinesBatch"></a>

### gfx.LinesBatch
Get the lines batch class.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**See**: LinesBatch  
<a name="Gfx+Effect"></a>

### gfx.Effect
Get the Effect base class, which is required to implement custom effects.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**See**: Effect  
<a name="Gfx+SpritesEffect"></a>

### gfx.SpritesEffect
Get the default sprites effect class.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**See**: SpritesEffect  
<a name="Gfx+SpritesEffectNoVertexColor"></a>

### gfx.SpritesEffectNoVertexColor
Get the default sprites effect class that is used when vertex colors is disabled.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**See**: SpritesEffectNoVertexColor  
<a name="Gfx+ShapesEffect"></a>

### gfx.ShapesEffect
Get the default shapes effect class that is used to draw 2d shapes.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**See**: ShapesEffect  
<a name="Gfx+Sprites3dEffect"></a>

### gfx.Sprites3dEffect
Get the default 3d sprites effect class that is used to draw 3d textured quads.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**See**: Sprites3dEffect  
<a name="Gfx+MsdfFontEffect"></a>

### gfx.MsdfFontEffect
Get the Effect for rendering fonts with an MSDF texture.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**See**: MsdfFontEffect  
<a name="Gfx+Sprite"></a>

### gfx.Sprite
Get the sprite class.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**See**: Sprite  
<a name="Gfx+SpritesGroup"></a>

### gfx.SpritesGroup
Get the sprites group object.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**See**: SpritesGroup  
<a name="Gfx+Matrix"></a>

### gfx.Matrix
Get the matrix object.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**See**: Matrix  
<a name="Gfx+Vertex"></a>

### gfx.Vertex
Get the vertex object.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**See**: Vertex  
<a name="Gfx+TextAlignments"></a>

### gfx.TextAlignments
Get the text alignments options.
* Left: align text to the left.
* Right: align text to the right.
* Center: align text to center.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**See**: TextAlignments  
<a name="Gfx+BlendModes"></a>

### gfx.BlendModes
Get the blend modes enum.
* AlphaBlend
* Opaque
* Additive
* Multiply
* Subtract
* Screen
* Overlay
* Invert
* DestIn
* DestOut

![Blend Modes](resources/blend-modes.png)

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**See**: BlendModes  
<a name="Gfx+TextureWrapModes"></a>

### gfx.TextureWrapModes
Get the wrap modes enum.
* Clamp: when uv position exceed texture boundaries it will be clamped to the nearest border, ie repeat the edge pixels.
* Repeat: when uv position exceed texture boundaries it will wrap back to the other side.
* RepeatMirrored: when uv position exceed texture boundaries it will wrap back to the other side but also mirror the texture.

![Wrap Modes](resources/wrap-modes.png)

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**See**: TextureWrapModes  
<a name="Gfx+TextureFilterModes"></a>

### gfx.TextureFilterModes
Get texture filter modes.
* Nearest: no filtering, no mipmaps (pixelated).
* Linear: simple filtering, no mipmaps (smooth).
* NearestMipmapNearest: no filtering, sharp switching between mipmaps,
* LinearMipmapNearest: filtering, sharp switching between mipmaps.
* NearestMipmapLinear: no filtering, smooth transition between mipmaps.
* LinearMipmapLinear: filtering, smooth transition between mipmaps.

![Filter Modes](resources/filter-modes.png)

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**See**: TextureFilterModes  
<a name="Gfx+drawCallsCount"></a>

### gfx.drawCallsCount ⇒ <code>Number</code>
Get number of actual WebGL draw calls we performed since the beginning of the frame.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**Returns**: <code>Number</code> - Number of WebGL draw calls this frame.  
<a name="Gfx+quadsDrawCount"></a>

### gfx.quadsDrawCount ⇒ <code>Number</code>
Get number of textured / colored quads we drawn since the beginning of the frame.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**Returns**: <code>Number</code> - Number of quads drawn in this frame.  
<a name="Gfx+shapePolygonsDrawCount"></a>

### gfx.shapePolygonsDrawCount ⇒ <code>Number</code>
Get number of shape polygons we drawn since the beginning of the frame.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**Returns**: <code>Number</code> - Number of shape polygons drawn in this frame.  
<a name="Gfx+setContextAttributes"></a>

### gfx.setContextAttributes(flags)
Set WebGL init flags (passed as additional params to the getContext() call). 
You must call this *before* initializing *Shaku*.

By default, *Shaku* will init WebGL context with the following flags:
- antialias: true.
- alpha: true.
- depth: false.
- premultipliedAlpha: true.
- desynchronized: false.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| flags | <code>Dictionary</code> | WebGL init flags to set. |

**Example**  
```js
Shaku.gfx.setContextAttributes({ antialias: true, alpha: false });
```
<a name="Gfx+setCanvas"></a>

### gfx.setCanvas(element)
Set the canvas element to initialize on.
You must call this *before* initializing Shaku. Calling this will prevent Shaku from creating its own canvas.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>HTMLCanvasElement</code> | Canvas element to initialize on. |

**Example**  
```js
Shaku.gfx.setCanvas(document.getElementById('my-canvas')); 
```
<a name="Gfx+createCamera"></a>

### gfx.createCamera(withViewport) ⇒ <code>Camera</code>
Create and return a new camera instance.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  
**Returns**: <code>Camera</code> - New camera object.  

| Param | Type | Description |
| --- | --- | --- |
| withViewport | <code>Boolean</code> | If true, will create camera with viewport value equal to canvas' size. |

<a name="Gfx+createCamera3D"></a>

### gfx.createCamera3D(withViewport) ⇒ <code>Camera3D</code>
Create and return a new 3D camera instance.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  
**Returns**: <code>Camera3D</code> - New camera object.  

| Param | Type | Description |
| --- | --- | --- |
| withViewport | <code>Boolean</code> | If true, will create camera with viewport value equal to canvas' size. |

<a name="Gfx+setCameraOrthographic"></a>

### gfx.setCameraOrthographic(offset) ⇒ <code>Camera</code>
Set default orthographic camera from offset.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  
**Returns**: <code>Camera</code> - Camera instance.  

| Param | Type | Description |
| --- | --- | --- |
| offset | <code>Vector2</code> | Camera top-left corner. |

<a name="Gfx+maximizeCanvasSize"></a>

### gfx.maximizeCanvasSize([limitToParent], [allowOddNumbers])
Set resolution and canvas to the max size of its parent element or screen.
If the canvas is directly under document body, it will take the max size of the page.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| [limitToParent] | <code>Boolean</code> | if true, will use parent element size. If false, will stretch on entire document. |
| [allowOddNumbers] | <code>Boolean</code> | if true, will permit odd numbers, which could lead to small artefacts when drawing pixel art. If false (default) will round to even numbers. |

<a name="Gfx+setRenderTarget"></a>

### gfx.setRenderTarget(texture, [keepCamera])
Set a render target (texture) to render on.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| texture | <code>TextureAsset</code> \| <code>Array.&lt;TextureAsset&gt;</code> \| <code>null</code> | Render target texture to set as render target, or null to reset and render back on canvas. Can also be array for multiple targets, which will take layouts 0-15 by their order. |
| [keepCamera] | <code>Boolean</code> | If true, will keep current camera settings. If false (default) will reset camera. |

**Example**  
```js
// create render target
let renderTarget = await Shaku.assets.createRenderTarget('_my_render_target', 800, 600);

// use render target
Shaku.gfx.setRenderTarget(renderTarget);
// .. draw some stuff here

// reset render target and present it on screen
// note the negative height - render targets end up with flipped Y axis
Shaku.gfx.setRenderTarget(null);
Shaku.gfx.draw(renderTarget, new Shaku.utils.Vector2(screenX / 2, screenY / 2), new Shaku.utils.Vector2(screenX, -screenY));
```
<a name="Gfx+setResolution"></a>

### gfx.setResolution(width, height, updateCanvasStyle)
Set resolution and canvas size.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| width | <code>Number</code> | Resolution width. |
| height | <code>Number</code> | Resolution height. |
| updateCanvasStyle | <code>Boolean</code> | If true, will also update the canvas *css* size in pixels. |

**Example**  
```js
// set resolution and size of 800x600.
Shaku.gfx.setResolution(800, 600, true);
```
<a name="Gfx+resetCamera"></a>

### gfx.resetCamera()
Reset camera properties to default camera.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  
<a name="Gfx+applyCamera"></a>

### gfx.applyCamera(camera)
Set viewport, projection and other properties from a camera instance.
Changing the camera properties after calling this method will *not* update the renderer, until you call applyCamera again.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| camera | <code>Camera</code> | Camera to apply. |

<a name="Gfx+getRenderingRegion"></a>

### gfx.getRenderingRegion(includeOffset) ⇒ <code>Rectangle</code>
Get current rendering region.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  
**Returns**: <code>Rectangle</code> - Rectangle with rendering region.  

| Param | Type | Description |
| --- | --- | --- |
| includeOffset | <code>Boolean</code> | If true (default) will include viewport offset, if exists. |

<a name="Gfx+getRenderingSize"></a>

### gfx.getRenderingSize() ⇒ <code>Vector2</code>
Get current rendering size.
Unlike 'canvasSize', this takes viewport and render target into consideration.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  
**Returns**: <code>Vector2</code> - rendering size.  
<a name="Gfx+getCanvasSize"></a>

### gfx.getCanvasSize() ⇒ <code>Vector2</code>
Get canvas size as vector.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  
**Returns**: <code>Vector2</code> - Canvas size.  
<a name="Gfx+buildText"></a>

### gfx.buildText(fontTexture, text, [fontSize], color, [alignment], [offset], [marginFactor]) ⇒ <code>SpritesGroup</code>
Generate a sprites group to render a string using a font texture.
Take the result of this method and use with gfx.drawGroup() to render the text.
This is what you use when you want to draw texts with `Shaku`.
Note: its best to always draw texts with *batching* enabled.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  
**Returns**: <code>SpritesGroup</code> - Sprites group containing the needed sprites to draw the given text with its properties.  

| Param | Type | Description |
| --- | --- | --- |
| fontTexture | <code>FontTextureAsset</code> | Font texture asset to use. |
| text | <code>String</code> | Text to generate sprites for. |
| [fontSize] | <code>Number</code> | Font size, or undefined to use font texture base size. |
| color | <code>Color</code> \| <code>Array.&lt;Color&gt;&#x3D;</code> | Text sprites color. If array is set, will assign each color to different vertex, starting from top-left. |
| [alignment] | <code>TextAlignment</code> | Text alignment. |
| [offset] | <code>Vector2</code> | Optional starting offset. |
| [marginFactor] | <code>Vector2</code> | Optional factor for characters and line spacing. For example value of 2,1 will make double horizontal spacing. |

**Example**  
```js
// load font texture
let fontTexture = await Shaku.assets.loadFontTexture('assets/DejaVuSansMono.ttf', {fontName: 'DejaVuSansMono'});

// generate 'hello world!' text (note: you don't have to regenerate every frame if text didn't change)
let text1 = Shaku.gfx.buildText(fontTexture, "Hello World!");
text1.position.set(40, 40);

// draw text
Shaku.gfx.drawGroup(text1, true);
```
<a name="Gfx+centerCanvas"></a>

### gfx.centerCanvas()
Make the renderer canvas centered.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  
<a name="Gfx+inScreen"></a>

### gfx.inScreen(shape) ⇒ <code>Boolean</code>
Check if a given shape is currently in screen bounds, not taking camera into consideration.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  
**Returns**: <code>Boolean</code> - True if given shape is in visible region.  

| Param | Type | Description |
| --- | --- | --- |
| shape | <code>Circle</code> \| <code>Vector</code> \| <code>Rectangle</code> \| <code>Line</code> | Shape to check. |

<a name="Gfx+centerCamera"></a>

### gfx.centerCamera(position, useCanvasSize)
Make a given vector the center of the camera.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| position | <code>Vector2</code> | Camera position. |
| useCanvasSize | <code>Boolean</code> | If true, will always use cancas size when calculating center. If false and render target is set, will use render target's size. |

<a name="Gfx+clear"></a>

### gfx.clear([color])
Clear screen to a given color.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| [color] | <code>Color</code> | Color to clear screen to, or black if not set. |

**Example**  
```js
Shaku.gfx.clear(Shaku.utils.Color.cornflowerblue);
```
<a name="Gfx+clearDepth"></a>

### gfx.clearDepth([value])
Clear depth buffer.
Only relevant when depth is used.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| [value] | <code>Number</code> | Value to clear depth buffer to. |

