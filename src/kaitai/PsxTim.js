// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

import KaitaiStream from "./runtime/KaitaiStream";

/**
 * @see {@link http://fileformats.archiveteam.org/wiki/TIM_(PlayStation_graphics)|Source}
 * @see {@link https://mrclick.zophar.net/TilEd/download/timgfx.txt|Source}
 * @see {@link https://www.romhacking.net/documents/31/|Source}
 */

var PsxTim = (function () {
  PsxTim.BppType = Object.freeze({
    BPP_4: 0,
    BPP_8: 1,
    BPP_16: 2,
    BPP_24: 3,

    0: "BPP_4",
    1: "BPP_8",
    2: "BPP_16",
    3: "BPP_24",
  });

  function PsxTim(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

    this._read();
  }
  PsxTim.prototype._read = function () {
    this.magic = this._io.readBytes(4);
    if (!(KaitaiStream.byteArrayCompare(this.magic, [16, 0, 0, 0]) == 0)) {
      throw new KaitaiStream.ValidationNotEqualError(
        [16, 0, 0, 0],
        this.magic,
        this._io,
        "/seq/0"
      );
    }
    this.flags = this._io.readU4le();
    if (this.hasClut) {
      this.clut = new Bitmap(this._io, this, this._root);
    }
    this.img = new Bitmap(this._io, this, this._root);
  };

  var Bitmap = (PsxTim.Bitmap = (function () {
    function Bitmap(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    Bitmap.prototype._read = function () {
      this.len = this._io.readU4le();
      this.originX = this._io.readU2le();
      this.originY = this._io.readU2le();
      this.width = this._io.readU2le();
      this.height = this._io.readU2le();
      this.body = this._io.readBytes(this.len - 12);
    };

    return Bitmap;
  })());
  Object.defineProperty(PsxTim.prototype, "hasClut", {
    get: function () {
      if (this._m_hasClut !== undefined) return this._m_hasClut;
      this._m_hasClut = (this.flags & 8) != 0;
      return this._m_hasClut;
    },
  });
  Object.defineProperty(PsxTim.prototype, "bpp", {
    get: function () {
      if (this._m_bpp !== undefined) return this._m_bpp;
      this._m_bpp = this.flags & 3;
      return this._m_bpp;
    },
  });

  /**
   * Encodes bits-per-pixel and whether CLUT is present in a file or not
   */

  /**
   * CLUT (Color LookUp Table), one or several palettes for indexed color image, represented as a
   */

  return PsxTim;
})();

export default PsxTim;
