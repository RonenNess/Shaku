import { Effect } from "./effect";
import fragmentShader from "./shaders/shapes.frag";
import vertexShader from "./shaders/shapes.vert";

/**
 * Default basic effect to draw 2d shapes.
 */
export class ShapesEffect extends Effect {
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
			[Effect.UniformBinds.Projection]: { type: Effect.UniformTypes.MATRIX, bind: Effect.UniformBinds.Projection },
			[Effect.UniformBinds.World]: { type: Effect.UniformTypes.MATRIX, bind: Effect.UniformBinds.World },
			[Effect.UniformBinds.View]: { type: Effect.UniformTypes.MATRIX, bind: Effect.UniformBinds.View },
		};
	}

	/**
	 * @inheritdoc
	 */
	public override getAttributeTypes() {
		return {
			[Effect.AttributeBinds.Position]: { size: 3, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.Position },
			[Effect.AttributeBinds.Colors]: { size: 4, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.Colors },
		};
	}
}
