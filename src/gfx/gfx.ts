import { FontTextureAsset, MsdfFontTextureAsset, TextureAsset, TextureAtlasAsset } from "../assets";
import { Circle, Color, IManager, Line, LoggerFactory, Matrix, Rectangle, Vector2 } from "../utils";
import { BlendModes } from "./blend_modes";
import { Camera } from "./camera";
import { Camera3D } from "./camera3d";
import { DrawBatch, LinesBatch, ShapesBatch, SpriteBatch, SpriteBatch3D, TextSpriteBatch } from "./draw_batches";
import { Effect, MsdfFontEffect, ShapesEffect, Sprites3dEffect, SpritesEffect, SpritesEffectNoVertexColor, SpritesWithOutlineEffect } from "./effects";
import { Sprite } from "./sprite";
import { SpritesGroup } from "./sprites_group";
import { TextAlignments } from "./text_alignments";
import { TextureFilterModes } from "./texture_filter_modes";
import { TextureWrapModes } from "./texture_wrap_modes";
import { Vertex } from "./vertex";

const _logger = LoggerFactory.getLogger("gfx"); // TODO

/**
 * Gfx is the graphics manager.
 * Everything related to rendering and managing your game canvas goes here.
 *
 * To access the Graphics manager you use `Shaku.gfx`.
 */
export class Gfx implements IManager {
	/**
	 * A dictionary containing all built-in effect instances.
	 */
	public builtinEffects: Partial<Record<
		| "Sprites"
		| "SpritesWithOutline"
		| "SpritesNoVertexColor"
		| "MsdfFont"
		| "Shapes"
		| "Sprites3d"
		, Effect>>;

	/**
	 * Default texture filter to use when no texture filter is set.
	 */
	public defaultTextureFilter: TextureFilterModes;

	/**
	 * Default wrap modes to use when no wrap mode is set.
	 */
	public defaultTextureWrapMode: TextureWrapModes;

	/**
	 * A 1x1 white texture.
	 */
	public whiteTexture: TextureAsset | null;

	/**
	 * Provide access to Gfx internal stuff.
	 */
	private internal: GfxInternal;

	private canvas: HTMLCanvasElement | null = null;

	private gl: RenderingContext | null = null;
	private initSettings = {
		antialias: true,
		alpha: true,
		depth: false,
		premultipliedAlpha: true,
		desynchronized: false,
	};
	private activeEffect = null;
	private camera: Camera | null = null;
	private projection: Matrix | null = null;
	private fb = null;
	private drawCallsCount = 0;
	private drawQuadsCount = 0;
	private drawShapePolygonsCount = 0;
	private cachedRenderingRegion: Partial<{
		withoutOffset: Matrix | null;
		withOffset: Matrix | null;
	}> = {};
	private webglVersion = 0;

	/**
	 * Create the manager.
	 */
	public constructor() {
		this.builtinEffects = {};
		this.defaultTextureFilter = TextureFilterModes.NEAREST;
		this.defaultTextureWrapMode = TextureWrapModes.CLAMP;
		this.whiteTexture = null;
		this.internal = new GfxInternal(this);

		// set self for effect and draw batch
		DrawBatch._gfx = this;
		Effect._gfx = this;
	}

	/**
	 * Get the init WebGL version.
	 * @returns WebGL version number.
	 */
	public getWebglVersion(): number {
		return this.webglVersion;
	}

