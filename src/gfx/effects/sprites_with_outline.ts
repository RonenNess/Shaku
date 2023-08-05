import Effect from "./effect";
import fragmentShader from "./shaders/sprites_with_outline.frag";
import vertexShader from "./shaders/sprites_with_outline.vert";

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
