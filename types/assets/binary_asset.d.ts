export = BinaryAsset;
/**
 * A loadable binary data asset.
 * This asset type loads array of bytes from a remote file.
 */
declare class BinaryAsset extends Asset {
    /** @inheritdoc */
    constructor(url: any);
    _data: Uint8Array;
    /**
     * Load the binary data from the asset URL.
     * @returns {Promise} Promise to resolve when fully loaded.
     */
    load(): Promise<any>;
    /**
     * Create the binary data asset from array or Uint8Array.
     * @param {Array<Number>|Uint8Array} source Data to create asset from.
     * @returns {Promise} Promise to resolve when asset is ready.
     */
    create(source: Array<number> | Uint8Array): Promise<any>;
    /**
     * Get binary data.
     * @returns {Uint8Array} Data as bytes array.
     */
    get data(): Uint8Array;
    /**
     * Convert and return data as string.
     * @returns {String} Data converted to string.
     */
    string(): string;
}
import Asset = require("./asset");
//# sourceMappingURL=binary_asset.d.ts.map