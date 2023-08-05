import { type StorageAdapter } from "./storage_adapter";

/**
 * A thin wrapper layer around storage utility.
 */
export default class Storage {
	private _adapter: StorageAdapter | null;
	private _keysPrefix: string;
	public valuesAsBase64: boolean;
	public keysAsBase64: boolean;

	/**
	 * Create the storage.
	 * @param adapters List of storage adapters to pick from. Will use the first option returning "isValid()" = true.
	 * @param prefix Optional prefix to add to all keys under this storage instance.
	 * @param valuesAsBase64 If true, will encode and decode data as base64.
	 * @param keysAsBase64 If true, will encode and decode keys as base64.
	 */
	public constructor(adapters: StorageAdapter[], prefix: string, valuesAsBase64: boolean, keysAsBase64: boolean) {
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
		this._keysPrefix = "shaku_storage_" + (prefix || "") + "_";
	}

	/**
	 * Return if this storage adapter is persistent storage or not.
	 * @returns True if this storage type is persistent.
	 */
	public get persistent(): boolean {
		return this.isValid && this._adapter.persistent;
	}

	/**
	 * Check if this storage instance has a valid adapter.
	 * @returns True if found a valid adapter to use, false otherwise.
	 */
	public get isValid(): boolean {
		return Boolean(this._adapter);
	}

	/**
	 * Convert key to string and add prefix if needed.
	 * @private
	 * @param key Key to normalize.
	 * @returns Normalized key.
	 */
	public normalizeKey(key: string): string {
		key = this._keysPrefix + key.toString();
		if(this.keysAsBase64) {
			key = btoa(key);
		}
		return key;
	}

	/**
	 * Check if a key exists.
	 * @param key Key to check.
	 * @returns True if key exists in storage.
	 */
	public exists(key: string): boolean {
		if(typeof key !== "string") { throw new Error("Key must be a string!"); }
		key = this.normalizeKey(key);
		return this._adapter.exists(key);
	}

	/**
	 * Set value.
	 * @private
	 */
	#_set(key: string, value: string): void {
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
	#_get(key: string): object | null {
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
	 * @param key Key to set.
	 * @param value Value to set.
	 */
	public setItem(key: string, value: string): void {
		// sanity and normalize key
		if(typeof key !== "string") { throw new Error("Key must be a string!"); }
		key = this.normalizeKey(key);

		// write value with metadata
		this.#_set(key, value);
	}

	/**
	 * Get value.
	 * @param key Key to get.
	 * @returns Value or null if not set.
	 */
	public getItem(key: string): object | null {
		// sanity and normalize key
		if(typeof key !== "string") { throw new Error("Key must be a string!"); }
		key = this.normalizeKey(key);

		// read value from metadata
		return this.#_get(key);
	}

	/**
	 * Get value and JSON parse it.
	 * @param key Key to get.
	 * @returns Value as a dictionary object or null if not set.
	 */
	public getJson(key: string): object | null {
		return this.getItem(key) || null;
	}

	/**
	 * Set value as JSON.
	 * @param key Key to set.
	 * @param value Value to set as a dictionary.
	 */
	public setJson(key: string, value: object): void {
		key = this.normalizeKey(key);
		this.#_set(key, value);
	}

	/**
	 * Delete value.
	 * @param key Key to delete.
	 */
	public deleteItem(key: string): void {
		if(typeof key !== "string") { throw new Error("Key must be a string!"); }
		key = this.normalizeKey(key);
		this._adapter.deleteItem(key);
	}

	/**
	 * Clear all values from this storage instance, based on prefix + adapter type.
	 */
	public clear(): void {
		this._adapter.clear(this._keysPrefix);
	}
}

/**
 * Default adapters to use when no adapters list is provided.
 */
Storage.defaultAdapters = [
	new StorageAdapter.localStorage(),
	new StorageAdapter.sessionStorage(),
	new StorageAdapter.memory()
];
