/**
 * Interface for any manager.
 * Manager = manages a domain in Shaku, such as gfx (graphics), sfx (sounds), input, etc.
 */
export interface IManager {
	/**
	 * Initialize the manager.
	 */
	setup(): Promise<void>;

	/**
	 * Called every update at the begining of the frame.
	 */
	startFrame(): void;

	/**
	 * Called every update at the end of the frame.
	 */
	endFrame(): void;

	/**
	 * Destroy the manager.
	 */
	destroy(): void;
}
