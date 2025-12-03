/**
 * Library for working with PS2 textures.
 *
 * ⭐️ This file is largely taken from other resources online. The PSMT4 and
 * PSMT8 functions aren't currently (December 2nd, 2025) used by the Silent Hill
 * Museum project, but they are left in for reference as TypeScript translations
 * of other resources. To see what this project is using instead, see
 * `ps2_frag.glsl` and the `fpsmt8` + `fpsmt4` functions.
 *
 * Credits:
 * - GS User's Manual 6.0 (2002)
 * - https://github.com/Nenkai/PDTools
 * - https://github.com/Murugo/Misc-Game-Research/blob/main/PS2/Common/gsutil/gsutil.cpp
 *
 * @module
 */

// prettier-ignore
export const PSMCT32_BLOCK_TABLE = [
  0,  1,  4,  5,  16, 17, 20, 21,
  2,  3,  6,  7,  18, 19, 22, 23,

  8,  9,  12, 13, 24, 25, 28, 29,
  10, 11, 14, 15, 26, 27, 30, 31,
] as const;

// prettier-ignore
export const PSMCT32_COLUMN_TABLE = [
  0,  1,  4,  5,  8,  9,  12, 13,
  2,  3,  6,  7,  10, 11, 14, 15,
];

// prettier-ignore
export const PSMT8_BLOCK_TABLE = [
  0,  1,  4,  5,  16, 17, 20, 21,
  2,  3,  6,  7,  18, 19, 22, 23,
  8,  9,  12, 13, 24, 25, 28, 29,
  10, 11, 14, 15, 26, 27, 30, 31
] as const;

// prettier-ignore
export const PSMT8_COLUMN_TABLE = [
  [
    0, 1, 4, 5, 8, 9, 12, 13, 
    0, 1, 4, 5, 8, 9, 12, 13,
    
    2, 3, 6, 7, 10, 11, 14, 15,
    2, 3, 6, 7, 10, 11, 14, 15,

    8, 9, 12, 13, 0, 1, 4, 5,
    8, 9, 12, 13, 0, 1, 4, 5,
    
    10, 11, 14, 15, 2, 3, 6, 7,
    10, 11, 14, 15, 2, 3, 6, 7,
  ],
  [
    8, 9, 12, 13, 0, 1, 4, 5, 
    8, 9, 12, 13, 0, 1, 4, 5, 
    
    10, 11, 14, 15, 2, 3, 6, 7, 
    10, 11, 14, 15, 2, 3, 6, 7,

    0, 1, 4, 5, 8, 9, 12, 13,
    0, 1, 4, 5, 8, 9, 12, 13,
    
    2, 3, 6, 7, 10, 11, 14, 15,
    2, 3, 6, 7, 10, 11, 14, 15,
  ],
];

// prettier-ignore
export const PSMT8_BYTE_TABLE = [
  0, 0, 0, 0, 0, 0, 0, 0,  2, 2, 2, 2, 2, 2, 2, 2,
  0, 0, 0, 0, 0, 0, 0, 0,  2, 2, 2, 2, 2, 2, 2, 2,

  1, 1, 1, 1, 1, 1, 1, 1,  3, 3, 3, 3, 3, 3, 3, 3,
  1, 1, 1, 1, 1, 1, 1, 1,  3, 3, 3, 3, 3, 3, 3, 3
]

// prettier-ignore
const PSMT4_BLOCK_TABLE = [
  0,  2,  8, 10,
  1,  3,  9, 11,
  4,  6, 12, 14,
  5,  7, 13, 15,
  16, 18, 24, 26,
  17, 19, 25, 27,
  20, 22, 28, 30,
  21, 23, 29, 31
]

