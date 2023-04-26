![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Shaku

<a name="Shaku"></a>

## Shaku
Shaku's main object.
This object wraps the entire lib namespace, and this is what you use to access all managers and manage your main loop.

**Kind**: global class  

* [Shaku](#Shaku)
    * [new Shaku()](#new_Shaku_new)
    * [.utils](#Shaku+utils) : <code>Utils</code>
    * [.sfx](#Shaku+sfx) : <code>Sfx</code>
    * [.gfx](#Shaku+gfx) : <code>Gfx</code>
    * [.input](#Shaku+input) : <code>Input</code>
    * [.assets](#Shaku+assets) : <code>Assets</code>
    * [.collision](#Shaku+collision) : <code>Collision</code>
    * [.pauseWhenNotFocused](#Shaku+pauseWhenNotFocused) : <code>Boolean</code>
    * [.pause](#Shaku+pause) : <code>Boolean</code>
    * [.pauseGameTime](#Shaku+pauseGameTime) : <code>Boolean</code>
    * [.gameTime](#Shaku+gameTime) ⇒ <code>GameTime</code>
    * [.version](#Shaku+version) ⇒ <code>String</code>
    * [.init([managers])](#Shaku+init) ⇒ <code>Promise</code>
    * [.destroy()](#Shaku+destroy)
    * [.isCurrentlyPaused()](#Shaku+isCurrentlyPaused) ⇒ <code>Boolean</code>
    * [.startFrame()](#Shaku+startFrame)
    * [.endFrame()](#Shaku+endFrame)
    * [.silent()](#Shaku+silent)
    * [.throwErrorOnWarnings(enable)](#Shaku+throwErrorOnWarnings)
    * [.getFpsCount()](#Shaku+getFpsCount) ⇒ <code>Number</code>
    * [.getAverageFrameTime()](#Shaku+getAverageFrameTime) ⇒ <code>Number</code>
    * [.requestAnimationFrame(callback)](#Shaku+requestAnimationFrame) ⇒ <code>Number</code>
    * [.cancelAnimationFrame(id)](#Shaku+cancelAnimationFrame)
    * [.setLogger(loggerHandler)](#Shaku+setLogger)
    * [.getLogger()](#Shaku+getLogger) ⇒ <code>Logger</code>

<a name="new_Shaku_new"></a>

### new Shaku()
Create the Shaku main object.

<a name="Shaku+utils"></a>

### shaku.utils : <code>Utils</code>
Different utilities and framework objects, like vectors, rectangles, colors, etc.

**Kind**: instance property of [<code>Shaku</code>](#Shaku)  
<a name="Shaku+sfx"></a>

### shaku.sfx : <code>Sfx</code>
Sound effects and music manager.

**Kind**: instance property of [<code>Shaku</code>](#Shaku)  
<a name="Shaku+gfx"></a>

### shaku.gfx : <code>Gfx</code>
Graphics manager.

**Kind**: instance property of [<code>Shaku</code>](#Shaku)  
<a name="Shaku+input"></a>

### shaku.input : <code>Input</code>
Input manager.

**Kind**: instance property of [<code>Shaku</code>](#Shaku)  
<a name="Shaku+assets"></a>

### shaku.assets : <code>Assets</code>
Assets manager.

**Kind**: instance property of [<code>Shaku</code>](#Shaku)  
<a name="Shaku+collision"></a>

### shaku.collision : <code>Collision</code>
Collision detection manager.

**Kind**: instance property of [<code>Shaku</code>](#Shaku)  
<a name="Shaku+pauseWhenNotFocused"></a>

### shaku.pauseWhenNotFocused : <code>Boolean</code>
If true, will pause the updates and drawing calls when window is not focused.
Will also not update elapsed time.

**Kind**: instance property of [<code>Shaku</code>](#Shaku)  
<a name="Shaku+pause"></a>

### shaku.pause : <code>Boolean</code>
Set to true to completely pause Shaku (will skip updates, drawing, and time counting).

**Kind**: instance property of [<code>Shaku</code>](#Shaku)  
<a name="Shaku+pauseGameTime"></a>

### shaku.pauseGameTime : <code>Boolean</code>
Set to true to pause just the game time.
This will not pause real-life time. If you need real-life time stop please use the Python package.

**Kind**: instance property of [<code>Shaku</code>](#Shaku)  
<a name="Shaku+gameTime"></a>

### shaku.gameTime ⇒ <code>GameTime</code>
Get current frame game time.
Only valid between startFrame() and endFrame().

**Kind**: instance property of [<code>Shaku</code>](#Shaku)  
**Returns**: <code>GameTime</code> - Current frame's gametime.  
<a name="Shaku+version"></a>

### shaku.version ⇒ <code>String</code>
Get Shaku's version.

**Kind**: instance property of [<code>Shaku</code>](#Shaku)  
**Returns**: <code>String</code> - Shaku's version.  
<a name="Shaku+init"></a>

### shaku.init([managers]) ⇒ <code>Promise</code>
Method to select managers to use + initialize them.

**Kind**: instance method of [<code>Shaku</code>](#Shaku)  
**Returns**: <code>Promise</code> - promise to resolve when finish initialization.  

| Param | Type | Description |
| --- | --- | --- |
| [managers] | <code>Array.&lt;IManager&gt;</code> | Array with list of managers to use or null to use all. |

<a name="Shaku+destroy"></a>

### shaku.destroy()
Destroy all managers

**Kind**: instance method of [<code>Shaku</code>](#Shaku)  
<a name="Shaku+isCurrentlyPaused"></a>

### shaku.isCurrentlyPaused() ⇒ <code>Boolean</code>
Get if the Shaku is currently paused, either because the 'paused' property is set, or because the document is not focused.

**Kind**: instance method of [<code>Shaku</code>](#Shaku)  
**Returns**: <code>Boolean</code> - True if currently paused for any reason.  
<a name="Shaku+startFrame"></a>

### shaku.startFrame()
Start frame (update all managers).

**Kind**: instance method of [<code>Shaku</code>](#Shaku)  
<a name="Shaku+endFrame"></a>

### shaku.endFrame()
End frame (update all managers).

**Kind**: instance method of [<code>Shaku</code>](#Shaku)  
<a name="Shaku+silent"></a>

### shaku.silent()
Make Shaku run in silent mode, without logs.
You can call this before init.

**Kind**: instance method of [<code>Shaku</code>](#Shaku)  
<a name="Shaku+throwErrorOnWarnings"></a>

### shaku.throwErrorOnWarnings(enable)
Set logger to throw an error every time a log message with severity higher than warning is written.
You can call this before init.

**Kind**: instance method of [<code>Shaku</code>](#Shaku)  

| Param | Type | Description |
| --- | --- | --- |
| enable | <code>Boolean</code> | Set to true to throw error on warnings. |

<a name="Shaku+getFpsCount"></a>

### shaku.getFpsCount() ⇒ <code>Number</code>
Return current FPS count.
Note: will return 0 until at least one second have passed.

**Kind**: instance method of [<code>Shaku</code>](#Shaku)  
**Returns**: <code>Number</code> - FPS count.  
<a name="Shaku+getAverageFrameTime"></a>

### shaku.getAverageFrameTime() ⇒ <code>Number</code>
Get how long on average it takes to complete a game frame.

**Kind**: instance method of [<code>Shaku</code>](#Shaku)  
**Returns**: <code>Number</code> - Average time, in milliseconds, it takes to complete a game frame.  
<a name="Shaku+requestAnimationFrame"></a>

### shaku.requestAnimationFrame(callback) ⇒ <code>Number</code>
Request animation frame with fallbacks.

**Kind**: instance method of [<code>Shaku</code>](#Shaku)  
**Returns**: <code>Number</code> - Handle for cancellation.  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | Method to invoke in next animation frame. |

<a name="Shaku+cancelAnimationFrame"></a>

### shaku.cancelAnimationFrame(id)
Cancel animation frame with fallbacks.

**Kind**: instance method of [<code>Shaku</code>](#Shaku)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>Number</code> | Request handle. |

<a name="Shaku+setLogger"></a>

### shaku.setLogger(loggerHandler)
Set the logger writer class (will replace the default console output).

**Kind**: instance method of [<code>Shaku</code>](#Shaku)  

| Param | Type | Description |
| --- | --- | --- |
| loggerHandler | <code>\*</code> | New logger handler (must implement trace, debug, info, warn, error methods). |

<a name="Shaku+getLogger"></a>

### shaku.getLogger() ⇒ <code>Logger</code>
Get / create a custom logger.

**Kind**: instance method of [<code>Shaku</code>](#Shaku)  
**Returns**: <code>Logger</code> - Logger instance.  
