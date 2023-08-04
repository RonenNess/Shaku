import Asset from "./asset";

/**
 * A loadable json asset.
 * This asset type loads JSON from a remote file.
 */
class JsonAsset extends Asset {
	/** @inheritdoc */
	constructor(url) {
		super(url);
		this._data = null;
	}

	/**
	 * Load the JSON data from the asset URL.
	 * @returns {Promise} Promise to resolve when fully loaded.
	 */
	load() {
		return new Promise((resolve, reject) => {

			var request = new XMLHttpRequest();
			request.open('GET', this.url, true);
			request.responseType = 'json';

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
	 * @param {Object|String} source Data to create asset from.
	 * @returns {Promise} Promise to resolve when asset is ready.
	 */
	create(source) {
		return new Promise((resolve, reject) => {

			// make sure data is a valid json + clone it
			try {
				if(source) {
					if(typeof source === 'string') {
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
	 * @returns {*} Data as dictionary.
	 */
	get data() {
		return this._data;
	}

	/** @inheritdoc */
	get valid() {
		return Boolean(this._data);
	}

	/** @inheritdoc */
	destroy() {
		this._data = null;
	}
}

// export the asset type.
export default JsonAsset;
