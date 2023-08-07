import { Effect } from "./effect";
import fragmentShader from "./shaders/msdf_font.frag";
import vertexShader from "./shaders/msdf_font.vert";

/**
 * Default effect to draw MSDF font textures.
 */
export class MsdfFontEffect extends Effect {
	/**
	 * @inheritdoc
	 */
	get vertexCode() {
		return vertexShader;
	}

	/**
	 * @inheritdoc
	 */
	get fragmentCode() {
		return fragmentShader;
	}

	/**
	 * @inheritdoc
	 */
	get uniformTypes() {
		return {
			[Effect.UniformBinds.MainTexture]: { type: Effect.UniformTypes.TEXTURE, bind: Effect.UniformBinds.MainTexture },
			[Effect.UniformBinds.Projection]: { type: Effect.UniformTypes.MATRIX, bind: Effect.UniformBinds.Projection },
			[Effect.UniformBinds.World]: { type: Effect.UniformTypes.MATRIX, bind: Effect.UniformBinds.World },
		};
	}

	/**
	 * @inheritdoc
	 */
	get attributeTypes() {
		return {
			[Effect.AttributeBinds.Position]: { size: 3, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.Position },
			[Effect.AttributeBinds.TextureCoords]: { size: 2, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.TextureCoords },
			[Effect.AttributeBinds.Colors]: { size: 4, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.Colors },
		};
	}
}

// export the basic shader
