![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Transform Modes

<a name="TransformModes"></a>

## TransformModes
Different ways we can combine local transformations with parent transformations.

**Kind**: global constant  

* [TransformModes](#TransformModes)
    * [.Relative](#TransformModes.Relative)
    * [.AxisAligned](#TransformModes.AxisAligned)
    * [.Absolute](#TransformModes.Absolute)

<a name="TransformModes.Relative"></a>

### TransformModes.Relative
The vector or scalar will be relative to the entity's parent transformations, and the local axis will be rotated by the parent's rotation.
For example, if we have an entity that renders a blue ball and a child entity that renders a red ball with offset of {100,0}, when we rotate the parent blue ball, the red ball will rotate around it, keeping a distance of 100 pixels.

**Kind**: static property of [<code>TransformModes</code>](#TransformModes)  
<a name="TransformModes.AxisAligned"></a>

### TransformModes.AxisAligned
The vector or scalar will be relative to the entity's parent transformations, but local axis will be constant.
For example, if we have an entity that renders a blue ball and a child entity that renders a red ball with offset of {100,0}, no matter how we rotate the parent blue ball, the red ball will always keep offset of {100,0} from it, ie be rendered on its right.

**Kind**: static property of [<code>TransformModes</code>](#TransformModes)  
<a name="TransformModes.Absolute"></a>

### TransformModes.Absolute
The vector or scalar will ignore any parent transformations.
This means that the local transformations of the entity will always be its world transformations as well, no matter what it parent does.

**Kind**: static property of [<code>TransformModes</code>](#TransformModes)  
