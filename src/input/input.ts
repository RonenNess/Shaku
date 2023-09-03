import { IManager, LoggerFactory, Vector2 } from "../utils";
import { Gamepad } from "./gamepad";
import { KeyboardKeys, MouseButtons } from "./key_codes";

const _logger = LoggerFactory.getLogger("input"); // TODO

// get timestamp
function timestamp(): number {
	return (new Date()).getTime();
}

// touch key code
const _touchKeyCode = "touch";

/** All the ways a user can specify an input */
type InputCode = KeyboardKeys | MouseButtons | string;

/**
 * Input manager.
 * Used to receive input from keyboard and mouse.
 *
 * To access the Input manager use `Shaku.input`.
 */
export class Input implements IManager {
	/**
	 * If true, will prevent default input events by calling preventDefault().
	 */
	public preventDefaults: boolean;

	/**
	 * By default, when holding wheel button down browsers will turn into special page scroll mode and will not emit mouse move events.
	 * if this property is set to true (default), the Input manager will prevent this behavior, so we could still get mouse delta while mouse wheel is held down.
	 */
	public disableMouseWheelAutomaticScrolling: boolean;

	/**
	 * If true (default), will disable the context menu (what typically opens when you right click the page).
	 */
	public disableContextMenu: boolean;

	/**
	 * If true (default), will treat touch events (touch start / touch end / touch move) as if the user clicked and moved a mouse.
	 */
	public delegateTouchInputToMouse: boolean;

	/**
	 * If true (default), will delegate events from mapped gamepads to custom keys.
	 * This will add the following codes to all basic query methods (down, pressed, released, doublePressed, doubleReleased):
	 * - gamepadX_top: state of arrow keys top key (left buttons).
	 * - gamepadX_bottom: state of arrow keys bottom key (left buttons).
	 * - gamepadX_left: state of arrow keys left key (left buttons).
	 * - gamepadX_right: state of arrow keys right key (left buttons).
	 * - gamepadX_leftStickUp: true if left stick points directly up.
	 * - gamepadX_leftStickDown: true if left stick points directly down.
	 * - gamepadX_leftStickLeft: true if left stick points directly left.
	 * - gamepadX_leftStickRight: true if left stick points directly right.
	 * - gamepadX_rightStickUp: true if right stick points directly up.
	 * - gamepadX_rightStickDown: true if right stick points directly down.
	 * - gamepadX_rightStickLeft: true if right stick points directly left.
	 * - gamepadX_rightStickRight: true if right stick points directly right.
	 * - gamepadX_a: state of A key (from right buttons).
	 * - gamepadX_b: state of B key (from right buttons).
	 * - gamepadX_x: state of X key (from right buttons).
	 * - gamepadX_y: state of Y key (from right buttons).
	 * - gamepadX_frontTopLeft: state of the front top-left button.
	 * - gamepadX_frontTopRight: state of the front top-right button.
	 * - gamepadX_frontBottomLeft: state of the front bottom-left button.
	 * - gamepadX_frontBottomRight: state of the front bottom-right button.
	 * Where X in `gamepad` is the gamepad index: gamepad0, gamepad1, gamepad2..
	 */
	public delegateGamepadInputToKeys: boolean;

	/**
	 * Default time, in milliseconds, to consider two consecutive key presses as a double-press.
	 */
	public defaultDoublePressInterval: number;

	/**
	 * If true (default), will reset all states if the window loses focus.
	 */
	public resetOnFocusLoss: boolean;

	private callbacks: {
		"mousedown": (event: MouseEvent) => void,
		"mouseup": (event: MouseEvent) => void,
		"mousemove": (event: MouseEvent) => void,
		"keydown": (event: KeyboardEvent) => void,
		"keyup": (event: KeyboardEvent) => void,
		"blur": (event: FocusEvent) => void,
		"wheel": (event: WheelEvent) => void,
		"touchstart": (event: TouchEvent) => void,
		"touchend": (event: TouchEvent) => void,
		"touchmove": (event: TouchEvent) => void,
		"contextmenu": (event: MouseEvent) => void,
	} | null;
	private _targetElement: HTMLElement | Window | (() => HTMLElement);
	private _defaultGamepad!: globalThis.Gamepad | null;

	private _defaultGamepadIndex!: number;

	private mousePos!: Vector2;
	private mouseState!: Map<MouseButtons, boolean>;
	private _mouseWheel!: number;
	private mousePrevPos?: Vector2;
	private _touchPosition!: Vector2;

	private isTouching!: boolean;
	private _touchStarted!: boolean;
	private _touchEnded!: boolean;
	private keyboardState!: Map<KeyboardKeys, boolean>;
	private keyboardPressed!: Map<KeyboardKeys, boolean>;
	private keyboardReleased!: Map<KeyboardKeys, boolean>;
	private _mousePressed!: Map<MouseButtons, boolean>;
	private _mouseReleased!: Map<MouseButtons, boolean>;

	private customStates!: Map<string, boolean>;
	private customPressed!: Map<string, boolean>;
	private customReleased!: Map<string, boolean>;
	private lastCustomReleasedTime!: Map<string, number>;
	private lastCustomPressedTime!: Map<string, number>;
	private prevLastCustomReleasedTime!: Map<string, number>;
	private prevLastCustomPressedTime!: Map<string, number>;

	private lastMouseReleasedTime!: Map<MouseButtons, number>;
	private lastKeyReleasedTime!: Map<KeyboardKeys, number>;
	private lastTouchReleasedTime!: number;
	private lastMousePressedTime!: Map<MouseButtons, number>;
	private lastKeyPressedTime!: Map<KeyboardKeys, number>;
	private lastTouchPressedTime!: number;
	private prevLastMouseReleasedTime!: Map<MouseButtons, number>;
	private prevLastKeyReleasedTime!: Map<KeyboardKeys, number>;
	private prevLastTouchReleasedTime!: number;
	private prevLastMousePressedTime!: Map<MouseButtons, number>;
	private prevLastKeyPressedTime!: Map<KeyboardKeys, number>;
	private prevLastTouchPressedTime!: number;

