import { Asset } from "./asset";

/**
 * A loadable binary data asset.
 * This asset type loads array of bytes from a remote file.
 */
export class BinaryAsset extends Asset {
	private _data: Uint8Array | null;

	/** @inheritdoc */
	public constructor(url: string) {
		super(url);
		this._data = null;
	}

	/**
	 * Load the binary data from the asset URL.
	 * @returns Promise to resolve when fully loaded.
	 */
	public load(): Promise<void> {
		return new Promise((resolve, reject) => {

			var request = new XMLHttpRequest();
			request.open("GET", this.url, true);
			request.responseType = "arraybuffer";

			// on load, validate audio content
			request.onload = () => {
				if(request.readyState == 4) {
					if(request.response) {
						this._data = new Uint8Array(request.response);
						this._notifyReady();
						resolve();
					}
					else {
						reject(request.statusText);
					}
				}
			};

			// on load error, reject
			request.onerror = (e) => {
				reject(e);
			};

			// initiate request
			request.send();
		});
	}

	/**
	 * Create the binary data asset from array or Uint8Array.
	 * @param source Data to create asset from.
	 * @returns Promise to resolve when asset is ready.
	 */
	public create(source: Uint8Array): Promise<void> {
		return new Promise((resolve, reject) => {
			if(Array.isArray(source)) { source = new Uint8Array(source); }
			if(!(source instanceof Uint8Array)) { return reject("Binary asset source must be of type 'Uint8Array'!"); }
			this._data = source;
			this._notifyReady();
			resolve();
		});
	}

	/** @inheritdoc */
	public get valid(): boolean {
		return Boolean(this._data);
	}

	/** @inheritdoc */
	public destroy() {
		this._data = null;
	}

	/**
	 * Get binary data.
	 * @returns Data as bytes array.
	 */
	public get data(): Uint8Array {
		return this._data;
	}

	/**
	 * Convert and return data as string.
	 * @returns Data converted to string.
	 */
	public string(): string {
		return (new TextDecoder()).decode(this._data);
	}
}
