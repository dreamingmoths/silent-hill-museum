meta:
  id: anm
  title: Silent Hill 2 animation format
  application: Silent Hill 2 (PC)
  file-extension: anm
  endian: le
  bit-endian: le
  imports:
    - mdl
    - f2

doc: |
  Anm is the proprietary 3D animation format of Silent Hill 2 (PC). It
  describes rotations and translations that are applied to the bones of a
  model.
  Parsing an animation requires knowing the structure of the model's skeleton,
  so the model must be provided to the parser.

params:
  - id: model
    type: mdl
    doc: The model that the animation will be applied to.

seq:
  - id: blocks
    type: block(model, _index)
    repeat: eos
    doc: A repeating series of groups of 8 transforms.

types:
  none:
    doc: No transform; an empty slot in a block.

  rotation:
    doc: |
      A 3D rotation described by Euler angles. Each angle is a 16-bit
      fixed-point real number with a 12-bit fraction.
    seq:
      - id: x_int
        type: s2
      - id: y_int
        type: s2
      - id: z_int
        type: s2
    instances:
      x:
        value: x_int / 4096.0
      y:
        value: y_int / 4096.0
      z:
        value: z_int / 4096.0

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
    seq:
      - id: x_16
        type: f2
      - id: y_16
        type: f2
      - id: z_16
        type: f2
    instances:
      x:
        value: x_16.float_value
      y:
        value: y_16.float_value
      z:
        value: z_16.float_value

  translation16_padded:
    doc: |
      A 3D translation described with 16-bit floating point values which are
      padded to 32 bits.
    seq:
      - id: x_16
        type: f2
      - id: x_pad
        size: 2
      - id: y_16
        type: f2
      - id: y_pad
        size: 2
      - id: z_16
        type: f2
      - id: z_pad
        size: 2
    instances:
      x:
        value: x_16.float_value
      y:
        value: y_16.float_value
      z:
        value: z_16.float_value

  axis:
    doc: |
      An axis about which a rotation will be performed. Each component is a
      16-bit signed integer representing a value in the range [-1, 1) (i.e.
      divide the integer value by 32768).
    seq:
      - id: x_int
        type: s2
      - id: y_int
        type: s2
      - id: z_int
        type: s2
      - id: w_int
        type: s2
    instances:
      x:
        value: x_int / 32768.0
      y:
        value: y_int / 32768.0
      z:
        value: z_int / 32768.0
      w:
        value: w_int / 32768.0

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
        doc: Function unknown, but the game does read and store this value.
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
      - id: model
        type: mdl
        doc: The model that the animation applies to.
      - id: block_index
        type: u4
        doc: The index of this block within the file.
    instances:
      # round bone count up to a multiple of the block size
      num_transforms_per_frame:
        value: (model.model_data.bone_count + 7) & 0xF8
    seq:
      - id: header
        type: transform_header
        repeat: until
        repeat-until: _index == 8 or _io.eof
        doc: |
          A 32-bit field where each nibble, in little-endian order, identifies
          the type of the next transform in the block.
      - id: transforms
        type:
          # the transform type depends on the type ID from the header and
          # whether the transform applies to a root bone or not. to determine
          # the latter, we need to index into the skeleton tree, but the
          # last block in a frame is padded with empty transforms to make each
          # frame occupy a whole number of blocks, so we can't use the block
          # and transform indexes directly. instead, we round the number of
          # bones up to the nearest multiple of the block size, take the block
          # index times the block size modulo that number so we loop back to
          # the beginning of the tree after each frame, then add the transform
          # index to get the skeleton index. lastly, we use the skeleton index
          # modulo the bone count because the indexes of the padding transforms
          # in the final block of a frame would otherwise exceed the length of
          # the skeleton tree. the actual value of the root flag calculated in
          # this case is irrelevant because the padding transforms are always
          # zero bytes regardless.
          switch-on: >
            [
              header[_index].type,
              model.model_data.skeleton_tree[
                (
                  (block_index << 3) % num_transforms_per_frame + _index
                ) % model.model_data.bone_count
              ] == 255 ? 1 : 0
            ].as<bytes>
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
        repeat: until
        repeat-until: _index == 8 or _io.eof
        doc: |
          A 3D transformation to be applied to a bone of a model. The exact
          fields and interpretation of a particular transform depends on the
          transform type specified in the block header and whether the bone
          that the transform applies to is a root node of the skeleton or not.
