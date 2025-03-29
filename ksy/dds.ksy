meta:
  id: dds
  title: Silent Hill 2 model format
  application: Silent Hill 2 (PS2)
  file-extension: dds
  encoding: ascii
  endian: le
  imports: f2

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
    # valid:
      # expr: total_light_count < 6 # why?

  - id: pad
    size: 1

  - id: character_count
    type: u1

  - id: character_names
    type: anim_info_name
    repeat: expr
    repeat-expr: character_count
  
  - id: frames
    type: frame
    repeat: until
    repeat-until: _index == total_demo_frame or 
      (_index > 0 and frames[_index - 1].is_stop_frame)

instances:
  total_light_count:
    value: point_light_count + spot_light_count + infinit_light_count

types:
  frame:
    seq:
      - id: frame_index
        type: s2
      
      - id: instructions
        type:
          switch-on: _index == 0
          cases:
            true: instruction(0)
            false: instruction(instructions[_index - 1].state)
        repeat: until
        repeat-until: _.dds_block_type == drama_demo::stop
        if: frame_index >= 0
        
    instances:
      is_stop_frame:
        value: frame_index < 0

  instruction:
    params:
      - id: demo_status
        type: u1

    seq:
      - id: control_byte
        type: u1
        
      - id: dds_block
        type:
          switch-on: dds_block_type
          cases:
            'drama_demo::play_key': dds_play_key
            'drama_demo::play_camera': dds_play_camera(demo_status)
            'drama_demo::play_light': dds_play_light(demo_status)
            'drama_demo::play_character': dds_play_character(demo_status)
            'drama_demo::stop': empty

    instances:
      state:
        value: |
          control_byte == 0 ?
            dds_block.as<dds_play_key>.demo_status : demo_status
    
      dds_block_type:
        enum: drama_demo
        value: |
          control_byte < 2 or control_byte == 255 ?
            control_byte : 
            ((control_byte - 2 < _root.total_light_count) ?
              2 :
              3)
  
  dds_play_key:
    seq:
      - id: status_bytes
        type: u1
        repeat: until
        repeat-until: _ == 11 or _io.eof
    instances:
      state_array:
        type:
          switch-on: (_index > 0).to_i
          cases:
            0: state_reducer(0, status_bytes[0])
            1: state_reducer(state_array[_index - 1].current_value, status_bytes[_index])
        if: status_bytes.size > 1
        repeat: expr
        repeat-expr: status_bytes.size
      demo_status:
        value: state_array.last.current_value

  state_reducer:
    params:
      - id: previous_state
        type: u1
      - id: operation
        type: s1
    instances:
      current_value:
        value: |
          operation == 20 ? previous_state | 0x10 : 
          operation == 17 ? previous_state | 0x4 :
          operation == 16 ? previous_state | 0x3 :
          previous_state

  dds_play_camera:
    params:
      - id: demo_status
        type: u1
    seq:
      - id: info
        type: dds_camera_info
        repeat: until
        repeat-until: _.control_byte >= 11
    instances:
      state:
        value: demo_status
        
  dds_camera_info:
    seq:
      - id: control_byte
        type: u1
        
      - id: dds_block
        type:
          switch-on: >
            [control_byte, using_half_floats].as<bytes>
          cases:
            '[1, 0]': empty # unknown, sets a flag to 1
            '[2, 0]': empty # unknown, sets a flag to 0
            '[3, 0]': f2_vector
            '[3, 1]': f4_vector
            '[4, 0]': f2_vector
            '[4, 1]': f4_vector
            '[5, 0]': f2_vector # rotation to interest
            '[5, 1]': f2_vector
            '[6, 0]': f2
            '[6, 1]': f2
            '[7, 0]': f4
            '[7, 1]': f4
    instances:
      using_half_floats:
        value: _parent.state & 2 > 0

  dds_play_light:
    params:
      - id: demo_status
        type: u1
    seq:
      - id: info
        type: dds_light_info
        repeat: until
        repeat-until: _.control_byte >= 11
    instances:
      state:
        value: demo_status
        
  dds_light_info:
    seq:
      - id: control_byte
        type: u1
        
      - id: dds_block
        type:
          switch-on: >
            [control_byte, using_half_floats].as<bytes>
          cases:
            '[1, 0]': empty # unknown, sets a flag to 1
            '[2, 0]': empty # uknown, sets a flag to 0
            '[3, 0]': f2_vector
            '[3, 1]': f4_vector
            '[4, 0]': f2_vector
            '[4, 1]': f4_vector
            '[5, 0]': f2_vector # rotation to interest
            '[5, 1]': f2_vector
            '[8, 0]': f2_vector
            '[8, 1]': f2_vector
            '[9, 0]': f2_vector2
            '[9, 1]': f2_vector2
            '[10, 0]': f2_vector2
            '[10, 1]': f2_vector2
    instances:
      using_half_floats:
        value: _parent.state & 2 > 0

  f2_vector:
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

  f2_vector2:
    seq:
      - id: x_16
        type: f2
      - id: y_16
        type: f2
    instances:
      x:
        value: x_16.float_value
      y:
        value: y_16.float_value

  f4_vector:
    seq:
      - id: x
        type: f4
      - id: y
        type: f4
      - id: z
        type: f4

  dds_play_character:
    params:
      - id: demo_status
        type: u1
    seq:
      - id: info
        type: dds_character_info
        repeat: until
        repeat-until: _.control_byte == 11
    instances:
      state:
        value: demo_status
        
  dds_character_info:
    seq:
      - id: control_byte
        type: u1
        
      - id: dds_block
        if: control_byte > 0 and control_byte < 4
        type:
          switch-on: >
            [control_byte, using_half_floats].as<bytes>
          cases:
            '[1, 0]': empty # unknown, sets a flag to 1
            '[1, 1]': empty # unknown, sets a flag to 1
            '[2, 0]': empty # unknown, sets a flag to 0
            '[2, 1]': empty # unknown, sets a flag to 0
            '[3, 0]': f2_vector
            '[3, 1]': f4_vector
    instances:
      using_half_floats:
        value: _parent.state & 2 > 0

  empty:
    doc: Nothing.

  anim_info_name:
    seq:
      - id: name1
        type: str
        size: 16
    doc: |
      These names are refer to entries in a hardcoded list of animation info.
      These structs are called `DramaDemo_AnimInfo`.

enums:
  drama_demo:
    0: play_key
    1: play_camera
    2: play_light
    3: play_character
    255: stop
