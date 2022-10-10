export = JsonAsset;
/**
 * A loadable json asset.
 * This asset type loads JSON from a remote file.
 */
declare class JsonAsset extends Asset {
    /** @inheritdoc */
    constructor(url: any);
    _data: any;
    /**
     * Load the JSON data from the asset URL.
     * @returns {Promise} Promise to resolve when fully loaded.
     */
    load(): Promise<any>;
    /**
     * Create the JSON data asset from object or string.
     * @param {Object|String} source Data to create asset from.
     * @returns {Promise} Promise to resolve when asset is ready.
     */
    create(source: any | string): Promise<any>;
    /**
     * Get json data.
     * @returns {*} Data as dictionary.
     */
    get data(): any;
}
import Asset = require("./asset");
//# sourceMappingURL=json_asset.d.ts.map