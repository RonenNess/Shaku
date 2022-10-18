declare const _exports: Shaku;
export = _exports;
/**
 * Shaku's main object.
 * This object wraps the entire lib namespace, and this is what you use to access all managers and manage your main loop.
*/
declare class Shaku {
    /**
     * Different utilities and framework objects, like vectors, rectangles, colors, etc.
     */
    utils: {
        Vector2: typeof import("./utils/vector2");
        Vector3: typeof import("./utils/vector3");
        Rectangle: typeof import("./utils/rectangle");
        Circle: typeof import("./utils/circle");
        Line: typeof import("./utils/line");
        Color: typeof import("./utils/color");
        Animator: typeof import("./utils/animator");
        GameTime: typeof GameTime;
        MathHelper: typeof import("./utils/math_helper");
        SeededRandom: typeof import("./utils/seeded_random");
        Perlin: typeof import("./utils/perlin");
        Storage: typeof import("./utils/storage");
        StorageAdapter: typeof import("./utils/storage_adapter");
        PathFinder: {
            findPath: (grid: {
                isBlocked(_from: any, _to: any): boolean;
                getPrice(_index: any): number;
            }, startPos: any, targetPos: any, options: any) => import("./utils/vector2")[];
            IGrid: {
                new (): {
                    isBlocked(_from: any, _to: any): boolean;
                    getPrice(_index: any): number;
                };
            };
        };
        Transformation: typeof import("./utils/transformation");
        TransformationModes: {
            Relative: string;
            AxisAligned: string;
            Absolute: string;
        };
    };
    /**
     * Sound effects and music manager.
     */
    sfx: {
        _playingSounds: any;
        setup(): any;
        /**
         * Shaku's main object.
         * This object wraps the entire lib namespace, and this is what you use to access all managers and manage your main loop.
        */
        startFrame(): void;
        endFrame(): void;
        destroy(): void;
        readonly SoundMixer: typeof import("./sfx/sound_mixer");
        play(sound: import("./assets/sound_asset"), volume: number, playbackRate: number, preservesPitch: boolean): Promise<any>;
        stopAll(): void;
        readonly playingSoundsCount: number;
        createSound(sound: import("./assets/sound_asset")): import("./sfx/sound_instance");
        masterVolume: number;
    };
    /**
     * Graphics manager.
     */
    gfx: {
        _gl: RenderingContext;
        _initSettings: {
            antialias: boolean;
            /**
             * If true, will pause the updates and drawing calls when window is not focused.
             * Will also not update elapsed time.
             */
            alpha: boolean;
            depth: boolean;
            premultipliedAlpha: boolean;
            desynchronized: boolean;
        };
        _canvas: HTMLCanvasElement;
        _lastBlendMode: any;
        _activeEffect: any;
        _camera: import("./gfx/camera"); /**
         * Set to true to completely pause Shaku (will skip updates, drawing, and time counting).
         */
        _projection: import("./gfx/matrix");
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
        whiteTexture: import("./assets/texture_asset");
        _renderTarget: import("./assets/texture_asset");
        _viewport: import("./utils/rectangle");
        _drawCallsCount: number;
        _drawQuadsCount: number;
        spritesBatch: import("./gfx/sprite_batch");
        readonly batchSpritesCount: number;
        readonly maxLineSegments: number;
        setContextAttributes(flags: Dictionary): void;
        setCanvas(element: HTMLCanvasElement): void;
        readonly canvas: HTMLCanvasElement;
        readonly Effect: typeof import("./gfx/effects/effect");
        readonly BasicEffect: typeof import("./gfx/effects/basic");
        readonly MsdfFontEffect: typeof import("./gfx/effects/msdf_font");
        readonly Sprite: typeof import("./gfx/sprite");
        readonly SpritesGroup: typeof import("./gfx/sprites_group");
        readonly Matrix: typeof import("./gfx/matrix");
        readonly Vertex: typeof import("./gfx/vertex");
        readonly TextAlignments: {
            Left: string;
            Right: string;
            Center: string;
        };
        readonly TextAlignment: {
            Left: string;
            Right: string;
            Center: string;
        };
        _TextAlignment_dep: boolean;
        createCamera(withViewport: boolean): import("./gfx/camera");
        setCameraOrthographic(offset: import("./utils/vector2")): import("./gfx/camera");
        createEffect(type: Class): typeof import("./gfx/effects/effect");
        maximizeCanvasSize(limitToParent: boolean, allowOddNumbers: boolean): void;
        setRenderTarget(texture: import("./assets/texture_asset") | import("./assets/texture_asset")[], keepCamera?: boolean): void;
        useEffect(effect: typeof import("./gfx/effects/effect")): void;
        setResolution(width: number, height: number, updateCanvasStyle: boolean): void;
        resetCamera(): void;
        applyCamera(camera: import("./gfx/camera")): void;
        getRenderingRegion(includeOffset: boolean): import("./utils/rectangle");
        getRenderingSize(): import("./utils/vector2");
        getCanvasSize(): import("./utils/vector2");
        setup(): any;
        buildText(fontTexture: import("./assets/font_texture_asset"), text: string, fontSize?: number, color?: import("./utils/color") | import("./utils/color")[], alignment?: string, offset?: import("./utils/vector2"), marginFactor?: import("./utils/vector2")): import("./gfx/sprites_group");
        drawGroup(group: import("./gfx/sprites_group"), cullOutOfScreen: boolean): void;
        drawSprite(sprite: import("./gfx/sprite")): void;
        cover(texture: import("./assets/texture_asset"), destRect: import("./utils/vector2") | import("./utils/rectangle"), sourceRect?: import("./utils/rectangle"), color: import("./utils/color") | import("./utils/color")[], blendMode?: string): void;
        draw(texture: import("./assets/texture_asset"), position: import("./utils/vector2") | import("./utils/vector3"), size: number | import("./utils/vector2") | import("./utils/vector3"), sourceRect: import("./utils/rectangle"), color: import("./utils/color") | import("./utils/color")[], blendMode?: string, rotation?: number, origin?: import("./utils/vector2"), skew?: import("./utils/vector2")): void;
        drawQuadFromVertices(texture: import("./assets/texture_asset"), vertices: import("./gfx/vertex")[], blendMode?: string): void;
        fillRect(destRect: import("./utils/rectangle"), color: import("./utils/color") | import("./utils/color")[], blend?: string, rotation?: number): void;
        fillRects(destRects: import("./utils/rectangle")[], colors: import("./utils/color") | import("./utils/color")[], blend?: string, rotation?: number | number[]): void;
        outlineRect(destRect: import("./utils/rectangle"), color: import("./utils/color"), blend?: string, rotation?: number): void;
        outlineCircle(circle: import("./utils/circle"), color: import("./utils/color"), blend?: string, lineAmount?: number): void;
        fillCircle(circle: import("./utils/circle"), color: import("./utils/color"), blend?: string, lineAmount?: number): void;
        fillCircles(circles: import("./utils/circle")[], colors: import("./utils/color") | import("./utils/color")[], blend?: string, lineAmount?: number): void;
        drawLine(startPoint: import("./utils/vector2"), endPoint: import("./utils/vector2"), color: import("./utils/color"), blendMode?: string): void;
        drawLinesStrip(points: import("./utils/vector2")[], colors: import("./utils/color") | import("./utils/color")[], blendMode?: string, looped?: boolean): void;
        drawLines(points: import("./utils/vector2")[], colors: import("./utils/color") | import("./utils/color")[], blendMode?: string): void;
        drawPoint(point: import("./utils/vector2"), color: import("./utils/color"), blendMode?: string): void;
        drawPoints(points: import("./utils/vector2")[], colors: import("./utils/color") | import("./utils/color")[], blendMode?: string): void;
        centerCanvas(): void;
        inScreen(shape: any): boolean;
        centerCamera(position: import("./utils/vector2"), useCanvasSize: boolean): void;
        _fillShapesBuffer(points: any, colors: any, blendMode: any, onReady: any, isStrip: any, groupsSize: any): void;
        _drawBatch(group: import("./gfx/sprites_group"), cullOutOfScreen: boolean): void;
        _setActiveTexture(texture: import("./assets/texture_asset")): void;
        readonly BlendModes: {
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
        readonly TextureWrapModes: {
            Clamp: string;
            Repeat: string;
            RepeatMirrored: string;
        };
        readonly TextureFilterModes: {
            Nearest: string;
            Linear: string;
            NearestMipmapNearest: string;
            LinearMipmapNearest: string;
            NearestMipmapLinear: string;
            LinearMipmapLinear: string;
        };
        readonly drawCallsCount: number;
        readonly quadsDrawCount: number;
        clear(color?: import("./utils/color")): void;
        _setTextureFilter(filter: string): void;
        _setTextureWrapMode(wrapX: string, wrapY: string): void;
        _setBlendMode(blendMode: string): void;
        presentBufferedData(): void;
        __startDrawingSprites(activeEffect: any, transform: any): void;
        __finishDrawingSprites(): void;
        startFrame(): void;
        endFrame(): void;
        destroy(): void;
    };
    /**
     * Input manager.
     */
    input: {
        _callbacks: {
            mousedown: (event: any) => void;
            mouseup: (event: any) => void;
            mousemove: (event: any) => void;
            keydown: (event: any) => void;
            keyup: (event: any) => void;
            blur: (event: any) => void;
            wheel: (event: any) => void;
            touchstart: (event: any) => void;
            touchend: (event: any) => void;
            touchmove: (event: any) => void;
            contextmenu: (event: any) => void;
        };
        _targetElement: Window & typeof globalThis;
        MouseButtons: {
            left: number;
            middle: number;
            right: number;
        };
        KeyboardKeys: {
            backspace: number;
            tab: number;
            enter: number;
            shift: number;
            ctrl: number;
            alt: number;
            break: number;
            caps_lock: number;
            escape: number;
            page_up: number;
            page_down: number;
            end: number;
            home: number;
            left: number;
            up: number;
            right: number;
            down: number;
            insert: number;
            delete: number;
            space: number;
            n0: number;
            n1: number;
            n2: number;
            n3: number;
            n4: number;
            n5: number;
            n6: number;
            n7: number;
            n8: number;
            n9: number;
            a: number;
            b: number;
            c: number;
            d: number;
            e: number;
            f: number;
            g: number;
            h: number;
            i: number;
            j: number;
            k: number;
            l: number;
            m: number;
            n: number;
            o: number;
            p: number;
            q: number;
            /**
             * Create the Shaku main object.
             */
            r: number;
            s: number;
            t: number;
            u: number;
            v: number;
            w: number;
            x: number; /**
             * Different utilities and framework objects, like vectors, rectangles, colors, etc.
             */
            y: number;
            z: number;
            left_window_key: number;
            right_window_key: number;
            select_key: number;
            numpad_0: number;
            numpad_1: number;
            numpad_2: number; /**
             * Sound effects and music manager.
             */
            numpad_3: number;
            numpad_4: number;
            numpad_5: number;
            numpad_6: number;
            numpad_7: number; /**
             * Graphics manager.
             */
            numpad_8: number;
            numpad_9: number;
            multiply: number;
            add: number;
            /**
             * Input manager.
             */
            subtract: number;
            decimal_point: number;
            divide: number;
            f1: number;
            f2: number; /**
             * Assets manager.
             */
            f3: number;
            f4: number;
            f5: number;
            f6: number;
            f7: number;
            f8: number; /**
             * Collision detection manager.
             */
            f9: number;
            f10: number;
            f11: number;
            f12: number;
            numlock: number;
            scroll_lock: number;
            /**
             * If true, will pause the updates and drawing calls when window is not focused.
             * Will also not update elapsed time.
             */
            semicolon: number;
            equal_sign: number;
            plus: number;
            comma: number;
            dash: number;
            minus: number;
            period: number;
            forward_slash: number;
            grave_accent: number;
            open_bracket: number;
            back_slash: number;
            close_braket: number;
            single_quote: number;
        };
        preventDefaults: boolean;
        enableMouseDeltaWhileMouseWheelDown: boolean; /**
         * Sound effects and music manager.
         */
        disableContextMenu: boolean;
        resetOnFocusLoss: boolean;
        /**
         * Assets manager.
         */
        setup(): any;
        startFrame(): void;
        destroy(): void;
        setTargetElement(element: Element | (() => Element)): void;
        _resetAll(): void;
        _mousePos: import("./utils/vector2");
        _mousePrevPos: import("./utils/vector2");
        _mouseState: {};
        _mousePrevState: {};
        _mouseWheel: any;
        _keyboardState: {};
        _keyboardPrevState: {};
        _touchStarted: boolean;
        readonly mousePosition: import("./utils/vector2");
        readonly prevMousePosition: import("./utils/vector2");
        readonly mouseDelta: import("./utils/vector2");
        readonly mouseMoving: boolean;
        mousePressed(button?: number): boolean;
        mouseDown(button?: number): boolean;
        mouseUp(button?: number): boolean;
        mouseReleased(button?: number): boolean;
        keyDown(key: number): boolean;
        keyUp(key: number): boolean;
        keyReleased(key: any): boolean;
        keyPressed(key: number): boolean;
        readonly shiftDown: boolean;
        readonly ctrlDown: boolean;
        readonly altDown: boolean;
        readonly anyKeyPressed: boolean;
        readonly anyKeyDown: boolean;
        readonly anyMouseButtonPressed: boolean;
        readonly anyMouseButtonDown: boolean;
        _getValueWithCode(code: string, mouseCheck: Function, keyboardCheck: Function): any;
        down(code: string | string[]): boolean;
        released(code: string | string[]): boolean;
        pressed(code: string | string[]): boolean;
        readonly mouseWheelSign: number;
        readonly mouseWheel: number;
        endFrame(): void;
        _getKeyboardKeyCode(event: any): any;
        _onBlur(event: any): void;
        _onMouseWheel(event: any): void;
        _onKeyDown(event: any): void;
        _onKeyUp(event: any): void;
        _onTouchStart(event: any): void;
        _onMouseDown(event: any): void;
        _onMouseUp(event: any): void;
        _onTouchMove(event: any): void;
        _onMouseMove(event: any): void;
        _normalizeMousePos(): void;
        _getEvent(event: any): any;
    };
    /**
     * Assets manager.
     */
    assets: {
        _loaded: {};
        _waitingAssets: any;
        _failedAssets: any; /**
         * Create the Shaku main object.
         */
        _successfulLoadedAssetsCount: number;
        root: string;
        suffix: string;
        _wrapUrl(url: string): string;
        readonly pendingAssets: string[];
        readonly failedAssets: string[];
        waitForAll(): Promise<any>;
        setup(): any;
        startFrame(): void;
        endFrame(): void;
        _getFromCache(url: string, type: any): any;
        _loadAndCacheAsset(newAsset: import("./assets/asset"), params: any): Promise<any>;
        getCached(url: string): import("./assets/asset");
        _loadAssetType(url: any, typeClass: any, params: any): any;
        _createAsset(name: any, classType: any, initMethod: any): any;
        loadSound(url: string): Promise<import("./assets/sound_asset")>;
        loadTexture(url: string, params?: any): Promise<import("./assets/texture_asset")>;
        createRenderTarget(name: string, width: number, height: number, channels?: number): Promise<import("./assets/texture_asset")>;
        loadFontTexture(url: string, params: any): Promise<import("./assets/font_texture_asset")>;
        loadMsdfFontTexture(url: string, params?: any): Promise<import("./assets/msdf_font_texture_asset")>;
        loadJson(url: string): Promise<import("./assets/json_asset")>;
        createJson(name: string, data: any): Promise<import("./assets/json_asset")>;
        loadBinary(url: string): Promise<import("./assets/binary_asset")>;
        createBinary(name: string, data: number[] | Uint8Array): Promise<import("./assets/binary_asset")>;
        free(url: string): void;
        clearCache(): void;
        destroy(): void;
    };
    /**
     * Collision detection manager.
     */
    collision: {
        resolver: import("./collision/resolver");
        setup(): any;
        createWorld(gridCellSize: number | import("./utils/vector2")): import("./collision/collision_world");
        readonly RectangleShape: typeof import("./collision/shapes/rectangle");
        readonly PointShape: typeof import("./collision/shapes/point");
        readonly CircleShape: typeof import("./collision/shapes/circle");
        readonly LinesShape: typeof import("./collision/shapes/lines");
        readonly TilemapShape: typeof import("./collision/shapes/tilemap");
        startFrame(): void;
        endFrame(): void;
        destroy(): void;
    };
    /**
     * If true, will pause the updates and drawing calls when window is not focused.
     * Will also not update elapsed time.
     */
    pauseWhenNotFocused: boolean;
    /**
     * Set to true to completely pause Shaku (will skip updates, drawing, and time counting).
     */
    paused: boolean;
    /**
     * Set to true to pause just the game time.
     * This will not pause real-life time. If you need real-life time stop please use the Python package.
     */
    pauseTime: boolean;
    _managersStarted: boolean;
    _wasPaused: boolean;
    /**
     * Method to select managers to use + initialize them.
     * @param {Array<IManager>=} managers Array with list of managers to use or null to use all.
     * @returns {Promise} promise to resolve when finish initialization.
     */
    init(managers?: Array<IManager> | undefined): Promise<any>;
    /**
     * Destroy all managers
     */
    destroy(): void;
    /**
     * Get if the Shaku is currently paused.
     */
    get isPaused(): boolean;
    /**
     * Start frame (update all managers).
     */
    startFrame(): void;
    _gameTime: GameTime;
    /**
     * End frame (update all managers).
     */
    endFrame(): void;
    /**
     * Measure FPS and averege update times.
     * @private
     */
    private _updateFpsAndTimeStats;
    /**
     * Make Shaku run in silent mode, without logs.
     * You can call this before init.
     */
    silent(): void;
    /**
     * Set logger to throw an error every time a log message with severity higher than warning is written.
     * You can call this before init.
     * @param {Boolean} enable Set to true to throw error on warnings.
     */
    throwErrorOnWarnings(enable: boolean): void;
    /**
     * Get current frame game time.
     * Only valid between startFrame() and endFrame().
     * @returns {GameTime} Current frame's gametime.
     */
    get gameTime(): GameTime;
    /**
     * Get Shaku's version.
     * @returns {String} Shaku's version.
     */
    get version(): string;
    /**
     * Return current FPS count.
     * Note: will return 0 until at least one second have passed.
     * @returns {Number} FPS count.
     */
    getFpsCount(): number;
    /**
     * Get how long on average it takes to complete a game frame.
     * @returns {Number} Average time, in milliseconds, it takes to complete a game frame.
     */
    getAverageFrameTime(): number;
    /**
     * Request animation frame with fallbacks.
     * @param {Function} callback Method to invoke in next animation frame.
     * @returns {Number} Handle for cancellation.
     */
    requestAnimationFrame(callback: Function): number;
    /**
     * Cancel animation frame with fallbacks.
     * @param {Number} id Request handle.
     */
    cancelAnimationFrame(id: number): any;
    /**
     * Set the logger writer class (will replace the default console output).
     * @param {*} loggerHandler New logger handler (must implement trace, debug, info, warn, error methods).
     */
    setLogger(loggerHandler: any): void;
    /**
     * Get / create a custom logger.
     */
    getLogger(name: any): {
        _nameHeader: string;
        _throwErrors: boolean;
        trace(msg: string): void;
        debug(msg: string): void;
        info(msg: string): void;
        warn(msg: string): void;
        error(msg: string): void;
        throwErrorOnWarnings(enable: boolean): void;
    };
}
import GameTime = require("./utils/game_time");
import IManager = require("./manager");
//# sourceMappingURL=shaku.d.ts.map