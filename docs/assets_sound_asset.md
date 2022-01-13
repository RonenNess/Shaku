![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Sound Asset

<a name="SoundAsset"></a>

## SoundAsset
A loadable sound asset.
This is the asset type you use to play sounds.

**Kind**: global class  

* [SoundAsset](#SoundAsset)
    * [.valid](#SoundAsset+valid)
    * [.load()](#SoundAsset+load) ⇒ <code>Promise</code>
    * [.destroy()](#SoundAsset+destroy)

<a name="SoundAsset+valid"></a>

### soundAsset.valid
**Kind**: instance property of [<code>SoundAsset</code>](#SoundAsset)  
<a name="SoundAsset+load"></a>

### soundAsset.load() ⇒ <code>Promise</code>
Load the sound asset from its URL.
Note that loading sounds isn't actually necessary to play sounds, this method merely pre-load the asset (so first time we play
the sound would be immediate and not delayed) and validate the data is valid.

**Kind**: instance method of [<code>SoundAsset</code>](#SoundAsset)  
**Returns**: <code>Promise</code> - Promise to resolve when fully loaded.  
<a name="SoundAsset+destroy"></a>

### soundAsset.destroy()
**Kind**: instance method of [<code>SoundAsset</code>](#SoundAsset)  
