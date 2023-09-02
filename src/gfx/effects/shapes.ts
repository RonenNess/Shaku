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
	public override get vertexCode() {
		return vertexShader;
	}

	/**
	 * @inheritdoc
	 */
	public override get fragmentCode() {
		return fragmentShader;
	}

	/**
	 * @inheritdoc
	 */
	public override get uniformTypes() {
		return {
			[Effect.UniformBinds.Projection]: { type: Effect.UniformTypes.MATRIX, bind: Effect.UniformBinds.Projection },
			[Effect.UniformBinds.World]: { type: Effect.UniformTypes.MATRIX, bind: Effect.UniformBinds.World },
			[Effect.UniformBinds.View]: { type: Effect.UniformTypes.MATRIX, bind: Effect.UniformBinds.View },
		};
	}

	/**
	 * @inheritdoc
	 */
	public override get attributeTypes() {
		return {
			[Effect.AttributeBinds.Position]: { size: 3, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.Position },
			[Effect.AttributeBinds.Colors]: { size: 4, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.Colors },
		};
	}
}
