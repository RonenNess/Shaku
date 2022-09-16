/**
 * Implement an effect to draw MSDF font textures.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\effects\msdf_font.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const Effect = require("./effect");

// vertex shader code
const vertexShader = `#version 300 es
in vec3 a_position;
in vec2 a_coord;
in vec4 a_color;

uniform mat4 u_projection;
uniform mat4 u_world;

out vec2 v_texCoord;
out vec4 v_color;

void main(void) {
    gl_Position = u_projection * u_world * vec4(a_position, 1.0);
    gl_PointSize = 1.0;
    v_texCoord = a_coord;
    v_color = a_color;
}`;

// fragment shader code
const fragmentShader = `#version 300 es
precision highp float;

uniform sampler2D u_texture;

in vec2 v_texCoord;
in vec4 v_color;

out vec4 FragColor;

float median(float r, float g, float b) {
  return max(min(r, g), min(max(r, g), b));
}

void main(void) {
  vec3 _sample = texture(u_texture, v_texCoord).rgb;
  float sigDist = median(_sample.r, _sample.g, _sample.b) - 0.5;
  float alpha = clamp(sigDist / fwidth(sigDist) + 0.5, 0.0, 1.0);
  // float alpha = clamp((sigDist / (fwidth(sigDist) * 1.5)) + 0.5, 0.0, 1.0);

  vec3 color = v_color.rgb * alpha;
  FragColor = vec4(color, alpha) * v_color.a;
}`;

/**
 * Default effect to draw MSDF font textures.
 */
class MsdfFontEffect extends Effect
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
            "u_texture": { type: Effect.UniformTypes.Texture, bind: Effect.UniformBinds.MainTexture },
            "u_projection": { type: Effect.UniformTypes.Matrix, bind: Effect.UniformBinds.Projection },
            "u_world": { type: Effect.UniformTypes.Matrix, bind: Effect.UniformBinds.World },
        };
    }

    /** @inheritdoc */
    get attributeTypes()
    {
        return {
            "a_position": { size: 3, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.Position },
            "a_coord": { size: 2, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.TextureCoords },
            "a_color": { size: 4, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.Colors },
        };
    }
}


// export the basic shader
module.exports = MsdfFontEffect;