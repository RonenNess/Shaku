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
