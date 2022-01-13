![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Manager

<a name="IManager"></a>

## IManager
Interface for any manager.
Manager = manages a domain in Shaku, such as gfx (graphics), sfx (sounds), input, etc.

**Kind**: global class  

* [IManager](#IManager)
    * [.setup()](#IManager+setup) ⇒ <code>Promise</code>
    * [.startFrame()](#IManager+startFrame)
    * [.endFrame()](#IManager+endFrame)
    * [.destroy()](#IManager+destroy)

<a name="IManager+setup"></a>

### iManager.setup() ⇒ <code>Promise</code>
Initialize the manager.

**Kind**: instance method of [<code>IManager</code>](#IManager)  
**Returns**: <code>Promise</code> - Promise to resolve when initialization is done.  
<a name="IManager+startFrame"></a>

### iManager.startFrame()
Called every update at the begining of the frame.

**Kind**: instance method of [<code>IManager</code>](#IManager)  
<a name="IManager+endFrame"></a>

### iManager.endFrame()
Called every update at the end of the frame.

**Kind**: instance method of [<code>IManager</code>](#IManager)  
<a name="IManager+destroy"></a>

### iManager.destroy()
Destroy the manager.

**Kind**: instance method of [<code>IManager</code>](#IManager)  
