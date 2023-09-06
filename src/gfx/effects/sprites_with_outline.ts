import { Effect } from "./effect";
import fragmentShader from "./shaders/sprites_with_outline.frag";
import vertexShader from "./shaders/sprites_with_outline.vert";

/**
 * Default basic effect to draw 2d sprites with outline.
 */
export class SpritesWithOutlineEffect extends Effect {
	/**
	 * @inheritdoc
	 */
	public override getVertexCode() {
		return vertexShader;
	}

	/**
	 * @inheritdoc
	 */
	public override getFragmentCode() {
		return fragmentShader;
	}

	/**
	 * @inheritdoc
	 */
	public override getUniformTypes() {
		return {
			[Effect.UniformBinds.MainTexture]: { type: Effect.UniformTypes.TEXTURE, bind: Effect.UniformBinds.MainTexture },
			[Effect.UniformBinds.Projection]: { type: Effect.UniformTypes.MATRIX, bind: Effect.UniformBinds.Projection },
			[Effect.UniformBinds.World]: { type: Effect.UniformTypes.MATRIX, bind: Effect.UniformBinds.World },
			[Effect.UniformBinds.View]: { type: Effect.UniformTypes.MATRIX, bind: Effect.UniformBinds.View },
			[Effect.UniformBinds.OutlineColor]: { type: Effect.UniformTypes.COLOR, bind: Effect.UniformBinds.OutlineColor },
			[Effect.UniformBinds.TextureWidth]: { type: Effect.UniformTypes.FLOAT, bind: Effect.UniformBinds.TextureWidth },
			[Effect.UniformBinds.TextureHeight]: { type: Effect.UniformTypes.FLOAT, bind: Effect.UniformBinds.TextureHeight },
			[Effect.UniformBinds.OutlineWeight]: { type: Effect.UniformTypes.FLOAT, bind: Effect.UniformBinds.OutlineWeight },
		};
	}

	/**
	 * @inheritdoc
	 */
	public override getAttributeTypes() {
		return {
			[Effect.AttributeBinds.Position]: { size: 3, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.Position },
			[Effect.AttributeBinds.TextureCoords]: { size: 2, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.TextureCoords },
			[Effect.AttributeBinds.Colors]: { size: 4, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.Colors },
		};
	}
}
