import Effect from "./effect";

// vertex shader code
const vertexShader = `
attribute vec3 position;
attribute vec2 uv;
attribute vec4 color;

uniform vec4 outlineColor;
uniform mat4 projection;
uniform mat4 world;

varying vec2 v_texCoord;
varying vec4 v_color;

void main(void) {
    gl_Position = projection * world * vec4(position, 1.0);
    gl_PointSize = 1.0;
    v_texCoord = uv;
    v_color = color;
}
    `;

// fragment shader code
const fragmentShader = `
#ifdef GL_ES
    precision highp float;
#endif

uniform sampler2D mainTexture;
uniform float textureWidth;
uniform float textureHeight;
uniform vec4 outlineColor;
uniform float outlineWeight;

varying vec2 v_texCoord;
varying vec4 v_color;

void main(void) {
    float total = 0.0;
    float grabPixel;

    float facX = (1.0 / textureWidth) * 2.0;
    float facY = (1.0 / textureHeight) * 2.0;
    total +=        texture2D(mainTexture, v_texCoord + vec2(-facX, -facY)).a;
    total +=        texture2D(mainTexture, v_texCoord + vec2(facX, -facY)).a;
    total +=        texture2D(mainTexture, v_texCoord + vec2(facX, facY)).a;
    total +=        texture2D(mainTexture, v_texCoord + vec2(-facX, facY)).a;

    total += texture2D(mainTexture, v_texCoord + vec2(0.0, -facY)).a * 2.0;
    total += texture2D(mainTexture, v_texCoord + vec2(0.0, facY)).a * 2.0;
    total += texture2D(mainTexture, v_texCoord + vec2(-facX, 0.0)).a * 2.0;
    total += texture2D(mainTexture, v_texCoord + vec2(facX, 0.0)).a * 2.0;

    total *= outlineWeight;
    vec4 currColor = texture2D(mainTexture, v_texCoord);

    gl_FragColor = (currColor.a >= 0.9) ? currColor : (outlineColor * vec4(1,1,1,total));
    gl_FragColor.rgb *= gl_FragColor.a;
}
    `;

/**
 * Default basic effect to draw 2d sprites with outline.
 */
class SpritesWithOutlineEffect extends Effect {
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
			[Effect.UniformBinds.View]: { type: Effect.UniformTypes.Matrix, bind: Effect.UniformBinds.View },
			[Effect.UniformBinds.OutlineColor]: { type: Effect.UniformTypes.Color, bind: Effect.UniformBinds.OutlineColor },
			[Effect.UniformBinds.TextureWidth]: { type: Effect.UniformTypes.Float, bind: Effect.UniformBinds.TextureWidth },
			[Effect.UniformBinds.TextureHeight]: { type: Effect.UniformTypes.Float, bind: Effect.UniformBinds.TextureHeight },
			[Effect.UniformBinds.OutlineWeight]: { type: Effect.UniformTypes.Float, bind: Effect.UniformBinds.OutlineWeight },
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
export default SpritesWithOutlineEffect;
