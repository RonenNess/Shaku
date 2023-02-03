/**
 * Implement the gfx manager.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\gfx.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const IManager = require('../manager.js');
const Color = require('../utils/color.js');
const { BlendMode, BlendModes } = require('./blend_modes.js');
const Rectangle = require('../utils/rectangle.js');
const { Effect, BasicEffect, MsdfFontEffect } = require('./effects');
const TextureAsset = require('../assets/texture_asset.js');
const { TextureFilterMode, TextureFilterModes } = require('./texture_filter_modes.js');
const { TextureWrapMode, TextureWrapModes } = require('./texture_wrap_modes.js');
const MeshGenerator = require('./mesh_generator.js');
const Matrix = require('./matrix.js');
const Camera = require('./camera.js');
const Sprite = require('./sprite.js');
const SpritesGroup = require('./sprites_group.js');
const Vector2 = require('../utils/vector2.js');
const FontTextureAsset = require('../assets/font_texture_asset.js');
const MsdfFontTextureAsset = require('../assets/msdf_font_texture_asset.js');
const { TextAlignment, TextAlignments } = require('./text_alignments.js');
const Mesh = require('./mesh.js');
const Circle = require('../utils/circle.js');
const SpriteBatch = require('./sprite_batch.js');
const Vector3 = require('../utils/vector3.js');
const Vertex = require('./vertex');
const _whiteColor = Color.white;
const _logger = require('../logger.js').getLogger('gfx');


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
        this._gl = null;
        this._initSettings = { antialias: true, alpha: true, depth: false, premultipliedAlpha: true, desynchronized: false };
        this._canvas = null;
        this._lastBlendMode = null;
        this._activeEffect = null;
        this._camera = null;
        this._projection = null;
        this._currIndices = null;
        this._dynamicBuffers = null;
        this._fb = null;
        this.builtinEffects = {};
        this.meshes = {};
        this.defaultTextureFilter = TextureFilterModes.Nearest;
        this.defaultTextureWrapMode = TextureWrapModes.Clamp;
        this.whiteTexture = null;
        this._renderTarget = null;
        this._viewport = null;
        this._drawCallsCount = 0;
        this._drawQuadsCount = 0;
        this.spritesBatch = null;
        this._cachedRenderingRegion = {};
        this._webglVersion = 0;
    }

    /**
     * Get the init WebGL version.
     * @returns {Number} WebGL version number.
     */
    get webglVersion()
    {
        return this._webglVersion;
    }

    /**
     * Get how many sprites we can draw in a single batch.
     * @returns {Number} batch max sprites count.
     */
    get batchSpritesCount()
    {
        return 2048;
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
        if (this._gl) { throw new Error("Can't call setContextAttributes() after gfx was initialized!"); }
        for (let key in flags) {
            this._initSettings[key] = flags[key];
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
        if (this._gl) { throw new Error("Can't call setCanvas() after gfx was initialized!"); }
        this._canvas = element;
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
        return this._canvas;
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
     * Get the default Effect class, which is required to implement custom effects that inherit and reuse parts from the default effect.
     * @see BasicEffect
     */
    get BasicEffect()
    {
        return BasicEffect;
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
     * Get the text alignments options.
     * This getter is deprecated, please use `TextAlignments` instead.
     * * Left: align text to the left.
     * * Right: align text to the right.
     * * Center: align text to center.
     * @deprecated
     * @see TextAlignments
     */
    get TextAlignment()
    {
        if (!this._TextAlignment_dep) {
            console.warn(`'gfx.TextAlignment' is deprecated and will be removed in future versions. Please use 'gfx.TextAlignments' instead.`);
            this._TextAlignment_dep = true;
        }
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
     * Create and return an effect instance.
     * @see Effect
     * @param {Class} type Effect class type. Must inherit from Effect base class.
     * @returns {Effect} Effect instance.
     */
    createEffect(type)
    {
        if (!(type.prototype instanceof Effect)) { throw new Error("'type' must be a class type that inherits from 'Effect'."); }
        let effect = new type();
        effect._build(this._gl);
        return effect;
    }

    /**
     * Set resolution and canvas to the max size of its parent element or screen.
     * If the canvas is directly under document body, it will take the max size of the page.
     * @param {Boolean} limitToParent if true, will use parent element size. If false, will stretch on entire document.
     * @param {Boolean} allowOddNumbers if true, will permit odd numbers, which could lead to small artefacts when drawing pixel art. If false (default) will round to even numbers.
     */
    maximizeCanvasSize(limitToParent, allowOddNumbers)
    {
        // new width and height
        let width = 0;
        let height = 0;

        // parent
        if (limitToParent) {
            let parent = this._canvas.parentElement;
            width = parent.clientWidth - this._canvas.offsetLeft;
            height = parent.clientHeight - this._canvas.offsetTop;
        }
        // entire screen
        else {
            width = window.innerWidth;
            height = window.innerHeight;
            this._canvas.style.left = '0px';
            this._canvas.style.top = '0px';
        }

        // make sure even numbers
        if (!allowOddNumbers) {
            if (width % 2 !== 0) { width++; }
            if (height % 2 !== 0) { height++; }
        }

        // if changed, set resolution
        if ((this._canvas.width !== width) || (this._canvas.height !== height)) {
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
        // present buffered data
        this.presentBufferedData();

        // reset cached rendering size
        this.__resetCachedRenderingRegion();

        // if texture is null, remove any render target
        if (texture === null) {
            this._renderTarget = null;
            //this._gl.drawBuffers([this._gl.BACK]);
            this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
            this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, false);
            if (!keepCamera) {
                this.resetCamera();
            }
            return;
        }

        // convert texture to array
        if (!(texture instanceof Array)) {
            texture = [texture];
        }

        // bind the framebuffer
        this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._fb);
        this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, false);
        
        // set render targets
        var drawBuffers = [];
        for (let index = 0; index < texture.length; ++index) {
            
            // attach the texture as the first color attachment
            const attachmentPoint = this._gl['COLOR_ATTACHMENT' + index];
            this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, attachmentPoint, this._gl.TEXTURE_2D, texture[index].texture, 0);

            // index 0 is the "main" render target
            if (index === 0) {
                this._renderTarget = texture[index];
            }

            // to set drawBuffers in the end
            drawBuffers.push(attachmentPoint);
        }

        // set draw buffers
        this._gl.drawBuffers(drawBuffers);

        // unbind frame buffer
        //this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);

        // reset camera
        if (!keepCamera) {
            this.resetCamera();
        }
    }

    /**
     * Set effect to use for future draw calls.
     * @example
     * let effect = Shaku.gfx.createEffect(MyEffectType);
     * Shaku.gfx.useEffect(effect);
     * @param {Effect | null} effect Effect to use or null to use the basic builtin effect.
     */
    useEffect(effect)
    {
        // present buffered data
        this.presentBufferedData();

        // if null, use default
        if (effect === null) {
            this.useEffect(this.builtinEffects.Basic);
            return;
        }

        // same effect? skip
        if (this._activeEffect === effect) {
            return;
        }

        // set effect
        effect.setAsActive();
        this._activeEffect = effect;
        if (this._projection) { this._activeEffect.setProjectionMatrix(this._projection); }
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
        this.presentBufferedData();

        this._canvas.width = width;
        this._canvas.height = height;

        if (width % 2 !== 0 || height % 2 !== 0) {
            _logger.warn("Resolution to set is not even numbers; This might cause minor artefacts when using texture atlases. Consider using even numbers instead.");
        }
        
        if (updateCanvasStyle) {
            this._canvas.style.width = width + 'px';
            this._canvas.style.height = height + 'px';
        }

        this._gl.viewport(0, 0, width, height);
        this.resetCamera();
    }

    /**
     * Reset camera properties to default camera.
     */
    resetCamera()
    {
        this._camera = this.createCamera();
        let size = this.getRenderingSize();
        this._camera.orthographic(new Rectangle(0, 0, size.x, size.y));
        this.applyCamera(this._camera);
    }

    /**
     * Set viewport, projection and other properties from a camera instance.
     * Changing the camera properties after calling this method will *not* update the renderer, until you call applyCamera again.
     * @param {Camera} camera Camera to apply.
     */
    applyCamera(camera)
    {
        // render what we got in back buffer
        this.presentBufferedData();

        // set viewport and projection
        this._viewport = camera.viewport;
        let viewport = this.__getRenderingRegionInternal(true);
        this._gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
        this._projection = camera.projection.clone();

        // update effect
        if (this._activeEffect) { 
            this._activeEffect.setProjectionMatrix(this._projection); 
        }

        // reset cached rendering region
        this.__resetCachedRenderingRegion();
    }

    /**
     * Get current rendering region.
     * @private
     * @param {Boolean} includeOffset If true (default) will include viewport offset, if exists.
     * @returns {Rectangle} Rectangle with rendering region.
     */
    __getRenderingRegionInternal(includeOffset)
    {
        // cached with offset
        if (includeOffset && this._cachedRenderingRegion.withOffset) {
            return this._cachedRenderingRegion.withOffset;
        }

        // cached without offset
        if (!includeOffset && this._cachedRenderingRegion.withoutOffset) {
            return this._cachedRenderingRegion.withoutOffset;
        }

        // if we got viewport..
        if (this._viewport) {

            // get region from viewport
            let ret = this._viewport.clone();

            // if without offset, remove it
            if (includeOffset === false) {
                ret.x = ret.y = 0;
                this._cachedRenderingRegion.withoutOffset = ret;
                return ret;
            }
            // else, include offset
            else {
                this._cachedRenderingRegion.withOffset = ret;
                return ret;
            }
        }

        // if we don't have viewport..
        let ret = new Rectangle(0, 0, (this._renderTarget || this._canvas).width, (this._renderTarget || this._canvas).height);
        this._cachedRenderingRegion.withoutOffset = this._cachedRenderingRegion.withOffset = ret;
        return ret;
    }

    /**
     * Reset cached rendering region values.
     * @private
     */
    __resetCachedRenderingRegion()
    {
        this._cachedRenderingRegion.withoutOffset = this._cachedRenderingRegion.withOffset = null;
    }

    /**
     * Get current rendering region.
     * @param {Boolean} includeOffset If true (default) will include viewport offset, if exists.
     * @returns {Rectangle} Rectangle with rendering region.
     */
    getRenderingRegion(includeOffset)
    {
        return this.__getRenderingRegionInternal(includeOffset).clone();
    }

    /**
     * Get current rendering size.
     * Unlike 'canvasSize', this takes viewport and render target into consideration.
     * @returns {Vector2} rendering size.
     */
    getRenderingSize()
    {
        let region = this.__getRenderingRegionInternal();
        return region.getSize();
    }
    
    /**
     * Get canvas size as vector.
     * @returns {Vector2} Canvas size.
     */
    getCanvasSize()
    {
        return new Vector2(this._canvas.width, this._canvas.height);
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
            if (!this._canvas) {
                this._canvas = document.createElement('canvas');
            }

            // get webgl context
            this._gl = this._canvas.getContext('webgl2', this._initSettings); 
            this._webglVersion = 2;
            
            // no webgl2? try webgl1
            if (!this._gl) {
                _logger.warn("Failed to init WebGL2, attempt fallback to WebGL1.");
                this._gl = this._canvas.getContext('webgl', this._initSettings);
                this._webglVersion = 1;
            }

            // no webgl at all??
            if (!this._gl) {
                this._webglVersion = 0;
                _logger.error("Can't get WebGL context!");
                return reject("Failed to get WebGL context from canvas!");
            }

            // create default effects
            this.builtinEffects.Basic = this.createEffect(BasicEffect);
            this.builtinEffects.MsdfFont = this.createEffect(MsdfFontEffect);

            // setup textures assets gl context
            TextureAsset._setWebGl(this._gl);

            // create framebuffer (used for render targets)
            this._fb = this._gl.createFramebuffer();

            // create base meshes
            let _meshGenerator = new MeshGenerator(this._gl);
            this.meshes = {
                quad: _meshGenerator.quad()
            }
            Object.freeze(this.meshes);

            // create a useful single white pixel texture
            let whitePixelImage = new Image();
            whitePixelImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';
            await new Promise((resolve, reject) => { whitePixelImage.onload = resolve; });
            this.whiteTexture = new TextureAsset('__runtime_white_pixel__');
            this.whiteTexture.fromImage(whitePixelImage);

            // dynamic buffers, used for batch rendering
            this._dynamicBuffers = {
                
                positionBuffer: this._gl.createBuffer(),
                positionArray: new Float32Array(3 * 4 * this.batchSpritesCount),

                textureCoordBuffer: this._gl.createBuffer(),
                textureArray: new Float32Array(2 * 4 * this.batchSpritesCount),

                colorsBuffer: this._gl.createBuffer(),
                colorsArray: new Float32Array(4 * 4 * this.batchSpritesCount),

                indexBuffer: this._gl.createBuffer(),

                linesIndexBuffer: this._gl.createBuffer(),
            }

            // create the indices buffer for batching
            let indices = new Uint16Array(this.batchSpritesCount * 6); // 6 = number of indices per sprite
            let inc = 0;
            for(let i = 0; i < indices.length; i += 6) {
                
                indices[i] = inc;
                indices[i+1] = inc + 1;
                indices[i+2] = inc + 2;

                indices[i+3] = inc + 1;
                indices[i+4] = inc + 3;
                indices[i+5] = inc + 2;

                inc += 4;
            }
            this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._dynamicBuffers.indexBuffer);
            this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, indices, this._gl.STATIC_DRAW);

            // create the indices buffer for drawing lines
            let lineIndices = new Uint16Array(this.maxLineSegments);
            for (let i = 0; i < lineIndices.length; i += 6) {          
                lineIndices[i] = i;
            }
            this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._dynamicBuffers.linesIndexBuffer);
            this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, lineIndices, this._gl.STATIC_DRAW);
            
            // create sprites batch
            this.spritesBatch = new SpriteBatch(this);

            // use default effect
            this.useEffect(null);

            // create default camera
            this._camera = this.createCamera();
            this.applyCamera(this._camera);

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
        marginFactor = marginFactor || Vector2.one;

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
                let sprite = new Sprite(fontTexture.texture, sourceRect);
                sprite.size = size;
                if (fontTexture instanceof MsdfFontTextureAsset) {
                    sprite.origin.set(0, 0);
                }
                else {
                    sprite.origin.set(0.5, 0.5);
                }
                sprite.position.copy(position).addSelf(fontTexture.getPositionOffset(character).mul(scale));
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
    drawGroup(group, cullOutOfScreen)
    {
        this._drawBatch(group, Boolean(cullOutOfScreen));
    }

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
    drawSprite(sprite)
    {
        if (!sprite.texture || !sprite.texture.valid) { return; }
        this.__startDrawingSprites(this._activeEffect, null);
        this.spritesBatch.draw(sprite);
    }

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
    cover(texture, destRect, sourceRect, color, blendMode)
    {
        if ((destRect instanceof Vector2) || (destRect instanceof Vector3)) {
            destRect = new Rectangle(0, 0, destRect.x, destRect.y);
        }
        return this.draw(texture, destRect.getCenter(), destRect.getSize(), sourceRect, color, blendMode);
    }

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
    draw(texture, position, size, sourceRect, color, blendMode, rotation, origin, skew)
    {
        let sprite = new Sprite(texture, sourceRect);
        sprite.position = position;
        sprite.size = (typeof size === 'number') ? new Vector2(size, size) : size;
        if (color) { sprite.color = color; }
        if (blendMode) { sprite.blendMode = blendMode; }
        if (rotation !== undefined) { sprite.rotation = rotation; }
        if (origin) { sprite.origin = origin; }
        if (skew) { sprite.skew = skew; }
        this.drawSprite(sprite);
    }

    /**
     * Draw a textured quad from vertices.
     * @param {TextureAsset} texture Texture to draw.
     * @param {Array<Vertex>} vertices Quad vertices to draw (should be: top-left, top-right, bottom-left, bottom-right).
     * @param {BlendMode=} blendMode Blend mode to set.
     */
    drawQuadFromVertices(texture, vertices, blendMode)
    {
        if (!texture || !texture.valid) { return; }
        this.__startDrawingSprites(this._activeEffect, null);
        this._setBlendMode(blendMode || BlendModes.AlphaBlend);
        this.spritesBatch.setTexture(texture);
        this.spritesBatch.pushVertices(vertices);
    }

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
    fillRect(destRect, color, blend, rotation)
    {
        this.draw(this.whiteTexture, 
            new Vector2(destRect.x + destRect.width / 2, destRect.y + destRect.height / 2),
            new Vector2(destRect.width, destRect.height), null, color, blend || BlendModes.Opaque, rotation, null, null);
    }

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
    fillRects(destRects, colors, blend, rotation)
    {
        // build group
        if (rotation === undefined) { rotation = 0; }
        let group = new SpritesGroup();
        for (let i = 0; i < destRects.length; ++i) {
            let sprite = new Sprite(this.whiteTexture);
            sprite.color = colors[i] || colors;
            sprite.rotation = rotation.length ? rotation[i] : rotation;
            sprite.blendMode = blend || BlendModes.Opaque;
            let destRect = destRects[i];
            sprite.size.set(destRect.width, destRect.height);
            sprite.position.set(destRect.x + destRect.width / 2, destRect.y + destRect.width / 2);
            sprite.origin.set(0.5, 0.5);
            group.add(sprite);
        }

        // draw group
        this.drawGroup(group);
    }

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
    outlineRect(destRect, color, blend, rotation)
    {
        // get corners
        let topLeft = destRect.getTopLeft();
        let topRight = destRect.getTopRight();
        let bottomRight = destRect.getBottomRight();
        let bottomLeft = destRect.getBottomLeft();

        // rotate vertices
        if (rotation) {

            // center rect
            let center = destRect.getCenter();
            topLeft.subSelf(center);
            topRight.subSelf(center);
            bottomLeft.subSelf(center);
            bottomRight.subSelf(center);

            // do rotation
            let cos = Math.cos(rotation);
            let sin = Math.sin(rotation);
            function rotateVec(vector)
            {
                let x = (vector.x * cos - vector.y * sin);
                let y = (vector.x * sin + vector.y * cos);
                vector.set(x, y);
            }
            rotateVec(topLeft);
            rotateVec(topRight);
            rotateVec(bottomLeft);
            rotateVec(bottomRight);

            // return to original position
            topLeft.addSelf(center);
            topRight.addSelf(center);
            bottomLeft.addSelf(center);
            bottomRight.addSelf(center);
        }
        
        // draw rectangle with lines strip
        this.drawLinesStrip([topLeft, topRight, bottomRight, bottomLeft], color, blend, true);
    }

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
    outlineCircle(circle, color, blend, lineAmount)
    {
        // defaults
        if (lineAmount === undefined) { lineAmount = 32; }

        // generate list of lines to draw circle
        let lines = [];
        const twicePi = 2 * Math.PI;
        for (let i = 0; i <= lineAmount; i++) {
            let point = new Vector2(
                circle.center.x + (circle.radius * Math.cos(i * twicePi / lineAmount)), 
                circle.center.y + (circle.radius * Math.sin(i * twicePi / lineAmount))
            );
            lines.push(point);
        }

        // draw lines
        this.drawLinesStrip(lines, color, blend);
    }

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
    fillCircle(circle, color, blend, lineAmount)
    {
        // defaults
        if (lineAmount === undefined) { lineAmount = 32; }

        // generate list of lines to draw circle
        let lines = [circle.center];
        const twicePi = 2 * Math.PI;
        for (let i = 0; i <= lineAmount; i++) {
            let point = new Vector2(
                circle.center.x + (circle.radius * Math.cos(i * twicePi / lineAmount)), 
                circle.center.y + (circle.radius * Math.sin(i * twicePi / lineAmount))
            );
            lines.push(point);
        }

        // prepare effect and buffers
        let gl = this._gl;
        this._fillShapesBuffer(lines, color, blend, (verts) => {
            gl.drawArrays(gl.TRIANGLE_FAN, 0, verts.length);
            this._drawCallsCount++;
        }, true, 1);
    }

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
    fillCircles(circles, colors, blend, lineAmount)
    {
        // defaults
        if (lineAmount === undefined) { lineAmount = 32; }

        // build vertices and colors arrays
        let vertsArr = [];
        let colorsArr = colors.length ? [] : null;

        // generate vertices and colors
        for (let i = 0; i < circles.length; ++i) {

            let circle = circles[i];
            let color = colors[i] || colors;

            const twicePi = 2 * Math.PI;
            for (let i = 0; i <= lineAmount; i++) {

                // set vertices
                vertsArr.push(new Vector2(
                    circle.center.x + (circle.radius * Math.cos(i * twicePi / lineAmount)), 
                    circle.center.y + (circle.radius * Math.sin(i * twicePi / lineAmount))
                ));
                vertsArr.push(new Vector2(
                    circle.center.x + (circle.radius * Math.cos((i+1) * twicePi / lineAmount)), 
                    circle.center.y + (circle.radius * Math.sin((i+1) * twicePi / lineAmount))
                ));
                vertsArr.push(circle.center);

                // set colors
                if (colorsArr) {
                    colorsArr.push(color);
                    colorsArr.push(color);
                    colorsArr.push(color);
                }
            }
        }

        // prepare effect and buffers
        let gl = this._gl;
        this._fillShapesBuffer(vertsArr, colorsArr || colors, blend, (verts) => {
            gl.drawArrays(gl.TRIANGLES, 0, verts.length);
            this._drawCallsCount++;
        }, false, 3);
    }

    /**
     * Draw a single line between two points.
     * @example
     * Shaku.gfx.drawLine(new Shaku.utils.Vector2(50,50), new Shaku.utils.Vector2(150,50), Shaku.utils.Color.red);
     * @param {Vector2} startPoint Line start point.
     * @param {Vector2} endPoint Line end point.
     * @param {Color} color Line color.
     * @param {BlendMode=} blendMode Blend mode to draw lines with (default to Opaque).
     */
    drawLine(startPoint, endPoint, color, blendMode)
    {
        return this.drawLines([startPoint, endPoint], color, blendMode, false);
    }

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
    drawLinesStrip(points, colors, blendMode, looped)
    {
        // prepare effect and buffers
        let gl = this._gl;

        // do loop - note: we can't use gl.LINE_LOOPED in case we need multiple buffers inside '_fillShapesBuffer' which will invoke more than one draw
        if (looped) {
            points = points.slice(0);
            points.push(points[0]);
            if (colors && colors.length) {
                colors = colors.slice(0);
                colors.push(colors[0]);
            }
        }

        // draw lines
        this._fillShapesBuffer(points, colors, blendMode, (verts) => {
            gl.drawArrays(gl.LINE_STRIP, 0, verts.length);
            this._drawCallsCount++;
        }, true, 2);
    }

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
    drawLines(points, colors, blendMode)
    {
        // prepare effect and buffers
        let gl = this._gl;
        this._fillShapesBuffer(points, colors, blendMode, (verts) => {
            gl.drawArrays(gl.LINES, 0, verts.length);
            this._drawCallsCount++;
        }, true, 2);
    }

    /**
     * Draw a single point from vector.
     * @example
     * Shaku.gfx.drawPoint(new Shaku.utils.Vector2(50,50), Shaku.utils.Color.random());
     * @param {Vector2} point Point to draw.
     * @param {Color} color Point color.
     * @param {BlendMode=} blendMode Blend mode to draw point with (default to Opaque).
     */
    drawPoint(point, color, blendMode)
    {
        return this.drawPoints([point], [color], blendMode);
    }

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
    drawPoints(points, colors, blendMode)
    {
        let gl = this._gl;
        this._fillShapesBuffer(points, colors, blendMode, (verts) => {
            gl.drawArrays(gl.POINTS, 0, verts.length);
            this._drawCallsCount++;
        }, false, 1);
    }

    /**
     * Make the renderer canvas centered.
     */
    centerCanvas()
    {
        let canvas = this._canvas;
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
        let region = this.__getRenderingRegionInternal();

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
     * Prepare buffers, effect and blend mode for shape rendering.
     * @private
     */
    _fillShapesBuffer(points, colors, blendMode, onReady, isStrip, groupsSize)
    {
        // finish whatever we were drawing before
        this.presentBufferedData();

        // some defaults
        colors = colors || _whiteColor;
        blendMode = blendMode || BlendModes.Opaque;

        // sanity - make sure colors and vertices match
        if (colors.length !== undefined && colors.length !== points.length) {
            _logger.error("When drawing shapes with colors array, the colors array and points array must have the same length!");
            return;
        }

        // calculate actual max buffer size
        let maxWithMargin = isStrip ? (this.maxLineSegments-1) : this.maxLineSegments;
        if (groupsSize != 1) {
            while (maxWithMargin % groupsSize !== 0) { maxWithMargin--; }
        }

        // if we have too many vertices, break to multiple calls
        if (points.length > maxWithMargin) {
            let sliceI = 0;
            while (true) {
                let start = sliceI * maxWithMargin;
                let end = start + maxWithMargin;
                if (isStrip && sliceI > 0) { start--; }
                let subpoints = points.slice(start, end);
                if (subpoints.length === 0) { break; }
                let subcolors = (colors && colors.length) ? colors.slice(start, end) : colors;
                this._fillShapesBuffer(subpoints, subcolors, blendMode, onReady, isStrip, groupsSize);
                sliceI++;
            }
            return;
        }

       // basic params
       let gl = this._gl;
       let positionsBuff = this._dynamicBuffers.positionArray;
       let colorsBuff = this._dynamicBuffers.colorsArray;

       for (let i = 0; i < points.length; ++i) {

           // set positions
           positionsBuff[i*3 + 0] = points[i].x;
           positionsBuff[i*3 + 1] = points[i].y;
           positionsBuff[i*3 + 2] = points[i].z || 0;
           
           // set colors
           let color = colors[i] || colors;
           colorsBuff[i*4 + 0] = color.r;
           colorsBuff[i*4 + 1] = color.g;
           colorsBuff[i*4 + 2] = color.b;
           colorsBuff[i*4 + 3] = color.a;
       }

       // set blend mode if needed
       this._setBlendMode(blendMode);

       // prepare effect and texture
       let mesh = new Mesh(this._dynamicBuffers.positionBuffer, null, this._dynamicBuffers.colorsBuffer, this._dynamicBuffers.indexBuffer, points.length);
       this._activeEffect.prepareToDrawBatch(mesh, Matrix.identity);
       this._setActiveTexture(this.whiteTexture);

       // should we slice the arrays to more optimal size?
       let shouldSliceArrays = points.length <= 8;

       // copy position buffer
       this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._dynamicBuffers.positionBuffer);
       this._gl.bufferData(this._gl.ARRAY_BUFFER, 
           shouldSliceArrays ? this._dynamicBuffers.positionArray.slice(0, points.length * 3) : this._dynamicBuffers.positionArray, 
           this._gl.DYNAMIC_DRAW);

       // copy color buffer
       this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._dynamicBuffers.colorsBuffer);
       this._gl.bufferData(this._gl.ARRAY_BUFFER, 
           shouldSliceArrays ? this._dynamicBuffers.colorsArray.slice(0, points.length * 4) : this._dynamicBuffers.colorsArray, 
           this._gl.DYNAMIC_DRAW);

       // set indices
       gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._dynamicBuffers.linesIndexBuffer);
       this._currIndices = null;

       // invoke the on-ready callback
       onReady(points);
    }

    /**
     * Draw sprites group as a batch.
     * @private
     * @param {SpritesGroup} group Group to draw.
     * @param {Boolean} cullOutOfScreen If true will cull quads that are out of screen.
     */
    _drawBatch(group, cullOutOfScreen)
    {
        // skip if empty
        if (group._sprites.length === 0) { return; }

        // finish previous drawings
        this.presentBufferedData();

        // get transform
        let transform = group.getTransform();

        // draw batch
        this.spritesBatch.begin(this._activeEffect, transform);
        this.spritesBatch.draw(group._sprites, cullOutOfScreen);
        this.spritesBatch.end();
    }

    /**
     * Set the currently active texture.
     * @private
     * @param {TextureAsset} texture Texture to set.
     */
    _setActiveTexture(texture)
    {
        if (this._activeEffect.setTexture(texture)) {
            this._setTextureFilter(texture.filter || this.defaultTextureFilter);
            this._setTextureWrapMode(texture.wrapMode || this.defaultTextureWrapMode);
        }
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
        return this._drawCallsCount;
    }

    /**
     * Get number of textured / colored quads we drawn since the beginning of the frame.
     * @returns {Number} Number of quads drawn in this frame..
     */
    get quadsDrawCount()
    {
        return this._drawQuadsCount;
    }

    /**
     * Clear screen to a given color.
     * @example
     * Shaku.gfx.clear(Shaku.utils.Color.cornflowerblue);
     * @param {Color=} color Color to clear screen to, or black if not set.
     */
    clear(color)
    {
        this.presentBufferedData();
        color = color || Color.black;
        this._gl.clearColor(color.r, color.g, color.b, color.a);
        this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
    }

    /**
     * Clear depth buffer.
     * Only relevant when depth is used.
     * @param {Number=} value Value to clear depth buffer to.
     */
    clearDepth(value)
    {
        this._gl.clearDepth((value !== undefined) ? value : 1.0);
    }
    
    /**
     * Set texture mag and min filters.
     * @private
     * @param {TextureFilterMode} filter Texture filter to set.
     */
    _setTextureFilter(filter)
    {
        if (!TextureFilterModes._values.has(filter)) { throw new Error("Invalid texture filter mode! Please pick a value from 'TextureFilterModes'."); }
        let glMode = this._gl[filter];
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, glMode);
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, glMode);
    }

    /**
     * Set texture wrap mode on X and Y axis.
     * @private
     * @param {TextureWrapMode} wrapX Wrap mode on X axis.
     * @param {TextureWrapMode} wrapY Wrap mode on Y axis.
     */
    _setTextureWrapMode(wrapX, wrapY)
    {
        if (wrapY === undefined) { wrapY = wrapX; }
        if (!TextureWrapModes._values.has(wrapX)) { throw new Error("Invalid texture wrap mode! Please pick a value from 'TextureWrapModes'."); }
        if (!TextureWrapModes._values.has(wrapY)) { throw new Error("Invalid texture wrap mode! Please pick a value from 'TextureWrapModes'."); }
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl[wrapX]);
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl[wrapY]);
    }

    /**
     * Set blend mode before drawing.
     * @private
     * @param {BlendMode} blendMode New blend mode to set.
     */
    _setBlendMode(blendMode)
    {
        if (this._lastBlendMode !== blendMode) {

            // get gl context and set defaults
            var gl = this._gl;
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
            this._lastBlendMode = blendMode;
        }
    }
    
    /**
     * Present all currently buffered data.
     */
    presentBufferedData()
    {
        this.__finishDrawingSprites();
    }

    /**
     * Called internally before drawing a sprite to prepare some internal stuff.
     * @private
     */
    __startDrawingSprites(activeEffect, transform)
    {
        // check if should break due to effect or transform change
        if (this.spritesBatch.drawing) {
            if (this.spritesBatch._effect !== activeEffect || this.spritesBatch._transform !== transform) {
                this.spritesBatch.end();
            }
        }

        // start sprites batch
        if (!this.spritesBatch.drawing) {
            this.spritesBatch.begin(activeEffect, transform);
        }
    }
    
    /**
     * Called internally to present sprites batch, if currently drawing sprites.
     * @private
     */
    __finishDrawingSprites()
    {
        if (this.spritesBatch.drawing) {
            this.spritesBatch.end();
        }
    }
    
    /** 
     * @inheritdoc
     * @private
     */
    startFrame()
    {
        // reset some states
        this._lastBlendMode = null;
        this._drawCallsCount = 0;
        this._drawQuadsCount = 0;
        
        // reset cached rendering region
        this.__resetCachedRenderingRegion();
    }

    /** 
     * @inheritdoc
     * @private
     */
    endFrame()
    {
        this.presentBufferedData();
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

// export main object
module.exports = new Gfx();