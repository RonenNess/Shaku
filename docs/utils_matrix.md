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
        * [.inverted()](#Matrix+inverted) ⇒ [<code>Matrix</code>](#Matrix)
        * [.invertSelf()](#Matrix+invertSelf) ⇒ [<code>Matrix</code>](#Matrix)
        * [.transform(target)](#Matrix+transform) ⇒ <code>Vector2</code> \| <code>Vector3</code> \| <code>Vector3</code>
        * [.multiplySelfWith(other)](#Matrix+multiplySelfWith) ⇒ [<code>Matrix</code>](#Matrix)
        * [.multiplyWith(other)](#Matrix+multiplyWith) ⇒ [<code>Matrix</code>](#Matrix)
    * _static_
        * [.identity](#Matrix.identity)
        * [.createOrthographic()](#Matrix.createOrthographic) ⇒ [<code>Matrix</code>](#Matrix)
        * [.createPerspective()](#Matrix.createPerspective) ⇒ [<code>Matrix</code>](#Matrix)
        * [.createTranslation()](#Matrix.createTranslation) ⇒ [<code>Matrix</code>](#Matrix)
        * [.createScale()](#Matrix.createScale) ⇒ [<code>Matrix</code>](#Matrix)
        * [.createRotationX()](#Matrix.createRotationX) ⇒ [<code>Matrix</code>](#Matrix)
        * [.createRotationY()](#Matrix.createRotationY) ⇒ [<code>Matrix</code>](#Matrix)
        * [.createRotationZ()](#Matrix.createRotationZ) ⇒ [<code>Matrix</code>](#Matrix)
        * [.multiply()](#Matrix.multiply) ⇒ [<code>Matrix</code>](#Matrix)
        * [.createLookAt(eyePosition, targetPosition, [upVector])](#Matrix.createLookAt) ⇒ [<code>Matrix</code>](#Matrix)
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

<a name="Matrix+inverted"></a>

### matrix.inverted() ⇒ [<code>Matrix</code>](#Matrix)
Clone and invert the matrix.

**Kind**: instance method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - Clonsed inverted matrix.  
<a name="Matrix+invertSelf"></a>

### matrix.invertSelf() ⇒ [<code>Matrix</code>](#Matrix)
Invert this matrix.

**Kind**: instance method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - Self.  
<a name="Matrix+transform"></a>

### matrix.transform(target) ⇒ <code>Vector2</code> \| <code>Vector3</code> \| <code>Vector3</code>
Transform a target.

**Kind**: instance method of [<code>Matrix</code>](#Matrix)  
**Returns**: <code>Vector2</code> \| <code>Vector3</code> \| <code>Vector3</code> - Transformed result.  

| Param | Type | Description |
| --- | --- | --- |
| target | <code>Vector2</code> \| <code>Vector3</code> \| <code>Vertex</code> | Transforms a target, that can be vector2, vector3, or vertex. |

<a name="Matrix+multiplySelfWith"></a>

### matrix.multiplySelfWith(other) ⇒ [<code>Matrix</code>](#Matrix)
Multiply this matrix with another matrix, putting results in self.

**Kind**: instance method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - This.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Matrix</code>](#Matrix) | Matrix to multiply with. |

<a name="Matrix+multiplyWith"></a>

### matrix.multiplyWith(other) ⇒ [<code>Matrix</code>](#Matrix)
Multiply this matrix with another matrix and return a new result matrix.

**Kind**: instance method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - New result matrix.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Matrix</code>](#Matrix) | Matrix to multiply with. |

<a name="Matrix.identity"></a>

### Matrix.identity
An identity matrix.

**Kind**: static property of [<code>Matrix</code>](#Matrix)  
<a name="Matrix.createOrthographic"></a>

### Matrix.createOrthographic() ⇒ [<code>Matrix</code>](#Matrix)
Create an orthographic projection matrix.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - a new matrix with result.  
<a name="Matrix.createPerspective"></a>

### Matrix.createPerspective() ⇒ [<code>Matrix</code>](#Matrix)
Create a perspective projection matrix.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - a new matrix with result.  
<a name="Matrix.createTranslation"></a>

### Matrix.createTranslation() ⇒ [<code>Matrix</code>](#Matrix)
Create a translation matrix.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - a new matrix with result.  
<a name="Matrix.createScale"></a>

### Matrix.createScale() ⇒ [<code>Matrix</code>](#Matrix)
Create a scale matrix.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - a new matrix with result.  
<a name="Matrix.createRotationX"></a>

### Matrix.createRotationX() ⇒ [<code>Matrix</code>](#Matrix)
Create a rotation matrix around X axis.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - a new matrix with result.  
<a name="Matrix.createRotationY"></a>

### Matrix.createRotationY() ⇒ [<code>Matrix</code>](#Matrix)
Create a rotation matrix around Y axis.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - a new matrix with result.  
<a name="Matrix.createRotationZ"></a>

### Matrix.createRotationZ() ⇒ [<code>Matrix</code>](#Matrix)
Create a rotation matrix around Z axis.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - a new matrix with result.  
<a name="Matrix.multiply"></a>

### Matrix.multiply() ⇒ [<code>Matrix</code>](#Matrix)
Multiply two matrices.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - a new matrix with result.  
<a name="Matrix.createLookAt"></a>

### Matrix.createLookAt(eyePosition, targetPosition, [upVector]) ⇒ [<code>Matrix</code>](#Matrix)
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