	private gamepadsData!: (globalThis.Gamepad | null)[];
	private queriedGamepadStates!: Record<number, Gamepad>;

	private customKeys: Set<string>;

	/**
	 * Create the manager.
	 */
	public constructor() {

		// callbacks and target we listen to input on
		this.callbacks = null;
		this._targetElement = window;

		this.preventDefaults = false;
		this.disableMouseWheelAutomaticScrolling = true;
		this.disableContextMenu = true;
		this.delegateTouchInputToMouse = true;
		this.delegateGamepadInputToKeys = true;
		this.resetOnFocusLoss = true;
		this.defaultDoublePressInterval = 250;

		// custom keys set
		this.customKeys = new Set();

		// set base state members
		this.#_resetAll();
	}

	/**
	 * Get the Mouse Buttons enum.
	 * @see MouseButtons
	 */
	public get MouseButtons(): typeof MouseButtons {
		return MouseButtons;
	}

	/**
	 * Get the Keyboard Buttons enum.
	 * @see KeyboardKeys
	 */
	public get KeyboardKeys(): typeof KeyboardKeys {
		return KeyboardKeys;
	}

	/**
	 * Return the string code to use in order to get touch events.
	 * @returns Key code to use for touch events.
	 */
	public get TouchKeyCode(): string {
		return _touchKeyCode;
	}

	/**
	 * @inheritdoc
	 * @private
	 **/
	public setup(): Promise<void> {
		return new Promise<void>((resolve, reject) => {

			_logger.info("Setup input manager..");

			// if target element is a method, invoke it
			if(typeof this._targetElement === "function") {
				this._targetElement = this._targetElement();
				if(!this._targetElement) {
					throw new Error("Input target element was set to be a method, but the returned value was invalid!");
				}
			}

			// get element to attach to
			const element = this._targetElement;

			// to make sure keyboard input would work if provided with canvas entity
			if((element instanceof HTMLCanvasElement) && (element.tabIndex === -1 || element.tabIndex === undefined)) element.tabIndex = 1000;

			// focus on target element
			window.setTimeout(() => element.focus(), 0);

			// set all the events to listen to
			const _this = this;
			this.callbacks = {
				mousedown: function(event) { _this._onMouseDown(event); if(_this.preventDefaults) event.preventDefault(); },
				mouseup: function(event) { _this._onMouseUp(event); if(_this.preventDefaults) event.preventDefault(); },
				mousemove: function(event) { _this._onMouseMove(event); if(_this.preventDefaults) event.preventDefault(); },
				keydown: function(event) { _this._onKeyDown(event); if(_this.preventDefaults) event.preventDefault(); },
				keyup: function(event) { _this._onKeyUp(event); if(_this.preventDefaults) event.preventDefault(); },
				blur: function(event) { _this._onBlur(event); if(_this.preventDefaults) event.preventDefault(); },
				wheel: function(event) { _this._onMouseWheel(event); if(_this.preventDefaults) event.preventDefault(); },
				touchstart: function(event) { _this._onTouchStart(event); if(_this.preventDefaults) event.preventDefault(); },
				touchend: function(event) { _this._onTouchEnd(event); if(_this.preventDefaults) event.preventDefault(); },
				touchmove: function(event) { _this._onTouchMove(event); if(_this.preventDefaults) event.preventDefault(); },
				contextmenu: function(event) { if(_this.disableContextMenu) { event.preventDefault(); } },
			};

			// reset all data to init initial state
			this.#_resetAll(false);

			// register all callbacks
			for(const event in this.callbacks) {
				element.addEventListener(event, this.callbacks[event as keyof typeof this.callbacks] as (ev: Event) => void, false);
			}

			// if we have a specific element, still capture mouse release outside of it
			if(element !== window) {
				window.addEventListener("mouseup", this.callbacks["mouseup"], false);
				window.addEventListener("touchend", this.callbacks["touchend"], false);
			}

			// ready!
			resolve();
		});
	}

