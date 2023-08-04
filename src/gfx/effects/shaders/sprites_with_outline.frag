#ifdef GL_ES
    precision highp float;
#endif

uniform sampler2D mainTexture;
uniform float textureWidth;
uniform float textureHeight;
uniform vec4 outlineColor;
uniform float outlineWeight;

varying vec2 v_texCoord;
varying vec4 v_color;

void main(void) {
    float total = 0.0;
    float grabPixel;

    float facX = (1.0 / textureWidth) * 2.0;
    float facY = (1.0 / textureHeight) * 2.0;
    total +=        texture2D(mainTexture, v_texCoord + vec2(-facX, -facY)).a;
    total +=        texture2D(mainTexture, v_texCoord + vec2(facX, -facY)).a;
    total +=        texture2D(mainTexture, v_texCoord + vec2(facX, facY)).a;
    total +=        texture2D(mainTexture, v_texCoord + vec2(-facX, facY)).a;

    total += texture2D(mainTexture, v_texCoord + vec2(0.0, -facY)).a * 2.0;
    total += texture2D(mainTexture, v_texCoord + vec2(0.0, facY)).a * 2.0;
    total += texture2D(mainTexture, v_texCoord + vec2(-facX, 0.0)).a * 2.0;
    total += texture2D(mainTexture, v_texCoord + vec2(facX, 0.0)).a * 2.0;

    total *= outlineWeight;
    vec4 currColor = texture2D(mainTexture, v_texCoord);

    gl_FragColor = (currColor.a >= 0.9) ? currColor : (outlineColor * vec4(1,1,1,total));
    gl_FragColor.rgb *= gl_FragColor.a;
}
