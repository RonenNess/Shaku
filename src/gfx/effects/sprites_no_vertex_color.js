/**
 * Implement a basic effect to draw sprites without vertex color.
 * 
 * |-- copyright and license --|
 * @module     Shaku
 * @file       shaku\src\gfx\effects\sprites_no_vertex_color.js
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
attribute vec2 uv;

uniform mat4 projection;
uniform mat4 world;

varying vec2 v_texCoord;

void main(void) {
    gl_Position = projection * world * vec4(position, 1.0);
    gl_PointSize = 1.0;
    v_texCoord = uv;
}
    `;

// fragment shader code
const fragmentShader = `  
#ifdef GL_ES
    precision highp float;
#endif

uniform sampler2D mainTexture;
varying vec2 v_texCoord;

void main(void) {
    gl_FragColor = texture2D(mainTexture, v_texCoord);
    gl_FragColor.rgb *= gl_FragColor.a;
}
    `;

/**
 * Default basic effect to draw 2d sprites without vertex color.
 */
class SpritesEffectNoVertexColor extends Effect
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
            [Effect.UniformBinds.MainTexture]: { type: Effect.UniformTypes.Texture, bind: Effect.UniformBinds.MainTexture },
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
            [Effect.AttributeBinds.TextureCoords]: { size: 2, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.TextureCoords },
        };
    }
}


// export the basic shader
module.exports = SpritesEffectNoVertexColor;