

/**
 * Interface for any manager.
 * Manager = manages a domain in Shaku, such as gfx (graphics), sfx (sounds), input, etc.
 */
class IManager {
	/**
	 * Initialize the manager.
	 * @returns {Promise} Promise to resolve when initialization is done.
	 */
	setup() {
		throw new Error("Not Implemented!");
	}

	/**
	 * Called every update at the begining of the frame.
	 */
	startFrame() {
		throw new Error("Not Implemented!");
	}

	/**
	 * Called every update at the end of the frame.
	 */
	endFrame() {
		throw new Error("Not Implemented!");
	}

	/**
	 * Destroy the manager.
	 */
	destroy() {
		throw new Error("Not Implemented!");
	}
}

// export the manager interface.
export default IManager;
