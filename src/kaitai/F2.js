// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kaitai-struct/KaitaiStream'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('kaitai-struct/KaitaiStream'));
  } else {
    root.F2 = factory(root.KaitaiStream);
  }
}(typeof self !== 'undefined' ? self : this, function (KaitaiStream) {
var F2 = (function() {
  function F2(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

    this._read();
  }
  F2.prototype._read = function() {
    this.bytes = this._io.readU2le();
  }

  var Pow2 = F2.Pow2 = (function() {
    function Pow2(_io, _parent, _root, exponent) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;
      this.exponent = exponent;

      this._read();
    }
    Pow2.prototype._read = function() {
    }
    Object.defineProperty(Pow2.prototype, 'val', {
      get: function() {
        if (this._m_val !== undefined)
          return this._m_val;
        this._m_val = (this.exponent == -14 ? 0.00006103515625 : (this.exponent == -13 ? 0.0001220703125 : (this.exponent == -12 ? 0.000244140625 : (this.exponent == -11 ? 0.00048828125 : (this.exponent == -10 ? 0.0009765625 : (this.exponent == -9 ? 0.001953125 : (this.exponent == -8 ? 0.00390625 : (this.exponent == -7 ? 0.0078125 : (this.exponent == -6 ? 0.015625 : (this.exponent == -5 ? 0.03125 : (this.exponent == -4 ? 0.0625 : (this.exponent == -3 ? 0.125 : (this.exponent == -2 ? 0.25 : (this.exponent == -1 ? 0.5 : (this.exponent == 0 ? 1 : (this.exponent == 1 ? 2 : (this.exponent == 2 ? 4 : (this.exponent == 3 ? 8 : (this.exponent == 4 ? 16 : (this.exponent == 5 ? 32 : (this.exponent == 6 ? 64 : (this.exponent == 7 ? 128 : (this.exponent == 8 ? 256 : (this.exponent == 9 ? 512 : (this.exponent == 10 ? 1024 : (this.exponent == 11 ? 2048 : (this.exponent == 12 ? 4096 : (this.exponent == 13 ? 8192 : (this.exponent == 14 ? 16384 : (this.exponent == 15 ? 32768 : 0))))))))))))))))))))))))))))));
        return this._m_val;
      }
    });

    return Pow2;
  })();
  Object.defineProperty(F2.prototype, 'specialValue', {
    get: function() {
      if (this._m_specialValue !== undefined)
        return this._m_specialValue;
      this._m_specialValue = (this.fraction == 0 ? this.infinity : this.nan);
      return this._m_specialValue;
    }
  });
  Object.defineProperty(F2.prototype, 'subnormalValue', {
    get: function() {
      if (this._m_subnormalValue !== undefined)
        return this._m_subnormalValue;
      this._m_subnormalValue = (0.00006103515625 * (this.fraction / 1024));
      return this._m_subnormalValue;
    }
  });
  Object.defineProperty(F2.prototype, 'infinity', {
    get: function() {
      if (this._m_infinity !== undefined)
        return this._m_infinity;
      this._m_infinity = Math.floor(1 / 0);
      return this._m_infinity;
    }
  });
  Object.defineProperty(F2.prototype, 'exponent', {
    get: function() {
      if (this._m_exponent !== undefined)
        return this._m_exponent;
      this._m_exponent = ((this.bytes & 31744) >>> 10);
      return this._m_exponent;
    }
  });
  Object.defineProperty(F2.prototype, 'nan', {
    get: function() {
      if (this._m_nan !== undefined)
        return this._m_nan;
      this._m_nan = Math.floor(0 / 0);
      return this._m_nan;
    }
  });
  Object.defineProperty(F2.prototype, 'sign', {
    get: function() {
      if (this._m_sign !== undefined)
        return this._m_sign;
      this._m_sign = ((this.bytes >>> 15) == 1 ? -1 : 1);
      return this._m_sign;
    }
  });
  Object.defineProperty(F2.prototype, 'absValue', {
    get: function() {
      if (this._m_absValue !== undefined)
        return this._m_absValue;
      this._m_absValue = (this.isSpecial ? this.specialValue : (this.isSubnormal ? this.subnormalValue : this.normalValue));
      return this._m_absValue;
    }
  });
  Object.defineProperty(F2.prototype, 'powExp', {
    get: function() {
      if (this._m_powExp !== undefined)
        return this._m_powExp;
      this._m_powExp = new Pow2(this._io, this, this._root, this.offsetExp);
      return this._m_powExp;
    }
  });
  Object.defineProperty(F2.prototype, 'floatValue', {
    get: function() {
      if (this._m_floatValue !== undefined)
        return this._m_floatValue;
      this._m_floatValue = (this.sign * this.absValue);
      return this._m_floatValue;
    }
  });
  Object.defineProperty(F2.prototype, 'offsetExp', {
    get: function() {
      if (this._m_offsetExp !== undefined)
        return this._m_offsetExp;
      this._m_offsetExp = (this.exponent - 15);
      return this._m_offsetExp;
    }
  });
  Object.defineProperty(F2.prototype, 'normalValue', {
    get: function() {
      if (this._m_normalValue !== undefined)
        return this._m_normalValue;
      this._m_normalValue = (this.powExp.val * (1 + (this.fraction / 1024)));
      return this._m_normalValue;
    }
  });
  Object.defineProperty(F2.prototype, 'isSubnormal', {
    get: function() {
      if (this._m_isSubnormal !== undefined)
        return this._m_isSubnormal;
      this._m_isSubnormal = this.exponent == 0;
      return this._m_isSubnormal;
    }
  });
  Object.defineProperty(F2.prototype, 'fraction', {
    get: function() {
      if (this._m_fraction !== undefined)
        return this._m_fraction;
      this._m_fraction = (this.bytes & 1023);
      return this._m_fraction;
    }
  });
  Object.defineProperty(F2.prototype, 'isSpecial', {
    get: function() {
      if (this._m_isSpecial !== undefined)
        return this._m_isSpecial;
      this._m_isSpecial = this.exponent == 31;
      return this._m_isSpecial;
    }
  });

  return F2;
})();
return F2;
}));
