// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

/**
 * Ilm is the skeletal 3D model format used in Silent Hill (PSX).
 *
 * The header contains a table of objects, each with a name, ID, and offset to
 * its body. Each body contains vertex and primitive data.
 *
 * Note that the vertices are stored untransformed; the anm format is necessary
 * to render the model correctly.
 */
declare class Ilm {
  constructor(io: any, parent?: any, root?: any);
  __type: "Ilm";
  _io: any;

  idTable: number[];
  magic: Uint8Array;
  isInitialized: number;
  _unnamed2: number;
  unkOfs: number;
  numObjs: number;
  objTableOfs: number;
  idTableOfs: number;
  name: string;
  objs: Ilm.Obj[];
}

declare namespace Ilm {
  class IndexPacket {
    constructor(io: any, parent?: any, root?: any);
    __type: "IndexPacket";
    _io: any;

    uv0: Ilm.Uv;
    _unnamed1: number;
    uv1: Ilm.Uv;
    _unnamed3: number;
    uv2: Ilm.Uv;
    uv3: Ilm.Uv;
    indices: Ilm.PrimIndices;
    _unnamed7: Uint8Array;
  }
}

declare namespace Ilm {
  class Obj {
    constructor(io: any, parent?: any, root?: any);
    __type: "Obj";
    _io: any;

    body: Ilm.ObjBody;
    _unnamed0: string;
    name: string;
    _unnamed2: number;
    baseIdx: number;
    _unnamed4: number;
    _unnamed5: number;
    ofs: number;
  }
}

declare namespace Ilm {
  class ObjBody {
    constructor(io: any, parent?: any, root?: any);
    __type: "ObjBody";
    _io: any;

    prims: Ilm.IndexPacket[];
    vertexXy: number[];
    vertexZ: number[];
    numPrims: number;
    numVertices: number;
    numVertices2: number;
    _unnamed3: number;
    primsOfs: number;
    vertexXyOfs: number;
    vertexZOfs: number;
    normalSectionOfs: number;
    nextOfs: number;
  }
}

declare namespace Ilm {
  class PrimIndices {
    constructor(io: any, parent?: any, root?: any);
    __type: "PrimIndices";
    _io: any;

    v0: number;
    v1: number;
    v2: number;
    v3: number;
  }
}

declare namespace Ilm {
  class Uv {
    constructor(io: any, parent?: any, root?: any);
    __type: "Uv";
    _io: any;

    u: number;
    v: number;
  }
}

declare namespace Ilm {
  class XyPair {
    constructor(io: any, parent?: any, root?: any);
    __type: "XyPair";
    _io: any;

    x: number;
    y: number;
  }
}

export = Ilm;
export as namespace Ilm;
