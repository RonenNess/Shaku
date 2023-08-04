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
		const vertexShader = `
          attribute vec3 position;
          attribute vec2 uv;
          attribute vec4 color;

          uniform mat4 projection;
          uniform mat4 view;
          uniform mat4 world;

          varying vec2 v_texCoord;
          varying vec4 v_color;

          void main(void) {
              gl_Position = projection * view * world * vec4(position, 1.0);
              gl_PointSize = 1.0;
              v_texCoord = uv;
              v_color = color;
          }
        `;
		return vertexShader;
	}

	/**
	 * @inheritdoc
	 */
	get fragmentCode() {
		const fragmentShader = `
          #ifdef GL_ES
              precision highp float;
          #endif

          uniform sampler2D mainTexture;

          varying vec2 v_texCoord;
          varying vec4 v_color;

          void main(void) {
              gl_FragColor = texture2D(mainTexture, v_texCoord) * v_color;
              if (gl_FragColor.a <= 0.0) { discard; }
              gl_FragColor.rgb *= gl_FragColor.a;
          }
        `;
		return fragmentShader;
	}
}

// export the basic shader
export default Sprites3dEffect;
