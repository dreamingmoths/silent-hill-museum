meta:
  id: anm
  title: Silent Hill 2 animation format
  application: Silent Hill 2 (PC)
  file-extension: anm
  endian: le
  bit-endian: le
  imports:
    - mdl

doc: |
  Anm is the proprietary 3D animation format of Silent Hill 2 (PC). It describes
  rotations and translations that are applied to the bones of a model.

params:
  - id: model
    type: mdl

seq:
  - id: blocks
    type: >
      block([
        model.model_data.skeleton_tree[((_index % (model.model_data.bone_count / 8 + (model.model_data.bone_count & 7 == 0 ? 0 : 1))) * 8) % model.model_data.bone_count] == 255 ? 1 : 0,
        model.model_data.skeleton_tree[(((_index % (model.model_data.bone_count / 8 + (model.model_data.bone_count & 7 == 0 ? 0 : 1))) * 8) + 1) % model.model_data.bone_count] == 255 ? 1 : 0,
        model.model_data.skeleton_tree[(((_index % (model.model_data.bone_count / 8 + (model.model_data.bone_count & 7 == 0 ? 0 : 1))) * 8) + 2) % model.model_data.bone_count] == 255 ? 1 : 0,
        model.model_data.skeleton_tree[(((_index % (model.model_data.bone_count / 8 + (model.model_data.bone_count & 7 == 0 ? 0 : 1))) * 8) + 3) % model.model_data.bone_count] == 255 ? 1 : 0,
        model.model_data.skeleton_tree[(((_index % (model.model_data.bone_count / 8 + (model.model_data.bone_count & 7 == 0 ? 0 : 1))) * 8) + 4) % model.model_data.bone_count] == 255 ? 1 : 0,
        model.model_data.skeleton_tree[(((_index % (model.model_data.bone_count / 8 + (model.model_data.bone_count & 7 == 0 ? 0 : 1))) * 8) + 5) % model.model_data.bone_count] == 255 ? 1 : 0,
        model.model_data.skeleton_tree[(((_index % (model.model_data.bone_count / 8 + (model.model_data.bone_count & 7 == 0 ? 0 : 1))) * 8) + 6) % model.model_data.bone_count] == 255 ? 1 : 0,
        model.model_data.skeleton_tree[(((_index % (model.model_data.bone_count / 8 + (model.model_data.bone_count & 7 == 0 ? 0 : 1))) * 8) + 7) % model.model_data.bone_count] == 255 ? 1 : 0
      ])
    repeat: eos

