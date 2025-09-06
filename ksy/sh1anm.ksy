meta:
  id: sh1anm
  file-extension: sh1anm
  endian: le

doc: |
  Anm is the proprietary 3D animation format of Silent Hill (PSX).

  The body is a list of frames, each frame containing a section of translations
  for the first `num_translation_bones` bones, followed by a section of rotations
  for the next `num_rotation_bones` bones.

  The header contains base translations for all bones, as well as a magic value
  that is the offset to the first frame.

seq:
  - id: magic
    type: s2

  - id: num_rotation_bones
    type: u1

  - id: num_translation_bones
    type: u1

  - id: frame_size
    type: s2

  - id: num_bones
    type: s2

  - id: flags
    type: s4

  - id: end_ofs
    type: s4

  - id: num_frames
    type: u2

  - id: scale_log2
    type: u1
    doc: translations are scaled by 1 << scale_log2

  - type: u1

  - id: bind_poses
    type: bind_pose
    repeat: expr
    repeat-expr: num_bones

instances:
  frame_data:
    type:
      switch-on: _index % bones_per_frame >= num_translation_bones
      cases:
        true: rotation
        false: translation
    pos: magic
    repeat: expr
    repeat-expr: num_frames * bones_per_frame

  bones_per_frame:
    value: num_rotation_bones + num_translation_bones

types:
  bind_pose:
    seq:
      - id: bone
        type: u1

      - type: u1
      - type: u1

      - id: translation
        type: translation

  translation:
    seq:
      - id: x
        type: s1
      - id: y
        type: s1
      - id: z
        type: s1

  rotation:
    doc: 3x3 matrix, signed fixed point with 7 fraction bits
    seq:
      - id: value
        type: s1
        repeat: expr
        repeat-expr: 9
