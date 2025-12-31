precision highp float;
precision highp int;

in vec3 position;
in vec3 normal;
in vec2 uv;
in ivec3 texInfo;
in vec4 skinIndex;
in vec4 skinWeight;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform mat4 bindMatrix;
uniform mat4 bindMatrixInverse;
uniform highp sampler2D boneTexture;

out vec3 vNormal;
out vec2 vUv;
flat out ivec3 vTexInfo;

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

    vec4 skinVertex = bindMatrix * vec4(position, 1.0);
    mat4 boneMatX = getBoneMatrix(skinIndex.x);
    mat4 boneMatY = getBoneMatrix(skinIndex.y);
    mat4 boneMatZ = getBoneMatrix(skinIndex.z);
    mat4 boneMatW = getBoneMatrix(skinIndex.w);
    mat4 boneMatrix =
        boneMatX * skinWeight.x +
        boneMatY * skinWeight.y +
        boneMatZ * skinWeight.z +
        boneMatW * skinWeight.w;

    vec3 transformed = (bindMatrixInverse * (boneMatrix * skinVertex)).xyz;
    mat3 boneMatrix3 = mat3(bindMatrixInverse * boneMatrix * bindMatrix);
    vec3 transformedNormal = boneMatrix3 * normal;
    vNormal = normalMatrix * transformedNormal;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
