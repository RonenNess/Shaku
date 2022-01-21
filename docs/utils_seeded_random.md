![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Seeded Random

<a name="SeededRandom"></a>

## SeededRandom
Class to generate random numbers with seed.

**Kind**: global class  

* [SeededRandom](#SeededRandom)
    * [new SeededRandom(seed)](#new_SeededRandom_new)
    * [.random(min, max)](#SeededRandom+random) ⇒ <code>Number</code>
    * [.pick(options)](#SeededRandom+pick) ⇒ <code>\*</code>

<a name="new_SeededRandom_new"></a>

### new SeededRandom(seed)
Create the seeded random object.


| Param | Type | Description |
| --- | --- | --- |
| seed | <code>Number</code> | Seed to start from. If not provided, will use 0. |

<a name="SeededRandom+random"></a>

### seededRandom.random(min, max) ⇒ <code>Number</code>
Get next random value.

**Kind**: instance method of [<code>SeededRandom</code>](#SeededRandom)  
**Returns**: <code>Number</code> - A randomly generated value.  

| Param | Type | Description |
| --- | --- | --- |
| min | <code>Number</code> | Optional min value. If max is not provided, this will be used as max. |
| max | <code>Number</code> | Optional max value. |

<a name="SeededRandom+pick"></a>

### seededRandom.pick(options) ⇒ <code>\*</code>
Pick a random value from array.

**Kind**: instance method of [<code>SeededRandom</code>](#SeededRandom)  
**Returns**: <code>\*</code> - Random value from options array.  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Array</code> | Options to pick random value from. |

