![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Dynamic Array

## Classes

<dl>
<dt><a href="#DynamicArray">DynamicArray</a></dt>
<dd><p>A float 32 array that grows automatically.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#transferPolyfill">transferPolyfill()</a></dt>
<dd><p>A polyfill version of &#39;ArrayBuffer.transfer&#39;.
If native ArrayBuffer.transfer exists, will use it internally.
From: <a href="https://reference.codeproject.com/javascript/reference/global_objects/arraybuffer/transfer#Browser_compatibility">https://reference.codeproject.com/javascript/reference/global_objects/arraybuffer/transfer#Browser_compatibility</a></p>
</dd>
</dl>

<a name="DynamicArray"></a>

## DynamicArray
A float 32 array that grows automatically.

**Kind**: global class  

* [DynamicArray](#DynamicArray)
    * [new DynamicArray(startSize, type)](#new_DynamicArray_new)
    * [.reset()](#DynamicArray+reset)
    * [.push(value)](#DynamicArray+push)

<a name="new_DynamicArray_new"></a>

### new DynamicArray(startSize, type)
Create the array.


| Param | Type | Description |
| --- | --- | --- |
| startSize | <code>Number</code> | Starting size. |
| type | <code>\*</code> | Array type (defaults to Float32Array). |

<a name="DynamicArray+reset"></a>

### dynamicArray.reset()
Reset the array back to original size.

**Kind**: instance method of [<code>DynamicArray</code>](#DynamicArray)  
<a name="DynamicArray+push"></a>

### dynamicArray.push(value)
Push a value into the array and grow it if necessary.

**Kind**: instance method of [<code>DynamicArray</code>](#DynamicArray)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Number</code> | Value to push. |

<a name="transferPolyfill"></a>

## transferPolyfill()
A polyfill version of 'ArrayBuffer.transfer'.
If native ArrayBuffer.transfer exists, will use it internally.
From: https://reference.codeproject.com/javascript/reference/global_objects/arraybuffer/transfer#Browser_compatibility

**Kind**: global function  
