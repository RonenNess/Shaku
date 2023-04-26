/**
 * Implement the gfx manager.
 * 
 * |-- copyright and license --|
 * @module     Shaku
 * @file       shaku\src\gfx\gfx.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const IManager = require('../manager.js');
const Color = require('../utils/color.js');
const { BlendModes } = require('./blend_modes.js');
const Rectangle = require('../utils/rectangle.js');
const { Effect, SpritesEffect, SpritesEffectNoVertexColor, MsdfFontEffect, ShapesEffect, SpritesWithOutlineEffect } = require('./effects');
const TextureAsset = require('../assets/texture_asset.js');
const { TextureFilterModes } = require('./texture_filter_modes.js');
const { TextureWrapModes } = require('./texture_wrap_modes.js');
const Matrix = require('./matrix.js');
const Camera = require('./camera.js');
const Sprite = require('./sprite.js');
const SpritesGroup = require('./sprites_group.js');
const Vector2 = require('../utils/vector2.js');
const FontTextureAsset = require('../assets/font_texture_asset.js');
const MsdfFontTextureAsset = require('../assets/msdf_font_texture_asset.js');
const { TextAlignment, TextAlignments } = require('./text_alignments.js');
const Circle = require('../utils/circle.js');
const SpriteBatch = require('./draw_batches/sprite_batch.js');
const TextSpriteBatch = require('./draw_batches/text_batch');
const Vertex = require('./vertex');
const DrawBatch = require('./draw_batches/draw_batch.js');
const ShapesBatch = require('./draw_batches/shapes_batch.js');
const LinesBatch = require('./draw_batches/lines_batch.js');
const Sprites3dEffect = require('./effects/sprites_3d.js');
const SpriteBatch3D = require('./draw_batches/sprite_batch_3d.js');
const TextureAtlasAsset = require('../assets/texture_atlas_asset.js');
const _logger = require('../logger.js').getLogger('gfx');

let _gl = null;
let _initSettings = { antialias: true, alpha: true, depth: false, premultipliedAlpha: true, desynchronized: false };
let _canvas = null;
let _lastBlendMode = null;
let _activeEffect = null;
let _camera = null;
let _projection = null;
let _fb = null;
let _renderTarget = null;
let _drawCallsCount = 0;
let _drawQuadsCount = 0;
let _drawShapePolygonsCount = 0;
let _cachedRenderingRegion = {};
let _webglVersion = 0;


/**
 * Gfx is the graphics manager. 
 * Everything related to rendering and managing your game canvas goes here.
 * 
 * To access the Graphics manager you use `Shaku.gfx`. 
 */
class Gfx extends IManager
{
    /**
     * Create the manager.
     */
    constructor()
    {
        super();

        /**
         * A dictionary containing all built-in effect instances.
         * @type {Dictionary}
         * @name Gfx#builtinEffects
         */
        this.builtinEffects = {};
        
        /**
         * Default texture filter to use when no texture filter is set.
         * @type {TextureFilterModes}
         * @name Gfx#defaultTextureFilter
         */
        this.defaultTextureFilter = TextureFilterModes.Nearest;

        /**
         * Default wrap modes to use when no wrap mode is set.
         * @type {TextureWrapModes}
         * @name Gfx#TextureWrapModes
         */
        this.defaultTextureWrapMode = TextureWrapModes.Clamp;
        
        /**
         * A 1x1 white texture.
         * @type {TextureAsset}
         * @name Gfx#whiteTexture
         */
        this.whiteTexture = null;

        /**
         * Provide access to Gfx internal stuff.
         * @private
         */
        this._internal = new GfxInternal(this);
        
        // set self for effect and draw batch
        DrawBatch._gfx = this;
        Effect._gfx = this;
    }

    /**
     * Get the init WebGL version.
     * @returns {Number} WebGL version number.
     */
    get webglVersion()
    {
        return _webglVersion;
    }

    /**
     * Maximum number of vertices we allow when drawing lines.
     * @returns {Number} max vertices per lines strip.
     */
    get maxLineSegments()
    {
        return 512;
    }

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
    setContextAttributes(flags)
    {
        if (_gl) { throw new Error("Can't call setContextAttributes() after gfx was initialized!"); }
        for (let key in flags) {
            _initSettings[key] = flags[key];
        }
    }

