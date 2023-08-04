#version 300 es
in vec3 position;
in vec2 uv;
in vec4 color;

uniform mat4 projection;
uniform mat4 world;

out vec2 v_texCoord;
out vec4 v_color;

void main(void) {
    gl_Position = projection * world * vec4(position, 1.0);
    gl_PointSize = 1.0;
    v_texCoord = uv;
    v_color = color;
}
