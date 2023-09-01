const _autoAnimators = [];

/**
 * Implement an animator object that change values over time using Linear Interpolation.
 * Usage example:
 * (new Animator(sprite)).from({"position.x": 0}).to({"position.x": 100}).duration(1).play();
 */
export class Animator {
	/**
	 * Create the animator.
	 * @param {*} target Any object you want to animate.
	 */
	public constructor(target) {
		this._target = target;
		this._fromValues = {};
		this._toValues = {};
		this._progress = 0;
		this._onFinish = null;
		this._smoothDamp = false;
		this._repeats = false;
		this._repeatsWithReverseAnimation = false;
		this._isInAutoUpdate = false;
		this._originalFrom = null;
		this._originalTo = null;
		this._originalRepeats = null;

		/**
		 * Speed factor to multiply with delta every time this animator updates.
		 */
		this.speedFactor = 1;
	}

	/**
	 * Update this animator with a given delta time.
	 * @param {Number} delta Delta time to progress this animator by.
	 */
	update(delta) {
		// if already done, skip
		if(this._progress >= 1) {
			return;
		}

		// apply speed factor and update progress
		delta *= this.speedFactor;
		this._progress += delta;

		// did finish?
		if(this._progress >= 1) {

			// make sure don't overflow
			this._progress = 1;

			// trigger finish method
			if(this._onFinish) {
				this._onFinish(this._target, this);
			}
		}

		// update values
		for(const key in this._toValues) {

			// get key as parts and to-value
			const keyParts = this._toValues[key].keyParts;
			let toValue = this._toValues[key].value;

			// get from value
			let fromValue = this._fromValues[key];

			// if from not set, get default
			if(fromValue === undefined) {
				this._fromValues[key] = fromValue = this.#_getValueFromTarget(keyParts);
				if(fromValue === undefined) {
					throw new Error(`Animator issue: missing origin value for key "${key}" and property not found in target object.`);
				}
			}

			// if to-value is a method, call it
			if(typeof toValue === "function") {
				toValue = toValue();
			}

			// if from-value is a method, call it
			if(typeof fromValue === "function") {
				fromValue = toValue();
			}

			// get lerp factor
			const a = (this._smoothDamp && this._progress < 1) ? (this._progress * (1 + 1 - this._progress)) : this._progress;

			// calculate new value
			let newValue = null;
			if(typeof fromValue === "number") {
				newValue = lerp(fromValue, toValue, a);
			}
			else if(fromValue.constructor.lerp) {
				newValue = fromValue.constructor.lerp(fromValue, toValue, a);
			}
			else {
				throw new Error(`Animator issue: from-value for key "${key}" is not a number, and its class type don't implement a 'lerp()' method!`);
			}

			// set new value
			this.#_setValueToTarget(keyParts, newValue);
		}

		// if repeating, reset progress
		if(this._repeats && this._progress >= 1) {
			if(typeof this._repeats === "number") { this._repeats--; }
			this._progress = 0;
			if(this._repeatsWithReverseAnimation) {
				this.flipFromAndTo();
			}
		}
	}

	/**
	 * Get value from target object.

	 * @param {Array<String>} keyParts Key parts broken by dots.
	 */
	#_getValueFromTarget(keyParts) {
		// easy case - get value when key parts is just one component
		if(keyParts.length === 1) {
			return this._target[keyParts[0]];
		}

