![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Storage Adapter

## Classes

<dl>
<dt><a href="#StorageAdapter">StorageAdapter</a></dt>
<dd><p>Storage adapter class that implement access to a storage device.
Used by the Storage utilitiy.</p>
</dd>
<dt><a href="#StorageAdapterMemory">StorageAdapterMemory</a></dt>
<dd><p>Implement simple memory storage adapter.</p>
</dd>
<dt><a href="#StorageAdapterLocalStorage">StorageAdapterLocalStorage</a></dt>
<dd><p>Implement simple localstorage storage adapter.</p>
</dd>
<dt><a href="#StorageAdapterSessionStorage">StorageAdapterSessionStorage</a></dt>
<dd><p>Implement simple sessionStorage storage adapter.</p>
</dd>
</dl>

<a name="StorageAdapter"></a>

## StorageAdapter
Storage adapter class that implement access to a storage device.
Used by the Storage utilitiy.

**Kind**: global class  

* [StorageAdapter](#StorageAdapter)
    * [.persistent](#StorageAdapter+persistent) ⇒ <code>Boolean</code>
    * [.isValid()](#StorageAdapter+isValid) ⇒ <code>Boolean</code>
    * [.exists(key)](#StorageAdapter+exists) ⇒ <code>Boolean</code>
    * [.setItem(key, value)](#StorageAdapter+setItem)
    * [.getItem(key)](#StorageAdapter+getItem) ⇒ <code>String</code>
    * [.deleteItem(key)](#StorageAdapter+deleteItem)
    * [.clear(prefix)](#StorageAdapter+clear)

<a name="StorageAdapter+persistent"></a>

### storageAdapter.persistent ⇒ <code>Boolean</code>
Return if this storage adapter is persistent storage or not.

**Kind**: instance property of [<code>StorageAdapter</code>](#StorageAdapter)  
**Returns**: <code>Boolean</code> - True if this storage type is persistent.  
<a name="StorageAdapter+isValid"></a>

### storageAdapter.isValid() ⇒ <code>Boolean</code>
Check if this adapter is OK to be used.
For example, an adapter for localStorage will make sure it exists and not null.

**Kind**: instance method of [<code>StorageAdapter</code>](#StorageAdapter)  
**Returns**: <code>Boolean</code> - True if storage adapter is valid to be used.  
<a name="StorageAdapter+exists"></a>

### storageAdapter.exists(key) ⇒ <code>Boolean</code>
Check if a key exists.

**Kind**: instance method of [<code>StorageAdapter</code>](#StorageAdapter)  
**Returns**: <code>Boolean</code> - True if key exists in storage.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | Key to check. |

<a name="StorageAdapter+setItem"></a>

### storageAdapter.setItem(key, value)
Set value.

**Kind**: instance method of [<code>StorageAdapter</code>](#StorageAdapter)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | Key to set. |
| value | <code>String</code> | Value to set. |

<a name="StorageAdapter+getItem"></a>

### storageAdapter.getItem(key) ⇒ <code>String</code>
Get value.

**Kind**: instance method of [<code>StorageAdapter</code>](#StorageAdapter)  
**Returns**: <code>String</code> - Value or null if not set.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | Key to get. |

<a name="StorageAdapter+deleteItem"></a>

### storageAdapter.deleteItem(key)
Delete value.

**Kind**: instance method of [<code>StorageAdapter</code>](#StorageAdapter)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | Key to delete. |

<a name="StorageAdapter+clear"></a>

### storageAdapter.clear(prefix)
Clear all values from this storage device.

**Kind**: instance method of [<code>StorageAdapter</code>](#StorageAdapter)  

| Param | Type | Description |
| --- | --- | --- |
| prefix | <code>String</code> | Storage keys prefix. |

<a name="StorageAdapterMemory"></a>

## StorageAdapterMemory
Implement simple memory storage adapter.

**Kind**: global class  

* [StorageAdapterMemory](#StorageAdapterMemory)
    * [new StorageAdapterMemory()](#new_StorageAdapterMemory_new)
    * [.persistent](#StorageAdapterMemory+persistent)
    * [.isValid()](#StorageAdapterMemory+isValid)
    * [.exists()](#StorageAdapterMemory+exists)
    * [.setItem()](#StorageAdapterMemory+setItem)
    * [.getItem()](#StorageAdapterMemory+getItem)
    * [.deleteItem()](#StorageAdapterMemory+deleteItem)
    * [.clear()](#StorageAdapterMemory+clear)

<a name="new_StorageAdapterMemory_new"></a>

### new StorageAdapterMemory()
Create the memory storage adapter.

<a name="StorageAdapterMemory+persistent"></a>

### storageAdapterMemory.persistent
**Kind**: instance property of [<code>StorageAdapterMemory</code>](#StorageAdapterMemory)  
<a name="StorageAdapterMemory+isValid"></a>

### storageAdapterMemory.isValid()
**Kind**: instance method of [<code>StorageAdapterMemory</code>](#StorageAdapterMemory)  
<a name="StorageAdapterMemory+exists"></a>

### storageAdapterMemory.exists()
**Kind**: instance method of [<code>StorageAdapterMemory</code>](#StorageAdapterMemory)  
<a name="StorageAdapterMemory+setItem"></a>

### storageAdapterMemory.setItem()
**Kind**: instance method of [<code>StorageAdapterMemory</code>](#StorageAdapterMemory)  
<a name="StorageAdapterMemory+getItem"></a>

### storageAdapterMemory.getItem()
**Kind**: instance method of [<code>StorageAdapterMemory</code>](#StorageAdapterMemory)  
<a name="StorageAdapterMemory+deleteItem"></a>

### storageAdapterMemory.deleteItem()
**Kind**: instance method of [<code>StorageAdapterMemory</code>](#StorageAdapterMemory)  
<a name="StorageAdapterMemory+clear"></a>

### storageAdapterMemory.clear()
**Kind**: instance method of [<code>StorageAdapterMemory</code>](#StorageAdapterMemory)  
<a name="StorageAdapterLocalStorage"></a>

## StorageAdapterLocalStorage
Implement simple localstorage storage adapter.

**Kind**: global class  

* [StorageAdapterLocalStorage](#StorageAdapterLocalStorage)
    * [.persistent](#StorageAdapterLocalStorage+persistent)
    * [.isValid()](#StorageAdapterLocalStorage+isValid)
    * [.exists()](#StorageAdapterLocalStorage+exists)
    * [.setItem()](#StorageAdapterLocalStorage+setItem)
    * [.getItem()](#StorageAdapterLocalStorage+getItem)
    * [.deleteItem()](#StorageAdapterLocalStorage+deleteItem)
    * [.clear()](#StorageAdapterLocalStorage+clear)

<a name="StorageAdapterLocalStorage+persistent"></a>

### storageAdapterLocalStorage.persistent
**Kind**: instance property of [<code>StorageAdapterLocalStorage</code>](#StorageAdapterLocalStorage)  
<a name="StorageAdapterLocalStorage+isValid"></a>

### storageAdapterLocalStorage.isValid()
**Kind**: instance method of [<code>StorageAdapterLocalStorage</code>](#StorageAdapterLocalStorage)  
<a name="StorageAdapterLocalStorage+exists"></a>

### storageAdapterLocalStorage.exists()
**Kind**: instance method of [<code>StorageAdapterLocalStorage</code>](#StorageAdapterLocalStorage)  
<a name="StorageAdapterLocalStorage+setItem"></a>

### storageAdapterLocalStorage.setItem()
**Kind**: instance method of [<code>StorageAdapterLocalStorage</code>](#StorageAdapterLocalStorage)  
<a name="StorageAdapterLocalStorage+getItem"></a>

### storageAdapterLocalStorage.getItem()
**Kind**: instance method of [<code>StorageAdapterLocalStorage</code>](#StorageAdapterLocalStorage)  
<a name="StorageAdapterLocalStorage+deleteItem"></a>

### storageAdapterLocalStorage.deleteItem()
**Kind**: instance method of [<code>StorageAdapterLocalStorage</code>](#StorageAdapterLocalStorage)  
<a name="StorageAdapterLocalStorage+clear"></a>

### storageAdapterLocalStorage.clear()
**Kind**: instance method of [<code>StorageAdapterLocalStorage</code>](#StorageAdapterLocalStorage)  
<a name="StorageAdapterSessionStorage"></a>

## StorageAdapterSessionStorage
Implement simple sessionStorage storage adapter.

**Kind**: global class  

* [StorageAdapterSessionStorage](#StorageAdapterSessionStorage)
    * [.persistent](#StorageAdapterSessionStorage+persistent)
    * [.isValid()](#StorageAdapterSessionStorage+isValid)
    * [.exists()](#StorageAdapterSessionStorage+exists)
    * [.setItem()](#StorageAdapterSessionStorage+setItem)
    * [.getItem()](#StorageAdapterSessionStorage+getItem)
    * [.deleteItem()](#StorageAdapterSessionStorage+deleteItem)
    * [.clear()](#StorageAdapterSessionStorage+clear)

<a name="StorageAdapterSessionStorage+persistent"></a>

### storageAdapterSessionStorage.persistent
**Kind**: instance property of [<code>StorageAdapterSessionStorage</code>](#StorageAdapterSessionStorage)  
<a name="StorageAdapterSessionStorage+isValid"></a>

### storageAdapterSessionStorage.isValid()
**Kind**: instance method of [<code>StorageAdapterSessionStorage</code>](#StorageAdapterSessionStorage)  
<a name="StorageAdapterSessionStorage+exists"></a>

### storageAdapterSessionStorage.exists()
**Kind**: instance method of [<code>StorageAdapterSessionStorage</code>](#StorageAdapterSessionStorage)  
<a name="StorageAdapterSessionStorage+setItem"></a>

### storageAdapterSessionStorage.setItem()
**Kind**: instance method of [<code>StorageAdapterSessionStorage</code>](#StorageAdapterSessionStorage)  
<a name="StorageAdapterSessionStorage+getItem"></a>

### storageAdapterSessionStorage.getItem()
**Kind**: instance method of [<code>StorageAdapterSessionStorage</code>](#StorageAdapterSessionStorage)  
<a name="StorageAdapterSessionStorage+deleteItem"></a>

### storageAdapterSessionStorage.deleteItem()
**Kind**: instance method of [<code>StorageAdapterSessionStorage</code>](#StorageAdapterSessionStorage)  
<a name="StorageAdapterSessionStorage+clear"></a>

### storageAdapterSessionStorage.clear()
**Kind**: instance method of [<code>StorageAdapterSessionStorage</code>](#StorageAdapterSessionStorage)  
