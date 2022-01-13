![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Circle

<a name="Circle"></a>

## Circle
Implement a simple 2d Circle.

**Kind**: global class  

* [Circle](#Circle)
    * [new Circle(center, radius)](#new_Circle_new)
    * _instance_
        * [.clone()](#Circle+clone) ⇒ [<code>Circle</code>](#Circle)
        * [.containsVector(p)](#Circle+containsVector) ⇒ <code>Boolean</code>
        * [.equals(other)](#Circle+equals) ⇒ <code>Boolean</code>
    * _static_
        * [.lerp(p1, p2, a)](#Circle.lerp) ⇒ [<code>Circle</code>](#Circle)

<a name="new_Circle_new"></a>

### new Circle(center, radius)
Create the Circle.


| Param | Type | Description |
| --- | --- | --- |
| center | <code>Vector2</code> | Circle center position. |
| radius | <code>Number</code> | Circle radius. |

<a name="Circle+clone"></a>

### circle.clone() ⇒ [<code>Circle</code>](#Circle)
Return a clone of this circle.

**Kind**: instance method of [<code>Circle</code>](#Circle)  
**Returns**: [<code>Circle</code>](#Circle) - Cloned circle.  
<a name="Circle+containsVector"></a>

### circle.containsVector(p) ⇒ <code>Boolean</code>
Check if this circle contains a Vector2.

**Kind**: instance method of [<code>Circle</code>](#Circle)  
**Returns**: <code>Boolean</code> - if point is contained within the circle.  

| Param | Type | Description |
| --- | --- | --- |
| p | <code>Vector2</code> | Point to check. |

<a name="Circle+equals"></a>

### circle.equals(other) ⇒ <code>Boolean</code>
Check if equal to another circle.

**Kind**: instance method of [<code>Circle</code>](#Circle)  
**Returns**: <code>Boolean</code> - True if circles are equal, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Circle</code>](#Circle) | Other circle to compare to. |

<a name="Circle.lerp"></a>

### Circle.lerp(p1, p2, a) ⇒ [<code>Circle</code>](#Circle)
Lerp between two circle.

**Kind**: static method of [<code>Circle</code>](#Circle)  
**Returns**: [<code>Circle</code>](#Circle) - result circle.  

| Param | Type | Description |
| --- | --- | --- |
| p1 | <code>Vector2</code> | First circle. |
| p2 | <code>Vector2</code> | Second circle. |
| a | <code>Number</code> | Lerp factor (0.0 - 1.0). |

