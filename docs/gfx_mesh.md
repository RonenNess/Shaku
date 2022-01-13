![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Mesh

<a name="Mesh"></a>

## Mesh
Class to hold a mesh.

**Kind**: global class  

* [Mesh](#Mesh)
    * [new Mesh(positions, textureCoords, colorss, indices, indicesCount)](#new_Mesh_new)
    * [.overrideColors(gl, color)](#Mesh+overrideColors)

<a name="new_Mesh_new"></a>

### new Mesh(positions, textureCoords, colorss, indices, indicesCount)
Create the mesh object.


| Param | Type | Description |
| --- | --- | --- |
| positions | <code>WebGLBuffer</code> | vertices positions buffer. |
| textureCoords | <code>WebGLBuffer</code> | vertices texture coords buffer. |
| colorss | <code>WebGLBuffer</code> | vertices colors buffer. |
| indices | <code>WebGLBuffer</code> | indices buffer. |
| indicesCount | <code>Number</code> | how many indices we have. |

<a name="Mesh+overrideColors"></a>

### mesh.overrideColors(gl, color)
Override the colors buffer, if possible.

**Kind**: instance method of [<code>Mesh</code>](#Mesh)  

| Param | Type | Description |
| --- | --- | --- |
| gl | <code>WebGl</code> | WebGL context. |
| color | <code>Color</code> | Color to set. |

