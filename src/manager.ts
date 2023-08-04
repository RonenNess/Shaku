/**
 * Interface for any manager.
 * Manager = manages a domain in Shaku, such as gfx (graphics), sfx (sounds), input, etc.
 */
export default interface IManager {
	/**
	 * Initialize the manager.
	 * @returns {Promise} Promise to resolve when initialization is done.
	 */
	setup(): Promise<void>;

	/**
	 * Called every update at the begining of the frame.
	 */
	startFrame(): Promise<void>;

	/**
	 * Called every update at the end of the frame.
	 */
	endFrame(): Promise<void>;

	/**
	 * Destroy the manager.
	 */
	destroy(): Promise<void>;
}
