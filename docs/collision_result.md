![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Result

<a name="CollisionTestResult"></a>

## CollisionTestResult
Collision detection result.

**Kind**: global class  

* [CollisionTestResult](#CollisionTestResult)
    * [new CollisionTestResult(position, first, second)](#new_CollisionTestResult_new)
    * [.position](#CollisionTestResult+position) : <code>Vector2</code>
    * [.first](#CollisionTestResult+first) : <code>CollisionShape</code>
    * [.second](#CollisionTestResult+second) : <code>CollisionShape</code>

<a name="new_CollisionTestResult_new"></a>

### new CollisionTestResult(position, first, second)
Create the collision result.


| Param | Type | Description |
| --- | --- | --- |
| position | <code>Vector2</code> | Optional collision position. |
| first | <code>CollisionShape</code> | First shape in the collision check. |
| second | <code>CollisionShape</code> | Second shape in the collision check. |

<a name="CollisionTestResult+position"></a>

### collisionTestResult.position : <code>Vector2</code>
Collision position, only relevant when there's a single touching point.
For shapes with multiple touching points, this will be null.

**Kind**: instance property of [<code>CollisionTestResult</code>](#CollisionTestResult)  
<a name="CollisionTestResult+first"></a>

### collisionTestResult.first : <code>CollisionShape</code>
First collided shape.

**Kind**: instance property of [<code>CollisionTestResult</code>](#CollisionTestResult)  
<a name="CollisionTestResult+second"></a>

### collisionTestResult.second : <code>CollisionShape</code>
Second collided shape.

**Kind**: instance property of [<code>CollisionTestResult</code>](#CollisionTestResult)  