    /**
     * Set the canvas element to initialize on.
     * You must call this *before* initializing Shaku. Calling this will prevent Shaku from creating its own canvas.
     * @example
     * Shaku.gfx.setCanvas(document.getElementById('my-canvas')); 
     * @param {HTMLCanvasElement} element Canvas element to initialize on.
     */
    setCanvas(element)
    {
        if (_gl) { throw new Error("Can't call setCanvas() after gfx was initialized!"); }
        _canvas = element;
    }

    /**
     * Get the canvas element controlled by the gfx manager.
     * If you didn't provide your own canvas before initialization, you must add this canvas to your document after initializing `Shaku`.
     * @example
     * document.body.appendChild(Shaku.gfx.canvas);
     * @returns {HTMLCanvasElement} Canvas we use for rendering.
     */
    get canvas()
    {
        return _canvas;
    }

    /**
     * Get the draw batch base class.
     * @see DrawBatch
     */
    get DrawBatch()
    {
        return DrawBatch;
    }

    /**
     * Get the sprites batch class.
     * @see SpriteBatch
     */
    get SpriteBatch()
    {
        return SpriteBatch;
    }

    /**
     * Get the 3d sprites batch class.
     * @see SpriteBatch3D
     */
    get SpriteBatch3D()
    {
        return SpriteBatch3D;
    }

    /**
     * Get the text sprites batch class.
     * @see TextSpriteBatch
     */
    get TextSpriteBatch()
    {
        return TextSpriteBatch;
    }

    /**
     * Get the shapes batch class.
     * @see ShapesBatch
     */
    get ShapesBatch()
    {
        return ShapesBatch;
    }

    /**
     * Get the lines batch class.
     * @see LinesBatch
     */
    get LinesBatch()
    {
        return LinesBatch;
    }

    /**
     * Get the Effect base class, which is required to implement custom effects.
     * @see Effect
     */
    get Effect()
    {
        return Effect;
    }

    /**
     * Get the default sprites effect class.
     * @see SpritesEffect
     */
    get SpritesEffect()
    {
        return SpritesEffect;
    }
    
    /**
     * Get the default sprites effect class that is used when vertex colors is disabled.
     * @see SpritesEffectNoVertexColor
     */
    get SpritesEffectNoVertexColor()
    {
        return SpritesEffectNoVertexColor;
    }

    /**
     * Get the default shapes effect class that is used to draw 2d shapes.
     * @see ShapesEffect
     */
    get ShapesEffect()
    {
        return ShapesEffect;
    }

    /**
     * Get the default 3d sprites effect class that is used to draw 3d textured quads.
     * @see Sprites3dEffect
     */
    get Sprites3dEffect()
    {
        return Sprites3dEffect
    }

    /**
     * Get the Effect for rendering fonts with an MSDF texture.
     * @see MsdfFontEffect
     */
    get MsdfFontEffect()
    {
        return MsdfFontEffect;
    }    

    /**
     * Get the sprite class.
     * @see Sprite
     */
    get Sprite()
    {
        return Sprite;
    }

    /**
     * Get the sprites group object.
     * @see SpritesGroup
     */
    get SpritesGroup()
    {
        return SpritesGroup;
    }

    /**
     * Get the matrix object.
     * @see Matrix
     */
    get Matrix()
    {
        return Matrix;
    }

    /**
     * Get the vertex object.
     * @see Vertex
     */
    get Vertex()
    {
        return Vertex;
    }

    /**
     * Get the text alignments options.
     * * Left: align text to the left.
     * * Right: align text to the right.
     * * Center: align text to center.
     * @see TextAlignments
     */
    get TextAlignments()
    {
        return TextAlignments;
    }

    /**
     * Create and return a new camera instance.
     * @param {Boolean} withViewport If true, will create camera with viewport value equal to canvas' size.
     * @returns {Camera} New camera object.
     */
    createCamera(withViewport)
    {
        let ret = new Camera(this);
        if (withViewport) {
            ret.viewport = this.getRenderingRegion();
        }
        return ret;
    }

    /**
     * Set default orthographic camera from offset.
     * @param {Vector2} offset Camera top-left corner.
     * @returns {Camera} Camera instance.
     */
    setCameraOrthographic(offset)
    {
        let camera = this.createCamera();
        camera.orthographicOffset(offset);
        this.applyCamera(camera);
        return camera;
    }

