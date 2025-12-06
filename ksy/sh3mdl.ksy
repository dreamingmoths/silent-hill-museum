meta:
  id: sh3mdl
  title: Silent Hill PS2 model format
  application: Silent Hill 2+3 (PS2)
  file-extension: mdl
  endian: le

doc: |
  3D model format of Silent Hill 2 and 3 for the PlayStation 2.

seq:
  - id: no_texture_id
    type: u1

  - id: padding
    size: 3

  - id: character_id
    type: s4

  - id: num_textures
    type: s4

  - id: ofs_texture_header
    type: s4

  - id: ofs_cluster
    type: s4

  - id: ofs_model_header
    type: s4

instances:
  model_header:
    type: model_header
    pos: ofs_model_header
    size: ofs_texture_header

  texture_header:
    pos: ofs_texture_header
    type: texture_header
    size-eos: true

types:
  model_header:
    seq:
      - id: magic
        -orig-id: id
        contents: [0x03, 0x00, 0xff, 0xff]

      - id: model_version
        -orig-id: revision
        type: u4

      - id: ofs_initial_matrices
        type: u4

      - id: num_bones
        -orig-id: n_boness
        type: u4

      - id: ofs_bones
        -orig-id: bones_structure_offset
        type: u4

      - id: num_bone_pairs
        -orig-id: n_bones_pairs
        type: u4

      - id: ofs_bone_pairs
        type: u4

      - id: ofs_default_pcms
        type: u4

      - id: num_opaque_parts
        -orig-id: n_vu1_parts
        type: u4

      - id: ofs_opaque_parts
        type: u4

      - id: num_transparent_parts
        -orig-id: n_vu0_parts
        type: u4

      - id: ofs_transparent_parts
        type: u4

      - id: num_texture_blocks
        type: u4

      - id: ofs_texture_blocks
        type: u4

      - id: num_texture_info
        -orig-id: text_poses_offset
        type: u4

      - id: ofs_texture_info
        -orig-id: text_pos_params_offset
        type: u4

      - id: num_cluster_nodes
        type: u4

      - id: ofs_cluster_nodes
        type: u4

      - id: num_clusters
        type: u4

      - id: ofs_clusters
        type: u4

      - id: num_func_data
        type: u4

      - id: ofs_func_data
        type: u4

      - id: ofs_hit
        type: u4

      - id: ofs_box
        type: u4

      - -orig-id: flag
        type: u4

      - id: ofs_relative_matrices
        type: u4

      - id: ofs_relative_transes
        type: u4

      - -orig-id: pTexMAN
        type: s4
        repeat: expr
        repeat-expr: 4

    instances:
      initial_matrices:
        pos: ofs_initial_matrices
        type: transformation_matrix
        repeat: expr
        repeat-expr: num_bones
      default_pcms:
        pos: ofs_default_pcms
        type: transformation_matrix
        repeat: expr
        repeat-expr: num_bone_pairs
      texture_blocks:
        pos: ofs_texture_blocks
        type: texture_blocks
        if: _root.num_textures > 0
      opaque_parts:
        pos: ofs_opaque_parts
        type: part
        repeat: expr
        repeat-expr: num_opaque_parts
      transparent_parts:
        pos: ofs_transparent_parts
        type: part
        repeat: expr
        repeat-expr: num_transparent_parts
      bones:
        pos: ofs_bones
        type: u1
        repeat: expr
        repeat-expr: num_bones
      bone_pairs:
        pos: ofs_bone_pairs
        type: bone_pair
        repeat: expr
        repeat-expr: num_bone_pairs
  bone_pair:
    seq:
      - id: parent
        type: u1
      - id: child
        type: u1
  part:
    seq:
      - id: mesh_size
        type: u4
      - id: type
        type: u4
      - id: ofs_vif_packet
        type: u4
      - id: num_vif_qwords
        type: u4
      - id: vif_addr
        type: u4
      - id: num_clusters
        type: u4
      - id: ofs_clusters
        type: u4
      - id: num_bones
        type: u4
      - id: ofs_bones
        type: u4
      - id: num_bone_pairs
        type: u4
      - id: ofs_bone_pairs
        type: u4
      - -orig-id: data_skeletons_offset
        type: u4
      - -orig-id: data_skeleton_pairs_offset
        type: u4
      - id: num_textures
        type: u4
      - id: ofs_texture_index
        type: u4
      - id: ofs_texture_params
        type: u4
      - id: shading_type
        type: u1
      - id: specular_pos
        type: u1
      - id: equipment_id
        type: u1
      - id: hoge
        type: u1
      - id: backclip
        type: u1
      - id: envmap_param
        type: u1
      - id: reserved
        type: u1
        repeat: expr
        repeat-expr: 2
      - id: phong_param_a
        type: f4
      - id: phong_param_b
        type: f4
      - id: blinn_param
        type: f4
      - id: padding
        type: u4
        repeat: expr
        repeat-expr: 3
      - id: diffuse
        type: f4
        repeat: expr
        repeat-expr: 4
      - id: ambient
        type: f4
        repeat: expr
        repeat-expr: 4
      - id: specular
        type: f4
        repeat: expr
        repeat-expr: 4
      - id: clusters
        size: num_clusters * 6
      - id: bones
        type: s2
        repeat: expr
        repeat-expr: num_bones
      - id: bone_pairs
        type: s2
        repeat: expr
        repeat-expr: num_bone_pairs
      - id: texture_index
        type: u1
      - size: 16 - (_io.pos % 16)
        if: _io.pos > 0
      - size: 16
      - id: vif_data
        type: vif_section
        size: num_vif_qwords * 16

  vif_section:
    seq:
      - size: 8

      - id: num_vertex_groups
        type: s4

      - type: s4

      - id: ofs_vertex_base
        type: s4

      - id: ofs_bone_matrix_base
        type: s4

      - type: s4

      - type: s4

      - id: triangles_start_index
        type: s4

      - id: ofs_triangles
        type: s4

      - id: groups
        type: vertex_group
        repeat: expr
        repeat-expr: num_vertex_groups

      - id: attributes
        type: vertex_attributes(groups[_index])
        repeat: expr
        repeat-expr: num_vertex_groups

      - size: 8

      - id: triangles
        type: s2
        repeat: expr
        repeat-expr: (ofs_triangles - triangles_start_index) * 4

  vertex_group:
    seq:
      - size: 4
      - id: num_vertices
        type: s4
      - id: num_bone_pairs
        type: s4
      - id: vertex_data_addr
        type: s4
      - id: vertex_data_end_addr
        type: s4
      - id: local_bone_addr
        type: s4
        repeat: expr
        repeat-expr: 4

  vertex_attributes:
    params:
      - id: group
        type: vertex_group
    seq:
      - size: 4
      - size: 4
      - id: vertices
        type: s2
        repeat: expr
        repeat-expr: group.num_vertices * 3
      - size: 4 - _io.pos % 4
        if: _io.pos % 4 > 0

      - size: 4
      - id: normals
        type: s2
        repeat: expr
        repeat-expr: group.num_vertices * 3
      - size: 4 - _io.pos % 4
        if: _io.pos % 4 > 0

      - size: 4
        if: group.num_bone_pairs > 0

      - id: weights
        type: s2
        repeat: expr
        repeat-expr: group.num_vertices * (group.num_bone_pairs / 2 + 1)
        if: group.num_bone_pairs > 0
      - size: 4 - _io.pos % 4
        if: _io.pos % 4 > 0

      - size: 4
      - id: uvs
        type: s2
        repeat: expr
        repeat-expr: group.num_vertices * 2
      - size: 4 - _io.pos % 4
        if: _io.pos % 4 > 0

  transformation_matrix:
    doc: |
      Represents a 4x4 column-major transformation matrix.
    seq:
      - id: rotation00
        type: f4
      - id: rotation10
        type: f4
      - id: rotation20
        type: f4
      - id: pad0
        type: f4
        valid: 0
      - id: rotation01
        type: f4
      - id: rotation11
        type: f4
      - id: rotation21
        type: f4
      - id: pad1
        type: f4
        valid: 0
      - id: rotation02
        type: f4
      - id: rotation12
        type: f4
      - id: rotation22
        type: f4
      - id: pad2
        type: f4
        valid: 0
      - id: translation_x
        type: f4
      - id: translation_y
        type: f4
      - id: translation_z
        type: f4
      - id: translation_w
        type: f4
        valid: 1

  texture_blocks:
    seq:
      - id: image_ids
        type: u4
        repeat: expr
        repeat-expr: _root.model_header.num_texture_blocks
      - id: pad
        size: 16 - (4 * _root.model_header.num_texture_blocks) % 16
        if: _root.model_header.num_texture_blocks % 4 > 0
      - id: texture_pairs
        type: texture_pair
        repeat: expr
        repeat-expr: _root.model_header.num_texture_info
        doc: TODO

  texture_pair:
    seq:
      - id: image_index
        type: u4
      - id: palette_index
        type: u4

  texture_header:
    seq:
      - size: 8
      - id: ofs
        type: s4
      - size: ofs - 12
      - id: textures
        type: texture
        repeat: expr
        repeat-expr: _root.num_textures
  texture:
    seq:
      - size: 8
      - id: width
        type: u2
      - id: height
        type: u2
      - size: 4
      - id: image_size
        type: u4
      - id: header_size
        type: u1
      - size: 4
      - id: psm
        type: u1
        enum: psm
      - id: dbw_flag
        type: u1
      - type: u1
      - type: u1
      - type: u1
      - size: header_size - 30
      - id: image_data
        size: image_size
      - id: clut
        type: clut_data
        if: psm == psm::psmt8 or psm == psm::psmt4

    instances:
      unk:
        value: "dbw_flag > 0 ? 1 : 0"
      dbw:
        value: width >> 6 >> unk
      rrw:
        value: width >> unk
      rrh:
        value: height >> dbw_flag

  clut_data:
    seq:
      - id: data_size
        type: u4
      - size: 10
      - id: width
        type: u1
      - size: 0x21
      - id: clut_data
        size: data_size

enums:
  psm:
    0x00: psmct32
    0x01: psmct24
    0x02: psmct16
    0x0a: psmct16s
    0x13: psmt8
    0x14: psmt4
    0x1b: psmt8h
    0x24: psmt4hl
    0x2c: psmt4hh
    0x30: psmz32
    0x31: psmz24
    0x32: psmz16
    0x3a: psmz16s