		// get value for path with parts
		function index(obj, i) { return obj[i]; }
		return keyParts.reduce(index, this._target);
	}

	/**
	 * Set value in target object.

	 * @param {Array<String>} keyParts Key parts broken by dots.
	 */
	#_setValueToTarget(keyParts, value) {
		// easy case - set value when key parts is just one component
		if(keyParts.length === 1) {
			this._target[keyParts[0]] = value;
			return;
		}

		// set value for path with parts
		function index(obj, i) { return obj[i]; }
		const parent = keyParts.slice(0, keyParts.length - 1).reduce(index, this._target);
		parent[keyParts[keyParts.length - 1]] = value;
	}

	/**
	 * Make sure a given value is legal for the animator.

	 */
	#_validateValueType(value) {
		return (typeof value === "number") || (typeof value === "function") || (value && value.constructor && value.constructor.lerp);
	}

	/**
	 * Set a method to run when animation ends.
	 * @param {Function} callback Callback to invoke when done.
	 * @returns {Animator} this.
	 */
	then(callback) {
		this._onFinish = callback;
		return this;
	}

	/**
	 * Set smooth damp.
	 * If true, lerping will go slower as the animation reach its ending.
	 * @param {Boolean} enable set smooth damp mode.
	 * @returns {Animator} this.
	 */
	smoothDamp(enable) {
		this._smoothDamp = enable;
		return this;
	}

	/**
	 * Set if the animator should repeat itself.
	 * @param {Boolean|Number} enable false to disable repeating, true for endless repeats, or a number for limited number of repeats.
	 * @param {Boolean} reverseAnimation if true, it will reverse animation to repeat it instead of just "jumping" back to starting state.
	 * @returns {Animator} this.
	 */
	repeats(enable, reverseAnimation) {
		this._originalRepeats = this._repeats = enable;
		this._repeatsWithReverseAnimation = Boolean(reverseAnimation);
		return this;
	}

	/**
	 * If true, will reverse animation back to start values after done.
	 * This is equivalent to calling `repeats(1, true)`.
	 * @returns {Animator} this.
	 */
	reverseBackToStart() {
		return this.repeats(1, true);
	}

	/**
	 * Set "from" values.
	 * You don't have to provide 'from' values, when a value is not set the animator will just take whatever was set in target when first update is called.
	 * @param {*} values Values to set as "from" values.
	 * Key = property name in target (can contain dots for nested), value = value to start animation from.
	 * @returns {Animator} this.
	 */
	from(values) {
		for(const key in values) {
			if(!this.#_validateValueType(values[key])) {
				throw new Error("Illegal value type to use with Animator! All values must be either numbers, methods, or a class instance that has a static lerp() method.");
			}
			this._fromValues[key] = values[key];
		}
		this._originalFrom = null;
		return this;
	}

	/**
	 * Set "to" values, ie the result when animation ends.
	 * @param {*} values Values to set as "to" values.
	 * Key = property name in target (can contain dots for nested), value = value to start animation from.
	 * @returns {Animator} this.
	 */
	to(values) {
		for(const key in values) {
			if(!this.#_validateValueType(values[key])) {
				throw new Error("Illegal value type to use with Animator! All values must be either numbers, methods, or a class instance that has a static lerp() method.");
			}
			this._toValues[key] = { keyParts: key.split("."), value: values[key] };
		}
		this._originalTo = null;
		return this;
	}

	/**
	 * Flip between the "from" and the "to" states.
	 */
	flipFromAndTo() {
		const newFrom = {};
		const newTo = {};

		if(!this._originalFrom) { this._originalFrom = this._fromValues; }
		if(!this._originalTo) { this._originalTo = this._toValues; }

		for(const key in this._toValues) {
			newFrom[key] = this._toValues[key].value;
			newTo[key] = { keyParts: key.split("."), value: this._fromValues[key] };
		}

		this._fromValues = newFrom;
		this._toValues = newTo;
	}

	/**
	 * Make this Animator update automatically with the gameTime delta time.
	 * Note: this will change the speedFactor property.
	 * @param {Number} seconds Animator duration time in seconds.
	 * @returns {Animator} this.
	 */
	duration(seconds) {
		this.speedFactor = 1 / seconds;
		return this;
	}

	/**
	 * Reset animator progress.
	 * @returns {Animator} this.
	 */
	reset() {
		if(this._originalFrom) { this._fromValues = this._originalFrom; }
		if(this._originalTo) { this._toValues = this._originalTo; }
		if(this._originalRepeats !== null) { this._repeats = this._originalRepeats; }
		this._progress = 0;
		return this;
	}

	/**
	 * Make this Animator update automatically with the gameTime delta time, until its done.
	 * @returns {Animator} this.
	 */
	play() {
		if(this._isInAutoUpdate) {
			return;
		}

		_autoAnimators.push(this);
		this._isInAutoUpdate = true;
		return this;
	}

	/**
	 * Get if this animator finished.
	 * @returns {Boolean} True if animator finished.
	 */
	get ended() {
		return this._progress >= 1;
	}

	/**
	 * Update all auto animators.
	 * @private
	 * @param {Number} delta Delta time in seconds.
	 */
	static updatePlayingAnimations(delta) {
		for(let i = _autoAnimators.length - 1; i >= 0; --i) {

			_autoAnimators[i].update(delta);

			if(_autoAnimators[i].ended) {
				_autoAnimators[i]._isInAutoUpdate = false;
				_autoAnimators.splice(i, 1);
			}

		}
	}
}

// a simple lerp method
function lerp(start, end, amt) {
	return (1 - amt) * start + amt * end;
}
