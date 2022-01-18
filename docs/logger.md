![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Logger

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

