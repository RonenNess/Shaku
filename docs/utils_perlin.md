![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Perlin

<a name="Perlin"></a>

## Perlin
Generate 2d perlin noise.
Based on code from noisejs by Stefan Gustavson.
https://github.com/josephg/noisejs/blob/master/perlin.js

**Kind**: global class  

* [Perlin](#Perlin)
    * [new Perlin(seed)](#new_Perlin_new)
    * [.seed(seed)](#Perlin+seed)
    * [.generateSmooth(x, y, blurDistance, contrast)](#Perlin+generateSmooth) ⇒ <code>Number</code>
    * [.generate(x, y, contrast)](#Perlin+generate) ⇒ <code>Number</code>

<a name="new_Perlin_new"></a>

### new Perlin(seed)
Create the perlin noise generator.


| Param | Type | Description |
| --- | --- | --- |
| seed | <code>Number</code> | Seed for perlin noise, or undefined for random. |

<a name="Perlin+seed"></a>

### perlin.seed(seed)
Set the perlin noise seed.

**Kind**: instance method of [<code>Perlin</code>](#Perlin)  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>Number</code> | New seed value. May be either a decimal between 0 to 1, or an unsigned short between 0 to 65536. |

<a name="Perlin+generateSmooth"></a>

### perlin.generateSmooth(x, y, blurDistance, contrast) ⇒ <code>Number</code>
Generate a perlin noise value for x,y coordinates.

**Kind**: instance method of [<code>Perlin</code>](#Perlin)  
**Returns**: <code>Number</code> - Perlin noise value for given point.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | X coordinate to generate perlin noise for. |
| y | <code>Number</code> | Y coordinate to generate perlin noise for. |
| blurDistance | <code>Number</code> | Distance to take neighbors to blur returned value with. Defaults to 0.25. |
| contrast | <code>Number</code> | Optional contrast factor. |

<a name="Perlin+generate"></a>

### perlin.generate(x, y, contrast) ⇒ <code>Number</code>
Generate a perlin noise value for x,y coordinates.

**Kind**: instance method of [<code>Perlin</code>](#Perlin)  
**Returns**: <code>Number</code> - Perlin noise value for given point, ranged from 0 to 1.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | X coordinate to generate perlin noise for. |
| y | <code>Number</code> | Y coordinate to generate perlin noise for. |
| contrast | <code>Number</code> | Optional contrast factor. |

