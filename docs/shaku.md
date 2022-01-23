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
    * [.gameTime](#Shaku+gameTime) ⇒ <code>GameTime</code>
    * [.version](#Shaku+version) ⇒ <code>String</code>
    * [.init(managers)](#Shaku+init) ⇒ <code>Promise</code>
    * [.destroy()](#Shaku+destroy)
    * [.startFrame()](#Shaku+startFrame)
    * [.endFrame()](#Shaku+endFrame)
    * [.silent()](#Shaku+silent)
    * [.throwErrorOnWarnings(enable)](#Shaku+throwErrorOnWarnings)
    * [.getFpsCount()](#Shaku+getFpsCount) ⇒ <code>Number</code>
    * [.getAverageFrameTime()](#Shaku+getAverageFrameTime) ⇒ <code>Number</code>
    * [.requestAnimationFrame(callback)](#Shaku+requestAnimationFrame) ⇒ <code>Number</code>
    * [.cancelAnimationFrame(id)](#Shaku+cancelAnimationFrame)
    * [.setLogger(loggerHandler)](#Shaku+setLogger)

<a name="new_Shaku_new"></a>

### new Shaku()
Create the Shaku main object.

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

### shaku.init(managers) ⇒ <code>Promise</code>
Method to select managers to use + initialize them.

**Kind**: instance method of [<code>Shaku</code>](#Shaku)  
**Returns**: <code>Promise</code> - promise to resolve when finish initialization.  

| Param | Type | Description |
| --- | --- | --- |
| managers | <code>Array.&lt;IManager&gt;</code> | Array with list of managers to use or null to use all. |

<a name="Shaku+destroy"></a>

### shaku.destroy()
Destroy all managers

**Kind**: instance method of [<code>Shaku</code>](#Shaku)  
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

