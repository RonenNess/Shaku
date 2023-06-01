declare const _exports: Gfx;
export = _exports;
/**
 * Gfx is the graphics manager.
 * Everything related to rendering and managing your game canvas goes here.
 *
 * To access the Graphics manager you use `Shaku.gfx`.
 */
declare class Gfx extends IManager {
    /**
     * A dictionary containing all built-in effect instances.
     * @type {Dictionary}
     * @name Gfx#builtinEffects
     */
    builtinEffects: Dictionary;
    /**
     * Default texture filter to use when no texture filter is set.
     * @type {TextureFilterModes}
     * @name Gfx#defaultTextureFilter
     */
    defaultTextureFilter: {
        Nearest: string;
        Linear: string;
        NearestMipmapNearest: string;
        LinearMipmapNearest: string;
        NearestMipmapLinear: string;
        LinearMipmapLinear: string;
    };
    /**
     * Default wrap modes to use when no wrap mode is set.
     * @type {TextureWrapModes}
     * @name Gfx#TextureWrapModes
     */
    defaultTextureWrapMode: {
        Clamp: string;
        Repeat: string;
        RepeatMirrored: string;
    };
    /**
     * A 1x1 white texture.
     * @type {TextureAsset}
     * @name Gfx#whiteTexture
     */
    whiteTexture: TextureAsset;
    /**
     * Provide access to Gfx internal stuff.
     * @private
     */
    private _internal;
    /**
     * Get the init WebGL version.
     * @returns {Number} WebGL version number.
     */
    get webglVersion(): number;
    /**
     * Maximum number of vertices we allow when drawing lines.
     * @returns {Number} max vertices per lines strip.
     */
    get maxLineSegments(): number;
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
     * Get the draw batch base class.
     * @see DrawBatch
     */
    get DrawBatch(): typeof DrawBatch;
    /**
     * Get the sprites batch class.
     * @see SpriteBatch
     */
    get SpriteBatch(): typeof SpriteBatch;
    /**
     * Get the 3d sprites batch class.
     * @see SpriteBatch3D
     */
    get SpriteBatch3D(): typeof SpriteBatch3D;
    /**
     * Get the text sprites batch class.
     * @see TextSpriteBatch
     */
    get TextSpriteBatch(): typeof TextSpriteBatch;
    /**
     * Get the shapes batch class.
     * @see ShapesBatch
     */
    get ShapesBatch(): typeof ShapesBatch;
    /**
     * Get the lines batch class.
     * @see LinesBatch
     */
    get LinesBatch(): typeof LinesBatch;
    /**
     * Get the Effect base class, which is required to implement custom effects.
     * @see Effect
     */
    get Effect(): typeof import("./effects/effect.js");
    /**
     * Get the default sprites effect class.
     * @see SpritesEffect
     */
    get SpritesEffect(): typeof import("./effects/sprites.js");
    /**
     * Get the default sprites effect class that is used when vertex colors is disabled.
     * @see SpritesEffectNoVertexColor
     */
    get SpritesEffectNoVertexColor(): typeof import("./effects/sprites_no_vertex_color.js");
    /**
     * Get the default shapes effect class that is used to draw 2d shapes.
     * @see ShapesEffect
     */
    get ShapesEffect(): typeof import("./effects/shapes.js");
    /**
     * Get the default 3d sprites effect class that is used to draw 3d textured quads.
     * @see Sprites3dEffect
     */
    get Sprites3dEffect(): typeof Sprites3dEffect;
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
     * Create and return a new 3D camera instance.
     * @param {Boolean} withViewport If true, will create camera with viewport value equal to canvas' size.
     * @returns {Camera3D} New camera object.
     */
    createCamera3D(withViewport: boolean): Camera3D;
    /**
     * Set default orthographic camera from offset.
     * @param {Vector2} offset Camera top-left corner.
     * @returns {Camera} Camera instance.
     */
    setCameraOrthographic(offset: Vector2): Camera;
    /**
     * Set resolution and canvas to the max size of its parent element or screen.
     * If the canvas is directly under document body, it will take the max size of the page.
     * @param {Boolean=} limitToParent if true, will use parent element size. If false, will stretch on entire document.
     * @param {Boolean=} allowOddNumbers if true, will permit odd numbers, which could lead to small artefacts when drawing pixel art. If false (default) will round to even numbers.
     */
    maximizeCanvasSize(limitToParent?: boolean | undefined, allowOddNumbers?: boolean | undefined): void;
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
    _viewport: Rectangle;
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
     * @returns {Number} Number of quads drawn in this frame.
     */
    get quadsDrawCount(): number;
    /**
     * Get number of shape polygons we drawn since the beginning of the frame.
     * @returns {Number} Number of shape polygons drawn in this frame.
     */
    get shapePolygonsDrawCount(): number;
    /**
     * Clear screen to a given color.
     * @example
     * Shaku.gfx.clear(Shaku.utils.Color.cornflowerblue);
     * @param {Color=} color Color to clear screen to, or black if not set.
     */
    clear(color?: Color | undefined): void;
    /**
     * Clear depth buffer.
     * Only relevant when depth is used.
     * @param {Number=} value Value to clear depth buffer to.
     */
    clearDepth(value?: number | undefined): void;
    #private;
}
import IManager = require("../manager.js");
import TextureAsset = require("../assets/texture_asset.js");
import DrawBatch = require("./draw_batches/draw_batch.js");
import SpriteBatch = require("./draw_batches/sprite_batch.js");
import SpriteBatch3D = require("./draw_batches/sprite_batch_3d.js");
import TextSpriteBatch = require("./draw_batches/text_batch");
import ShapesBatch = require("./draw_batches/shapes_batch.js");
import LinesBatch = require("./draw_batches/lines_batch.js");
import Sprites3dEffect = require("./effects/sprites_3d.js");
import Sprite = require("./sprite.js");
import SpritesGroup = require("./sprites_group.js");
import Matrix = require("../utils/matrix.js");
import Vertex = require("./vertex");
import Camera = require("./camera.js");
import Camera3D = require("./camera3d.js");
import Vector2 = require("../utils/vector2.js");
import Rectangle = require("../utils/rectangle.js");
import FontTextureAsset = require("../assets/font_texture_asset.js");
import Color = require("../utils/color.js");
import { TextAlignment } from "./text_alignments.js";
import Circle = require("../utils/circle.js");
//# sourceMappingURL=gfx.d.ts.map