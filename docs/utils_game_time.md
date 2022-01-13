![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Game Time

<a name="GameTime"></a>

## GameTime
Class to hold current game time (elapse and deltatime).

**Kind**: global class  

* [GameTime](#GameTime)
    * [new GameTime(prevTime)](#new_GameTime_new)
    * [.elapsedTime](#GameTime+elapsedTime)
    * [.deltaTime](#GameTime+deltaTime)
    * [.delta](#GameTime+delta)
    * [.elapsed](#GameTime+elapsed)

<a name="new_GameTime_new"></a>

### new GameTime(prevTime)
create the gametime object with current time.


| Param | Type | Description |
| --- | --- | --- |
| prevTime | [<code>GameTime</code>](#GameTime) | The gameTime from previous call, required to calculate delta time from last frame. |

<a name="GameTime+elapsedTime"></a>

### gameTime.elapsedTime
Elapsed time details in milliseconds and seconds.

**Kind**: instance property of [<code>GameTime</code>](#GameTime)  
<a name="GameTime+deltaTime"></a>

### gameTime.deltaTime
Delta time details in milliseconds and seconds.

**Kind**: instance property of [<code>GameTime</code>](#GameTime)  
<a name="GameTime+delta"></a>

### gameTime.delta
Delta time, in seconds, since last frame.

**Kind**: instance property of [<code>GameTime</code>](#GameTime)  
<a name="GameTime+elapsed"></a>

### gameTime.elapsed
Total time, in seconds, since Shaku was initialized.

**Kind**: instance property of [<code>GameTime</code>](#GameTime)  
