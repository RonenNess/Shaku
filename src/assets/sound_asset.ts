import Asset from "./asset";

/**
 * A loadable sound asset.
 * This is the asset type you use to play sounds.
 */
class SoundAsset extends Asset {
	/** @inheritdoc */
	constructor(url) {
		super(url);
		this._valid = false;
	}

	/**
	 * Load the sound asset from its URL.
	 * Note that loading sounds isn't actually necessary to play sounds, this method merely pre-load the asset (so first time we play
	 * the sound would be immediate and not delayed) and validate the data is valid.
	 * @returns {Promise} Promise to resolve when fully loaded.
	 */
	load() {
		// for audio files we force preload and validation of the audio file.
		// note: we can't use the Audio object as it won't work without page interaction.
		return new Promise((resolve, reject) => {

			// create request to load audio file
			var request = new XMLHttpRequest();
			request.open('GET', this.url, true);
			request.responseType = 'arraybuffer';

			// on load, validate audio content
			request.onload = () => {
				this._valid = true;
				this._notifyReady();
				resolve();
			};

			// on load error, reject
			request.onerror = (e) => {
				reject(e);
			};

			// initiate request
			request.send();
		});
	}

	/** @inheritdoc */
	get valid() {
		return this._valid;
	}

	/** @inheritdoc */
	destroy() {
		this._valid = false;
	}
}

// export the asset type.
export default SoundAsset;
