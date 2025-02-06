// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

declare class F2 {
  constructor(io: any, parent?: any, root?: any);
  __type: "F2";
  _io: any;
  _read: () => void;
  _fetchInstances: () => void;
  _write__seq: (_io: KaitaiStream) => void;
  _writeBackChildStreams: () => void;

  absValue: number;
  exponent: number;
  floatValue: number;
  fraction: number;
  infinity: number;
  isSpecial: boolean;
  isSubnormal: boolean;
  nan: number;
  normalValue: number;
  offsetExp: number;
  powExp: F2.Pow2;
  sign: number;
  specialValue: number;
  subnormalValue: number;
  bytes: number;
}

declare namespace F2 {
  class Pow2 {
    constructor(io: any, parent?: any, root?: any);
    __type: "Pow2";
    _io: any;

    val: number;
    exponent: number;
  }
}

export = F2;
export as namespace F2;
