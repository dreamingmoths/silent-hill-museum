// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

import KaitaiStream from "./runtime/KaitaiStream";
import F2 from "./F2";

/**
 * DDS is the Silent Hill 2 cutscene format.
 */

var Dds = (function () {
  Dds.Dds = Object.freeze({
    PLAY_KEY: 0,
    PLAY_CAMERA: 1,
    PLAY_LIGHT: 2,
    PLAY_CHARACTER: 3,
    STOP: 255,

    0: "PLAY_KEY",
    1: "PLAY_CAMERA",
    2: "PLAY_LIGHT",
    3: "PLAY_CHARACTER",
    255: "STOP",
  });

  function Dds(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;
  }
  Dds.prototype._read = function () {
    this.magic = KaitaiStream.bytesToStr(
      this._io.readBytesTerm(0, false, true, true),
      "ASCII"
    );
    if (!(this.magic == "dds")) {
      throw new KaitaiStream.ValidationNotEqualError(
        "dds",
        this.magic,
        this._io,
        "/seq/0"
      );
    }
    this.unknown0 = this._io.readBytes(12);
    this.totalDemoFrame = this._io.readU2le();
    this.unknownShort = this._io.readU2le();
    this.pointLightCount = this._io.readU1();
    this.spotLightCount = this._io.readU1();
    this.infinitLightCount = this._io.readU1();
    var _ = this.infinitLightCount;
    if (!(this.totalLightCount < 6)) {
      throw new KaitaiStream.ValidationExprError(
        this.infinitLightCount,
        this._io,
        "/seq/6"
      );
    }
    this.pad = this._io.readBytes(1);
    this.characterCount = this._io.readU1();
    this.characterNames = [];
    for (var i = 0; i < this.characterCount; i++) {
      var _t_characterNames = new AnimInfoName(this._io, this, this._root);
      _t_characterNames._read();
      this.characterNames.push(_t_characterNames);
    }
    this.frames = [];
    var i = 0;
    do {
      var _t_frames = new Frame(this._io, this, this._root);
      _t_frames._read();
      var _ = _t_frames;
      this.frames.push(_);
      i++;
    } while (!(i == this.totalDemoFrame));
  };

  Dds.prototype._fetchInstances = function () {
    for (let i = 0; i < this.characterNames.length; i++) {
      this.characterNames[i]._fetchInstances();
    }
    for (let i = 0; i < this.frames.length; i++) {
      this.frames[i]._fetchInstances();
    }
  };

  Dds.prototype._write__seq = function (io) {
    this._io = io;
    this._io.writeBytes(
      KaitaiStream.strToBytes(
        InternalName(NamedIdentifier(magic)),
        "Str(ASCII)"
      )
    );
    this._io.writeU1(0);
    this._io.writeBytes(this.unknown0);
    this._io.writeU2le(this.totalDemoFrame);
    this._io.writeU2le(this.unknownShort);
    this._io.writeU1(this.pointLightCount);
    this._io.writeU1(this.spotLightCount);
    this._io.writeU1(this.infinitLightCount);
    this._io.writeBytes(this.pad);
    this._io.writeU1(this.characterCount);
    for (let i = 0; i < this.characterNames.length; i++) {
      this.characterNames[i]._write__seq(this._io);
    }
    for (let i = 0; i < this.frames.length; i++) {
      this.frames[i]._write__seq(this._io);
    }
  };

  Dds.prototype._check = function () {
    if (
      KaitaiStream.bytesIndexOf(
        KaitaiStream.strToBytes(
          InternalName(NamedIdentifier(magic)),
          "Str(ASCII)"
        ),
        0
      ) != -1
    ) {
      throw new KaitaiStream.ConsistencyError(
        "magic",
        KaitaiStream.bytesIndexOf(
          KaitaiStream.strToBytes(
            InternalName(NamedIdentifier(magic)),
            "Str(ASCII)"
          ),
          0
        ),
        -1
      );
    }
    if (!(this.magic == "dds")) {
      throw new KaitaiStream.ValidationNotEqualError(
        "dds",
        this.magic,
        null,
        "/seq/0"
      );
    }
    if (this.unknown0.length != 12) {
      throw new KaitaiStream.ConsistencyError(
        "unknown0",
        this.unknown0.length,
        12
      );
    }
    var _ = this.infinitLightCount;
    if (!(this.totalLightCount < 6)) {
      throw new KaitaiStream.ValidationExprError(
        this.infinitLightCount,
        null,
        "/seq/6"
      );
    }
    if (this.pad.length != 1) {
      throw new KaitaiStream.ConsistencyError("pad", this.pad.length, 1);
    }
    if (this.characterNames.length != this.characterCount) {
      throw new KaitaiStream.ConsistencyError(
        "character_names",
        this.characterNames.length,
        this.characterCount
      );
    }
    for (let i = 0; i < this.characterNames.length; i++) {
      if (this.characterNames[i]._root !== this._root) {
        throw new KaitaiStream.ConsistencyError(
          "character_names",
          this.characterNames[i]._root,
          this._root
        );
      }
      if (this.characterNames[i]._parent !== this) {
        throw new KaitaiStream.ConsistencyError(
          "character_names",
          this.characterNames[i]._parent,
          this
        );
      }
    }
    if (this.frames.length == 0) {
      throw new KaitaiStream.ConsistencyError("frames", this.frames.length, 0);
    }
    for (let i = 0; i < this.frames.length; i++) {
      if (this.frames[i]._root !== this._root) {
        throw new KaitaiStream.ConsistencyError(
          "frames",
          this.frames[i]._root,
          this._root
        );
      }
      if (this.frames[i]._parent !== this) {
        throw new KaitaiStream.ConsistencyError(
          "frames",
          this.frames[i]._parent,
          this
        );
      }
      var _ = this.frames[i];
      if (((i == this.totalDemoFrame) != i) == this.frames.length - 1) {
        throw new KaitaiStream.ConsistencyError(
          "frames",
          i == this.totalDemoFrame,
          i == this.frames.length - 1
        );
      }
    }
  };

  var DdsPlayCharacter = (Dds.DdsPlayCharacter = (function () {
    function DdsPlayCharacter(_io, _parent, _root, demoStatus) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root;
      this.demoStatus = demoStatus;
    }
    DdsPlayCharacter.prototype._read = function () {
      this.characters = [];
      var i = 0;
      do {
        var _t_characters = new DdsCharacterInfo(this._io, this, this._root);
        _t_characters._read();
        var _ = _t_characters;
        this.characters.push(_);
        i++;
      } while (!(_.controlByte == 11));
    };

    DdsPlayCharacter.prototype._fetchInstances = function () {
      for (let i = 0; i < this.characters.length; i++) {
        this.characters[i]._fetchInstances();
      }
    };

    DdsPlayCharacter.prototype._write__seq = function (io) {
      this._io = io;
      for (let i = 0; i < this.characters.length; i++) {
        this.characters[i]._write__seq(this._io);
      }
    };

    DdsPlayCharacter.prototype._check = function () {
      if (this.characters.length == 0) {
        throw new KaitaiStream.ConsistencyError(
          "characters",
          this.characters.length,
          0
        );
      }
      for (let i = 0; i < this.characters.length; i++) {
        if (this.characters[i]._root !== this._root) {
          throw new KaitaiStream.ConsistencyError(
            "characters",
            this.characters[i]._root,
            this._root
          );
        }
        if (this.characters[i]._parent !== this) {
          throw new KaitaiStream.ConsistencyError(
            "characters",
            this.characters[i]._parent,
            this
          );
        }
        var _ = this.characters[i];
        if (((_.controlByte == 11) != i) == this.characters.length - 1) {
          throw new KaitaiStream.ConsistencyError(
            "characters",
            _.controlByte == 11,
            i == this.characters.length - 1
          );
        }
      }
    };
    Object.defineProperty(DdsPlayCharacter.prototype, "state", {
      set: function (v) {
        this._m_state = v;
      },
      get: function () {
        if (this._m_state !== undefined) return this._m_state;
        this._m_state = this.demoStatus;
        return this._m_state;
      },
    });

    DdsPlayCharacter.prototype._invalidate_state = function () {
      delete this._m_state;
    };

    return DdsPlayCharacter;
  })());

  var DdsCameraInfo = (Dds.DdsCameraInfo = (function () {
    function DdsCameraInfo(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root;
    }
    DdsCameraInfo.prototype._read = function () {
      this.controlByte = this._io.readU1();
      {
        var on = new Uint8Array([this.controlByte, this.usingHalfFloats]);
        if (KaitaiStream.byteArrayCompare(on, [7, 0]) == 0) {
          this.ddsBlock = this._io.readF4le();
        } else if (KaitaiStream.byteArrayCompare(on, [2, 0]) == 0) {
          this.ddsBlock = new Empty(this._io, this, this._root);
          this.ddsBlock._read();
        } else if (KaitaiStream.byteArrayCompare(on, [4, 0]) == 0) {
          this.ddsBlock = new F2Vector(this._io, this, this._root);
          this.ddsBlock._read();
        } else if (KaitaiStream.byteArrayCompare(on, [3, 0]) == 0) {
          this.ddsBlock = new F2Vector(this._io, this, this._root);
          this.ddsBlock._read();
        } else if (KaitaiStream.byteArrayCompare(on, [7, 1]) == 0) {
          this.ddsBlock = this._io.readF4le();
        } else if (KaitaiStream.byteArrayCompare(on, [4, 1]) == 0) {
          this.ddsBlock = new F4Vector(this._io, this, this._root);
          this.ddsBlock._read();
        } else if (KaitaiStream.byteArrayCompare(on, [5, 1]) == 0) {
          this.ddsBlock = new F2Vector(this._io, this, this._root);
          this.ddsBlock._read();
        } else if (KaitaiStream.byteArrayCompare(on, [1, 0]) == 0) {
          this.ddsBlock = new Empty(this._io, this, this._root);
          this.ddsBlock._read();
        } else if (KaitaiStream.byteArrayCompare(on, [5, 0]) == 0) {
          this.ddsBlock = new F2Vector(this._io, this, this._root);
          this.ddsBlock._read();
        } else if (KaitaiStream.byteArrayCompare(on, [6, 0]) == 0) {
          this.ddsBlock = new F2(this._io, this, null);
          this.ddsBlock._read();
        } else if (KaitaiStream.byteArrayCompare(on, [3, 1]) == 0) {
          this.ddsBlock = new F4Vector(this._io, this, this._root);
          this.ddsBlock._read();
        } else if (KaitaiStream.byteArrayCompare(on, [6, 1]) == 0) {
          this.ddsBlock = new F2(this._io, this, null);
          this.ddsBlock._read();
        }
      }
    };

    DdsCameraInfo.prototype._fetchInstances = function () {
      {
        var on = new Uint8Array([this.controlByte, this.usingHalfFloats]);
        if (KaitaiStream.byteArrayCompare(on, [7, 0]) == 0) {
        } else if (KaitaiStream.byteArrayCompare(on, [2, 0]) == 0) {
          this.ddsBlock._fetchInstances();
        } else if (KaitaiStream.byteArrayCompare(on, [4, 0]) == 0) {
          this.ddsBlock._fetchInstances();
        } else if (KaitaiStream.byteArrayCompare(on, [3, 0]) == 0) {
          this.ddsBlock._fetchInstances();
        } else if (KaitaiStream.byteArrayCompare(on, [7, 1]) == 0) {
        } else if (KaitaiStream.byteArrayCompare(on, [4, 1]) == 0) {
          this.ddsBlock._fetchInstances();
        } else if (KaitaiStream.byteArrayCompare(on, [5, 1]) == 0) {
          this.ddsBlock._fetchInstances();
        } else if (KaitaiStream.byteArrayCompare(on, [1, 0]) == 0) {
          this.ddsBlock._fetchInstances();
        } else if (KaitaiStream.byteArrayCompare(on, [5, 0]) == 0) {
          this.ddsBlock._fetchInstances();
        } else if (KaitaiStream.byteArrayCompare(on, [6, 0]) == 0) {
          this.ddsBlock._fetchInstances();
        } else if (KaitaiStream.byteArrayCompare(on, [3, 1]) == 0) {
          this.ddsBlock._fetchInstances();
        } else if (KaitaiStream.byteArrayCompare(on, [6, 1]) == 0) {
          this.ddsBlock._fetchInstances();
        }
      }
    };

    DdsCameraInfo.prototype._write__seq = function (io) {
      this._io = io;
      this._io.writeU1(this.controlByte);
      {
        var on = new Uint8Array([this.controlByte, this.usingHalfFloats]);
        if (KaitaiStream.byteArrayCompare(on, [7, 0]) == 0) {
          this._io.writeF4le(this.ddsBlock);
        } else if (KaitaiStream.byteArrayCompare(on, [2, 0]) == 0) {
          this.ddsBlock._write__seq(this._io);
        } else if (KaitaiStream.byteArrayCompare(on, [4, 0]) == 0) {
          this.ddsBlock._write__seq(this._io);
        } else if (KaitaiStream.byteArrayCompare(on, [3, 0]) == 0) {
          this.ddsBlock._write__seq(this._io);
        } else if (KaitaiStream.byteArrayCompare(on, [7, 1]) == 0) {
          this._io.writeF4le(this.ddsBlock);
        } else if (KaitaiStream.byteArrayCompare(on, [4, 1]) == 0) {
          this.ddsBlock._write__seq(this._io);
        } else if (KaitaiStream.byteArrayCompare(on, [5, 1]) == 0) {
          this.ddsBlock._write__seq(this._io);
        } else if (KaitaiStream.byteArrayCompare(on, [1, 0]) == 0) {
          this.ddsBlock._write__seq(this._io);
        } else if (KaitaiStream.byteArrayCompare(on, [5, 0]) == 0) {
          this.ddsBlock._write__seq(this._io);
        } else if (KaitaiStream.byteArrayCompare(on, [6, 0]) == 0) {
          this.ddsBlock._write__seq(this._io);
        } else if (KaitaiStream.byteArrayCompare(on, [3, 1]) == 0) {
          this.ddsBlock._write__seq(this._io);
        } else if (KaitaiStream.byteArrayCompare(on, [6, 1]) == 0) {
          this.ddsBlock._write__seq(this._io);
        }
      }
    };

    DdsCameraInfo.prototype._check = function () {
      {
        var on = new Uint8Array([this.controlByte, this.usingHalfFloats]);
        if (KaitaiStream.byteArrayCompare(on, [7, 0]) == 0) {
        } else if (KaitaiStream.byteArrayCompare(on, [2, 0]) == 0) {
          if (this.ddsBlock._root !== this._root) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._root,
              this._root
            );
          }
          if (this.ddsBlock._parent !== this) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._parent,
              this
            );
          }
        } else if (KaitaiStream.byteArrayCompare(on, [4, 0]) == 0) {
          if (this.ddsBlock._root !== this._root) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._root,
              this._root
            );
          }
          if (this.ddsBlock._parent !== this) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._parent,
              this
            );
          }
        } else if (KaitaiStream.byteArrayCompare(on, [3, 0]) == 0) {
          if (this.ddsBlock._root !== this._root) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._root,
              this._root
            );
          }
          if (this.ddsBlock._parent !== this) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._parent,
              this
            );
          }
        } else if (KaitaiStream.byteArrayCompare(on, [7, 1]) == 0) {
        } else if (KaitaiStream.byteArrayCompare(on, [4, 1]) == 0) {
          if (this.ddsBlock._root !== this._root) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._root,
              this._root
            );
          }
          if (this.ddsBlock._parent !== this) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._parent,
              this
            );
          }
        } else if (KaitaiStream.byteArrayCompare(on, [5, 1]) == 0) {
          if (this.ddsBlock._root !== this._root) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._root,
              this._root
            );
          }
          if (this.ddsBlock._parent !== this) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._parent,
              this
            );
          }
        } else if (KaitaiStream.byteArrayCompare(on, [1, 0]) == 0) {
          if (this.ddsBlock._root !== this._root) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._root,
              this._root
            );
          }
          if (this.ddsBlock._parent !== this) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._parent,
              this
            );
          }
        } else if (KaitaiStream.byteArrayCompare(on, [5, 0]) == 0) {
          if (this.ddsBlock._root !== this._root) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._root,
              this._root
            );
          }
          if (this.ddsBlock._parent !== this) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._parent,
              this
            );
          }
        } else if (KaitaiStream.byteArrayCompare(on, [6, 0]) == 0) {
        } else if (KaitaiStream.byteArrayCompare(on, [3, 1]) == 0) {
          if (this.ddsBlock._root !== this._root) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._root,
              this._root
            );
          }
          if (this.ddsBlock._parent !== this) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._parent,
              this
            );
          }
        } else if (KaitaiStream.byteArrayCompare(on, [6, 1]) == 0) {
        }
      }
    };
    Object.defineProperty(DdsCameraInfo.prototype, "usingHalfFloats", {
      set: function (v) {
        this._m_usingHalfFloats = v;
      },
      get: function () {
        if (this._m_usingHalfFloats !== undefined)
          return this._m_usingHalfFloats;
        this._m_usingHalfFloats = (this._parent.state & 2) > 0;
        return this._m_usingHalfFloats;
      },
    });

    DdsCameraInfo.prototype._invalidate_usingHalfFloats = function () {
      delete this._m_usingHalfFloats;
    };

    return DdsCameraInfo;
  })());

  /**
   * Nothing.
   */

  var Empty = (Dds.Empty = (function () {
    function Empty(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root;
    }
    Empty.prototype._read = function () {};

    Empty.prototype._fetchInstances = function () {};

    Empty.prototype._write__seq = function (io) {
      this._io = io;
    };

    Empty.prototype._check = function () {};

    return Empty;
  })());

  var DdsPlayLight = (Dds.DdsPlayLight = (function () {
    function DdsPlayLight(_io, _parent, _root, demoStatus) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root;
      this.demoStatus = demoStatus;
    }
    DdsPlayLight.prototype._read = function () {
      this.lights = [];
      var i = 0;
      do {
        var _t_lights = new DdsLightInfo(this._io, this, this._root);
        _t_lights._read();
        var _ = _t_lights;
        this.lights.push(_);
        i++;
      } while (!(_.controlByte >= 11));
    };

    DdsPlayLight.prototype._fetchInstances = function () {
      for (let i = 0; i < this.lights.length; i++) {
        this.lights[i]._fetchInstances();
      }
    };

    DdsPlayLight.prototype._write__seq = function (io) {
      this._io = io;
      for (let i = 0; i < this.lights.length; i++) {
        this.lights[i]._write__seq(this._io);
      }
    };

    DdsPlayLight.prototype._check = function () {
      if (this.lights.length == 0) {
        throw new KaitaiStream.ConsistencyError(
          "lights",
          this.lights.length,
          0
        );
      }
      for (let i = 0; i < this.lights.length; i++) {
        if (this.lights[i]._root !== this._root) {
          throw new KaitaiStream.ConsistencyError(
            "lights",
            this.lights[i]._root,
            this._root
          );
        }
        if (this.lights[i]._parent !== this) {
          throw new KaitaiStream.ConsistencyError(
            "lights",
            this.lights[i]._parent,
            this
          );
        }
        var _ = this.lights[i];
        if ((_.controlByte >= 11 != i) == this.lights.length - 1) {
          throw new KaitaiStream.ConsistencyError(
            "lights",
            _.controlByte >= 11,
            i == this.lights.length - 1
          );
        }
      }
    };
    Object.defineProperty(DdsPlayLight.prototype, "state", {
      set: function (v) {
        this._m_state = v;
      },
      get: function () {
        if (this._m_state !== undefined) return this._m_state;
        this._m_state = this.demoStatus;
        return this._m_state;
      },
    });

    DdsPlayLight.prototype._invalidate_state = function () {
      delete this._m_state;
    };

    return DdsPlayLight;
  })());

  var DdsPlayCamera = (Dds.DdsPlayCamera = (function () {
    function DdsPlayCamera(_io, _parent, _root, demoStatus) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root;
      this.demoStatus = demoStatus;
    }
    DdsPlayCamera.prototype._read = function () {
      this.cameras = [];
      var i = 0;
      do {
        var _t_cameras = new DdsCameraInfo(this._io, this, this._root);
        _t_cameras._read();
        var _ = _t_cameras;
        this.cameras.push(_);
        i++;
      } while (!(_.controlByte >= 11));
    };

    DdsPlayCamera.prototype._fetchInstances = function () {
      for (let i = 0; i < this.cameras.length; i++) {
        this.cameras[i]._fetchInstances();
      }
    };

    DdsPlayCamera.prototype._write__seq = function (io) {
      this._io = io;
      for (let i = 0; i < this.cameras.length; i++) {
        this.cameras[i]._write__seq(this._io);
      }
    };

    DdsPlayCamera.prototype._check = function () {
      if (this.cameras.length == 0) {
        throw new KaitaiStream.ConsistencyError(
          "cameras",
          this.cameras.length,
          0
        );
      }
      for (let i = 0; i < this.cameras.length; i++) {
        if (this.cameras[i]._root !== this._root) {
          throw new KaitaiStream.ConsistencyError(
            "cameras",
            this.cameras[i]._root,
            this._root
          );
        }
        if (this.cameras[i]._parent !== this) {
          throw new KaitaiStream.ConsistencyError(
            "cameras",
            this.cameras[i]._parent,
            this
          );
        }
        var _ = this.cameras[i];
        if ((_.controlByte >= 11 != i) == this.cameras.length - 1) {
          throw new KaitaiStream.ConsistencyError(
            "cameras",
            _.controlByte >= 11,
            i == this.cameras.length - 1
          );
        }
      }
    };
    Object.defineProperty(DdsPlayCamera.prototype, "state", {
      set: function (v) {
        this._m_state = v;
      },
      get: function () {
        if (this._m_state !== undefined) return this._m_state;
        this._m_state = this.demoStatus;
        return this._m_state;
      },
    });

    DdsPlayCamera.prototype._invalidate_state = function () {
      delete this._m_state;
    };

    return DdsPlayCamera;
  })());

  var DdsCharacterInfo = (Dds.DdsCharacterInfo = (function () {
    function DdsCharacterInfo(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root;
    }
    DdsCharacterInfo.prototype._read = function () {
      this.controlByte = this._io.readU1();
      if (this.controlByte > 0 && this.controlByte < 4) {
        {
          var on = new Uint8Array([this.controlByte, this.usingHalfFloats]);
          if (KaitaiStream.byteArrayCompare(on, [2, 0]) == 0) {
            this.ddsBlock = new Empty(this._io, this, this._root);
            this.ddsBlock._read();
          } else if (KaitaiStream.byteArrayCompare(on, [3, 0]) == 0) {
            this.ddsBlock = new F2Vector(this._io, this, this._root);
            this.ddsBlock._read();
          } else if (KaitaiStream.byteArrayCompare(on, [2, 1]) == 0) {
            this.ddsBlock = new Empty(this._io, this, this._root);
            this.ddsBlock._read();
          } else if (KaitaiStream.byteArrayCompare(on, [1, 0]) == 0) {
            this.ddsBlock = new Empty(this._io, this, this._root);
            this.ddsBlock._read();
          } else if (KaitaiStream.byteArrayCompare(on, [1, 1]) == 0) {
            this.ddsBlock = new Empty(this._io, this, this._root);
            this.ddsBlock._read();
          } else if (KaitaiStream.byteArrayCompare(on, [3, 1]) == 0) {
            this.ddsBlock = new F4Vector(this._io, this, this._root);
            this.ddsBlock._read();
          }
        }
      }
    };

    DdsCharacterInfo.prototype._fetchInstances = function () {
      if (this.controlByte > 0 && this.controlByte < 4) {
        {
          var on = new Uint8Array([this.controlByte, this.usingHalfFloats]);
          if (KaitaiStream.byteArrayCompare(on, [2, 0]) == 0) {
            this.ddsBlock._fetchInstances();
          } else if (KaitaiStream.byteArrayCompare(on, [3, 0]) == 0) {
            this.ddsBlock._fetchInstances();
          } else if (KaitaiStream.byteArrayCompare(on, [2, 1]) == 0) {
            this.ddsBlock._fetchInstances();
          } else if (KaitaiStream.byteArrayCompare(on, [1, 0]) == 0) {
            this.ddsBlock._fetchInstances();
          } else if (KaitaiStream.byteArrayCompare(on, [1, 1]) == 0) {
            this.ddsBlock._fetchInstances();
          } else if (KaitaiStream.byteArrayCompare(on, [3, 1]) == 0) {
            this.ddsBlock._fetchInstances();
          }
        }
      }
    };

    DdsCharacterInfo.prototype._write__seq = function (io) {
      this._io = io;
      this._io.writeU1(this.controlByte);
      if (this.controlByte > 0 && this.controlByte < 4) {
        {
          var on = new Uint8Array([this.controlByte, this.usingHalfFloats]);
          if (KaitaiStream.byteArrayCompare(on, [2, 0]) == 0) {
            this.ddsBlock._write__seq(this._io);
          } else if (KaitaiStream.byteArrayCompare(on, [3, 0]) == 0) {
            this.ddsBlock._write__seq(this._io);
          } else if (KaitaiStream.byteArrayCompare(on, [2, 1]) == 0) {
            this.ddsBlock._write__seq(this._io);
          } else if (KaitaiStream.byteArrayCompare(on, [1, 0]) == 0) {
            this.ddsBlock._write__seq(this._io);
          } else if (KaitaiStream.byteArrayCompare(on, [1, 1]) == 0) {
            this.ddsBlock._write__seq(this._io);
          } else if (KaitaiStream.byteArrayCompare(on, [3, 1]) == 0) {
            this.ddsBlock._write__seq(this._io);
          }
        }
      }
    };

    DdsCharacterInfo.prototype._check = function () {
      if (this.controlByte > 0 && this.controlByte < 4) {
        {
          var on = new Uint8Array([this.controlByte, this.usingHalfFloats]);
          if (KaitaiStream.byteArrayCompare(on, [2, 0]) == 0) {
            if (this.ddsBlock._root !== this._root) {
              throw new KaitaiStream.ConsistencyError(
                "dds_block",
                this.ddsBlock._root,
                this._root
              );
            }
            if (this.ddsBlock._parent !== this) {
              throw new KaitaiStream.ConsistencyError(
                "dds_block",
                this.ddsBlock._parent,
                this
              );
            }
          } else if (KaitaiStream.byteArrayCompare(on, [3, 0]) == 0) {
            if (this.ddsBlock._root !== this._root) {
              throw new KaitaiStream.ConsistencyError(
                "dds_block",
                this.ddsBlock._root,
                this._root
              );
            }
            if (this.ddsBlock._parent !== this) {
              throw new KaitaiStream.ConsistencyError(
                "dds_block",
                this.ddsBlock._parent,
                this
              );
            }
          } else if (KaitaiStream.byteArrayCompare(on, [2, 1]) == 0) {
            if (this.ddsBlock._root !== this._root) {
              throw new KaitaiStream.ConsistencyError(
                "dds_block",
                this.ddsBlock._root,
                this._root
              );
            }
            if (this.ddsBlock._parent !== this) {
              throw new KaitaiStream.ConsistencyError(
                "dds_block",
                this.ddsBlock._parent,
                this
              );
            }
          } else if (KaitaiStream.byteArrayCompare(on, [1, 0]) == 0) {
            if (this.ddsBlock._root !== this._root) {
              throw new KaitaiStream.ConsistencyError(
                "dds_block",
                this.ddsBlock._root,
                this._root
              );
            }
            if (this.ddsBlock._parent !== this) {
              throw new KaitaiStream.ConsistencyError(
                "dds_block",
                this.ddsBlock._parent,
                this
              );
            }
          } else if (KaitaiStream.byteArrayCompare(on, [1, 1]) == 0) {
            if (this.ddsBlock._root !== this._root) {
              throw new KaitaiStream.ConsistencyError(
                "dds_block",
                this.ddsBlock._root,
                this._root
              );
            }
            if (this.ddsBlock._parent !== this) {
              throw new KaitaiStream.ConsistencyError(
                "dds_block",
                this.ddsBlock._parent,
                this
              );
            }
          } else if (KaitaiStream.byteArrayCompare(on, [3, 1]) == 0) {
            if (this.ddsBlock._root !== this._root) {
              throw new KaitaiStream.ConsistencyError(
                "dds_block",
                this.ddsBlock._root,
                this._root
              );
            }
            if (this.ddsBlock._parent !== this) {
              throw new KaitaiStream.ConsistencyError(
                "dds_block",
                this.ddsBlock._parent,
                this
              );
            }
          }
        }
      }
    };
    Object.defineProperty(DdsCharacterInfo.prototype, "usingHalfFloats", {
      set: function (v) {
        this._m_usingHalfFloats = v;
      },
      get: function () {
        if (this._m_usingHalfFloats !== undefined)
          return this._m_usingHalfFloats;
        this._m_usingHalfFloats = (this._parent.state & 2) > 0;
        return this._m_usingHalfFloats;
      },
    });

    DdsCharacterInfo.prototype._invalidate_usingHalfFloats = function () {
      delete this._m_usingHalfFloats;
    };

    return DdsCharacterInfo;
  })());

  var Instruction = (Dds.Instruction = (function () {
    function Instruction(_io, _parent, _root, demoStatus) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root;
      this.demoStatus = demoStatus;
    }
    Instruction.prototype._read = function () {
      this.controlByte = this._io.readU1();
      switch (this.ddsBlockType) {
        case Dds.Dds.PLAY_KEY:
          this.ddsBlock = new DdsPlayKey(this._io, this, this._root);
          this.ddsBlock._read();
          break;
        case Dds.Dds.STOP:
          this.ddsBlock = new Empty(this._io, this, this._root);
          this.ddsBlock._read();
          break;
        case Dds.Dds.PLAY_LIGHT:
          this.ddsBlock = new DdsPlayLight(
            this._io,
            this,
            this._root,
            this.demoStatus
          );
          this.ddsBlock._read();
          break;
        case Dds.Dds.PLAY_CHARACTER:
          this.ddsBlock = new DdsPlayCharacter(
            this._io,
            this,
            this._root,
            this.demoStatus
          );
          this.ddsBlock._read();
          break;
        case Dds.Dds.PLAY_CAMERA:
          this.ddsBlock = new DdsPlayCamera(
            this._io,
            this,
            this._root,
            this.demoStatus
          );
          this.ddsBlock._read();
          break;
      }
    };

    Instruction.prototype._fetchInstances = function () {
      switch (this.ddsBlockType) {
        case Dds.Dds.PLAY_KEY:
          this.ddsBlock._fetchInstances();
          break;
        case Dds.Dds.STOP:
          this.ddsBlock._fetchInstances();
          break;
        case Dds.Dds.PLAY_LIGHT:
          this.ddsBlock._fetchInstances();
          break;
        case Dds.Dds.PLAY_CHARACTER:
          this.ddsBlock._fetchInstances();
          break;
        case Dds.Dds.PLAY_CAMERA:
          this.ddsBlock._fetchInstances();
          break;
      }
    };

    Instruction.prototype._write__seq = function (io) {
      this._io = io;
      this._io.writeU1(this.controlByte);
      switch (this.ddsBlockType) {
        case Dds.Dds.PLAY_KEY:
          this.ddsBlock._write__seq(this._io);
          break;
        case Dds.Dds.STOP:
          this.ddsBlock._write__seq(this._io);
          break;
        case Dds.Dds.PLAY_LIGHT:
          this.ddsBlock._write__seq(this._io);
          break;
        case Dds.Dds.PLAY_CHARACTER:
          this.ddsBlock._write__seq(this._io);
          break;
        case Dds.Dds.PLAY_CAMERA:
          this.ddsBlock._write__seq(this._io);
          break;
      }
    };

    Instruction.prototype._check = function () {
      switch (this.ddsBlockType) {
        case Dds.Dds.PLAY_KEY:
          if (this.ddsBlock._root !== this._root) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._root,
              this._root
            );
          }
          if (this.ddsBlock._parent !== this) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._parent,
              this
            );
          }
          break;
        case Dds.Dds.STOP:
          if (this.ddsBlock._root !== this._root) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._root,
              this._root
            );
          }
          if (this.ddsBlock._parent !== this) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._parent,
              this
            );
          }
          break;
        case Dds.Dds.PLAY_LIGHT:
          if (this.ddsBlock._root !== this._root) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._root,
              this._root
            );
          }
          if (this.ddsBlock._parent !== this) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._parent,
              this
            );
          }
          if (this.ddsBlock.demoStatus != this.demoStatus) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock.demoStatus,
              this.demoStatus
            );
          }
          break;
        case Dds.Dds.PLAY_CHARACTER:
          if (this.ddsBlock._root !== this._root) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._root,
              this._root
            );
          }
          if (this.ddsBlock._parent !== this) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._parent,
              this
            );
          }
          if (this.ddsBlock.demoStatus != this.demoStatus) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock.demoStatus,
              this.demoStatus
            );
          }
          break;
        case Dds.Dds.PLAY_CAMERA:
          if (this.ddsBlock._root !== this._root) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._root,
              this._root
            );
          }
          if (this.ddsBlock._parent !== this) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._parent,
              this
            );
          }
          if (this.ddsBlock.demoStatus != this.demoStatus) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock.demoStatus,
              this.demoStatus
            );
          }
          break;
      }
    };
    Object.defineProperty(Instruction.prototype, "state", {
      set: function (v) {
        this._m_state = v;
      },
      get: function () {
        if (this._m_state !== undefined) return this._m_state;
        this._m_state =
          this.controlByte == 0 ? this.ddsBlock.demoStatus : this.demoStatus;
        return this._m_state;
      },
    });

    Instruction.prototype._invalidate_state = function () {
      delete this._m_state;
    };
    Object.defineProperty(Instruction.prototype, "ddsBlockType", {
      set: function (v) {
        this._m_ddsBlockType = v;
      },
      get: function () {
        if (this._m_ddsBlockType !== undefined) return this._m_ddsBlockType;
        this._m_ddsBlockType =
          this.controlByte < 2 || this.controlByte == 255
            ? this.controlByte
            : this.controlByte - 2 < this._root.totalLightCount
            ? 2
            : 3;
        return this._m_ddsBlockType;
      },
    });

    Instruction.prototype._invalidate_ddsBlockType = function () {
      delete this._m_ddsBlockType;
    };

    return Instruction;
  })());

  var StateReducer = (Dds.StateReducer = (function () {
    function StateReducer(_io, _parent, _root, previousState, operation) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root;
      this.previousState = previousState;
      this.operation = operation;
    }
    StateReducer.prototype._read = function () {};

    StateReducer.prototype._fetchInstances = function () {};

    StateReducer.prototype._write__seq = function (io) {
      this._io = io;
    };

    StateReducer.prototype._check = function () {};
    Object.defineProperty(StateReducer.prototype, "currentValue", {
      set: function (v) {
        this._m_currentValue = v;
      },
      get: function () {
        if (this._m_currentValue !== undefined) return this._m_currentValue;
        this._m_currentValue =
          this.operation == 20
            ? this.previousState | 16
            : this.operation == 17
            ? this.previousState | 4
            : this.operation == 16
            ? this.previousState | 3
            : this.previousState;
        return this._m_currentValue;
      },
    });

    StateReducer.prototype._invalidate_currentValue = function () {
      delete this._m_currentValue;
    };

    return StateReducer;
  })());

  var DdsPlayKey = (Dds.DdsPlayKey = (function () {
    function DdsPlayKey(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root;

      this._should_write_stateArray = false;
      this.stateArray__to_write = true;
    }
    DdsPlayKey.prototype._read = function () {
      this.statusBytes = [];
      var i = 0;
      do {
        var _ = this._io.readU1();
        this.statusBytes.push(_);
        i++;
      } while (!(_ == 11 || this._io.isEof()));
    };

    DdsPlayKey.prototype._fetchInstances = function () {
      for (let i = 0; i < this.statusBytes.length; i++) {}
      if (this.statusBytes.length > 1) {
        _ = this.stateArray;
        for (let i = 0; i < this._m_stateArray.length; i++) {
          switch ((i > 0) | 0) {
            case 0:
              this.stateArray[i]._fetchInstances();
              break;
            case 1:
              this.stateArray[i]._fetchInstances();
              break;
          }
        }
      }
    };

    DdsPlayKey.prototype._write__seq = function (io) {
      this._io = io;
      this._should_write_stateArray = this.stateArray__to_write;
      for (let i = 0; i < this.statusBytes.length; i++) {
        this._io.writeU1(this.statusBytes[i]);
        var _ = this.statusBytes[i];
        if (
          ((_ == 11 || this._io.isEof()) != i) ==
          this.statusBytes.length - 1
        ) {
          throw new KaitaiStream.ConsistencyError(
            "status_bytes",
            _ == 11 || this._io.isEof(),
            i == this.statusBytes.length - 1
          );
        }
      }
    };

    DdsPlayKey.prototype._check = function () {
      if (this.statusBytes.length == 0) {
        throw new KaitaiStream.ConsistencyError(
          "status_bytes",
          this.statusBytes.length,
          0
        );
      }
      for (let i = 0; i < this.statusBytes.length; i++) {}
    };
    Object.defineProperty(DdsPlayKey.prototype, "stateArray", {
      set: function (v) {
        this._m_stateArray = v;
      },
      get: function () {
        if (this._should_write_stateArray) {
          this._write_stateArray();
        }
        if (this._m_stateArray !== undefined) return this._m_stateArray;
        if (this.statusBytes.length > 1) {
          this._m_stateArray = [];
          for (var i = 0; i < this.statusBytes.length; i++) {
            switch ((i > 0) | 0) {
              case 0:
                var _t__m_stateArray = new StateReducer(
                  this._io,
                  this,
                  this._root,
                  0,
                  this.statusBytes[0]
                );
                _t__m_stateArray._read();
                this._m_stateArray.push(_t__m_stateArray);
                break;
              case 1:
                var _t__m_stateArray = new StateReducer(
                  this._io,
                  this,
                  this._root,
                  this.stateArray[i - 1].currentValue,
                  this.statusBytes[i]
                );
                _t__m_stateArray._read();
                this._m_stateArray.push(_t__m_stateArray);
                break;
            }
          }
        }
        return this._m_stateArray;
      },
    });

    DdsPlayKey.prototype._write_stateArray = function () {
      this._should_write_stateArray = false;
      if (this.statusBytes.length > 1) {
        for (let i = 0; i < this._m_stateArray.length; i++) {
          switch ((i > 0) | 0) {
            case 0:
              this.stateArray[i]._write__seq(this._io);
              break;
            case 1:
              if (
                this.stateArray[i].previousState !=
                this.stateArray[i - 1].currentValue
              ) {
                throw new KaitaiStream.ConsistencyError(
                  "state_array",
                  this.stateArray[i].previousState,
                  this.stateArray[i - 1].currentValue
                );
              }
              this.stateArray[i]._write__seq(this._io);
              break;
          }
        }
      }
    };

    DdsPlayKey.prototype._check_stateArray = function () {
      this._should_write_stateArray = false;
      if (this.statusBytes.length > 1) {
        if (this.stateArray.length != this.statusBytes.length) {
          throw new KaitaiStream.ConsistencyError(
            "state_array",
            this.stateArray.length,
            this.statusBytes.length
          );
        }
        for (let i = 0; i < this._m_stateArray.length; i++) {
          switch ((i > 0) | 0) {
            case 0:
              if (this.stateArray[i]._root !== this._root) {
                throw new KaitaiStream.ConsistencyError(
                  "state_array",
                  this.stateArray[i]._root,
                  this._root
                );
              }
              if (this.stateArray[i]._parent !== this) {
                throw new KaitaiStream.ConsistencyError(
                  "state_array",
                  this.stateArray[i]._parent,
                  this
                );
              }
              if (this.stateArray[i].previousState != 0) {
                throw new KaitaiStream.ConsistencyError(
                  "state_array",
                  this.stateArray[i].previousState,
                  0
                );
              }
              if (this.stateArray[i].operation != this.statusBytes[0]) {
                throw new KaitaiStream.ConsistencyError(
                  "state_array",
                  this.stateArray[i].operation,
                  this.statusBytes[0]
                );
              }
              break;
            case 1:
              if (this.stateArray[i]._root !== this._root) {
                throw new KaitaiStream.ConsistencyError(
                  "state_array",
                  this.stateArray[i]._root,
                  this._root
                );
              }
              if (this.stateArray[i]._parent !== this) {
                throw new KaitaiStream.ConsistencyError(
                  "state_array",
                  this.stateArray[i]._parent,
                  this
                );
              }
              if (this.stateArray[i].operation != this.statusBytes[i]) {
                throw new KaitaiStream.ConsistencyError(
                  "state_array",
                  this.stateArray[i].operation,
                  this.statusBytes[i]
                );
              }
              break;
          }
        }
      }
    };
    Object.defineProperty(DdsPlayKey.prototype, "demoStatus", {
      set: function (v) {
        this._m_demoStatus = v;
      },
      get: function () {
        if (this._m_demoStatus !== undefined) return this._m_demoStatus;
        this._m_demoStatus =
          this.stateArray[this.stateArray.length - 1].currentValue;
        return this._m_demoStatus;
      },
    });

    DdsPlayKey.prototype._invalidate_demoStatus = function () {
      delete this._m_demoStatus;
    };

    return DdsPlayKey;
  })());

  var Frame = (Dds.Frame = (function () {
    function Frame(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root;
    }
    Frame.prototype._read = function () {
      this.frameIndex = this._io.readS2le();
      if (this.frameIndex >= 0) {
        this.instructions = [];
        var i = 0;
        do {
          switch (i == 0) {
            case true:
              var _t_instructions = new Instruction(
                this._io,
                this,
                this._root,
                0
              );
              _t_instructions._read();
              var _ = _t_instructions;
              this.instructions.push(_);
              break;
            case false:
              var _t_instructions = new Instruction(
                this._io,
                this,
                this._root,
                this.instructions[i - 1].state
              );
              _t_instructions._read();
              var _ = _t_instructions;
              this.instructions.push(_);
              break;
          }
          i++;
        } while (!(_.ddsBlockType == Dds.Dds.STOP));
      }
    };

    Frame.prototype._fetchInstances = function () {
      if (this.frameIndex >= 0) {
        for (let i = 0; i < this.instructions.length; i++) {
          switch (i == 0) {
            case true:
              this.instructions[i]._fetchInstances();
              break;
            case false:
              this.instructions[i]._fetchInstances();
              break;
          }
        }
      }
    };

    Frame.prototype._write__seq = function (io) {
      this._io = io;
      this._io.writeS2le(this.frameIndex);
      if (this.frameIndex >= 0) {
        for (let i = 0; i < this.instructions.length; i++) {
          switch (i == 0) {
            case true:
              this.instructions[i]._write__seq(this._io);
              break;
            case false:
              this.instructions[i]._write__seq(this._io);
              break;
          }
        }
      }
    };

    Frame.prototype._check = function () {
      if (this.frameIndex >= 0) {
        if (this.instructions.length == 0) {
          throw new KaitaiStream.ConsistencyError(
            "instructions",
            this.instructions.length,
            0
          );
        }
        for (let i = 0; i < this.instructions.length; i++) {
          switch (i == 0) {
            case true:
              if (this.instructions[i]._root !== this._root) {
                throw new KaitaiStream.ConsistencyError(
                  "instructions",
                  this.instructions[i]._root,
                  this._root
                );
              }
              if (this.instructions[i]._parent !== this) {
                throw new KaitaiStream.ConsistencyError(
                  "instructions",
                  this.instructions[i]._parent,
                  this
                );
              }
              if (this.instructions[i].demoStatus != 0) {
                throw new KaitaiStream.ConsistencyError(
                  "instructions",
                  this.instructions[i].demoStatus,
                  0
                );
              }
              break;
            case false:
              if (this.instructions[i]._root !== this._root) {
                throw new KaitaiStream.ConsistencyError(
                  "instructions",
                  this.instructions[i]._root,
                  this._root
                );
              }
              if (this.instructions[i]._parent !== this) {
                throw new KaitaiStream.ConsistencyError(
                  "instructions",
                  this.instructions[i]._parent,
                  this
                );
              }
              if (
                this.instructions[i].demoStatus !=
                this.instructions[i - 1].state
              ) {
                throw new KaitaiStream.ConsistencyError(
                  "instructions",
                  this.instructions[i].demoStatus,
                  this.instructions[i - 1].state
                );
              }
              break;
          }
          var _ = this.instructions[i];
          if (
            ((_.ddsBlockType == Dds.Dds.STOP) != i) ==
            this.instructions.length - 1
          ) {
            throw new KaitaiStream.ConsistencyError(
              "instructions",
              _.ddsBlockType == Dds.Dds.STOP,
              i == this.instructions.length - 1
            );
          }
        }
      }
    };

    return Frame;
  })());

  var F4Vector = (Dds.F4Vector = (function () {
    function F4Vector(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root;
    }
    F4Vector.prototype._read = function () {
      this.x = this._io.readF4le();
      this.y = this._io.readF4le();
      this.z = this._io.readF4le();
    };

    F4Vector.prototype._fetchInstances = function () {};

    F4Vector.prototype._write__seq = function (io) {
      this._io = io;
      this._io.writeF4le(this.x);
      this._io.writeF4le(this.y);
      this._io.writeF4le(this.z);
    };

    F4Vector.prototype._check = function () {};

    return F4Vector;
  })());

  var F2Vector2 = (Dds.F2Vector2 = (function () {
    function F2Vector2(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root;
    }
    F2Vector2.prototype._read = function () {
      this.x16 = new F2(this._io, this, null);
      this.x16._read();
      this.y16 = new F2(this._io, this, null);
      this.y16._read();
    };

    F2Vector2.prototype._fetchInstances = function () {
      this.x16._fetchInstances();
      this.y16._fetchInstances();
    };

    F2Vector2.prototype._write__seq = function (io) {
      this._io = io;
      this.x16._write__seq(this._io);
      this.y16._write__seq(this._io);
    };

    F2Vector2.prototype._check = function () {};
    Object.defineProperty(F2Vector2.prototype, "x", {
      set: function (v) {
        this._m_x = v;
      },
      get: function () {
        if (this._m_x !== undefined) return this._m_x;
        this._m_x = this.x16.floatValue;
        return this._m_x;
      },
    });

    F2Vector2.prototype._invalidate_x = function () {
      delete this._m_x;
    };
    Object.defineProperty(F2Vector2.prototype, "y", {
      set: function (v) {
        this._m_y = v;
      },
      get: function () {
        if (this._m_y !== undefined) return this._m_y;
        this._m_y = this.y16.floatValue;
        return this._m_y;
      },
    });

    F2Vector2.prototype._invalidate_y = function () {
      delete this._m_y;
    };

    return F2Vector2;
  })());

  var DdsLightInfo = (Dds.DdsLightInfo = (function () {
    function DdsLightInfo(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root;
    }
    DdsLightInfo.prototype._read = function () {
      this.controlByte = this._io.readU1();
      {
        var on = new Uint8Array([this.controlByte, this.usingHalfFloats]);
        if (KaitaiStream.byteArrayCompare(on, [2, 0]) == 0) {
          this.ddsBlock = new Empty(this._io, this, this._root);
          this.ddsBlock._read();
        } else if (KaitaiStream.byteArrayCompare(on, [10, 1]) == 0) {
          this.ddsBlock = new F2Vector2(this._io, this, this._root);
          this.ddsBlock._read();
        } else if (KaitaiStream.byteArrayCompare(on, [4, 0]) == 0) {
          this.ddsBlock = new F2Vector(this._io, this, this._root);
          this.ddsBlock._read();
        } else if (KaitaiStream.byteArrayCompare(on, [3, 0]) == 0) {
          this.ddsBlock = new F2Vector(this._io, this, this._root);
          this.ddsBlock._read();
        } else if (KaitaiStream.byteArrayCompare(on, [4, 1]) == 0) {
          this.ddsBlock = new F4Vector(this._io, this, this._root);
          this.ddsBlock._read();
        } else if (KaitaiStream.byteArrayCompare(on, [9, 1]) == 0) {
          this.ddsBlock = new F2Vector2(this._io, this, this._root);
          this.ddsBlock._read();
        } else if (KaitaiStream.byteArrayCompare(on, [5, 1]) == 0) {
          this.ddsBlock = new F2Vector(this._io, this, this._root);
          this.ddsBlock._read();
        } else if (KaitaiStream.byteArrayCompare(on, [1, 0]) == 0) {
          this.ddsBlock = new Empty(this._io, this, this._root);
          this.ddsBlock._read();
        } else if (KaitaiStream.byteArrayCompare(on, [8, 0]) == 0) {
          this.ddsBlock = new F2Vector(this._io, this, this._root);
          this.ddsBlock._read();
        } else if (KaitaiStream.byteArrayCompare(on, [5, 0]) == 0) {
          this.ddsBlock = new F2Vector(this._io, this, this._root);
          this.ddsBlock._read();
        } else if (KaitaiStream.byteArrayCompare(on, [3, 1]) == 0) {
          this.ddsBlock = new F4Vector(this._io, this, this._root);
          this.ddsBlock._read();
        } else if (KaitaiStream.byteArrayCompare(on, [8, 1]) == 0) {
          this.ddsBlock = new F2Vector(this._io, this, this._root);
          this.ddsBlock._read();
        } else if (KaitaiStream.byteArrayCompare(on, [9, 0]) == 0) {
          this.ddsBlock = new F2Vector2(this._io, this, this._root);
          this.ddsBlock._read();
        } else if (KaitaiStream.byteArrayCompare(on, [10, 0]) == 0) {
          this.ddsBlock = new F2Vector2(this._io, this, this._root);
          this.ddsBlock._read();
        }
      }
    };

    DdsLightInfo.prototype._fetchInstances = function () {
      {
        var on = new Uint8Array([this.controlByte, this.usingHalfFloats]);
        if (KaitaiStream.byteArrayCompare(on, [2, 0]) == 0) {
          this.ddsBlock._fetchInstances();
        } else if (KaitaiStream.byteArrayCompare(on, [10, 1]) == 0) {
          this.ddsBlock._fetchInstances();
        } else if (KaitaiStream.byteArrayCompare(on, [4, 0]) == 0) {
          this.ddsBlock._fetchInstances();
        } else if (KaitaiStream.byteArrayCompare(on, [3, 0]) == 0) {
          this.ddsBlock._fetchInstances();
        } else if (KaitaiStream.byteArrayCompare(on, [4, 1]) == 0) {
          this.ddsBlock._fetchInstances();
        } else if (KaitaiStream.byteArrayCompare(on, [9, 1]) == 0) {
          this.ddsBlock._fetchInstances();
        } else if (KaitaiStream.byteArrayCompare(on, [5, 1]) == 0) {
          this.ddsBlock._fetchInstances();
        } else if (KaitaiStream.byteArrayCompare(on, [1, 0]) == 0) {
          this.ddsBlock._fetchInstances();
        } else if (KaitaiStream.byteArrayCompare(on, [8, 0]) == 0) {
          this.ddsBlock._fetchInstances();
        } else if (KaitaiStream.byteArrayCompare(on, [5, 0]) == 0) {
          this.ddsBlock._fetchInstances();
        } else if (KaitaiStream.byteArrayCompare(on, [3, 1]) == 0) {
          this.ddsBlock._fetchInstances();
        } else if (KaitaiStream.byteArrayCompare(on, [8, 1]) == 0) {
          this.ddsBlock._fetchInstances();
        } else if (KaitaiStream.byteArrayCompare(on, [9, 0]) == 0) {
          this.ddsBlock._fetchInstances();
        } else if (KaitaiStream.byteArrayCompare(on, [10, 0]) == 0) {
          this.ddsBlock._fetchInstances();
        }
      }
    };

    DdsLightInfo.prototype._write__seq = function (io) {
      this._io = io;
      this._io.writeU1(this.controlByte);
      {
        var on = new Uint8Array([this.controlByte, this.usingHalfFloats]);
        if (KaitaiStream.byteArrayCompare(on, [2, 0]) == 0) {
          this.ddsBlock._write__seq(this._io);
        } else if (KaitaiStream.byteArrayCompare(on, [10, 1]) == 0) {
          this.ddsBlock._write__seq(this._io);
        } else if (KaitaiStream.byteArrayCompare(on, [4, 0]) == 0) {
          this.ddsBlock._write__seq(this._io);
        } else if (KaitaiStream.byteArrayCompare(on, [3, 0]) == 0) {
          this.ddsBlock._write__seq(this._io);
        } else if (KaitaiStream.byteArrayCompare(on, [4, 1]) == 0) {
          this.ddsBlock._write__seq(this._io);
        } else if (KaitaiStream.byteArrayCompare(on, [9, 1]) == 0) {
          this.ddsBlock._write__seq(this._io);
        } else if (KaitaiStream.byteArrayCompare(on, [5, 1]) == 0) {
          this.ddsBlock._write__seq(this._io);
        } else if (KaitaiStream.byteArrayCompare(on, [1, 0]) == 0) {
          this.ddsBlock._write__seq(this._io);
        } else if (KaitaiStream.byteArrayCompare(on, [8, 0]) == 0) {
          this.ddsBlock._write__seq(this._io);
        } else if (KaitaiStream.byteArrayCompare(on, [5, 0]) == 0) {
          this.ddsBlock._write__seq(this._io);
        } else if (KaitaiStream.byteArrayCompare(on, [3, 1]) == 0) {
          this.ddsBlock._write__seq(this._io);
        } else if (KaitaiStream.byteArrayCompare(on, [8, 1]) == 0) {
          this.ddsBlock._write__seq(this._io);
        } else if (KaitaiStream.byteArrayCompare(on, [9, 0]) == 0) {
          this.ddsBlock._write__seq(this._io);
        } else if (KaitaiStream.byteArrayCompare(on, [10, 0]) == 0) {
          this.ddsBlock._write__seq(this._io);
        }
      }
    };

    DdsLightInfo.prototype._check = function () {
      {
        var on = new Uint8Array([this.controlByte, this.usingHalfFloats]);
        if (KaitaiStream.byteArrayCompare(on, [2, 0]) == 0) {
          if (this.ddsBlock._root !== this._root) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._root,
              this._root
            );
          }
          if (this.ddsBlock._parent !== this) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._parent,
              this
            );
          }
        } else if (KaitaiStream.byteArrayCompare(on, [10, 1]) == 0) {
          if (this.ddsBlock._root !== this._root) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._root,
              this._root
            );
          }
          if (this.ddsBlock._parent !== this) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._parent,
              this
            );
          }
        } else if (KaitaiStream.byteArrayCompare(on, [4, 0]) == 0) {
          if (this.ddsBlock._root !== this._root) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._root,
              this._root
            );
          }
          if (this.ddsBlock._parent !== this) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._parent,
              this
            );
          }
        } else if (KaitaiStream.byteArrayCompare(on, [3, 0]) == 0) {
          if (this.ddsBlock._root !== this._root) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._root,
              this._root
            );
          }
          if (this.ddsBlock._parent !== this) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._parent,
              this
            );
          }
        } else if (KaitaiStream.byteArrayCompare(on, [4, 1]) == 0) {
          if (this.ddsBlock._root !== this._root) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._root,
              this._root
            );
          }
          if (this.ddsBlock._parent !== this) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._parent,
              this
            );
          }
        } else if (KaitaiStream.byteArrayCompare(on, [9, 1]) == 0) {
          if (this.ddsBlock._root !== this._root) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._root,
              this._root
            );
          }
          if (this.ddsBlock._parent !== this) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._parent,
              this
            );
          }
        } else if (KaitaiStream.byteArrayCompare(on, [5, 1]) == 0) {
          if (this.ddsBlock._root !== this._root) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._root,
              this._root
            );
          }
          if (this.ddsBlock._parent !== this) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._parent,
              this
            );
          }
        } else if (KaitaiStream.byteArrayCompare(on, [1, 0]) == 0) {
          if (this.ddsBlock._root !== this._root) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._root,
              this._root
            );
          }
          if (this.ddsBlock._parent !== this) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._parent,
              this
            );
          }
        } else if (KaitaiStream.byteArrayCompare(on, [8, 0]) == 0) {
          if (this.ddsBlock._root !== this._root) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._root,
              this._root
            );
          }
          if (this.ddsBlock._parent !== this) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._parent,
              this
            );
          }
        } else if (KaitaiStream.byteArrayCompare(on, [5, 0]) == 0) {
          if (this.ddsBlock._root !== this._root) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._root,
              this._root
            );
          }
          if (this.ddsBlock._parent !== this) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._parent,
              this
            );
          }
        } else if (KaitaiStream.byteArrayCompare(on, [3, 1]) == 0) {
          if (this.ddsBlock._root !== this._root) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._root,
              this._root
            );
          }
          if (this.ddsBlock._parent !== this) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._parent,
              this
            );
          }
        } else if (KaitaiStream.byteArrayCompare(on, [8, 1]) == 0) {
          if (this.ddsBlock._root !== this._root) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._root,
              this._root
            );
          }
          if (this.ddsBlock._parent !== this) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._parent,
              this
            );
          }
        } else if (KaitaiStream.byteArrayCompare(on, [9, 0]) == 0) {
          if (this.ddsBlock._root !== this._root) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._root,
              this._root
            );
          }
          if (this.ddsBlock._parent !== this) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._parent,
              this
            );
          }
        } else if (KaitaiStream.byteArrayCompare(on, [10, 0]) == 0) {
          if (this.ddsBlock._root !== this._root) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._root,
              this._root
            );
          }
          if (this.ddsBlock._parent !== this) {
            throw new KaitaiStream.ConsistencyError(
              "dds_block",
              this.ddsBlock._parent,
              this
            );
          }
        }
      }
    };
    Object.defineProperty(DdsLightInfo.prototype, "usingHalfFloats", {
      set: function (v) {
        this._m_usingHalfFloats = v;
      },
      get: function () {
        if (this._m_usingHalfFloats !== undefined)
          return this._m_usingHalfFloats;
        this._m_usingHalfFloats = (this._parent.state & 2) > 0;
        return this._m_usingHalfFloats;
      },
    });

    DdsLightInfo.prototype._invalidate_usingHalfFloats = function () {
      delete this._m_usingHalfFloats;
    };

    return DdsLightInfo;
  })());

  var F2Vector = (Dds.F2Vector = (function () {
    function F2Vector(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root;
    }
    F2Vector.prototype._read = function () {
      this.x16 = new F2(this._io, this, null);
      this.x16._read();
      this.y16 = new F2(this._io, this, null);
      this.y16._read();
      this.z16 = new F2(this._io, this, null);
      this.z16._read();
    };

    F2Vector.prototype._fetchInstances = function () {
      this.x16._fetchInstances();
      this.y16._fetchInstances();
      this.z16._fetchInstances();
    };

    F2Vector.prototype._write__seq = function (io) {
      this._io = io;
      this.x16._write__seq(this._io);
      this.y16._write__seq(this._io);
      this.z16._write__seq(this._io);
    };

    F2Vector.prototype._check = function () {};
    Object.defineProperty(F2Vector.prototype, "x", {
      set: function (v) {
        this._m_x = v;
      },
      get: function () {
        if (this._m_x !== undefined) return this._m_x;
        this._m_x = this.x16.floatValue;
        return this._m_x;
      },
    });

    F2Vector.prototype._invalidate_x = function () {
      delete this._m_x;
    };
    Object.defineProperty(F2Vector.prototype, "y", {
      set: function (v) {
        this._m_y = v;
      },
      get: function () {
        if (this._m_y !== undefined) return this._m_y;
        this._m_y = this.y16.floatValue;
        return this._m_y;
      },
    });

    F2Vector.prototype._invalidate_y = function () {
      delete this._m_y;
    };
    Object.defineProperty(F2Vector.prototype, "z", {
      set: function (v) {
        this._m_z = v;
      },
      get: function () {
        if (this._m_z !== undefined) return this._m_z;
        this._m_z = this.z16.floatValue;
        return this._m_z;
      },
    });

    F2Vector.prototype._invalidate_z = function () {
      delete this._m_z;
    };

    return F2Vector;
  })());

  /**
   * These names are refer to entries in a hardcoded list of animation info.
   * These structs are called `DramaDemo_AnimInfo`.
   */

  var AnimInfoName = (Dds.AnimInfoName = (function () {
    function AnimInfoName(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root;
    }
    AnimInfoName.prototype._read = function () {
      this.name1 = KaitaiStream.bytesToStr(this._io.readBytes(16), "ASCII");
    };

    AnimInfoName.prototype._fetchInstances = function () {};

    AnimInfoName.prototype._write__seq = function (io) {
      this._io = io;
      this._io.writeBytes(
        KaitaiStream.strToBytes(
          InternalName(NamedIdentifier(name1)),
          "Str(ASCII)"
        )
      );
    };

    AnimInfoName.prototype._check = function () {
      if (
        KaitaiStream.strToBytes(
          InternalName(NamedIdentifier(name1)),
          "Str(ASCII)"
        ).length != 16
      ) {
        throw new KaitaiStream.ConsistencyError(
          "name1",
          KaitaiStream.strToBytes(
            InternalName(NamedIdentifier(name1)),
            "Str(ASCII)"
          ).length,
          16
        );
      }
    };

    return AnimInfoName;
  })());
  Object.defineProperty(Dds.prototype, "totalLightCount", {
    set: function (v) {
      this._m_totalLightCount = v;
    },
    get: function () {
      if (this._m_totalLightCount !== undefined) return this._m_totalLightCount;
      this._m_totalLightCount =
        this.pointLightCount + this.spotLightCount + this.infinitLightCount;
      return this._m_totalLightCount;
    },
  });

  Dds.prototype._invalidate_totalLightCount = function () {
    delete this._m_totalLightCount;
  };

  /**
   * PS2 version does not look at these, but they can be nonzero.
   */

  return Dds;
})();
var _;
export default Dds;
