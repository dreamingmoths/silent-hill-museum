// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

import KaitaiStream from "./runtime/KaitaiStream";

/**
 * Anm is the proprietary 3D animation format of Silent Hill (PSX).
 *
 * The body is a list of frames, each frame containing a section of translations
 * for the first `num_translation_bones` bones, followed by a section of rotations
 * for the next `num_rotation_bones` bones.
 *
 * The header contains base translations for all bones, as well as a magic value
 * that is the offset to the first frame.
 */

var Sh1anm = (function () {
  function Sh1anm(_io, _parent, _root) {
    this.__type = "Sh1anm";
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

    this._read();
  }
  Sh1anm.prototype._read = function () {
    this.magic = this._io.readS2le();
    this.numRotationBones = this._io.readU1();
    this.numTranslationBones = this._io.readU1();
    this.frameSize = this._io.readS2le();
    this.numBones = this._io.readS2le();
    this.flags = this._io.readS4le();
    this.endOfs = this._io.readS4le();
    this.numFrames = this._io.readU2le();
    this.scaleLog2 = this._io.readU1();
    this._unnamed9 = this._io.readU1();
    this.bindPoses = [];
    for (var i = 0; i < this.numBones; i++) {
      this.bindPoses.push(new BindPose(this._io, this, this._root));
    }
  };

  var BindPose = (Sh1anm.BindPose = (function () {
    function BindPose(_io, _parent, _root) {
      this.__type = "BindPose";
      this._io = _io;
      this._parent = _parent;
      this._root = _root;

      this._read();
    }
    BindPose.prototype._read = function () {
      this.bone = this._io.readU1();
      this._unnamed1 = this._io.readU1();
      this._unnamed2 = this._io.readU1();
      this.translation = new Translation(this._io, this, this._root);
    };

    return BindPose;
  })());

  /**
   * 3x3 matrix, signed fixed point with 7 fraction bits
   */

  var Rotation = (Sh1anm.Rotation = (function () {
    function Rotation(_io, _parent, _root) {
      this.__type = "Rotation";
      this._io = _io;
      this._parent = _parent;
      this._root = _root;

      this._read();
    }
    Rotation.prototype._read = function () {
      this.value = [];
      for (var i = 0; i < 9; i++) {
        this.value.push(this._io.readS1());
      }
    };

    return Rotation;
  })());

  var Translation = (Sh1anm.Translation = (function () {
    function Translation(_io, _parent, _root) {
      this.__type = "Translation";
      this._io = _io;
      this._parent = _parent;
      this._root = _root;

      this._read();
    }
    Translation.prototype._read = function () {
      this.x = this._io.readS1();
      this.y = this._io.readS1();
      this.z = this._io.readS1();
    };

    return Translation;
  })());
  Object.defineProperty(Sh1anm.prototype, "bonesPerFrame", {
    get: function () {
      if (this._m_bonesPerFrame !== undefined) return this._m_bonesPerFrame;
      this._m_bonesPerFrame = this.numRotationBones + this.numTranslationBones;
      return this._m_bonesPerFrame;
    },
  });
  Object.defineProperty(Sh1anm.prototype, "frameData", {
    get: function () {
      if (this._m_frameData !== undefined) return this._m_frameData;
      var _pos = this._io.pos;
      this._io.seek(this.magic);
      this._m_frameData = [];
      for (var i = 0; i < this.numFrames * this.bonesPerFrame; i++) {
        switch (
          KaitaiStream.mod(i, this.bonesPerFrame) >= this.numTranslationBones
        ) {
          case false:
            this._m_frameData.push(new Translation(this._io, this, this._root));
            break;
          case true:
            this._m_frameData.push(new Rotation(this._io, this, this._root));
            break;
        }
      }
      this._io.seek(_pos);
      return this._m_frameData;
    },
  });

  /**
   * translations are scaled by 1 << scale_log2
   */

  return Sh1anm;
})();

export default Sh1anm;
