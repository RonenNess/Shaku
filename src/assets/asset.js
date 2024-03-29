/**
 * Assets base class.
 * 
 * |-- copyright and license --|
 * @module     Shaku
 * @file       shaku\src\assets\asset.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';


/**
 * A loadable asset base class.
 * All asset types inherit from this.
 */
class Asset
{
    /**
     * Create the new asset.
     * @param {String} url Asset URL / identifier.
     */
    constructor(url)
    {
        this._url = url;
        this._waitingCallbacks = [];
    }

    /**
     * Get if this asset is ready, ie loaded or created.
     * @returns {Boolean} True if asset finished loading / creating. This doesn't mean its necessarily valid, only that its done loading.
     */
    get ready()
    {
        return this._waitingCallbacks === null;
    }

    /**
     * Register a method to be called when asset is ready.
     * If asset is already in ready state, will invoke immediately.
     * @param {Function} callback Callback to invoke when asset is ready.
     */
    onReady(callback)
    {
        // already ready
        if (this.valid || this.ready) {
            callback(this);
            return;
        }

        // add to callbacks list
        this._waitingCallbacks.push(callback);
    }

    /**
     * Return a promise to resolve when ready.
     * @returns {Promise} Promise to resolve when ready.
     */
    waitForReady()
    {
        return new Promise((resolve, reject) => {
            this.onReady(resolve);
        });
    }

    /**
     * Notify all waiting callbacks that this asset is ready.
     * @private
     */
    _notifyReady()
    {
        if (this._waitingCallbacks) {
            for (let i = 0; i < this._waitingCallbacks.length; ++i) {
                this._waitingCallbacks[i](this);
            }
            this._waitingCallbacks = null;
        }
    }

    /**
     * Get asset's URL.
     * @returns {String} Asset URL.
     */
    get url()
    {
        return this._url;
    }

    /**
     * Get if this asset is loaded and valid.
     * @returns {Boolean} True if asset is loaded and valid, false otherwise.
     */
    get valid()
    {
        throw new Error("Not Implemented!");
    }

    /**
     * Load the asset from it's URL.
     * @param {*} params Optional additional params.
     * @returns {Promise} Promise to resolve when fully loaded.
     */
    load(params)
    {
        throw new Error("Not Implemented!");
    }

    /**
     * Create the asset from data source.
     * @param {*} source Data to create asset from.
     * @param {*} params Optional additional params.
     * @returns {Promise} Promise to resolve when asset is ready.
     */
    create(source, params)
    {
        throw new Error("Not Supported for this asset type.");
    }

    /**
     * Destroy the asset, freeing any allocated resources in the process.
     */
    destroy()
    {
        throw new Error("Not Implemented!");
    }
}


// export the asset base class.
module.exports = Asset;