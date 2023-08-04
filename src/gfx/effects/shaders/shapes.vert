attribute vec3 position;
attribute vec4 color;

uniform mat4 projection;
uniform mat4 world;

varying vec4 v_color;

void main(void) {
    gl_Position = projection * world * vec4(position, 1.0);
    gl_PointSize = 1.0;
    v_color = color;
}
    `;

// fragment shader code
const fragmentShader = `
#ifdef GL_ES
    precision highp float;
#endif

varying vec4 v_color;

void main(void) {
    gl_FragColor = v_color;
    gl_FragColor.rgb *= gl_FragColor.a;
}
