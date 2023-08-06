import { Vector2 } from "../utils";

/**
 * Gamepad data object.
 * This object represents a snapshot of a gamepad state, it does not update automatically.
 */
export class Gamepad {
	public id: string;
	public axis1: Vector2;
	public axis2: Vector2;
	public mapping: string;
	public isMapped: boolean;
	public leftStick: Vector2;
	public rightStick: Vector2;
	public leftStickPressed: boolean;
	public rightStickPressed: boolean;
	public rightButtons: FourButtonsCluster;
	public leftButtons: FourButtonsCluster;
	public centerButtons: ThreeButtonsCluster;
	public frontButtons: FrontButtons;

	private _buttonsDown: any[];

	/**
	 * Create gamepad state object.
	 * @param {*} gp Browser gamepad state object.
	 */
	public constructor(gp) {
		/**
		 * Gamepad Id.
		 * @name Gamepad#id
		 * @type {String}
		 */
		this.id = gp.id;

		// set buttons down state
		this._buttonsDown = [];
		for(let i = 0; i < gp.buttons.length; ++i) {
			this._buttonsDown[i] = _gamepadButtonPressed(gp.buttons[i]);
		}

		/**
		 * Gamepad first axis value.
		 * @name Gamepad#axis1
		 * @type {Vector2}
		 */
		this.axis1 = new Vector2(gp.axes[0], gp.axes[1]);

		/**
		 * Gamepad second axis value.
		 * @name Gamepad#axis2
		 * @type {Vector2}
		 */
		this.axis2 = new Vector2(gp.axes[2] || 0, gp.axes[3] || 0);

		/**
		 * Mapping type.
		 * @name Gamepad#mapping
		 * @type {String}
		 */
		this.mapping = gp.mapping;

		/**
		 * True if the gamepad is of a known type and we have extra mapped attributes.
		 * False if unknown / not supported.
		 * @name Gamepad#isMapped
		 * @type {Boolean}
		 */
		this.isMapped = false;

		// standard mapping
		if(this.mapping === "standard") {

			/**
			 * Gamepad left stick.
			 * Only available with "standard" mapping.
			 * @name Gamepad#leftStick
			 * @type {Vector2}
			 */
			this.leftStick = this.axis1;

			/**
			 * Gamepad right stick.
			 * Only available with "standard" mapping.
			 * @name Gamepad#rightStick
			 * @type {Vector2}
			 */
			this.rightStick = this.axis2;

			/**
			 * Gamepad left stick is pressed.
			 * Only available with "standard" mapping.
			 * @name Gamepad#leftStickPressed
			 * @type {Boolean}
			 */
			this.leftStickPressed = this._buttonsDown[10];

			/**
			 * Gamepad right stick is pressed.
			 * Only available with "standard" mapping.
			 * @name Gamepad#leftStickPressed
			 * @type {Boolean}
			 */
			this.rightStickPressed = this._buttonsDown[11];

			/**
			 * Right cluster button states.
			 * @name Gamepad#rightButtons
			 * @type {FourButtonsCluster}
			 */
			this.rightButtons = new FourButtonsCluster(this._buttonsDown[0], this._buttonsDown[1], this._buttonsDown[2], this._buttonsDown[3]);

			/**
			 * Left cluster button states.
			 * @name Gamepad#leftButtons
			 * @type {FourButtonsCluster}
			 */
			this.leftButtons = new FourButtonsCluster(this._buttonsDown[13], this._buttonsDown[15], this._buttonsDown[14], this._buttonsDown[12]);

			/**
			 * Center cluster button states.
			 * @name Gamepad#leftButtons
			 * @type {FourButtonsCluster}
			 */
			this.centerButtons = new ThreeButtonsCluster(this._buttonsDown[8], this._buttonsDown[9], this._buttonsDown[16]);

			/**
			 * Front buttons states.
			 * @name Gamepad#frontButtons
			 * @type {FrontButtons}
			 */
			this.frontButtons = new FrontButtons(this._buttonsDown[4], this._buttonsDown[5], this._buttonsDown[6], this._buttonsDown[7]);

			/**
			 * True if the gamepad is of a known type and we have extra mapped attributes.
			 * False if unknown.
			 * @name Gamepad#isMapped
			 * @type {Boolean}
			 */
			this.isMapped = true;
		}

		// freeze self
		Object.freeze(this);
	}

	/**
	 * Get button state (if pressed down) by index.
	 * @param index Button index to check.
	 * @returns True if pressed, false otherwise.
	 */
	public button(index: number): boolean {
		return this._buttonsDown[index];
	}

	/**
	 * Get buttons count.
	 * @returns Buttons count.
	 */
	public get buttonsCount(): number {
		return this._buttonsDown.length;
	}
}

/**
 * Buttons cluster container - 4 buttons.
 */
export class FourButtonsCluster {
	public bottom: boolean;
	public right: boolean;
	public left: boolean;
	public top: boolean;

	/**
	 * Create the cluster states.
	 * @param bottom Bottom button state.
	 * @param right Right button state.
	 * @param left Left button state.
	 * @param top Top button state.
	 */
	public constructor(bottom: boolean, right: boolean, left: boolean, top: boolean) {
		this.bottom = Boolean(bottom);
		this.right = Boolean(right);
		this.left = Boolean(left);
		this.top = Boolean(top);
	}
}

/**
 * Buttons cluster container - 3 buttons.
 */
export class ThreeButtonsCluster {
	public left: boolean;
	public right: boolean;
	public center: boolean;

	/**
	 * Create the cluster states.
	 * @param left Left button state.
	 * @param right Right button state.
	 * @param center Center button state.
	 */
	public constructor(left: boolean, right: boolean, center: boolean) {
		this.left = Boolean(left);
		this.right = Boolean(right);
		this.center = Boolean(center);
	}
}

/**
 * Front buttons.
 */
export class FrontButtons {
	public topLeft: boolean;
	public topRight: boolean;
	public bottomLeft: boolean;
	public bottomRight: boolean;

	/**
	 * Create the cluster states.
	 */
	public constructor(topLeft: boolean, topRight: boolean, bottomLeft: boolean, bottomRight: boolean) {
		this.topLeft = Boolean(topLeft);
		this.topRight = Boolean(topRight);
		this.bottomLeft = Boolean(bottomLeft);
		this.bottomRight = Boolean(bottomRight);
	}
}

/**
 * Get if a gamepad button is currently pressed.
 * @prviate
 */
function _gamepadButtonPressed(b: { pressed: boolean; } | number): boolean {
	if(typeof b === "object") {
		return b.pressed;
	}
	return b === 1.0;
}
