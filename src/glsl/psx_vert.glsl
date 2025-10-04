precision highp float;
precision highp int;

in vec3 position;
in vec2 uv;
in ivec2 texInfo;
in vec4 skinIndex;
in vec4 skinWeight;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 bindMatrix;
uniform mat4 bindMatrixInverse;
uniform highp sampler2D boneTexture;

out vec2 vUv;
flat out ivec2 vTexInfo;

mat4 getBoneMatrix(const in float i) {
    int size = textureSize(boneTexture, 0).x;
    int j = int(i) * 4;
    int x = j % size;
    int y = j / size;
    vec4 v1 = texelFetch(boneTexture, ivec2(x, y), 0);
    vec4 v2 = texelFetch(boneTexture, ivec2(x + 1, y), 0);
    vec4 v3 = texelFetch(boneTexture, ivec2(x + 2, y), 0);
    vec4 v4 = texelFetch(boneTexture, ivec2(x + 3, y), 0);
    return mat4(v1, v2, v3, v4);
}

void main() {
    vUv = uv;
    vTexInfo = texInfo;

    vec3 transformed = vec3(position);
    mat4 boneMatX = getBoneMatrix(skinIndex.x);
    vec4 skinVertex = bindMatrix * vec4(transformed, 1.0);
    vec4 skinned = boneMatX * skinVertex * skinWeight.x;
    transformed = (bindMatrixInverse * skinned).xyz;

    gl_Position = (projectionMatrix * modelViewMatrix * vec4(transformed, 1.0));
}