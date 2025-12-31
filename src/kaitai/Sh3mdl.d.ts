// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

/**
 * 3D model format of Silent Hill 2 and 3 for the PlayStation 2.
 */
declare class Sh3mdl {
  constructor(io: any, parent?: any, root?: any);
  __type: "Sh3mdl";
  _io: any;

  modelHeader: Sh3mdl.ModelHeader;
  textureHeader: Sh3mdl.TextureHeader;
  noTextureId: number;
  padding: Uint8Array;
  characterId: number;
  numTextures: number;
  ofsTextureHeader: number;
  ofsCluster: number;
  ofsModelHeader: number;
  _raw__m_modelHeader: Uint8Array;
  _raw__m_textureHeader: Uint8Array;
}

declare namespace Sh3mdl {
  class BonePair {
    constructor(io: any, parent?: any, root?: any);
    __type: "BonePair";
    _io: any;

    parent: number;
    child: number;
  }
}

declare namespace Sh3mdl {
  class ClutData {
    constructor(io: any, parent?: any, root?: any);
    __type: "ClutData";
    _io: any;

    dataSize: number;
    _unnamed1: Uint8Array;
    width: number;
    _unnamed3: Uint8Array;
    clutData: Uint8Array;
  }
}

declare namespace Sh3mdl {
  class ModelHeader {
    constructor(io: any, parent?: any, root?: any);
    __type: "ModelHeader";
    _io: any;

    bonePairs: Sh3mdl.BonePair[];
    bones: number[];
    defaultPcms: Sh3mdl.TransformationMatrix[];
    initialMatrices: Sh3mdl.TransformationMatrix[];
    opaqueParts: Sh3mdl.Part[];
    textureBlocks: Sh3mdl.TextureBlocks;
    transparentParts: Sh3mdl.Part[];
    magic: Uint8Array;
    modelVersion: number;
    ofsInitialMatrices: number;
    numBones: number;
    ofsBones: number;
    numBonePairs: number;
    ofsBonePairs: number;
    ofsDefaultPcms: number;
    numOpaqueParts: number;
    ofsOpaqueParts: number;
    numTransparentParts: number;
    ofsTransparentParts: number;
    numTextureBlocks: number;
    ofsTextureBlocks: number;
    numTextureInfo: number;
    ofsTextureInfo: number;
    numClusterNodes: number;
    ofsClusterNodes: number;
    numClusters: number;
    ofsClusters: number;
    numFuncData: number;
    ofsFuncData: number;
    ofsHit: number;
    ofsBox: number;
    _unnamed24: number;
    ofsRelativeMatrices: number;
    ofsRelativeTranses: number;
    _unnamed27: number[];
  }
}

declare namespace Sh3mdl {
  class Part {
    constructor(io: any, parent?: any, root?: any);
    __type: "Part";
    _io: any;

    meshSize: number;
    type: number;
    ofsVifPacket: number;
    numVifQwords: number;
    vifAddr: number;
    numClusters: number;
    ofsClusters: number;
    numBones: number;
    ofsBones: number;
    numBonePairs: number;
    ofsBonePairs: number;
    _unnamed11: number;
    _unnamed12: number;
    numTextures: number;
    ofsTextureIndex: number;
    ofsTextureParams: number;
    shadingType: number;
    specularPos: number;
    equipmentId: number;
    hoge: number;
    backclip: number;
    envmapParam: number;
    reserved: number[];
    phongParamA: number;
    phongParamB: number;
    blinnParam: number;
    padding: number[];
    diffuse: number[];
    ambient: number[];
    specular: number[];
    clusters: Uint8Array;
    bones: number[];
    bonePairs: number[];
    textureIndex: number;
    _unnamed34: Uint8Array;
    _unnamed35: Uint8Array;
    vifData: Sh3mdl.VifSection;
    _raw_vifData: Uint8Array;
  }
}

declare namespace Sh3mdl {
  class Texture {
    constructor(io: any, parent?: any, root?: any);
    __type: "Texture";
    _io: any;

