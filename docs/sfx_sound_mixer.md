![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Sound Mixer

<a name="SoundMixer"></a>

## SoundMixer
A utility class to mix between two sounds.

**Kind**: global class  

* [SoundMixer](#SoundMixer)
    * [new SoundMixer(sound1, sound2, allowOverlapping)](#new_SoundMixer_new)
    * [.fromSound](#SoundMixer+fromSound) ⇒ <code>SoundInstance</code>
    * [.toSound](#SoundMixer+toSound) ⇒ <code>SoundInstance</code>
    * [.progress](#SoundMixer+progress) ⇒ <code>Number</code>
    * [.stop()](#SoundMixer+stop)
    * [.updateDelta(delta)](#SoundMixer+updateDelta)
    * [.update(progress)](#SoundMixer+update)

<a name="new_SoundMixer_new"></a>

### new SoundMixer(sound1, sound2, allowOverlapping)
Create the sound mixer.


| Param | Type | Description |
| --- | --- | --- |
| sound1 | <code>SoundInstance</code> | Sound to mix from. Can be null to just fade in. |
| sound2 | <code>SoundInstance</code> | Sound to mix to. Can be null to just fade out. |
| allowOverlapping | <code>Boolean</code> | If true (default), will mix while overlapping sounds.                                    If false, will first finish first sound before begining next. |

<a name="SoundMixer+fromSound"></a>

### soundMixer.fromSound ⇒ <code>SoundInstance</code>
Get first sound.

**Kind**: instance property of [<code>SoundMixer</code>](#SoundMixer)  
**Returns**: <code>SoundInstance</code> - First sound instance.  
<a name="SoundMixer+toSound"></a>

### soundMixer.toSound ⇒ <code>SoundInstance</code>
Get second sound.

**Kind**: instance property of [<code>SoundMixer</code>](#SoundMixer)  
**Returns**: <code>SoundInstance</code> - Second sound instance.  
<a name="SoundMixer+progress"></a>

### soundMixer.progress ⇒ <code>Number</code>
Return current progress.

**Kind**: instance property of [<code>SoundMixer</code>](#SoundMixer)  
**Returns**: <code>Number</code> - Mix progress from 0 to 1.  
<a name="SoundMixer+stop"></a>

### soundMixer.stop()
Stop both sounds.

**Kind**: instance method of [<code>SoundMixer</code>](#SoundMixer)  
<a name="SoundMixer+updateDelta"></a>

### soundMixer.updateDelta(delta)
Update the mixer progress with time delta instead of absolute value.

**Kind**: instance method of [<code>SoundMixer</code>](#SoundMixer)  

| Param | Type | Description |
| --- | --- | --- |
| delta | <code>Number</code> | Progress delta, in seconds. |

<a name="SoundMixer+update"></a>

### soundMixer.update(progress)
Update the mixer progress.

**Kind**: instance method of [<code>SoundMixer</code>](#SoundMixer)  

| Param | Type | Description |
| --- | --- | --- |
| progress | <code>Number</code> | Transition progress from sound1 to sound2. Values must be between 0.0 to 1.0. |

