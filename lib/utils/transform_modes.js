/**
 * Transformation modes.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\transform_modes.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';

/**
 * Different ways we can combine local transformations with parent transformations.
 */
const TransformModes = {
    
    /**
     * The vector or scalar will be relative to the entity's parent transformations, and the local axis will be rotated by the parent's rotation.
     * For example, if we have an entity that renders a blue ball and a child entity that renders a red ball with offset of {100,0}, when we rotate the parent blue ball, the red ball will rotate around it, keeping a distance of 100 pixels. 
     */
    Relative: 'relative',

    /**
     * The vector or scalar will be relative to the entity's parent transformations, but local axis will be constant.
     * For example, if we have an entity that renders a blue ball and a child entity that renders a red ball with offset of {100,0}, no matter how we rotate the parent blue ball, the red ball will always keep offset of {100,0} from it, ie be rendered on its right. 
     */
    AxisAligned: 'axis-aligned',

    /**
     * The vector or scalar will ignore any parent transformations.
     * This means that the local transformations of the entity will always be its world transformations as well, no matter what it parent does.
     */
    Absolute: 'absolute'
}


// export the transform modes.
module.exports = TransformModes;