meta:
  id: f2
  title: IEEE 754 half-precision binary floating-point format
  endian: le

seq:
  - id: bytes
    type: u2

instances:
  sign:
    value: "(bytes >> 15) == 1 ? -1 : 1"

  exponent:
    value: (bytes & 0x7C00) >> 10

  fraction:
    value: bytes & 0x03FF

  is_special:
    value: exponent == 0x1F

  is_subnormal:
    value: exponent == 0

  offset_exp:
    value: exponent - 15

  pow_exp:
    type: pow2(offset_exp)

  normal_value:
    value: pow_exp.val.as<f4> * (1 + fraction.as<f4> / 0x400)

  subnormal_value:
    value: 0.00006103515625 * (fraction.as<f4> / 0x400)

  special_value:
    value: "fraction == 0 ? nan : infinity"

  infinity:
    value: 0 # no ♾️ in kaitai?

  nan:
    value: 0 # no 🫓 in kaitai? 🍞

  abs_value:
    value: |
      is_special ? special_value :
      is_subnormal ? subnormal_value :
      normal_value

  float_value:
    value: sign * abs_value # result

types:
  pow2:
    params:
      - id: exponent
        type: s1
    instances:
      val:
        value: |
          exponent == -14 ? 0.00006103515625 :
          exponent == -13 ? 0.0001220703125 :
          exponent == -12 ? 0.000244140625 :
          exponent == -11 ? 0.00048828125 :
          exponent == -10 ? 0.0009765625 :
          exponent == -9  ? 0.001953125 :
          exponent == -8  ? 0.00390625 :
          exponent == -7  ? 0.0078125 :
          exponent == -6  ? 0.015625 :
          exponent == -5  ? 0.03125 :
          exponent == -4  ? 0.0625 :
          exponent == -3  ? 0.125 :
          exponent == -2  ? 0.25 :
          exponent == -1  ? 0.5 :
          exponent == 0   ? 1 :
          exponent == 1   ? 2 :
          exponent == 2   ? 4 :
          exponent == 3   ? 8 :
          exponent == 4   ? 16 :
          exponent == 5   ? 32 :
          exponent == 6   ? 64 :
          exponent == 7   ? 128 :
          exponent == 8   ? 256 :
          exponent == 9   ? 512 :
          exponent == 10  ? 1024 :
          exponent == 11  ? 2048 :
          exponent == 12  ? 4096 :
          exponent == 13  ? 8192 :
          exponent == 14  ? 16384 :
          exponent == 15  ? 32768 :
          0
