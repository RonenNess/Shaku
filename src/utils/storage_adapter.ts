/**
 * Storage adapter class that implement access to a storage device.
 * Used by the Storage utility.
 */
export interface StorageAdapter {
	/**
	 * Return if this storage adapter is persistent storage or not.
	 * @returns True if this storage type is persistent.
	 */
	get persistent(): boolean;

	/**
	 * Check if this adapter is OK to be used.
	 * For example, an adapter for localStorage will make sure it exists and not null.
	 * @returns True if storage adapter is valid to be used.
	 */
	isValid(): boolean;

	/**
	 * Check if a key exists.
	 * @param key Key to check.
	 * @returns True if key exists in storage.
	 */
	exists(key: string): boolean;

	/**
	 * Set value.
	 * @param key Key to set.
	 * @param value Value to set.
	 */
	setItem(key: string, value: string): void;

	/**
	 * Get value.
	 * @param key Key to get.
	 * @returns Value or null if not set.
	 */
	getItem(key: string): string | null;

	/**
	 * Delete value.
	 * @param {String} key Key to delete.
	 */
	deleteItem(key: string): void;

	/**
	 * Clear all values from this storage device.
	 * @param prefix Storage keys prefix.
	 */
	clear(prefix: string): void;
}

/**
 * Implement simple memory storage adapter.
 */
export class StorageAdapterMemory implements StorageAdapter {
	private _data: Record<string, string>;

	/**
	 * Create the memory storage adapter.
	 */
	public constructor() {
		this._data = {};
	}

	/**
	 * @inheritdoc
	 */
	public get persistent(): boolean {
		return false;
	}

	/**
	 * @inheritdoc
	 */
	public isValid(): boolean {
		return true;
	}

	/**
	 * @inheritdoc
	 */
	public exists(key: string): boolean {
		return Boolean(this._data[key]);
	}

	/**
	 * @inheritdoc
	 */
	public setItem(key: string, value: string): void {
		this._data[key] = value;
	}

	/**
	 * @inheritdoc
	 */
	public getItem(key: string): string | null {
		return this._data[key];
	}

	/**
	 * @inheritdoc
	 */
	public deleteItem(key: string): void {
		delete this._data[key];
	}

	/**
	 * @inheritdoc
	 */
	public clear(prefix: string): void {
		for(const key in this._data) {
			if(key.indexOf(prefix) === 0) {
				delete this._data[key];
			}
		}
	}
}

/**
 * Implement simple localstorage storage adapter.
 */
export class StorageAdapterLocalStorage implements StorageAdapter {
	/**
	 * @inheritdoc
	 */
	public get persistent(): boolean {
		return true;
	}

	/**
	 * @inheritdoc
	 */
	public isValid(): boolean {
		try {
			return (typeof localStorage !== "undefined") && (localStorage !== null);
		}
		catch(e) {
			return false;
		}
	}

	/**
	 * @inheritdoc
	 */
	public exists(key: string): boolean {
		return localStorage.getItem(key) !== null;
	}

	/**
	 * @inheritdoc
	 */
	public setItem(key: string, value: string): void {
		localStorage.setItem(key, value);
	}

	/**
	 * @inheritdoc
	 */
	public getItem(key: string): string | null {
		return localStorage.getItem(key);
	}

	/**
	 * @inheritdoc
	 */
	public deleteItem(key: string): void {
		localStorage.deleteItem(key);
	}

	/**
	 * @inheritdoc
	 */
	public clear(prefix: string): void {
		for(let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if(key.indexOf(prefix) === 0) {
				delete localStorage.deleteItem(key);
			}
		}
	}
}

/**
 * Implement simple sessionStorage storage adapter.
 */
export class StorageAdapterSessionStorage implements StorageAdapter {
	/**
	 * @inheritdoc
	 */
	public get persistent(): boolean {
		return false;
	}

	/**
	 * @inheritdoc
	 */
	public isValid(): boolean {
		try {
			return (typeof sessionStorage !== "undefined") && (sessionStorage !== null);
		}
		catch(e) {
			return false;
		}
	}

	/**
	 * @inheritdoc
	 */
	public exists(key: string): boolean {
		return sessionStorage.getItem(key) !== null;
	}

	/**
	 * @inheritdoc
	 */
	public setItem(key: string, value: string): void {
		sessionStorage.setItem(key, value);
	}

	/**
	 * @inheritdoc
	 */
	public getItem(key: string): string | null {
		return sessionStorage.getItem(key);
	}

	/**
	 * @inheritdoc
	 */
	public deleteItem(key: string): void {
		sessionStorage.deleteItem(key);
	}

	/**
	 * @inheritdoc
	 */
	public clear(prefix: string): void {
		for(let i = 0; i < sessionStorage.length; i++) {
			const key = sessionStorage.key(i);
			if(key.indexOf(prefix) === 0) {
				delete sessionStorage.deleteItem(key);
			}
		}
	}
}

export const StorageAdapter = {
	memory: StorageAdapterMemory,
	localStorage: StorageAdapterLocalStorage,
	sessionStorage: StorageAdapterSessionStorage,
};
