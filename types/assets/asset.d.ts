export = Asset;
/**
 * A loadable asset base class.
 * All asset types inherit from this.
 */
declare class Asset {
    /**
     * Create the new asset.
     * @param {String} url Asset URL / identifier.
     */
    constructor(url: string);
    _url: string;
    _waitingCallbacks: any[];
    /**
     * Get if this asset is ready, ie loaded or created.
     * @returns {Boolean} True if asset finished loading / creating. This doesn't mean its necessarily valid, only that its done loading.
     */
    get ready(): boolean;
    /**
     * Register a method to be called when asset is ready.
     * If asset is already in ready state, will invoke immediately.
     * @param {Function} callback Callback to invoke when asset is ready.
     */
    onReady(callback: Function): void;
    /**
     * Return a promise to resolve when ready.
     * @returns {Promise} Promise to resolve when ready.
     */
    waitForReady(): Promise<any>;
    /**
     * Notify all waiting callbacks that this asset is ready.
     * @private
     */
    private _notifyReady;
    /**
     * Get asset's URL.
     * @returns {String} Asset URL.
     */
    get url(): string;
    /**
     * Get if this asset is loaded and valid.
     * @returns {Boolean} True if asset is loaded and valid, false otherwise.
     */
    get valid(): boolean;
    /**
     * Load the asset from it's URL.
     * @param {*} params Optional additional params.
     * @returns {Promise} Promise to resolve when fully loaded.
     */
    load(params: any): Promise<any>;
    /**
     * Create the asset from data source.
     * @param {*} source Data to create asset from.
     * @param {*} params Optional additional params.
     * @returns {Promise} Promise to resolve when asset is ready.
     */
    create(source: any, params: any): Promise<any>;
    /**
     * Destroy the asset, freeing any allocated resources in the process.
     */
    destroy(): void;
}
//# sourceMappingURL=asset.d.ts.map