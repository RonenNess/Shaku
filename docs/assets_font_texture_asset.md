![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Font Texture Asset

## Classes

<dl>
<dt><a href="#FontTextureAsset">FontTextureAsset</a></dt>
<dd><p>A font texture asset, dynamically generated from loaded font and canvas.
This asset type creates an atlas of all the font&#39;s characters as textures, so we can later render them as sprites.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#measureTextHeight">measureTextHeight()</a></dt>
<dd><p>Measure font&#39;s actual height.</p>
</dd>
<dt><a href="#measureTextWidth">measureTextWidth()</a></dt>
<dd><p>Measure font&#39;s actual width.</p>
</dd>
</dl>

<a name="FontTextureAsset"></a>

## FontTextureAsset
A font texture asset, dynamically generated from loaded font and canvas.
This asset type creates an atlas of all the font's characters as textures, so we can later render them as sprites.

**Kind**: global class  

* [FontTextureAsset](#FontTextureAsset)
    * [.lineHeight](#FontTextureAsset+lineHeight)
    * [.fontName](#FontTextureAsset+fontName)
    * [.fontSize](#FontTextureAsset+fontSize)
    * [.placeholderCharacter](#FontTextureAsset+placeholderCharacter)
    * [.texture](#FontTextureAsset+texture)
    * [.valid](#FontTextureAsset+valid)
    * [.load(params)](#FontTextureAsset+load) ⇒ <code>Promise</code>
    * [.getSourceRect(character)](#FontTextureAsset+getSourceRect) ⇒ <code>Rectangle</code>
    * [.getPositionOffset(character)](#FontTextureAsset+getPositionOffset) ⇒ <code>Vector2</code>
    * [.getXAdvance(character)](#FontTextureAsset+getXAdvance) ⇒ <code>Number</code>
    * [.destroy()](#FontTextureAsset+destroy)

<a name="FontTextureAsset+lineHeight"></a>

### fontTextureAsset.lineHeight
Get line height.

**Kind**: instance property of [<code>FontTextureAsset</code>](#FontTextureAsset)  
<a name="FontTextureAsset+fontName"></a>

### fontTextureAsset.fontName
Get font name.

**Kind**: instance property of [<code>FontTextureAsset</code>](#FontTextureAsset)  
<a name="FontTextureAsset+fontSize"></a>

### fontTextureAsset.fontSize
Get font size.

**Kind**: instance property of [<code>FontTextureAsset</code>](#FontTextureAsset)  
<a name="FontTextureAsset+placeholderCharacter"></a>

### fontTextureAsset.placeholderCharacter
Get placeholder character.

**Kind**: instance property of [<code>FontTextureAsset</code>](#FontTextureAsset)  
<a name="FontTextureAsset+texture"></a>

### fontTextureAsset.texture
Get the texture.

**Kind**: instance property of [<code>FontTextureAsset</code>](#FontTextureAsset)  
<a name="FontTextureAsset+valid"></a>

### fontTextureAsset.valid
**Kind**: instance property of [<code>FontTextureAsset</code>](#FontTextureAsset)  
<a name="FontTextureAsset+load"></a>

### fontTextureAsset.load(params) ⇒ <code>Promise</code>
Generate the font texture from a font found in given URL.

**Kind**: instance method of [<code>FontTextureAsset</code>](#FontTextureAsset)  
**Returns**: <code>Promise</code> - Promise to resolve when fully loaded.  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>\*</code> | Additional params. Possible values are:                      - fontName: mandatory font name. on some browsers if the font name does not match the font you actually load via the URL, it will not be loaded properly.                      - missingCharPlaceholder (default='?'): character to use for missing characters.                      - smoothFont (default=true): if true, will set font to smooth mode.                      - fontSize (default=52): font size in texture. larget font size will take more memory, but allow for sharper text rendering in larger scales.                      - enforceTexturePowerOfTwo (default=true): if true, will force texture size to be power of two.                      - maxTextureWidth (default=1024): max texture width.                      - charactersSet (default=FontTextureAsset.defaultCharactersSet): which characters to set in the texture.                      - extraPadding (default=0,0): Optional extra padding to add around characters in texture.                      - sourceRectOffsetAdjustment (default=0,0): Optional extra offset in characters source rectangles. Use this for fonts that are too low / height and bleed into other characters source rectangles. |

<a name="FontTextureAsset+getSourceRect"></a>

### fontTextureAsset.getSourceRect(character) ⇒ <code>Rectangle</code>
Get the source rectangle for a given character in texture.

**Kind**: instance method of [<code>FontTextureAsset</code>](#FontTextureAsset)  
**Returns**: <code>Rectangle</code> - Source rectangle for character.  

| Param | Type | Description |
| --- | --- | --- |
| character | <code>Character</code> | Character to get source rect for. |

<a name="FontTextureAsset+getPositionOffset"></a>

### fontTextureAsset.getPositionOffset(character) ⇒ <code>Vector2</code>
When drawing the character, get the offset to add to the cursor.

**Kind**: instance method of [<code>FontTextureAsset</code>](#FontTextureAsset)  
**Returns**: <code>Vector2</code> - Offset to add to the cursor before drawing the character.  

| Param | Type | Description |
| --- | --- | --- |
| character | <code>Character</code> | Character to get the offset for. |

<a name="FontTextureAsset+getXAdvance"></a>

### fontTextureAsset.getXAdvance(character) ⇒ <code>Number</code>
Get how much to advance the cursor when drawing this character.

**Kind**: instance method of [<code>FontTextureAsset</code>](#FontTextureAsset)  
**Returns**: <code>Number</code> - Distance to move the cursor after drawing the character.  

| Param | Type | Description |
| --- | --- | --- |
| character | <code>Character</code> | Character to get the advance for. |

<a name="FontTextureAsset+destroy"></a>

### fontTextureAsset.destroy()
**Kind**: instance method of [<code>FontTextureAsset</code>](#FontTextureAsset)  
<a name="measureTextHeight"></a>

## measureTextHeight()
Measure font's actual height.

**Kind**: global function  
<a name="measureTextWidth"></a>

## measureTextWidth()
Measure font's actual width.

**Kind**: global function  
