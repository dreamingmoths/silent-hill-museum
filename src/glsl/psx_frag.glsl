precision highp float;
precision highp int;
precision highp sampler2D;
precision highp usampler2D;

in vec2 vUv;
flat in ivec2 vTexInfo;
in vec3 vNormal;

uniform vec3 ambientLightColor;
uniform sampler2D clutTexture;
uniform usampler2D imgTexture;
uniform vec2 imgSize;
uniform float opacity;
uniform float alphaTest;
uniform float uTime;
uniform float lightingMode;

layout(location = 0) out highp vec4 pc_fragColor;

#define LIGHT_SPEED 3.0
#define NORMAL_MAP 1.5
#define DIFFUSE 0.5
#define MATTE 0.0

void main() {
    /* texture rendering */
    int clutRow = vTexInfo.y;
    ivec2 imgXy = ivec2(vUv.xy * imgSize);
    uint paletteIndex = texelFetch(imgTexture, imgXy, 0).r;

    ivec2 clutXy = ivec2(paletteIndex, clutRow);
    vec4 color = texelFetch(clutTexture, clutXy, 0);

    float alpha = opacity * color.a;
    if (alpha <= alphaTest) {
        discard;
    }

    /* lighting */
    vec3 normal = vNormal;
    if (lightingMode > NORMAL_MAP) {
        pc_fragColor = vec4(normal, 1.0);
        return;
    }
    vec3 diffuse = vec3(0.0);
    if (lightingMode > DIFFUSE) {
        float t = LIGHT_SPEED * uTime;
        vec3 lightDir = vec3(sin(t), 0., cos(t));
        diffuse += max(dot(lightDir, normal), 0.0);
    } else {
        diffuse = vec3(1.0);
    }

    pc_fragColor = vec4(color.rgb * ambientLightColor * diffuse, alpha);
}
