types:
  vif:
    seq:
      - id: imm
        type: u2
      - id: num
        type: u1
      - id: interrupt
        type: b1
      - id: opcode
        type: b7
        enum: vif_opcode
      - id: data
        type: >
          vif_vector(
            unpack_info.vn,
            unpack_info.vl,
            (imm & 0x400) > 0
          )
        repeat: expr
        repeat-expr: num
        if: is_unpack
      - id: padding
        size: 4 - _io.pos % 4
        if: _io.pos % 4 > 0

    instances:
      is_unpack:
        value: opcode.to_i >= 0x60

      unpack_info:
        type: unpack_vifcode
        pos: _io.pos - 1
        if: is_unpack

  vif_vector:
    params:
      - id: vn
        type: b2
      - id: vl
        type: b2
      - id: unsigned
        type: b1
    seq:
      - id: values
        type:
          switch-on: >
            [vl, unsigned].as<bytes>
          cases:
            "[0, 0]": s4
            "[0, 1]": u4
            "[1, 0]": s2
            "[1, 1]": u2
            "[2, 0]": s1
            "[2, 1]": u1
        repeat: expr
        repeat-expr: vn + 1

  unpack_vifcode:
    seq:
      - id: interrupt
        type: b1

      - id: cmd
        type: b2
        valid: 0b11

      - id: mask
        type: b1

      - id: vn
        type: b2

      - id: vl
        type: b2
    instances:
      size:
        value: (4 >> vl) * (vn + 1)

enums:
  vif_opcode:
    0x0: nop
    0x1: stcycle

    0x60: unpack_s32_unmasked
    0x61: unpack_s16_unmasked
    0x62: unpack_s8_unmasked
    0x64: unpack_v2_32_unmasked
    0x65: unpack_v2_16_unmasked
    0x66: unpack_v2_8_unmasked
    0x68: unpack_v3_32_unmasked
    0x69: unpack_v3_16_unmasked
    0x6a: unpack_v3_8_unmasked
    0x6c: unpack_v4_32_unmasked
    0x6d: unpack_v4_16_unmasked
    0x6e: unpack_v4_8_unmasked

    0x70: unpack_s32_masked
    0x71: unpack_s16_masked
    0x72: unpack_s8_masked
    0x74: unpack_v2_32_masked
    0x75: unpack_v2_16_masked
    0x76: unpack_v2_8_masked
    0x78: unpack_v3_32_masked
    0x79: unpack_v3_16_masked
    0x7a: unpack_v3_8_masked
    0x7c: unpack_v4_32_masked
    0x7d: unpack_v4_16_masked
    0x7e: unpack_v4_8_masked
