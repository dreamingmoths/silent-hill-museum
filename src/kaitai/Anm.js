// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

import F2 from "./F2";
import KaitaiStream from "./runtime/KaitaiStream";

/**
 * Anm is the proprietary 3D animation format of Silent Hill 2 (PC). It
 * describes rotations and translations that are applied to the bones of a
 * model.
 * Parsing an animation requires knowing the structure of the model's skeleton,
 * so the model must be provided to the parser.
 */
var Anm = (function () {
  function Anm(_io, _parent, _root, model) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;
    this.model = model;
  }
  Anm.prototype._read = function () {
    this.blocks = [];
    var i = 0;
    while (!this._io.isEof()) {
      var _t_blocks = new Block(this._io, this, this._root, this.model, i);
      _t_blocks._read();
      this.blocks.push(_t_blocks);
      i++;
    }
  };

  Anm.prototype._fetchInstances = function () {
    for (let i = 0; i < this.blocks.length; i++) {
      this.blocks[i]._fetchInstances();
    }
  };

  Anm.prototype._write__seq = function (io) {
    this._io = io;
    for (let i = 0; i < this.blocks.length; i++) {
      if (this._io.isEof()) {
        throw new KaitaiStream.ConsistencyError(
          "blocks",
          this._io.size - this._io.pos,
          0
        );
      }
      this.blocks[i]._write__seq(this._io);
    }
    if (this._io.isEof() === false) {
      throw new KaitaiStream.ConsistencyError(
        "blocks",
        this._io.size - this._io.pos,
        0
      );
    }
  };

  Anm.prototype._check = function () {
    for (let i = 0; i < this.blocks.length; i++) {
      if (this.blocks[i]._root !== this._root) {
        throw new KaitaiStream.ConsistencyError(
          "blocks",
          this.blocks[i]._root,
          this._root
        );
      }
      if (this.blocks[i]._parent !== this) {
        throw new KaitaiStream.ConsistencyError(
          "blocks",
          this.blocks[i]._parent,
          this
        );
      }
      if (this.blocks[i].model !== this.model) {
        throw new KaitaiStream.ConsistencyError(
          "blocks",
          this.blocks[i].model,
          this.model
        );
      }
      if (this.blocks[i].blockIndex != i) {
        throw new KaitaiStream.ConsistencyError(
          "blocks",
          this.blocks[i].blockIndex,
          i
        );
      }
    }
  };

  /**
   * Identical to isometry_with_axis16 except that the translation vector
   * components are padded to 32 bits.
   */

  var IsometryWithAxis16Padded = (Anm.IsometryWithAxis16Padded = (function () {
    function IsometryWithAxis16Padded(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root;
    }
    IsometryWithAxis16Padded.prototype._read = function () {
      this.translation = new Translation16Padded(this._io, this, this._root);
      this.translation._read();
      this.rotation = new Rotation(this._io, this, this._root);
      this.rotation._read();
      this.axis = new Axis(this._io, this, this._root);
      this.axis._read();
      this.angle = this._io.readS2le();
    };

    IsometryWithAxis16Padded.prototype._fetchInstances = function () {
      this.translation._fetchInstances();
      this.rotation._fetchInstances();
      this.axis._fetchInstances();
    };

    IsometryWithAxis16Padded.prototype._write__seq = function (io) {
      this._io = io;
      this.translation._write__seq(this._io);
      this.rotation._write__seq(this._io);
      this.axis._write__seq(this._io);
      this._io.writeS2le(this.angle);
    };

    IsometryWithAxis16Padded.prototype._check = function () {
      if (this.translation._root !== this._root) {
        throw new KaitaiStream.ConsistencyError(
          "translation",
          this.translation._root,
          this._root
        );
      }
      if (this.translation._parent !== this) {
        throw new KaitaiStream.ConsistencyError(
          "translation",
          this.translation._parent,
          this
        );
      }
      if (this.rotation._root !== this._root) {
        throw new KaitaiStream.ConsistencyError(
          "rotation",
          this.rotation._root,
          this._root
        );
      }
      if (this.rotation._parent !== this) {
        throw new KaitaiStream.ConsistencyError(
          "rotation",
          this.rotation._parent,
          this
        );
      }
      if (this.axis._root !== this._root) {
        throw new KaitaiStream.ConsistencyError(
          "axis",
          this.axis._root,
          this._root
        );
      }
      if (this.axis._parent !== this) {
        throw new KaitaiStream.ConsistencyError(
          "axis",
          this.axis._parent,
          this
        );
      }
    };

    return IsometryWithAxis16Padded;
  })());

  /**
   * A rotation followed by a translation. There are two translation vectors,
   * a start vector and end vector, which are interpolated between over the
   * duration of the frame. The axis and angle are ignored as described in
   * rotation_with_axis.
   */

  var InterpolatedIsometry32 = (Anm.InterpolatedIsometry32 = (function () {
    function InterpolatedIsometry32(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root;
    }
    InterpolatedIsometry32.prototype._read = function () {
      this.translationStart = new Translation32(this._io, this, this._root);
      this.translationStart._read();
      this.translationEnd = new Translation32(this._io, this, this._root);
      this.translationEnd._read();
      this.rotation = new Rotation(this._io, this, this._root);
      this.rotation._read();
      this.axis = new Axis(this._io, this, this._root);
      this.axis._read();
      this.angle = this._io.readS2le();
    };

    InterpolatedIsometry32.prototype._fetchInstances = function () {
      this.translationStart._fetchInstances();
      this.translationEnd._fetchInstances();
      this.rotation._fetchInstances();
      this.axis._fetchInstances();
    };

    InterpolatedIsometry32.prototype._write__seq = function (io) {
      this._io = io;
      this.translationStart._write__seq(this._io);
      this.translationEnd._write__seq(this._io);
      this.rotation._write__seq(this._io);
      this.axis._write__seq(this._io);
      this._io.writeS2le(this.angle);
    };

    InterpolatedIsometry32.prototype._check = function () {
      if (this.translationStart._root !== this._root) {
        throw new KaitaiStream.ConsistencyError(
          "translation_start",
          this.translationStart._root,
          this._root
        );
      }
      if (this.translationStart._parent !== this) {
        throw new KaitaiStream.ConsistencyError(
          "translation_start",
          this.translationStart._parent,
          this
        );
      }
      if (this.translationEnd._root !== this._root) {
        throw new KaitaiStream.ConsistencyError(
          "translation_end",
          this.translationEnd._root,
          this._root
        );
      }
      if (this.translationEnd._parent !== this) {
        throw new KaitaiStream.ConsistencyError(
          "translation_end",
          this.translationEnd._parent,
          this
        );
      }
      if (this.rotation._root !== this._root) {
        throw new KaitaiStream.ConsistencyError(
          "rotation",
          this.rotation._root,
          this._root
        );
      }
      if (this.rotation._parent !== this) {
        throw new KaitaiStream.ConsistencyError(
          "rotation",
          this.rotation._parent,
          this
        );
      }
      if (this.axis._root !== this._root) {
        throw new KaitaiStream.ConsistencyError(
          "axis",
          this.axis._root,
          this._root
        );
      }
      if (this.axis._parent !== this) {
        throw new KaitaiStream.ConsistencyError(
          "axis",
          this.axis._parent,
          this
        );
      }
    };

    return InterpolatedIsometry32;
  })());

  var TransformHeader = (Anm.TransformHeader = (function () {
    TransformHeader.TransformType = Object.freeze({
      None: 0,
      Rotation: 1,
      Isometry: 2,
      RotationWithAxis: 3,
      IsometryWithAxis: 4,
      IsometryWithAxis5: 5,
      InterpolatedIsometry: 6,
      Identity: 7,

      0: "None",
      1: "Rotation",
      2: "Isometry",
      3: "RotationWithAxis",
      4: "IsometryWithAxis",
      5: "IsometryWithAxis5",
      6: "InterpolatedIsometry",
      7: "Identity",
    });

    function TransformHeader(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root;
    }
    TransformHeader.prototype._read = function () {
      this.type = this._io.readBitsIntLe(3);
      this.flag = this._io.readBitsIntLe(1) != 0;
    };

    TransformHeader.prototype._fetchInstances = function () {};

    TransformHeader.prototype._write__seq = function (io) {
      this._io = io;
      this._io.this._io.writeBitsIntLe(3, this.type);
      this._io.this._io.writeBitsIntLe(1, this.flag | 0);
    };

    TransformHeader.prototype._check = function () {};

    /**
     * A number 0-7 that identifies the type of a transform within a block.
     */

    /**
     * Function unknown, but the game does read and store this value.
     */

    return TransformHeader;
  })());

  /**
   * A rotation followed by a translation using 32-bit floating point.
   */

  var Isometry32 = (Anm.Isometry32 = (function () {
    function Isometry32(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root;
    }
    Isometry32.prototype._read = function () {
      this.translation = new Translation32(this._io, this, this._root);
      this.translation._read();
      this.rotation = new Rotation(this._io, this, this._root);
      this.rotation._read();
    };

    Isometry32.prototype._fetchInstances = function () {
      this.translation._fetchInstances();
      this.rotation._fetchInstances();
    };

    Isometry32.prototype._write__seq = function (io) {
      this._io = io;
      this.translation._write__seq(this._io);
      this.rotation._write__seq(this._io);
    };

    Isometry32.prototype._check = function () {
      if (this.translation._root !== this._root) {
        throw new KaitaiStream.ConsistencyError(
          "translation",
          this.translation._root,
          this._root
        );
      }
      if (this.translation._parent !== this) {
        throw new KaitaiStream.ConsistencyError(
          "translation",
          this.translation._parent,
          this
        );
      }
      if (this.rotation._root !== this._root) {
        throw new KaitaiStream.ConsistencyError(
          "rotation",
          this.rotation._root,
          this._root
        );
      }
      if (this.rotation._parent !== this) {
        throw new KaitaiStream.ConsistencyError(
          "rotation",
          this.rotation._parent,
          this
        );
      }
    };

    return Isometry32;
  })());

  /**
   * A rotation followed by a translation using 16-bit floating point.
   */

  var Isometry16 = (Anm.Isometry16 = (function () {
    function Isometry16(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root;
    }
    Isometry16.prototype._read = function () {
      this.translation = new Translation16(this._io, this, this._root);
      this.translation._read();
      this.rotation = new Rotation(this._io, this, this._root);
      this.rotation._read();
    };

    Isometry16.prototype._fetchInstances = function () {
      this.translation._fetchInstances();
      this.rotation._fetchInstances();
    };

    Isometry16.prototype._write__seq = function (io) {
      this._io = io;
      this.translation._write__seq(this._io);
      this.rotation._write__seq(this._io);
    };

    Isometry16.prototype._check = function () {
      if (this.translation._root !== this._root) {
        throw new KaitaiStream.ConsistencyError(
          "translation",
          this.translation._root,
          this._root
        );
      }
      if (this.translation._parent !== this) {
        throw new KaitaiStream.ConsistencyError(
          "translation",
          this.translation._parent,
          this
        );
      }
      if (this.rotation._root !== this._root) {
        throw new KaitaiStream.ConsistencyError(
          "rotation",
          this.rotation._root,
          this._root
        );
      }
      if (this.rotation._parent !== this) {
        throw new KaitaiStream.ConsistencyError(
          "rotation",
          this.rotation._parent,
          this
        );
      }
    };

    return Isometry16;
  })());

  /**
   * A rotation followed by a translation. The axis is effectively ignored
   * as described in the rotation_with_axis type.
   */

  var IsometryWithAxis32 = (Anm.IsometryWithAxis32 = (function () {
    function IsometryWithAxis32(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root;
    }
    IsometryWithAxis32.prototype._read = function () {
      this.translation = new Translation32(this._io, this, this._root);
      this.translation._read();
      this.rotation = new Rotation(this._io, this, this._root);
      this.rotation._read();
      this.axis = new Axis(this._io, this, this._root);
      this.axis._read();
      this.angle = this._io.readS2le();
    };

    IsometryWithAxis32.prototype._fetchInstances = function () {
      this.translation._fetchInstances();
      this.rotation._fetchInstances();
      this.axis._fetchInstances();
    };

    IsometryWithAxis32.prototype._write__seq = function (io) {
      this._io = io;
      this.translation._write__seq(this._io);
      this.rotation._write__seq(this._io);
      this.axis._write__seq(this._io);
      this._io.writeS2le(this.angle);
    };

    IsometryWithAxis32.prototype._check = function () {
      if (this.translation._root !== this._root) {
        throw new KaitaiStream.ConsistencyError(
          "translation",
          this.translation._root,
          this._root
        );
      }
      if (this.translation._parent !== this) {
        throw new KaitaiStream.ConsistencyError(
          "translation",
          this.translation._parent,
          this
        );
      }
      if (this.rotation._root !== this._root) {
        throw new KaitaiStream.ConsistencyError(
          "rotation",
          this.rotation._root,
          this._root
        );
      }
      if (this.rotation._parent !== this) {
        throw new KaitaiStream.ConsistencyError(
          "rotation",
          this.rotation._parent,
          this
        );
      }
      if (this.axis._root !== this._root) {
        throw new KaitaiStream.ConsistencyError(
          "axis",
          this.axis._root,
          this._root
        );
      }
      if (this.axis._parent !== this) {
        throw new KaitaiStream.ConsistencyError(
          "axis",
          this.axis._parent,
          this
        );
      }
    };

    return IsometryWithAxis32;
  })());

  /**
   * A 3D translation described with 32-bit floating point values.
   */

  var Translation32 = (Anm.Translation32 = (function () {
    function Translation32(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root;
    }
    Translation32.prototype._read = function () {
      this.x = this._io.readF4le();
      this.y = this._io.readF4le();
      this.z = this._io.readF4le();
    };

    Translation32.prototype._fetchInstances = function () {};

    Translation32.prototype._write__seq = function (io) {
      this._io = io;
      this._io.writeF4le(this.x);
      this._io.writeF4le(this.y);
      this._io.writeF4le(this.z);
    };

    Translation32.prototype._check = function () {};

    return Translation32;
  })());

  /**
   * A 3D translation described with 16-bit floating point values which are
   * padded to 32 bits.
   */

  var Translation16Padded = (Anm.Translation16Padded = (function () {
    function Translation16Padded(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root;
    }
    Translation16Padded.prototype._read = function () {
      this.x16 = new F2(this._io, this, null);
      this.x16._read();
      this.xPad = this._io.readBytes(2);
      this.y16 = new F2(this._io, this, null);
      this.y16._read();
      this.yPad = this._io.readBytes(2);
      this.z16 = new F2(this._io, this, null);
      this.z16._read();
      this.zPad = this._io.readBytes(2);
    };

    Translation16Padded.prototype._fetchInstances = function () {
      this.x16._fetchInstances();
      this.y16._fetchInstances();
      this.z16._fetchInstances();
    };

    Translation16Padded.prototype._write__seq = function (io) {
      this._io = io;
      this.x16._write__seq(this._io);
      this._io.writeBytes(this.xPad);
      this.y16._write__seq(this._io);
      this._io.writeBytes(this.yPad);
      this.z16._write__seq(this._io);
      this._io.writeBytes(this.zPad);
    };

    Translation16Padded.prototype._check = function () {
      if (this.xPad.length != 2) {
        throw new KaitaiStream.ConsistencyError("x_pad", this.xPad.length, 2);
      }
      if (this.yPad.length != 2) {
        throw new KaitaiStream.ConsistencyError("y_pad", this.yPad.length, 2);
      }
      if (this.zPad.length != 2) {
        throw new KaitaiStream.ConsistencyError("z_pad", this.zPad.length, 2);
      }
    };
    Object.defineProperty(Translation16Padded.prototype, "x", {
      set: function (v) {
        this._m_x = v;
      },
      get: function () {
        if (this._m_x !== undefined) return this._m_x;
        this._m_x = this.x16.floatValue;
        return this._m_x;
      },
    });

    Translation16Padded.prototype._invalidate_x = function () {
      delete this._m_x;
    };
    Object.defineProperty(Translation16Padded.prototype, "y", {
      set: function (v) {
        this._m_y = v;
      },
      get: function () {
        if (this._m_y !== undefined) return this._m_y;
        this._m_y = this.y16.floatValue;
        return this._m_y;
      },
    });

    Translation16Padded.prototype._invalidate_y = function () {
      delete this._m_y;
    };
    Object.defineProperty(Translation16Padded.prototype, "z", {
      set: function (v) {
        this._m_z = v;
      },
      get: function () {
        if (this._m_z !== undefined) return this._m_z;
        this._m_z = this.z16.floatValue;
        return this._m_z;
      },
    });

    Translation16Padded.prototype._invalidate_z = function () {
      delete this._m_z;
    };

    return Translation16Padded;
  })());

  /**
   * A 3D rotation described by Euler angles. Each angle is a 16-bit
   * fixed-point real number with a 12-bit fraction.
   */

  var Rotation = (Anm.Rotation = (function () {
    function Rotation(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root;
    }
    Rotation.prototype._read = function () {
      this.xInt = this._io.readS2le();
      this.yInt = this._io.readS2le();
      this.zInt = this._io.readS2le();
    };

    Rotation.prototype._fetchInstances = function () {};

    Rotation.prototype._write__seq = function (io) {
      this._io = io;
      this._io.writeS2le(this.xInt);
      this._io.writeS2le(this.yInt);
      this._io.writeS2le(this.zInt);
    };

    Rotation.prototype._check = function () {};
    Object.defineProperty(Rotation.prototype, "x", {
      set: function (v) {
        this._m_x = v;
      },
      get: function () {
        if (this._m_x !== undefined) return this._m_x;
        this._m_x = this.xInt / 4096.0;
        return this._m_x;
      },
    });

    Rotation.prototype._invalidate_x = function () {
      delete this._m_x;
    };
    Object.defineProperty(Rotation.prototype, "y", {
      set: function (v) {
        this._m_y = v;
      },
      get: function () {
        if (this._m_y !== undefined) return this._m_y;
        this._m_y = this.yInt / 4096.0;
        return this._m_y;
      },
    });

    Rotation.prototype._invalidate_y = function () {
      delete this._m_y;
    };
    Object.defineProperty(Rotation.prototype, "z", {
      set: function (v) {
        this._m_z = v;
      },
      get: function () {
        if (this._m_z !== undefined) return this._m_z;
        this._m_z = this.zInt / 4096.0;
        return this._m_z;
      },
    });

    Rotation.prototype._invalidate_z = function () {
      delete this._m_z;
    };

    return Rotation;
  })());

  /**
   * Identical to isometry_with_axis except the translation vector components
   * are 16-bit floating point.
   */

  var IsometryWithAxis16 = (Anm.IsometryWithAxis16 = (function () {
    function IsometryWithAxis16(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root;
    }
    IsometryWithAxis16.prototype._read = function () {
      this.translation = new Translation16(this._io, this, this._root);
      this.translation._read();
      this.rotation = new Rotation(this._io, this, this._root);
      this.rotation._read();
      this.axis = new Axis(this._io, this, this._root);
      this.axis._read();
      this.angle = this._io.readS2le();
    };

    IsometryWithAxis16.prototype._fetchInstances = function () {
      this.translation._fetchInstances();
      this.rotation._fetchInstances();
      this.axis._fetchInstances();
    };

    IsometryWithAxis16.prototype._write__seq = function (io) {
      this._io = io;
      this.translation._write__seq(this._io);
      this.rotation._write__seq(this._io);
      this.axis._write__seq(this._io);
      this._io.writeS2le(this.angle);
    };

    IsometryWithAxis16.prototype._check = function () {
      if (this.translation._root !== this._root) {
        throw new KaitaiStream.ConsistencyError(
          "translation",
          this.translation._root,
          this._root
        );
      }
      if (this.translation._parent !== this) {
        throw new KaitaiStream.ConsistencyError(
          "translation",
          this.translation._parent,
          this
        );
      }
      if (this.rotation._root !== this._root) {
        throw new KaitaiStream.ConsistencyError(
          "rotation",
          this.rotation._root,
          this._root
        );
      }
      if (this.rotation._parent !== this) {
        throw new KaitaiStream.ConsistencyError(
          "rotation",
          this.rotation._parent,
          this
        );
      }
      if (this.axis._root !== this._root) {
        throw new KaitaiStream.ConsistencyError(
          "axis",
          this.axis._root,
          this._root
        );
      }
      if (this.axis._parent !== this) {
        throw new KaitaiStream.ConsistencyError(
          "axis",
          this.axis._parent,
          this
        );
      }
    };

    return IsometryWithAxis16;
  })());

  /**
   * A block of 8 transforms. A single animation frame (consisting of one
   * transform for each bone) must consist of a whole number of blocks, so
   * the last block in a frame should be padded with "none" entries as
   * necessary.
   */

  var Block = (Anm.Block = (function () {
    function Block(_io, _parent, _root, model, blockIndex) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root;
      this.model = model;
      this.blockIndex = blockIndex;
    }
    Block.prototype._read = function () {
      this.header = [];
      var i = 0;

      var allZeros = true;
      var reset = false;

      do {
        var _t_header = new TransformHeader(this._io, this, this._root);
        _t_header._read();
        if (
          !reset &&
          i === 4 &&
          _t_header.type !== 0 &&
          allZeros &&
          (this.blockIndex << 3) % this.numTransformsPerFrame === 0
        ) {
          i = 0;
          this.header = [];
          reset = true;
        }
        if (_t_header.type !== 0) {
          allZeros = false;
        }
        var _ = _t_header;
        this.header.push(_);
        i++;
      } while (!(i == 8 || this._io.isEof()));

      this.transforms = [];
      var i = 0;
      do {
        {
          var on = new Uint8Array([
            this.header[i].type,
            this.model.modelData.skeletonTree[
              KaitaiStream.mod(
                KaitaiStream.mod(
                  this.blockIndex << 3,
                  this.numTransformsPerFrame
                ) + i,
                this.model.modelData.boneCount
              )
            ] == 255
              ? 1
              : 0,
          ]);
          if (KaitaiStream.byteArrayCompare(on, [7, 0]) == 0) {
            var _t_transforms = new Identity(this._io, this, this._root);
            _t_transforms._read();
            var _ = _t_transforms;
            this.transforms.push(_);
          } else if (KaitaiStream.byteArrayCompare(on, [2, 0]) == 0) {
            var _t_transforms = new Isometry16(this._io, this, this._root);
            _t_transforms._read();
            var _ = _t_transforms;
            this.transforms.push(_);
          } else if (KaitaiStream.byteArrayCompare(on, [4, 0]) == 0) {
            var _t_transforms = new IsometryWithAxis16(
              this._io,
              this,
              this._root
            );
            _t_transforms._read();
            var _ = _t_transforms;
            this.transforms.push(_);
          } else if (KaitaiStream.byteArrayCompare(on, [3, 0]) == 0) {
            var _t_transforms = new RotationWithAxis(
              this._io,
              this,
              this._root
            );
            _t_transforms._read();
            var _ = _t_transforms;
            this.transforms.push(_);
          } else if (KaitaiStream.byteArrayCompare(on, [7, 1]) == 0) {
            var _t_transforms = new Identity(this._io, this, this._root);
            _t_transforms._read();
            var _ = _t_transforms;
            this.transforms.push(_);
          } else if (KaitaiStream.byteArrayCompare(on, [4, 1]) == 0) {
            var _t_transforms = new IsometryWithAxis32(
              this._io,
              this,
              this._root
            );
            _t_transforms._read();
            var _ = _t_transforms;
            this.transforms.push(_);
          } else if (KaitaiStream.byteArrayCompare(on, [0, 0]) == 0) {
            var _t_transforms = new None(this._io, this, this._root);
            _t_transforms._read();
            var _ = _t_transforms;
            this.transforms.push(_);
          } else if (KaitaiStream.byteArrayCompare(on, [2, 1]) == 0) {
            var _t_transforms = new Isometry32(this._io, this, this._root);
            _t_transforms._read();
            var _ = _t_transforms;
            this.transforms.push(_);
          } else if (KaitaiStream.byteArrayCompare(on, [5, 1]) == 0) {
            var _t_transforms = new IsometryWithAxis16Padded(
              this._io,
              this,
              this._root
            );
            _t_transforms._read();
            var _ = _t_transforms;
            this.transforms.push(_);
          } else if (KaitaiStream.byteArrayCompare(on, [1, 0]) == 0) {
            var _t_transforms = new Rotation(this._io, this, this._root);
            _t_transforms._read();
            var _ = _t_transforms;
            this.transforms.push(_);
          } else if (KaitaiStream.byteArrayCompare(on, [1, 1]) == 0) {
            var _t_transforms = new Rotation(this._io, this, this._root);
            _t_transforms._read();
            var _ = _t_transforms;
            this.transforms.push(_);
          } else if (KaitaiStream.byteArrayCompare(on, [5, 0]) == 0) {
            var _t_transforms = new IsometryWithAxis16(
              this._io,
              this,
              this._root
            );
            _t_transforms._read();
            var _ = _t_transforms;
            this.transforms.push(_);
          } else if (KaitaiStream.byteArrayCompare(on, [6, 0]) == 0) {
            var _t_transforms = new InterpolatedIsometry16(
              this._io,
              this,
              this._root
            );
            _t_transforms._read();
            var _ = _t_transforms;
            this.transforms.push(_);
          } else if (KaitaiStream.byteArrayCompare(on, [3, 1]) == 0) {
            var _t_transforms = new RotationWithAxis(
              this._io,
              this,
              this._root
            );
            _t_transforms._read();
            var _ = _t_transforms;
            this.transforms.push(_);
          } else if (KaitaiStream.byteArrayCompare(on, [0, 1]) == 0) {
            var _t_transforms = new None(this._io, this, this._root);
            _t_transforms._read();
            var _ = _t_transforms;
            this.transforms.push(_);
          } else if (KaitaiStream.byteArrayCompare(on, [6, 1]) == 0) {
            var _t_transforms = new InterpolatedIsometry32(
              this._io,
              this,
              this._root
            );
            _t_transforms._read();
            var _ = _t_transforms;
            this.transforms.push(_);
          }
        }
        i++;
      } while (!(i == 8 || this._io.isEof()));
    };

    Block.prototype._fetchInstances = function () {
      for (let i = 0; i < this.header.length; i++) {
        this.header[i]._fetchInstances();
      }
      for (let i = 0; i < this.transforms.length; i++) {
        {
          var on = new Uint8Array([
            this.header[i].type,
            this.model.modelData.skeletonTree[
              KaitaiStream.mod(
                KaitaiStream.mod(
                  this.blockIndex << 3,
                  this.numTransformsPerFrame
                ) + i,
                this.model.modelData.boneCount
              )
            ] == 255
              ? 1
              : 0,
          ]);
          if (KaitaiStream.byteArrayCompare(on, [7, 0]) == 0) {
            this.transforms[i]._fetchInstances();
          } else if (KaitaiStream.byteArrayCompare(on, [2, 0]) == 0) {
            this.transforms[i]._fetchInstances();
          } else if (KaitaiStream.byteArrayCompare(on, [4, 0]) == 0) {
            this.transforms[i]._fetchInstances();
          } else if (KaitaiStream.byteArrayCompare(on, [3, 0]) == 0) {
            this.transforms[i]._fetchInstances();
          } else if (KaitaiStream.byteArrayCompare(on, [7, 1]) == 0) {
            this.transforms[i]._fetchInstances();
          } else if (KaitaiStream.byteArrayCompare(on, [4, 1]) == 0) {
            this.transforms[i]._fetchInstances();
          } else if (KaitaiStream.byteArrayCompare(on, [0, 0]) == 0) {
            this.transforms[i]._fetchInstances();
          } else if (KaitaiStream.byteArrayCompare(on, [2, 1]) == 0) {
            this.transforms[i]._fetchInstances();
          } else if (KaitaiStream.byteArrayCompare(on, [5, 1]) == 0) {
            this.transforms[i]._fetchInstances();
          } else if (KaitaiStream.byteArrayCompare(on, [1, 0]) == 0) {
            this.transforms[i]._fetchInstances();
          } else if (KaitaiStream.byteArrayCompare(on, [1, 1]) == 0) {
            this.transforms[i]._fetchInstances();
          } else if (KaitaiStream.byteArrayCompare(on, [5, 0]) == 0) {
            this.transforms[i]._fetchInstances();
          } else if (KaitaiStream.byteArrayCompare(on, [6, 0]) == 0) {
            this.transforms[i]._fetchInstances();
          } else if (KaitaiStream.byteArrayCompare(on, [3, 1]) == 0) {
            this.transforms[i]._fetchInstances();
          } else if (KaitaiStream.byteArrayCompare(on, [0, 1]) == 0) {
            this.transforms[i]._fetchInstances();
          } else if (KaitaiStream.byteArrayCompare(on, [6, 1]) == 0) {
            this.transforms[i]._fetchInstances();
          }
        }
      }
    };

    Block.prototype._write__seq = function (io) {
      this._io = io;
      for (let i = 0; i < this.header.length; i++) {
        this.header[i]._write__seq(this._io);
        var _ = this.header[i];
        if (((i == 8 || this._io.isEof()) != i) == this.header.length - 1) {
          throw new KaitaiStream.ConsistencyError(
            "header",
            i == 8 || this._io.isEof(),
            i == this.header.length - 1
          );
        }
      }
      for (let i = 0; i < this.transforms.length; i++) {
        {
          var on = new Uint8Array([
            this.header[i].type,
            this.model.modelData.skeletonTree[
              KaitaiStream.mod(
                KaitaiStream.mod(
                  this.blockIndex << 3,
                  this.numTransformsPerFrame
                ) + i,
                this.model.modelData.boneCount
              )
            ] == 255
              ? 1
              : 0,
          ]);
          if (KaitaiStream.byteArrayCompare(on, [7, 0]) == 0) {
            this.transforms[i]._write__seq(this._io);
          } else if (KaitaiStream.byteArrayCompare(on, [2, 0]) == 0) {
            this.transforms[i]._write__seq(this._io);
          } else if (KaitaiStream.byteArrayCompare(on, [4, 0]) == 0) {
            this.transforms[i]._write__seq(this._io);
          } else if (KaitaiStream.byteArrayCompare(on, [3, 0]) == 0) {
            this.transforms[i]._write__seq(this._io);
          } else if (KaitaiStream.byteArrayCompare(on, [7, 1]) == 0) {
            this.transforms[i]._write__seq(this._io);
          } else if (KaitaiStream.byteArrayCompare(on, [4, 1]) == 0) {
            this.transforms[i]._write__seq(this._io);
          } else if (KaitaiStream.byteArrayCompare(on, [0, 0]) == 0) {
            this.transforms[i]._write__seq(this._io);
          } else if (KaitaiStream.byteArrayCompare(on, [2, 1]) == 0) {
            this.transforms[i]._write__seq(this._io);
          } else if (KaitaiStream.byteArrayCompare(on, [5, 1]) == 0) {
            this.transforms[i]._write__seq(this._io);
          } else if (KaitaiStream.byteArrayCompare(on, [1, 0]) == 0) {
            this.transforms[i]._write__seq(this._io);
          } else if (KaitaiStream.byteArrayCompare(on, [1, 1]) == 0) {
            this.transforms[i]._write__seq(this._io);
          } else if (KaitaiStream.byteArrayCompare(on, [5, 0]) == 0) {
            this.transforms[i]._write__seq(this._io);
          } else if (KaitaiStream.byteArrayCompare(on, [6, 0]) == 0) {
            this.transforms[i]._write__seq(this._io);
          } else if (KaitaiStream.byteArrayCompare(on, [3, 1]) == 0) {
            this.transforms[i]._write__seq(this._io);
          } else if (KaitaiStream.byteArrayCompare(on, [0, 1]) == 0) {
            this.transforms[i]._write__seq(this._io);
          } else if (KaitaiStream.byteArrayCompare(on, [6, 1]) == 0) {
            this.transforms[i]._write__seq(this._io);
          }
        }
        var _ = this.transforms[i];
        if (((i == 8 || this._io.isEof()) != i) == this.transforms.length - 1) {
          throw new KaitaiStream.ConsistencyError(
            "transforms",
            i == 8 || this._io.isEof(),
            i == this.transforms.length - 1
          );
        }
      }
    };

    Block.prototype._check = function () {
      if (this.header.length == 0) {
        throw new KaitaiStream.ConsistencyError(
          "header",
          this.header.length,
          0
        );
      }
      for (let i = 0; i < this.header.length; i++) {
        if (this.header[i]._root !== this._root) {
          throw new KaitaiStream.ConsistencyError(
            "header",
            this.header[i]._root,
            this._root
          );
        }
        if (this.header[i]._parent !== this) {
          throw new KaitaiStream.ConsistencyError(
            "header",
            this.header[i]._parent,
            this
          );
        }
      }
      if (this.transforms.length == 0) {
        throw new KaitaiStream.ConsistencyError(
          "transforms",
          this.transforms.length,
          0
        );
      }
      for (let i = 0; i < this.transforms.length; i++) {
        {
          var on = new Uint8Array([
            this.header[i].type,
            this.model.modelData.skeletonTree[
              KaitaiStream.mod(
                KaitaiStream.mod(
                  this.blockIndex << 3,
                  this.numTransformsPerFrame
                ) + i,
                this.model.modelData.boneCount
              )
            ] == 255
              ? 1
              : 0,
          ]);
          if (KaitaiStream.byteArrayCompare(on, [7, 0]) == 0) {
            if (this.transforms[i]._root !== this._root) {
              throw new KaitaiStream.ConsistencyError(
                "transforms",
                this.transforms[i]._root,
                this._root
              );
            }
            if (this.transforms[i]._parent !== this) {
              throw new KaitaiStream.ConsistencyError(
                "transforms",
                this.transforms[i]._parent,
                this
              );
            }
          } else if (KaitaiStream.byteArrayCompare(on, [2, 0]) == 0) {
            if (this.transforms[i]._root !== this._root) {
              throw new KaitaiStream.ConsistencyError(
                "transforms",
                this.transforms[i]._root,
                this._root
              );
            }
            if (this.transforms[i]._parent !== this) {
              throw new KaitaiStream.ConsistencyError(
                "transforms",
                this.transforms[i]._parent,
                this
              );
            }
          } else if (KaitaiStream.byteArrayCompare(on, [4, 0]) == 0) {
            if (this.transforms[i]._root !== this._root) {
              throw new KaitaiStream.ConsistencyError(
                "transforms",
                this.transforms[i]._root,
                this._root
              );
            }
            if (this.transforms[i]._parent !== this) {
              throw new KaitaiStream.ConsistencyError(
                "transforms",
                this.transforms[i]._parent,
                this
              );
            }
          } else if (KaitaiStream.byteArrayCompare(on, [3, 0]) == 0) {
            if (this.transforms[i]._root !== this._root) {
              throw new KaitaiStream.ConsistencyError(
                "transforms",
                this.transforms[i]._root,
                this._root
              );
            }
            if (this.transforms[i]._parent !== this) {
              throw new KaitaiStream.ConsistencyError(
                "transforms",
                this.transforms[i]._parent,
                this
              );
            }
          } else if (KaitaiStream.byteArrayCompare(on, [7, 1]) == 0) {
            if (this.transforms[i]._root !== this._root) {
              throw new KaitaiStream.ConsistencyError(
                "transforms",
                this.transforms[i]._root,
                this._root
              );
            }
            if (this.transforms[i]._parent !== this) {
              throw new KaitaiStream.ConsistencyError(
                "transforms",
                this.transforms[i]._parent,
                this
              );
            }
          } else if (KaitaiStream.byteArrayCompare(on, [4, 1]) == 0) {
            if (this.transforms[i]._root !== this._root) {
              throw new KaitaiStream.ConsistencyError(
                "transforms",
                this.transforms[i]._root,
                this._root
              );
            }
            if (this.transforms[i]._parent !== this) {
              throw new KaitaiStream.ConsistencyError(
                "transforms",
                this.transforms[i]._parent,
                this
              );
            }
          } else if (KaitaiStream.byteArrayCompare(on, [0, 0]) == 0) {
            if (this.transforms[i]._root !== this._root) {
              throw new KaitaiStream.ConsistencyError(
                "transforms",
                this.transforms[i]._root,
                this._root
              );
            }
            if (this.transforms[i]._parent !== this) {
              throw new KaitaiStream.ConsistencyError(
                "transforms",
                this.transforms[i]._parent,
                this
              );
            }
          } else if (KaitaiStream.byteArrayCompare(on, [2, 1]) == 0) {
            if (this.transforms[i]._root !== this._root) {
              throw new KaitaiStream.ConsistencyError(
                "transforms",
                this.transforms[i]._root,
                this._root
              );
            }
            if (this.transforms[i]._parent !== this) {
              throw new KaitaiStream.ConsistencyError(
                "transforms",
                this.transforms[i]._parent,
                this
              );
            }
          } else if (KaitaiStream.byteArrayCompare(on, [5, 1]) == 0) {
            if (this.transforms[i]._root !== this._root) {
              throw new KaitaiStream.ConsistencyError(
                "transforms",
                this.transforms[i]._root,
                this._root
              );
            }
            if (this.transforms[i]._parent !== this) {
              throw new KaitaiStream.ConsistencyError(
                "transforms",
                this.transforms[i]._parent,
                this
              );
            }
          } else if (KaitaiStream.byteArrayCompare(on, [1, 0]) == 0) {
            if (this.transforms[i]._root !== this._root) {
              throw new KaitaiStream.ConsistencyError(
                "transforms",
                this.transforms[i]._root,
                this._root
              );
            }
            if (this.transforms[i]._parent !== this) {
              throw new KaitaiStream.ConsistencyError(
                "transforms",
                this.transforms[i]._parent,
                this
              );
            }
          } else if (KaitaiStream.byteArrayCompare(on, [1, 1]) == 0) {
            if (this.transforms[i]._root !== this._root) {
              throw new KaitaiStream.ConsistencyError(
                "transforms",
                this.transforms[i]._root,
                this._root
              );
            }
            if (this.transforms[i]._parent !== this) {
              throw new KaitaiStream.ConsistencyError(
                "transforms",
                this.transforms[i]._parent,
                this
              );
            }
          } else if (KaitaiStream.byteArrayCompare(on, [5, 0]) == 0) {
            if (this.transforms[i]._root !== this._root) {
              throw new KaitaiStream.ConsistencyError(
                "transforms",
                this.transforms[i]._root,
                this._root
              );
            }
            if (this.transforms[i]._parent !== this) {
              throw new KaitaiStream.ConsistencyError(
                "transforms",
                this.transforms[i]._parent,
                this
              );
            }
          } else if (KaitaiStream.byteArrayCompare(on, [6, 0]) == 0) {
            if (this.transforms[i]._root !== this._root) {
              throw new KaitaiStream.ConsistencyError(
                "transforms",
                this.transforms[i]._root,
                this._root
              );
            }
            if (this.transforms[i]._parent !== this) {
              throw new KaitaiStream.ConsistencyError(
                "transforms",
                this.transforms[i]._parent,
                this
              );
            }
          } else if (KaitaiStream.byteArrayCompare(on, [3, 1]) == 0) {
            if (this.transforms[i]._root !== this._root) {
              throw new KaitaiStream.ConsistencyError(
                "transforms",
                this.transforms[i]._root,
                this._root
              );
            }
            if (this.transforms[i]._parent !== this) {
              throw new KaitaiStream.ConsistencyError(
                "transforms",
                this.transforms[i]._parent,
                this
              );
            }
          } else if (KaitaiStream.byteArrayCompare(on, [0, 1]) == 0) {
            if (this.transforms[i]._root !== this._root) {
              throw new KaitaiStream.ConsistencyError(
                "transforms",
                this.transforms[i]._root,
                this._root
              );
            }
            if (this.transforms[i]._parent !== this) {
              throw new KaitaiStream.ConsistencyError(
                "transforms",
                this.transforms[i]._parent,
                this
              );
            }
          } else if (KaitaiStream.byteArrayCompare(on, [6, 1]) == 0) {
            if (this.transforms[i]._root !== this._root) {
              throw new KaitaiStream.ConsistencyError(
                "transforms",
                this.transforms[i]._root,
                this._root
              );
            }
            if (this.transforms[i]._parent !== this) {
              throw new KaitaiStream.ConsistencyError(
                "transforms",
                this.transforms[i]._parent,
                this
              );
            }
          }
        }
      }
    };
    Object.defineProperty(Block.prototype, "numTransformsPerFrame", {
      set: function (v) {
        this._m_numTransformsPerFrame = v;
      },
      get: function () {
        if (this._m_numTransformsPerFrame !== undefined)
          return this._m_numTransformsPerFrame;
        this._m_numTransformsPerFrame =
          (this.model.modelData.boneCount + 7) & 248;
        return this._m_numTransformsPerFrame;
      },
    });

    Block.prototype._invalidate_numTransformsPerFrame = function () {
      delete this._m_numTransformsPerFrame;
    };

    /**
     * A 32-bit field where each nibble, in little-endian order, identifies
     * the type of the next transform in the block.
     */

    /**
     * A 3D transformation to be applied to a bone of a model. The exact
     * fields and interpretation of a particular transform depends on the
     * transform type specified in the block header and whether the bone
     * that the transform applies to is a root node of the skeleton or not.
     */

    /**
     * The model that the animation applies to.
     */

    /**
     * The index of this block within the file.
     */

    return Block;
  })());

  /**
   * A rotation vector along with an axis of rotation and an angle of
   * rotation. The intent seems to be to describe an interpolated
   * rotation that rotates about the axis until reaching the final
   * rotation vector. In practice, however, the game overwrites the
   * axis without ever using it, and identifying the last field as an
   * angle is speculative, as it's never read at all.
   */

  var RotationWithAxis = (Anm.RotationWithAxis = (function () {
    function RotationWithAxis(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root;
    }
    RotationWithAxis.prototype._read = function () {
      this.rotation = new Rotation(this._io, this, this._root);
      this.rotation._read();
      this.axis = new Axis(this._io, this, this._root);
      this.axis._read();
      this.angle = this._io.readS2le();
    };

    RotationWithAxis.prototype._fetchInstances = function () {
      this.rotation._fetchInstances();
      this.axis._fetchInstances();
    };

    RotationWithAxis.prototype._write__seq = function (io) {
      this._io = io;
      this.rotation._write__seq(this._io);
      this.axis._write__seq(this._io);
      this._io.writeS2le(this.angle);
    };

    RotationWithAxis.prototype._check = function () {
      if (this.rotation._root !== this._root) {
        throw new KaitaiStream.ConsistencyError(
          "rotation",
          this.rotation._root,
          this._root
        );
      }
      if (this.rotation._parent !== this) {
        throw new KaitaiStream.ConsistencyError(
          "rotation",
          this.rotation._parent,
          this
        );
      }
      if (this.axis._root !== this._root) {
        throw new KaitaiStream.ConsistencyError(
          "axis",
          this.axis._root,
          this._root
        );
      }
      if (this.axis._parent !== this) {
        throw new KaitaiStream.ConsistencyError(
          "axis",
          this.axis._parent,
          this
        );
      }
    };

    return RotationWithAxis;
  })());

  /**
   * Identical to interpolated_isometry32 except that the translation vector
   * components are 16-bit floating point. Note that the end vector is padded.
   */

  var InterpolatedIsometry16 = (Anm.InterpolatedIsometry16 = (function () {
    function InterpolatedIsometry16(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root;
    }
    InterpolatedIsometry16.prototype._read = function () {
      this.translationStart = new Translation16(this._io, this, this._root);
      this.translationStart._read();
      this.translationEnd = new Translation16Padded(this._io, this, this._root);
      this.translationEnd._read();
      this.rotation = new Rotation(this._io, this, this._root);
      this.rotation._read();
      this.axis = new Axis(this._io, this, this._root);
      this.axis._read();
      this.angle = this._io.readS2le();
    };

    InterpolatedIsometry16.prototype._fetchInstances = function () {
      this.translationStart._fetchInstances();
      this.translationEnd._fetchInstances();
      this.rotation._fetchInstances();
      this.axis._fetchInstances();
    };

    InterpolatedIsometry16.prototype._write__seq = function (io) {
      this._io = io;
      this.translationStart._write__seq(this._io);
      this.translationEnd._write__seq(this._io);
      this.rotation._write__seq(this._io);
      this.axis._write__seq(this._io);
      this._io.writeS2le(this.angle);
    };

    InterpolatedIsometry16.prototype._check = function () {
      if (this.translationStart._root !== this._root) {
        throw new KaitaiStream.ConsistencyError(
          "translation_start",
          this.translationStart._root,
          this._root
        );
      }
      if (this.translationStart._parent !== this) {
        throw new KaitaiStream.ConsistencyError(
          "translation_start",
          this.translationStart._parent,
          this
        );
      }
      if (this.translationEnd._root !== this._root) {
        throw new KaitaiStream.ConsistencyError(
          "translation_end",
          this.translationEnd._root,
          this._root
        );
      }
      if (this.translationEnd._parent !== this) {
        throw new KaitaiStream.ConsistencyError(
          "translation_end",
          this.translationEnd._parent,
          this
        );
      }
      if (this.rotation._root !== this._root) {
        throw new KaitaiStream.ConsistencyError(
          "rotation",
          this.rotation._root,
          this._root
        );
      }
      if (this.rotation._parent !== this) {
        throw new KaitaiStream.ConsistencyError(
          "rotation",
          this.rotation._parent,
          this
        );
      }
      if (this.axis._root !== this._root) {
        throw new KaitaiStream.ConsistencyError(
          "axis",
          this.axis._root,
          this._root
        );
      }
      if (this.axis._parent !== this) {
        throw new KaitaiStream.ConsistencyError(
          "axis",
          this.axis._parent,
          this
        );
      }
    };

    return InterpolatedIsometry16;
  })());

  /**
   * An identity transform; a transform that does nothing. This is distinct
   * from there being no transform at all.
   */

  var Identity = (Anm.Identity = (function () {
    function Identity(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root;
    }
    Identity.prototype._read = function () {};

    Identity.prototype._fetchInstances = function () {};

    Identity.prototype._write__seq = function (io) {
      this._io = io;
    };

    Identity.prototype._check = function () {};

    return Identity;
  })());

  /**
   * An axis about which a rotation will be performed. Each component is a
   * 16-bit signed integer representing a value in the range [-1, 1) (i.e.
   * divide the integer value by 32768).
   */

  var Axis = (Anm.Axis = (function () {
    function Axis(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root;
    }
    Axis.prototype._read = function () {
      this.xInt = this._io.readS2le();
      this.yInt = this._io.readS2le();
      this.zInt = this._io.readS2le();
      this.wInt = this._io.readS2le();
    };

    Axis.prototype._fetchInstances = function () {};

    Axis.prototype._write__seq = function (io) {
      this._io = io;
      this._io.writeS2le(this.xInt);
      this._io.writeS2le(this.yInt);
      this._io.writeS2le(this.zInt);
      this._io.writeS2le(this.wInt);
    };

    Axis.prototype._check = function () {};
    Object.defineProperty(Axis.prototype, "x", {
      set: function (v) {
        this._m_x = v;
      },
      get: function () {
        if (this._m_x !== undefined) return this._m_x;
        this._m_x = this.xInt / 32768.0;
        return this._m_x;
      },
    });

    Axis.prototype._invalidate_x = function () {
      delete this._m_x;
    };
    Object.defineProperty(Axis.prototype, "y", {
      set: function (v) {
        this._m_y = v;
      },
      get: function () {
        if (this._m_y !== undefined) return this._m_y;
        this._m_y = this.yInt / 32768.0;
        return this._m_y;
      },
    });

    Axis.prototype._invalidate_y = function () {
      delete this._m_y;
    };
    Object.defineProperty(Axis.prototype, "z", {
      set: function (v) {
        this._m_z = v;
      },
      get: function () {
        if (this._m_z !== undefined) return this._m_z;
        this._m_z = this.zInt / 32768.0;
        return this._m_z;
      },
    });

    Axis.prototype._invalidate_z = function () {
      delete this._m_z;
    };
    Object.defineProperty(Axis.prototype, "w", {
      set: function (v) {
        this._m_w = v;
      },
      get: function () {
        if (this._m_w !== undefined) return this._m_w;
        this._m_w = this.wInt / 32768.0;
        return this._m_w;
      },
    });

    Axis.prototype._invalidate_w = function () {
      delete this._m_w;
    };

    return Axis;
  })());

  /**
   * No transform; an empty slot in a block.
   */

  var None = (Anm.None = (function () {
    function None(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root;
    }
    None.prototype._read = function () {};

    None.prototype._fetchInstances = function () {};

    None.prototype._write__seq = function (io) {
      this._io = io;
    };

    None.prototype._check = function () {};

    return None;
  })());

  /**
   * A 3D translation described with 16-bit floating point values.
   */

  var Translation16 = (Anm.Translation16 = (function () {
    function Translation16(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root;
    }
    Translation16.prototype._read = function () {
      this.x16 = new F2(this._io, this, null);
      this.x16._read();
      this.y16 = new F2(this._io, this, null);
      this.y16._read();
      this.z16 = new F2(this._io, this, null);
      this.z16._read();
    };

    Translation16.prototype._fetchInstances = function () {
      this.x16._fetchInstances();
      this.y16._fetchInstances();
      this.z16._fetchInstances();
    };

    Translation16.prototype._write__seq = function (io) {
      this._io = io;
      this.x16._write__seq(this._io);
      this.y16._write__seq(this._io);
      this.z16._write__seq(this._io);
    };

    Translation16.prototype._check = function () {};
    Object.defineProperty(Translation16.prototype, "x", {
      set: function (v) {
        this._m_x = v;
      },
      get: function () {
        if (this._m_x !== undefined) return this._m_x;
        this._m_x = this.x16.floatValue;
        return this._m_x;
      },
    });

    Translation16.prototype._invalidate_x = function () {
      delete this._m_x;
    };
    Object.defineProperty(Translation16.prototype, "y", {
      set: function (v) {
        this._m_y = v;
      },
      get: function () {
        if (this._m_y !== undefined) return this._m_y;
        this._m_y = this.y16.floatValue;
        return this._m_y;
      },
    });

    Translation16.prototype._invalidate_y = function () {
      delete this._m_y;
    };
    Object.defineProperty(Translation16.prototype, "z", {
      set: function (v) {
        this._m_z = v;
      },
      get: function () {
        if (this._m_z !== undefined) return this._m_z;
        this._m_z = this.z16.floatValue;
        return this._m_z;
      },
    });

    Translation16.prototype._invalidate_z = function () {
      delete this._m_z;
    };

    return Translation16;
  })());

  /**
   * A repeating series of groups of 8 transforms.
   */

  /**
   * The model that the animation will be applied to.
   */

  return Anm;
})();
export default Anm;
