/**
 * Include all util classes.
 * 
 * |-- copyright and license --|
 * @module     Shaku
 * @file       shaku\src\utils\index.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';

/**
 * Shaku Utils module.
 * Contains general stuff, utilities and core objects that Shaku uses.
 */
const Utils = {
    Vector2: require('./vector2'),
    Vector3: require('./vector3'),
    Rectangle: require('./rectangle'),
    Circle: require('./circle'),
    Line: require('./line'),
    Color: require('./color'),
    Animator: require('./animator'),
    GameTime: require('./game_time'),
    MathHelper: require('./math_helper'),
    SeededRandom: require('./seeded_random'),
    Perlin: require('./perlin'),
    Storage: require('./storage'),
    StorageAdapter: require('./storage_adapter'),
    PathFinder: require('./path_finder'),
    Transformation: require('./transformation'),
    TransformationModes: require('./transform_modes'),
    ItemsSorter: require('./items_sorter')
};

// export the Utils module.
module.exports = Utils;