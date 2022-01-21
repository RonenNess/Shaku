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
        * [.containsVector(p, threshold)](#Line+containsVector) ⇒ <code>Boolean</code>
        * [.collideLine(other)](#Line+collideLine) ⇒ <code>Boolean</code>
        * [.distanceToVector(v)](#Line+distanceToVector) ⇒ <code>Number</code>
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

### line.containsVector(p, threshold) ⇒ <code>Boolean</code>
Check if this circle contains a Vector2.

**Kind**: instance method of [<code>Line</code>](#Line)  
**Returns**: <code>Boolean</code> - if point is contained within the circle.  

| Param | Type | Description |
| --- | --- | --- |
| p | <code>Vector2</code> | Point to check. |
| threshold | <code>Number</code> | Distance between point and line to consider as intersecting. Default is 0.5, meaning it will treat point and line as round integers (sort-of). |

<a name="Line+collideLine"></a>

### line.collideLine(other) ⇒ <code>Boolean</code>
Check if this line collides with another line.

**Kind**: instance method of [<code>Line</code>](#Line)  
**Returns**: <code>Boolean</code> - True if lines collide, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Line</code>](#Line) | Other line to test collision with. |

<a name="Line+distanceToVector"></a>

### line.distanceToVector(v) ⇒ <code>Number</code>
Get the shortest distance between this line segment and a vector.

**Kind**: instance method of [<code>Line</code>](#Line)  
**Returns**: <code>Number</code> - Shortest distance between line and vector.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>Vector2</code> | Vector to get distance to. |

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

