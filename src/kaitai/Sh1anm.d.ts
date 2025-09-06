// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

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
declare class Sh1anm {
  constructor(io: any, parent?: any, root?: any);
  __type: "Sh1anm";
  _io: any;
  _m_frameData: Sh1anm.Translation | Sh1anm.Rotation | undefined[] | undefined;

  bonesPerFrame: number;
  frameData: Sh1anm.Translation | Sh1anm.Rotation | undefined[];
  magic: number;
  numRotationBones: number;
  numTranslationBones: number;
  frameSize: number;
  numBones: number;
  flags: number;
  endOfs: number;
  numFrames: number;

  /**
   * translations are scaled by 1 << scale_log2
   */
  scaleLog2: number;
  _unnamed9: number;
  bindPoses: Sh1anm.BindPose[];
}

declare namespace Sh1anm {
  class BindPose {
    constructor(io: any, parent?: any, root?: any);
    __type: "BindPose";
    _io: any;

    bone: number;
    _unnamed1: number;
    _unnamed2: number;
    translation: Sh1anm.Translation;
  }
}

/**
 * 3x3 matrix, signed fixed point with 7 fraction bits
 */
declare namespace Sh1anm {
  class Rotation {
    constructor(io: any, parent?: any, root?: any);
    __type: "Rotation";
    _io: any;

    value: number[];
  }
}

declare namespace Sh1anm {
  class Translation {
    constructor(io: any, parent?: any, root?: any);
    __type: "Translation";
    _io: any;

    x: number;
    y: number;
    z: number;
  }
}

export = Sh1anm;
export as namespace Sh1anm;
