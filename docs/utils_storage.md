![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Storage

<a name="Storage"></a>

## Storage
A thin wrapper layer around storage utility.

**Kind**: global class  

* [Storage](#Storage)
    * [new Storage(adapters, prefix, valuesAsBase64, keysAsBase64)](#new_Storage_new)
    * _instance_
        * [.persistent](#Storage+persistent) ⇒ <code>Boolean</code>
        * [.isValid](#Storage+isValid) ⇒ <code>Boolean</code>
        * [.exists(key)](#Storage+exists) ⇒ <code>Boolean</code>
        * [.setItem(key, value)](#Storage+setItem)
        * [.getItem(key)](#Storage+getItem) ⇒ <code>String</code>
        * [.getJson(key)](#Storage+getJson) ⇒ <code>\*</code>
        * [.setJson(key, value)](#Storage+setJson)
        * [.deleteItem(key)](#Storage+deleteItem)
        * [.clear()](#Storage+clear)
    * _static_
        * [.defaultAdapters](#Storage.defaultAdapters)

<a name="new_Storage_new"></a>

### new Storage(adapters, prefix, valuesAsBase64, keysAsBase64)
Create the storage.


| Param | Type | Description |
| --- | --- | --- |
| adapters | <code>Array.&lt;StorageAdapter&gt;</code> | List of storage adapters to pick from. Will use the first option returning 'isValid()' = true. |
| prefix | <code>String</code> | Optional prefix to add to all keys under this storage instance. |
| valuesAsBase64 | <code>Boolean</code> | If true, will encode and decode data as base64. |
| keysAsBase64 | <code>Boolean</code> | If true, will encode and decode keys as base64. |

<a name="Storage+persistent"></a>

### storage.persistent ⇒ <code>Boolean</code>
Return if this storage adapter is persistent storage or not.

**Kind**: instance property of [<code>Storage</code>](#Storage)  
**Returns**: <code>Boolean</code> - True if this storage type is persistent.  
<a name="Storage+isValid"></a>

### storage.isValid ⇒ <code>Boolean</code>
Check if this storage instance has a valid adapter.

**Kind**: instance property of [<code>Storage</code>](#Storage)  
**Returns**: <code>Boolean</code> - True if found a valid adapter to use, false otherwise.  
<a name="Storage+exists"></a>

### storage.exists(key) ⇒ <code>Boolean</code>
Check if a key exists.

**Kind**: instance method of [<code>Storage</code>](#Storage)  
**Returns**: <code>Boolean</code> - True if key exists in storage.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | Key to check. |

<a name="Storage+setItem"></a>

### storage.setItem(key, value)
Set value.

**Kind**: instance method of [<code>Storage</code>](#Storage)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | Key to set. |
| value | <code>String</code> | Value to set. |

<a name="Storage+getItem"></a>

### storage.getItem(key) ⇒ <code>String</code>
Get value.

**Kind**: instance method of [<code>Storage</code>](#Storage)  
**Returns**: <code>String</code> - Value or null if not set.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | Key to get. |

<a name="Storage+getJson"></a>

### storage.getJson(key) ⇒ <code>\*</code>
Get value and JSON parse it.

**Kind**: instance method of [<code>Storage</code>](#Storage)  
**Returns**: <code>\*</code> - Value as a dictionary object or null if not set.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | Key to get. |

<a name="Storage+setJson"></a>

### storage.setJson(key, value)
Set value as JSON.

**Kind**: instance method of [<code>Storage</code>](#Storage)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | Key to set. |
| value | <code>\*</code> | Value to set as a dictionary. |

<a name="Storage+deleteItem"></a>

### storage.deleteItem(key)
Delete value.

**Kind**: instance method of [<code>Storage</code>](#Storage)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | Key to delete. |

<a name="Storage+clear"></a>

### storage.clear()
Clear all values from this storage instance, based on prefix + adapter type.

**Kind**: instance method of [<code>Storage</code>](#Storage)  
<a name="Storage.defaultAdapters"></a>

### Storage.defaultAdapters
Default adapters to use when no adapters list is provided.

**Kind**: static property of [<code>Storage</code>](#Storage)  
