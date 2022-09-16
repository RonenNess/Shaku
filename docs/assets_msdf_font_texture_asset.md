![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Msdf Font Texture Asset

<a name="MsdfFontTextureAsset"></a>

## MsdfFontTextureAsset
A MSDF font texture asset, from a pregenerated msdf texture atlas (from msdf-bmfont-xml, for example).
This asset uses a signed distance field atlas to render characters as sprites at high res.

**Kind**: global class  

* [MsdfFontTextureAsset](#MsdfFontTextureAsset)
    * [.load(params)](#MsdfFontTextureAsset+load) ⇒ <code>Promise</code>
    * [.getPositionOffset()](#MsdfFontTextureAsset+getPositionOffset)
    * [.getXAdvance()](#MsdfFontTextureAsset+getXAdvance)
    * [.destroy()](#MsdfFontTextureAsset+destroy)

<a name="MsdfFontTextureAsset+load"></a>

### msdfFontTextureAsset.load(params) ⇒ <code>Promise</code>
Generate the font metadata and texture from the given URL.

**Kind**: instance method of [<code>MsdfFontTextureAsset</code>](#MsdfFontTextureAsset)  
**Returns**: <code>Promise</code> - Promise to resolve when fully loaded.  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>\*</code> | Additional params. Possible values are:                      - jsonUrl: mandatory url for the font's json metadata (generated via msdf-bmfont-xml, for example)                      - textureUrl: mandatory url for the font's texture atlas (generated via msdf-bmfont-xml, for example)                      - missingCharPlaceholder (default='?'): character to use for missing characters. |

<a name="MsdfFontTextureAsset+getPositionOffset"></a>

### msdfFontTextureAsset.getPositionOffset()
**Kind**: instance method of [<code>MsdfFontTextureAsset</code>](#MsdfFontTextureAsset)  
<a name="MsdfFontTextureAsset+getXAdvance"></a>

### msdfFontTextureAsset.getXAdvance()
**Kind**: instance method of [<code>MsdfFontTextureAsset</code>](#MsdfFontTextureAsset)  
<a name="MsdfFontTextureAsset+destroy"></a>

### msdfFontTextureAsset.destroy()
**Kind**: instance method of [<code>MsdfFontTextureAsset</code>](#MsdfFontTextureAsset)  
