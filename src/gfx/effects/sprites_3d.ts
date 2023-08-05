import fragmentShader from "./shaders/sprites_3d.frag";
import vertexShader from "./shaders/sprites_3d.vert";
import SpritesEffect from "./sprites";

/**
 * Default basic effect to draw 2d sprites.
 */
class Sprites3dEffect extends SpritesEffect {
	/**
	 * @inheritdoc
	 */
	get enableDepthTest() { return true; }

	/**
	 * @inheritdoc
	 */
	get enableFaceCulling() { return false; }

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
}

// export the basic shader
export default Sprites3dEffect;
