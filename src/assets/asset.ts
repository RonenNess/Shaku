/**
 * A loadable asset base class.
 * All asset types inherit from this.
 */
export abstract class Asset {
	private _url: string;
	private _waitingCallbacks: ((asset: Asset) => void)[] | null;

	/**
	 * Create the new asset.
	 * @param url Asset URL / identifier.
	 */
	public constructor(url: string) {
		this._url = url;
		this._waitingCallbacks = [];
	}

	/**
	 * Get if this asset is ready, ie loaded or created.
	 * @returns True if asset finished loading / creating. This doesn't mean its necessarily valid, only that its done loading.
	 */
	public get ready(): boolean {
		return this._waitingCallbacks === null;
	}

	/**
	 * Register a method to be called when asset is ready.
	 * If asset is already in ready state, will invoke immediately.
	 * @param callback Callback to invoke when asset is ready.
	 */
	public onReady(callback: (asset: Asset) => void): void {
		// already ready
		if(this.valid || this.ready) {
			callback(this);
			return;
		}

		// add to callbacks list
		this._waitingCallbacks.push(callback);
	}

	/**
	 * Return a promise to resolve when ready.
	 * @returns Promise to resolve when ready.
	 */
	public waitForReady(): Promise<Asset> {
		return new Promise((resolve, reject) => {
			this.onReady(resolve);
		});
	}

	/**
	 * Notify all waiting callbacks that this asset is ready.

	 */
	protected _notifyReady(): void {
		if(!this._waitingCallbacks) return;
		for(let i = 0; i < this._waitingCallbacks.length; ++i) this._waitingCallbacks[i](this);
		this._waitingCallbacks = null;
	}

	/**
	 * Get asset's URL.
	 * @returns Asset URL.
	 */
	public get url(): string {
		return this._url;
	}

	/**
	 * Get if this asset is loaded and valid.
	 * @returns True if asset is loaded and valid, false otherwise.
	 */
	public abstract get valid(): boolean;

	/**
	 * Load the asset from it's URL.
	 * @param params Optional additional params.
	 * @returns Promise to resolve when fully loaded.
	 */
	public abstract load(params: unknown): Promise<void>;

	/**
	 * Create the asset from data source.
	 * @param source Data to create asset from.
	 * @param params Optional additional params.
	 * @returns Promise to resolve when asset is ready.
	 */
	public abstract create(source: unknown, params: unknown): Promise<void>;

	/**
	 * Destroy the asset, freeing any allocated resources in the process.
	 */
	public abstract destroy(): void;
}
