#ifdef GL_ES
    precision highp float;
#endif

uniform sampler2D mainTexture;
varying vec2 v_texCoord;

void main(void) {
    gl_FragColor = texture2D(mainTexture, v_texCoord);
    gl_FragColor.rgb *= gl_FragColor.a;
}
