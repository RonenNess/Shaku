import { Asset } from "./asset";

/**
 * A loadable binary data asset.
 * This asset type loads array of bytes from a remote file.
 */
export class BinaryAsset extends Asset {
	private data: Uint8Array | null;

	/**
	 * @inheritdoc
	 */
	public constructor(url: string) {
		super(url);
		this.data = null;
	}

	/**
	 * Load the binary data from the asset URL.
	 * @returns Promise to resolve when fully loaded.
	 */
	public load(): Promise<void> {
		return new Promise((resolve, reject) => {

			const request = new XMLHttpRequest();
			request.open("GET", this.url, true);
			request.responseType = "arraybuffer";

			// on load, validate audio content
			request.onload = () => {
				if(request.readyState === 4) {
					if(!request.response) reject(request.statusText);
					this.data = new Uint8Array(request.response);
					this.notifyReady();
					resolve();
				}
			};

			// on load error, reject
			request.onerror = e => reject(e);

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
			if(Array.isArray(source)) source = new Uint8Array(source);
			if(!(source instanceof Uint8Array)) return reject("Binary asset source must be of type 'Uint8Array'!");
			this.data = source;
			this.notifyReady();
			resolve();
		});
	}

	/**
	 * @inheritdoc
	 */
	public isValid(): boolean {
		return Boolean(this.data);
	}

	/**
	 * @inheritdoc
	 */
	public destroy() {
		this.data = null;
	}

	/**
	 * Get binary data.
	 * @returns Data as bytes array.
	 */
	public getData(): Uint8Array {
		return this.data;
	}

	/**
	 * Convert and return data as string.
	 * @returns Data converted to string.
	 */
	public string(): string {
		return new TextDecoder().decode(this.data);
	}
}
