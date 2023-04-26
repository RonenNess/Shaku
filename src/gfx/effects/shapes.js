/**
 * Implement a basic effect to draw sprites.
 * 
 * |-- copyright and license --|
 * @module     Shaku
 * @file       shaku\src\gfx\effects\shapes.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const Effect = require("./effect");

// vertex shader code
const vertexShader = `
attribute vec3 position;
attribute vec4 color;

uniform mat4 projection;
uniform mat4 world;

varying vec4 v_color;

void main(void) {
    gl_Position = projection * world * vec4(position, 1.0);
    gl_PointSize = 1.0;
    v_color = color;
}
    `;

// fragment shader code
const fragmentShader = `  
#ifdef GL_ES
    precision highp float;
#endif

varying vec4 v_color;

void main(void) {
    gl_FragColor = v_color;
    gl_FragColor.rgb *= gl_FragColor.a;
}
    `;

/**
 * Default basic effect to draw 2d shapes.
 */
class ShapesEffect extends Effect
{
    /** @inheritdoc */
    get vertexCode() 
    { 
        return vertexShader; 
    }

    /** @inheritdoc */
    get fragmentCode()
    { 
        return fragmentShader;
    }

    /** @inheritdoc */
    get uniformTypes()
    {
        return {
            [Effect.UniformBinds.Projection]: { type: Effect.UniformTypes.Matrix, bind: Effect.UniformBinds.Projection },
            [Effect.UniformBinds.World]: { type: Effect.UniformTypes.Matrix, bind: Effect.UniformBinds.World },
            [Effect.UniformBinds.View]: { type: Effect.UniformTypes.Matrix, bind: Effect.UniformBinds.View },
        };
    }

    /** @inheritdoc */
    get attributeTypes()
    {
        return {
            [Effect.AttributeBinds.Position]: { size: 3, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.Position },
            [Effect.AttributeBinds.Colors]: { size: 4, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.Colors },
        };
    }
}


// export the basic shader
module.exports = ShapesEffect;