	/**
	 * Maximum number of vertices we allow when drawing lines.
	 * @returns max vertices per lines strip.
	 */
	public getMaxLineSegments(): number {
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
	public setContextAttributes(flags: Record<unknown, unknown>): void {
		if(this.gl) throw new Error("Can't call setContextAttributes() after gfx was initialized!");
		for(const key in flags) this.initSettings[key] = flags[key];
	}

	/**
	 * Set the canvas element to initialize on.
	 * You must call this *before* initializing Shaku. Calling this will prevent Shaku from creating its own canvas.
	 * @example
	 * Shaku.gfx.setCanvas(document.getElementById("my-canvas"));
	 * @param element Canvas element to initialize on.
	 */
	public setCanvas(element: HTMLCanvasElement): void {
		if(this.gl) throw new Error("Can't call setCanvas() after gfx was initialized!");
		this.canvas = element;
	}

	/**
	 * Get the canvas element controlled by the gfx manager.
	 * If you didn't provide your own canvas before initialization, you must add this canvas to your document after initializing `Shaku`.
	 * @example
	 * document.body.appendChild(Shaku.gfx.canvas);
	 * @returns Canvas we use for rendering.
	 */
	public getCanvas(): HTMLCanvasElement {
		return this.canvas;
	}

	/**
	 * Get the draw batch base class.
	 * @see DrawBatch
	 */
	public getDrawBatch(): typeof DrawBatch {
		return DrawBatch;
	}

	/**
	 * Get the sprites batch class.
	 * @see SpriteBatch
	 */
	public getSpriteBatch(): typeof SpriteBatch {
		return SpriteBatch;
	}

	/**
	 * Get the 3d sprites batch class.
	 * @see SpriteBatch3D
	 */
	public getSpriteBatch3D(): typeof SpriteBatch3D {
		return SpriteBatch3D;
	}

	/**
	 * Get the text sprites batch class.
	 * @see TextSpriteBatch
	 */
	public getTextSpriteBatch(): typeof TextSpriteBatch {
		return TextSpriteBatch;
	}

	/**
	 * Get the shapes batch class.
	 * @see ShapesBatch
	 */
	public getShapesBatch(): typeof ShapesBatch {
		return ShapesBatch;
	}

	/**
	 * Get the lines batch class.
	 * @see LinesBatch
	 */
	public getLinesBatch(): typeof LinesBatch {
		return LinesBatch;
	}

	/**
	 * Get the Effect base class, which is required to implement custom effects.
	 * @see Effect
	 */
	public getEffect(): typeof Effect {
		return Effect;
	}

	/**
	 * Get the default sprites effect class.
	 * @see SpritesEffect
	 */
	public getSpritesEffect(): typeof SpritesEffect {
		return SpritesEffect;
	}

	/**
	 * Get the default sprites effect class that is used when vertex colors is disabled.
	 * @see SpritesEffectNoVertexColor
	 */
	public getSpritesEffectNoVertexColor(): typeof SpritesEffectNoVertexColor {
		return SpritesEffectNoVertexColor;
	}

	/**
	 * Get the default shapes effect class that is used to draw 2d shapes.
	 * @see ShapesEffect
	 */
	public getShapesEffect(): typeof ShapesEffect {
		return ShapesEffect;
	}

	/**
	 * Get the default 3d sprites effect class that is used to draw 3d textured quads.
	 * @see Sprites3dEffect
	 */
	public getSprites3dEffect(): typeof Sprites3dEffect {
		return Sprites3dEffect;
	}

	/**
	 * Get the Effect for rendering fonts with an MSDF texture.
	 * @see MsdfFontEffect
	 */
	public getMsdfFontEffect(): typeof MsdfFontEffect {
		return MsdfFontEffect;
	}

	/**
	 * Get the sprite class.
	 * @see Sprite
	 */
	public getSprite(): typeof Sprite {
		return Sprite;
	}

	/**
	 * Get the sprites group object.
	 * @see SpritesGroup
	 */
	public getSpritesGroup(): typeof SpritesGroup {
		return SpritesGroup;
	}

	/**
	 * Get the matrix object.
	 * @see Matrix
	 */
	public getMatrix(): typeof Matrix {
		return Matrix;
	}

	/**
	 * Get the vertex object.
	 * @see Vertex
	 */
	public getVertex(): typeof Vertex {
		return Vertex;
	}

	/**
	 * Get the text alignments options.
	 * * Left: align text to the left.
	 * * Right: align text to the right.
	 * * Center: align text to center.
	 * @see TextAlignments
	 */
	public getTextAlignments(): typeof TextAlignments {
		return TextAlignments;
	}

	/**
	 * Create and return a new camera instance.
	 * @param withViewport If true, will create camera with viewport value equal to canvas' size.
	 * @returns New camera object.
	 */
	public createCamera(withViewport?: boolean): Camera {
		const ret = new Camera(this);
		if(withViewport) ret.setViewport(this.getRenderingRegion());
		return ret;
	}

	/**
	 * Create and return a new 3D camera instance.
	 * @param withViewport If true, will create camera with viewport value equal to canvas' size.
	 * @returns New camera object.
	 */
	public createCamera3D(withViewport?: boolean): Camera3D {
		const ret = new Camera3D(this);
		if(withViewport) ret.setViewport(this.getRenderingRegion());
		return ret;
	}

	/**
	 * Set default orthographic camera from offset.
	 * @param offset Camera top-left corner.
	 * @returns Camera instance.
	 */
	public setCameraOrthographic(offset: Vector2): Camera {
		const camera = this.createCamera();
		camera.orthographicOffset(offset);
		this.applyCamera(camera);
		return camera;
	}

	/**
	 * Set resolution and canvas to the max size of its parent element or screen.
	 * If the canvas is directly under document body, it will take the max size of the page.
	 * @param limitToParent if true, will use parent element size. If false, will stretch on entire document.
	 * @param allowOddNumbers if true, will permit odd numbers, which could lead to small artefacts when drawing pixel art. If false (default) will round to even numbers.
	 */
	public maximizeCanvasSize(limitToParent?: boolean, allowOddNumbers?: boolean): void {
		// new width and height
		let width = 0;
		let height = 0;

		// parent
		if(limitToParent) {
			const parent = this.canvas.parentElement;
			width = parent.clientWidth - this.canvas.offsetLeft;
			height = parent.clientHeight - this.canvas.offsetTop;
		}
		// entire screen
		else {
			width = window.innerWidth;
			height = window.innerHeight;
			this.canvas.style.left = "0px";
			this.canvas.style.top = "0px";
		}

		// make sure even numbers
		if(!allowOddNumbers) {
			if(width % 2 !== 0) width++;
			if(height % 2 !== 0) height++;
		}

		// if changed, set resolution
		if((this.canvas.width !== width) || (this.canvas.height !== height)) {
			this.setResolution(width, height, true);
		}
	}

	/**
	 * Set a render target (texture) to render on.
	 * @example
	 * // create render target
	 * let renderTarget = await Shaku.assets.createRenderTarget("_my_render_target", 800, 600);
	 *
	 * // use render target
	 * Shaku.gfx.setRenderTarget(renderTarget);
	 * // .. draw some stuff here
	 *
	 * // reset render target and present it on screen
	 * // note the negative height - render targets end up with flipped Y axis
	 * Shaku.gfx.setRenderTarget(null);
	 * Shaku.gfx.draw(renderTarget, new Shaku.utils.Vector2(screenX / 2, screenY / 2), new Shaku.utils.Vector2(screenX, -screenY));
	 * @param texture Render target texture to set as render target, or null to reset and render back on canvas. Can also be array for multiple targets, which will take layouts 0-15 by their order.
	 * @param keepCamera If true, will keep current camera settings. If false (default) will reset camera.
	 */
	public setRenderTarget(texture: TextureAsset | TextureAsset[] | null, keepCamera?: boolean): void {
		// reset cached rendering size
		this.resetCachedRenderingRegion();

		// if texture is null, remove any render target
		if(texture === null) {
			this.renderTarget = null;
			this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
			if(!keepCamera) this.resetCamera();
			return;
		}

		// convert texture to array
		if(!Array.isArray(texture)) texture = [texture];

		// bind the framebuffer
		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fb);

		// set render targets
		const drawBuffers = [];
		for(let index = 0; index < texture.length; ++index) {

			// attach the texture as the first color attachment
			const attachmentPoint = this.gl["COLOR_ATTACHMENT" + index];
			this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, attachmentPoint, this.gl.TEXTURE_2D, texture[index]._glTexture, 0);

			// index 0 is the "main" render target
			if(index === 0) this.renderTarget = texture[index];

			// to set drawBuffers in the end
			drawBuffers.push(attachmentPoint);
		}

