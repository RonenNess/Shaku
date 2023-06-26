![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Game Time

<a name="GameTime"></a>

## GameTime
Class to hold current game time, both elapse and delta from last frame.

**Kind**: global class  

* [GameTime](#GameTime)
    * [new GameTime()](#new_GameTime_new)
    * _instance_
        * [.timestamp](#GameTime+timestamp)
        * [.deltaTime](#GameTime+deltaTime)
        * [.elapsedTime](#GameTime+elapsedTime)
        * [.delta](#GameTime+delta)
        * [.elapsed](#GameTime+elapsed)
        * [.rawTimestamp](#GameTime+rawTimestamp)
    * _static_
        * [.rawTimestamp()](#GameTime.rawTimestamp) ⇒ <code>Number</code>
        * [.reset()](#GameTime.reset)
        * [.resetDelta()](#GameTime.resetDelta)

<a name="new_GameTime_new"></a>

### new GameTime()
create the gametime object with current time.

<a name="GameTime+timestamp"></a>

### gameTime.timestamp
Current timestamp

**Kind**: instance property of [<code>GameTime</code>](#GameTime)  
<a name="GameTime+deltaTime"></a>

### gameTime.deltaTime
Delta time struct.
Contains: milliseconds, seconds.

**Kind**: instance property of [<code>GameTime</code>](#GameTime)  
<a name="GameTime+elapsedTime"></a>

### gameTime.elapsedTime
Elapsed time struct.
Contains: milliseconds, seconds.

**Kind**: instance property of [<code>GameTime</code>](#GameTime)  
<a name="GameTime+delta"></a>

### gameTime.delta
Delta time, in seconds, since last frame.

**Kind**: instance property of [<code>GameTime</code>](#GameTime)  
<a name="GameTime+elapsed"></a>

### gameTime.elapsed
Total time, in seconds, since Shaku was initialized.

**Kind**: instance property of [<code>GameTime</code>](#GameTime)  
<a name="GameTime+rawTimestamp"></a>

### gameTime.rawTimestamp
Raw timestamp in milliseconds.
This value updates only as long as you run Shaku frames, and continue to update even if game is paused.

**Kind**: instance property of [<code>GameTime</code>](#GameTime)  
<a name="GameTime.rawTimestamp"></a>

### GameTime.rawTimestamp() ⇒ <code>Number</code>
Get raw timestamp in milliseconds.
This value updates only as long as you run Shaku frames, and continue to update even if game is paused.

**Kind**: static method of [<code>GameTime</code>](#GameTime)  
**Returns**: <code>Number</code> - raw timestamp in milliseconds.  
<a name="GameTime.reset"></a>

### GameTime.reset()
Reset elapsed and delta time.

**Kind**: static method of [<code>GameTime</code>](#GameTime)  
<a name="GameTime.resetDelta"></a>

### GameTime.resetDelta()
Reset current frame's delta time.

**Kind**: static method of [<code>GameTime</code>](#GameTime)  
