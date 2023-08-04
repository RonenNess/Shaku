import StorageAdapter from "./storage_adapter";

/**
 * A thin wrapper layer around storage utility.
 */
class Storage {
	/**
	 * Create the storage.
	 * @param {Array<StorageAdapter>} adapters List of storage adapters to pick from. Will use the first option returning 'isValid()' = true.
	 * @param {String} prefix Optional prefix to add to all keys under this storage instance.
	 * @param {Boolean} valuesAsBase64 If true, will encode and decode data as base64.
	 * @param {Boolean} keysAsBase64 If true, will encode and decode keys as base64.
	 */
	constructor(adapters, prefix, valuesAsBase64, keysAsBase64) {
		// default adapters
		adapters = adapters || Storage.defaultAdapters;

		// default to array
		if(!Array.isArray(adapters)) {
			adapters = [adapters];
		}

		// choose adapter
		this._adapter = null;
		for(let adapter of adapters) {
			if(adapter.isValid()) {
				this._adapter = adapter;
				break;
			}
		}

		// set if should use base64
		this.valuesAsBase64 = Boolean(valuesAsBase64);
		this.keysAsBase64 = Boolean(keysAsBase64);

		// set prefix
		this._keysPrefix = 'shaku_storage_' + (prefix || '') + '_';
	}

	/**
	 * Return if this storage adapter is persistent storage or not.
	 * @returns {Boolean} True if this storage type is persistent.
	 */
	get persistent() {
		return this.isValid && this._adapter.persistent;
	}

	/**
	 * Check if this storage instance has a valid adapter.
	 * @returns {Boolean} True if found a valid adapter to use, false otherwise.
	 */
	get isValid() {
		return Boolean(this._adapter);
	}

	/**
	 * Convert key to string and add prefix if needed.
	 * @private
	 * @param {String} key Key to normalize.
	 * @returns {String} Normalized key.
	 */
	normalizeKey(key) {
		key = this._keysPrefix + key.toString();
		if(this.keysAsBase64) {
			key = btoa(key);
		}
		return key;
	}

	/**
	 * Check if a key exists.
	 * @param {String} key Key to check.
	 * @returns {Boolean} True if key exists in storage.
	 */
	exists(key) {
		if(typeof key !== 'string') { throw new Error("Key must be a string!"); }
		key = this.normalizeKey(key);
		return this._adapter.exists(key);
	}

	/**
	 * Set value.
	 * @private
	 */
	#_set(key, value) {
		// json stringify
		value = JSON.stringify({
			data: value,
			timestamp: (new Date()).getTime(),
			src: "Shaku",
			sver: 1.0
		});

		// convert to base64
		if(this.valuesAsBase64) {
			value = btoa(value);
		}

		// store value
		this._adapter.setItem(key, value);
	}

	/**
	 * Get value.
	 * @private
	 */
	#_get(key) {
		// get value
		var value = this._adapter.getItem(key);

		// not found? return null
		if(value === null) {
			return null;
		}

		// convert from base64
		if(this.valuesAsBase64) {
			try {
				value = atob(value);
			}
			catch(e) {
				throw new Error("Failed to parse Base64 string while reading data. Did you try to read a value as Base64 that wasn't encoded as Base64 when written to storage?");
			}
		}

		// parse json
		try {
			value = JSON.parse(value);
		}
		catch(e) {
			throw new Error("Failed to JSON-parse data from storage. Did you try to read something that wasn't written with the Storage utility?");
		}

		// return value
		return value.data;
	}

	/**
	 * Set value.
	 * @param {String} key Key to set.
	 * @param {String} value Value to set.
	 */
	setItem(key, value) {
		// sanity and normalize key
		if(typeof key !== 'string') { throw new Error("Key must be a string!"); }
		key = this.normalizeKey(key);

		// write value with metadata
		this.#_set(key, value);
	}

	/**
	 * Get value.
	 * @param {String} key Key to get.
	 * @returns {String} Value or null if not set.
	 */
	getItem(key) {
		// sanity and normalize key
		if(typeof key !== 'string') { throw new Error("Key must be a string!"); }
		key = this.normalizeKey(key);

		// read value from metadata
		return this.#_get(key);
	}

	/**
	 * Get value and JSON parse it.
	 * @param {String} key Key to get.
	 * @returns {*} Value as a dictionary object or null if not set.
	 */
	getJson(key) {
		return this.getItem(key) || null;
	}

	/**
	 * Set value as JSON.
	 * @param {String} key Key to set.
	 * @param {*} value Value to set as a dictionary.
	 */
	setJson(key, value) {
		key = this.normalizeKey(key);
		this.#_set(key, value);
	}

	/**
	 * Delete value.
	 * @param {String} key Key to delete.
	 */
	deleteItem(key) {
		if(typeof key !== 'string') { throw new Error("Key must be a string!"); }
		key = this.normalizeKey(key);
		this._adapter.deleteItem(key);
	}

	/**
	 * Clear all values from this storage instance, based on prefix + adapter type.
	 */
	clear() {
		this._adapter.clear(this._keysPrefix);
	}
}

/**
 * Default adapters to use when no adapters list is provided.
 */
Storage.defaultAdapters = [new StorageAdapter.localStorage(), new StorageAdapter.sessionStorage(), new StorageAdapter.memory()];

// export the storage class
export default Storage;
