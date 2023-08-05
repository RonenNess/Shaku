import { Asset } from "./asset";

/**
 * A loadable json asset.
 * This asset type loads JSON from a remote file.
 */
export class JsonAsset extends Asset {
	private _data: unknown | null;

	/** @inheritdoc */
	public constructor(url: string) {
		super(url);
		this._data = null;
	}

	/**
	 * Load the JSON data from the asset URL.
	 * @returns {Promise} Promise to resolve when fully loaded.
	 */
	public load(): Promise<void> {
		return new Promise((resolve, reject) => {

			var request = new XMLHttpRequest();
			request.open("GET", this.url, true);
			request.responseType = "json";

			// on load, validate audio content
			request.onload = () => {
				if(request.readyState == 4) {
					if(request.response) {
						this._data = request.response;
						this._notifyReady();
						resolve();
					}
					else {
						if(request.status === 200) {
							reject("Response is not a valid JSON!");
						}
						else {
							reject(request.statusText);
						}
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
	 * Create the JSON data asset from object or string.
	 * @param source Data to create asset from.
	 * @returns Promise to resolve when asset is ready.
	 */
	public create(source: unknown | string): Promise<void> {
		return new Promise((resolve, reject) => {

			// make sure data is a valid json + clone it
			try {
				if(source) {
					if(typeof source === "string") {
						source = JSON.parse(source);
					}
					else {
						source = JSON.parse(JSON.stringify(source));
					}
				}
				else {
					source = {};
				}
			}
			catch(e) {
				return reject("Data is not a valid JSON serializable object!");
			}

			// store data and resolve
			this._data = source;
			this._notifyReady();
			resolve();
		});
	}

	/**
	 * Get json data.
	 * @returns Data as dictionary.
	 */
	public get data(): unknown {
		return this._data;
	}

	/** @inheritdoc */
	public get valid(): boolean {
		return Boolean(this._data);
	}

	/** @inheritdoc */
	public destroy(): void {
		this._data = null;
	}
}
