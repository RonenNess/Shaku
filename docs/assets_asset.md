![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Asset

<a name="Asset"></a>

## Asset
A loadable asset base class.
All asset types inherit from this.

**Kind**: global class  

* [Asset](#Asset)
    * [new Asset(url)](#new_Asset_new)
    * [.url](#Asset+url) ⇒ <code>String</code>
    * [.valid](#Asset+valid) ⇒ <code>Boolean</code>
    * [.load(params)](#Asset+load) ⇒ <code>Promise</code>
    * [.create(source, params)](#Asset+create) ⇒ <code>Promise</code>
    * [.destroy()](#Asset+destroy)

<a name="new_Asset_new"></a>

### new Asset(url)
Create the new asset.


| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | Asset URL / identifier. |

<a name="Asset+url"></a>

### asset.url ⇒ <code>String</code>
Get asset's URL.

**Kind**: instance property of [<code>Asset</code>](#Asset)  
**Returns**: <code>String</code> - Asset URL.  
<a name="Asset+valid"></a>

### asset.valid ⇒ <code>Boolean</code>
Get if this asset is loaded and valid.

**Kind**: instance property of [<code>Asset</code>](#Asset)  
**Returns**: <code>Boolean</code> - True if asset is loaded and valid, false otherwise.  
<a name="Asset+load"></a>

### asset.load(params) ⇒ <code>Promise</code>
Load the asset from it's URL.

**Kind**: instance method of [<code>Asset</code>](#Asset)  
**Returns**: <code>Promise</code> - Promise to resolve when fully loaded.  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>\*</code> | Optional additional params. |

<a name="Asset+create"></a>

### asset.create(source, params) ⇒ <code>Promise</code>
Create the asset from data source.

**Kind**: instance method of [<code>Asset</code>](#Asset)  
**Returns**: <code>Promise</code> - Promise to resolve when asset is ready.  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>\*</code> | Data to create asset from. |
| params | <code>\*</code> | Optional additional params. |

<a name="Asset+destroy"></a>

### asset.destroy()
Destroy the asset, freeing any allocated resources in the process.

**Kind**: instance method of [<code>Asset</code>](#Asset)  
