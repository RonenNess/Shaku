![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Path Finder

## Classes

<dl>
<dt><a href="#IGrid">IGrid</a></dt>
<dd><p>Interface for a supported grid.</p>
</dd>
<dt><a href="#Node">Node</a></dt>
<dd><p>A path node.</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#PathFinder">PathFinder</a></dt>
<dd><p>Path finder utilitiy. 
To use it:</p>
<ol>
<li>Implement a <code>IGrid</code> instance that returns if a grid node is blocking and what&#39;s the price to cross it.</li>
<li>Call findPath() with your grid to find a path between start and end points.</li>
</ol>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#findPath">findPath(grid, startPos, targetPos, options)</a> ⇒ <code>Array.&lt;Vector2&gt;</code></dt>
<dd><p>Find a path between start to target.</p>
</dd>
<dt><a href="#getDistance">getDistance()</a></dt>
<dd><p>Get distance between two points on grid.
This method is quick and dirty and takes diagonal into consideration.</p>
</dd>
</dl>

<a name="IGrid"></a>

## IGrid
Interface for a supported grid.

**Kind**: global class  

* [IGrid](#IGrid)
    * [.isBlocked(_from, _to)](#IGrid+isBlocked) ⇒ <code>Boolean</code>
    * [.getPrice(_index)](#IGrid+getPrice) ⇒ <code>Number</code>

<a name="IGrid+isBlocked"></a>

### iGrid.isBlocked(_from, _to) ⇒ <code>Boolean</code>
Check if a given tile is blocked from a given neihbor.

**Kind**: instance method of [<code>IGrid</code>](#IGrid)  
**Returns**: <code>Boolean</code> - Can we travel from _from to _to?  

| Param | Type | Description |
| --- | --- | --- |
| _from | <code>Vector2</code> \| <code>Vector3</code> | Source tile index. |
| _to | <code>Vector2</code> \| <code>Vector3</code> | Target tile index. Must be a neighbor of _from. |

<a name="IGrid+getPrice"></a>

### iGrid.getPrice(_index) ⇒ <code>Number</code>
Get the price to travel on a given tile.
Should return 1 for "normal" traveling price, > 1 for expensive tile, and < 1 for a cheap tile to pass on.

**Kind**: instance method of [<code>IGrid</code>](#IGrid)  
**Returns**: <code>Number</code> - Price factor to walk on.  

| Param | Type | Description |
| --- | --- | --- |
| _index | <code>Vector2</code> \| <code>Vector3</code> | Tile index. |

<a name="Node"></a>

## Node
A path node.

**Kind**: global class  

* [Node](#Node)
    * [new Node(position)](#new_Node_new)
    * [.fCost](#Node+fCost)

<a name="new_Node_new"></a>

### new Node(position)
Create the node from a position.


| Param | Type | Description |
| --- | --- | --- |
| position | <code>Vector2</code> \| <code>Vector3</code> | Node position. |

<a name="Node+fCost"></a>

### node.fCost
Get the node fCost factor.

**Kind**: instance property of [<code>Node</code>](#Node)  
<a name="PathFinder"></a>

## PathFinder
Path finder utilitiy. 
To use it:
 1. Implement a `IGrid` instance that returns if a grid node is blocking and what's the price to cross it.
 2. Call findPath() with your grid to find a path between start and end points.

**Kind**: global constant  
<a name="findPath"></a>

## findPath(grid, startPos, targetPos, options) ⇒ <code>Array.&lt;Vector2&gt;</code>
Find a path between start to target.

**Kind**: global function  
**Returns**: <code>Array.&lt;Vector2&gt;</code> - List of tiles to traverse.  

| Param | Type | Description |
| --- | --- | --- |
| grid | [<code>IGrid</code>](#IGrid) | Grid provider to check if tiles are blocked. |
| startPos | <code>Vector2</code> \| <code>Vector3</code> | Starting tile index. |
| targetPos | <code>Vector2</code> \| <code>Vector3</code> | Target tile index. |
| options | <code>\*</code> | Additional options: { maxIterations, ignorePrices, allowDiagonal } |

<a name="getDistance"></a>

## getDistance()
Get distance between two points on grid.
This method is quick and dirty and takes diagonal into consideration.

**Kind**: global function  