    /**
     * Set resolution and canvas to the max size of its parent element or screen.
     * If the canvas is directly under document body, it will take the max size of the page.
     * @param {Boolean=} limitToParent if true, will use parent element size. If false, will stretch on entire document.
     * @param {Boolean=} allowOddNumbers if true, will permit odd numbers, which could lead to small artefacts when drawing pixel art. If false (default) will round to even numbers.
     */
    maximizeCanvasSize(limitToParent, allowOddNumbers)
    {
        // new width and height
        let width = 0;
        let height = 0;

        // parent
        if (limitToParent) {
            let parent = _canvas.parentElement;
            width = parent.clientWidth - _canvas.offsetLeft;
            height = parent.clientHeight - _canvas.offsetTop;
        }
        // entire screen
        else {
            width = window.innerWidth;
            height = window.innerHeight;
            _canvas.style.left = '0px';
            _canvas.style.top = '0px';
        }

        // make sure even numbers
        if (!allowOddNumbers) {
            if (width % 2 !== 0) { width++; }
            if (height % 2 !== 0) { height++; }
        }

        // if changed, set resolution
        if ((_canvas.width !== width) || (_canvas.height !== height)) {
            this.setResolution(width, height, true);
        }
    }

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
    setRenderTarget(texture, keepCamera)
    {
        // reset cached rendering size
        this.#_resetCachedRenderingRegion();

        // if texture is null, remove any render target
        if (texture === null) {
            _renderTarget = null;
            _gl.bindFramebuffer(_gl.FRAMEBUFFER, null);
            if (!keepCamera) {
                this.resetCamera();
            }
            return;
        }

        // convert texture to array
        if (!Array.isArray(texture)) {
            texture = [texture];
        }

        // bind the framebuffer
        _gl.bindFramebuffer(_gl.FRAMEBUFFER, _fb);
        
        // set render targets
        var drawBuffers = [];
        for (let index = 0; index < texture.length; ++index) {
            
            // attach the texture as the first color attachment
            const attachmentPoint = _gl['COLOR_ATTACHMENT' + index];
            _gl.framebufferTexture2D(_gl.FRAMEBUFFER, attachmentPoint, _gl.TEXTURE_2D, texture[index]._glTexture, 0);

            // index 0 is the "main" render target
            if (index === 0) {
                _renderTarget = texture[index];
            }

            // to set drawBuffers in the end
            drawBuffers.push(attachmentPoint);
        }

        // set draw buffers
        _gl.drawBuffers(drawBuffers);

        // unbind frame buffer
        //_gl.bindFramebuffer(_gl.FRAMEBUFFER, null);

        // reset camera
        if (!keepCamera) {
            this.resetCamera();
        }
    }

    /**
     * Set resolution and canvas size.
     * @example
     * // set resolution and size of 800x600.
     * Shaku.gfx.setResolution(800, 600, true);
     * @param {Number} width Resolution width.
     * @param {Number} height Resolution height.
     * @param {Boolean} updateCanvasStyle If true, will also update the canvas *css* size in pixels.
     */
    setResolution(width, height, updateCanvasStyle)
    {
        _canvas.width = width;
        _canvas.height = height;

        if (width % 2 !== 0 || height % 2 !== 0) {
            _logger.warn("Resolution to set is not even numbers; This might cause minor artefacts when using texture atlases. Consider using even numbers instead.");
        }
        
        if (updateCanvasStyle) {
            _canvas.style.width = width + 'px';
            _canvas.style.height = height + 'px';
        }

        _gl.viewport(0, 0, width, height);
        this.resetCamera();
    }

    /**
     * Reset camera properties to default camera.
     */
    resetCamera()
    {
        _camera = this.createCamera();
        let size = this.getRenderingSize();
        _camera.orthographic(new Rectangle(0, 0, size.x, size.y));
        this.applyCamera(_camera);
    }

    /**
     * Set viewport, projection and other properties from a camera instance.
     * Changing the camera properties after calling this method will *not* update the renderer, until you call applyCamera again.
     * @param {Camera} camera Camera to apply.
     */
    applyCamera(camera)
    {
        // set viewport and projection
        this._viewport = camera.viewport;
        let viewport = this.#_getRenderingRegionInternal(true);
        _gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
        _projection = camera.projection.clone();

        // update effect
        if (_activeEffect) { 
            _activeEffect.setProjectionMatrix(_projection); 
        }

        // reset cached rendering region
        this.#_resetCachedRenderingRegion();
    }

