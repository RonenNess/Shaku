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
	public override get enableDepthTest() {
		return true;
	}

	/**
	 * @inheritdoc
	 */
	public override get enableFaceCulling() {
		return false;
	}

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
}
