#define PSMT4 20
#define PSMT8 19

#ifndef TEXTURE_COUNT
#define TEXTURE_COUNT 4
#endif

precision highp float;
precision highp int;
precision highp sampler2D;
precision highp usampler2D;
precision highp isampler2D;

in vec2 vUv;
flat in ivec2 vTexInfo;

uniform sampler2D clutTexture;
uniform usampler2D imgTexture[TEXTURE_COUNT];
uniform usampler2D swizzleTexture8;
uniform usampler2D swizzleTexture4;
uniform vec2 imgSize[TEXTURE_COUNT];
uniform vec2 clutSize[TEXTURE_COUNT];
uniform int clutOffsets[TEXTURE_COUNT];
uniform int psm[TEXTURE_COUNT];

layout(location = 0) out highp vec4 pc_fragColor;

const int PSMCT32_BLOCK_FORMAT[32] = int[32](
  0,  1,  4,  5,  16, 17, 20, 21,
  2,  3,  6,  7,  18, 19, 22, 23,

  8,  9,  12, 13, 24, 25, 28, 29,
  10, 11, 14, 15, 26, 27, 30, 31
);

const int PSMCT32_COLUMN_FORMAT[16] = int[16](
  0,  1,  4,  5,  8,  9,  12, 13,
  2,  3,  6,  7,  10, 11, 14, 15
);

/* assumes page = 0 */
int psmct32addr(int x, int y, int base) {
    int px = x & 0x3f;
    int py = y & 0x1f;

    int blockX = px >> 3;
    int blockY = py >> 3;
    int block = PSMCT32_BLOCK_FORMAT[blockX + (blockY << 3)];

    int bx = px & 7;
    int by = py & 7;

    int column = by >> 1;

    int cx = bx;
    int cy = by - (column << 1);
    int cw = PSMCT32_COLUMN_FORMAT[cx + (cy << 3)];

    int resultIndex = ((base + block) << 6) + (column << 4) + cw;

    return resultIndex << 2;
}

#define FETCH_IMAGE_TEXEL(i) case i: clutIndex = int(texelFetch(imgTexture[i], xy, 0).r); break
int readImage(ivec2 xy, int texUnit) {
    int clutIndex;
    switch(texUnit) {
        #if TEXTURE_COUNT > 0
        FETCH_IMAGE_TEXEL(0);
        #endif

        #if TEXTURE_COUNT > 1
        FETCH_IMAGE_TEXEL(1);
        #endif

        #if TEXTURE_COUNT > 2
        FETCH_IMAGE_TEXEL(2);
        #endif

        #if TEXTURE_COUNT > 3
        FETCH_IMAGE_TEXEL(3);
        #endif

        #if TEXTURE_COUNT > 4
        FETCH_IMAGE_TEXEL(4);
        #endif
    }
    return clutIndex;
}

ivec2 unswizzle8(ivec2 imgXy, vec2 size, int texUnit) {
    int x = imgXy.x;
    int y = imgXy.y;
    int column = x >> 6;
    int dbw = int(size.x) >> 7;
    int m = int(column >= dbw);
    int colRemap = (column << 1)
                + m * (1 - (dbw << 1));
    int localX = (x & 63) + (colRemap << 6);

    int pageX = (localX >> 7) << 7;
    int pageY = (y >> 6) << 6;

    int px = localX & 127;
    int py = y & 63;
    int index = int(texelFetch(swizzleTexture8, ivec2(px, py), 0).r);

    int qx = pageX + (index & 127);
    int qy = pageY + (index >> 7);

    ivec2 xy = ivec2(qx, qy);
    int clutIndex = readImage(xy, texUnit);

    int clutX = clutIndex & 7;
    int clutY = (clutIndex & 0xe0) >> 4;
    
    clutX += (clutIndex & 16) >> 1;
    clutY += (clutIndex & 8) >> 3;
    
    return ivec2(clutX, clutY);
}

ivec2 unswizzle4(ivec2 imgXy, vec2 size, int texUnit) {
    int x = imgXy.x;
    int y = imgXy.y;
    int w = int(size.x);

    int dbw = w >> 7;
    int xp = x >> 7;
    int yp = y >> 5;
    int dstPageIndex = (y >> 7) * (dbw << 2) + (yp & 3) + (xp << 2);
    int tile = dstPageIndex >> 2;
    int k = max(w >> 9, 1);
    int u = x & 127;
    int v = y & 31;
    int localX = ((tile % k) << 9) + ((dstPageIndex & 3) << 7) + u;
    int localY = ((tile / k) << 5) + v;
    
    int pageX = localX >> 7;
    int pageY = localY >> 7;
    int px = localX & 127;
    int py = localY & 127;

    int swizzled = int(texelFetch(swizzleTexture4, ivec2(px, py), 0).r);

    int byteInPage = swizzled >> 1;
    int isHighNibble = swizzled & 1;
    int pageRow = byteInPage >> 6;
    int pageCol = byteInPage & 63;
    int qx = pageCol + (pageX << 6);
    int qy = pageRow + (pageY << 7);
    ivec2 xy = ivec2(qx, qy);

    int clutIndex = readImage(xy, texUnit);
    clutIndex = (clutIndex >> (isHighNibble << 2)) & 0xf;

    int clutY = (clutIndex >> 3) & 1;
    int clutX = clutIndex & 7;
    
    return ivec2(clutX, clutY);
}

void main() {
    /* texture rendering */
    int texUnit = vTexInfo.x;
    int clutRow = vTexInfo.y;

    vec2 size = imgSize[texUnit];
    ivec2 imgXy = ivec2(round(vUv.xy * size));

    int format = psm[texUnit];

    ivec2 clutXy;
    switch (format) {
        case PSMT8:
            clutXy = unswizzle8(imgXy, size, texUnit);
            break;
        case PSMT4:
            clutXy = unswizzle4(imgXy, size, texUnit);
            break;
        default:
            discard;
    }

    int clutInt = psmct32addr(clutXy.x, clutXy.y, clutRow << 2) >> 2;

    vec2 cSize = clutSize[texUnit];
    int w = int(cSize.x);
    ivec2 clutAddr = ivec2(clutInt % w, clutOffsets[texUnit] + (clutInt / w));
    vec4 pixel = texelFetch(clutTexture, clutAddr, 0);

    float pixelAlpha = pixel.a;
    if (pixelAlpha >= 0.0 && pixelAlpha < 0.05) {
        discard;
    }
    float alpha = pixelAlpha >= 0.0 ? min(pixelAlpha * 2.0, 1.0) : 1.0;
    vec3 color = pixel.rgb;

    pc_fragColor = vec4(color, alpha);
}
