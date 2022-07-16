/**
 * Implement a storage wrapper.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\seeded_random.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const StorageAdapter = require("./storage_adapter");


/**
 * A thin wrapper layer around storage utility.
 */
class Storage
{
    /**
     * Create the storage.
     * @param {Array<StorageAdapter>} adapters List of storage adapters to pick from. Will use the first option returning 'isValid()' = true.
     * @param {String} prefix Optional prefix to add to all keys under this storage instance.
     */
    constructor(adapters, prefix)
    {
        // default adapters
        adapters = adapters || Storage.defaultAdapters;

        // choose adapter
        this._adapter = null;
        for (let adapter of adapters) {
            if (adapter.isValid()) {
                this._adapter = adapter;
                break;
            }
        }

        // set prefix
        this._keysPrefix = 'shaku_storage_' + (prefix || '') + '_';
    }

    /**
     * Return if this storage adapter is persistent storage or not.
     * @returns {Boolean} True if this storage type is persistent.
     */
    get persistent()
    {
        return this.isValid() && this._adapter.persistent;
    }

    /**
     * Check if this storage instance has a valid adapter.
     * @returns {Boolean} True if found a valid adapter to use, false otherwise.
     */
    isValid()
    {
        return Boolean(this._adapter);
    }

    /**
     * Convert key to string and add prefix if needed.
     * @private
     * @param {String} key Key to normalize.
     * @returns {String} Normalized key.
     */
    normalizeKey(key)
    {
        return this._keysPrefix + key.toString();
    }

    /**
     * Check if a key exists.
     * @param {String} key Key to check.
     * @returns {Boolean} True if key exists in storage.
     */
    exists(key)
    {
        if (typeof key !== 'string') { throw new Error("Key must be a string!"); }
        key = this.normalizeKey(key);
        return this._adapter.exists(key);
    }

    /**
     * Set value.
     * @private
     */
    _set(key, value)
    {
        value = JSON.stringify({
            data: value,
            timestamp: (new Date()).getTime(),
            src: "Shaku",
            sver: 1.0
        });
        this._adapter.setItem(key, value);
    }

    /**
     * Set value.
     * @param {String} key Key to set.
     * @param {String} value Value to set.
     */
    setItem(key, value)
    {
        // sanity and normalize key
        if (typeof key !== 'string') { throw new Error("Key must be a string!"); }
        if (typeof value !== 'string') { throw new Error("Value must be a string!"); }
        key = this.normalizeKey(key);

        // write value with metadata
        this._set(key, value);
    }

    /**
     * Get value.
     * @param {String} key Key to get.
     * @returns {String} Value or null if not set.
     */
    getItem(key)
    {
        // sanity and normalize key
        if (typeof key !== 'string') { throw new Error("Key must be a string!"); }
        key = this.normalizeKey(key);

        // get value with metadata
        const ret = this._adapter.getItem(key);

        // not found? return null
        if (!ret) {
            return null;
        }

        // extract just data
        return JSON.parse(ret).data;
    }

    /**
     * Get value and JSON parse it.
     * @param {String} key Key to get.
     * @returns {*} Value as a dictionary object or null if not set.
     */
    getJson(key)
    {
        return this.getItem(key) || null;
    }

    /**
     * Set value as JSON.
     * @param {String} key Key to set.
     * @param {*} value Value to set as a dictionary.
     */
    setJson(key, value)
    {
        key = this.normalizeKey(key);
        this._set(key, value);
    }

    /**
     * Delete value.
     * @param {String} key Key to delete.
     */
    deleteItem(key)
    {
        if (typeof key !== 'string') { throw new Error("Key must be a string!"); }
        key = this.normalizeKey(key);
        this._adapter.deleteItem(key);
    }
    
    /**
     * Clear all values from this storage instance, based on prefix + adapter type.
     */
    clear()
    {
        this._adapter.clear(this._keysPrefix);
    }
}


/**
 * Default adapters to use when no adapters list is provided.
 */
Storage.defaultAdapters = [new StorageAdapter.localStorage(), new StorageAdapter.memory()];


// export the storage class
module.exports = Storage;