precision mediump float;
precision mediump int;
in vec4 vUv;

uniform sampler2D tClutTexture;
uniform sampler2D imgTexture;

layout(location = 0) out highp vec4 pc_fragColor;

void main() {
    vec2 img_xy = vec2(vUv.x, vUv.y);
    float palette_idx = texture(imgTexture, img_xy).r;

    vec2 clut_xy = vec2(palette_idx * 255.0 / 16.0, vUv.w);
    vec4 j = texture(tClutTexture, clut_xy);

    pc_fragColor = j;
}
