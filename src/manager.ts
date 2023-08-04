/**
 * Define the managers interface.
 * 
 * |-- copyright and license --|
 * @module     Shaku
 * @file       shaku\src\manager.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';


/**
 * Interface for any manager.
 * Manager = manages a domain in Shaku, such as gfx (graphics), sfx (sounds), input, etc.
 */
class IManager
{
    /**
     * Initialize the manager.
     * @returns {Promise} Promise to resolve when initialization is done.
     */
    setup()
    {
        throw new Error("Not Implemented!");
    }

    /**
     * Called every update at the begining of the frame.
     */
    startFrame()
    {
        throw new Error("Not Implemented!");
    }

    /**
     * Called every update at the end of the frame.
     */
    endFrame()
    {
        throw new Error("Not Implemented!");
    }

    /**
     * Destroy the manager.
     */
    destroy()
    {
        throw new Error("Not Implemented!");
    }
}

// export the manager interface.
module.exports = IManager