// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

/**
 * DDS is the Silent Hill 2 cutscene format.
 */
declare class Dds {
  constructor(io: any, parent?: any, root?: any);
  __type: "Dds";
  _io: any;
  _read: () => void;
  _fetchInstances: () => void;
  _write__seq: (_io: KaitaiStream) => void;
  _writeBackChildStreams: () => void;

  totalLightCount: number;
  magic: string;

  /**
   * PS2 version does not look at these, but they can be nonzero.
   */
  unknown0: Uint8Array;
  totalDemoFrame: number;
  unknownShort: number;
  pointLightCount: number;
  spotLightCount: number;
  infinitLightCount: number;
  pad: Uint8Array;
  characterCount: number;
  characterNames: Dds.AnimInfoName[];
  frames: Dds.Frame[];
}

declare namespace Dds {
  /**
   * These names are refer to entries in a hardcoded list of animation info.
   * These structs are called `DramaDemo_AnimInfo`.
   */
  class AnimInfoName {
    constructor(io: any, parent?: any, root?: any);
    __type: "AnimInfoName";
    _io: any;

    name1: string;
  }
}

declare namespace Dds {
  class DdsCameraInfo {
    constructor(io: any, parent?: any, root?: any);
    __type: "DdsCameraInfo";
    _io: any;

    usingHalfFloats: boolean;
    controlByte: number;
    ddsBlock: Dds.Empty | Dds.F2Vector | Dds.F4Vector | F2 | number | undefined;
  }
}

declare namespace Dds {
  class DdsCharacterInfo {
    constructor(io: any, parent?: any, root?: any);
    __type: "DdsCharacterInfo";
    _io: any;

    usingHalfFloats: boolean;
    controlByte: number;
    ddsBlock:
      | Dds.Empty
      | Dds.Empty
      | Dds.Empty
      | Dds.Empty
      | Dds.F2Vector
      | Dds.F4Vector
      | undefined;
  }
}

declare namespace Dds {
  class DdsLightInfo {
    constructor(io: any, parent?: any, root?: any);
    __type: "DdsLightInfo";
    _io: any;

    usingHalfFloats: boolean;
    controlByte: number;
    ddsBlock:
      | Dds.Empty
      | Dds.F2Vector2
      | Dds.F2Vector2
      | Dds.Empty
      | Dds.F2Vector
      | Dds.F4Vector
      | Dds.F2Vector
      | Dds.F4Vector
      | Dds.F2Vector
      | Dds.F2Vector
      | Dds.F2Vector
      | Dds.F2Vector
      | Dds.F2Vector2
      | Dds.F2Vector2
      | undefined;
  }
}

declare namespace Dds {
  class DdsPlayCamera {
    constructor(io: any, parent?: any, root?: any);
    __type: "DdsPlayCamera";
    _io: any;

    state: number;
    info: Dds.DdsCameraInfo[];
    demoStatus: number;
  }
}

declare namespace Dds {
  class DdsPlayCharacter {
    constructor(io: any, parent?: any, root?: any);
    __type: "DdsPlayCharacter";
    _io: any;

    state: number;
    info: Dds.DdsCharacterInfo[];
    demoStatus: number;
  }
}

declare namespace Dds {
  class DdsPlayKey {
    constructor(io: any, parent?: any, root?: any);
    __type: "DdsPlayKey";
    _io: any;

    demoStatus: number;
    stateArray: Dds.StateReducer | Dds.StateReducer | undefined[];
    statusBytes: number[];
  }
}

declare namespace Dds {
  class DdsPlayLight {
    constructor(io: any, parent?: any, root?: any);
    __type: "DdsPlayLight";
    _io: any;

    state: number;
    info: Dds.DdsLightInfo[];
    demoStatus: number;
  }
}

declare namespace Dds {
  class Empty {
    constructor(io: any, parent?: any, root?: any);
    __type: "Empty";
    _io: any;
  }
}

declare namespace Dds {
  class F2Vector {
    constructor(io: any, parent?: any, root?: any);
    __type: "F2Vector";
    _io: any;

    x: number;
    y: number;
    z: number;
    x16: F2;
    y16: F2;
    z16: F2;
  }
}

declare namespace Dds {
  class F2Vector2 {
    constructor(io: any, parent?: any, root?: any);
    __type: "F2Vector2";
    _io: any;

    x: number;
    y: number;
    x16: F2;
    y16: F2;
  }
}

declare namespace Dds {
  class F4Vector {
    constructor(io: any, parent?: any, root?: any);
    __type: "F4Vector";
    _io: any;

    x: number;
    y: number;
    z: number;
  }
}

declare namespace Dds {
  class Frame {
    constructor(io: any, parent?: any, root?: any);
    __type: "Frame";
    _io: any;

    isStopFrame: boolean;
    frameIndex: number;
    instructions: Dds.Instruction[] | undefined;
  }
}

declare namespace Dds {
  class Instruction {
    constructor(io: any, parent?: any, root?: any);
    __type: "Instruction";
    _io: any;

    ddsBlockType: Dds.DramaDemo;
    state: number;
    controlByte: number;
    ddsBlock:
      | Dds.DdsPlayCamera
      | Dds.DdsPlayCharacter
      | Dds.DdsPlayKey
      | Dds.DdsPlayLight
      | Dds.Empty
      | undefined;
    demoStatus: number;
  }
}

declare namespace Dds {
  class StateReducer {
    constructor(io: any, parent?: any, root?: any);
    __type: "StateReducer";
    _io: any;

    currentValue: number;
    previousState: number;
    operation: number;
  }
}

declare namespace Dds {
  enum DramaDemo {
    PLAY_KEY = 0,
    PLAY_CAMERA = 1,
    PLAY_LIGHT = 2,
    PLAY_CHARACTER = 3,
    STOP = 255,
  }
}

export = Dds;
export as namespace Dds;
