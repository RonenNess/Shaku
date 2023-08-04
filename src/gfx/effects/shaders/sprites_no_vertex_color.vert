attribute vec3 position;
attribute vec2 uv;

uniform mat4 projection;
uniform mat4 world;

varying vec2 v_texCoord;

void main(void) {
    gl_Position = projection * world * vec4(position, 1.0);
    gl_PointSize = 1.0;
    v_texCoord = uv;
}