    /**
     * Get current rendering region.
     * @private
     * @param {Boolean} includeOffset If true (default) will include viewport offset, if exists.
     * @returns {Rectangle} Rectangle with rendering region.
     */
    #_getRenderingRegionInternal(includeOffset)
    {
        return this._internal.getRenderingRegionInternal(includeOffset)
    }

    /**
     * Reset cached rendering region values.
     * @private
     */
    #_resetCachedRenderingRegion()
    {
        _cachedRenderingRegion.withoutOffset = _cachedRenderingRegion.withOffset = null;
    }

    /**
     * Get current rendering region.
     * @param {Boolean} includeOffset If true (default) will include viewport offset, if exists.
     * @returns {Rectangle} Rectangle with rendering region.
     */
    getRenderingRegion(includeOffset)
    {
        return this.#_getRenderingRegionInternal(includeOffset).clone();
    }

    /**
     * Get current rendering size.
     * Unlike 'canvasSize', this takes viewport and render target into consideration.
     * @returns {Vector2} rendering size.
     */
    getRenderingSize()
    {
        let region = this.#_getRenderingRegionInternal();
        return region.getSize();
    }
    
    /**
     * Get canvas size as vector.
     * @returns {Vector2} Canvas size.
     */
    getCanvasSize()
    {
        return new Vector2(_canvas.width, _canvas.height);
    }

    /** 
     * @inheritdoc
     * @private
     */
    setup()
    {        
        return new Promise(async (resolve, reject) => {  

            _logger.info("Setup gfx manager..");

            // if no canvas is set, create one
            if (!_canvas) {
                _canvas = document.createElement('canvas');
            }

            // get webgl context
            _gl = _canvas.getContext('webgl2', _initSettings); 
            _webglVersion = 2;
            
            // no webgl2? try webgl1
            if (!_gl) {
                _logger.warn("Failed to init WebGL2, attempt fallback to WebGL1.");
                _gl = _canvas.getContext('webgl', _initSettings);
                _webglVersion = 1;
            }

            // no webgl at all??
            if (!_gl) {
                _webglVersion = 0;
                _logger.error("Can't get WebGL context!");
                return reject("Failed to get WebGL context from canvas!");
            }

            // create default effects
            this.builtinEffects.Sprites = new SpritesEffect();
            this.builtinEffects.SpritesWithOutline = new SpritesWithOutlineEffect();
            this.builtinEffects.SpritesNoVertexColor = new SpritesEffectNoVertexColor();
            this.builtinEffects.MsdfFont = new MsdfFontEffect();
            this.builtinEffects.Shapes = new ShapesEffect();
            this.builtinEffects.Sprites3d = new Sprites3dEffect();

            // setup textures assets gl context
            TextureAsset._setWebGl(_gl);
            TextureAtlasAsset._setWebGl(_gl);

            // create framebuffer (used for render targets)
            _fb = _gl.createFramebuffer();

            // create a useful single white pixel texture
            let whitePixelImage = new Image();
            whitePixelImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';
            await new Promise((resolve, reject) => { whitePixelImage.onload = resolve; });
            this.whiteTexture = new TextureAsset('__runtime_white_pixel__');
            this.whiteTexture.fromImage(whitePixelImage);

            // create default camera
            _camera = this.createCamera();
            this.applyCamera(_camera);

            // success!
            resolve();
        });
    }

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
    buildText(fontTexture, text, fontSize, color, alignment, offset, marginFactor)
    {
        // make sure text is a string
        if (typeof text !== 'string') {
            text = '' + text;
        }

        // sanity
        if (!fontTexture || !fontTexture.valid) {
            throw new Error("Font texture is invalid!");
        }

        // default alignment
        alignment = alignment || TextAlignments.Left;

        // default color
        color = color || Color.black;

        // default font size
        fontSize = fontSize || fontTexture.fontSize;

        // default margin factor
        marginFactor = marginFactor || Vector2.one();

        // get character scale factor
        let scale = fontSize / fontTexture.fontSize;

        // current character offset
        let position = new Vector2(0, 0);

        // current line characters and width
        let currentLineSprites = [];
        let lineWidth = 0;

        // go line down
        function breakLine()
        {
            // add offset to update based on alignment
            let offsetX = 0;
            switch (alignment) {

                case TextAlignments.Right:
                    offsetX = -lineWidth;
                    break;

                case TextAlignments.Center:
                    offsetX = -lineWidth / 2;
                    break;

            }

            // if we need to shift characters for alignment, do it
            if (offsetX != 0) {
                for (let i = 0; i < currentLineSprites.length; ++i) {
                    currentLineSprites[i].position.x += offsetX;
                }
            }

            // update offset
            position.x = 0;
            position.y += fontTexture.lineHeight * scale * marginFactor.y;

            // reset line width and sprites
            currentLineSprites = [];
            lineWidth = 0;
        }

        // create group to return and build sprites
        let ret = new SpritesGroup();
        for (let i = 0; i < text.length; ++i) 
        {
            // get character and source rect
            let character = text[i];
            let sourceRect = fontTexture.getSourceRect(character);

            // special case - break line
            if (character === '\n') {
                breakLine();
                continue;
            }

            // calculate character size
            let size = new Vector2(sourceRect.width * scale, sourceRect.height * scale);

            // create sprite (unless its space)
            if (character !== ' ') {

                // create sprite and add to group
                let sprite = new Sprite(fontTexture);
                sprite.sourceRectangle = sourceRect;
                sprite.size = size;
                let positionOffset = fontTexture.getPositionOffset(character);
                if (fontTexture instanceof MsdfFontTextureAsset) {
                    sprite.position.copy(position).addSelf(positionOffset.mul(scale * 0.5));
                }
                else {
                    sprite.position.copy(position).addSelf(positionOffset.mul(scale));
                }
                sprite.origin.set(0.5, 0.5);
                if (color instanceof Color) {
                    sprite.color.copy(color);
                }
                else {
                    sprite.color = [];
                    for (let col of color) {
                        sprite.color.push(col.clone());
                    }
                }
                sprite.origin.x = 0;
                ret.add(sprite);

                // add to current line sprites
                currentLineSprites.push(sprite);
            }

            let moveCursorAmount = fontTexture.getXAdvance(character) * scale * marginFactor.x;

            // update current line width
            lineWidth += moveCursorAmount;

            // set position for next character
            position.x += moveCursorAmount;
        }

        // call break line on last line, to adjust alignment for last line
        breakLine();

        // set position
        if (offset) {
            ret.position.set(offset.x, offset.y);
        }

        // return group
        return ret;
    }

