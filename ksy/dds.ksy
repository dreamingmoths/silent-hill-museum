meta:
  id: dds
  title: Silent Hill 2 model format
  application: Silent Hill 2 (PS2)
  file-extension: dds
  encoding: ascii
  endian: le

doc: DDS is the Silent Hill 2 cutscene format.

seq:
  - id: magic
    type: str
    terminator: 0
    valid: '"dds"'

  - id: unknown0
    size: 12
    doc: PS2 version does not look at these, but they can be nonzero.

  - id: total_demo_frame
    type: u2

  - id: unknown_short
    type: u2

  - id: point_light_count
    type: u1

  - id: spot_light_count
    type: u1

  - id: infinit_light_count
    type: u1
    valid:
      expr: _ < 6 # why?

  - id: pad
    size: 1

  - id: character_count
    type: u1

  - id: character_names
    type: anim_info_name
    repeat: expr
    repeat-expr: character_count

instances:
  total_light_count:
    value: point_light_count + spot_light_count + infinit_light_count

types:
  anim_info_name:
    seq:
      - id: name
        type: str
        size: 16
    doc: |
      These names are refer to entries in a hardcoded list of animation info.
      These structs are called `DramaDemo_AnimInfo`.
