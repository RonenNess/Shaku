declare const _exports: Gfx;
export = _exports;
/**
 * Gfx is the graphics manager.
 * Everything related to rendering and managing your game canvas goes here.
 *
 * To access the Graphics manager you use `Shaku.gfx`.
 */
declare class Gfx extends IManager {
    _gl: RenderingContext;
    _initSettings: {
        antialias: boolean;
        alpha: boolean;
        depth: boolean;
        premultipliedAlpha: boolean;
        desynchronized: boolean;
    };
    _canvas: HTMLCanvasElement;
    _lastBlendMode: any;
    _activeEffect: any;
    _camera: Camera;
    _projection: Matrix;
    _currIndices: any;
    _dynamicBuffers: {
        positionBuffer: any;
        positionArray: Float32Array;
        textureCoordBuffer: any;
        textureArray: Float32Array;
        colorsBuffer: any;
        colorsArray: Float32Array;
        indexBuffer: any;
        linesIndexBuffer: any;
    };
    _fb: any;
    builtinEffects: {};
    meshes: {};
    defaultTextureFilter: string;
    defaultTextureWrapMode: string;
    whiteTexture: TextureAsset;
    _renderTarget: TextureAsset;
    _viewport: Rectangle;
    _drawCallsCount: number;
    _drawQuadsCount: number;
    spritesBatch: SpriteBatch;
    /**
     * Get how many sprites we can draw in a single batch.
     * @private
     * @returns {Number} batch max sprites count.
     */
    private get batchSpritesCount();
    /**
     * Maximum number of vertices we allow when drawing lines.
     * @private
     * @returns {Number} max vertices per lines strip.
     */
    private get maxLineSegments();
    /**
     * Set WebGL init flags (passed as additional params to the getContext() call).
     * You must call this *before* initializing *Shaku*.
     *
     * By default, *Shaku* will init WebGL context with the following flags:
     * - antialias: true.
     * - alpha: true.
     * - depth: false.
     * - premultipliedAlpha: true.
     * - desynchronized: false.
     * @example
     * Shaku.gfx.setContextAttributes({ antialias: true, alpha: false });
     * @param {Dictionary} flags WebGL init flags to set.
     */
    setContextAttributes(flags: Dictionary): void;
    /**
     * Set the canvas element to initialize on.
     * You must call this *before* initializing Shaku. Calling this will prevent Shaku from creating its own canvas.
     * @example
     * Shaku.gfx.setCanvas(document.getElementById('my-canvas'));
     * @param {HTMLCanvasElement} element Canvas element to initialize on.
     */
    setCanvas(element: HTMLCanvasElement): void;
    /**
     * Get the canvas element controlled by the gfx manager.
     * If you didn't provide your own canvas before initialization, you must add this canvas to your document after initializing `Shaku`.
     * @example
     * document.body.appendChild(Shaku.gfx.canvas);
     * @returns {HTMLCanvasElement} Canvas we use for rendering.
     */
    get canvas(): HTMLCanvasElement;
    /**
     * Get the Effect base class, which is required to implement custom effects.
     * @see Effect
     */
    get Effect(): typeof import("./effects/effect.js");
    /**
     * Get the default Effect class, which is required to implement custom effects that inherit and reuse parts from the default effect.
     * @see BasicEffect
     */
    get BasicEffect(): typeof import("./effects/basic.js");
    /**
     * Get the Effect for rendering fonts with an MSDF texture.
     * @see MsdfFontEffect
     */
    get MsdfFontEffect(): typeof import("./effects/msdf_font.js");
    /**
     * Get the sprite class.
     * @see Sprite
     */
    get Sprite(): typeof Sprite;
    /**
     * Get the sprites group object.
     * @see SpritesGroup
     */
    get SpritesGroup(): typeof SpritesGroup;
    /**
     * Get the matrix object.
     * @see Matrix
     */
    get Matrix(): typeof Matrix;
    /**
     * Get the vertex object.
     * @see Vertex
     */
    get Vertex(): typeof Vertex;
    /**
     * Get the text alignments options.
     * * Left: align text to the left.
     * * Right: align text to the right.
     * * Center: align text to center.
     * @see TextAlignments
     */
    get TextAlignments(): {
        Left: string;
        Right: string;
        Center: string;
    };
    /**
     * Create and return a new camera instance.
     * @param {Boolean} withViewport If true, will create camera with viewport value equal to canvas' size.
     * @returns {Camera} New camera object.
     */
    createCamera(withViewport: boolean): Camera;
    /**
     * Set default orthographic camera from offset.
     * @param {Vector2} offset Camera top-left corner.
     * @returns {Camera} Camera instance.
     */
    setCameraOrthographic(offset: Vector2): Camera;
    /**
     * Create and return an effect instance.
     * @see Effect
     * @param {Class} type Effect class type. Must inherit from Effect base class.
     * @returns {Effect} Effect instance.
     */
    createEffect(type: Class): typeof import("./effects/effect.js");
    /**
     * Set resolution and canvas to the max size of its parent element or screen.
     * If the canvas is directly under document body, it will take the max size of the page.
     * @param {Boolean} limitToParent if true, will use parent element size. If false, will stretch on entire document.
     * @param {Boolean} allowOddNumbers if true, will permit odd numbers, which could lead to small artefacts when drawing pixel art. If false (default) will round to even numbers.
     */
    maximizeCanvasSize(limitToParent: boolean, allowOddNumbers: boolean): void;
    /**
     * Set a render target (texture) to render on.
     * @example
     * // create render target
     * let renderTarget = await Shaku.assets.createRenderTarget('_my_render_target', 800, 600);
     *
     * // use render target
     * Shaku.gfx.setRenderTarget(renderTarget);
     * // .. draw some stuff here
     *
     * // reset render target and present it on screen
     * // note the negative height - render targets end up with flipped Y axis
     * Shaku.gfx.setRenderTarget(null);
     * Shaku.gfx.draw(renderTarget, new Shaku.utils.Vector2(screenX / 2, screenY / 2), new Shaku.utils.Vector2(screenX, -screenY));
     * @param {TextureAsset|Array<TextureAsset>|null} texture Render target texture to set as render target, or null to reset and render back on canvas. Can also be array for multiple targets, which will take layouts 0-15 by their order.
     * @param {Boolean=} keepCamera If true, will keep current camera settings. If false (default) will reset camera.
     */
    setRenderTarget(texture: TextureAsset | Array<TextureAsset> | null, keepCamera?: boolean | undefined): void;
    /**
     * Set effect to use for future draw calls.
     * @example
     * let effect = Shaku.gfx.createEffect(MyEffectType);
     * Shaku.gfx.useEffect(effect);
     * @param {Effect | null} effect Effect to use or null to use the basic builtin effect.
     */
    useEffect(effect: typeof import("./effects/effect.js") | null): void;
    /**
     * Set resolution and canvas size.
     * @example
     * // set resolution and size of 800x600.
     * Shaku.gfx.setResolution(800, 600, true);
     * @param {Number} width Resolution width.
     * @param {Number} height Resolution height.
     * @param {Boolean} updateCanvasStyle If true, will also update the canvas *css* size in pixels.
     */
    setResolution(width: number, height: number, updateCanvasStyle: boolean): void;
    /**
     * Reset camera properties to default camera.
     */
    resetCamera(): void;
    /**
     * Set viewport, projection and other properties from a camera instance.
     * Changing the camera properties after calling this method will *not* update the renderer, until you call applyCamera again.
     * @param {Camera} camera Camera to apply.
     */
    applyCamera(camera: Camera): void;
    /**
     * Get current rendering region.
     * @param {Boolean} includeOffset If true (default) will include viewport offset, if exists.
     * @returns {Rectangle} Rectangle with rendering region.
     */
    getRenderingRegion(includeOffset: boolean): Rectangle;
    /**
     * Get current rendering size.
     * Unlike 'canvasSize', this takes viewport and render target into consideration.
     * @returns {Vector2} rendering size.
     */
    getRenderingSize(): Vector2;
    /**
     * Get canvas size as vector.
     * @returns {Vector2} Canvas size.
     */
    getCanvasSize(): Vector2;
    /**
     * @inheritdoc
     * @private
     */
    private setup;
    /**
     * Generate a sprites group to render a string using a font texture.
     * Take the result of this method and use with gfx.drawGroup() to render the text.
     * This is what you use when you want to draw texts with `Shaku`.
     * Note: its best to always draw texts with *batching* enabled.
     * @example
     * // load font texture
     * let fontTexture = await Shaku.assets.loadFontTexture('assets/DejaVuSansMono.ttf', {fontName: 'DejaVuSansMono'});
     *
     * // generate 'hello world!' text (note: you don't have to regenerate every frame if text didn't change)
     * let text1 = Shaku.gfx.buildText(fontTexture, "Hello World!");
     * text1.position.set(40, 40);
     *
     * // draw text
     * Shaku.gfx.drawGroup(text1, true);
     * @param {FontTextureAsset} fontTexture Font texture asset to use.
     * @param {String} text Text to generate sprites for.
     * @param {Number=} fontSize Font size, or undefined to use font texture base size.
     * @param {Color|Array<Color>=} color Text sprites color. If array is set, will assign each color to different vertex, starting from top-left.
     * @param {TextAlignment=} alignment Text alignment.
     * @param {Vector2=} offset Optional starting offset.
     * @param {Vector2=} marginFactor Optional factor for characters and line spacing. For example value of 2,1 will make double horizontal spacing.
     * @returns {SpritesGroup} Sprites group containing the needed sprites to draw the given text with its properties.
     */
    buildText(fontTexture: FontTextureAsset, text: string, fontSize?: number | undefined, color?: (Color | Array<Color>) | undefined, alignment?: TextAlignment | undefined, offset?: Vector2 | undefined, marginFactor?: Vector2 | undefined): SpritesGroup;
    /**
     * Draw a SpritesGroup object.
     * A SpritesGroup is a collection of sprites we can draw in bulks with transformations to apply on the entire group.
     * @example
     * // load texture
     * let texture = await Shaku.assets.loadTexture('assets/sprite.png');
     *
     * // create group and set entire group's position and scale
     * let group = new Shaku.gfx.SpritesGroup();
     * group.position.set(125, 300);
     * group.scale.set(2, 2);
     *
     * // create 5 sprites and add to group
     * for (let i = 0; i < 5; ++i) {
     *   let sprite = new Shaku.gfx.Sprite(texture);
     *   sprite.position.set(100 * i, 150);
     *   sprite.size.set(50, 50);
     *   group.add(sprite)
     * }
     *
     * // draw the group with automatic culling of invisible sprites
     * Shaku.gfx.drawGroup(group, true);
     * @param {SpritesGroup} group Sprites group to draw.
     * @param {Boolean} cullOutOfScreen If true and in batching mode, will cull automatically any quad that is completely out of screen.
     */
    drawGroup(group: SpritesGroup, cullOutOfScreen: boolean): void;
    /**
     * Draw a single sprite object.
     * Sprites are optional objects that store all the parameters for a `draw()` call. They are also used for batch rendering.
     * @example
     * // load texture and create sprite
     * let texture = await Shaku.assets.loadTexture('assets/sprite.png');
     * let sprite = new Shaku.gfx.Sprite(texture);
     *
     * // set position and size
     * sprite.position.set(100, 150);
     * sprite.size.set(50, 50);
     *
     * // draw sprite
     * Shaku.gfx.drawSprite(sprite);
     * @param {Sprite} sprite Sprite object to draw.
     */
    drawSprite(sprite: Sprite): void;
    /**
     * Draw a texture to cover a given destination rectangle.
     * @example
     * // cover the entire screen with an image
     * let texture = await Shaku.assets.loadTexture('assets/sprite.png');
     * Shaku.gfx.cover(texture, Shaku.gfx.getRenderingRegion());
     * @example
     * // draw with additional params
     * let sourceRect = new Shaku.utils.Rectangle(0, 0, 64, 64);
     * let color = Shaku.utils.Color.blue;
     * let blendMode = Shaku.gfx.BlendModes.Multiply;
     * let rotation = Math.PI / 4;
     * let origin = new Shaku.utils.Vector2(0.5, 0.5);
     * Shaku.gfx.draw(texture, position, size, sourceRect, color, blendMode, rotation, origin);
     * @param {TextureAsset} texture Texture to draw.
     * @param {Rectangle|Vector2} destRect Destination rectangle to draw on. If vector is provided, will draw from 0,0 with vector as size.
     * @param {Rectangle=} sourceRect Source rectangle, or undefined to use the entire texture.
     * @param {Color|Array<Color>|undefined} color Tint color, or undefined to not change color. If array is set, will assign each color to different vertex, starting from top-left.
     * @param {BlendMode=} blendMode Blend mode, or undefined to use alpha blend.
     */
    cover(texture: TextureAsset, destRect: Rectangle | Vector2, sourceRect?: Rectangle | undefined, color: Color | Array<Color> | undefined, blendMode?: BlendMode | undefined): void;
    /**
     * Draw a texture.
     * @example
     * // a simple draw with position and size
     * let texture = await Shaku.assets.loadTexture('assets/sprite.png');
     * let position = new Shaku.utils.Vector2(100, 100);
     * let size = new Shaku.utils.Vector2(75, 125); // if width == height, you can pass as a number instead of vector
     * Shaku.gfx.draw(texture, position, size);
     * @example
     * // draw with additional params
     * let sourceRect = new Shaku.utils.Rectangle(0, 0, 64, 64);
     * let color = Shaku.utils.Color.blue;
     * let blendMode = Shaku.gfx.BlendModes.Multiply;
     * let rotation = Math.PI / 4;
     * let origin = new Shaku.utils.Vector2(0.5, 0.5);
     * Shaku.gfx.draw(texture, position, size, sourceRect, color, blendMode, rotation, origin);
     * @param {TextureAsset} texture Texture to draw.
     * @param {Vector2|Vector3} position Drawing position (at origin). If vector3 is provided, will pass z value to the shader code position attribute.
     * @param {Vector2|Vector3|Number} size Drawing size. If vector3 is provided, will pass z value to the shader code position attribute for the bottom vertices, as position.z + size.z.
     * @param {Rectangle} sourceRect Source rectangle, or undefined to use the entire texture.
     * @param {Color|Array<Color>|undefined} color Tint color, or undefined to not change color. If array is set, will assign each color to different vertex, starting from top-left.
     * @param {BlendMode=} blendMode Blend mode, or undefined to use alpha blend.
     * @param {Number=} rotation Rotate sprite.
     * @param {Vector2=} origin Drawing origin. This will be the point at 'position' and rotation origin.
     * @param {Vector2=} skew Skew the drawing corners on X and Y axis, around the origin point.
     */
    draw(texture: TextureAsset, position: Vector2 | Vector3, size: Vector2 | Vector3 | number, sourceRect: Rectangle, color: Color | Array<Color> | undefined, blendMode?: BlendMode | undefined, rotation?: number | undefined, origin?: Vector2 | undefined, skew?: Vector2 | undefined): void;
    /**
     * Draw a textured quad from vertices.
     * @param {TextureAsset} texture Texture to draw.
     * @param {Array<Vertex>} vertices Quad vertices to draw (should be: top-left, top-right, bottom-left, bottom-right).
     * @param {BlendMode=} blendMode Blend mode to set.
     */
    drawQuadFromVertices(texture: TextureAsset, vertices: Array<Vertex>, blendMode?: BlendMode | undefined): void;
    /**
     * Draw a filled colored rectangle.
     * @example
     * // draw a 50x50 red rectangle at position 100x100, that will rotate over time
     * Shaku.gfx.fillRect(new Shaku.utils.Rectangle(100, 100, 50, 50), Shaku.utils.Color.red, null, Shaku.gameTime.elapsed);
     * @param {Rectangle} destRect Rectangle to fill.
     * @param {Color|Array<Color>} color Rectangle fill color.
     * @param {BlendMode=} blend Blend mode.
     * @param {Number=} rotation Rotate the rectangle around its center.
     */
    fillRect(destRect: Rectangle, color: Color | Array<Color>, blend?: BlendMode | undefined, rotation?: number | undefined): void;
    /**
     * Draw a list of filled colored rectangles as a batch.
     * @example
     * // draw a 50x50 red rectangle at position 100x100, that will rotate over time
     * Shaku.gfx.fillRects([new Shaku.utils.Rectangle(100, 100, 50, 50), new Shaku.utils.Rectangle(150, 150, 25, 25)], Shaku.utils.Color.red, null, Shaku.gameTime.elapsed);
     * @param {Array<Rectangle>} destRects Rectangles to fill.
     * @param {Array<Color>|Color} colors Rectangles fill color. If array is set, will assign each color to different vertex, starting from top-left.
     * @param {BlendMode=} blend Blend mode.
     * @param {(Array<Number>|Number)=} rotation Rotate the rectangles around its center.
     */
    fillRects(destRects: Array<Rectangle>, colors: Array<Color> | Color, blend?: BlendMode | undefined, rotation?: (Array<number> | number) | undefined): void;
    /**
     * Draw an outline colored rectangle.
     * @example
     * // draw a 50x50 red rectangle at position 100x100, that will rotate over time
     * Shaku.gfx.outlineRect(new Shaku.utils.Rectangle(100, 100, 50, 50), Shaku.utils.Color.red, null, Shaku.gameTime.elapsed);
     * @param {Rectangle} destRect Rectangle to draw outline for.
     * @param {Color} color Rectangle outline color.
     * @param {BlendMode=} blend Blend mode.
     * @param {Number=} rotation Rotate the rectangle around its center.
     */
    outlineRect(destRect: Rectangle, color: Color, blend?: BlendMode | undefined, rotation?: number | undefined): void;
    /**
     * Draw an outline colored circle.
     * @example
     * // draw a circle at 50x50 with radius of 85
     * Shaku.gfx.outlineCircle(new Shaku.utils.Circle(new Shaku.utils.Vector2(50, 50), 85), Shaku.utils.Color.red);
     * @param {Circle} circle Circle to draw.
     * @param {Color} color Circle outline color.
     * @param {BlendMode=} blend Blend mode.
     * @param {Number=} lineAmount How many lines to compose the circle from (bigger number = smoother circle).
     */
    outlineCircle(circle: Circle, color: Color, blend?: BlendMode | undefined, lineAmount?: number | undefined): void;
    /**
     * Draw a filled colored circle.
     * @example
     * // draw a filled circle at 50x50 with radius of 85
     * Shaku.gfx.fillCircle(new Shaku.utils.Circle(new Shaku.utils.Vector2(50, 50), 85), Shaku.utils.Color.red);
     * @param {Circle} circle Circle to draw.
     * @param {Color} color Circle fill color.
     * @param {BlendMode=} blend Blend mode.
     * @param {Number=} lineAmount How many lines to compose the circle from (bigger number = smoother circle).
     */
    fillCircle(circle: Circle, color: Color, blend?: BlendMode | undefined, lineAmount?: number | undefined): void;
    /**
     * Draw a list of filled colored circles using batches.
     * @example
     * // draw a filled circle at 50x50 with radius of 85
     * Shaku.gfx.fillCircles([new Shaku.utils.Circle(new Shaku.utils.Vector2(50, 50), 85), new Shaku.utils.Circle(new Shaku.utils.Vector2(150, 125), 35)], Shaku.utils.Color.red);
     * @param {Array<Circle>} circles Circles list to draw.
     * @param {Color|Array<Color>} colors Circles fill color or a single color for all circles.
     * @param {BlendMode=} blend Blend mode.
     * @param {Number=} lineAmount How many lines to compose the circle from (bigger number = smoother circle).
     */
    fillCircles(circles: Array<Circle>, colors: Color | Array<Color>, blend?: BlendMode | undefined, lineAmount?: number | undefined): void;
    /**
     * Draw a single line between two points.
     * @example
     * Shaku.gfx.drawLine(new Shaku.utils.Vector2(50,50), new Shaku.utils.Vector2(150,50), Shaku.utils.Color.red);
     * @param {Vector2} startPoint Line start point.
     * @param {Vector2} endPoint Line end point.
     * @param {Color} color Line color.
     * @param {BlendMode=} blendMode Blend mode to draw lines with (default to Opaque).
     */
    drawLine(startPoint: Vector2, endPoint: Vector2, color: Color, blendMode?: BlendMode | undefined): void;
    /**
     * Draw a strip of lines between an array of points.
     * @example
     * let lines = [new Shaku.utils.Vector2(50,50), new Shaku.utils.Vector2(150,50), new Shaku.utils.Vector2(150,150)];
     * let colors = [Shaku.utils.Color.random(), Shaku.utils.Color.random(), Shaku.utils.Color.random()];
     * Shaku.gfx.drawLinesStrip(lines, colors);
     * @param {Array<Vector2>} points Points to draw line between.
     * @param {Color|Array<Color>} colors Single lines color if you want one color for all lines, or an array of colors per segment.
     * @param {BlendMode=} blendMode Blend mode to draw lines with (default to Opaque).
     * @param {Boolean=} looped If true, will also draw a line from last point back to first point.
     */
    drawLinesStrip(points: Array<Vector2>, colors: Color | Array<Color>, blendMode?: BlendMode | undefined, looped?: boolean | undefined): void;
    /**
     * Draw a list of lines from an array of points.
     * @example
     * let lines = [new Shaku.utils.Vector2(50,50), new Shaku.utils.Vector2(150,50), new Shaku.utils.Vector2(150,150)];
     * let colors = [Shaku.utils.Color.random(), Shaku.utils.Color.random(), Shaku.utils.Color.random()];
     * Shaku.gfx.drawLines(lines, colors);
     * @param {Array<Vector2>} points Points to draw line between.
     * @param {Color|Array<Color>} colors Single lines color if you want one color for all lines, or an array of colors per segment.
     * @param {BlendMode=} blendMode Blend mode to draw lines with (default to Opaque).
     */
    drawLines(points: Array<Vector2>, colors: Color | Array<Color>, blendMode?: BlendMode | undefined): void;
    /**
     * Draw a single point from vector.
     * @example
     * Shaku.gfx.drawPoint(new Shaku.utils.Vector2(50,50), Shaku.utils.Color.random());
     * @param {Vector2} point Point to draw.
     * @param {Color} color Point color.
     * @param {BlendMode=} blendMode Blend mode to draw point with (default to Opaque).
     */
    drawPoint(point: Vector2, color: Color, blendMode?: BlendMode | undefined): void;
    /**
     * Draw a list of points from an array of vectors.
     * @example
     * let points = [new Shaku.utils.Vector2(50,50), new Shaku.utils.Vector2(150,50), new Shaku.utils.Vector2(150,150)];
     * let colors = [Shaku.utils.Color.random(), Shaku.utils.Color.random(), Shaku.utils.Color.random()];
     * Shaku.gfx.drawPoints(points, colors);
     * @param {Array<Vector2>} points Points to draw.
     * @param {Color|Array<Color>} colors Single color if you want one color for all points, or an array of colors per point.
     * @param {BlendMode=} blendMode Blend mode to draw points with (default to Opaque).
     */
    drawPoints(points: Array<Vector2>, colors: Color | Array<Color>, blendMode?: BlendMode | undefined): void;
    /**
     * Make the renderer canvas centered.
     */
    centerCanvas(): void;
    /**
     * Check if a given shape is currently in screen bounds, not taking camera into consideration.
     * @param {Circle|Vector|Rectangle|Line} shape Shape to check.
     * @returns {Boolean} True if given shape is in visible region.
     */
    inScreen(shape: Circle | Vector | Rectangle | Line): boolean;
    /**
     * Make a given vector the center of the camera.
     * @param {Vector2} position Camera position.
     * @param {Boolean} useCanvasSize If true, will always use cancas size when calculating center. If false and render target is set, will use render target's size.
     */
    centerCamera(position: Vector2, useCanvasSize: boolean): void;
    /**
     * Prepare buffers, effect and blend mode for shape rendering.
     * @private
     */
    private _fillShapesBuffer;
    /**
     * Draw sprites group as a batch.
     * @private
     * @param {SpritesGroup} group Group to draw.
     * @param {Boolean} cullOutOfScreen If true will cull quads that are out of screen.
     */
    private _drawBatch;
    /**
     * Set the currently active texture.
     * @private
     * @param {TextureAsset} texture Texture to set.
     */
    private _setActiveTexture;
    /**
     * Get the blend modes enum.
     * * AlphaBlend
     * * Opaque
     * * Additive
     * * Multiply
     * * Subtract
     * * Screen
     * * Overlay
     * * Invert
     * * DestIn
     * * DestOut
     *
     * ![Blend Modes](resources/blend-modes.png)
     * @see BlendModes
     */
    get BlendModes(): {
        AlphaBlend: string;
        Opaque: string;
        Additive: string;
        Multiply: string;
        Subtract: string;
        Screen: string;
        Overlay: string;
        Invert: string;
        Darken: string;
        DestIn: string;
        DestOut: string;
    };
    /**
     * Get the wrap modes enum.
     * * Clamp: when uv position exceed texture boundaries it will be clamped to the nearest border, ie repeat the edge pixels.
     * * Repeat: when uv position exceed texture boundaries it will wrap back to the other side.
     * * RepeatMirrored: when uv position exceed texture boundaries it will wrap back to the other side but also mirror the texture.
     *
     * ![Wrap Modes](resources/wrap-modes.png)
     * @see TextureWrapModes
     */
    get TextureWrapModes(): {
        Clamp: string;
        Repeat: string;
        RepeatMirrored: string;
    };
    /**
     * Get texture filter modes.
     * * Nearest: no filtering, no mipmaps (pixelated).
     * * Linear: simple filtering, no mipmaps (smooth).
     * * NearestMipmapNearest: no filtering, sharp switching between mipmaps,
     * * LinearMipmapNearest: filtering, sharp switching between mipmaps.
     * * NearestMipmapLinear: no filtering, smooth transition between mipmaps.
     * * LinearMipmapLinear: filtering, smooth transition between mipmaps.
     *
     * ![Filter Modes](resources/filter-modes.png)
     * @see TextureFilterModes
     */
    get TextureFilterModes(): {
        Nearest: string;
        Linear: string;
        NearestMipmapNearest: string;
        LinearMipmapNearest: string;
        NearestMipmapLinear: string;
        LinearMipmapLinear: string;
    };
    /**
     * Get number of actual WebGL draw calls we performed since the beginning of the frame.
     * @returns {Number} Number of WebGL draw calls this frame.
     */
    get drawCallsCount(): number;
    /**
     * Get number of textured / colored quads we drawn since the beginning of the frame.
     * @returns {Number} Number of quads drawn in this frame..
     */
    get quadsDrawCount(): number;
    /**
     * Clear screen to a given color.
     * @example
     * Shaku.gfx.clear(Shaku.utils.Color.cornflowerblue);
     * @param {Color=} color Color to clear screen to, or black if not set.
     */
    clear(color?: Color | undefined): void;
    /**
     * Set texture mag and min filters.
     * @private
     * @param {TextureFilterMode} filter Texture filter to set.
     */
    private _setTextureFilter;
    /**
     * Set texture wrap mode on X and Y axis.
     * @private
     * @param {TextureWrapMode} wrapX Wrap mode on X axis.
     * @param {TextureWrapMode} wrapY Wrap mode on Y axis.
     */
    private _setTextureWrapMode;
    /**
     * Set blend mode before drawing.
     * @private
     * @param {BlendMode} blendMode New blend mode to set.
     */
    private _setBlendMode;
    /**
     * Present all currently buffered data.
     */
    presentBufferedData(): void;
    /**
     * Called internally before drawing a sprite to prepare some internal stuff.
     * @private
     */
    private __startDrawingSprites;
    /**
     * Called internally to present sprites batch, if currently drawing sprites.
     * @private
     */
    private __finishDrawingSprites;
}
import IManager = require("../manager.js");
import Camera = require("./camera.js");
import Matrix = require("./matrix.js");
import TextureAsset = require("../assets/texture_asset.js");
import Rectangle = require("../utils/rectangle.js");
import SpriteBatch = require("./sprite_batch.js");
import Sprite = require("./sprite.js");
import SpritesGroup = require("./sprites_group.js");
import Vertex = require("./vertex");
import Vector2 = require("../utils/vector2.js");
import FontTextureAsset = require("../assets/font_texture_asset.js");
import Color = require("../utils/color.js");
import { TextAlignment } from "./text_alignment.js";
import { BlendMode } from "./blend_modes.js";
import Vector3 = require("../utils/vector3.js");
import Circle = require("../utils/circle.js");
//# sourceMappingURL=gfx.d.ts.map