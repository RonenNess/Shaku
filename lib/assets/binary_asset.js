/**
 * Implement binary data asset type.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\assets\binary_asset.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const Asset = require("./asset");


/**
 * A loadable binary data asset.
 * This asset type loads array of bytes from a remote file.
 */
class BinaryAsset extends Asset
{
    /** @inheritdoc */
    constructor(url)
    {
        super(url);
        this._data = null;
    }

    /**
     * Load the binary data from the asset URL.
     * @returns {Promise} Promise to resolve when fully loaded.
     */
    load()
    {
        return new Promise((resolve, reject) => {

            var request = new XMLHttpRequest();
            request.open('GET', this.url, true);
            request.responseType = 'arraybuffer';     

            // on load, validate audio content
            request.onload = () => 
            {
                if (request.readyState == 4) {
                    if (request.response) {
                        this._data = new Uint8Array(request.response);
                        this._notifyReady();
                        resolve();
                    }
                    else {
                        reject(request.statusText);
                    }
                }
            }

            // on load error, reject
            request.onerror = (e) => {
                reject(e);
            }

            // initiate request
            request.send();
        });
    }

    /**
     * Create the binary data asset from array or Uint8Array.
     * @param {Array<Number>|Uint8Array} source Data to create asset from.
     * @returns {Promise} Promise to resolve when asset is ready.
     */
    create(source)
    {
        return new Promise((resolve, reject) => {
            if (source instanceof Array) { source = new Uint8Array(source); }
            if (!(source instanceof Uint8Array)) { return reject("Binary asset source must be of type 'Uint8Array'!"); }
            this._data = source;
            this._notifyReady();
            resolve();
        });
    }

    /** @inheritdoc */
    get valid()
    {
        return Boolean(this._data);
    }

    /** @inheritdoc */
    destroy()
    {
        this._data = null;
    }

    /**
     * Get binary data.
     * @returns {Uint8Array} Data as bytes array.
     */
    get data()
    {
        return this._data;
    }

    /**
     * Convert and return data as string.
     * @returns {String} Data converted to string.
     */
    string()
    {
        return (new TextDecoder()).decode(this._data);
    }
}


// export the asset type.
module.exports = BinaryAsset;