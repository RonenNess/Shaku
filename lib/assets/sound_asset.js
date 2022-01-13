/**
 * Implement sound asset type.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\assets\sound_asset.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const Asset = require("./asset");

 
/**
 * A loadable sound asset.
 * This is the asset type you use to play sounds.
 */
class SoundAsset extends Asset
{
    /** @inheritdoc */
    constructor(url)
    {
        super(url);
        this._valid = false;
    }


    /**
     * Load the sound asset from its URL.
     * Note that loading sounds isn't actually necessary to play sounds, this method merely pre-load the asset (so first time we play
     * the sound would be immediate and not delayed) and validate the data is valid. 
     * @returns {Promise} Promise to resolve when fully loaded.
     */
    load()
    {
        // for audio files we force preload and validation of the audio file.
        // note: we can't use the Audio object as it won't work without page interaction.
        return new Promise((resolve, reject) => {

            // create request to load audio file
            let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            var request = new XMLHttpRequest();
            request.open('GET', this.url, true);
            request.responseType = 'arraybuffer';     

            // on load, validate audio content
            request.onload = () => 
            {
                var audioData = request.response;
                this._valid = true; // <-- good enough for now, as decodeAudio won't work before user's input
                audioCtx.decodeAudioData(audioData, function(buffer) {
                    resolve();
                },
                (e) => { 
                    reject(e.err); 
                });
            }

            // on load error, reject
            request.onerror = (e) => {
                reject(e);
            }

            // initiate request
            request.send();
        });
    }

    /** @inheritdoc */
    get valid()
    {
        return this._valid;
    }
    
    /** @inheritdoc */
    destroy()
    {
        this._valid = false;
    }
}

 
// export the asset type.
module.exports = SoundAsset;