    /**
     * Make the renderer canvas centered.
     */
    centerCanvas()
    {
        let canvas = _canvas;
        let parent = canvas.parentElement;
        let pwidth = Math.min(parent.clientWidth, window.innerWidth);
        let pheight = Math.min(parent.clientHeight, window.innerHeight);
        canvas.style.left = Math.round(pwidth / 2 - canvas.clientWidth / 2) + 'px';
        canvas.style.top = Math.round(pheight / 2 - canvas.clientHeight / 2) + 'px';
        canvas.style.display = 'block';
        canvas.style.position = 'relative';
    }
        
    /**
     * Check if a given shape is currently in screen bounds, not taking camera into consideration.
     * @param {Circle|Vector|Rectangle|Line} shape Shape to check.
     * @returns {Boolean} True if given shape is in visible region.
     */
    inScreen(shape)
    {
        let region = this.#_getRenderingRegionInternal();

        if (shape instanceof Circle) {
            return region.collideCircle(shape);
        }
        else if (shape instanceof Vector2) {
            return region.containsVector(shape);
        }
        else if (shape instanceof Rectangle) {
            return region.collideRect(shape);
        }
        else if (shape instanceof Line) {
            return region.collideLine(shape);
        }
        else {
            throw new Error("Unknown shape type to check!");
        }
    }

    /**
     * Make a given vector the center of the camera.
     * @param {Vector2} position Camera position.
     * @param {Boolean} useCanvasSize If true, will always use cancas size when calculating center. If false and render target is set, will use render target's size.
     */
    centerCamera(position, useCanvasSize)
    {
        let renderSize = useCanvasSize ? this.getCanvasSize() : this.getRenderingSize();
        let halfScreenSize = renderSize.mul(0.5);
        let centeredPos = position.sub(halfScreenSize);
        this.setCameraOrthographic(centeredPos);
    }
     

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
    get BlendModes()
    {
        return BlendModes;
    }
 
