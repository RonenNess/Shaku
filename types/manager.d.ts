export = IManager;
/**
 * Interface for any manager.
 * Manager = manages a domain in Shaku, such as gfx (graphics), sfx (sounds), input, etc.
 */
declare class IManager {
    /**
     * Initialize the manager.
     * @returns {Promise} Promise to resolve when initialization is done.
     */
    setup(): Promise<any>;
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
//# sourceMappingURL=manager.d.ts.map