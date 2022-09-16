![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Sound Instance

<a name="SoundInstance"></a>

## SoundInstance
A sound effect instance you can play and stop.

**Kind**: global class  

* [SoundInstance](#SoundInstance)
    * [new SoundInstance(sfxManager, url)](#new_SoundInstance_new)
    * [.playbackRate](#SoundInstance+playbackRate) ⇒ <code>Number</code>
    * [.playbackRate](#SoundInstance+playbackRate)
    * [.preservesPitch](#SoundInstance+preservesPitch) ⇒ <code>Boolean</code>
    * [.preservesPitch](#SoundInstance+preservesPitch)
    * [.loop](#SoundInstance+loop) ⇒ <code>Boolean</code>
    * [.loop](#SoundInstance+loop)
    * [.volume](#SoundInstance+volume) ⇒ <code>Number</code>
    * [.volume](#SoundInstance+volume)
    * [.currentTime](#SoundInstance+currentTime) ⇒ <code>Number</code>
    * [.currentTime](#SoundInstance+currentTime)
    * [.duration](#SoundInstance+duration) ⇒ <code>Number</code>
    * [.paused](#SoundInstance+paused) ⇒ <code>Boolean</code>
    * [.playing](#SoundInstance+playing) ⇒ <code>Boolean</code>
    * [.finished](#SoundInstance+finished) ⇒ <code>Boolean</code>
    * [.disposeWhenDone()](#SoundInstance+disposeWhenDone)
    * [.dispose()](#SoundInstance+dispose)
    * [.play()](#SoundInstance+play) ⇒ <code>Promise</code>
    * [.pause()](#SoundInstance+pause)
    * [.replay()](#SoundInstance+replay) ⇒ <code>Promise</code>
    * [.stop()](#SoundInstance+stop) ⇒ <code>Boolean</code>

<a name="new_SoundInstance_new"></a>

### new SoundInstance(sfxManager, url)
Create a sound instance.


| Param | Type | Description |
| --- | --- | --- |
| sfxManager | <code>Sfx</code> | Sfx manager instance. |
| url | <code>String</code> | Sound URL or source. |

<a name="SoundInstance+playbackRate"></a>

### soundInstance.playbackRate ⇒ <code>Number</code>
Get sound effect playback rate.

**Kind**: instance property of [<code>SoundInstance</code>](#SoundInstance)  
**Returns**: <code>Number</code> - Playback rate.  
<a name="SoundInstance+playbackRate"></a>

### soundInstance.playbackRate
Set playback rate.

**Kind**: instance property of [<code>SoundInstance</code>](#SoundInstance)  

| Param | Type | Description |
| --- | --- | --- |
| val | <code>Number</code> | Playback value to set. |

<a name="SoundInstance+preservesPitch"></a>

### soundInstance.preservesPitch ⇒ <code>Boolean</code>
Get if to preserve pitch while changing playback rate.

**Kind**: instance property of [<code>SoundInstance</code>](#SoundInstance)  
**Returns**: <code>Boolean</code> - Preserve pitch state of the sound instance.  
<a name="SoundInstance+preservesPitch"></a>

### soundInstance.preservesPitch
Set if to preserve pitch while changing playback rate.

**Kind**: instance property of [<code>SoundInstance</code>](#SoundInstance)  

| Param | Type | Description |
| --- | --- | --- |
| val | <code>Boolean</code> | New preserve pitch value to set. |

<a name="SoundInstance+loop"></a>

### soundInstance.loop ⇒ <code>Boolean</code>
Get if playing in loop.

**Kind**: instance property of [<code>SoundInstance</code>](#SoundInstance)  
**Returns**: <code>Boolean</code> - If this sound should play in loop.  
<a name="SoundInstance+loop"></a>

### soundInstance.loop
Set if playing in loop.

**Kind**: instance property of [<code>SoundInstance</code>](#SoundInstance)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Boolean</code> | If this sound should play in loop. |

<a name="SoundInstance+volume"></a>

### soundInstance.volume ⇒ <code>Number</code>
Get volume.

**Kind**: instance property of [<code>SoundInstance</code>](#SoundInstance)  
**Returns**: <code>Number</code> - Sound effect volume.  
<a name="SoundInstance+volume"></a>

### soundInstance.volume
Set volume.

**Kind**: instance property of [<code>SoundInstance</code>](#SoundInstance)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Number</code> | Sound effect volume to set. |

<a name="SoundInstance+currentTime"></a>

### soundInstance.currentTime ⇒ <code>Number</code>
Get current time in track.

**Kind**: instance property of [<code>SoundInstance</code>](#SoundInstance)  
**Returns**: <code>Number</code> - Current time in playing sound.  
<a name="SoundInstance+currentTime"></a>

### soundInstance.currentTime
Set current time in track.

**Kind**: instance property of [<code>SoundInstance</code>](#SoundInstance)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Number</code> | Set current playing time in sound track. |

<a name="SoundInstance+duration"></a>

### soundInstance.duration ⇒ <code>Number</code>
Get track duration.

**Kind**: instance property of [<code>SoundInstance</code>](#SoundInstance)  
**Returns**: <code>Number</code> - Sound duration in seconds.  
<a name="SoundInstance+paused"></a>

### soundInstance.paused ⇒ <code>Boolean</code>
Get if sound is currently paused.

**Kind**: instance property of [<code>SoundInstance</code>](#SoundInstance)  
**Returns**: <code>Boolean</code> - True if sound is currently paused.  
<a name="SoundInstance+playing"></a>

### soundInstance.playing ⇒ <code>Boolean</code>
Get if sound is currently playing.

**Kind**: instance property of [<code>SoundInstance</code>](#SoundInstance)  
**Returns**: <code>Boolean</code> - True if sound is currently playing.  
<a name="SoundInstance+finished"></a>

### soundInstance.finished ⇒ <code>Boolean</code>
Get if finished playing.

**Kind**: instance property of [<code>SoundInstance</code>](#SoundInstance)  
**Returns**: <code>Boolean</code> - True if sound reached the end and didn't loop.  
<a name="SoundInstance+disposeWhenDone"></a>

### soundInstance.disposeWhenDone()
Dispose the audio object when done playing the sound.
This will call dispose() automatically when audio ends.

**Kind**: instance method of [<code>SoundInstance</code>](#SoundInstance)  
<a name="SoundInstance+dispose"></a>

### soundInstance.dispose()
Dispose the audio object and clear its resources.
When playing lots of sounds its important to call dispose on sounds you no longer use, to avoid getting hit by
"Blocked attempt to create a WebMediaPlayer" exception.

**Kind**: instance method of [<code>SoundInstance</code>](#SoundInstance)  
<a name="SoundInstance+play"></a>

### soundInstance.play() ⇒ <code>Promise</code>
Play sound.

**Kind**: instance method of [<code>SoundInstance</code>](#SoundInstance)  
**Returns**: <code>Promise</code> - Promise to return when sound start playing.  
<a name="SoundInstance+pause"></a>

### soundInstance.pause()
Pause the sound.

**Kind**: instance method of [<code>SoundInstance</code>](#SoundInstance)  
<a name="SoundInstance+replay"></a>

### soundInstance.replay() ⇒ <code>Promise</code>
Replay sound from start.

**Kind**: instance method of [<code>SoundInstance</code>](#SoundInstance)  
**Returns**: <code>Promise</code> - Promise to return when sound start playing.  
<a name="SoundInstance+stop"></a>

### soundInstance.stop() ⇒ <code>Boolean</code>
Stop the sound and go back to start.

**Kind**: instance method of [<code>SoundInstance</code>](#SoundInstance)  
**Returns**: <code>Boolean</code> - True if successfully stopped sound, false otherwise.  
