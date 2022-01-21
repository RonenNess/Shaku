![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Line

<a name="Line"></a>

## Line
Implement a simple 2d Line.

**Kind**: global class  

* [Line](#Line)
    * [new Line(from, to)](#new_Line_new)
    * _instance_
        * [.clone()](#Line+clone) ⇒ [<code>Line</code>](#Line)
        * [.containsVector(p)](#Line+containsVector) ⇒ <code>Boolean</code>
        * [.equals(other)](#Line+equals) ⇒ <code>Boolean</code>
    * _static_
        * [.lerp(l1, l2, a)](#Line.lerp) ⇒ [<code>Line</code>](#Line)

<a name="new_Line_new"></a>

### new Line(from, to)
Create the Line.


| Param | Type | Description |
| --- | --- | --- |
| from | <code>Vector2</code> | Line start position. |
| to | <code>Vector2</code> | Line end position. |

<a name="Line+clone"></a>

### line.clone() ⇒ [<code>Line</code>](#Line)
Return a clone of this line.

**Kind**: instance method of [<code>Line</code>](#Line)  
**Returns**: [<code>Line</code>](#Line) - Cloned line.  
<a name="Line+containsVector"></a>

### line.containsVector(p) ⇒ <code>Boolean</code>
Check if this circle contains a Vector2.

**Kind**: instance method of [<code>Line</code>](#Line)  
**Returns**: <code>Boolean</code> - if point is contained within the circle.  

| Param | Type | Description |
| --- | --- | --- |
| p | <code>Vector2</code> | Point to check. |

<a name="Line+equals"></a>

### line.equals(other) ⇒ <code>Boolean</code>
Check if equal to another circle.

**Kind**: instance method of [<code>Line</code>](#Line)  
**Returns**: <code>Boolean</code> - True if circles are equal, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| other | <code>Circle</code> | Other circle to compare to. |

<a name="Line.lerp"></a>

### Line.lerp(l1, l2, a) ⇒ [<code>Line</code>](#Line)
Lerp between two lines.

**Kind**: static method of [<code>Line</code>](#Line)  
**Returns**: [<code>Line</code>](#Line) - result lines.  

| Param | Type | Description |
| --- | --- | --- |
| l1 | [<code>Line</code>](#Line) | First lines. |
| l2 | [<code>Line</code>](#Line) | Second lines. |
| a | <code>Number</code> | Lerp factor (0.0 - 1.0). |

