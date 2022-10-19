export = StorageAdapter;
/**
 * Storage adapter class that implement access to a storage device.
 * Used by the Storage utilitiy.
 */
declare class StorageAdapter {
    /**
     * Return if this storage adapter is persistent storage or not.
     * @returns {Boolean} True if this storage type is persistent.
     */
    get persistent(): boolean;
    /**
     * Check if this adapter is OK to be used.
     * For example, an adapter for localStorage will make sure it exists and not null.
     * @returns {Boolean} True if storage adapter is valid to be used.
     */
    isValid(): boolean;
    /**
     * Check if a key exists.
     * @param {String} key Key to check.
     * @returns {Boolean} True if key exists in storage.
     */
    exists(key: string): boolean;
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
     * Delete value.
     * @param {String} key Key to delete.
     */
    deleteItem(key: string): void;
    /**
     * Clear all values from this storage device.
     * @param {String} prefix Storage keys prefix.
     */
    clear(prefix: string): void;
}
declare namespace StorageAdapter {
    export { StorageAdapterMemory as memory };
    export { StorageAdapterLocalStorage as localStorage };
    export { StorageAdapterSessionStorage as sessionStorage };
}
/**
 * Implement simple memory storage adapter.
 */
declare class StorageAdapterMemory {
    _data: {};
    /**
     * @inheritdoc
     */
    get persistent(): boolean;
    /**
     * @inheritdoc
     */
    isValid(): boolean;
    /**
     * @inheritdoc
     */
    exists(key: any): boolean;
    /**
     * @inheritdoc
     */
    setItem(key: any, value: any): void;
    /**
     * @inheritdoc
     */
    getItem(key: any): any;
    /**
     * @inheritdoc
     */
    deleteItem(key: any): void;
    /**
     * @inheritdoc
     */
    clear(prefix: any): void;
}
/**
 * Implement simple localstorage storage adapter.
 */
declare class StorageAdapterLocalStorage {
    /**
     * @inheritdoc
     */
    get persistent(): boolean;
    /**
     * @inheritdoc
     */
    isValid(): boolean;
    /**
     * @inheritdoc
     */
    exists(key: any): boolean;
    /**
     * @inheritdoc
     */
    setItem(key: any, value: any): void;
    /**
     * @inheritdoc
     */
    getItem(key: any): string;
    /**
     * @inheritdoc
     */
    deleteItem(key: any): void;
    /**
     * @inheritdoc
     */
    clear(prefix: any): void;
}
/**
 * Implement simple sessionStorage storage adapter.
 */
declare class StorageAdapterSessionStorage {
    /**
     * @inheritdoc
     */
    get persistent(): boolean;
    /**
     * @inheritdoc
     */
    isValid(): boolean;
    /**
     * @inheritdoc
     */
    exists(key: any): boolean;
    /**
     * @inheritdoc
     */
    setItem(key: any, value: any): void;
    /**
     * @inheritdoc
     */
    getItem(key: any): string;
    /**
     * @inheritdoc
     */
    deleteItem(key: any): void;
    /**
     * @inheritdoc
     */
    clear(prefix: any): void;
}
//# sourceMappingURL=storage_adapter.d.ts.map