types:
  none:
    doc: No transform; an empty slot in a block.

  rotation:
    doc: |
      A 3D rotation described by Euler angles. Each angle is a 16-bit
      fixed-point real number with a 12-bit fraction.
    seq:
      - id: x
        type: s2
      - id: y
        type: s2
      - id: z
        type: s2
    instances:
      x_real:
        value: x / 4096.0
      y_real:
        value: y / 4096.0
      z_real:
        value: z / 4096.0

  translation32:
    doc: A 3D translation described with 32-bit floating point values.
    seq:
      - id: x
        type: f4
      - id: y
        type: f4
      - id: z
        type: f4

  translation16:
    doc: A 3D translation described with 16-bit floating point values.
    # unfortunately, Kaitai doesn't support 16-bit floats
    seq:
      - id: x
        size: 2
      - id: y
        size: 2
      - id: z
        size: 2

  translation16_padded:
    doc: |
      A 3D translation described with 16-bit floating point values which are
      padded to 32 bits.
    seq:
      - id: x
        size: 2
      - id: x_pad
        size: 2
      - id: y
        size: 2
      - id: y_pad
        size: 2
      - id: z
        size: 2
      - id: z_pad
        size: 2

  axis:
    doc: |
      An axis about which a rotation will be performed. Each component is a
      16-bit signed integer representing a value in the range [-1, 1) (i.e.
      divide the integer value by 32768).
    seq:
      - id: x
        type: s2
      - id: y
        type: s2
      - id: z
        type: s2
      - id: w
        type: s2
    instances:
      x_real:
        value: x / 32768.0
      y_real:
        value: y / 32768.0
      z_real:
        value: z / 32768.0
      w_real:
        value: w / 32768.0

  isometry32:
    doc: A rotation followed by a translation using 32-bit floating point.
    seq:
      - id: translation
        type: translation32
      - id: rotation
        type: rotation

  isometry16:
    doc: A rotation followed by a translation using 16-bit floating point.
    seq:
      - id: translation
        type: translation16
      - id: rotation
        type: rotation

  rotation_with_axis:
    doc: |
      A rotation vector along with an axis of rotation and an angle of
      rotation. The intent seems to be to describe an interpolated
      rotation that rotates about the axis until reaching the final
      rotation vector. In practice, however, the game overwrites the
      axis without ever using it, and identifying the last field as an
      angle is speculative, as it's never read at all.
    seq:
      - id: rotation
        type: rotation
      - id: axis
        type: axis
      - id: angle
        type: s2

  isometry_with_axis32:
    doc: |
      A rotation followed by a translation. The axis is effectively ignored
      as described in the rotation_with_axis type.
    seq:
      - id: translation
        type: translation32
      - id: rotation
        type: rotation
      - id: axis
        type: axis
      - id: angle
        type: s2

  isometry_with_axis16:
    doc: |
      Identical to isometry_with_axis except the translation vector components
      are 16-bit floating point.
    seq:
      - id: translation
        type: translation16
      - id: rotation
        type: rotation
      - id: axis
        type: axis
      - id: angle
        type: s2

  isometry_with_axis16_padded:
    doc: |
      Identical to isometry_with_axis16 except that the translation vector
      components are padded to 32 bits.
    seq:
      - id: translation
        type: translation16_padded
      - id: rotation
        type: rotation
      - id: axis
        type: axis
      - id: angle
        type: s2

  interpolated_isometry32:
    doc: |
      A rotation followed by a translation. There are two translation vectors,
      a start vector and end vector, which are interpolated between over the
      duration of the frame. The axis and angle are ignored as described in
      rotation_with_axis.
    seq:
      - id: translation_start
        type: translation32
      - id: translation_end
        type: translation32
      - id: rotation
        type: rotation
      - id: axis
        type: axis
      - id: angle
        type: s2

  interpolated_isometry16:
    doc: |
      Identical to interpolated_isometry32 except that the translation vector
      components are 16-bit floating point. Note that the end vector is padded.
    seq:
      - id: translation_start
        type: translation16
      - id: translation_end
        type: translation16_padded
      - id: rotation
        type: rotation
      - id: axis
        type: axis
      - id: angle
        type: s2

  identity:
    doc: |
      An identity transform; a transform that does nothing. This is distinct
      from there being no transform at all.

  transform_header:
    seq:
      - id: type
        type: b3
        enum: transform_type
        doc: A number 0-7 that identifies the type of a transform within a block.
      - id: flag
        type: b1
        doc: Function unknown.
    enums:
      transform_type:
        0: none
        1: rotation
        2: isometry
        3: rotation_with_axis
        4: isometry_with_axis
        5: isometry_with_axis5
        6: interpolated_isometry
        7: identity

  block:
    doc: |
      A block of 8 transforms. A single animation frame (consisting of one
      transform for each bone) must consist of a whole number of blocks, so
      the last block in a frame should be padded with "none" entries as
      necessary.
    params:
      - id: root_flags
        type: bytes
        doc: |
          An array of flags (0 = false, 1 = true) indicating which, if any,
          transforms in the block correspond to root nodes of the skeleton.
    seq:
      - id: header
        type: transform_header
        repeat: expr
        repeat-expr: 8
        doc: |
          A 32-bit field where each nibble, in little-endian order, identifies
          the type of the next transform in the block.
      - id: transforms
        type:
          switch-on: '[header[_index].type, root_flags[_index]].as<bytes>'
          cases:
            '[0, 0]': none
            '[0, 1]': none
            '[1, 0]': rotation
            '[1, 1]': rotation
            '[2, 0]': isometry16
            '[2, 1]': isometry32
            '[3, 0]': rotation_with_axis
            '[3, 1]': rotation_with_axis
            '[4, 0]': isometry_with_axis16
            '[4, 1]': isometry_with_axis32
            '[5, 0]': isometry_with_axis16
            '[5, 1]': isometry_with_axis16_padded
            '[6, 0]': interpolated_isometry16
            '[6, 1]': interpolated_isometry32
            '[7, 0]': identity
            '[7, 1]': identity
        repeat: expr
        repeat-expr: 8
        doc: |
          A 3D transformation to be applied to a bone of a model. The exact
          fields and interpretation of a particular transform depends on the
          transform type specified in the block header.