//prettier-ignore
const PSMT4_COLUMN_TABLE = [
  [
    0, 1, 4, 5, 8, 9, 12, 13,
    0, 1, 4, 5, 8, 9, 12, 13,
    0, 1, 4, 5, 8, 9, 12, 13,
    0, 1, 4, 5, 8, 9, 12, 13,
    
    2, 3, 6, 7, 10, 11, 14, 15,
    2, 3, 6, 7, 10, 11, 14, 15,
    2, 3, 6, 7, 10, 11, 14, 15,
    2, 3, 6, 7, 10, 11, 14, 15,

    8, 9, 12, 13, 0, 1, 4, 5,
    8, 9, 12, 13, 0, 1, 4, 5,
    8, 9, 12, 13, 0, 1, 4, 5,
    8, 9, 12, 13, 0, 1, 4, 5,
    
    10, 11, 14, 15, 2, 3, 6, 7,
    10, 11, 14, 15, 2, 3, 6, 7,
    10, 11, 14, 15, 2, 3, 6, 7,
    10, 11, 14, 15, 2, 3, 6, 7,
  ],
  [
    8, 9, 12, 13, 0, 1, 4, 5,
    8, 9, 12, 13, 0, 1, 4, 5,
    8, 9, 12, 13, 0, 1, 4, 5, 
    8, 9, 12, 13, 0, 1, 4, 5,
    
    10, 11, 14, 15, 2, 3, 6, 7,
    10, 11, 14, 15, 2, 3, 6, 7,
    10, 11, 14, 15, 2, 3, 6, 7,
    10, 11, 14, 15, 2, 3, 6, 7,

    0, 1, 4, 5, 8, 9, 12, 13,
    0, 1, 4, 5, 8, 9, 12, 13,
    0, 1, 4, 5, 8, 9, 12, 13,
    0, 1, 4, 5, 8, 9, 12, 13,
    
    2, 3, 6, 7, 10, 11, 14, 15,
    2, 3, 6, 7, 10, 11, 14, 15,
    2, 3, 6, 7, 10, 11, 14, 15,
    2, 3, 6, 7, 10, 11, 14, 15,
  ],
];
//prettier-ignore
const PSMT4_BYTE_TABLE = [
  0, 0, 0, 0, 0, 0, 0, 0, 
  2, 2, 2, 2, 2, 2, 2, 2, 
  4, 4, 4, 4, 4, 4, 4, 4,
  6, 6, 6, 6, 6, 6, 6, 6,
  0, 0, 0, 0, 0, 0, 0, 0, 
  2, 2, 2, 2, 2, 2, 2, 2, 
  4, 4, 4, 4, 4, 4, 4, 4,
  6, 6, 6, 6, 6, 6, 6, 6, 
  
  1, 1, 1, 1, 1, 1, 1, 1,
  3, 3, 3, 3, 3, 3, 3, 3,
  5, 5, 5, 5, 5, 5, 5, 5,
  7, 7, 7, 7, 7, 7, 7, 7,
  1, 1, 1, 1, 1, 1, 1, 1,
  3, 3, 3, 3, 3, 3, 3, 3,
  5, 5, 5, 5, 5, 5, 5, 5,
  7, 7, 7, 7, 7, 7, 7, 7,
];

/**
 * Reads a texture as PSMT8, one byte per pixel.
 * @param data input texture
 * @param clut color lookup table
 * @param width width in pixels of output texture
 * @param height height in pixels of output texture
 * @param paletteIndex palette index, used to compute clut base pointer
 */
export const psmt8 = (
  data: Uint8Array,
  clut: Uint8Array,
  width: number,
  height: number,
  paletteIndex: number
) => {
  const inputView = new DataView(data.buffer);
  const clutView = new DataView(clut.slice().buffer);
  const result = new Uint8Array(data.length * 4);
  const outputView = new DataView(result.buffer);
  const dbw = width >> 7;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const byteIndex = x + y * width;
      const pageX = x >> 7;
      const pageY = y >> 6;
      const page = pageX + pageY * dbw;

      const px = x - (pageX << 7);
      const py = y - (pageY << 6);

      const blockX = px >> 4;
      const blockY = py >> 4;
      const block = PSMT8_BLOCK_TABLE[blockX + (blockY << 3)];

      const bx = px - (blockX << 4);
      const by = py - (blockY << 4);

      const column = by >> 2;

      const cx = bx;
      const cy = by - (column << 2);
      const columnByteIndex = cx + (cy << 4);
      const cw = PSMT8_COLUMN_TABLE[column & 1][columnByteIndex];
      const cb = PSMT8_BYTE_TABLE[columnByteIndex];
      const index =
        (((page << 11) + (block << 6) + (column << 4) + cw) << 2) + (cb >> 1);

      const imageAddress = inputView.getUint8(index);
      let clutY = (imageAddress & 0xe0) >> 4;
      let clutX = imageAddress & 0x07;
      if (imageAddress & 0x08) clutY++;
      if (imageAddress & 0x10) clutX += 8;

      const colorAddress = psmct32addr(clutX, clutY, 1, paletteIndex << 2);
      const pixel = clutView.getUint32(colorAddress, true);

      outputView.setUint32(4 * byteIndex, pixel, true);
      const alpha = result[4 * byteIndex + 3];
      result[4 * byteIndex + 3] =
        alpha >= 0 ? Math.min(alpha << 1, 0xff) : 0xff;
    }
  }
  return result;
};

