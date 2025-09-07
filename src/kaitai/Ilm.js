// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

import KaitaiStream from "./runtime/KaitaiStream";

/**
 * Ilm is the skeletal 3D model format used in Silent Hill (PSX).
 *
 * The header contains a table of objects, each with a name, ID, and offset to
 * its body. Each body contains vertex and primitive data.
 *
 * Note that the vertices are stored untransformed; the anm format is necessary
 * to render the model correctly.
 */

var Ilm = (function () {
  function Ilm(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

    this._read();
  }
  Ilm.prototype._read = function () {
    this.magic = this._io.readBytes(2);
    if (!(KaitaiStream.byteArrayCompare(this.magic, [48, 6]) == 0)) {
      throw new KaitaiStream.ValidationNotEqualError(
        [48, 6],
        this.magic,
        this._io,
        "/seq/0"
      );
    }
    this.isInitialized = this._io.readU1();
    this._unnamed2 = this._io.readU1();
    this.unkOfs = this._io.readU4le();
    if (!(this.unkOfs == 20)) {
      throw new KaitaiStream.ValidationNotEqualError(
        20,
        this.unkOfs,
        this._io,
        "/seq/3"
      );
    }
    this.numObjs = this._io.readU4le();
    this.objTableOfs = this._io.readU4le();
    this.idTableOfs = this._io.readU4le();
    this.name = KaitaiStream.bytesToStr(this._io.readBytes(24), "ASCII");
    this.objs = [];
    for (var i = 0; i < this.numObjs; i++) {
      this.objs.push(new Obj(this._io, this, this._root));
    }
  };

  var Uv = (Ilm.Uv = (function () {
    function Uv(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    Uv.prototype._read = function () {
      this.u = this._io.readU1();
      this.v = this._io.readU1();
    };

    return Uv;
  })());

  var ObjBody = (Ilm.ObjBody = (function () {
    function ObjBody(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    ObjBody.prototype._read = function () {
      this.numPrims = this._io.readU1();
      this.numVertices = this._io.readU1();
      this.numVertices2 = this._io.readU1();
      this._unnamed3 = this._io.readU1();
      this.primsOfs = this._io.readU4le();
      this.vertexXyOfs = this._io.readU4le();
      this.vertexZOfs = this._io.readU4le();
      this.normalSectionOfs = this._io.readU4le();
      this.nextOfs = this._io.readU4le();
    };
    Object.defineProperty(ObjBody.prototype, "prims", {
      get: function () {
        if (this._m_prims !== undefined) return this._m_prims;
        var _pos = this._io.pos;
        this._io.seek(this.primsOfs);
        this._m_prims = [];
        for (var i = 0; i < this.numPrims; i++) {
          this._m_prims.push(new IndexPacket(this._io, this, this._root));
        }
        this._io.seek(_pos);
        return this._m_prims;
      },
    });
    Object.defineProperty(ObjBody.prototype, "vertexXy", {
      get: function () {
        if (this._m_vertexXy !== undefined) return this._m_vertexXy;
        var _pos = this._io.pos;
        this._io.seek(this.vertexXyOfs);
        this._m_vertexXy = [];
        for (var i = 0; i < this.numVertices * 2; i++) {
          this._m_vertexXy.push(this._io.readS2le());
        }
        this._io.seek(_pos);
        return this._m_vertexXy;
      },
    });
    Object.defineProperty(ObjBody.prototype, "vertexZ", {
      get: function () {
        if (this._m_vertexZ !== undefined) return this._m_vertexZ;
        var _pos = this._io.pos;
        this._io.seek(this.vertexZOfs);
        this._m_vertexZ = [];
        for (var i = 0; i < this.numVertices; i++) {
          this._m_vertexZ.push(this._io.readS2le());
        }
        this._io.seek(_pos);
        return this._m_vertexZ;
      },
    });

    return ObjBody;
  })());

  var Obj = (Ilm.Obj = (function () {
    function Obj(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    Obj.prototype._read = function () {
      this.boneIndexAscii = KaitaiStream.bytesToStr(
        this._io.readBytes(2),
        "ASCII"
      );
      this.name = KaitaiStream.bytesToStr(this._io.readBytes(6), "ASCII");
      this._unnamed2 = this._io.readU1();
      this.baseIndex = this._io.readU1();
      this._unnamed4 = this._io.readU1();
      this._unnamed5 = this._io.readU1();
      this.ofs = this._io.readU4le();
    };
    Object.defineProperty(Obj.prototype, "boneIndex", {
      get: function () {
        if (this._m_boneIndex !== undefined) return this._m_boneIndex;
        this._m_boneIndex = parseInt(this.boneIndexAscii);
        return this._m_boneIndex;
      },
    });
    Object.defineProperty(Obj.prototype, "body", {
      get: function () {
        if (this._m_body !== undefined) return this._m_body;
        var _pos = this._io.pos;
        this._io.seek(this.ofs);
        this._m_body = new ObjBody(this._io, this, this._root);
        this._io.seek(_pos);
        return this._m_body;
      },
    });

    /**
     * all quad/triangle indices for the object are offset by this value
     */

    return Obj;
  })());

  var IndexPacket = (Ilm.IndexPacket = (function () {
    function IndexPacket(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    IndexPacket.prototype._read = function () {
      this.uv0 = new Uv(this._io, this, this._root);
      this._unnamed1 = this._io.readS2le();
      this.uv1 = new Uv(this._io, this, this._root);
      this._unnamed3 = this._io.readS2le();
      this.uv2 = new Uv(this._io, this, this._root);
      this.uv3 = new Uv(this._io, this, this._root);
      this.indices = new PrimIndices(this._io, this, this._root);
      this._unnamed7 = this._io.readBytes(4);
    };

    return IndexPacket;
  })());

  var PrimIndices = (Ilm.PrimIndices = (function () {
    function PrimIndices(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    PrimIndices.prototype._read = function () {
      this.v0 = this._io.readU1();
      this.v1 = this._io.readU1();
      this.v2 = this._io.readU1();
      this.v3 = this._io.readU1();
    };

    return PrimIndices;
  })());
  Object.defineProperty(Ilm.prototype, "idTable", {
    get: function () {
      if (this._m_idTable !== undefined) return this._m_idTable;
      var _pos = this._io.pos;
      this._io.seek(this.idTableOfs);
      this._m_idTable = [];
      for (var i = 0; i < this.numObjs; i++) {
        this._m_idTable.push(this._io.readU1());
      }
      this._io.seek(_pos);
      return this._m_idTable;
    },
  });

  return Ilm;
})();
export default Ilm;
