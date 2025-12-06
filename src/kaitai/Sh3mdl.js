// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

import KaitaiStream from "./runtime/KaitaiStream";
var Sh3mdl = (function () {
  Sh3mdl.Psm = Object.freeze({
    PSMCT32: 0,
    PSMCT24: 1,
    PSMCT16: 2,
    PSMCT16S: 10,
    PSMT8: 19,
    PSMT4: 20,
    PSMT8H: 27,
    PSMT4HL: 36,
    PSMT4HH: 44,
    PSMZ32: 48,
    PSMZ24: 49,
    PSMZ16: 50,
    PSMZ16S: 58,

    0: "PSMCT32",
    1: "PSMCT24",
    2: "PSMCT16",
    10: "PSMCT16S",
    19: "PSMT8",
    20: "PSMT4",
    27: "PSMT8H",
    36: "PSMT4HL",
    44: "PSMT4HH",
    48: "PSMZ32",
    49: "PSMZ24",
    50: "PSMZ16",
    58: "PSMZ16S",
  });

  function Sh3mdl(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

    this._read();
  }
  Sh3mdl.prototype._read = function () {
    this.noTextureId = this._io.readU1();
    this.padding = this._io.readBytes(3);
    this.characterId = this._io.readS4le();
    this.numTextures = this._io.readS4le();
    this.ofsTextureHeader = this._io.readS4le();
    this.ofsCluster = this._io.readS4le();
    this.ofsModelHeader = this._io.readS4le();
  };

  var BonePair = (Sh3mdl.BonePair = (function () {
    function BonePair(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    BonePair.prototype._read = function () {
      this.parent = this._io.readU1();
      this.child = this._io.readU1();
    };

    return BonePair;
  })());

  var VifSection = (Sh3mdl.VifSection = (function () {
    function VifSection(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    VifSection.prototype._read = function () {
      this._unnamed0 = this._io.readBytes(8);
      this.numVertexGroups = this._io.readS4le();
      this._unnamed2 = this._io.readS4le();
      this.ofsVertexBase = this._io.readS4le();
      this.ofsBoneMatrixBase = this._io.readS4le();
      this._unnamed5 = this._io.readS4le();
      this._unnamed6 = this._io.readS4le();
      this.trianglesStartIndex = this._io.readS4le();
      this.ofsTriangles = this._io.readS4le();
      this.groups = [];
      for (var i = 0; i < this.numVertexGroups; i++) {
        this.groups.push(new VertexGroup(this._io, this, this._root));
      }
      this.attributes = [];
      for (var i = 0; i < this.numVertexGroups; i++) {
        this.attributes.push(
          new VertexAttributes(this._io, this, this._root, this.groups[i])
        );
      }
      this._unnamed11 = this._io.readBytes(8);
      this.triangles = [];
      for (
        var i = 0;
        i < (this.ofsTriangles - this.trianglesStartIndex) * 4;
        i++
      ) {
        this.triangles.push(this._io.readS2le());
      }
    };

    return VifSection;
  })());

  var TextureHeader = (Sh3mdl.TextureHeader = (function () {
    function TextureHeader(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    TextureHeader.prototype._read = function () {
      this._unnamed0 = this._io.readBytes(8);
      this.ofs = this._io.readS4le();
      this._unnamed2 = this._io.readBytes(this.ofs - 12);
      this.textures = [];
      for (var i = 0; i < this._root.numTextures; i++) {
        this.textures.push(new Texture(this._io, this, this._root));
      }
    };

    return TextureHeader;
  })());

  var VertexGroup = (Sh3mdl.VertexGroup = (function () {
    function VertexGroup(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    VertexGroup.prototype._read = function () {
      this._unnamed0 = this._io.readBytes(4);
      this.numVertices = this._io.readS4le();
      this.numBonePairs = this._io.readS4le();
      this.vertexDataAddr = this._io.readS4le();
      this.vertexDataEndAddr = this._io.readS4le();
      this.localBoneAddr = [];
      for (var i = 0; i < 4; i++) {
        this.localBoneAddr.push(this._io.readS4le());
      }
    };

    return VertexGroup;
  })());

  var ClutData = (Sh3mdl.ClutData = (function () {
    function ClutData(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    ClutData.prototype._read = function () {
      this.dataSize = this._io.readU4le();
      this._unnamed1 = this._io.readBytes(10);
      this.width = this._io.readU1();
      this._unnamed3 = this._io.readBytes(33);
      this.clutData = this._io.readBytes(this.dataSize);
    };

    return ClutData;
  })());

  var TexturePair = (Sh3mdl.TexturePair = (function () {
    function TexturePair(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    TexturePair.prototype._read = function () {
      this.imageIndex = this._io.readU4le();
      this.paletteIndex = this._io.readU4le();
    };

    return TexturePair;
  })());

  var TextureBlocks = (Sh3mdl.TextureBlocks = (function () {
    function TextureBlocks(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    TextureBlocks.prototype._read = function () {
      this.imageIds = [];
      for (var i = 0; i < this._root.modelHeader.numTextureBlocks; i++) {
        this.imageIds.push(this._io.readU4le());
      }
      if (KaitaiStream.mod(this._root.modelHeader.numTextureBlocks, 4) > 0) {
        this.pad = this._io.readBytes(
          16 - KaitaiStream.mod(4 * this._root.modelHeader.numTextureBlocks, 16)
        );
      }
      this.texturePairs = [];
      for (var i = 0; i < this._root.modelHeader.numTextureInfo; i++) {
        this.texturePairs.push(new TexturePair(this._io, this, this._root));
      }
    };

    /**
     * TODO
     */

    return TextureBlocks;
  })());

  var Part = (Sh3mdl.Part = (function () {
    function Part(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    Part.prototype._read = function () {
      this.meshSize = this._io.readU4le();
      this.type = this._io.readU4le();
      this.ofsVifPacket = this._io.readU4le();
      this.numVifQwords = this._io.readU4le();
      this.vifAddr = this._io.readU4le();
      this.numClusters = this._io.readU4le();
      this.ofsClusters = this._io.readU4le();
      this.numBones = this._io.readU4le();
      this.ofsBones = this._io.readU4le();
      this.numBonePairs = this._io.readU4le();
      this.ofsBonePairs = this._io.readU4le();
      this._unnamed11 = this._io.readU4le();
      this._unnamed12 = this._io.readU4le();
      this.numTextures = this._io.readU4le();
      this.ofsTextureIndex = this._io.readU4le();
      this.ofsTextureParams = this._io.readU4le();
      this.shadingType = this._io.readU1();
      this.specularPos = this._io.readU1();
      this.equipmentId = this._io.readU1();
      this.hoge = this._io.readU1();
      this.backclip = this._io.readU1();
      this.envmapParam = this._io.readU1();
      this.reserved = [];
      for (var i = 0; i < 2; i++) {
        this.reserved.push(this._io.readU1());
      }
      this.phongParamA = this._io.readF4le();
      this.phongParamB = this._io.readF4le();
      this.blinnParam = this._io.readF4le();
      this.padding = [];
      for (var i = 0; i < 3; i++) {
        this.padding.push(this._io.readU4le());
      }
      this.diffuse = [];
      for (var i = 0; i < 4; i++) {
        this.diffuse.push(this._io.readF4le());
      }
      this.ambient = [];
      for (var i = 0; i < 4; i++) {
        this.ambient.push(this._io.readF4le());
      }
      this.specular = [];
      for (var i = 0; i < 4; i++) {
        this.specular.push(this._io.readF4le());
      }
      this.clusters = this._io.readBytes(this.numClusters * 6);
      this.bones = [];
      for (var i = 0; i < this.numBones; i++) {
        this.bones.push(this._io.readS2le());
      }
      this.bonePairs = [];
      for (var i = 0; i < this.numBonePairs; i++) {
        this.bonePairs.push(this._io.readS2le());
      }
      this.textureIndex = this._io.readU1();
      if (this._io.pos > 0) {
        this._unnamed34 = this._io.readBytes(
          16 - KaitaiStream.mod(this._io.pos, 16)
        );
      }
      this._unnamed35 = this._io.readBytes(16);
      this._raw_vifData = this._io.readBytes(this.numVifQwords * 16);
      var _io__raw_vifData = new KaitaiStream(this._raw_vifData);
      this.vifData = new VifSection(_io__raw_vifData, this, this._root);
    };

    return Part;
  })());

  var VertexAttributes = (Sh3mdl.VertexAttributes = (function () {
    function VertexAttributes(_io, _parent, _root, group) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;
      this.group = group;

      this._read();
    }
    VertexAttributes.prototype._read = function () {
      this._unnamed0 = this._io.readBytes(4);
      this._unnamed1 = this._io.readBytes(4);
      this.vertices = [];
      for (var i = 0; i < this.group.numVertices * 3; i++) {
        this.vertices.push(this._io.readS2le());
      }
      if (KaitaiStream.mod(this._io.pos, 4) > 0) {
        this._unnamed3 = this._io.readBytes(
          4 - KaitaiStream.mod(this._io.pos, 4)
        );
      }
      this._unnamed4 = this._io.readBytes(4);
      this.normals = [];
      for (var i = 0; i < this.group.numVertices * 3; i++) {
        this.normals.push(this._io.readS2le());
      }
      if (KaitaiStream.mod(this._io.pos, 4) > 0) {
        this._unnamed6 = this._io.readBytes(
          4 - KaitaiStream.mod(this._io.pos, 4)
        );
      }
      if (this.group.numBonePairs > 0) {
        this._unnamed7 = this._io.readBytes(4);
      }
      if (this.group.numBonePairs > 0) {
        this.weights = [];
        for (
          var i = 0;
          i <
          this.group.numVertices *
            (Math.floor(this.group.numBonePairs / 2) + 1);
          i++
        ) {
          this.weights.push(this._io.readS2le());
        }
      }
      if (KaitaiStream.mod(this._io.pos, 4) > 0) {
        this._unnamed9 = this._io.readBytes(
          4 - KaitaiStream.mod(this._io.pos, 4)
        );
      }
      this._unnamed10 = this._io.readBytes(4);
      this.uvs = [];
      for (var i = 0; i < this.group.numVertices * 2; i++) {
        this.uvs.push(this._io.readS2le());
      }
      if (KaitaiStream.mod(this._io.pos, 4) > 0) {
        this._unnamed12 = this._io.readBytes(
          4 - KaitaiStream.mod(this._io.pos, 4)
        );
      }
    };

    return VertexAttributes;
  })());

  var Texture = (Sh3mdl.Texture = (function () {
    function Texture(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    Texture.prototype._read = function () {
      this._unnamed0 = this._io.readBytes(8);
      this.width = this._io.readU2le();
      this.height = this._io.readU2le();
      this._unnamed3 = this._io.readBytes(4);
      this.imageSize = this._io.readU4le();
      this.headerSize = this._io.readU1();
      this._unnamed6 = this._io.readBytes(4);
      this.psm = this._io.readU1();
      this.dbwFlag = this._io.readU1();
      this._unnamed9 = this._io.readU1();
      this._unnamed10 = this._io.readU1();
      this._unnamed11 = this._io.readU1();
      this._unnamed12 = this._io.readBytes(this.headerSize - 30);
      this.imageData = this._io.readBytes(this.imageSize);
      if (this.psm == Sh3mdl.Psm.PSMT8 || this.psm == Sh3mdl.Psm.PSMT4) {
        this.clut = new ClutData(this._io, this, this._root);
      }
    };
    Object.defineProperty(Texture.prototype, "unk", {
      get: function () {
        if (this._m_unk !== undefined) return this._m_unk;
        this._m_unk = this.dbwFlag > 0 ? 1 : 0;
        return this._m_unk;
      },
    });
    Object.defineProperty(Texture.prototype, "dbw", {
      get: function () {
        if (this._m_dbw !== undefined) return this._m_dbw;
        this._m_dbw = (this.width >>> 6) >>> this.unk;
        return this._m_dbw;
      },
    });
    Object.defineProperty(Texture.prototype, "rrw", {
      get: function () {
        if (this._m_rrw !== undefined) return this._m_rrw;
        this._m_rrw = this.width >>> this.unk;
        return this._m_rrw;
      },
    });
    Object.defineProperty(Texture.prototype, "rrh", {
      get: function () {
        if (this._m_rrh !== undefined) return this._m_rrh;
        this._m_rrh = this.height >>> this.dbwFlag;
        return this._m_rrh;
      },
    });

    return Texture;
  })());

  var ModelHeader = (Sh3mdl.ModelHeader = (function () {
    function ModelHeader(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    ModelHeader.prototype._read = function () {
      this.magic = this._io.readBytes(4);
      if (!(KaitaiStream.byteArrayCompare(this.magic, [3, 0, 255, 255]) == 0)) {
        throw new KaitaiStream.ValidationNotEqualError(
          [3, 0, 255, 255],
          this.magic,
          this._io,
          "/types/model_header/seq/0"
        );
      }
      this.modelVersion = this._io.readU4le();
      this.ofsInitialMatrices = this._io.readU4le();
      this.numBones = this._io.readU4le();
      this.ofsBones = this._io.readU4le();
      this.numBonePairs = this._io.readU4le();
      this.ofsBonePairs = this._io.readU4le();
      this.ofsDefaultPcms = this._io.readU4le();
      this.numOpaqueParts = this._io.readU4le();
      this.ofsOpaqueParts = this._io.readU4le();
      this.numTransparentParts = this._io.readU4le();
      this.ofsTransparentParts = this._io.readU4le();
      this.numTextureBlocks = this._io.readU4le();
      this.ofsTextureBlocks = this._io.readU4le();
      this.numTextureInfo = this._io.readU4le();
      this.ofsTextureInfo = this._io.readU4le();
      this.numClusterNodes = this._io.readU4le();
      this.ofsClusterNodes = this._io.readU4le();
      this.numClusters = this._io.readU4le();
      this.ofsClusters = this._io.readU4le();
      this.numFuncData = this._io.readU4le();
      this.ofsFuncData = this._io.readU4le();
      this.ofsHit = this._io.readU4le();
      this.ofsBox = this._io.readU4le();
      this._unnamed24 = this._io.readU4le();
      this.ofsRelativeMatrices = this._io.readU4le();
      this.ofsRelativeTranses = this._io.readU4le();
      this._unnamed27 = [];
      for (var i = 0; i < 4; i++) {
        this._unnamed27.push(this._io.readS4le());
      }
    };
    Object.defineProperty(ModelHeader.prototype, "initialMatrices", {
      get: function () {
        if (this._m_initialMatrices !== undefined)
          return this._m_initialMatrices;
        var _pos = this._io.pos;
        this._io.seek(this.ofsInitialMatrices);
        this._m_initialMatrices = [];
        for (var i = 0; i < this.numBones; i++) {
          this._m_initialMatrices.push(
            new TransformationMatrix(this._io, this, this._root)
          );
        }
        this._io.seek(_pos);
        return this._m_initialMatrices;
      },
    });
    Object.defineProperty(ModelHeader.prototype, "defaultPcms", {
      get: function () {
        if (this._m_defaultPcms !== undefined) return this._m_defaultPcms;
        var _pos = this._io.pos;
        this._io.seek(this.ofsDefaultPcms);
        this._m_defaultPcms = [];
        for (var i = 0; i < this.numBonePairs; i++) {
          this._m_defaultPcms.push(
            new TransformationMatrix(this._io, this, this._root)
          );
        }
        this._io.seek(_pos);
        return this._m_defaultPcms;
      },
    });
    Object.defineProperty(ModelHeader.prototype, "bones", {
      get: function () {
        if (this._m_bones !== undefined) return this._m_bones;
        var _pos = this._io.pos;
        this._io.seek(this.ofsBones);
        this._m_bones = [];
        for (var i = 0; i < this.numBones; i++) {
          this._m_bones.push(this._io.readU1());
        }
        this._io.seek(_pos);
        return this._m_bones;
      },
    });
    Object.defineProperty(ModelHeader.prototype, "bonePairs", {
      get: function () {
        if (this._m_bonePairs !== undefined) return this._m_bonePairs;
        var _pos = this._io.pos;
        this._io.seek(this.ofsBonePairs);
        this._m_bonePairs = [];
        for (var i = 0; i < this.numBonePairs; i++) {
          this._m_bonePairs.push(new BonePair(this._io, this, this._root));
        }
        this._io.seek(_pos);
        return this._m_bonePairs;
      },
    });
    Object.defineProperty(ModelHeader.prototype, "opaqueParts", {
      get: function () {
        if (this._m_opaqueParts !== undefined) return this._m_opaqueParts;
        var _pos = this._io.pos;
        this._io.seek(this.ofsOpaqueParts);
        this._m_opaqueParts = [];
        for (var i = 0; i < this.numOpaqueParts; i++) {
          this._m_opaqueParts.push(new Part(this._io, this, this._root));
        }
        this._io.seek(_pos);
        return this._m_opaqueParts;
      },
    });
    Object.defineProperty(ModelHeader.prototype, "textureBlocks", {
      get: function () {
        if (this._m_textureBlocks !== undefined) return this._m_textureBlocks;
        if (this._root.numTextures > 0) {
          var _pos = this._io.pos;
          this._io.seek(this.ofsTextureBlocks);
          this._m_textureBlocks = new TextureBlocks(this._io, this, this._root);
          this._io.seek(_pos);
        }
        return this._m_textureBlocks;
      },
    });
    Object.defineProperty(ModelHeader.prototype, "transparentParts", {
      get: function () {
        if (this._m_transparentParts !== undefined)
          return this._m_transparentParts;
        var _pos = this._io.pos;
        this._io.seek(this.ofsTransparentParts);
        this._m_transparentParts = [];
        for (var i = 0; i < this.numTransparentParts; i++) {
          this._m_transparentParts.push(new Part(this._io, this, this._root));
        }
        this._io.seek(_pos);
        return this._m_transparentParts;
      },
    });

    return ModelHeader;
  })());

  /**
   * Represents a 4x4 column-major transformation matrix.
   */

  var TransformationMatrix = (Sh3mdl.TransformationMatrix = (function () {
    function TransformationMatrix(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    TransformationMatrix.prototype._read = function () {
      this.rotation00 = this._io.readF4le();
      this.rotation10 = this._io.readF4le();
      this.rotation20 = this._io.readF4le();
      this.pad0 = this._io.readF4le();
      if (!(this.pad0 == 0)) {
        throw new KaitaiStream.ValidationNotEqualError(
          0,
          this.pad0,
          this._io,
          "/types/transformation_matrix/seq/3"
        );
      }
      this.rotation01 = this._io.readF4le();
      this.rotation11 = this._io.readF4le();
      this.rotation21 = this._io.readF4le();
      this.pad1 = this._io.readF4le();
      if (!(this.pad1 == 0)) {
        throw new KaitaiStream.ValidationNotEqualError(
          0,
          this.pad1,
          this._io,
          "/types/transformation_matrix/seq/7"
        );
      }
      this.rotation02 = this._io.readF4le();
      this.rotation12 = this._io.readF4le();
      this.rotation22 = this._io.readF4le();
      this.pad2 = this._io.readF4le();
      if (!(this.pad2 == 0)) {
        throw new KaitaiStream.ValidationNotEqualError(
          0,
          this.pad2,
          this._io,
          "/types/transformation_matrix/seq/11"
        );
      }
      this.translationX = this._io.readF4le();
      this.translationY = this._io.readF4le();
      this.translationZ = this._io.readF4le();
      this.translationW = this._io.readF4le();
      if (!(this.translationW == 1)) {
        throw new KaitaiStream.ValidationNotEqualError(
          1,
          this.translationW,
          this._io,
          "/types/transformation_matrix/seq/15"
        );
      }
    };

    return TransformationMatrix;
  })());
  Object.defineProperty(Sh3mdl.prototype, "modelHeader", {
    get: function () {
      if (this._m_modelHeader !== undefined) return this._m_modelHeader;
      var _pos = this._io.pos;
      this._io.seek(this.ofsModelHeader);
      this._raw__m_modelHeader = this._io.readBytes(this.ofsTextureHeader);
      var _io__raw__m_modelHeader = new KaitaiStream(this._raw__m_modelHeader);
      this._m_modelHeader = new ModelHeader(
        _io__raw__m_modelHeader,
        this,
        this._root
      );
      this._io.seek(_pos);
      return this._m_modelHeader;
    },
  });
  Object.defineProperty(Sh3mdl.prototype, "textureHeader", {
    get: function () {
      if (this._m_textureHeader !== undefined) return this._m_textureHeader;
      var _pos = this._io.pos;
      this._io.seek(this.ofsTextureHeader);
      this._raw__m_textureHeader = this._io.readBytesFull();
      var _io__raw__m_textureHeader = new KaitaiStream(
        this._raw__m_textureHeader
      );
      this._m_textureHeader = new TextureHeader(
        _io__raw__m_textureHeader,
        this,
        this._root
      );
      this._io.seek(_pos);
      return this._m_textureHeader;
    },
  });

  return Sh3mdl;
})();
export default Sh3mdl;
