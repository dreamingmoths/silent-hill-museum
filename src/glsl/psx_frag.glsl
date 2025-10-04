precision highp float;
precision highp int;
precision highp sampler2D;
precision highp usampler2D;

in vec2 vUv;
flat in ivec2 vTexInfo;

uniform vec3 ambientLightColor;
uniform sampler2D clutTexture;
uniform usampler2D imgTexture;
uniform vec2 imgSize;
uniform float opacity;
uniform float alphaTest;

layout(location = 0) out highp vec4 pc_fragColor;

void main() {
    int clutRow = vTexInfo.y;

    ivec2 imgXy = ivec2(vUv.xy * imgSize);
    uint paletteIndex = texelFetch(imgTexture, imgXy, 0).r;

    ivec2 clutXy = ivec2(paletteIndex, clutRow);
    vec4 color = texelFetch(clutTexture, clutXy, 0);

    float alpha = opacity * color.a;
    if (alpha <= alphaTest) {
        discard;
    }

    pc_fragColor = vec4(color.rgb * ambientLightColor, alpha);
}