		// set draw buffers
		this.gl.drawBuffers(drawBuffers);

		// unbind frame buffer
		// _gl.bindFramebuffer(_gl.FRAMEBUFFER, null);

		// reset camera
		if(!keepCamera) this.resetCamera();
	}

	/**
	 * Set resolution and canvas size.
	 * @example
	 * // set resolution and size of 800x600.
	 * Shaku.gfx.setResolution(800, 600, true);
	 * @param width Resolution width.
	 * @param height Resolution height.
	 * @param updateCanvasStyle If true, will also update the canvas *css* size in pixels.
	 */
	public setResolution(width: number, height: number, updateCanvasStyle: boolean): void {
		this.canvas.width = width;
		this.canvas.height = height;

		if(width % 2 !== 0 || height % 2 !== 0) {
			_logger.warn("Resolution to set is not even numbers; This might cause minor artefacts when using texture atlases. Consider using even numbers instead.");
		}

		if(updateCanvasStyle) {
			this.canvas.style.width = width + "px";
			this.canvas.style.height = height + "px";
		}

		this.gl.viewport(0, 0, width, height);
		this.resetCamera();
	}

	/**
	 * Reset camera properties to default camera.
	 */
	public resetCamera(): void {
		this.camera = this.createCamera();
		const size = this.getRenderingSize();
		this.camera.orthographic(new Rectangle(0, 0, size.x, size.y));
		this.applyCamera(this.camera);
	}

	/**
	 * Set viewport, projection and other properties from a camera instance.
	 * Changing the camera properties after calling this method will *not* update the renderer, until you call applyCamera again.
	 * @param camera Camera to apply.
	 */
	public applyCamera(camera: Camera): void {
		// set viewport and projection
		this._viewport = camera.getViewport();
		const viewport = this.getRenderingRegionInternal(true);
		this.gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
		this.projection = camera.getProjection().clone();

		// update effect
		if(this.activeEffect) this.activeEffect.setProjectionMatrix(this.projection);

		// reset cached rendering region
		this.resetCachedRenderingRegion();
	}

	/**
	 * Get current rendering region.
	 * @param includeOffset If true (default) will include viewport offset, if exists.
	 * @returns Rectangle with rendering region.
	 */
	private getRenderingRegionInternal(includeOffset?: boolean): Rectangle {
		return this.internal.getRenderingRegionInternal(includeOffset);
	}

	/**
	 * Reset cached rendering region values.
	 */
	private resetCachedRenderingRegion(): void {
		this.cachedRenderingRegion.withoutOffset = null;
		this.cachedRenderingRegion.withOffset = null;
	}

	/**
	 * Get current rendering region.
	 * @param includeOffset If true (default) will include viewport offset, if exists.
	 * @returns Rectangle with rendering region.
	 */
	public getRenderingRegion(includeOffset = true): Rectangle {
		return this.getRenderingRegionInternal(includeOffset).clone();
	}

	/**
	 * Get current rendering size.
	 * Unlike "canvasSize", this takes viewport and render target into consideration.
	 * @returns {Vector2} rendering size.
	 */
	public getRenderingSize(): Vector2 {
		const region = this.getRenderingRegionInternal();
		return region.getSize();
	}

	/**
	 * Get canvas size as vector.
	 * @returns Canvas size.
	 */
	public getCanvasSize(): Vector2 {
		return new Vector2(this.canvas.width, this.canvas.height);
	}

	/**
	 * @inheritdoc
	 * @private
	 */
	public setup(): Promise<void> {
		return new Promise(async (resolve, reject) => {
			_logger.info("Setup gfx manager..");

			// if no canvas is set, create one
			if(!this.canvas) this.canvas = document.createElement("canvas");

			// get webgl context
			this.gl = this.canvas.getContext("webgl2", this.initSettings);
			this.webglVersion = 2;

			// no webgl2? try webgl1
			if(!this.gl) {
				_logger.warn("Failed to init WebGL2, attempt fallback to WebGL1.");
				this.gl = this.canvas.getContext("webgl", this.initSettings);
				this.webglVersion = 1;
			}

			// no webgl at all??
			if(!this.gl) {
				this.webglVersion = 0;
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
			this.fb = this.gl.createFramebuffer();

			// create a useful single white pixel texture
			const whitePixelImage = new Image();
			whitePixelImage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=";
			await new Promise((resolve, reject) => { whitePixelImage.onload = resolve; });
			this.whiteTexture = new TextureAsset("__runtime_white_pixel__");
			this.whiteTexture.fromImage(whitePixelImage);

			// create default camera
			this.camera = this.createCamera();
			this.applyCamera(this.camera);

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
	 * let fontTexture = await Shaku.assets.loadFontTexture("assets/DejaVuSansMono.ttf", {fontName: "DejaVuSansMono"});
	 *
	 * // generate "hello world!" text (note: you don't have to regenerate every frame if text didn't change)
	 * let text1 = Shaku.gfx.buildText(fontTexture, "Hello World!");
	 * text1.position.set(40, 40);
	 *
	 * // draw text
	 * Shaku.gfx.drawGroup(text1, true);
	 * @param fontTexture Font texture asset to use.
	 * @param text Text to generate sprites for.
	 * @param fontSize Font size, or undefined to use font texture base size.
	 * @param color Text sprites color. If array is set, will assign each color to different vertex, starting from top-left.
	 * @param alignment Text alignment.
	 * @param offset Optional starting offset.
	 * @param marginFactor Optional factor for characters and line spacing. For example value of 2,1 will make double horizontal spacing.
	 * @returns Sprites group containing the needed sprites to draw the given text with its properties.
	 */
	public buildText(
		fontTexture: FontTextureAsset,
		text: string,
		fontSize: number = fontTexture.getFontSize(),
		color: Color | Color[] = Color.black,
		alignment = TextAlignments.LEFT,
		offset?: Vector2,
		marginFactor = Vector2.one(),
	): SpritesGroup {
		// sanity
		if(!fontTexture.isValid()) throw new Error("Font texture is invalid!");

		// get character scale factor
		const scale = fontSize / fontTexture.getFontSize();

		// current character offset
		const position = new Vector2(0, 0);

		// current line characters and width
		let currentLineSprites: Sprite[] = [];
		let lineWidth = 0;

		// go line down
		function breakLine() {
			// add offset to update based on alignment
			let offsetX = 0;
			switch(alignment) {
				case TextAlignments.RIGHT: offsetX = -lineWidth; break;
				case TextAlignments.CENTER: offsetX = -lineWidth / 2; break;
			}

			// if we need to shift characters for alignment, do it
			if(offsetX !== 0) {
				for(let i = 0; i < currentLineSprites.length; ++i) currentLineSprites[i].position.x += offsetX;
			}

			// update offset
			position.x = 0;
			position.y += fontTexture.getLineHeight() * scale * marginFactor.y;

			// reset line width and sprites
			currentLineSprites = [];
			lineWidth = 0;
		}

		// create group to return and build sprites
		const ret = new SpritesGroup();
		for(let i = 0; i < text.length; ++i) {
			// get character and source rect
			const character = text[i];
			const sourceRect = fontTexture.getSourceRect(character);

			// special case - break line
			if(character === "\n") {
				breakLine();
				continue;
			}

			// calculate character size
			const size = new Vector2(sourceRect.width * scale, sourceRect.height * scale);

			// create sprite (unless its space)
			if(character !== " ") {

				// create sprite and add to group
				const sprite = new Sprite(fontTexture);
				sprite.sourceRectangle = sourceRect;
				sprite.size = size;
				const positionOffset = fontTexture.getPositionOffset(character);
				if(fontTexture instanceof MsdfFontTextureAsset) sprite.position.copy(position).addSelf(positionOffset.mul(scale * 0.5));
				else sprite.position.copy(position).addSelf(positionOffset.mul(scale));
				sprite.origin.set(0.5, 0.5);
				if(color instanceof Color) sprite.color.copy(color);
				else {
					sprite.color = [];
					for(const col of color) {
						sprite.color.push(col.clone());
					}
				}
				sprite.origin.x = 0;
				ret.add(sprite);

				// add to current line sprites
				currentLineSprites.push(sprite);
			}

			const moveCursorAmount = fontTexture.getXAdvance(character) * scale * marginFactor.x;

			// update current line width
			lineWidth += moveCursorAmount;

			// set position for next character
			position.x += moveCursorAmount;
		}

		// call break line on last line, to adjust alignment for last line
		breakLine();

		// set position
		if(offset) {
			ret.position.set(offset.x, offset.y);
		}

		// return group
		return ret;
	}

	/**
	 * Make the renderer canvas centered.
	 */
	public centerCanvas(): void {
		const canvas = this.canvas;
		const parent = canvas.parentElement;
		const pwidth = Math.min(parent.clientWidth, window.innerWidth);
		const pheight = Math.min(parent.clientHeight, window.innerHeight);
		canvas.style.left = Math.round(pwidth / 2 - canvas.clientWidth / 2) + "px";
		canvas.style.top = Math.round(pheight / 2 - canvas.clientHeight / 2) + "px";
		canvas.style.display = "block";
		canvas.style.position = "relative";
	}

	/**
	 * Check if a given shape is currently in screen bounds, not taking camera into consideration.
	 * @param shape Shape to check.
	 * @returns True if given shape is in visible region.
	 */
	public inScreen(shape: Circle | Vector2 | Rectangle | Line): boolean {
		const region = this.getRenderingRegionInternal();
		if(shape instanceof Circle) return region.collideCircle(shape);
		else if(shape instanceof Vector2) return region.containsVector(shape);
		else if(shape instanceof Rectangle) return region.collideRect(shape);
		else return region.collideLine(shape);
	}

	/**
	 * Make a given vector the center of the camera.
	 * @param position Camera position.
	 * @param useCanvasSize If true, will always use canvas size when calculating center. If false and render target is set, will use render target's size.
	 */
	public centerCamera(position: Vector2, useCanvasSize?: boolean): void {
		const renderSize = useCanvasSize ? this.getCanvasSize() : this.getRenderingSize();
		const halfScreenSize = renderSize.mul(0.5);
		const centeredPos = position.sub(halfScreenSize);
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
	 * ![Blend Modes](resources/demo/blend-modes.png)
	 * @see BlendModes
	 */
	public getBlendModes(): typeof BlendModes {
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
	public getTextureWrapModes(): typeof TextureWrapModes {
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
	 * ![Filter Modes](resources/demo/filter-modes.png)
	 * @see TextureFilterModes
	 */
	public getTextureFilterModes(): typeof TextureFilterModes {
		return TextureFilterModes;
	}

	/**
	 * Get number of actual WebGL draw calls we performed since the beginning of the frame.
	 * @returns Number of WebGL draw calls this frame.
	 */
	public getDrawCallsCount(): number {
		return this.drawCallsCount;
	}

	/**
	 * Get number of textured / colored quads we drawn since the beginning of the frame.
	 * @returns Number of quads drawn in this frame.
	 */
	public getQuadsDrawCount(): number {
		return this.drawQuadsCount;
	}

	/**
	 * Get number of shape polygons we drawn since the beginning of the frame.
	 * @returns Number of shape polygons drawn in this frame.
	 */
	public getShapePolygonsDrawCount(): number {
		return this.drawShapePolygonsCount;
	}

	/**
	 * Clear screen to a given color.
	 * @example
	 * Shaku.gfx.clear(Shaku.utils.Color.cornflowerblue);
	 * @param color Color to clear screen to, or black if not set.
	 */
	public clear(color = Color.black): void {
		this.gl.clearColor(color.getR(), color.getG(), color.getB(), color.getA());
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	}

	/**
	 * Clear depth buffer.
	 * Only relevant when depth is used.
	 * @param value Value to clear depth buffer to.
	 */
	public clearDepth(value = 1): void {
		this.gl.clearDepth(value);
	}

	/**
	 * @inheritdoc
	 * @private
	 */
	public startFrame(): void {
		// reset some states
		this.lastBlendMode = null;
		this.drawCallsCount = 0;
		this.drawQuadsCount = 0;
		this.drawShapePolygonsCount = 0;

		// reset cached rendering region
		this.resetCachedRenderingRegion();
	}

	/**
	 * @inheritdoc
	 * @private
	 */
	public endFrame(): void {
	}

	/**
	 * @inheritdoc
	 * @private
	 */
	public destroy(): void {
		_logger.warn("Cleaning up WebGL is not supported yet!");
	}
}

/**
 * Internal Gfx stuff that should not be used or exposed externally.
 * @private
 */
export class GfxInternal {
	private _gfx: Gfx;
	private _gl: WebGLRenderingContext;
	private lastBlendMode: BlendModes | null = null;
	private activeEffectFlags = null;
	private renderTarget: TextureAsset | null = null;

	public constructor(gfx) {
		this._gfx = gfx;
	}

	public getGl() {
		return _gl;
	}

	public getDrawQuadsCount() {
		return _drawQuadsCount;
	}

	public setDrawQuadsCount(value) {
		_drawQuadsCount = value;
	}

	public getDrawCallsCount() {
		return _drawCallsCount;
	}

	public setDrawCallsCount(value) {
		_drawCallsCount = value;
	}

	public getDrawShapePolygonsCount() {
		return _drawShapePolygonsCount;
	}

	public setDrawShapePolygonsCount(value) {
		_drawShapePolygonsCount = value;
	}

	public useEffect(effect, overrideFlags) {
		// if null, use default
		if(effect === null) {
			effect = this._gfx.builtinEffects.Sprites;
		}

		// same effect? skip
		if((_activeEffect === effect) && (this._activeEffectFlags === overrideFlags)) {
			return;
		}

		// set effect
		effect.setAsActive(overrideFlags);
		_activeEffect = effect;
		this._activeEffectFlags = overrideFlags;

		// set projection matrix
		if(_projection) {
			_activeEffect.setProjectionMatrix(_projection);
		}
	}

	public getRenderingRegionInternal(includeOffset?: boolean) {
		// cached with offset
		if(includeOffset && _cachedRenderingRegion.withOffset) {
			return _cachedRenderingRegion.withOffset;
		}

		// cached without offset
		if(!includeOffset && _cachedRenderingRegion.withoutOffset) {
			return _cachedRenderingRegion.withoutOffset;
		}

		// if we got viewport..
		if(this._gfx._viewport) {

			// get region from viewport
			const ret = this._gfx._viewport.clone();

			// if without offset, remove it
			if(includeOffset === false) {
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
		const ret = new Rectangle(0, 0, (this._renderTarget || _canvas).width, (this._renderTarget || _canvas).height);
		_cachedRenderingRegion.withoutOffset = _cachedRenderingRegion.withOffset = ret;
		return ret;
	}

	public setTextureFilter(filter: TextureFilterModes) {
		const glMode = this._gl[filter];
		this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, glMode);
		this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, glMode);
	}

	public setTextureWrapMode(wrapX: TextureWrapModes, wrapY = wrapX) {
		this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl[wrapX]);
		this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl[wrapY]);
	}

	public setActiveTexture(texture) {
		if(_activeEffect.setTexture(texture)) {
			this.setTextureFilter(texture.filter || this._gfx.defaultTextureFilter);
			this.setTextureWrapMode(texture.wrapMode || this._gfx.defaultTextureWrapMode);
		}
	}

	public setBlendMode(blendMode: BlendModes) {
		if(this._lastBlendMode === blendMode) return;

		// get gl context and set defaults
		const gl = _gl;
		switch(blendMode) {
			case BlendModes.ALPHA_BLEND:
				gl.enable(gl.BLEND);
				gl.blendEquation(gl.FUNC_ADD);
				gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
				break;

			case BlendModes.OPAQUE:
				gl.disable(gl.BLEND);
				break;

			case BlendModes.ADDITIVE:
				gl.enable(gl.BLEND);
				gl.blendEquation(gl.FUNC_ADD);
				gl.blendFunc(gl.ONE, gl.ONE);
				break;

			case BlendModes.MULTIPLY:
				gl.enable(gl.BLEND);
				gl.blendEquation(gl.FUNC_ADD);
				gl.blendFuncSeparate(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
				break;

			case BlendModes.SCREEN:
				gl.enable(gl.BLEND);
				gl.blendEquation(gl.FUNC_ADD);
				gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_COLOR, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
				break;

			case BlendModes.SUBTRACT:
				gl.enable(gl.BLEND);
				gl.blendEquation(gl.FUNC_ADD);
				gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ONE, gl.ONE);
				gl.blendEquationSeparate(gl.FUNC_REVERSE_SUBTRACT, gl.FUNC_ADD);
				break;

			case BlendModes.INVERT:
				gl.enable(gl.BLEND);
				gl.blendEquation(gl.FUNC_ADD);
				gl.blendFunc(gl.ONE_MINUS_DST_COLOR, gl.ZERO);
				gl.blendFuncSeparate(gl.ONE_MINUS_DST_COLOR, gl.ZERO, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
				break;

			case BlendModes.OVERLAY:
				gl.enable(gl.BLEND);
				if(gl.MAX) {
					gl.blendEquation(gl.MAX);
					gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
				} else {
					gl.blendEquation(gl.FUNC_ADD);
					gl.blendFunc(gl.ONE, gl.ONE);
				}
				break;

			case BlendModes.DARKEN:
				gl.enable(gl.BLEND);
				gl.blendEquation(gl.MIN);
				gl.blendFuncSeparate(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
				break;

			case BlendModes.DEST_IN:
				gl.enable(gl.BLEND);
				gl.blendEquation(gl.FUNC_ADD);
				gl.blendFunc(gl.ZERO, gl.SRC_ALPHA);
				break;

			case BlendModes.DEST_OUT:
				gl.enable(gl.BLEND);
				gl.blendEquation(gl.FUNC_ADD);
				gl.blendFunc(gl.ZERO, gl.ONE_MINUS_SRC_ALPHA);
				// can also use: gl.blendFunc(gl.ONE_MINUS_DST_COLOR, gl.ONE_MINUS_SRC_COLOR);
				break;
		}

		// store last blend mode
		_lastBlendMode = blendMode;
	}
}

export const gfx = new Gfx();
