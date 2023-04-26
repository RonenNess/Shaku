![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Text Batch

<a name="TextSpriteBatch"></a>

## TextSpriteBatch
Text sprite batch renderer.
Responsible to drawing a batch of characters sprites.

**Kind**: global class  

* [TextSpriteBatch](#TextSpriteBatch)
    * [new TextSpriteBatch([batchSpritesCount])](#new_TextSpriteBatch_new)
    * [.msdfFont](#TextSpriteBatch+msdfFont) : <code>Boolean</code>
    * [.outlineWeight](#TextSpriteBatch+outlineWeight) : <code>Number</code>
    * [.outlineColor](#TextSpriteBatch+outlineColor) : <code>Color</code>
    * [.defaultEffect](#TextSpriteBatch+defaultEffect)
    * [.drawText(textGroup, cullOutOfScreen)](#TextSpriteBatch+drawText)

<a name="new_TextSpriteBatch_new"></a>

### new TextSpriteBatch([batchSpritesCount])
Create the text sprites batch.


| Param | Type | Description |
| --- | --- | --- |
| [batchSpritesCount] | <code>Number</code> | Internal buffers size, in sprites count (sprite = 4 vertices). Bigger value = faster rendering but more RAM. |

<a name="TextSpriteBatch+msdfFont"></a>

### textSpriteBatch.msdfFont : <code>Boolean</code>
If true, will render as Msdf Fonts.

**Kind**: instance property of [<code>TextSpriteBatch</code>](#TextSpriteBatch)  
<a name="TextSpriteBatch+outlineWeight"></a>

### textSpriteBatch.outlineWeight : <code>Number</code>
If bigger than 0, will draw outline.
Currently not supported with msdf fonts.
Must be set before begin() is called.

**Kind**: instance property of [<code>TextSpriteBatch</code>](#TextSpriteBatch)  
<a name="TextSpriteBatch+outlineColor"></a>

### textSpriteBatch.outlineColor : <code>Color</code>
Outline color, when outlineWeight is set.
Must be set before begin() is called.

**Kind**: instance property of [<code>TextSpriteBatch</code>](#TextSpriteBatch)  
<a name="TextSpriteBatch+defaultEffect"></a>

### textSpriteBatch.defaultEffect
**Kind**: instance property of [<code>TextSpriteBatch</code>](#TextSpriteBatch)  
<a name="TextSpriteBatch+drawText"></a>

### textSpriteBatch.drawText(textGroup, cullOutOfScreen)
Add text sprites group to batch.

**Kind**: instance method of [<code>TextSpriteBatch</code>](#TextSpriteBatch)  

| Param | Type | Description |
| --- | --- | --- |
| textGroup | <code>SpritesGroup</code> | Text sprite group to draw. |
| cullOutOfScreen | <code>Boolean</code> | If true, will cull out sprites that are not visible in screen. |

