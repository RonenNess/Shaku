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
