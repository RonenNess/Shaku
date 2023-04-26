![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Logger

## Classes

<dl>
<dt><a href="#Logger">Logger</a></dt>
<dd><p>A logger manager.
By default writes logs to console.</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#LoggerModule">LoggerModule</a></dt>
<dd><p>The Logger module is a small object to get loggers and control the underlying logger drivers.</p>
</dd>
</dl>

<a name="Logger"></a>

## Logger
A logger manager.
By default writes logs to console.

**Kind**: global class  

* [Logger](#Logger)
    * [.trace(msg)](#Logger+trace)
    * [.debug(msg)](#Logger+debug)
    * [.info(msg)](#Logger+info)
    * [.warn(msg)](#Logger+warn)
    * [.error(msg)](#Logger+error)
    * [.throwErrorOnWarnings(enable)](#Logger+throwErrorOnWarnings)

<a name="Logger+trace"></a>

### logger.trace(msg)
Write a trace level log message.

**Kind**: instance method of [<code>Logger</code>](#Logger)  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>String</code> | Message to write. |

<a name="Logger+debug"></a>

### logger.debug(msg)
Write a debug level log message.

**Kind**: instance method of [<code>Logger</code>](#Logger)  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>String</code> | Message to write. |

<a name="Logger+info"></a>

### logger.info(msg)
Write an info level log message.

**Kind**: instance method of [<code>Logger</code>](#Logger)  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>String</code> | Message to write. |

<a name="Logger+warn"></a>

### logger.warn(msg)
Write a warning level log message.

**Kind**: instance method of [<code>Logger</code>](#Logger)  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>String</code> | Message to write. |

<a name="Logger+error"></a>

### logger.error(msg)
Write an error level log message.

**Kind**: instance method of [<code>Logger</code>](#Logger)  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>String</code> | Message to write. |

<a name="Logger+throwErrorOnWarnings"></a>

### logger.throwErrorOnWarnings(enable)
Set logger to throw an error every time a log message with severity higher than warning is written.

**Kind**: instance method of [<code>Logger</code>](#Logger)  

| Param | Type | Description |
| --- | --- | --- |
| enable | <code>Boolean</code> | Set to true to throw error on warnings. |

<a name="LoggerModule"></a>

## LoggerModule
The Logger module is a small object to get loggers and control the underlying logger drivers.

**Kind**: global constant  

* [LoggerModule](#LoggerModule)
    * [.getLogger(name)](#LoggerModule.getLogger) ⇒ [<code>Logger</code>](#Logger)
    * [.silent()](#LoggerModule.silent)
    * [.setDrivers()](#LoggerModule.setDrivers)
    * [.setApplicationName(name)](#LoggerModule.setApplicationName)

<a name="LoggerModule.getLogger"></a>

### LoggerModule.getLogger(name) ⇒ [<code>Logger</code>](#Logger)
Get a logger object for a given logger name.

**Kind**: static method of [<code>LoggerModule</code>](#LoggerModule)  
**Returns**: [<code>Logger</code>](#Logger) - Logger to use.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Logger name. |

<a name="LoggerModule.silent"></a>

### LoggerModule.silent()
Silent the logger.

**Kind**: static method of [<code>LoggerModule</code>](#LoggerModule)  
<a name="LoggerModule.setDrivers"></a>

### LoggerModule.setDrivers()
Set log drivers that implement trace, debug, info, warn and error that all loggers will use.

**Kind**: static method of [<code>LoggerModule</code>](#LoggerModule)  
<a name="LoggerModule.setApplicationName"></a>

### LoggerModule.setApplicationName(name)
Set logger application name.

**Kind**: static method of [<code>LoggerModule</code>](#LoggerModule)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Set application name to replace the 'Shaku' in the headers. |

