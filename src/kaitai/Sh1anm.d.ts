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

  frames: Sh1anm.Frame[];
  transformsPerFrame: number;
  magic: number;
  numRotations: number;
  numTranslations: number;
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
  bones: Sh1anm.Bone[];
}

declare namespace Sh1anm {
  class Bone {
    constructor(io: any, parent?: any, root?: any);
    __type: "Bone";
    _io: any;

    parent: number;
    rotationIndex: number;
    translationIndex: number;
    bindTranslation: Sh1anm.Translation;
  }
}

declare namespace Sh1anm {
  class Frame {
    constructor(io: any, parent?: any, root?: any);
    __type: "Frame";
    _io: any;

    translations: Sh1anm.Translation[];
    rotations: Sh1anm.Rotation[];
    frameIndex: number;
  }
}

declare namespace Sh1anm {
  /**
   * 3x3 matrix, signed fixed point with 7 fraction bits
   */
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