/**
 * Reads a texture as PSMT4, 4 bits per pixel.
 * @param data input texture
 * @param clut color lookup table
 * @param width width in pixels of output texture
 * @param height height in pixels of output texture
 * @param paletteIndex palette index, used to compute clut base pointer
 */
export const psmt4 = (
  data: Uint8Array,
  clut: Uint8Array,
  width: number,
  height: number,
  paletteIndex: number
) => {
  const inputView = new DataView(data.buffer);
  const clutView = new DataView(clut.slice().buffer);
  const result = new Uint8Array(width * height * 4);
  const outputView = new DataView(result.buffer);

  const dbw = width >> 7;
  let pixelIndex = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pageX = x >> 7;
      const pageY = y >> 7;
      const page = pageX + pageY * dbw;

      const px = x - (pageX << 7);
      const py = y - (pageY << 7);

      const blockX = px >> 5;
      const blockY = py >> 4;
      const block = PSMT4_BLOCK_TABLE[blockX + (blockY << 2)];

      const bx = px - (blockX << 5);
      const by = py - (blockY << 4);

      const column = by >> 2;

      const cx = bx;
      const cy = by - (column << 2);
      const cw = PSMT4_COLUMN_TABLE[column & 1][cx + cy * 32];
      const cb = PSMT4_BYTE_TABLE[cx + (cy << 5)];

      const index =
        (((page << 11) + (block << 6) + (column << 4) + cw) << 2) + (cb >> 1);

      let imageAddress = inputView.getUint8(index);

      if ((cb & 1) > 0) {
        imageAddress = (imageAddress >> 4) & 0xf;
      } else {
        imageAddress = imageAddress & 0xf;
      }

      let clutY = (imageAddress >> 3) & 1; // get 4th bit
      let clutX = imageAddress & 7; // get last 3 bits

      const colorAddress = psmct32addr(clutX, clutY, 1, paletteIndex << 2);

      const pixel = clutView.getUint32(colorAddress, true);
      outputView.setUint32(4 * pixelIndex, pixel, true);
      const alpha = result[4 * pixelIndex + 3];
      result[4 * pixelIndex + 3] =
        alpha >= 0 ? Math.min(alpha << 1, 0xff) : 0xff;
      pixelIndex++;
    }
  }

  return result;
};

/**
 * Writes data as PSMCT32.
 * @param data input texture
 * @param width output texture width
 * @param height output texture height
 * @param dbw destination buffer width
 */
export const psmct32 = (
  data: Uint8Array,
  width: number,
  height: number,
  dbw: number
) => {
  const inputView = new DataView(data.buffer);
  const result = new Uint8Array(Math.max(data.length, 64 * 32 * 4));
  const outputView = new DataView(result.buffer);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const byteIndex = (x + y * width) << 2;
      const pixel = inputView.getUint32(byteIndex, true);
      const a = psmct32addr(x, y, dbw, 0);
      outputView.setUint32(a, pixel, true);
    }
  }

  return result;
};

export const psmct32addr = (x: number, y: number, dbw: number, base = 0) => {
  const pageX = x >> 6;
  const pageY = y >> 5;
  const page = pageX + pageY * dbw;

  const px = x & 0x3f;
  const py = y & 0x1f;

  const blockX = px >> 3;
  const blockY = py >> 3;
  const block = PSMCT32_BLOCK_TABLE[blockX + (blockY << 3)];

  const bx = px - (blockX << 3);
  const by = py - (blockY << 3);

  const column = by >> 1;

  const cx = bx;
  const cy = by - (column << 1);
  const cw = PSMCT32_COLUMN_TABLE[cx + (cy << 3)];

  const resultIndex = (page << 11) + ((base + block) << 6) + (column << 4) + cw;

  return resultIndex << 2;
};