    dbw: number;
    rrh: number;
    rrw: number;
    unk: number;
    _unnamed0: Uint8Array;
    width: number;
    height: number;
    _unnamed3: Uint8Array;
    imageSize: number;
    headerSize: number;
    _unnamed6: Uint8Array;
    psm: Sh3mdl.Psm;
    dbwFlag: number;
    _unnamed9: number;
    _unnamed10: number;
    _unnamed11: number;
    _unnamed12: Uint8Array;
    imageData: Uint8Array;
    clut: Sh3mdl.ClutData;
  }
}

declare namespace Sh3mdl {
  class TextureBlocks {
    constructor(io: any, parent?: any, root?: any);
    __type: "TextureBlocks";
    _io: any;

    imageIds: number[];
    pad: Uint8Array;

    /**
     * TODO
     */
    texturePairs: Sh3mdl.TexturePair[];
  }
}

declare namespace Sh3mdl {
  class TextureHeader {
    constructor(io: any, parent?: any, root?: any);
    __type: "TextureHeader";
    _io: any;

    _unnamed0: Uint8Array;
    ofs: number;
    _unnamed2: Uint8Array;
    textures: Sh3mdl.Texture[];
  }
}

declare namespace Sh3mdl {
  class TexturePair {
    constructor(io: any, parent?: any, root?: any);
    __type: "TexturePair";
    _io: any;

    imageIndex: number;
    paletteIndex: number;
  }
}

declare namespace Sh3mdl {
  /**
   * Represents a 4x4 column-major transformation matrix.
   */
  class TransformationMatrix {
    constructor(io: any, parent?: any, root?: any);
    __type: "TransformationMatrix";
    _io: any;

    rotation00: number;
    rotation10: number;
    rotation20: number;
    pad0: number;
    rotation01: number;
    rotation11: number;
    rotation21: number;
    pad1: number;
    rotation02: number;
    rotation12: number;
    rotation22: number;
    pad2: number;
    translationX: number;
    translationY: number;
    translationZ: number;
    translationW: number;
  }
}

declare namespace Sh3mdl {
  class VertexAttributes {
    constructor(io: any, parent?: any, root?: any);
    __type: "VertexAttributes";
    _io: any;

    _unnamed0: Uint8Array;
    _unnamed1: Uint8Array;
    vertices: number[];
    _unnamed3: Uint8Array;
    _unnamed4: Uint8Array;
    normals: number[];
    _unnamed6: Uint8Array;
    _unnamed7: Uint8Array;
    weights: number[];
    _unnamed9: Uint8Array;
    _unnamed10: Uint8Array;
    uvs: number[];
    _unnamed12: Uint8Array;
    group: Sh3mdl.VertexGroup;
  }
}

declare namespace Sh3mdl {
  class VertexGroup {
    constructor(io: any, parent?: any, root?: any);
    __type: "VertexGroup";
    _io: any;

    _unnamed0: Uint8Array;
    numVertices: number;
    numBonePairs: number;
    vertexDataAddr: number;
    vertexDataEndAddr: number;
    localBoneAddr: number[];
  }
}

declare namespace Sh3mdl {
  class VifSection {
    constructor(io: any, parent?: any, root?: any);
    __type: "VifSection";
    _io: any;

    _unnamed0: Uint8Array;
    numVertexGroups: number;
    _unnamed2: number;
    ofsVertexBase: number;
    ofsBoneMatrixBase: number;
    _unnamed5: number;
    _unnamed6: number;
    trianglesStartIndex: number;
    ofsTriangles: number;
    groups: Sh3mdl.VertexGroup[];
    attributes: Sh3mdl.VertexAttributes[];
    _unnamed11: Uint8Array;
    triangles: number[];
  }
}

declare namespace Sh3mdl {
  enum Psm {
    PSMCT32 = 0,
    PSMCT24 = 1,
    PSMCT16 = 2,
    PSMCT16S = 10,
    PSMT8 = 19,
    PSMT4 = 20,
    PSMT8H = 27,
    PSMT4HL = 36,
    PSMT4HH = 44,
    PSMZ32 = 48,
    PSMZ24 = 49,
    PSMZ16 = 50,
    PSMZ16S = 58,
  }
}

export = Sh3mdl;
export as namespace Sh3mdl;
