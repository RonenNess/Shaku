export = Storage;
/**
 * A thin wrapper layer around storage utility.
 */
declare class Storage {
    /**
     * Create the storage.
     * @param {Array<StorageAdapter>} adapters List of storage adapters to pick from. Will use the first option returning 'isValid()' = true.
     * @param {String} prefix Optional prefix to add to all keys under this storage instance.
     * @param {Boolean} valuesAsBase64 If true, will encode and decode data as base64.
     * @param {Boolean} keysAsBase64 If true, will encode and decode keys as base64.
     */
    constructor(adapters: Array<StorageAdapter>, prefix: string, valuesAsBase64: boolean, keysAsBase64: boolean);
    _adapter: StorageAdapter;
    valuesAsBase64: boolean;
    keysAsBase64: boolean;
    _keysPrefix: string;
    /**
     * Return if this storage adapter is persistent storage or not.
     * @returns {Boolean} True if this storage type is persistent.
     */
    get persistent(): boolean;
    /**
     * Check if this storage instance has a valid adapter.
     * @returns {Boolean} True if found a valid adapter to use, false otherwise.
     */
    get isValid(): boolean;
    /**
     * Convert key to string and add prefix if needed.
     * @private
     * @param {String} key Key to normalize.
     * @returns {String} Normalized key.
     */
    private normalizeKey;
    /**
     * Check if a key exists.
     * @param {String} key Key to check.
     * @returns {Boolean} True if key exists in storage.
     */
    exists(key: string): boolean;
    /**
     * Set value.
     * @private
     */
    private _set;
    /**
     * Get value.
     * @private
     */
    private _get;
    /**
     * Set value.
     * @param {String} key Key to set.
     * @param {String} value Value to set.
     */
    setItem(key: string, value: string): void;
    /**
     * Get value.
     * @param {String} key Key to get.
     * @returns {String} Value or null if not set.
     */
    getItem(key: string): string;
    /**
     * Get value and JSON parse it.
     * @param {String} key Key to get.
     * @returns {*} Value as a dictionary object or null if not set.
     */
    getJson(key: string): any;
    /**
     * Set value as JSON.
     * @param {String} key Key to set.
     * @param {*} value Value to set as a dictionary.
     */
    setJson(key: string, value: any): void;
    /**
     * Delete value.
     * @param {String} key Key to delete.
     */
    deleteItem(key: string): void;
    /**
     * Clear all values from this storage instance, based on prefix + adapter type.
     */
    clear(): void;
}
declare namespace Storage {
    const defaultAdapters: ({
        _data: {};
        readonly persistent: boolean;
        isValid(): boolean;
        exists(key: any): boolean;
        setItem(key: any, value: any): void;
        getItem(key: any): any;
        deleteItem(key: any): void;
        clear(prefix: any): void;
    } | {
        readonly persistent: boolean;
        /**
         * Get value.
         * @private
         */
        isValid(): boolean;
        exists(key: any): boolean;
        setItem(key: any, value: any): void;
        getItem(key: any): string;
        deleteItem(key: any): void;
        clear(prefix: any): void;
    } | {
        readonly persistent: boolean;
        isValid(): boolean;
        exists(key: any): boolean;
        setItem(key: any, value: any): void;
        getItem(key: any): string;
        deleteItem(key: any): void;
        clear(prefix: any): void;
    })[];
}
import StorageAdapter = require("./storage_adapter");
//# sourceMappingURL=storage.d.ts.map