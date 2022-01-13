![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Sfx

<a name="Sfx"></a>

## Sfx
Sfx manager. 
Used to play sound effects and music.

To access the Sfx manager use `Shaku.sfx`.

**Kind**: global class  

* [Sfx](#Sfx)
    * [new Sfx()](#new_Sfx_new)
    * [.SoundMixer](#Sfx+SoundMixer)
    * [.playingSoundsCount](#Sfx+playingSoundsCount) ⇒ <code>Number</code>
    * [.masterVolume](#Sfx+masterVolume) ⇒ <code>Number</code>
    * [.masterVolume](#Sfx+masterVolume)
    * [.play(sound, volume, playbackRate, preservesPitch)](#Sfx+play)
    * [.stopAll()](#Sfx+stopAll)
    * [.createSound(sound)](#Sfx+createSound) ⇒ <code>SoundInstance</code>

<a name="new_Sfx_new"></a>

### new Sfx()
Create the manager.

<a name="Sfx+SoundMixer"></a>

### sfx.SoundMixer
Get the SoundMixer class.

**Kind**: instance property of [<code>Sfx</code>](#Sfx)  
**See**: SoundMixer  
<a name="Sfx+playingSoundsCount"></a>

### sfx.playingSoundsCount ⇒ <code>Number</code>
Get currently playing sounds count.

**Kind**: instance property of [<code>Sfx</code>](#Sfx)  
**Returns**: <code>Number</code> - Number of sounds currently playing.  
<a name="Sfx+masterVolume"></a>

### sfx.masterVolume ⇒ <code>Number</code>
Get master volume.
This affect all sound effects volumes.

**Kind**: instance property of [<code>Sfx</code>](#Sfx)  
**Returns**: <code>Number</code> - Current master volume value.  
<a name="Sfx+masterVolume"></a>

### sfx.masterVolume
Set master volume.
This affect all sound effects volumes.

**Kind**: instance property of [<code>Sfx</code>](#Sfx)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Number</code> | Master volume to set. |

<a name="Sfx+play"></a>

### sfx.play(sound, volume, playbackRate, preservesPitch)
Play a sound once without any special properties and without returning a sound instance.
Its a more convinient method to play sounds, but less efficient than 'createSound()' if you want to play multiple times.

**Kind**: instance method of [<code>Sfx</code>](#Sfx)  

| Param | Type | Description |
| --- | --- | --- |
| sound | <code>SoundAsset</code> | Sound asset to play. |
| volume | <code>Number</code> | Volume to play sound (default to max). |
| playbackRate | <code>Number</code> | Optional playback rate factor. |
| preservesPitch | <code>Boolean</code> | Optional preserve pitch when changing rate factor. |

**Example**  
```js
let sound = await Shaku.assets.loadSound("assets/my_sound.ogg");
Shaku.sfx.play(sound, 0.75);
```
<a name="Sfx+stopAll"></a>

### sfx.stopAll()
Stop all playing sounds.

**Kind**: instance method of [<code>Sfx</code>](#Sfx)  
**Example**  
```js
Shaku.sfx.stopAll();
```
<a name="Sfx+createSound"></a>

### sfx.createSound(sound) ⇒ <code>SoundInstance</code>
Create and return a sound instance you can use to play multiple times.

**Kind**: instance method of [<code>Sfx</code>](#Sfx)  
**Returns**: <code>SoundInstance</code> - Newly created sound instance.  

| Param | Type | Description |
| --- | --- | --- |
| sound | <code>SoundAsset</code> | Sound asset to play. |

**Example**  
```js
let sound = await Shaku.assets.loadSound("assets/my_sound.ogg");
let soundInstance = Shaku.sfx.createSound(sound);
soundInstance.play();
```