	/**
	 * @inheritdoc
	 **/
	public startFrame(): void {
		// query gamepads
		const prevGamepadData = this.gamepadsData || [];
		const prevDefaultGamepadId = (this._defaultGamepad || { id: "null" }).id;
		this.gamepadsData = navigator.getGamepads();

		// get default gamepad and check for changes
		this._defaultGamepad = null;
		let i = 0;
		for(const gp of this.gamepadsData) {
			const newId = (gp || { id: "null" }).id;
			const prevId = (prevGamepadData[i] || { id: "null" }).id;
			if(newId !== prevId) {
				if(newId !== "null") {
					_logger.info(`Gamepad ${i} connected: ${newId}.`);
				}
				else if(newId === "null") {
					_logger.info(`Gamepad ${i} disconnected: ${prevId}.`);
				}
			}
			if(gp && !this._defaultGamepad) {
				this._defaultGamepad = gp;
				this._defaultGamepadIndex = i;
			}
			i++;
		}

		// changed default gamepad?
		const newDefaultGamepadId = (this._defaultGamepad || { id: "null" }).id;
		if(newDefaultGamepadId !== prevDefaultGamepadId) {
			_logger.info(`Default gamepad changed from "${prevDefaultGamepadId}" to "${newDefaultGamepadId}".`);
		}

		// reset queried gamepad states
		this.queriedGamepadStates = {};

		// delegate gamepad keys
		if(this.delegateGamepadInputToKeys) {
			for(let i = 0; i < 4; ++i) {

				// get current gamepad
				const gp = this.gamepad(i);

				// not set or not mapped? reset all values to false and continue
				if(!gp || !gp.isMapped) {
					this.setCustomState(`gamepad${i}_top`, false);
					this.setCustomState(`gamepad${i}_bottom`, false);
					this.setCustomState(`gamepad${i}_left`, false);
					this.setCustomState(`gamepad${i}_right`, false);
					this.setCustomState(`gamepad${i}_y`, false);
					this.setCustomState(`gamepad${i}_a`, false);
					this.setCustomState(`gamepad${i}_x`, false);
					this.setCustomState(`gamepad${i}_b`, false);
					this.setCustomState(`gamepad${i}_frontTopLeft`, false);
					this.setCustomState(`gamepad${i}_frontTopRight`, false);
					this.setCustomState(`gamepad${i}_frontBottomLeft`, false);
					this.setCustomState(`gamepad${i}_frontBottomRight`, false);
					this.setCustomState(`gamepad${i}_leftStickUp`, false);
					this.setCustomState(`gamepad${i}_leftStickDown`, false);
					this.setCustomState(`gamepad${i}_leftStickLeft`, false);
					this.setCustomState(`gamepad${i}_leftStickRight`, false);
					this.setCustomState(`gamepad${i}_rightStickUp`, false);
					this.setCustomState(`gamepad${i}_rightStickDown`, false);
					this.setCustomState(`gamepad${i}_rightStickLeft`, false);
					this.setCustomState(`gamepad${i}_rightStickRight`, false);
					continue;
				}

				// set actual values

				this.setCustomState(`gamepad${i}_top`, gp.leftButtons.top);
				this.setCustomState(`gamepad${i}_bottom`, gp.leftButtons.bottom);
				this.setCustomState(`gamepad${i}_left`, gp.leftButtons.left);
				this.setCustomState(`gamepad${i}_right`, gp.leftButtons.right);

				this.setCustomState(`gamepad${i}_y`, gp.rightButtons.top);
				this.setCustomState(`gamepad${i}_a`, gp.rightButtons.bottom);
				this.setCustomState(`gamepad${i}_x`, gp.rightButtons.left);
				this.setCustomState(`gamepad${i}_b`, gp.rightButtons.right);

				this.setCustomState(`gamepad${i}_frontTopLeft`, gp.frontButtons.topLeft);
				this.setCustomState(`gamepad${i}_frontTopRight`, gp.frontButtons.topRight);
				this.setCustomState(`gamepad${i}_frontBottomLeft`, gp.frontButtons.bottomLeft);
				this.setCustomState(`gamepad${i}_frontBottomRight`, gp.frontButtons.bottomRight);

				this.setCustomState(`gamepad${i}_leftStickUp`, gp.leftStick.y < -0.8);
				this.setCustomState(`gamepad${i}_leftStickDown`, gp.leftStick.y > 0.8);
				this.setCustomState(`gamepad${i}_leftStickLeft`, gp.leftStick.x < -0.8);
				this.setCustomState(`gamepad${i}_leftStickRight`, gp.leftStick.x > 0.8);

				this.setCustomState(`gamepad${i}_rightStickUp`, gp.rightStick.y < -0.8);
				this.setCustomState(`gamepad${i}_rightStickDown`, gp.rightStick.y > 0.8);
				this.setCustomState(`gamepad${i}_rightStickLeft`, gp.rightStick.x < -0.8);
				this.setCustomState(`gamepad${i}_rightStickRight`, gp.rightStick.x > 0.8);
			}
		}
	}

	/**
	 * @inheritdoc
	 * @private
	 **/
	public destroy(): void {
		// unregister all callbacks
		if(this.callbacks) {
			const element = this._targetElement as (HTMLElement | Window);

			for(const event in this.callbacks) {
				element.removeEventListener(event, this.callbacks[event as keyof typeof this.callbacks] as (ev: Event) => void);
			}

			if(element !== window) {
				window.removeEventListener("mouseup", this.callbacks["mouseup"], false);
				window.removeEventListener("touchend", this.callbacks["touchend"], false);
			}

			this.callbacks = null;
		}
	}

	/**
	 * Set the target element to attach input to. If not called, will just use the entire document.
	 * Must be called *before* initializing Shaku. This can also be a method to invoke while initializing.
	 * @example
	 * // the following will use whatever canvas the gfx manager uses as input element.
	 * // this means mouse offset will also be relative to this element.
	 * Shaku.input.setTargetElement(() => Shaku.gfx.canvas);
	 * @param {HTMLElement | elementCallback} element Element to attach input to.
	 */
	public setTargetElement(element: HTMLElement | (() => HTMLElement)): void {
		if(this.callbacks) throw new Error("'setTargetElement() must be called before initializing the input manager!");
		this._targetElement = element;
	}

	/**
	 * Reset all internal data and states.
	 * @param keepMousePosition If true, will not reset mouse position.
	 */
	#_resetAll(keepMousePosition?: boolean) {
		// mouse states
		if(!keepMousePosition) {
			this.mousePos = new Vector2();
			this.mousePrevPos = new Vector2();
		}
		this.mouseState = new Map();
		this._mouseWheel = 0;

		// touching states
		if(!keepMousePosition) {
			this._touchPosition = new Vector2();
		}
		this.isTouching = false;
		this._touchStarted = false;
		this._touchEnded = false;

		// keyboard keys
		this.keyboardState = new Map();

		// reset pressed / release events
		this.keyboardPressed = new Map();
		this.keyboardReleased = new Map();
		this._mousePressed = new Map();
		this._mouseReleased = new Map();

