/**
 * "Fast" PSMT unswizzling. Is it really fast? Doubtful, but it uses a single
 * swizzle table lookup per pixel instead of emulating GS memory.
 *
 * The lookup tables are loaded as static assets from `public/swizzles`.
 *
 * See also `lib.ts`.
 *
 * @module
 */
import { psmct32addr } from "./lib";

/**
 * @param swizzle8 the swizzle table, see `swizzle8.bin`
 * @param data input texture
 * @param clut color lookup table
 * @param width width in pixels of output texture
 * @param height height in pixels of output texture
 * @param paletteIndex palette index, used to compute clut base pointer
 */
export const fpsmt8 = (
  swizzle8: Uint16Array,
  data: Uint8Array,
  clut: Uint8Array,
  width: number,
  height: number,
  paletteIndex: number
) => {
  const inputView = new DataView(data.buffer);
  const clutView = new DataView(clut.buffer);
  const result = new Uint8Array(data.length << 2);
  const outputView = new DataView(result.buffer);
  const dbw = width >> 7;

  for (let y = 0; y < height; y++) {
    for (let localX = 0; localX < width; localX++) {
      const pageX = (localX >> 7) << 7;
      const pageY = (y >> 6) << 6;

      const px = localX & 127;
      const py = y & 63;
      const p = px + (py << 7);
      const index = swizzle8[p];

      const qx = pageX + (index & 127);
      const qy = pageY + (index >> 7);
      const q = qx + qy * width;

      const imageAddress = inputView.getUint8(q);
      let clutY = (imageAddress & 0xe0) >> 4;
      let clutX = imageAddress & 0x07;
      if (imageAddress & 0x08) clutY++;
      if (imageAddress & 0x10) clutX += 8;

      const clutAddr = psmct32addr(clutX, clutY, 1, paletteIndex << 2);
      const cX = (clutAddr >> 2) & 63;
      const cY = (clutAddr >> 2) >> 6;

      const pixel = clutView.getUint32((cX + (cY << 6)) << 2, true);
      const column = localX >> 6;

      // ???
      const x =
        (localX & 63) +
        (((column & 1) > 0 ? dbw + (column >> 1) : column >> 1) << 6);
      const byteIndex = x + y * width;

      outputView.setUint32(4 * byteIndex, pixel, true);

      const alpha = result[4 * byteIndex + 3];
      result[4 * byteIndex + 3] =
        alpha >= 0 ? Math.min(alpha << 1, 0xff) : 0xff;
    }
  }

  return result;
};
/**
 *
 * @param swizzle8 the swizzle table, see `swizzle4.bin`
 * @param data input texture
 * @param clut color lookup table
 * @param width width in pixels of output texture
 * @param height height in pixels of output texture
 * @param paletteIndex palette index, used to compute clut base pointer
 */
export const fpsmt4 = (
  swizzle4: Uint16Array,
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
  let pixelIndex = 0;

  const dbw = width >> 7;
  const dbwMask = dbw - 1;
  const dbwShift = Math.log2(dbw);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pageX = x >> 7;
      const pageY = y >> 7;
      const px = x & 127;
      const py = y & 127;
      const p = px + (py << 7);

      const swizzled = swizzle4[p];

      const byteInPage = swizzled >> 1;
      const isHighNibble = swizzled & 1;
      const pageRow = byteInPage >> 6;
      const pageCol = byteInPage & 63;
      const qx = pageCol + (pageX << 6);
      const qy = pageRow + (pageY << 7);
      const q = qx + qy * (width >> 1);

      let imageAddress = inputView.getUint8(q);
      if (isHighNibble) {
        imageAddress = (imageAddress >> 4) & 0xf;
      } else {
        imageAddress = imageAddress & 0xf;
      }
      let clutY = (imageAddress >> 3) & 1;
      let clutX = imageAddress & 7;
      const colorAddress = psmct32addr(clutX, clutY, 1, paletteIndex * 4);
      const pixel = clutView.getUint32(colorAddress, true);

      const srcPageIndex = (x >> 7) + (y >> 5) * dbw;
      const wordAddress = srcPageIndex >> 2;
      const dstX = ((wordAddress & dbwMask) << 7) + (x & 127);
      const dstY =
        ((wordAddress >> dbwShift) << 7) + ((srcPageIndex & 3) << 5) + (y & 31);
      const dstPixelIndex = dstX + dstY * width;

      outputView.setUint32(4 * dstPixelIndex, pixel, true);
      const alpha = result[4 * dstPixelIndex + 3];
      result[4 * dstPixelIndex + 3] =
        alpha >= 0 ? Math.min(alpha << 1, 0xff) : 0xff;

      pixelIndex++;
    }
  }

  return result;
};
