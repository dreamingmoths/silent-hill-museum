// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

var F2 = (function () {
  function F2(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

    this._should_write_powExp = false;
    this.powExp__to_write = true;
  }
  F2.prototype._read = function () {
    this.bytes = this._io.readU2le();
  };

  F2.prototype._fetchInstances = function () {
    _ = this.powExp;
    this.powExp._fetchInstances();
  };

  F2.prototype._write__seq = function (io) {
    this._io = io;
    this._should_write_powExp = this.powExp__to_write;
    this._io.writeU2le(this.bytes);
  };

  F2.prototype._check = function () {};

  var Pow2 = (F2.Pow2 = (function () {
    function Pow2(_io, _parent, _root, exponent) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root;
      this.exponent = exponent;
    }
    Pow2.prototype._read = function () {};

    Pow2.prototype._fetchInstances = function () {};

    Pow2.prototype._write__seq = function (io) {
      this._io = io;
    };

    Pow2.prototype._check = function () {};
    Object.defineProperty(Pow2.prototype, "val", {
      set: function (v) {
        this._m_val = v;
      },
      get: function () {
        if (this._m_val !== undefined) return this._m_val;
        this._m_val =
          this.exponent == -14
            ? 0.00006103515625
            : this.exponent == -13
            ? 0.0001220703125
            : this.exponent == -12
            ? 0.000244140625
            : this.exponent == -11
            ? 0.00048828125
            : this.exponent == -10
            ? 0.0009765625
            : this.exponent == -9
            ? 0.001953125
            : this.exponent == -8
            ? 0.00390625
            : this.exponent == -7
            ? 0.0078125
            : this.exponent == -6
            ? 0.015625
            : this.exponent == -5
            ? 0.03125
            : this.exponent == -4
            ? 0.0625
            : this.exponent == -3
            ? 0.125
            : this.exponent == -2
            ? 0.25
            : this.exponent == -1
            ? 0.5
            : this.exponent == 0
            ? 1
            : this.exponent == 1
            ? 2
            : this.exponent == 2
            ? 4
            : this.exponent == 3
            ? 8
            : this.exponent == 4
            ? 16
            : this.exponent == 5
            ? 32
            : this.exponent == 6
            ? 64
            : this.exponent == 7
            ? 128
            : this.exponent == 8
            ? 256
            : this.exponent == 9
            ? 512
            : this.exponent == 10
            ? 1024
            : this.exponent == 11
            ? 2048
            : this.exponent == 12
            ? 4096
            : this.exponent == 13
            ? 8192
            : this.exponent == 14
            ? 16384
            : this.exponent == 15
            ? 32768
            : 0;
        return this._m_val;
      },
    });

    Pow2.prototype._invalidate_val = function () {};

    return Pow2;
  })());
  Object.defineProperty(F2.prototype, "specialValue", {
    set: function (v) {
      this._m_specialValue = v;
    },
    get: function () {
      if (this._m_specialValue !== undefined) return this._m_specialValue;
      this._m_specialValue = this.fraction == 0 ? this.infinity : this.nan;
      return this._m_specialValue;
    },
  });

  F2.prototype._invalidate_specialValue = function () {};
  Object.defineProperty(F2.prototype, "subnormalValue", {
    set: function (v) {
      this._m_subnormalValue = v;
    },
    get: function () {
      if (this._m_subnormalValue !== undefined) return this._m_subnormalValue;
      this._m_subnormalValue = 0.00006103515625 * (this.fraction / 1024);
      return this._m_subnormalValue;
    },
  });

  F2.prototype._invalidate_subnormalValue = function () {};
  Object.defineProperty(F2.prototype, "infinity", {
    set: function (v) {
      this._m_infinity = v;
    },
    get: function () {
      if (this._m_infinity !== undefined) return this._m_infinity;
      this._m_infinity = Math.floor(1 / 0);
      return this._m_infinity;
    },
  });

  F2.prototype._invalidate_infinity = function () {};
  Object.defineProperty(F2.prototype, "exponent", {
    set: function (v) {
      this._m_exponent = v;
    },
    get: function () {
      if (this._m_exponent !== undefined) return this._m_exponent;
      this._m_exponent = (this.bytes & 31744) >>> 10;
      return this._m_exponent;
    },
  });

  F2.prototype._invalidate_exponent = function () {};
  Object.defineProperty(F2.prototype, "nan", {
    set: function (v) {
      this._m_nan = v;
    },
    get: function () {
      if (this._m_nan !== undefined) return this._m_nan;
      this._m_nan = Math.floor(0 / 0);
      return this._m_nan;
    },
  });

  F2.prototype._invalidate_nan = function () {};
  Object.defineProperty(F2.prototype, "sign", {
    set: function (v) {
      this._m_sign = v;
    },
    get: function () {
      if (this._m_sign !== undefined) return this._m_sign;
      this._m_sign = this.bytes >>> 15 == 1 ? -1 : 1;
      return this._m_sign;
    },
  });

  F2.prototype._invalidate_sign = function () {};
  Object.defineProperty(F2.prototype, "absValue", {
    set: function (v) {
      this._m_absValue = v;
    },
    get: function () {
      if (this._m_absValue !== undefined) return this._m_absValue;
      this._m_absValue = this.isSpecial
        ? this.specialValue
        : this.isSubnormal
        ? this.subnormalValue
        : this.normalValue;
      return this._m_absValue;
    },
  });

  F2.prototype._invalidate_absValue = function () {};
  Object.defineProperty(F2.prototype, "powExp", {
    set: function (v) {
      this._m_powExp = v;
    },
    get: function () {
      if (this._should_write_powExp) {
        this._write_powExp();
      }
      if (this._m_powExp !== undefined) return this._m_powExp;
      this._m_powExp = new Pow2(this._io, this, this._root, this.offsetExp);
      this._m_powExp._read();
      return this._m_powExp;
    },
  });

  F2.prototype._write_powExp = function () {
    this._should_write_powExp = false;
    this.powExp._write__seq(this._io);
  };

  F2.prototype._checkpowExp = function () {
    this._should_write_powExp = false;
    if (this.powExp._root !== this._root) {
      throw new KaitaiStream.ConsistencyError(
        "pow_exp",
        this.powExp._root,
        this._root
      );
    }
    if (this.powExp._parent !== this) {
      throw new KaitaiStream.ConsistencyError(
        "pow_exp",
        this.powExp._parent,
        this
      );
    }
    if (this.powExp.exponent != this.offsetExp) {
      throw new KaitaiStream.ConsistencyError(
        "pow_exp",
        this.powExp.exponent,
        this.offsetExp
      );
    }
  };
  Object.defineProperty(F2.prototype, "floatValue", {
    set: function (v) {
      this._m_floatValue = v;
    },
    get: function () {
      if (this._m_floatValue !== undefined) return this._m_floatValue;
      this._m_floatValue = this.sign * this.absValue;
      return this._m_floatValue;
    },
  });

  F2.prototype._invalidate_floatValue = function () {};
  Object.defineProperty(F2.prototype, "offsetExp", {
    set: function (v) {
      this._m_offsetExp = v;
    },
    get: function () {
      if (this._m_offsetExp !== undefined) return this._m_offsetExp;
      this._m_offsetExp = this.exponent - 15;
      return this._m_offsetExp;
    },
  });

  F2.prototype._invalidate_offsetExp = function () {};
  Object.defineProperty(F2.prototype, "normalValue", {
    set: function (v) {
      this._m_normalValue = v;
    },
    get: function () {
      if (this._m_normalValue !== undefined) return this._m_normalValue;
      this._m_normalValue = this.powExp.val * (1 + this.fraction / 1024);
      return this._m_normalValue;
    },
  });

  F2.prototype._invalidate_normalValue = function () {};
  Object.defineProperty(F2.prototype, "isSubnormal", {
    set: function (v) {
      this._m_isSubnormal = v;
    },
    get: function () {
      if (this._m_isSubnormal !== undefined) return this._m_isSubnormal;
      this._m_isSubnormal = this.exponent == 0;
      return this._m_isSubnormal;
    },
  });

  F2.prototype._invalidate_isSubnormal = function () {};
  Object.defineProperty(F2.prototype, "fraction", {
    set: function (v) {
      this._m_fraction = v;
    },
    get: function () {
      if (this._m_fraction !== undefined) return this._m_fraction;
      this._m_fraction = this.bytes & 1023;
      return this._m_fraction;
    },
  });

  F2.prototype._invalidate_fraction = function () {};
  Object.defineProperty(F2.prototype, "isSpecial", {
    set: function (v) {
      this._m_isSpecial = v;
    },
    get: function () {
      if (this._m_isSpecial !== undefined) return this._m_isSpecial;
      this._m_isSpecial = this.exponent == 31;
      return this._m_isSpecial;
    },
  });

  F2.prototype._invalidate_isSpecial = function () {};

  return F2;
})();
var _;

export default F2;
