/**
 * Implement a storage adapter.
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


/**
 * Storage adapter class that implement access to a storage device.
 * Used by the Storage utilitiy.
 */
class StorageAdapter
{
    /**
     * Return if this storage adapter is persistent storage or not.
     * @returns {Boolean} True if this storage type is persistent.
     */
    get persistent()
    {
        throw new Error("Not Implemented.");
    }

    /**
     * Check if this adapter is OK to be used.
     * For example, an adapter for localStorage will make sure it exists and not null.
     * @returns {Boolean} True if storage adapter is valid to be used.
     */
    isValid()
    {
        throw new Error("Not Implemented.");
    }

    /**
     * Check if a key exists.
     * @param {String} key Key to check.
     * @returns {Boolean} True if key exists in storage.
     */
    exists(key)
    {
        throw new Error("Not Implemented.");
    }

    /**
     * Set value.
     * @param {String} key Key to set.
     * @param {String} value Value to set.
     */
    setItem(key, value)
    {
        throw new Error("Not Implemented.");
    }

    /**
     * Get value.
     * @param {String} key Key to get.
     * @returns {String} Value or null if not set.
     */
    getItem(key)
    {
        throw new Error("Not Implemented.");
    }

    /**
     * Delete value.
     * @param {String} key Key to delete.
     */
    deleteItem(key)
    {
        throw new Error("Not Implemented.");
    }
    
    /**
     * Clear all values from this storage device.
     * @param {String} prefix Storage keys prefix.
     */
    clear(prefix)
    {
        throw new Error("Not Implemented.");
    }
}


/**
 * Implement simple memory storage adapter.
 */
class StorageAdapterMemory
{
    /**
     * Create the memory storage adapter.
     */
    constructor()
    {
        this._data = {};
    }

    /**
     * @inheritdoc
     */
    get persistent()
    {
        return false;
    }

    /**
     * @inheritdoc
     */
    isValid()
    {
        return true;
    }

    /**
     * @inheritdoc
     */
    exists(key)
    {
        return Boolean(this._data[key]);
    }

    /**
     * @inheritdoc
     */
    setItem(key, value)
    {
        this._data[key] = value;
    }

    /**
     * @inheritdoc
     */
    getItem(key)
    {
        return this._data[key];
    }

    /**
     * @inheritdoc
     */
    deleteItem(key)
    {
        delete this._data[key];
    }
    
    /**
     * @inheritdoc
     */
    clear(prefix)
    {
        for (let key in this._data) {
            if (key.indexOf(prefix) === 0) {
                delete this._data[key];
            }
        }
    }
}
StorageAdapter.memory = StorageAdapterMemory;


/**
 * Implement simple localstorage storage adapter.
 */
class StorageAdapterLocalStorage
{
    /**
     * @inheritdoc
     */
    get persistent()
    {
        return true;
    }

    /**
     * @inheritdoc
     */
    isValid()
    {
        return (typeof localStorage !== "undefined") && (localStorage !== null);
    }

    /**
     * @inheritdoc
     */
    exists(key)
    {
        return localStorage.getItem(key) !== null;
    }

    /**
     * @inheritdoc
     */
    setItem(key, value)
    {
        localStorage.setItem(key, value);
    }

    /**
     * @inheritdoc
     */
    getItem(key)
    {
        return localStorage.getItem(key);
    }

    /**
     * @inheritdoc
     */
    deleteItem(key)
    {
        localStorage.deleteItem(key);
    }
    
    /**
     * @inheritdoc
     */
    clear(prefix)
    {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.indexOf(prefix) === 0) {
                delete localStorage.deleteItem(key);
            }
        }
    }
}
StorageAdapter.localStorage = StorageAdapterLocalStorage;


// export the storage adapter class
module.exports = StorageAdapter;