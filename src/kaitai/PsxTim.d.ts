// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

/**
 * @see {@link http://fileformats.archiveteam.org/wiki/TIM_(PlayStation_graphics)|Source}
 * @see {@link https://mrclick.zophar.net/TilEd/download/timgfx.txt|Source}
 * @see {@link https://www.romhacking.net/documents/31/|Source}
 */
declare class PsxTim {
  constructor(io: any, parent?: any, root?: any);
  __type: "PsxTim";
  _io: any;

  bpp: number;
  hasClut: boolean;
  magic: Uint8Array;

  /**
   * Encodes bits-per-pixel and whether CLUT is present in a file or not
   */
  flags: number;

  /**
   * CLUT (Color LookUp Table), one or several palettes for indexed color image, represented as a
   */
  clut: PsxTim.Bitmap;
  img: PsxTim.Bitmap;
}

declare namespace PsxTim {
  class Bitmap {
    constructor(io: any, parent?: any, root?: any);
    __type: "Bitmap";
    _io: any;

    len: number;
    originX: number;
    originY: number;
    width: number;
    height: number;
    body: Uint8Array;
  }
}

declare namespace PsxTim {
  enum BppType {
    BPP_4 = 0,
    BPP_8 = 1,
    BPP_16 = 2,
    BPP_24 = 3,
  }
}

export = PsxTim;
export as namespace PsxTim;