    /**
     * Get the wrap modes enum.
     * * Clamp: when uv position exceed texture boundaries it will be clamped to the nearest border, ie repeat the edge pixels.
     * * Repeat: when uv position exceed texture boundaries it will wrap back to the other side.
     * * RepeatMirrored: when uv position exceed texture boundaries it will wrap back to the other side but also mirror the texture.
     * 
     * ![Wrap Modes](resources/wrap-modes.png)
     * @see TextureWrapModes
     */
    get TextureWrapModes()
    {
        return TextureWrapModes;
    }

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
    get TextureFilterModes()
    {
        return TextureFilterModes;
    }

    /**
     * Get number of actual WebGL draw calls we performed since the beginning of the frame.
     * @returns {Number} Number of WebGL draw calls this frame.
     */
    get drawCallsCount()
    {
        return _drawCallsCount;
    }

    /**
     * Get number of textured / colored quads we drawn since the beginning of the frame.
     * @returns {Number} Number of quads drawn in this frame.
     */
    get quadsDrawCount()
    {
        return _drawQuadsCount;
    }

    /**
     * Get number of shape polygons we drawn since the beginning of the frame.
     * @returns {Number} Number of shape polygons drawn in this frame.
     */
    get shapePolygonsDrawCount()
    {
        return _drawShapePolygonsCount;
    }

    /**
     * Clear screen to a given color.
     * @example
     * Shaku.gfx.clear(Shaku.utils.Color.cornflowerblue);
     * @param {Color=} color Color to clear screen to, or black if not set.
     */
    clear(color)
    {
        color = color || Color.black;
        _gl.clearColor(color.r, color.g, color.b, color.a);
        _gl.clear(_gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT);
    }

    /**
     * Clear depth buffer.
     * Only relevant when depth is used.
     * @param {Number=} value Value to clear depth buffer to.
     */
    clearDepth(value)
    {
        _gl.clearDepth((value !== undefined) ? value : 1.0);
    }
    
    /** 
     * @inheritdoc
     * @private
     */
    startFrame()
    {
        // reset some states
        _lastBlendMode = null;
        _drawCallsCount = 0;
        _drawQuadsCount = 0;
        _drawShapePolygonsCount = 0;
        
        // reset cached rendering region
        this.#_resetCachedRenderingRegion();
    }

    /** 
     * @inheritdoc
     * @private
     */
    endFrame()
    {
    }

    /** 
     * @inheritdoc
     * @private
     */
    destroy()
    {
        _logger.warn("Cleaning up WebGL is not supported yet!");
    }
}

/**
 * Internal Gfx stuff that should not be used or exposed externally.
 * @private
 */
class GfxInternal
{
    constructor(gfx)
    {
        this._gfx = gfx;
    }

    get gl()
    {
        return _gl;
    }

    get drawQuadsCount()
    {
        return _drawQuadsCount;
    }

    set drawQuadsCount(value)
    {
        _drawQuadsCount = value;
    }

    get drawCallsCount()
    {
        return _drawCallsCount;
    }

    set drawCallsCount(value)
    {
        _drawCallsCount = value;
    }

    get drawShapePolygonsCount()
    {
        return _drawShapePolygonsCount;
    }

    set drawShapePolygonsCount(value)
    {
        _drawShapePolygonsCount = value;
    }

    useEffect(effect, overrideFlags)
    {
        // if null, use default
        if (effect === null) {
            effect = this._gfx.builtinEffects.Sprites;
        }

        // same effect? skip
        if (_activeEffect === effect) {
            return;
        }

        // set effect
        effect.setAsActive(overrideFlags);
        _activeEffect = effect;

        // set projection matrix
        if (_projection) { 
            _activeEffect.setProjectionMatrix(_projection); 
        }
    }

    getRenderingRegionInternal(includeOffset)
    {
        // cached with offset
        if (includeOffset && _cachedRenderingRegion.withOffset) {
            return _cachedRenderingRegion.withOffset;
        }

        // cached without offset
        if (!includeOffset && _cachedRenderingRegion.withoutOffset) {
            return _cachedRenderingRegion.withoutOffset;
        }

        // if we got viewport..
        if (this._gfx._viewport) {

            // get region from viewport
            let ret = this._gfx._viewport.clone();

            // if without offset, remove it
            if (includeOffset === false) {
                ret.x = ret.y = 0;
                _cachedRenderingRegion.withoutOffset = ret;
                return ret;
            }
            // else, include offset
            else {
                _cachedRenderingRegion.withOffset = ret;
                return ret;
            }
        }

        // if we don't have viewport..
        let ret = new Rectangle(0, 0, (_renderTarget || _canvas).width, (_renderTarget || _canvas).height);
        _cachedRenderingRegion.withoutOffset = _cachedRenderingRegion.withOffset = ret;
        return ret;
    }

