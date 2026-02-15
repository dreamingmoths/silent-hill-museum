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
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

    this._read();
  }
  Sh1anm.prototype._read = function () {
    this.magic = this._io.readS2le();
    this.numRotations = this._io.readU1();
    this.numTranslations = this._io.readU1();
    this.frameSize = this._io.readS2le();
    if (!(this.frameSize == this.numRotations * 9 + this.numTranslations * 3)) {
      throw new KaitaiStream.ValidationNotEqualError(
        this.numRotations * 9 + this.numTranslations * 3,
        this.frameSize,
        this._io,
        "/seq/3",
      );
    }
    this.numBones = this._io.readS2le();
    this.flags = this._io.readS4le();
    this.endOfs = this._io.readS4le();
    this.numFrames = this._io.readU2le();
    this.scaleLog2 = this._io.readU1();
    this._unnamed9 = this._io.readU1();
    this.bones = [];
    for (var i = 0; i < this.numBones; i++) {
      this.bones.push(new Bone(this._io, this, this._root));
    }
  };

  var Frame = (Sh1anm.Frame = (function () {
    function Frame(_io, _parent, _root, frameIndex) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;
      this.frameIndex = frameIndex;

      this._read();
    }
    Frame.prototype._read = function () {
      this.translations = [];
      for (var i = 0; i < this._root.numTranslations; i++) {
        this.translations.push(new Translation(this._io, this, this._root));
      }
      this.rotations = [];
      for (var i = 0; i < this._root.numRotations; i++) {
        this.rotations.push(new Rotation(this._io, this, this._root));
      }
    };

    return Frame;
  })());

  var Bone = (Sh1anm.Bone = (function () {
    function Bone(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    Bone.prototype._read = function () {
      this.parent = this._io.readS1();
      this.rotationIndex = this._io.readS1();
      this.translationIndex = this._io.readS1();
      this.bindTranslation = new Translation(this._io, this, this._root);
    };

    return Bone;
  })());

  var Translation = (Sh1anm.Translation = (function () {
    function Translation(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    Translation.prototype._read = function () {
      this.x = this._io.readS1();
      this.y = this._io.readS1();
      this.z = this._io.readS1();
    };

    return Translation;
  })());

  /**
   * 3x3 matrix, signed fixed point with 7 fraction bits
   */

  var Rotation = (Sh1anm.Rotation = (function () {
    function Rotation(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

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

  /**
   * `num_frames` seems to be ignored in practice as the game relies on
   * generated `AnimInfo` tables to determine the keyframe limits of each
   * animation.
   */
  Object.defineProperty(Sh1anm.prototype, "frames", {
    get: function () {
      if (this._m_frames !== undefined) return this._m_frames;
      var _pos = this._io.pos;
      this._io.seek(this.magic);
      this._m_frames = [];
      var i = 0;
      do {
        var _ = new Frame(this._io, this, this._root, i);
        this._m_frames.push(_);
        i++;
      } while (!(this._io.size - this._io.pos < this.frameSize));
      this._io.seek(_pos);
      return this._m_frames;
    },
  });
  Object.defineProperty(Sh1anm.prototype, "transformsPerFrame", {
    get: function () {
      if (this._m_transformsPerFrame !== undefined)
        return this._m_transformsPerFrame;
      this._m_transformsPerFrame = this.numRotations + this.numTranslations;
      return this._m_transformsPerFrame;
    },
  });

  /**
   * translations are scaled by 1 << scale_log2
   */

  return Sh1anm;
})();

export default Sh1anm;
