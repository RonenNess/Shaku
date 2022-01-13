![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Binary Asset

<a name="BinaryAsset"></a>

## BinaryAsset
A loadable binary data asset.
This asset type loads array of bytes from a remote file.

**Kind**: global class  

* [BinaryAsset](#BinaryAsset)
    * [.valid](#BinaryAsset+valid)
    * [.data](#BinaryAsset+data) ⇒ <code>Uint8Array</code>
    * [.load()](#BinaryAsset+load) ⇒ <code>Promise</code>
    * [.create(source)](#BinaryAsset+create) ⇒ <code>Promise</code>
    * [.destroy()](#BinaryAsset+destroy)
    * [.string()](#BinaryAsset+string) ⇒ <code>String</code>

<a name="BinaryAsset+valid"></a>

### binaryAsset.valid
**Kind**: instance property of [<code>BinaryAsset</code>](#BinaryAsset)  
<a name="BinaryAsset+data"></a>

### binaryAsset.data ⇒ <code>Uint8Array</code>
Get binary data.

**Kind**: instance property of [<code>BinaryAsset</code>](#BinaryAsset)  
**Returns**: <code>Uint8Array</code> - Data as bytes array.  
<a name="BinaryAsset+load"></a>

### binaryAsset.load() ⇒ <code>Promise</code>
Load the binary data from the asset URL.

**Kind**: instance method of [<code>BinaryAsset</code>](#BinaryAsset)  
**Returns**: <code>Promise</code> - Promise to resolve when fully loaded.  
<a name="BinaryAsset+create"></a>

### binaryAsset.create(source) ⇒ <code>Promise</code>
Create the binary data asset from array or Uint8Array.

**Kind**: instance method of [<code>BinaryAsset</code>](#BinaryAsset)  
**Returns**: <code>Promise</code> - Promise to resolve when asset is ready.  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>Array.&lt;Number&gt;</code> \| <code>Uint8Array</code> | Data to create asset from. |

<a name="BinaryAsset+destroy"></a>

### binaryAsset.destroy()
**Kind**: instance method of [<code>BinaryAsset</code>](#BinaryAsset)  
<a name="BinaryAsset+string"></a>

### binaryAsset.string() ⇒ <code>String</code>
Convert and return data as string.

**Kind**: instance method of [<code>BinaryAsset</code>](#BinaryAsset)  
**Returns**: <code>String</code> - Data converted to string.  