    setTextureFilter(filter)
    {
        if (!TextureFilterModes._values.has(filter)) { throw new Error("Invalid texture filter mode! Please pick a value from 'TextureFilterModes'."); }
        let glMode = _gl[filter];
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, glMode);
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MAG_FILTER, glMode);
    }

    setTextureWrapMode(wrapX, wrapY)
    {
        if (wrapY === undefined) { wrapY = wrapX; }
        if (!TextureWrapModes._values.has(wrapX)) { throw new Error("Invalid texture wrap mode! Please pick a value from 'TextureWrapModes'."); }
        if (!TextureWrapModes._values.has(wrapY)) { throw new Error("Invalid texture wrap mode! Please pick a value from 'TextureWrapModes'."); }
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_S, _gl[wrapX]);
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_T, _gl[wrapY]);
    }

    setActiveTexture(texture)
    {
        if (_activeEffect.setTexture(texture)) {
            this.setTextureFilter(texture.filter || this._gfx.defaultTextureFilter);
            this.setTextureWrapMode(texture.wrapMode || this._gfx.defaultTextureWrapMode);
        }
    }
    
    setBlendMode(blendMode)
    {
        if (_lastBlendMode !== blendMode) {

            // get gl context and set defaults
            var gl = _gl;
            switch (blendMode) 
            {
                case BlendModes.AlphaBlend:
                    gl.enable(gl.BLEND);
                    gl.blendEquation(gl.FUNC_ADD);
                    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                    break;

                case BlendModes.Opaque:
                    gl.disable(gl.BLEND);
                    break;

                case BlendModes.Additive:
                    gl.enable(gl.BLEND);
                    gl.blendEquation(gl.FUNC_ADD);
                    gl.blendFunc(gl.ONE, gl.ONE);
                    break;
                    
                case BlendModes.Multiply:
                    gl.enable(gl.BLEND);
                    gl.blendEquation(gl.FUNC_ADD);
                    gl.blendFuncSeparate(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                    break;

                case BlendModes.Screen:
                    gl.enable(gl.BLEND);
                    gl.blendEquation(gl.FUNC_ADD);
                    gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_COLOR, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                    break;

                case BlendModes.Subtract:
                    gl.enable(gl.BLEND);
                    gl.blendEquation(gl.FUNC_ADD);
                    gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ONE, gl.ONE);
                    gl.blendEquationSeparate(gl.FUNC_REVERSE_SUBTRACT, gl.FUNC_ADD);
                    break;

                case BlendModes.Invert:
                    gl.enable(gl.BLEND);
                    gl.blendEquation(gl.FUNC_ADD);
                    gl.blendFunc(gl.ONE_MINUS_DST_COLOR, gl.ZERO);
                    gl.blendFuncSeparate(gl.ONE_MINUS_DST_COLOR, gl.ZERO, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                    break;

                case BlendModes.Overlay:
                    gl.enable(gl.BLEND);
                    if (gl.MAX) {
                        gl.blendEquation(gl.MAX);
                        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                    } else {
                        gl.blendEquation(gl.FUNC_ADD);
                        gl.blendFunc(gl.ONE, gl.ONE);
                    }
                    break;

                case BlendModes.Darken:
                    gl.enable(gl.BLEND);
                    gl.blendEquation(gl.MIN);
                    gl.blendFuncSeparate(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                    break;

                case BlendModes.DestIn:
                    gl.enable(gl.BLEND);
                    gl.blendEquation(gl.FUNC_ADD);
                    gl.blendFunc(gl.ZERO, gl.SRC_ALPHA);
                    break;

                case BlendModes.DestOut:
                    gl.enable(gl.BLEND);
                    gl.blendEquation(gl.FUNC_ADD);
                    gl.blendFunc(gl.ZERO, gl.ONE_MINUS_SRC_ALPHA);
                    // can also use: gl.blendFunc(gl.ONE_MINUS_DST_COLOR, gl.ONE_MINUS_SRC_COLOR);
                    break;

                default:
                    throw new Error(`Unknown blend mode '${blendMode}'!`);
            }

            // store last blend mode
            _lastBlendMode = blendMode;
        }
    }
}

// export main object
module.exports = new Gfx();