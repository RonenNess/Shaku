import fragmentShader from "./shaders/sprites_3d.frag";
import vertexShader from "./shaders/sprites_3d.vert";
import { SpritesEffect } from "./sprites";

/**
 * Default basic effect to draw 2d sprites.
 */
export class Sprites3dEffect extends SpritesEffect {
	/**
	 * @inheritdoc
	 */
	public override getEnableDepthTest() {
		return true;
	}

	/**
	 * @inheritdoc
	 */
	public override getEnableFaceCulling() {
		return false;
	}

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
}
