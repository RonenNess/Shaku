![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Sphere

<a name="Sphere"></a>

## Sphere
A 3D sphere.

**Kind**: global class  

* [Sphere](#Sphere)
    * [new Sphere(center, radius)](#new_Sphere_new)
    * _instance_
        * [.clone()](#Sphere+clone) ⇒ [<code>Sphere</code>](#Sphere)
        * [.containsVector(p)](#Sphere+containsVector) ⇒ <code>Boolean</code>
        * [.equals(other)](#Sphere+equals) ⇒ <code>Boolean</code>
        * [.toDict(minimized)](#Sphere+toDict) ⇒ <code>\*</code>
        * [.collideBox(box)](#Sphere+collideBox) ⇒ <code>Boolean</code>
        * [.collidePlane(plane)](#Sphere+collidePlane) ⇒ <code>Boolean</code>
    * _static_
        * [.fromDict(data)](#Sphere.fromDict) ⇒ [<code>Sphere</code>](#Sphere)
        * [.lerp(p1, p2, a)](#Sphere.lerp) ⇒ [<code>Sphere</code>](#Sphere)

<a name="new_Sphere_new"></a>

### new Sphere(center, radius)
Create the Sphere.


| Param | Type | Description |
| --- | --- | --- |
| center | <code>Vector3</code> | Sphere center position. |
| radius | <code>Number</code> | Sphere radius. |

<a name="Sphere+clone"></a>

### sphere.clone() ⇒ [<code>Sphere</code>](#Sphere)
Return a clone of this sphere.

**Kind**: instance method of [<code>Sphere</code>](#Sphere)  
**Returns**: [<code>Sphere</code>](#Sphere) - Cloned sphere.  
<a name="Sphere+containsVector"></a>

### sphere.containsVector(p) ⇒ <code>Boolean</code>
Check if this sphere contains a Vector3.

**Kind**: instance method of [<code>Sphere</code>](#Sphere)  
**Returns**: <code>Boolean</code> - if point is contained within the sphere.  

| Param | Type | Description |
| --- | --- | --- |
| p | <code>Vector3</code> | Point to check. |

<a name="Sphere+equals"></a>

### sphere.equals(other) ⇒ <code>Boolean</code>
Check if equal to another sphere.

**Kind**: instance method of [<code>Sphere</code>](#Sphere)  
**Returns**: <code>Boolean</code> - True if spheres are equal, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Sphere</code>](#Sphere) | Other sphere to compare to. |

<a name="Sphere+toDict"></a>

### sphere.toDict(minimized) ⇒ <code>\*</code>
Convert to dictionary.

**Kind**: instance method of [<code>Sphere</code>](#Sphere)  
**Returns**: <code>\*</code> - Dictionary with {center, radius}.  

| Param | Type | Description |
| --- | --- | --- |
| minimized | <code>Boolean</code> | If true, will not include keys that their values are 0. You can use fromDict on minimized dicts. |

<a name="Sphere+collideBox"></a>

### sphere.collideBox(box) ⇒ <code>Boolean</code>
Check if collide with a box.

**Kind**: instance method of [<code>Sphere</code>](#Sphere)  
**Returns**: <code>Boolean</code> - True if collide, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| box | <code>Box</code> | Box to check. |

<a name="Sphere+collidePlane"></a>

### sphere.collidePlane(plane) ⇒ <code>Boolean</code>
Check if collide with a plane.

**Kind**: instance method of [<code>Sphere</code>](#Sphere)  
**Returns**: <code>Boolean</code> - True if collide, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| plane | <code>Plane</code> | Plane to test. |

<a name="Sphere.fromDict"></a>

### Sphere.fromDict(data) ⇒ [<code>Sphere</code>](#Sphere)
Create sphere from a dictionary.

**Kind**: static method of [<code>Sphere</code>](#Sphere)  
**Returns**: [<code>Sphere</code>](#Sphere) - Newly created sphere.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>\*</code> | Dictionary with {center, radius}. |

<a name="Sphere.lerp"></a>

### Sphere.lerp(p1, p2, a) ⇒ [<code>Sphere</code>](#Sphere)
Lerp between two sphere.

**Kind**: static method of [<code>Sphere</code>](#Sphere)  
**Returns**: [<code>Sphere</code>](#Sphere) - result sphere.  

| Param | Type | Description |
| --- | --- | --- |
| p1 | [<code>Sphere</code>](#Sphere) | First sphere. |
| p2 | [<code>Sphere</code>](#Sphere) | Second sphere. |
| a | <code>Number</code> | Lerp factor (0.0 - 1.0). |

