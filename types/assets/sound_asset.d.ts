export = SoundAsset;
/**
 * A loadable sound asset.
 * This is the asset type you use to play sounds.
 */
declare class SoundAsset extends Asset {
    /** @inheritdoc */
    constructor(url: any);
    _valid: boolean;
    /**
     * Load the sound asset from its URL.
     * Note that loading sounds isn't actually necessary to play sounds, this method merely pre-load the asset (so first time we play
     * the sound would be immediate and not delayed) and validate the data is valid.
     * @returns {Promise} Promise to resolve when fully loaded.
     */
    load(): Promise<any>;
}
import Asset = require("./asset");
//# sourceMappingURL=sound_asset.d.ts.map