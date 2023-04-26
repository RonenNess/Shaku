![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Sprites Group

<a name="SpritesGroup"></a>

## SpritesGroup
Sprites group class.
This object is a container to hold sprites collection + parent transformations.
You need SpritesGroup to use batched rendering.

**Kind**: global class  

* [SpritesGroup](#SpritesGroup)
    * [new SpritesGroup()](#new_SpritesGroup_new)
    * [.count](#SpritesGroup+count) ⇒ <code>Number</code>
    * [.forEach(callback)](#SpritesGroup+forEach)
    * [.setColor(color)](#SpritesGroup+setColor)
    * [.getTransform()](#SpritesGroup+getTransform) ⇒ <code>Matrix</code>
    * [.add(sprite)](#SpritesGroup+add) ⇒ <code>Sprite</code>
    * [.remove(sprite)](#SpritesGroup+remove)
    * [.shift()](#SpritesGroup+shift) ⇒ <code>Sprite</code>
    * [.sort(compare)](#SpritesGroup+sort)

<a name="new_SpritesGroup_new"></a>

### new SpritesGroup()
Create the group object.

<a name="SpritesGroup+count"></a>

### spritesGroup.count ⇒ <code>Number</code>
Sprites count in group.

**Kind**: instance property of [<code>SpritesGroup</code>](#SpritesGroup)  
**Returns**: <code>Number</code> - Number of sprites in group.  
<a name="SpritesGroup+forEach"></a>

### spritesGroup.forEach(callback)
Iterate all sprites.

**Kind**: instance method of [<code>SpritesGroup</code>](#SpritesGroup)  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | Callback to run on all sprites in group. |

<a name="SpritesGroup+setColor"></a>

### spritesGroup.setColor(color)
Set color for all sprites in group.

**Kind**: instance method of [<code>SpritesGroup</code>](#SpritesGroup)  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>Color</code> | Color to set. |

<a name="SpritesGroup+getTransform"></a>

### spritesGroup.getTransform() ⇒ <code>Matrix</code>
Get group's transformations.

**Kind**: instance method of [<code>SpritesGroup</code>](#SpritesGroup)  
**Returns**: <code>Matrix</code> - Transformations matrix, or null if there's nothing to apply.  
<a name="SpritesGroup+add"></a>

### spritesGroup.add(sprite) ⇒ <code>Sprite</code>
Adds a sprite to group.

**Kind**: instance method of [<code>SpritesGroup</code>](#SpritesGroup)  
**Returns**: <code>Sprite</code> - The newly added sprite.  

| Param | Type | Description |
| --- | --- | --- |
| sprite | <code>Sprite</code> | Sprite to add. |

<a name="SpritesGroup+remove"></a>

### spritesGroup.remove(sprite)
Remove a sprite from group.

**Kind**: instance method of [<code>SpritesGroup</code>](#SpritesGroup)  

| Param | Type | Description |
| --- | --- | --- |
| sprite | <code>Sprite</code> | Sprite to remove. |

<a name="SpritesGroup+shift"></a>

### spritesGroup.shift() ⇒ <code>Sprite</code>
Shift first sprite element.

**Kind**: instance method of [<code>SpritesGroup</code>](#SpritesGroup)  
**Returns**: <code>Sprite</code> - The removed sprite.  
<a name="SpritesGroup+sort"></a>

### spritesGroup.sort(compare)
Sort sprites.

**Kind**: instance method of [<code>SpritesGroup</code>](#SpritesGroup)  

| Param | Type | Description |
| --- | --- | --- |
| compare | <code>function</code> | Comparer method. |

