![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Json Asset

<a name="JsonAsset"></a>

## JsonAsset
A loadable json asset.
This asset type loads JSON from a remote file.

**Kind**: global class  

* [JsonAsset](#JsonAsset)
    * [.data](#JsonAsset+data) ⇒ <code>\*</code>
    * [.valid](#JsonAsset+valid)
    * [.load()](#JsonAsset+load) ⇒ <code>Promise</code>
    * [.create(source)](#JsonAsset+create) ⇒ <code>Promise</code>
    * [.destroy()](#JsonAsset+destroy)

<a name="JsonAsset+data"></a>

### jsonAsset.data ⇒ <code>\*</code>
Get json data.

**Kind**: instance property of [<code>JsonAsset</code>](#JsonAsset)  
**Returns**: <code>\*</code> - Data as dictionary.  
<a name="JsonAsset+valid"></a>

### jsonAsset.valid
**Kind**: instance property of [<code>JsonAsset</code>](#JsonAsset)  
<a name="JsonAsset+load"></a>

### jsonAsset.load() ⇒ <code>Promise</code>
Load the JSON data from the asset URL.

**Kind**: instance method of [<code>JsonAsset</code>](#JsonAsset)  
**Returns**: <code>Promise</code> - Promise to resolve when fully loaded.  
<a name="JsonAsset+create"></a>

### jsonAsset.create(source) ⇒ <code>Promise</code>
Create the JSON data asset from object or string.

**Kind**: instance method of [<code>JsonAsset</code>](#JsonAsset)  
**Returns**: <code>Promise</code> - Promise to resolve when asset is ready.  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>Object</code> \| <code>String</code> | Data to create asset from. |

<a name="JsonAsset+destroy"></a>

### jsonAsset.destroy()
**Kind**: instance method of [<code>JsonAsset</code>](#JsonAsset)  
