![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Matrix

<a name="Matrix"></a>

## Matrix
Implements a matrix.

**Kind**: global class  

* [Matrix](#Matrix)
    * [new Matrix(values, cloneValues)](#new_Matrix_new)
    * _instance_
        * [.set()](#Matrix+set)
        * [.clone()](#Matrix+clone) ⇒ [<code>Matrix</code>](#Matrix)
        * [.equals(other)](#Matrix+equals) ⇒ <code>Boolean</code>
    * _static_
        * [.identity](#Matrix.identity)
        * [.orthographic()](#Matrix.orthographic) ⇒ [<code>Matrix</code>](#Matrix)
        * [.perspective()](#Matrix.perspective) ⇒ [<code>Matrix</code>](#Matrix)
        * [.translate()](#Matrix.translate) ⇒ [<code>Matrix</code>](#Matrix)
        * [.scale()](#Matrix.scale) ⇒ [<code>Matrix</code>](#Matrix)
        * [.rotateX()](#Matrix.rotateX) ⇒ [<code>Matrix</code>](#Matrix)
        * [.rotateY()](#Matrix.rotateY) ⇒ [<code>Matrix</code>](#Matrix)
        * [.rotateZ()](#Matrix.rotateZ) ⇒ [<code>Matrix</code>](#Matrix)
        * [.multiply()](#Matrix.multiply) ⇒ [<code>Matrix</code>](#Matrix)
        * [.lookAt(eyePosition, targetPosition, [upVector])](#Matrix.lookAt) ⇒ [<code>Matrix</code>](#Matrix)
        * [.multiplyMany(matrices)](#Matrix.multiplyMany) ⇒ [<code>Matrix</code>](#Matrix)
        * [.multiplyIntoFirst()](#Matrix.multiplyIntoFirst) ⇒ [<code>Matrix</code>](#Matrix)
        * [.multiplyManyIntoFirst(matrices)](#Matrix.multiplyManyIntoFirst) ⇒ [<code>Matrix</code>](#Matrix)
        * [.transformVertex(matrix, vertex)](#Matrix.transformVertex) ⇒ <code>Vertex</code>
        * [.transformVector2(matrix, vector)](#Matrix.transformVector2) ⇒ <code>Vector2</code>
        * [.transformVector3(matrix, vector)](#Matrix.transformVector3) ⇒ <code>Vector3</code>

<a name="new_Matrix_new"></a>

### new Matrix(values, cloneValues)
Create the matrix.


| Param | Description |
| --- | --- |
| values | matrix values array. |
| cloneValues | if true or undefined, will clone values instead of just holding a reference to them. |

<a name="Matrix+set"></a>

### matrix.set()
Set the matrix values.

**Kind**: instance method of [<code>Matrix</code>](#Matrix)  
<a name="Matrix+clone"></a>

### matrix.clone() ⇒ [<code>Matrix</code>](#Matrix)
Clone the matrix.

**Kind**: instance method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - Cloned matrix.  
<a name="Matrix+equals"></a>

### matrix.equals(other) ⇒ <code>Boolean</code>
Compare this matrix to another matrix.

**Kind**: instance method of [<code>Matrix</code>](#Matrix)  
**Returns**: <code>Boolean</code> - If matrices are the same.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Matrix</code>](#Matrix) | Matrix to compare to. |

<a name="Matrix.identity"></a>

### Matrix.identity
An identity matrix.

**Kind**: static property of [<code>Matrix</code>](#Matrix)  
<a name="Matrix.orthographic"></a>

### Matrix.orthographic() ⇒ [<code>Matrix</code>](#Matrix)
Create an orthographic projection matrix.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - a new matrix with result.  
<a name="Matrix.perspective"></a>

### Matrix.perspective() ⇒ [<code>Matrix</code>](#Matrix)
Create a perspective projection matrix.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - a new matrix with result.  
<a name="Matrix.translate"></a>

### Matrix.translate() ⇒ [<code>Matrix</code>](#Matrix)
Create a translation matrix.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - a new matrix with result.  
<a name="Matrix.scale"></a>

### Matrix.scale() ⇒ [<code>Matrix</code>](#Matrix)
Create a scale matrix.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - a new matrix with result.  
<a name="Matrix.rotateX"></a>

### Matrix.rotateX() ⇒ [<code>Matrix</code>](#Matrix)
Create a rotation matrix around X axis.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - a new matrix with result.  
<a name="Matrix.rotateY"></a>

### Matrix.rotateY() ⇒ [<code>Matrix</code>](#Matrix)
Create a rotation matrix around Y axis.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - a new matrix with result.  
<a name="Matrix.rotateZ"></a>

### Matrix.rotateZ() ⇒ [<code>Matrix</code>](#Matrix)
Create a rotation matrix around Z axis.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - a new matrix with result.  
<a name="Matrix.multiply"></a>

### Matrix.multiply() ⇒ [<code>Matrix</code>](#Matrix)
Multiply two matrices.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - a new matrix with result.  
<a name="Matrix.lookAt"></a>

### Matrix.lookAt(eyePosition, targetPosition, [upVector]) ⇒ [<code>Matrix</code>](#Matrix)
Creates a look-at matrix - a matrix rotated to look at a given position.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - a new matrix with result.  

| Param | Type | Description |
| --- | --- | --- |
| eyePosition | <code>Vector3</code> | Eye position. |
| targetPosition | <code>Vector3</code> | Position the matrix should look at. |
| [upVector] | <code>Vector3</code> | Optional vector representing 'up' direction. |

<a name="Matrix.multiplyMany"></a>

### Matrix.multiplyMany(matrices) ⇒ [<code>Matrix</code>](#Matrix)
Multiply an array of matrices.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - new matrix with multiply result.  

| Param | Type | Description |
| --- | --- | --- |
| matrices | [<code>Array.&lt;Matrix&gt;</code>](#Matrix) | Matrices to multiply. |

<a name="Matrix.multiplyIntoFirst"></a>

### Matrix.multiplyIntoFirst() ⇒ [<code>Matrix</code>](#Matrix)
Multiply two matrices and put result in first matrix.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - matrixA, after it was modified.  
<a name="Matrix.multiplyManyIntoFirst"></a>

### Matrix.multiplyManyIntoFirst(matrices) ⇒ [<code>Matrix</code>](#Matrix)
Multiply an array of matrices into the first matrix in the array.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - first matrix in array, after it was modified.  

| Param | Type | Description |
| --- | --- | --- |
| matrices | [<code>Array.&lt;Matrix&gt;</code>](#Matrix) | Matrices to multiply. |

<a name="Matrix.transformVertex"></a>

### Matrix.transformVertex(matrix, vertex) ⇒ <code>Vertex</code>
Transform a 2d vertex.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: <code>Vertex</code> - A transformed vertex (cloned, not the original).  

| Param | Type | Description |
| --- | --- | --- |
| matrix | [<code>Matrix</code>](#Matrix) | Matrix to use to transform vector. |
| vertex | <code>Vertex</code> | Vertex to transform. |

<a name="Matrix.transformVector2"></a>

### Matrix.transformVector2(matrix, vector) ⇒ <code>Vector2</code>
Transform a 2d vector.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: <code>Vector2</code> - Transformed vector.  

| Param | Type | Description |
| --- | --- | --- |
| matrix | [<code>Matrix</code>](#Matrix) | Matrix to use to transform vector. |
| vector | <code>Vector2</code> | Vector to transform. |

<a name="Matrix.transformVector3"></a>

### Matrix.transformVector3(matrix, vector) ⇒ <code>Vector3</code>
Transform a 3d vector.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: <code>Vector3</code> - Transformed vector.  

| Param | Type | Description |
| --- | --- | --- |
| matrix | [<code>Matrix</code>](#Matrix) | Matrix to use to transform vector. |
| vector | <code>Vector3</code> | Vector to transform. |

