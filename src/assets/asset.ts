/**
 * A loadable asset base class.
 * All asset types inherit from this.
 */
export abstract class Asset {
	protected url: string;
	private waitingCallbacks: ((asset: Asset) => void)[] | null;

	/**
	 * Create the new asset.
	 * @param url Asset URL / identifier.
	 */
	public constructor(url: string) {
		this.url = url;
		this.waitingCallbacks = [];
	}

	/**
	 * Get asset's URL.
	 * @returns Asset URL.
	 */
	public getUrl(): string {
		return this.url;
	}

	/**
	 * Get if this asset is ready, ie loaded or created.
	 * @returns True if asset finished loading / creating.
	 * This doesn't mean its necessarily valid, only that its done loading.
	 */
	public isReady(): boolean {
		return this.waitingCallbacks === null;
	}

	/**
	 * Register a method to be called when asset is ready.
	 * If asset is already in ready state, will invoke immediately.
	 * @param callback Callback to invoke when asset is ready.
	 */
	public onReady(callback: (asset: Asset) => void): void {
		// already ready
		if(this.isValid() || this.isReady()) {
			callback(this);
			return;
		}

		// add to callbacks list
		this.waitingCallbacks.push(callback);
	}

	/**
	 * Return a promise to resolve when ready.
	 * @returns Promise to resolve when ready.
	 */
	public waitForReady(): Promise<Asset> {
		return new Promise((resolve, _reject) => {
			this.onReady(resolve);
		});
	}

	/**
	 * Notify all waiting callbacks that this asset is ready.
	 */
	protected notifyReady(): void {
		if(!this.waitingCallbacks) return;
		for(let i = 0; i < this.waitingCallbacks.length; ++i) this.waitingCallbacks[i](this);
		this.waitingCallbacks = null;
	}

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
	 * Get if this asset is loaded and valid.
	 * @returns True if asset is loaded and valid, false otherwise.
	 */
	public abstract isValid(): boolean;

	/**
	 * Destroy the asset, freeing any allocated resources in the process.
	 */
	public abstract destroy(): void;
}
