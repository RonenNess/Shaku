![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Lines

<a name="LinesShape"></a>

## LinesShape
Collision lines class.
This shape is made of one line or more.

**Kind**: global class  

* [LinesShape](#LinesShape)
    * [new LinesShape(lines)](#new_LinesShape_new)
    * [.shapeId](#LinesShape+shapeId)
    * [.addLines(lines)](#LinesShape+addLines)
    * [.setLines(lines)](#LinesShape+setLines)
    * [._getRadius()](#LinesShape+_getRadius)
    * [.getCenter()](#LinesShape+getCenter)
    * [._getBoundingBox()](#LinesShape+_getBoundingBox)
    * [.debugDraw(opacity)](#LinesShape+debugDraw)

<a name="new_LinesShape_new"></a>

### new LinesShape(lines)
Create the collision shape.


| Param | Type | Description |
| --- | --- | --- |
| lines | <code>Array.&lt;Line&gt;</code> \| <code>Line</code> | Starting line / lines. |

<a name="LinesShape+shapeId"></a>

### linesShape.shapeId
**Kind**: instance property of [<code>LinesShape</code>](#LinesShape)  
<a name="LinesShape+addLines"></a>

### linesShape.addLines(lines)
Add line or lines to this collision shape.

**Kind**: instance method of [<code>LinesShape</code>](#LinesShape)  

| Param | Type | Description |
| --- | --- | --- |
| lines | <code>Array.&lt;Line&gt;</code> \| <code>Line</code> | Line / lines to add. |

<a name="LinesShape+setLines"></a>

### linesShape.setLines(lines)
Set this shape from line or lines array.

**Kind**: instance method of [<code>LinesShape</code>](#LinesShape)  

| Param | Type | Description |
| --- | --- | --- |
| lines | <code>Array.&lt;Line&gt;</code> \| <code>Line</code> | Line / lines to set. |

<a name="LinesShape+_getRadius"></a>

### linesShape.\_getRadius()
**Kind**: instance method of [<code>LinesShape</code>](#LinesShape)  
<a name="LinesShape+getCenter"></a>

### linesShape.getCenter()
**Kind**: instance method of [<code>LinesShape</code>](#LinesShape)  
<a name="LinesShape+_getBoundingBox"></a>

### linesShape.\_getBoundingBox()
**Kind**: instance method of [<code>LinesShape</code>](#LinesShape)  
<a name="LinesShape+debugDraw"></a>

### linesShape.debugDraw(opacity)
Debug draw this shape.

**Kind**: instance method of [<code>LinesShape</code>](#LinesShape)  

| Param | Type | Description |
| --- | --- | --- |
| opacity | <code>Number</code> | Shape opacity factor. |

