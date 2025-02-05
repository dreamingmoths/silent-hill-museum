// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

import SilentHillModel from "./Mdl";

/**
 * Anm is the proprietary 3D animation format of Silent Hill 2 (PC). It
 * describes rotations and translations that are applied to the bones of a
 * model.
 * Parsing an animation requires knowing the structure of the model's skeleton,
 * so the model must be provided to the parser.
 */
declare class Anm {
  constructor(io: any, parent?: any, root?: any, model?: SilentHillModel);
  __type: "Anm";
  _io: any;
  _read: () => void;
  _fetchInstances: () => void;
  _write__seq: (_io: KaitaiStream) => void;
  _writeBackChildStreams: () => void;

  /**
   * A repeating series of groups of 8 transforms.
   */
  blocks: Anm.Block[];

  /**
   * The model that the animation will be applied to.
   */
  model: SilentHillModel;
}

/**
 * An axis about which a rotation will be performed. Each component is a
 * 16-bit signed integer representing a value in the range [-1, 1) (i.e.
 * divide the integer value by 32768).
 */
declare namespace Anm {
  class Axis {
    constructor(io: any, parent?: any, root?: any);
    __type: "Axis";
    _io: any;

    wReal: number;
    xReal: number;
    yReal: number;
    zReal: number;
    x: number;
    y: number;
    z: number;
    w: number;
  }
}

/**
 * A block of 8 transforms. A single animation frame (consisting of one
 * transform for each bone) must consist of a whole number of blocks, so
 * the last block in a frame should be padded with "none" entries as
 * necessary.
 */
declare namespace Anm {
  class Block {
    constructor(io: any, parent?: any, root?: any);
    __type: "Block";
    _io: any;

    numTransformsPerFrame: number;

    /**
     * A 32-bit field where each nibble, in little-endian order, identifies
     * the type of the next transform in the block.
     */
    header: Anm.TransformHeader[];

    /**
     * A 3D transformation to be applied to a bone of a model. The exact
     * fields and interpretation of a particular transform depends on the
     * transform type specified in the block header and whether the bone
     * that the transform applies to is a root node of the skeleton or not.
     */
    transforms:
      | Anm.None
      | Anm.None
      | Anm.Rotation
      | Anm.Rotation
      | Anm.Isometry16
      | Anm.Isometry32
      | Anm.RotationWithAxis
      | Anm.RotationWithAxis
      | Anm.IsometryWithAxis16
      | Anm.IsometryWithAxis32
      | Anm.IsometryWithAxis16
      | Anm.IsometryWithAxis16Padded
      | Anm.InterpolatedIsometry16
      | Anm.InterpolatedIsometry32
      | Anm.Identity
      | Anm.Identity
      | undefined[];

    /**
     * The model that the animation applies to.
     */
    model: SilentHillModel;

    /**
     * The index of this block within the file.
     */
    blockIndex: number;
  }
}

/**
 * An identity transform; a transform that does nothing. This is distinct
 * from there being no transform at all.
 */
declare namespace Anm {
  class Identity {
    constructor(io: any, parent?: any, root?: any);
    __type: "Identity";
    _io: any;
  }
}

/**
 * Identical to interpolated_isometry32 except that the translation vector
 * components are 16-bit floating point. Note that the end vector is padded.
 */
declare namespace Anm {
  class InterpolatedIsometry16 {
    constructor(io: any, parent?: any, root?: any);
    __type: "InterpolatedIsometry16";
    _io: any;

    translationStart: Anm.Translation16;
    translationEnd: Anm.Translation16Padded;
    rotation: Anm.Rotation;
    axis: Anm.Axis;
    angle: number;
  }
}

/**
 * A rotation followed by a translation. There are two translation vectors,
 * a start vector and end vector, which are interpolated between over the
 * duration of the frame. The axis and angle are ignored as described in
 * rotation_with_axis.
 */
declare namespace Anm {
  class InterpolatedIsometry32 {
    constructor(io: any, parent?: any, root?: any);
    __type: "InterpolatedIsometry32";
    _io: any;

    translationStart: Anm.Translation32;
    translationEnd: Anm.Translation32;
    rotation: Anm.Rotation;
    axis: Anm.Axis;
    angle: number;
  }
}

/**
 * A rotation followed by a translation using 16-bit floating point.
 */
declare namespace Anm {
  class Isometry16 {
    constructor(io: any, parent?: any, root?: any);
    __type: "Isometry16";
    _io: any;

    translation: Anm.Translation16;
    rotation: Anm.Rotation;
  }
}

/**
 * A rotation followed by a translation using 32-bit floating point.
 */