		// for custom states
		this.customStates = new Map();
		this.customPressed = new Map();
		this.customReleased = new Map();
		this.lastCustomReleasedTime = new Map();
		this.lastCustomPressedTime = new Map();
		this.prevLastCustomReleasedTime = new Map();
		this.prevLastCustomPressedTime = new Map();

		// for last release time and to count double click / double pressed events
		this.lastMouseReleasedTime = new Map();
		this.lastKeyReleasedTime = new Map();
		this.lastTouchReleasedTime = 0;
		this.lastMousePressedTime = new Map();
		this.lastKeyPressedTime = new Map();
		this.lastTouchPressedTime = 0;
		this.prevLastMouseReleasedTime = new Map();
		this.prevLastKeyReleasedTime = new Map();
		this.prevLastTouchReleasedTime = 0;
		this.prevLastMousePressedTime = new Map();
		this.prevLastKeyPressedTime = new Map();
		this.prevLastTouchPressedTime = 0;

		// currently connected gamepads data
		this._defaultGamepad = null;
		this._defaultGamepadIndex = 0;
		this.gamepadsData = [];
		this.queriedGamepadStates = {};
	}

	/**
	 * Get Gamepad current states, or null if not connected.
	 * Note: this object does not update itself, you'll need to query it again every frame.
	 * @param index Gamepad index or undefined for first connected device.
	 * @returns Gamepad current state.
	 */
	public gamepad(index = this._defaultGamepadIndex): Gamepad | null {
		// try to get cached value
		let cached = this.queriedGamepadStates[index];

		// not found? create
		if(!cached) {
			const gp = this.gamepadsData[index];
			if(!gp) return null;
			this.queriedGamepadStates[index] = cached = new Gamepad(gp);
		}

		// return gamepad state
		return cached;
	}

	/**
	 * Get gamepad id, or null if not connected to this slot.
	 * @param index Gamepad index or undefined for first connected device.
	 * @returns Gamepad id or null.
	 */
	public gamepadId(index?: number): string | null {
		return this.gamepadIds()[index || 0] || null;
	}

	/**
	 * Return a list with connected devices ids.
	 * @returns List of connected devices ids.
	 */
	public gamepadIds(): string[] {
		const ret = [];
		for(const gp of this.gamepadsData) {
			if(gp) ret.push(gp.id);
		}
		return ret;
	}

	/**
	 * Get touch screen touching position.
	 * Note: if not currently touching, will return last known position.
	 * @returns Touch position.
	 */
	public get touchPosition(): Vector2 {
		return this._touchPosition.clone();
	}

	/**
	 * Get if currently touching a touch screen.
	 * @returns True if currently touching the screen.
	 */
	public get touching(): boolean {
		return this.isTouching;
	}

	/**
	 * Get if started touching a touch screen in current frame.
	 * @returns True if started touching the screen now.
	 */
	public get touchStarted(): boolean {
		return this._touchStarted;
	}

	/**
	 * Get if stopped touching a touch screen in current frame.
	 * @returns True if stopped touching the screen now.
	 */
	public get touchEnded(): boolean {
		return this._touchEnded;
	}

	/**
	 * Set a custom key code state you can later use with all the built in methods (down / pressed / released / doublePressed, etc.)
	 * For example, lets say you want to implement a simulated keyboard and use it alongside the real keyboard.
	 * When your simulated keyboard space key is pressed, you can call `setCustomState("sim_space", true)`. When released, call `setCustomState("sim_space", false)`.
	 * Now you can use `Shaku.input.down(["space", "sim_space"])` to check if either a real space or simulated space is pressed down.
	 * @param {String} code Code to set state for.
	 * @param {Boolean|null} value Current value to set, or null to remove custom key.
	 */
	public setCustomState(code: string, value: boolean | null) {
		// remove custom value
		if(value === null) {
			this.customKeys.delete(code);
			this.customPressed.delete(code);
			this.customReleased.delete(code);
			this.customStates.delete(code);
			return;
		}
		// update custom codes
		else this.customKeys.add(code);

		// set state
		value = Boolean(value);
		const prev = Boolean(this.customStates.get(code));
		this.customStates.set(code, value);

		// set defaults
		if(this.customPressed.get(code) === undefined) this.customPressed.set(code, false);
		if(this.customReleased.get(code) === undefined) this.customReleased.set(code, false);

		// pressed now?
		if(!prev && value) {
			this.customPressed.set(code, true);
			this.prevLastCustomPressedTime.set(code, this.lastCustomPressedTime.get(code));
			this.lastCustomPressedTime.set(code, timestamp());
		}

		// released now?
		if(prev && !value) {
			this.customReleased.set(code, true);
			this.prevLastCustomReleasedTime.set(code, this.lastCustomReleasedTime.get(code));
			this.lastCustomReleasedTime.set(code, timestamp());
		}
	}

	/**
	 * Get mouse position.
	 * @returns Mouse position.
	 */
	public get mousePosition(): Vector2 {
		return this.mousePos.clone();
	}

	/**
	 * Get mouse previous position (before the last endFrame() call).
	 * @returns Mouse position in previous frame.
	 */
	public get prevMousePosition(): Vector2 {
		return (this.mousePrevPos || this.mousePos).clone();
	}

	/**
	 * Get mouse movement since last endFrame() call.
	 * @returns Mouse change since last frame.
	 */
	public get mouseDelta(): Vector2 {
		// no previous position? return 0,0.
		if(!this.mousePrevPos) {
			return Vector2.zero();
		}

		// return mouse delta
		return new Vector2(this.mousePos.x - this.mousePrevPos.x, this.mousePos.y - this.mousePrevPos.y);
	}

	/**
	 * Get if mouse is currently moving.
	 * @returns True if mouse moved since last frame, false otherwise.
	 */
	public get mouseMoving(): boolean {
		return (this.mousePrevPos && !this.mousePrevPos.equals(this.mousePos)) || false;
	}

	/**
	 * Get if mouse button was pressed this frame.
	 * @param button Button code (defaults to MouseButtons.left).
	 * @returns True if mouse button is currently down, but was up in previous frame.
	 */
	public mousePressed(button = MouseButtons.LEFT): boolean {
		return Boolean(this._mousePressed.get(button));
	}

	/**
	 * Get if mouse button is currently pressed.
	 * @param button Button code (defaults to MouseButtons.left).
	 * @returns true if mouse button is currently down, false otherwise.
	 */
	public mouseDown(button = MouseButtons.LEFT): boolean {
		return Boolean(this.mouseState.get(button));
	}

	/**
	 * Get if mouse button is currently not down.
	 * @param button Button code (defaults to MouseButtons.left).
	 * @returns true if mouse button is currently up, false otherwise.
	 */
	public mouseUp(button = MouseButtons.LEFT): boolean {
		return Boolean(!this.mouseDown(button));
	}

	/**
	 * Get if mouse button was released in current frame.
	 * @param button Button code (defaults to MouseButtons.left).
	 * @returns True if mouse was down last frame, but released in current frame.
	 */
	public mouseReleased(button = MouseButtons.LEFT): boolean {
		return Boolean(this._mouseReleased.get(button));
	}

	/**
	 * Get if keyboard key is currently pressed down.
	 * @param key Keyboard key code.
	 * @returns True if keyboard key is currently down, false otherwise.
	 */
	public keyDown(key: KeyboardKeys): boolean {
		// TODO IMPORTANT: key is never a KeyboardKey, instead it's a string
		return Boolean(this.keyboardState.get(key));
	}

	/**
	 * Get if keyboard key is currently not down.
	 * @param key Keyboard key code.
	 * @returns True if keyboard key is currently up, false otherwise.
	 */
	public keyUp(key: KeyboardKeys): boolean {
		return Boolean(!this.keyDown(key));
	}

	/**
	 * Get if a keyboard button was released in current frame.
	 * @param button Keyboard key code.
	 * @returns True if key was down last frame, but released in current frame.
	 */
	public keyReleased(key: KeyboardKeys): boolean {
		return Boolean(this.keyboardReleased.get(key));
	}

	/**
	 * Get if keyboard key was pressed this frame.
	 * @param key Keyboard key code.
	 * @returns True if key is currently down, but was up in previous frame.
	 */
	public keyPressed(key: KeyboardKeys): boolean {
		return Boolean(this.keyboardPressed.get(key));
	}

	/**
	 * Get if any of the shift keys are currently down.
	 * @returns True if there's a shift key pressed down.
	 */
	public get shiftDown(): boolean {
		return Boolean(this.keyDown(this.KeyboardKeys.SHIFT));
	}

	/**
	 * Get if any of the Ctrl keys are currently down.
	 * @returns True if there's a Ctrl key pressed down.
	 */
	public get ctrlDown(): boolean {
		return Boolean(this.keyDown(this.KeyboardKeys.CTRL));
	}

	/**
	 * Get if any of the Alt keys are currently down.
	 * @returns True if there's an Alt key pressed down.
	 */
	public get altDown(): boolean {
		return Boolean(this.keyDown(this.KeyboardKeys.ALT));
	}

	/**
	 * Get if any keyboard key was pressed this frame.
	 * @returns True if any key was pressed down this frame.
	 */
	public get anyKeyPressed(): boolean {
		return Object.keys(this.keyboardPressed).length !== 0;
	}

	/**
	 * Get if any keyboard key is currently down.
	 * @returns True if there's a key pressed down.
	 */
	public get anyKeyDown(): boolean {
		for(const [_key, pressed] of this.keyboardState) {
			if(pressed) return true;
		}
		return false;
	}

	/**
	 * Get if any mouse button was pressed this frame.
	 * @returns True if any of the mouse buttons were pressed this frame.
	 */
	public get anyMouseButtonPressed(): boolean {
		return Object.keys(this._mousePressed).length !== 0;
	}

	/**
	 * Get if any mouse button is down.
	 * @returns True if any of the mouse buttons are pressed.
	 */
	public get anyMouseButtonDown(): boolean {
		for(const [button, pressed] of this.mouseState) {
			if(pressed) return true;
		}
		return false;
	}

	mouseButtonFromCode(code: InputCode): MouseButtons | null {
		if(typeof code === "string") {
			code = code.toUpperCase();
			if(code.indexOf("MOUSE_") === 0) {
				// get mouse code name
				const codename = code.split("_")[1];
				if(codename in MouseButtons) {
					return MouseButtons[codename as keyof typeof MouseButtons];
				}
				throw new Error("Unknown mouse button: " + code);
			}
		} else if(code in MouseButtons) {
			return code as MouseButtons;
		}
		return null;
	}

	keyboardKeyFromCode(code: InputCode): KeyboardKeys | null {
		if(typeof code === "string") {
			code = code.toUpperCase();
			if(code in KeyboardKeys) {
				return KeyboardKeys[code as keyof typeof KeyboardKeys];
			}
		} else if(code in KeyboardKeys) {
			return code as KeyboardKeys;
		}
		return null;
	}

	/**
	 * Return if a mouse or keyboard state in a generic way. Used internally.

	 * @param {InputCode} code Keyboard, mouse or touch code.
	 *                          For mouse buttons: mouse_left, mouse_right or mouse_middle.
	 *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example "a", "alt", "up_arrow", etc..).
	 *                          For touch: just use "touch" as code.
	 *                          For numbers (0-9): you can use the number.
	 * @param {Function} mouseCheck Callback to use to return value if its a mouse button code.
	 * @param {Function} keyboardCheck Callback to use to return value if its a keyboard key code.
	 * @param {*} touchValue Value to use to return value if its a touch code.
	 * @param {*} customValues Dictionary to check for custom values injected via setCustomState().
	 */
	private getValueWithCode<T>(code: InputCode, mouseCheck: (k: MouseButtons) => T, keyboardCheck: (k: KeyboardKeys) => T, touchValue: T, customValues: Map<string, T>): T | false {
		// check for custom values
		if(typeof code === "string") {
			const customVal = customValues.get(code);
			if(customVal !== undefined) return customVal;
			if(this.customKeys.has(code)) return false;

			// if its "touch" its for touch events
			if(code === _touchKeyCode) return touchValue;

			// if its just a number, add the "n" prefix
			if(!isNaN(parseInt(code, 10)) && code.length === 1) code = "n" + code;
		}

		// if starts with "mouse" its for mouse button events
		const mouseKey = this.mouseButtonFromCode(code);
		if(mouseKey !== null) return mouseCheck.call(this, mouseKey); // return if mouse down

		// if not start with "mouse", treat it as a keyboard key
		const keyboardKey = this.keyboardKeyFromCode(code);
		if(keyboardKey === null) throw new Error("Unknown keyboard key: " + code);
		return keyboardCheck.call(this, keyboardKey);
	}

	/**
	 * Return if a mouse or keyboard button is currently down.
	 * @example
	 * if (Shaku.input.down(["mouse_left", "touch", "space"])) alert("mouse, touch screen or space are pressed!");
	 * @param code Keyboard, touch or mouse code. Can be array of codes to test any of them.
	 * For mouse buttons: set code to "mouse_left", "mouse_right" or "mouse_middle".
	 * For keyboard buttons: use one of the keys of KeyboardKeys (for example "a", "alt", "up_arrow", etc..).
	 * For touch screen: set code to "touch".
	 * For numbers (0-9): you can use the number itself.
	 * Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
	 * @returns True if key or mouse button are down.
	 */
	public down(code: InputCode | InputCode[]): boolean {
		if(!Array.isArray(code)) code = [code];
		for(const c of code) {
			if(Boolean(this.getValueWithCode(c, this.mouseDown, this.keyDown, this.touching, this.customStates))) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Return if a mouse or keyboard button was released in this frame.
	 * @example
	 * if (Shaku.input.released(["mouse_left", "touch", "space"])) alert("mouse, touch screen or space were released!");
	 * @param code Keyboard, touch, gamepad or mouse button code. Can be array of codes to test any of them.
	 * For mouse buttons: set code to "mouse_left", "mouse_right" or "mouse_middle".
	 * For keyboard buttons: use one of the keys of KeyboardKeys (for example "a", "alt", "up_arrow", etc..).
	 * For touch screen: set code to "touch".
	 * For numbers (0-9): you can use the number itself.
	 * Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
	 * @returns True if key or mouse button were down in previous frame, and released this frame.
	 */
	public released(code: InputCode | InputCode[]): boolean {
		if(!Array.isArray(code)) code = [code];
		for(const c of code) {
			if(Boolean(this.getValueWithCode(c, this.mouseReleased, this.keyReleased, this.touchEnded, this.customReleased))) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Return if a mouse or keyboard button was pressed in this frame.
	 * @example
	 * if (Shaku.input.pressed(["mouse_left", "touch", "space"])) alert("mouse, touch screen or space were pressed!");
	 * @param {InputCode|Array<InputCode>} code Keyboard, touch, gamepad or mouse button code. Can be array of codes to test any of them.
	 *                          For mouse buttons: set code to "mouse_left", "mouse_right" or "mouse_middle".
	 *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example "a", "alt", "up_arrow", etc..).
	 *                          For touch screen: set code to "touch".
	 *                          For numbers (0-9): you can use the number itself.
	 *                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
	 * @returns {Boolean} True if key or mouse button where up in previous frame, and pressed this frame.
	 */
	public pressed(code: InputCode | InputCode[]) {
		if(!Array.isArray(code)) code = [code];
		for(const c of code) {
			if(this.getValueWithCode(c, this.mousePressed, this.keyPressed, this.touchStarted, this.customPressed)) return true;
		}
		return false;
	}

	/**
	 * Return timestamp, in milliseconds, of the last time this key code was released.
	 * @example
	 * let lastReleaseTime = Shaku.input.lastReleaseTime("mouse_left");
	 * @param {InputCode} code Keyboard, touch, gamepad or mouse button code.
	 *                          For mouse buttons: set code to "mouse_left", "mouse_right" or "mouse_middle".
	 *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example "a", "alt", "up_arrow", etc..).
	 *                          For touch screen: set code to "touch".
	 *                          For numbers (0-9): you can use the number itself.
	 *                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
	 * @returns {Number} Timestamp of last key release, or 0 if was never released.
	 */
	lastReleaseTime(code: InputCode) {
		if(Array.isArray(code)) throw new Error("Array not supported in 'lastReleaseTime'!");
		return this.getValueWithCode(code, (c) => this.lastMouseReleasedTime.get(c), (c) => this.lastKeyReleasedTime.get(c), this.lastTouchReleasedTime, this.prevLastCustomReleasedTime) || 0;
	}

	/**
	 * Return timestamp, in milliseconds, of the last time this key code was pressed.
	 * @example
	 * let lastPressTime = Shaku.input.lastPressTime("mouse_left");
	 * @param {InputCode} code Keyboard, touch, gamepad or mouse button code.
	 *                          For mouse buttons: set code to "mouse_left", "mouse_right" or "mouse_middle".
	 *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example "a", "alt", "up_arrow", etc..).
	 *                          For touch screen: set code to "touch".
	 *                          For numbers (0-9): you can use the number itself.
	 *                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
	 * @returns {Number} Timestamp of last key press, or 0 if was never pressed.
	 */
	lastPressTime(code: InputCode) {
		if(Array.isArray(code)) throw new Error("Array not supported in 'lastPressTime'!");
		return this.getValueWithCode(code, (c) => this.lastMousePressedTime.get(c), (c) => this.lastKeyPressedTime.get(c), this.lastTouchPressedTime, this.prevLastCustomPressedTime) || 0;
	}

	/**
	 * Return if a key was double-pressed.
	 * @example
	 * let doublePressed = Shaku.input.doublePressed(["mouse_left", "touch", "space"]);
	 * @param {InputCode|Array<InputCode>} code Keyboard, touch, gamepad or mouse button code. Can be array of codes to test any of them.
	 *                          For mouse buttons: set code to "mouse_left", "mouse_right" or "mouse_middle".
	 *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example "a", "alt", "up_arrow", etc..).
	 *                          For touch screen: set code to "touch".
	 *                          For numbers (0-9): you can use the number itself.
	 *                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
	 * @param {Number} maxInterval Max interval time, in milliseconds, to consider it a double-press. Defaults to `defaultDoublePressInterval`.
	 * @returns {Boolean} True if one or more key codes double-pressed, false otherwise.
	 */
	doublePressed(code: InputCode | InputCode[], maxInterval?: number) {
		// default interval
		maxInterval = maxInterval || this.defaultDoublePressInterval;

		// current timestamp
		const currTime = timestamp();

		// check all keys
		if(!Array.isArray(code)) code = [code];
		for(const c of code) {
			if(this.pressed(c)) {
				const currKeyTime = this.getValueWithCode(c, (c) => this.prevLastMousePressedTime.get(c), (c) => this.prevLastKeyPressedTime.get(c), this.prevLastTouchPressedTime, this.prevLastCustomPressedTime);
				if(currTime - currKeyTime <= maxInterval) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * Return if a key was double-released.
	 * @example
	 * let doubleReleased = Shaku.input.doubleReleased(["mouse_left", "touch", "space"]);
	 * @param {InputCode|Array<InputCode>} code Keyboard, touch, gamepad or mouse button code. Can be array of codes to test any of them.
	 *                          For mouse buttons: set code to "mouse_left", "mouse_right" or "mouse_middle".
	 *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example "a", "alt", "up_arrow", etc..).
	 *                          For touch screen: set code to "touch".
	 *                          For numbers (0-9): you can use the number itself.
	 *                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
	 * @param {Number} maxInterval Max interval time, in milliseconds, to consider it a double-release. Defaults to `defaultDoublePressInterval`.
	 * @returns {Boolean} True if one or more key codes double-released, false otherwise.
	 */
	doubleReleased(code: InputCode | InputCode[], maxInterval: number) {
		// default interval
		maxInterval = maxInterval || this.defaultDoublePressInterval;

		// current timestamp
		const currTime = timestamp();

		// check all keys
		if(!Array.isArray(code)) code = [code];
		for(const c of code) {
			if(this.released(c)) {
				const currKeyTime = this.getValueWithCode(c, (c) => this.prevLastMousePressedTime.get(c), (c) => this.prevLastKeyPressedTime.get(c), this.prevLastTouchPressedTime, this.prevLastCustomPressedTime);
				if(currTime - currKeyTime <= maxInterval) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * Get mouse wheel sign.
	 * @returns {Number} Mouse wheel sign (-1 or 1) for wheel scrolling that happened during this frame.
	 * Will return 0 if mouse wheel is not currently being used.
	 */
	get mouseWheelSign() {
		return Math.sign(this._mouseWheel);
	}

	/**
	 * Get mouse wheel value.
	 * @returns {Number} Mouse wheel value.
	 */
	get mouseWheel() {
		return this._mouseWheel;
	}

	/**
	 * @inheritdoc
	 * @private
	 **/
	public endFrame() {
		// set mouse previous position and clear mouse move cache
		this.mousePrevPos = this.mousePos.clone();

		// reset pressed / release events
		this.keyboardPressed = new Map();
		this.keyboardReleased = new Map();
		this._mousePressed = new Map();
		this._mouseReleased = new Map();
		this.customPressed = new Map();
		this.customReleased = new Map();

		// reset touch start / end states
		this._touchStarted = false;
		this._touchEnded = false;

		// reset mouse wheel
		this._mouseWheel = 0;
	}

	/**
	 * Get keyboard key code from event.
	 */
	private getKeyboardKeyCode(event: KeyboardEvent) {
		event = this._getEvent(event);
		// TODO: stop using numerical keyCode and use modern .code
		return event.keyCode !== undefined ? event.keyCode : event.key.charCodeAt(0);
	}

	/**
	 * Called when window loses focus - clear all input states to prevent keys getting stuck.
	 */
	private _onBlur(event: FocusEvent) {
		if(this.resetOnFocusLoss) {
			this.#_resetAll(true);
		}
	}

	/**
	 * Handle mouse wheel events.

	 * @param {*} event Event data from browser.
	 */
	private _onMouseWheel(event: WheelEvent) {
		this._mouseWheel = event.deltaY;
	}

	/**
	 * Handle keyboard down event.

	 * @param {*} event Event data from browser.
	*/
	private _onKeyDown(event: KeyboardEvent) {
		const keycode = this.getKeyboardKeyCode(event);
		if(!this.keyboardState.get(keycode)) {
			this.keyboardPressed.set(keycode, true);
			this.prevLastKeyPressedTime.set(keycode, this.lastKeyPressedTime.get(keycode));
			this.lastKeyPressedTime.set(keycode, timestamp());
		}
		this.keyboardState.set(keycode, true);
	}

	/**
	 * Handle keyboard up event.

	 * @param {*} event Event data from browser.
	 */
	private _onKeyUp(event: KeyboardEvent) {
		const keycode = this.getKeyboardKeyCode(event) || 0;
		this.keyboardState.set(keycode, false);
		this.keyboardReleased.set(keycode, true);
		this.prevLastKeyReleasedTime.set(keycode, this.lastKeyReleasedTime.get(keycode));
		this.lastKeyReleasedTime.set(keycode, timestamp());
	}

	/**
	 * Extract position from touch event.

	 * @param {*} event Event data from browser.
	 * @returns {Vector2} Position x,y or null if couldn't extract touch position.
	 */
	private _getTouchEventPosition(event: TouchEvent) {
		const touches = event.changedTouches || event.touches;
		if(touches && touches.length) {
			const touch = touches[0];
			const x = touch.pageX || touch.offsetX || touch.clientX;
			const y = touch.pageY || touch.offsetY || touch.clientY;
			return new Vector2(x, y);
		}
		return null;
	}

	/**
	 * Handle touch start event.

	 * @param {*} event Event data from browser.
	 */
	private _onTouchStart(event: TouchEvent) {
		// update position
		const position = this._getTouchEventPosition(event);
		if(position) {
			if(this.delegateTouchInputToMouse) {
				this.mousePos.x = position.x;
				this.mousePos.y = position.y;
				this._normalizeMousePos();
			}
		}

		// set touching flag
		this.isTouching = true;
		this._touchStarted = true;

		// update time
		this.prevLastTouchPressedTime = this.lastTouchPressedTime;
		this.lastTouchPressedTime = timestamp();

		// mark that touch started
		if(this.delegateTouchInputToMouse) {
			this._mouseButtonDown(this.MouseButtons.LEFT);
		}
	}

	/**
	 * Handle touch end event.

	 * @param {*} event Event data from browser.
	 */
	private _onTouchEnd(event: TouchEvent) {
		// update position
		const position = this._getTouchEventPosition(event);
		if(position) {
			this._touchPosition.copy(position);
			if(this.delegateTouchInputToMouse) {
				this.mousePos.x = position.x;
				this.mousePos.y = position.y;
				this._normalizeMousePos();
			}
		}

		// clear touching flag
		this.isTouching = false;
		this._touchEnded = true;

		// update touch end time
		this.prevLastTouchReleasedTime = this.lastTouchReleasedTime;
		this.lastTouchReleasedTime = timestamp();

		// mark that touch ended
		if(this.delegateTouchInputToMouse) {
			this._mouseButtonUp(this.MouseButtons.LEFT);
		}
	}

	/**
	 * Handle touch move event.

	 * @param {*} event Event data from browser.
	 */
	private _onTouchMove(event: TouchEvent) {
		// update position
		const position = this._getTouchEventPosition(event);
		if(position) {
			this._touchPosition.copy(position);
			if(this.delegateTouchInputToMouse) {
				this.mousePos.x = position.x;
				this.mousePos.y = position.y;
				this._normalizeMousePos();
			}
		}

		// set touching flag
		this.isTouching = true;
	}

	/**
	 * Handle mouse down event.

	 * @param event Event data from browser.
	 */
	private _onMouseDown(event: MouseEvent) {
		event = this._getEvent(event);
		if(this.disableMouseWheelAutomaticScrolling && (event.button as MouseButtons === this.MouseButtons.MIDDLE)) event.preventDefault();
		this._mouseButtonDown(event.button);
	}

	/**
	 * Handle mouse up event.

	 * @param {*} event Event data from browser.
	 */
	private _onMouseUp(event: MouseEvent) {
		event = this._getEvent(event);
		this._mouseButtonUp(event.button);
	}

	/**
	 * Mouse button pressed logic.

	 * @param {*} button Button pressed.
	 */
	private _mouseButtonDown(button: MouseButtons) {
		this.mouseState.set(button, true);
		this._mousePressed.set(button, true);
		this.prevLastMousePressedTime.set(button, this.lastMousePressedTime.get(button));
		this.lastMousePressedTime.set(button, timestamp());
	}

	/**
	 * Mouse button released logic.

	 * @param {*} button Button released.
	 */
	private _mouseButtonUp(button: MouseButtons) {
		this.mouseState.set(button, false);
		this._mouseReleased.set(button, true);
		this.prevLastMouseReleasedTime.set(button, this.lastMouseReleasedTime.get(button));
		this.lastMouseReleasedTime.set(button, timestamp());
	}

	/**
	 * Handle mouse move event.

	 * @param {*} event Event data from browser.
	 */
	private _onMouseMove(event: MouseEvent) {
		// get event in a cross-browser way
		event = this._getEvent(event);

		// try to get position from event with some fallbacks
		let pageX = event.clientX ?? event.x ?? event.offsetX ?? event.pageX;
		let pageY = event.clientY ?? event.y ?? event.offsetY ?? event.pageY;

		// if pageX and pageY are not supported, use clientX and clientY instead
		if(pageX === undefined) {
			pageX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			pageY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}

		// set current mouse position
		this.mousePos.x = pageX;
		this.mousePos.y = pageY;
		this._normalizeMousePos();
	}

	/**
	 * Normalize current _mousePos value to be relative to target element.
	 */
	private _normalizeMousePos() {
		if(this._targetElement && this._targetElement instanceof HTMLElement) {
			const rect = this._targetElement.getBoundingClientRect();
			this.mousePos.x -= rect.left;
			this.mousePos.y -= rect.top;
		}
		this.mousePos.roundSelf();
	}

	/**
	 * Get event either from event param or from window.event.
	 * This is for older browsers support.
	 */
	private _getEvent<T extends Event>(event: T): T {
		return event || window.event;
	}
}

export const input = new Input();
