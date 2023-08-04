import Effect from "./effect";

// vertex shader code
const vertexShader = `#version 300 es
in vec3 position;
in vec2 uv;
in vec4 color;

uniform mat4 projection;
uniform mat4 world;

out vec2 v_texCoord;
out vec4 v_color;

void main(void) {
    gl_Position = projection * world * vec4(position, 1.0);
    gl_PointSize = 1.0;
    v_texCoord = uv;
    v_color = color;
}`;

// fragment shader code
const fragmentShader = `#version 300 es
precision highp float;

uniform sampler2D mainTexture;

in vec2 v_texCoord;
in vec4 v_color;

out vec4 FragColor;

float median(float r, float g, float b) {
  return max(min(r, g), min(max(r, g), b));
}

void main(void) {
  vec3 _sample = texture(mainTexture, v_texCoord).rgb;
  float sigDist = median(_sample.r, _sample.g, _sample.b) - 0.5;
  float alpha = clamp(sigDist / fwidth(sigDist) + 0.5, 0.0, 1.0);
  // float alpha = clamp((sigDist / (fwidth(sigDist) * 1.5)) + 0.5, 0.0, 1.0);

  vec3 color = v_color.rgb * alpha;
  FragColor = vec4(color, alpha) * v_color.a;
}`;

/**
 * Default effect to draw MSDF font textures.
 */
class MsdfFontEffect extends Effect {
	/** @inheritdoc */
	get vertexCode() {
		return vertexShader;
	}

	/** @inheritdoc */
	get fragmentCode() {
		return fragmentShader;
	}

	/** @inheritdoc */
	get uniformTypes() {
		return {
			[Effect.UniformBinds.MainTexture]: { type: Effect.UniformTypes.Texture, bind: Effect.UniformBinds.MainTexture },
			[Effect.UniformBinds.Projection]: { type: Effect.UniformTypes.Matrix, bind: Effect.UniformBinds.Projection },
			[Effect.UniformBinds.World]: { type: Effect.UniformTypes.Matrix, bind: Effect.UniformBinds.World },
		};
	}

	/** @inheritdoc */
	get attributeTypes() {
		return {
			[Effect.AttributeBinds.Position]: { size: 3, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.Position },
			[Effect.AttributeBinds.TextureCoords]: { size: 2, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.TextureCoords },
			[Effect.AttributeBinds.Colors]: { size: 4, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.Colors },
		};
	}
}

// export the basic shader
export default MsdfFontEffect;
