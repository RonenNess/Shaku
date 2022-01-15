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
    * [.canvas](#Gfx+canvas) ⇒ <code>Canvas</code>
    * [.Effect](#Gfx+Effect)
    * [.BasicEffect](#Gfx+BasicEffect)
    * [.Sprite](#Gfx+Sprite)
    * [.SpritesGroup](#Gfx+SpritesGroup)
    * [.Matrix](#Gfx+Matrix)
    * [.TextAlignment](#Gfx+TextAlignment)
    * [.renderingRegion](#Gfx+renderingRegion) ⇒ <code>Rectangle</code>
    * [.canvasSize](#Gfx+canvasSize) ⇒ <code>Vector2</code>
    * [.BlendModes](#Gfx+BlendModes)
    * [.TextureWrapModes](#Gfx+TextureWrapModes)
    * [.TextureFilterModes](#Gfx+TextureFilterModes)
    * [.drawCallsCount](#Gfx+drawCallsCount) ⇒ <code>Number</code>
    * [.setContextAttributes(flags)](#Gfx+setContextAttributes)
    * [.setCanvas(element)](#Gfx+setCanvas)
    * [.createCamera(withViewport)](#Gfx+createCamera) ⇒ <code>Camera</code>
    * [.createEffect(type)](#Gfx+createEffect) ⇒ <code>Effect</code>
    * [.maximizeCanvasSize(limitToParent)](#Gfx+maximizeCanvasSize)
    * [.setRenderTarget(texture)](#Gfx+setRenderTarget)
    * [.useEffect(effect)](#Gfx+useEffect)
    * [.setResolution(width, height, updateCanvasStyle)](#Gfx+setResolution)
    * [.resetCamera()](#Gfx+resetCamera)
    * [.applyCamera(camera)](#Gfx+applyCamera)
    * [.buildText(fontTexture, text, fontSize, color, alignment, marginFactor)](#Gfx+buildText) ⇒ <code>SpritesGroup</code>
    * [.drawGroup(group, useBatching)](#Gfx+drawGroup)
    * [.drawSprite(sprite, transform)](#Gfx+drawSprite)
    * [.cover(texture, destRect, sourceRect, color, blendMode)](#Gfx+cover)
    * [.draw(texture, position, size, sourceRect, color, blendMode, rotation, origin, transform)](#Gfx+draw)
    * [.fillRect(destRect, color, blend, rotation)](#Gfx+fillRect)
    * [.drawLine(startPoint, endPoint, color, blendMode)](#Gfx+drawLine)
    * [.drawLines(points, colors, blendMode, looped)](#Gfx+drawLines)
    * [.clear(color)](#Gfx+clear)

<a name="new_Gfx_new"></a>

### new Gfx()
Create the manager.

<a name="Gfx+canvas"></a>

### gfx.canvas ⇒ <code>Canvas</code>
Get the canvas element controlled by the gfx manager.
If you didn't provide your own canvas before initialization, you must add this canvas to your document after initializing `Shaku`.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**Returns**: <code>Canvas</code> - Canvas we use for rendering.  
**Example**  
```js
document.body.appendChild(Shaku.gfx.canvas);
```
<a name="Gfx+Effect"></a>

### gfx.Effect
Get the Effect base class, which is required to implement custom effects.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**See**: Effect  
<a name="Gfx+BasicEffect"></a>

### gfx.BasicEffect
Get the default Effect class, which is required to implement custom effects that inherit and reuse parts from the default effect.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**See**: BasicEffect  
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
<a name="Gfx+TextAlignment"></a>

### gfx.TextAlignment
Get the text alignments options.
* Left: align text to the left.
* Right: align text to the right.
* Center: align text to center.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**See**: TextAlignment  
<a name="Gfx+renderingRegion"></a>

### gfx.renderingRegion ⇒ <code>Rectangle</code>
Get rendering region (based on resolution / canvas, without viewport or camera properties).

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**Returns**: <code>Rectangle</code> - Rectangle with rendering region.  
<a name="Gfx+canvasSize"></a>

### gfx.canvasSize ⇒ <code>Vector2</code>
Get canvas size as vector.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**Returns**: <code>Vector2</code> - Canvas size.  
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
<a name="Gfx+setContextAttributes"></a>

### gfx.setContextAttributes(flags)
Set WebGL init flags (passed as additional params to the getContext() call). 
You must call this *before* initializing *Shaku*.

By default, *Shaku* will init WebGL context with the following flags:
- antialias: false.
- alpha: true.
- depth: false.
- premultipliedAlpha: true.

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
| element | <code>Canvas</code> | Canvas element to initialize on. |

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

<a name="Gfx+createEffect"></a>

### gfx.createEffect(type) ⇒ <code>Effect</code>
Create and return an effect instance.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  
**Returns**: <code>Effect</code> - Effect instance.  
**See**: Effect  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>Class</code> | Effect class type. Must inherit from Effect base class. |

<a name="Gfx+maximizeCanvasSize"></a>

### gfx.maximizeCanvasSize(limitToParent)
Set resolution and canvas to the max size of its parent element or screen.
If the canvas is directly under document body, it will take the max size of the page.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| limitToParent | <code>Boolean</code> | if true, will use parent element size. If false, will stretch on entire document. |

<a name="Gfx+setRenderTarget"></a>

### gfx.setRenderTarget(texture)
Set a render target (texture) to render on.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| texture | <code>TextureAsset</code> | Render target texture to set as render target, or null to reset and render back on canvas. |

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
<a name="Gfx+useEffect"></a>

### gfx.useEffect(effect)
Set effect to use for future draw calls.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| effect | <code>Effect</code> | Effect to use or null to use the basic builtin effect. |

**Example**  
```js
let effect = Shaku.gfx.createEffect(MyEffectType);
Shaku.gfx.useEffect(effect);
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

<a name="Gfx+buildText"></a>

### gfx.buildText(fontTexture, text, fontSize, color, alignment, marginFactor) ⇒ <code>SpritesGroup</code>
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
| fontSize | <code>Number</code> | Font size, or undefined to use font texture base size. |
| color | <code>Color</code> | Text sprites color. |
| alignment | <code>TextAlignment</code> | Text alignment. |
| marginFactor | <code>Vector2</code> | Optional factor for characters and line spacing. For example value of 2,1 will make double horizontal spacing. |

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
<a name="Gfx+drawGroup"></a>

### gfx.drawGroup(group, useBatching)
Draw a SpritesGroup object. 
A SpritesGroup is a collection of sprites we can draw in bulks + transformations to apply on the entire group.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| group | <code>SpritesGroup</code> | Sprites group to draw. |
| useBatching | <code>Boolean</code> | If true (default), will use batching while rendering the group. |

**Example**  
```js
// load texture
let texture = await Shaku.assets.loadTexture('assets/sprite.png');

// create group and set entire group's position and scale
let group = new Shaku.gfx.SpritesGroup();
group.position.set(125, 300);
group.scale.set(2, 2);

// create 5 sprites and add to group
for (let i = 0; i < 5; ++i) {
  let sprite = new Shaku.gfx.Sprite(texture);
  sprite.position.set(100 * i, 150);
  sprite.size.set(50, 50);
  group.add(sprite)
}

// draw the group with batching
Shaku.gfx.drawGroup(group, true);
```
<a name="Gfx+drawSprite"></a>

### gfx.drawSprite(sprite, transform)
Draw a single sprite object.
Sprites are optional objects that store all the parameters for a `draw()` call. They are also used for batch rendering.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| sprite | <code>Sprite</code> | Sprite object to draw. |
| transform | <code>Matrix</code> | Optional parent transformation matrix. |

**Example**  
```js
// load texture and create sprite
let texture = await Shaku.assets.loadTexture('assets/sprite.png');
let sprite = new Shaku.gfx.Sprite(texture);

// set position and size
sprite.position.set(100, 150);
sprite.size.set(50, 50);

// draw sprite
Shaku.gfx.drawSprite(sprite);
```
<a name="Gfx+cover"></a>

### gfx.cover(texture, destRect, sourceRect, color, blendMode)
Draw a texture to cover a given destination rectangle.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| texture | <code>TextureAsset</code> | Texture to draw. |
| destRect | <code>Rectangle</code> | Destination rectangle to draw on. |
| sourceRect | <code>Rectangle</code> | Source rectangle, or undefined to use the entire texture. |
| color | <code>Color</code> | Tint color, or undefined to not change color. |
| blendMode | <code>BlendModes</code> | Blend mode, or undefined to use alpha blend. |

**Example**  
```js
// cover the entire screen with an image
let texture = await Shaku.assets.loadTexture('assets/sprite.png');
Shaku.gfx.cover(texture, Shaku.gfx.renderingRegion);
```
**Example**  
```js
// draw with additional params
let sourceRect = new Shaku.utils.Rectangle(0, 0, 64, 64);
let color = Shaku.utils.Color.blue;
let blendMode = Shaku.gfx.BlendModes.Multiply;
let rotation = Math.PI / 4;
let origin = new Shaku.utils.Vector2(0.5, 0.5);
Shaku.gfx.draw(texture, position, size, sourceRect, color, blendMode, rotation, origin);
```
<a name="Gfx+draw"></a>

### gfx.draw(texture, position, size, sourceRect, color, blendMode, rotation, origin, transform)
Draw a texture.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| texture | <code>TextureAsset</code> | Texture to draw. |
| position | <code>Vector2</code> | Drawing position (at origin). |
| size | <code>Vector2</code> \| <code>Number</code> | Drawing size. |
| sourceRect | <code>Rectangle</code> | Source rectangle, or undefined to use the entire texture. |
| color | <code>Color</code> | Tint color, or undefined to not change color. |
| blendMode | <code>BlendModes</code> | Blend mode, or undefined to use alpha blend. |
| rotation | <code>Number</code> | Rotate sprite. |
| origin | <code>Vector2</code> | Drawing origin. This will be the point at 'position' and rotation origin. |
| transform | <code>Matrix</code> | Optional parent transformation matrix. |

**Example**  
```js
// a simple draw with position and size
let texture = await Shaku.assets.loadTexture('assets/sprite.png');
let position = new Shaku.utils.Vector2(100, 100);
let size = new Shaku.utils.Vector2(75, 125); // if width == height, you can pass as a number instead of vector
Shaku.gfx.draw(texture, position, size);
```
**Example**  
```js
// draw with additional params
let sourceRect = new Shaku.utils.Rectangle(0, 0, 64, 64);
let color = Shaku.utils.Color.blue;
let blendMode = Shaku.gfx.BlendModes.Multiply;
let rotation = Math.PI / 4;
let origin = new Shaku.utils.Vector2(0.5, 0.5);
Shaku.gfx.draw(texture, position, size, sourceRect, color, blendMode, rotation, origin);
```
<a name="Gfx+fillRect"></a>

### gfx.fillRect(destRect, color, blend, rotation)
Draw a filled colored rectangle.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| destRect | <code>Rectangle</code> | Rectangle to fill. |
| color | <code>Color</code> | Rectangle fill color. |
| blend | <code>BlendModes</code> | Blend mode. |
| rotation | <code>Number</code> | Rotate the rectangle around its center. |

**Example**  
```js
// draw a 50x50 red rectangle at position 100x100, that will rotate over time
Shaku.gfx.fillRect(new Shaku.utils.Rectangle(100, 100, 50, 50), Shaku.utils.Color.red, null, Shaku.gameTime.elapsed);
```
<a name="Gfx+drawLine"></a>

### gfx.drawLine(startPoint, endPoint, color, blendMode)
Draw a single line between two points.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| startPoint | <code>Vector2</code> | Line start point. |
| endPoint | <code>Vector2</code> | Line end point. |
| color | <code>Color</code> | Line color. |
| blendMode | <code>BlendModes</code> | Blend mode to draw lines with (default to Opaque). |

**Example**  
```js
Shaku.gfx.drawLine(new Shaku.utils.Vector2(50,50), new Shaku.utils.Vector2(150,50), Shaku.utils.Color.red);
```
<a name="Gfx+drawLines"></a>

### gfx.drawLines(points, colors, blendMode, looped)
Draw a strip of lines between an array of points.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| points | <code>Array.&lt;Vector2&gt;</code> | Points to draw line between. |
| colors | <code>Color</code> \| <code>Array.&lt;Color&gt;</code> | Single lines color if you want one color for all lines, or an array of colors per segment. |
| blendMode | <code>BlendModes</code> | Blend mode to draw lines with (default to Opaque). |
| looped | <code>Boolean</code> | If true, will also draw a line from last point back to first point. |

**Example**  
```js
let lines = [new Shaku.utils.Vector2(50,50), new Shaku.utils.Vector2(150,50), new Shaku.utils.Vector2(150,150)];
let colors = [Shaku.utils.Color.random(), Shaku.utils.Color.random(), Shaku.utils.Color.random()];
Shaku.gfx.drawLines(lines, colors);
```
<a name="Gfx+clear"></a>

### gfx.clear(color)
Clear screen to a given color.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>Color</code> | Color to clear screen to, or black if not set. |

**Example**  
```js
Shaku.gfx.clear(Shaku.utils.Color.cornflowerblue);
```