declare namespace Anm {
  class Isometry32 {
    constructor(io: any, parent?: any, root?: any);
    __type: "Isometry32";
    _io: any;

    translation: Anm.Translation32;
    rotation: Anm.Rotation;
  }
}

/**
 * Identical to isometry_with_axis except the translation vector components
 * are 16-bit floating point.
 */
declare namespace Anm {
  class IsometryWithAxis16 {
    constructor(io: any, parent?: any, root?: any);
    __type: "IsometryWithAxis16";
    _io: any;

    translation: Anm.Translation16;
    rotation: Anm.Rotation;
    axis: Anm.Axis;
    angle: number;
  }
}

/**
 * Identical to isometry_with_axis16 except that the translation vector
 * components are padded to 32 bits.
 */
declare namespace Anm {
  class IsometryWithAxis16Padded {
    constructor(io: any, parent?: any, root?: any);
    __type: "IsometryWithAxis16Padded";
    _io: any;

    translation: Anm.Translation16Padded;
    rotation: Anm.Rotation;
    axis: Anm.Axis;
    angle: number;
  }
}

/**
 * A rotation followed by a translation. The axis is effectively ignored
 * as described in the rotation_with_axis type.
 */
declare namespace Anm {
  class IsometryWithAxis32 {
    constructor(io: any, parent?: any, root?: any);
    __type: "IsometryWithAxis32";
    _io: any;

    translation: Anm.Translation32;
    rotation: Anm.Rotation;
    axis: Anm.Axis;
    angle: number;
  }
}

/**
 * No transform; an empty slot in a block.
 */
declare namespace Anm {
  class None {
    constructor(io: any, parent?: any, root?: any);
    __type: "None";
    _io: any;
  }
}

/**
 * A 3D rotation described by Euler angles. Each angle is a 16-bit
 * fixed-point real number with a 12-bit fraction.
 */
declare namespace Anm {
  class Rotation {
    constructor(io: any, parent?: any, root?: any);
    __type: "Rotation";
    _io: any;

    xReal: number;
    yReal: number;
    zReal: number;
    x: number;
    y: number;
    z: number;
  }
}

/**
 * A rotation vector along with an axis of rotation and an angle of
 * rotation. The intent seems to be to describe an interpolated
 * rotation that rotates about the axis until reaching the final
 * rotation vector. In practice, however, the game overwrites the
 * axis without ever using it, and identifying the last field as an
 * angle is speculative, as it's never read at all.
 */
declare namespace Anm {
  class RotationWithAxis {
    constructor(io: any, parent?: any, root?: any);
    __type: "RotationWithAxis";
    _io: any;

    rotation: Anm.Rotation;
    axis: Anm.Axis;
    angle: number;
  }
}

declare namespace Anm {
  class TransformHeader {
    constructor(io: any, parent?: any, root?: any);
    __type: "TransformHeader";
    _io: any;

    /**
     * A number 0-7 that identifies the type of a transform within a block.
     */
    type: Anm.TransformHeader.TransformType;

    /**
     * Function unknown, but the game does read and store this value.
     */
    flag: boolean;
  }
}

declare namespace Anm {
  namespace TransformHeader {
    enum TransformType {
      NONE = 0,
      ROTATION = 1,
      ISOMETRY = 2,
      ROTATION_WITH_AXIS = 3,
      ISOMETRY_WITH_AXIS = 4,
      ISOMETRY_WITH_AXIS5 = 5,
      INTERPOLATED_ISOMETRY = 6,
      IDENTITY = 7,
    }
  }
}

/**
 * A 3D translation described with 16-bit floating point values.
 */
declare namespace Anm {
  class Translation16 {
    constructor(io: any, parent?: any, root?: any);
    __type: "Translation16";
    _io: any;

    x: F2;
    y: F2;
    z: F2;
  }
}

/**
 * A 3D translation described with 16-bit floating point values which are
 * padded to 32 bits.
 */
declare namespace Anm {
  class Translation16Padded {
    constructor(io: any, parent?: any, root?: any);
    __type: "Translation16Padded";
    _io: any;

    x: F2;
    xPad: Uint8Array;
    y: F2;
    yPad: Uint8Array;
    z: F2;
    zPad: Uint8Array;
  }
}

/**
 * A 3D translation described with 32-bit floating point values.
 */
declare namespace Anm {
  class Translation32 {
    constructor(io: any, parent?: any, root?: any);
    __type: "Translation32";
    _io: any;

    x: number;
    y: number;
    z: number;
  }
}

export = Anm;
export as namespace Anm;
