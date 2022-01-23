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
const BlendModes = require('./blend_modes.js');
const Rectangle = require('../utils/rectangle.js');
const { Effect, BasicEffect } = require('./effects');
const TextureAsset = require('../assets/texture_asset.js');
const TextureFilterModes = require('./texture_filter_modes.js');
const TextureWrapModes = require('./texture_wrap_modes.js');
const MeshGenerator = require('./mesh_generator.js');
const Matrix = require('./matrix.js');
const Camera = require('./camera.js');
const Sprite = require('./sprite.js');
const SpritesGroup = require('./sprites_group.js');
const Vector2 = require('../utils/vector2.js');
const FontTextureAsset = require('../assets/font_texture_asset.js');
const TextAlignment = require('./text_alignment.js');
const Mesh = require('./mesh.js');
const Circle = require('../utils/circle.js');
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
        this._initSettings = { antialias: true, alpha: true, depth: false, premultipliedAlpha: true };
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
    }

    /**
     * Get how many sprites we can draw in a single batch.
     * @private
     * @returns {Number} batch max sprites count.
     */
    get batchSpritesCount()
    {
        return 2048;
    }

    /**
     * Maximum number of vertices we allow when drawing lines.
     * @private
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
     * @example
     * Shaku.gfx.setContextAttributes({ antialias: true, alpha: false });
     * @param {Dictionary} flags WebGL init flags to set.
     */
    setContextAttributes(flags)
    {
        if (this._gl) { throw new Error("Can't call setContextAttributes() after gfx was initialized!"); }
        this._initSettings = flags;
    }

    /**
     * Set the canvas element to initialize on.
     * You must call this *before* initializing Shaku. Calling this will prevent Shaku from creating its own canvas.
     * @example
     * Shaku.gfx.setCanvas(document.getElementById('my-canvas')); 
     * @param {Canvas} element Canvas element to initialize on.
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
     * @returns {Canvas} Canvas we use for rendering.
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
     * Get the text alignments options.
     * * Left: align text to the left.
     * * Right: align text to the right.
     * * Center: align text to center.
     * @see TextAlignment
     */
    get TextAlignment()
    {
        return TextAlignment;
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
     */
    maximizeCanvasSize(limitToParent)
    {
        // parent
        if (limitToParent) {
            let parent = this._canvas.parentElement;
            let width = parent.clientWidth - this._canvas.offsetLeft;
            let height = parent.clientHeight - this._canvas.offsetTop;
            if ((this._canvas.width !== width) || (this._canvas.height !== height)) {
                this.setResolution(width, height, true);
            }
        }
        // entire screen
        else {
            let width = window.innerWidth;
            let height = window.innerHeight;
            this._canvas.style.left = '0px';
            this._canvas.style.top = '0px';
            if ((this._canvas.width !== width) || (this._canvas.height !== height)) {
                this.setResolution(width, height, true);
            }
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
     * @param {TextureAsset} texture Render target texture to set as render target, or null to reset and render back on canvas.
     * @param {Boolean} keepCamera If true, will keep current camera settings. If false (default) will reset camera.
     */
    setRenderTarget(texture, keepCamera)
    {
        // if texture is null, remove any render target
        if (texture === null) {
            this._renderTarget = null;
            this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
            if (!keepCamera) {
                this.resetCamera();
            }
            return;
        }

        // bind the framebuffer
        this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._fb);
        
        // attach the texture as the first color attachment
        const attachmentPoint = this._gl.COLOR_ATTACHMENT0;
        this._gl.framebufferTexture2D(
        this._gl.FRAMEBUFFER, attachmentPoint, this._gl.TEXTURE_2D, texture.texture, 0);
        this._renderTarget = texture;

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
     * @param {Effect} effect Effect to use or null to use the basic builtin effect.
     */
    useEffect(effect)
    {
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
        this._canvas.width = width;
        this._canvas.height = height;
        
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
        this._viewport = camera.viewport;
        let viewport = this.getRenderingRegion(true);
        this._gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
        this._projection = camera.projection.clone();
        if (this._activeEffect) { this._activeEffect.setProjectionMatrix(this._projection); }
    }

    /**
     * Get current rendering region.
     * @param {Boolean} includeOffset If true (default) will include viewport offset, if exists.
     * @returns {Rectangle} Rectangle with rendering region.
     */
    getRenderingRegion(includeOffset)
    {
        if (this._viewport) {
            let ret = this._viewport.clone();
            if (includeOffset === false) {
                ret.x = ret.y = 0;
            }
            return ret;
        }
        return new Rectangle(0, 0, (this._renderTarget || this._canvas).width, (this._renderTarget || this._canvas).height);
    }

    /**
     * Get current rendering size.
     * Unlike 'canvasSize', this takes viewport and render target into consideration.
     * @returns {Vector2} rendering size.
     */
    getRenderingSize()
    {
        let region = this.getRenderingRegion();
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

            // get gl context
            this._gl = this._canvas.getContext('webgl2', this._initSettings) || this._canvas.getContext('webgl', this._initSettings);
            if (!this._gl) {
                _logger.error("Can't get WebGL context!");
                return reject("Failed to get WebGL context from canvas!");
            }

            // create default effects
            this.builtinEffects.Basic = this.createEffect(BasicEffect);

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

            // use default effect
            this.useEffect(null);

            // create default camera
            this._camera = this.createCamera();
            this.applyCamera(this._camera);

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
     * @param {Number} fontSize Font size, or undefined to use font texture base size.
     * @param {Color} color Text sprites color.
     * @param {TextAlignment} alignment Text alignment.
     * @param {Vector2} marginFactor Optional factor for characters and line spacing. For example value of 2,1 will make double horizontal spacing. 
     * @returns {SpritesGroup} Sprites group containing the needed sprites to draw the given text with its properties.
     */
    buildText(fontTexture, text, fontSize, color, alignment, marginFactor)
    {
        // sanity
        if (!fontTexture || !fontTexture.valid) {
            throw new Error("Font texture is invalid!");
        }
        if (!text) {
            throw new Error("Text is invalid!");
        }

        // default alignment
        alignment = alignment || TextAlignment.Left;

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

                case TextAlignment.Right:
                    offsetX = -lineWidth;
                    break;

                case TextAlignment.Center:
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
                sprite.position.copy(position);
                sprite.color.copy(color);
                sprite.origin.x = 0;
                ret.add(sprite);

                // add to current line sprites
                currentLineSprites.push(sprite);
            }

            // update current line width
            lineWidth += size.x * marginFactor.x;

            // set position for next character
            position.x += size.x * marginFactor.x;
        }

        // call break line on last line, to adjust alignment for last line
        breakLine();

        // return group
        return ret;
    }

    /**
     * Draw a SpritesGroup object. 
     * A SpritesGroup is a collection of sprites we can draw in bulks + transformations to apply on the entire group.
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
     * // draw the group with batching
     * Shaku.gfx.drawGroup(group, true);
     * @param {SpritesGroup} group Sprites group to draw.
     * @param {Boolean} useBatching If true (default), will use batching while rendering the group.
     * @param {Boolean} cullOutOfScreen If true and in batching mode, will cull automatically any quad that is completely out of screen.
     */
    drawGroup(group, useBatching, cullOutOfScreen)
    {
        // draw with batching
        if (useBatching || useBatching === undefined) {
            this._drawBatch(group, Boolean(cullOutOfScreen));
        }
        // draw without batching
        else {
            let transform = group.getTransform();
            for (let i = 0; i < group._sprites.length; ++i) {
                this.drawSprite(group._sprites[i], transform);
            }
        }
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
     * @param {Matrix} transform Optional parent transformation matrix.
     */
    drawSprite(sprite, transform)
    {
        this.draw(sprite.texture, sprite.position, sprite.size, sprite.sourceRect, sprite.color, sprite.blendMode, sprite.rotation, sprite.origin, transform);
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
     * @param {Rectangle|Vector2} destRect Destination rectangle to draw on. If vector2 is provided, will draw from 0,0 with vector as size.
     * @param {Rectangle} sourceRect Source rectangle, or undefined to use the entire texture.
     * @param {Color} color Tint color, or undefined to not change color.
     * @param {BlendModes} blendMode Blend mode, or undefined to use alpha blend.
     */
    cover(texture, destRect, sourceRect, color, blendMode)
    {
        if (destRect instanceof Vector2) {
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
     * @param {Vector2} position Drawing position (at origin).
     * @param {Vector2|Number} size Drawing size.
     * @param {Rectangle} sourceRect Source rectangle, or undefined to use the entire texture.
     * @param {Color} color Tint color, or undefined to not change color.
     * @param {BlendModes} blendMode Blend mode, or undefined to use alpha blend.
     * @param {Number} rotation Rotate sprite.
     * @param {Vector2} origin Drawing origin. This will be the point at 'position' and rotation origin.
     * @param {Matrix} transform Optional parent transformation matrix.
     */
    draw(texture, position, size, sourceRect, color, blendMode, rotation, origin, transform)
    {
        // not ready yet? skip
        if (!texture.texture) { 
            return;
        }

        // if number, convert size to vector
        if (typeof size === 'number') { 
            size = {x: size, y: size};
        }

        // default origin
        if (!origin) {
            origin = Vector2.half;
        }
        
        // build world matrix
        let world;
        if (rotation) { 
            world = Matrix.multiplyManyIntoFirst([
                Matrix.translate(Math.floor(position.x), Math.floor(position.y), 0),
                Matrix.rotateZ(-rotation),
                Matrix.translate(Math.floor((1 - origin.x - 0.5) * size.x), Math.floor((1 - origin.y - 0.5) * size.y), 0),
                Matrix.scale(Math.floor(size.x), Math.floor(size.y))
            ]);
        }
        else {
            world = Matrix.multiplyIntoFirst(
                Matrix.translate(Math.floor(position.x + (1 - origin.x - 0.5) * size.x), Math.floor(position.y + (1 - origin.y - 0.5) * size.y), 0),
                Matrix.scale(Math.floor(size.x), Math.floor(size.y))
            );
        }

        // draw
        this._drawImp(texture, sourceRect, color, blendMode, world, transform);
    }

    /**
     * Draw a filled colored rectangle.
     * @example
     * // draw a 50x50 red rectangle at position 100x100, that will rotate over time
     * Shaku.gfx.fillRect(new Shaku.utils.Rectangle(100, 100, 50, 50), Shaku.utils.Color.red, null, Shaku.gameTime.elapsed);
     * @param {Rectangle} destRect Rectangle to fill.
     * @param {Color} color Rectangle fill color.
     * @param {BlendModes} blend Blend mode.
     * @param {Number} rotation Rotate the rectangle around its center.
     */
    fillRect(destRect, color, blend, rotation)
    {
        this.draw(this.whiteTexture, 
            new Vector2(destRect.x + destRect.width / 2, destRect.y + destRect.height / 2),
            new Vector2(destRect.width, destRect.height), null, color, blend || BlendModes.Opaque, rotation, null, null);
    }

    /**
     * Draw an outline colored rectangle.
     * @example
     * // draw a 50x50 red rectangle at position 100x100, that will rotate over time
     * Shaku.gfx.outlineRect(new Shaku.utils.Rectangle(100, 100, 50, 50), Shaku.utils.Color.red, null, Shaku.gameTime.elapsed);
     * @param {Rectangle} destRect Rectangle to draw outline for.
     * @param {Color} color Rectangle outline color.
     * @param {BlendModes} blend Blend mode.
     * @param {Number} rotation Rotate the rectangle around its center.
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
     * @param {BlendModes} blend Blend mode.
     * @param {Number} lineAmount How many lines to compose the circle from (bigger number = smoother circle).
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
     * @param {BlendModes} blend Blend mode.
     * @param {Number} lineAmount How many lines to compose the circle from (bigger number = smoother circle).
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
        this._fillShapesBuffer(lines, color, blend);

        // draw elements
        let gl = this._gl;
        gl.drawArrays(gl.TRIANGLE_FAN, 0, lines.length);
        this._drawCallsCount++;
    }

    /**
     * Draw a single line between two points.
     * @example
     * Shaku.gfx.drawLine(new Shaku.utils.Vector2(50,50), new Shaku.utils.Vector2(150,50), Shaku.utils.Color.red);
     * @param {Vector2} startPoint Line start point.
     * @param {Vector2} endPoint Line end point.
     * @param {Color} color Line color.
     * @param {BlendModes} blendMode Blend mode to draw lines with (default to Opaque).
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
     * @param {BlendModes} blendMode Blend mode to draw lines with (default to Opaque).
     * @param {Boolean} looped If true, will also draw a line from last point back to first point.
     */
    drawLinesStrip(points, colors, blendMode, looped)
    {
        // prepare effect and buffers
        this._fillShapesBuffer(points, colors, blendMode);

        // draw elements
        let gl = this._gl;
        let linesType = Boolean(looped) ? gl.LINE_LOOP : gl.LINE_STRIP;
        gl.drawArrays(linesType, 0, points.length);
        this._drawCallsCount++;
    }

    /**
     * Draw a list of lines from an array of points.
     * @example
     * let lines = [new Shaku.utils.Vector2(50,50), new Shaku.utils.Vector2(150,50), new Shaku.utils.Vector2(150,150)];
     * let colors = [Shaku.utils.Color.random(), Shaku.utils.Color.random(), Shaku.utils.Color.random()];
     * Shaku.gfx.drawLines(lines, colors);
     * @param {Array<Vector2>} points Points to draw line between.
     * @param {Color|Array<Color>} colors Single lines color if you want one color for all lines, or an array of colors per segment.
     * @param {BlendModes} blendMode Blend mode to draw lines with (default to Opaque).
     */
     drawLines(points, colors, blendMode)
     {
         // prepare effect and buffers
         this._fillShapesBuffer(points, colors, blendMode);
 
         // draw elements
         let gl = this._gl;
         gl.drawArrays(gl.LINES, 0, points.length);
         this._drawCallsCount++;
     }

    /**
     * Prepare buffers, effect and blend mode for shape rendering.
     * @private
     */
    _fillShapesBuffer(points, colors, blendMode)
    {
       // some defaults
       colors = colors || _whiteColor;
       blendMode = blendMode || BlendModes.Opaque;

        // sanity - make sure colors and vertices match
        if (colors.length !== undefined && colors.length !== points.length) {
            _logger.error("When drawing shapes with colors array, the colors array and points array must have the same length!");
            return;
        }

        // sanity - make sure not too many vertices
        if (points.length > this.maxLineSegments) {
            _logger.error(`Cannot draw shapes with more than ${this.maxLineSegments} vertices!`);
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

        // get transform and setup effect
        var transform = group.getTransform();

        // basic params
        var gl = this._gl;
        var positions = this._dynamicBuffers.positionArray;
        var uvs = this._dynamicBuffers.textureArray;
        var colors = this._dynamicBuffers.colorsArray;
        var currTexture = null;
        var currBlendMode = null;
        var currBatchSpritesCount = 0;

        // draw the current batch
        let drawCurrentBatch = () =>
        {
            // set blend mode if needed
            this._setBlendMode(currBlendMode);

            // prepare effect and texture
            let mesh = new Mesh(this._dynamicBuffers.positionBuffer, this._dynamicBuffers.textureCoordBuffer, this._dynamicBuffers.colorsBuffer, this._dynamicBuffers.indexBuffer, currBatchSpritesCount * 6);
            this._activeEffect.prepareToDrawBatch(mesh, transform || Matrix.identity);
            this._setActiveTexture(currTexture);

            // should we slice the arrays?
            let shouldSliceArrays = currBatchSpritesCount < this.batchSpritesCount / 2;

            // copy position buffer
            this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._dynamicBuffers.positionBuffer);
            this._gl.bufferData(this._gl.ARRAY_BUFFER, 
                shouldSliceArrays ? this._dynamicBuffers.positionArray.slice(0, currBatchSpritesCount * 4 * 3) : this._dynamicBuffers.positionArray, 
                this._gl.DYNAMIC_DRAW);

            // copy texture buffer
            this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._dynamicBuffers.textureCoordBuffer);
            this._gl.bufferData(this._gl.ARRAY_BUFFER, 
                shouldSliceArrays ? this._dynamicBuffers.textureArray.slice(0, currBatchSpritesCount * 4 * 2) : this._dynamicBuffers.textureArray, 
                this._gl.DYNAMIC_DRAW);

            // copy color buffer
            this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._dynamicBuffers.colorsBuffer);
            this._gl.bufferData(this._gl.ARRAY_BUFFER, 
                shouldSliceArrays ? this._dynamicBuffers.colorsArray.slice(0, currBatchSpritesCount * 4 * 4) : this._dynamicBuffers.colorsArray, 
                this._gl.DYNAMIC_DRAW);

            // set indices
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._dynamicBuffers.indexBuffer);
            this._currIndices = null;

            // draw elements
            gl.drawElements(gl.TRIANGLES, currBatchSpritesCount * 6, gl.UNSIGNED_SHORT, 0);
            this._drawCallsCount++;

            // reset arrays
            currBatchSpritesCount = 0;
        }

        // set starting texture and blend mode
        currTexture = group._sprites[0].texture;
        currBlendMode = group._sprites[0].blendMode;

        // draw sprites
        for (let i = 0; i < group._sprites.length; ++i) {

            // get current sprite
            let sprite = group._sprites[i];

            // if texture changed, blend mode changed, or we have too many indices - draw current batch
            if ((currBatchSpritesCount >= this.batchSpritesCount) || (sprite.blendMode !== currBlendMode) || (sprite.texture !== currTexture)) {
                drawCurrentBatch();
                currTexture = sprite.texture;
                currBlendMode = sprite.blendMode;
            }

            // calculate vertices positions
            let sizeX = sprite.size.x;
            let sizeY = sprite.size.y;
            let left = -sizeX * sprite.origin.x;
            let top = -sizeY * sprite.origin.y;

            // calculate corners
            let topLeft = new Vector2(left, top);
            let topRight = new Vector2(left + sizeX, top);
            let bottomLeft = new Vector2(left, top + sizeY);
            let bottomRight = new Vector2(left + sizeX, top + sizeY);

            // apply rotation
            if (sprite.rotation) {
                let cos = Math.cos(sprite.rotation);
                let sin = Math.sin(sprite.rotation);
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
            }

            // add sprite position
            topLeft.addSelf(sprite.position);
            topRight.addSelf(sprite.position);
            bottomLeft.addSelf(sprite.position);
            bottomRight.addSelf(sprite.position);

            // cull out-of-screen sprites
            if (cullOutOfScreen)
            {
                let region = this.getRenderingRegion();
                if (!region.containsVector(topLeft) && !region.containsVector(topRight) && !region.containsVector(bottomLeft) && !region.containsVector(bottomRight)) {
                    continue;
                }
            }

            // update positions buffer
            let pi = currBatchSpritesCount * 4 * 3;
            positions[pi+0] = topLeft.x;             positions[pi+1] = topLeft.y;             positions[pi+2] = 0;
            positions[pi+3] = topRight.x;            positions[pi+4] = topRight.y;            positions[pi+5] = 0;
            positions[pi+6] = bottomLeft.x;          positions[pi+7] = bottomLeft.y;          positions[pi+8] = 0;
            positions[pi+9] = bottomRight.x;         positions[pi+10] = bottomRight.y;        positions[pi+11] = 0;

            // add uvs
            let uvi = currBatchSpritesCount * 4 * 2;
            if (sprite.sourceRect) {
                let uvTl = {x: sprite.sourceRect.x / currTexture.width, y: sprite.sourceRect.y / currTexture.height};
                let uvBr = {x: uvTl.x + sprite.sourceRect.width / currTexture.width, y: uvTl.y + sprite.sourceRect.height / currTexture.height};
                uvs[uvi+0] = uvTl.x;  uvs[uvi+1] = uvTl.y;
                uvs[uvi+2] = uvBr.x;  uvs[uvi+3] = uvTl.y;
                uvs[uvi+4] = uvTl.x;  uvs[uvi+5] = uvBr.y;
                uvs[uvi+6] = uvBr.x;  uvs[uvi+7] = uvBr.y;
            }
            else {
                uvs[uvi+0] = 0;  uvs[uvi+1] = 0;
                uvs[uvi+2] = 1;  uvs[uvi+3] = 0;
                uvs[uvi+4] = 0;  uvs[uvi+5] = 1;
                uvs[uvi+6] = 1;  uvs[uvi+7] = 1;
            }

            // add colors
            let ci = currBatchSpritesCount * 4 * 4;
            for (let x = 0; x < 4; ++x) {
                colors[ci + x*4 + 0] = sprite.color.r;
                colors[ci + x*4 + 1] = sprite.color.g;
                colors[ci + x*4 + 2] = sprite.color.b;
                colors[ci + x*4 + 3] = sprite.color.a;
            }
                    
            // increase sprites count
            currBatchSpritesCount++;
        }

        // draw last batch
        if (currBatchSpritesCount > 0) {
            drawCurrentBatch();
        }
    }

    /**
     * Draw a texture internal implementation.
     * @private
     */
    _drawImp(texture, sourceRect, color, blendMode, world, parentTransform)
    {
        // set blend mode if needed
        this._setBlendMode(blendMode || BlendModes.AlphaBlend);
        
        // add parent to world matrix
        if (parentTransform) {
            world = Matrix.multiply(parentTransform, world);
        }

        // use quad buffers and other effect properties
        let quad = this.meshes.quad;
        quad.overrideColors(this._gl, color || _whiteColor);
        this._activeEffect.prepareToDraw(quad, color, world, sourceRect, texture)

        // set indices
        if (quad.indices !== this._currIndices) {
            this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, quad.indices);
            this._currIndices = quad.indices;
        }

        // set texture
        this._setActiveTexture(texture);

        // draw sprite
        this._gl.drawArrays(this._gl.TRIANGLE_STRIP, 0, 4);
        this._drawCallsCount++;
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
     * Clear screen to a given color.
     * @example
     * Shaku.gfx.clear(Shaku.utils.Color.cornflowerblue);
     * @param {Color} color Color to clear screen to, or black if not set.
     */
    clear(color)
    {
        color = color || Color.black;
        this._gl.clearColor(color.r, color.g, color.b, color.a);
        this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
    }
    
    /**
     * Set texture mag and min filters.
     * @private
     * @param {TextureFilterModes} filter Texture filter to set.
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
     * @param {WrapModes} wrapX Wrap mode on X axis.
     * @param {WrapModes} wrapY Wrap mode on Y axis.
     */
    _setTextureWrapMode(wrapX, wrapY)
    {
        if (wrapY === undefined) { wrapY = wrapX; }
        if (!TextureWrapModes._values.has(wrapX)) { throw new Error("Invalid texture wrap mode! Please pick a value from 'WrapModes'."); }
        if (!TextureWrapModes._values.has(wrapY)) { throw new Error("Invalid texture wrap mode! Please pick a value from 'WrapModes'."); }
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl[wrapX]);
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl[wrapY]);
    }

    /**
     * Set blend mode before drawing.
     * @private
     * @param {BlendModes} blendMode New blend mode to set.
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
     * @inheritdoc
     * @private
     */
    startFrame()
    {
        // reset some states
        this._lastBlendMode = null;
        this._drawCallsCount = 0;
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

// export main object
module.exports = new Gfx();