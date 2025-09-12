// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

#![allow(unused_imports)]
#![allow(non_snake_case)]
#![allow(non_camel_case_types)]
#![allow(irrefutable_let_patterns)]
#![allow(unused_comparisons)]

use kaitai::*;
use std::cell::{Cell, Ref, RefCell};
use std::convert::{TryFrom, TryInto};
use std::rc::{Rc, Weak};

/**
 * Mdl is the proprietary 3D model format of Silent Hill 2 (PC). It describes
 * geometry, textures, skeleton data, and more. This structure does not describe
 * the PS2 mdl format, yet.
 */

#[derive(Default, Debug, Clone)]
pub struct Mdl {
    pub _root: SharedType<Mdl>,
    pub _parent: SharedType<Mdl>,
    pub _self: SharedType<Self>,
    header: RefCell<OptRc<Mdl_FileHeader>>,
    model_data: RefCell<OptRc<Mdl_Model>>,
    _io: RefCell<BytesReader>,
    header_raw: RefCell<Vec<u8>>,
    texture_data_raw: RefCell<Vec<u8>>,
    f_texture_data: Cell<bool>,
    texture_data: RefCell<OptRc<Mdl_TextureData>>,
}
impl KStruct for Mdl {
    type Root = Mdl;
    type Parent = Mdl;

    fn read<S: KStream>(
        self_rc: &OptRc<Self>,
        _io: &S,
        _root: SharedType<Self::Root>,
        _parent: SharedType<Self::Parent>,
    ) -> KResult<()> {
        *self_rc._io.borrow_mut() = _io.clone();
        self_rc._root.set(_root.get());
        self_rc._parent.set(_parent.get());
        self_rc._self.set(Ok(self_rc.clone()));
        let _rrc = self_rc._root.get_value().borrow().upgrade();
        let _prc = self_rc._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        *self_rc.header_raw.borrow_mut() = _io.read_bytes(64 as usize)?.into();
        let header_raw = self_rc.header_raw.borrow();
        let _t_header_raw_io = BytesReader::from(header_raw.clone());
        let t = Self::read_into::<BytesReader, Mdl_FileHeader>(
            &_t_header_raw_io,
            Some(self_rc._root.clone()),
            Some(self_rc._self.clone()),
        )?
        .into();
        *self_rc.header.borrow_mut() = t;
        let t = Self::read_into::<_, Mdl_Model>(
            &*_io,
            Some(self_rc._root.clone()),
            Some(self_rc._self.clone()),
        )?
        .into();
        *self_rc.model_data.borrow_mut() = t;
        Ok(())
    }
}
impl Mdl {
    pub fn texture_data(&self) -> KResult<Ref<OptRc<Mdl_TextureData>>> {
        let _io = self._io.borrow();
        let _rrc = self._root.get_value().borrow().upgrade();
        let _prc = self._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        if self.f_texture_data.get() {
            return Ok(self.texture_data.borrow());
        }
        if (((*_r.header().texture_count() as u32) > (0 as u32))
            && ((*_r.header().no_texture_id() as u8) == (0 as u8)))
        {
            let _pos = _io.pos();
            _io.seek(*_r.header().texture_header_offset() as usize)?;
            *self.texture_data_raw.borrow_mut() = _io.read_bytes_full()?.into();
            let texture_data_raw = self.texture_data_raw.borrow();
            let _t_texture_data_raw_io = BytesReader::from(texture_data_raw.clone());
            let t = Self::read_into::<BytesReader, Mdl_TextureData>(
                &_t_texture_data_raw_io,
                Some(self._root.clone()),
                Some(self._self.clone()),
            )?
            .into();
            *self.texture_data.borrow_mut() = t;
            _io.seek(_pos)?;
        }
        Ok(self.texture_data.borrow())
    }
}
impl Mdl {
    pub fn header(&self) -> Ref<OptRc<Mdl_FileHeader>> {
        self.header.borrow()
    }
}
impl Mdl {
    pub fn model_data(&self) -> Ref<OptRc<Mdl_Model>> {
        self.model_data.borrow()
    }
}
impl Mdl {
    pub fn _io(&self) -> Ref<BytesReader> {
        self._io.borrow()
    }
}
impl Mdl {
    pub fn header_raw(&self) -> Ref<Vec<u8>> {
        self.header_raw.borrow()
    }
}
impl Mdl {
    pub fn texture_data_raw(&self) -> Ref<Vec<u8>> {
        self.texture_data_raw.borrow()
    }
}

#[derive(Default, Debug, Clone)]
pub struct Mdl_Cluster {
    pub _root: SharedType<Mdl>,
    pub _parent: SharedType<Mdl_Model>,
    pub _self: SharedType<Self>,
    node_count: RefCell<u32>,
    offset: RefCell<u32>,
    _io: RefCell<BytesReader>,
    f_data: Cell<bool>,
    data: RefCell<OptRc<Mdl_ClusterDataList>>,
}
impl KStruct for Mdl_Cluster {
    type Root = Mdl;
    type Parent = Mdl_Model;

    fn read<S: KStream>(
        self_rc: &OptRc<Self>,
        _io: &S,
        _root: SharedType<Self::Root>,
        _parent: SharedType<Self::Parent>,
    ) -> KResult<()> {
        *self_rc._io.borrow_mut() = _io.clone();
        self_rc._root.set(_root.get());
        self_rc._parent.set(_parent.get());
        self_rc._self.set(Ok(self_rc.clone()));
        let _rrc = self_rc._root.get_value().borrow().upgrade();
        let _prc = self_rc._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        *self_rc.node_count.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.offset.borrow_mut() = _io.read_u4le()?.into();
        Ok(())
    }
}
impl Mdl_Cluster {
    pub fn data(&self) -> KResult<Ref<OptRc<Mdl_ClusterDataList>>> {
        let _io = self._io.borrow();
        let _rrc = self._root.get_value().borrow().upgrade();
        let _prc = self._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        if self.f_data.get() {
            return Ok(self.data.borrow());
        }
        let _pos = _io.pos();
        _io.seek(((*self.offset() as u32) + (64 as u32)) as usize)?;
        let t = Self::read_into::<_, Mdl_ClusterDataList>(
            &*_io,
            Some(self._root.clone()),
            Some(self._self.clone()),
        )?
        .into();
        *self.data.borrow_mut() = t;
        _io.seek(_pos)?;
        Ok(self.data.borrow())
    }
}
impl Mdl_Cluster {
    pub fn node_count(&self) -> Ref<u32> {
        self.node_count.borrow()
    }
}
impl Mdl_Cluster {
    pub fn offset(&self) -> Ref<u32> {
        self.offset.borrow()
    }
}
impl Mdl_Cluster {
    pub fn _io(&self) -> Ref<BytesReader> {
        self._io.borrow()
    }
}

#[derive(Default, Debug, Clone)]
pub struct Mdl_ClusterData {
    pub _root: SharedType<Mdl>,
    pub _parent: SharedType<Mdl_ClusterDataList>,
    pub _self: SharedType<Self>,
    vector: RefCell<OptRc<Mdl_S2Vector>>,
    vertex_index: RefCell<i16>,
    _io: RefCell<BytesReader>,
}
impl KStruct for Mdl_ClusterData {
    type Root = Mdl;
    type Parent = Mdl_ClusterDataList;

    fn read<S: KStream>(
        self_rc: &OptRc<Self>,
        _io: &S,
        _root: SharedType<Self::Root>,
        _parent: SharedType<Self::Parent>,
    ) -> KResult<()> {
        *self_rc._io.borrow_mut() = _io.clone();
        self_rc._root.set(_root.get());
        self_rc._parent.set(_parent.get());
        self_rc._self.set(Ok(self_rc.clone()));
        let _rrc = self_rc._root.get_value().borrow().upgrade();
        let _prc = self_rc._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        let t =
            Self::read_into::<_, Mdl_S2Vector>(&*_io, Some(self_rc._root.clone()), None)?.into();
        *self_rc.vector.borrow_mut() = t;
        *self_rc.vertex_index.borrow_mut() = _io.read_s2le()?.into();
        Ok(())
    }
}
impl Mdl_ClusterData {}
impl Mdl_ClusterData {
    pub fn vector(&self) -> Ref<OptRc<Mdl_S2Vector>> {
        self.vector.borrow()
    }
}
impl Mdl_ClusterData {
    pub fn vertex_index(&self) -> Ref<i16> {
        self.vertex_index.borrow()
    }
}
impl Mdl_ClusterData {
    pub fn _io(&self) -> Ref<BytesReader> {
        self._io.borrow()
    }
}

#[derive(Default, Debug, Clone)]
pub struct Mdl_ClusterDataList {
    pub _root: SharedType<Mdl>,
    pub _parent: SharedType<Mdl_Cluster>,
    pub _self: SharedType<Self>,
    vertices: RefCell<Vec<OptRc<Mdl_ClusterData>>>,
    alignment: RefCell<Vec<u8>>,
    normals: RefCell<Vec<OptRc<Mdl_ClusterData>>>,
    _io: RefCell<BytesReader>,
}
impl KStruct for Mdl_ClusterDataList {
    type Root = Mdl;
    type Parent = Mdl_Cluster;

    fn read<S: KStream>(
        self_rc: &OptRc<Self>,
        _io: &S,
        _root: SharedType<Self::Root>,
        _parent: SharedType<Self::Parent>,
    ) -> KResult<()> {
        *self_rc._io.borrow_mut() = _io.clone();
        self_rc._root.set(_root.get());
        self_rc._parent.set(_parent.get());
        self_rc._self.set(Ok(self_rc.clone()));
        let _rrc = self_rc._root.get_value().borrow().upgrade();
        let _prc = self_rc._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        *self_rc.vertices.borrow_mut() = Vec::new();
        let l_vertices = *_prc.as_ref().unwrap().node_count();
        for _i in 0..l_vertices {
            let t = Self::read_into::<_, Mdl_ClusterData>(
                &*_io,
                Some(self_rc._root.clone()),
                Some(self_rc._self.clone()),
            )?
            .into();
            self_rc.vertices.borrow_mut().push(t);
        }
        if ((modulo(_io.pos() as i64, 16 as i64) as i32) != (0 as i32)) {
            *self_rc.alignment.borrow_mut() = _io
                .read_bytes(((16 as i32) - (modulo(_io.pos() as i64, 16 as i64) as i32)) as usize)?
                .into();
        }
        if *_r.model_data().cluster_nodes_have_normals()? {
            *self_rc.normals.borrow_mut() = Vec::new();
            let l_normals = *_prc.as_ref().unwrap().node_count();
            for _i in 0..l_normals {
                let t = Self::read_into::<_, Mdl_ClusterData>(
                    &*_io,
                    Some(self_rc._root.clone()),
                    Some(self_rc._self.clone()),
                )?
                .into();
                self_rc.normals.borrow_mut().push(t);
            }
        }
        Ok(())
    }
}
impl Mdl_ClusterDataList {}
impl Mdl_ClusterDataList {
    pub fn vertices(&self) -> Ref<Vec<OptRc<Mdl_ClusterData>>> {
        self.vertices.borrow()
    }
}
impl Mdl_ClusterDataList {
    pub fn alignment(&self) -> Ref<Vec<u8>> {
        self.alignment.borrow()
    }
}
impl Mdl_ClusterDataList {
    pub fn normals(&self) -> Ref<Vec<OptRc<Mdl_ClusterData>>> {
        self.normals.borrow()
    }
}
impl Mdl_ClusterDataList {
    pub fn _io(&self) -> Ref<BytesReader> {
        self._io.borrow()
    }
}

/**
 * Unknown original IDs for all properties.
 */

#[derive(Default, Debug, Clone)]
pub struct Mdl_ClusterMapping {
    pub _root: SharedType<Mdl>,
    pub _parent: SharedType<Mdl_ClusterMaps>,
    pub _self: SharedType<Self>,
    source_start_index: RefCell<u16>,
    target_start_index: RefCell<u16>,
    count: RefCell<u16>,
    _io: RefCell<BytesReader>,
}
impl KStruct for Mdl_ClusterMapping {
    type Root = Mdl;
    type Parent = Mdl_ClusterMaps;

    fn read<S: KStream>(
        self_rc: &OptRc<Self>,
        _io: &S,
        _root: SharedType<Self::Root>,
        _parent: SharedType<Self::Parent>,
    ) -> KResult<()> {
        *self_rc._io.borrow_mut() = _io.clone();
        self_rc._root.set(_root.get());
        self_rc._parent.set(_parent.get());
        self_rc._self.set(Ok(self_rc.clone()));
        let _rrc = self_rc._root.get_value().borrow().upgrade();
        let _prc = self_rc._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        *self_rc.source_start_index.borrow_mut() = _io.read_u2le()?.into();
        *self_rc.target_start_index.borrow_mut() = _io.read_u2le()?.into();
        *self_rc.count.borrow_mut() = _io.read_u2le()?.into();
        Ok(())
    }
}
impl Mdl_ClusterMapping {}
impl Mdl_ClusterMapping {
    pub fn source_start_index(&self) -> Ref<u16> {
        self.source_start_index.borrow()
    }
}
impl Mdl_ClusterMapping {
    pub fn target_start_index(&self) -> Ref<u16> {
        self.target_start_index.borrow()
    }
}
impl Mdl_ClusterMapping {
    pub fn count(&self) -> Ref<u16> {
        self.count.borrow()
    }
}
impl Mdl_ClusterMapping {
    pub fn _io(&self) -> Ref<BytesReader> {
        self._io.borrow()
    }
}

#[derive(Default, Debug, Clone)]
pub struct Mdl_ClusterMaps {
    pub _root: SharedType<Mdl>,
    pub _parent: SharedType<Mdl_Model>,
    pub _self: SharedType<Self>,
    opaque: RefCell<Vec<OptRc<Mdl_ClusterMapping>>>,
    transparent: RefCell<Vec<OptRc<Mdl_ClusterMapping>>>,
    _io: RefCell<BytesReader>,
}
impl KStruct for Mdl_ClusterMaps {
    type Root = Mdl;
    type Parent = Mdl_Model;

    fn read<S: KStream>(
        self_rc: &OptRc<Self>,
        _io: &S,
        _root: SharedType<Self::Root>,
        _parent: SharedType<Self::Parent>,
    ) -> KResult<()> {
        *self_rc._io.borrow_mut() = _io.clone();
        self_rc._root.set(_root.get());
        self_rc._parent.set(_parent.get());
        self_rc._self.set(Ok(self_rc.clone()));
        let _rrc = self_rc._root.get_value().borrow().upgrade();
        let _prc = self_rc._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        *self_rc.opaque.borrow_mut() = Vec::new();
        let l_opaque = *_r.model_data().opaque_cluster_map_count();
        for _i in 0..l_opaque {
            let t = Self::read_into::<_, Mdl_ClusterMapping>(
                &*_io,
                Some(self_rc._root.clone()),
                Some(self_rc._self.clone()),
            )?
            .into();
            self_rc.opaque.borrow_mut().push(t);
        }
        *self_rc.transparent.borrow_mut() = Vec::new();
        let l_transparent = *_r.model_data().transparent_cluster_map_count();
        for _i in 0..l_transparent {
            let t = Self::read_into::<_, Mdl_ClusterMapping>(
                &*_io,
                Some(self_rc._root.clone()),
                Some(self_rc._self.clone()),
            )?
            .into();
            self_rc.transparent.borrow_mut().push(t);
        }
        Ok(())
    }
}
impl Mdl_ClusterMaps {}
impl Mdl_ClusterMaps {
    pub fn opaque(&self) -> Ref<Vec<OptRc<Mdl_ClusterMapping>>> {
        self.opaque.borrow()
    }
}
impl Mdl_ClusterMaps {
    pub fn transparent(&self) -> Ref<Vec<OptRc<Mdl_ClusterMapping>>> {
        self.transparent.borrow()
    }
}
impl Mdl_ClusterMaps {
    pub fn _io(&self) -> Ref<BytesReader> {
        self._io.borrow()
    }
}

#[derive(Default, Debug, Clone)]
pub struct Mdl_FileHeader {
    pub _root: SharedType<Mdl>,
    pub _parent: SharedType<Mdl>,
    pub _self: SharedType<Self>,
    no_texture_id: RefCell<u8>,
    padding: RefCell<Vec<u8>>,
    character_id: RefCell<u32>,
    texture_count: RefCell<u32>,
    texture_header_offset: RefCell<u32>,
    model_header_offset: RefCell<u32>,
    kg1_header_offset: RefCell<u32>,
    _io: RefCell<BytesReader>,
}
impl KStruct for Mdl_FileHeader {
    type Root = Mdl;
    type Parent = Mdl;

    fn read<S: KStream>(
        self_rc: &OptRc<Self>,
        _io: &S,
        _root: SharedType<Self::Root>,
        _parent: SharedType<Self::Parent>,
    ) -> KResult<()> {
        *self_rc._io.borrow_mut() = _io.clone();
        self_rc._root.set(_root.get());
        self_rc._parent.set(_parent.get());
        self_rc._self.set(Ok(self_rc.clone()));
        let _rrc = self_rc._root.get_value().borrow().upgrade();
        let _prc = self_rc._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        *self_rc.no_texture_id.borrow_mut() = _io.read_u1()?.into();
        *self_rc.padding.borrow_mut() = _io.read_bytes(3 as usize)?.into();
        *self_rc.character_id.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.texture_count.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.texture_header_offset.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.model_header_offset.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.kg1_header_offset.borrow_mut() = _io.read_u4le()?.into();
        Ok(())
    }
}
impl Mdl_FileHeader {}

/**
 * Indicates whether this model has a texture associated with it?
 * True for models with "notex" in the filename, e.g.
 * "hll_jms_notex.mdl".
 */
impl Mdl_FileHeader {
    pub fn no_texture_id(&self) -> Ref<u8> {
        self.no_texture_id.borrow()
    }
}
impl Mdl_FileHeader {
    pub fn padding(&self) -> Ref<Vec<u8>> {
        self.padding.borrow()
    }
}

/**
 * Internal ID used by the game engine for this model.
 */
impl Mdl_FileHeader {
    pub fn character_id(&self) -> Ref<u32> {
        self.character_id.borrow()
    }
}

/**
 * Number of textures in this model.
 */
impl Mdl_FileHeader {
    pub fn texture_count(&self) -> Ref<u32> {
        self.texture_count.borrow()
    }
}

/**
 * Absolute byte offset to the start of texture data.
 */
impl Mdl_FileHeader {
    pub fn texture_header_offset(&self) -> Ref<u32> {
        self.texture_header_offset.borrow()
    }
}

/**
 * Absolute byte offset to the start of general model data.
 */
impl Mdl_FileHeader {
    pub fn model_header_offset(&self) -> Ref<u32> {
        self.model_header_offset.borrow()
    }
}

/**
 * Absolute byte offset to the start of embedded shadow data.
 */
impl Mdl_FileHeader {
    pub fn kg1_header_offset(&self) -> Ref<u32> {
        self.kg1_header_offset.borrow()
    }
}
impl Mdl_FileHeader {
    pub fn _io(&self) -> Ref<BytesReader> {
        self._io.borrow()
    }
}

#[derive(Default, Debug, Clone)]
pub struct Mdl_Geometry {
    pub _root: SharedType<Mdl>,
    pub _parent: SharedType<Mdl_Model>,
    pub _self: SharedType<Self>,
    primitive_headers: RefCell<Vec<OptRc<Mdl_PrimitiveHeaderWrapper>>>,
    triangle_indices: RefCell<OptRc<Mdl_IndexList>>,
    _io: RefCell<BytesReader>,
    triangle_indices_raw: RefCell<Vec<u8>>,
    transparent_triangle_indices_raw: RefCell<Vec<u8>>,
    f_transparent_primitive_headers: Cell<bool>,
    transparent_primitive_headers: RefCell<Vec<OptRc<Mdl_TransparentPrimitiveHeaderWrapper>>>,
    f_transparent_triangle_indices: Cell<bool>,
    transparent_triangle_indices: RefCell<OptRc<Mdl_IndexList>>,
    f_transparent_vertex_list: Cell<bool>,
    transparent_vertex_list: RefCell<Vec<OptRc<Mdl_TransparentVertexData>>>,
    f_vertex_list: Cell<bool>,
    vertex_list: RefCell<Vec<OptRc<Mdl_VertexData>>>,
}
impl KStruct for Mdl_Geometry {
    type Root = Mdl;
    type Parent = Mdl_Model;

    fn read<S: KStream>(
        self_rc: &OptRc<Self>,
        _io: &S,
        _root: SharedType<Self::Root>,
        _parent: SharedType<Self::Parent>,
    ) -> KResult<()> {
        *self_rc._io.borrow_mut() = _io.clone();
        self_rc._root.set(_root.get());
        self_rc._parent.set(_parent.get());
        self_rc._self.set(Ok(self_rc.clone()));
        let _rrc = self_rc._root.get_value().borrow().upgrade();
        let _prc = self_rc._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        *self_rc.primitive_headers.borrow_mut() = Vec::new();
        let l_primitive_headers = *_r.model_data().primitive_headers_count();
        for _i in 0..l_primitive_headers {
            let t = Self::read_into::<_, Mdl_PrimitiveHeaderWrapper>(
                &*_io,
                Some(self_rc._root.clone()),
                Some(self_rc._self.clone()),
            )?
            .into();
            self_rc.primitive_headers.borrow_mut().push(t);
        }
        *self_rc.triangle_indices_raw.borrow_mut() = _io
            .read_bytes(
                ((if *_r.model_data().vertex_data_offset()
                    > *_r.model_data().transparent_primitive_headers_offset()
                {
                    *_r.model_data().transparent_primitive_headers_offset()
                } else {
                    *_r.model_data().vertex_data_offset()
                } as u32)
                    - (*_r.model_data().triangle_index_offset() as u32)) as usize,
            )?
            .into();
        let triangle_indices_raw = self_rc.triangle_indices_raw.borrow();
        let _t_triangle_indices_raw_io = BytesReader::from(triangle_indices_raw.clone());
        let t = Self::read_into::<BytesReader, Mdl_IndexList>(
            &_t_triangle_indices_raw_io,
            Some(self_rc._root.clone()),
            None,
        )?
        .into();
        *self_rc.triangle_indices.borrow_mut() = t;
        Ok(())
    }
}
impl Mdl_Geometry {
    pub fn transparent_primitive_headers(
        &self,
    ) -> KResult<Ref<Vec<OptRc<Mdl_TransparentPrimitiveHeaderWrapper>>>> {
        let _io = self._io.borrow();
        let _rrc = self._root.get_value().borrow().upgrade();
        let _prc = self._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        if self.f_transparent_primitive_headers.get() {
            return Ok(self.transparent_primitive_headers.borrow());
        }
        self.f_transparent_primitive_headers.set(true);
        if ((*_r.model_data().transparent_primitive_headers_count() as u32) > (0 as u32)) {
            let _pos = _io.pos();
            _io.seek(
                ((*_r.model_data().transparent_primitive_headers_offset() as u32) + (64 as u32))
                    as usize,
            )?;
            *self.transparent_primitive_headers.borrow_mut() = Vec::new();
            let l_transparent_primitive_headers =
                *_r.model_data().transparent_primitive_headers_count();
            for _i in 0..l_transparent_primitive_headers {
                let t = Self::read_into::<_, Mdl_TransparentPrimitiveHeaderWrapper>(
                    &*_io,
                    Some(self._root.clone()),
                    Some(self._self.clone()),
                )?
                .into();
                self.transparent_primitive_headers.borrow_mut().push(t);
            }
            _io.seek(_pos)?;
        }
        Ok(self.transparent_primitive_headers.borrow())
    }

    /**
     * List of vertex indices, which represent triangle strips.
     */
    pub fn transparent_triangle_indices(&self) -> KResult<Ref<OptRc<Mdl_IndexList>>> {
        let _io = self._io.borrow();
        let _rrc = self._root.get_value().borrow().upgrade();
        let _prc = self._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        if self.f_transparent_triangle_indices.get() {
            return Ok(self.transparent_triangle_indices.borrow());
        }
        if ((*_r.model_data().transparent_primitive_headers_count() as u32) > (0 as u32)) {
            let _pos = _io.pos();
            _io.seek(
                ((*_r.model_data().transparent_triangle_index_offset() as u32) + (64 as u32))
                    as usize,
            )?;
            *self.transparent_triangle_indices_raw.borrow_mut() = _io
                .read_bytes(
                    ((*_r.model_data().transparent_vertex_data_offset() as u32)
                        - (*_r.model_data().transparent_triangle_index_offset() as u32))
                        as usize,
                )?
                .into();
            let transparent_triangle_indices_raw = self.transparent_triangle_indices_raw.borrow();
            let _t_transparent_triangle_indices_raw_io =
                BytesReader::from(transparent_triangle_indices_raw.clone());
            let t = Self::read_into::<BytesReader, Mdl_IndexList>(
                &_t_transparent_triangle_indices_raw_io,
                Some(self._root.clone()),
                None,
            )?
            .into();
            *self.transparent_triangle_indices.borrow_mut() = t;
            _io.seek(_pos)?;
        }
        Ok(self.transparent_triangle_indices.borrow())
    }
    pub fn transparent_vertex_list(&self) -> KResult<Ref<Vec<OptRc<Mdl_TransparentVertexData>>>> {
        let _io = self._io.borrow();
        let _rrc = self._root.get_value().borrow().upgrade();
        let _prc = self._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        if self.f_transparent_vertex_list.get() {
            return Ok(self.transparent_vertex_list.borrow());
        }
        self.f_transparent_vertex_list.set(true);
        if ((*_r.model_data().transparent_primitive_headers_count() as u32) > (0 as u32)) {
            let _pos = _io.pos();
            _io.seek(
                ((*_r.model_data().transparent_vertex_data_offset() as u32) + (64 as u32)) as usize,
            )?;
            *self.transparent_vertex_list.borrow_mut() = Vec::new();
            let l_transparent_vertex_list = *_r.model_data().transparent_vertex_count();
            for _i in 0..l_transparent_vertex_list {
                let t = Self::read_into::<_, Mdl_TransparentVertexData>(
                    &*_io,
                    Some(self._root.clone()),
                    Some(self._self.clone()),
                )?
                .into();
                self.transparent_vertex_list.borrow_mut().push(t);
            }
            _io.seek(_pos)?;
        }
        Ok(self.transparent_vertex_list.borrow())
    }
    pub fn vertex_list(&self) -> KResult<Ref<Vec<OptRc<Mdl_VertexData>>>> {
        let _io = self._io.borrow();
        let _rrc = self._root.get_value().borrow().upgrade();
        let _prc = self._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        if self.f_vertex_list.get() {
            return Ok(self.vertex_list.borrow());
        }
        self.f_vertex_list.set(true);
        let _pos = _io.pos();
        _io.seek(((*_r.model_data().vertex_data_offset() as u32) + (64 as u32)) as usize)?;
        *self.vertex_list.borrow_mut() = Vec::new();
        let l_vertex_list = *_r.model_data().vertex_count();
        for _i in 0..l_vertex_list {
            let t = Self::read_into::<_, Mdl_VertexData>(
                &*_io,
                Some(self._root.clone()),
                Some(self._self.clone()),
            )?
            .into();
            self.vertex_list.borrow_mut().push(t);
        }
        _io.seek(_pos)?;
        Ok(self.vertex_list.borrow())
    }
}
impl Mdl_Geometry {
    pub fn primitive_headers(&self) -> Ref<Vec<OptRc<Mdl_PrimitiveHeaderWrapper>>> {
        self.primitive_headers.borrow()
    }
}

/**
 * List of vertex indices, which represent triangle strips.
 */
impl Mdl_Geometry {
    pub fn triangle_indices(&self) -> Ref<OptRc<Mdl_IndexList>> {
        self.triangle_indices.borrow()
    }
}
impl Mdl_Geometry {
    pub fn _io(&self) -> Ref<BytesReader> {
        self._io.borrow()
    }
}
impl Mdl_Geometry {
    pub fn triangle_indices_raw(&self) -> Ref<Vec<u8>> {
        self.triangle_indices_raw.borrow()
    }
}
impl Mdl_Geometry {
    pub fn transparent_triangle_indices_raw(&self) -> Ref<Vec<u8>> {
        self.transparent_triangle_indices_raw.borrow()
    }
}

#[derive(Default, Debug, Clone)]
pub struct Mdl_IndexList {
    pub _root: SharedType<Mdl>,
    pub _parent: SharedType<KStructUnit>,
    pub _self: SharedType<Self>,
    array: RefCell<Vec<u16>>,
    _io: RefCell<BytesReader>,
}
impl KStruct for Mdl_IndexList {
    type Root = Mdl;
    type Parent = KStructUnit;

    fn read<S: KStream>(
        self_rc: &OptRc<Self>,
        _io: &S,
        _root: SharedType<Self::Root>,
        _parent: SharedType<Self::Parent>,
    ) -> KResult<()> {
        *self_rc._io.borrow_mut() = _io.clone();
        self_rc._root.set(_root.get());
        self_rc._parent.set(_parent.get());
        self_rc._self.set(Ok(self_rc.clone()));
        let _rrc = self_rc._root.get_value().borrow().upgrade();
        let _prc = self_rc._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        *self_rc.array.borrow_mut() = Vec::new();
        {
            let mut _i = 0;
            while !_io.is_eof() {
                self_rc.array.borrow_mut().push(_io.read_u2le()?.into());
                _i += 1;
            }
        }
        Ok(())
    }
}
impl Mdl_IndexList {}
impl Mdl_IndexList {
    pub fn array(&self) -> Ref<Vec<u16>> {
        self.array.borrow()
    }
}
impl Mdl_IndexList {
    pub fn _io(&self) -> Ref<BytesReader> {
        self._io.borrow()
    }
}

/**
 * Model container. All offsets are relative to the start of this header.
 */

#[derive(Default, Debug, Clone)]
pub struct Mdl_Model {
    pub _root: SharedType<Mdl>,
    pub _parent: SharedType<Mdl>,
    pub _self: SharedType<Self>,
    magic: RefCell<Vec<u8>>,
    model_version: RefCell<u32>,
    initial_matrices_offset: RefCell<u32>,
    bone_count: RefCell<u32>,
    skeleton_data_offset: RefCell<u32>,
    bone_pairs_count: RefCell<u32>,
    bone_pairs_offset: RefCell<u32>,
    default_pcms_offset: RefCell<u32>,
    primitive_headers_count: RefCell<u32>,
    primitive_headers_offset: RefCell<u32>,
    transparent_primitive_headers_count: RefCell<u32>,
    transparent_primitive_headers_offset: RefCell<u32>,
    texture_blocks_count: RefCell<u32>,
    texture_blocks_offset: RefCell<u32>,
    texture_id_count: RefCell<u32>,
    texture_id_offset: RefCell<u32>,
    junk_padding_offset: RefCell<u32>,
    cluster_node_count: RefCell<u32>,
    cluster_node_offset: RefCell<u32>,
    cluster_count: RefCell<u32>,
    cluster_offset: RefCell<u32>,
    func_data_count: RefCell<u32>,
    func_data_offset: RefCell<u32>,
    hit_offset: RefCell<u32>,
    box_offset: RefCell<u32>,
    flag: RefCell<u32>,
    relative_matrices_offset: RefCell<u32>,
    relative_trans_offset: RefCell<u32>,
    reserved: RefCell<Vec<u8>>,
    vertex_count: RefCell<u32>,
    vertex_data_offset: RefCell<u32>,
    transparent_vertex_count: RefCell<u32>,
    transparent_vertex_data_offset: RefCell<u32>,
    triangle_index_offset: RefCell<u32>,
    transparent_triangle_index_offset: RefCell<u32>,
    opaque_cluster_map_count: RefCell<u32>,
    transparent_cluster_map_count: RefCell<u32>,
    cluster_map_offset: RefCell<u32>,
    pad0: RefCell<Vec<u8>>,
    initial_matrices: RefCell<Vec<OptRc<Mdl_TransformationMatrix>>>,
    skeleton_tree: RefCell<Vec<u8>>,
    pad1: RefCell<Vec<u8>>,
    bone_pairs: RefCell<Vec<OptRc<Mdl_SkeletonPair>>>,
    pad2: RefCell<Vec<u8>>,
    default_pcms_matrices: RefCell<Vec<OptRc<Mdl_TransformationMatrix>>>,
    texture_metadata: RefCell<OptRc<Mdl_TextureMetadata>>,
    _io: RefCell<BytesReader>,
    f_cluster_maps: Cell<bool>,
    cluster_maps: RefCell<OptRc<Mdl_ClusterMaps>>,
    f_cluster_node_normals: Cell<bool>,
    cluster_node_normals: RefCell<Vec<OptRc<Mdl_S2Vector>>>,
    f_cluster_node_normals_offset: Cell<bool>,
    cluster_node_normals_offset: RefCell<i32>,
    f_cluster_node_padding_amount: Cell<bool>,
    cluster_node_padding_amount: RefCell<i32>,
    f_cluster_nodes: Cell<bool>,
    cluster_nodes: RefCell<Vec<OptRc<Mdl_S2Vector>>>,
    f_cluster_nodes_have_normals: Cell<bool>,
    cluster_nodes_have_normals: RefCell<bool>,
    f_clusters: Cell<bool>,
    clusters: RefCell<Vec<OptRc<Mdl_Cluster>>>,
    f_geometry: Cell<bool>,
    geometry: RefCell<OptRc<Mdl_Geometry>>,
    f_junk_padding: Cell<bool>,
    junk_padding: RefCell<Vec<u8>>,
}
impl KStruct for Mdl_Model {
    type Root = Mdl;
    type Parent = Mdl;

    fn read<S: KStream>(
        self_rc: &OptRc<Self>,
        _io: &S,
        _root: SharedType<Self::Root>,
        _parent: SharedType<Self::Parent>,
    ) -> KResult<()> {
        *self_rc._io.borrow_mut() = _io.clone();
        self_rc._root.set(_root.get());
        self_rc._parent.set(_parent.get());
        self_rc._self.set(Ok(self_rc.clone()));
        let _rrc = self_rc._root.get_value().borrow().upgrade();
        let _prc = self_rc._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        *self_rc.magic.borrow_mut() = _io.read_bytes(4 as usize)?.into();
        if !(*self_rc.magic() == vec![0x3u8, 0x0u8, 0xffu8, 0xffu8]) {
            return Err(KError::ValidationFailed(ValidationFailedError {
                kind: ValidationKind::NotEqual,
                src_path: "/types/model/seq/0".to_string(),
            }));
        }
        *self_rc.model_version.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.initial_matrices_offset.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.bone_count.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.skeleton_data_offset.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.bone_pairs_count.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.bone_pairs_offset.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.default_pcms_offset.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.primitive_headers_count.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.primitive_headers_offset.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.transparent_primitive_headers_count.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.transparent_primitive_headers_offset.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.texture_blocks_count.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.texture_blocks_offset.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.texture_id_count.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.texture_id_offset.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.junk_padding_offset.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.cluster_node_count.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.cluster_node_offset.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.cluster_count.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.cluster_offset.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.func_data_count.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.func_data_offset.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.hit_offset.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.box_offset.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.flag.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.relative_matrices_offset.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.relative_trans_offset.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.reserved.borrow_mut() = _io.read_bytes(16 as usize)?.into();
        *self_rc.vertex_count.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.vertex_data_offset.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.transparent_vertex_count.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.transparent_vertex_data_offset.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.triangle_index_offset.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.transparent_triangle_index_offset.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.opaque_cluster_map_count.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.transparent_cluster_map_count.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.cluster_map_offset.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.pad0.borrow_mut() = _io.read_bytes(12 as usize)?.into();
        *self_rc.initial_matrices.borrow_mut() = Vec::new();
        let l_initial_matrices = *self_rc.bone_count();
        for _i in 0..l_initial_matrices {
            let t = Self::read_into::<_, Mdl_TransformationMatrix>(
                &*_io,
                Some(self_rc._root.clone()),
                Some(self_rc._self.clone()),
            )?
            .into();
            self_rc.initial_matrices.borrow_mut().push(t);
        }
        *self_rc.skeleton_tree.borrow_mut() = Vec::new();
        let l_skeleton_tree = *self_rc.bone_count();
        for _i in 0..l_skeleton_tree {
            self_rc
                .skeleton_tree
                .borrow_mut()
                .push(_io.read_u1()?.into());
        }
        if ((((*self_rc.bone_count() as u32) % (16 as u32)) as i32) > (0 as i32)) {
            *self_rc.pad1.borrow_mut() = Vec::new();
            let l_pad1 = ((16 as i32) - (((*self_rc.bone_count() as u32) % (16 as u32)) as i32));
            for _i in 0..l_pad1 {
                self_rc.pad1.borrow_mut().push(_io.read_u1()?.into());
            }
        }
        *self_rc.bone_pairs.borrow_mut() = Vec::new();
        let l_bone_pairs = *self_rc.bone_pairs_count();
        for _i in 0..l_bone_pairs {
            let t = Self::read_into::<_, Mdl_SkeletonPair>(
                &*_io,
                Some(self_rc._root.clone()),
                Some(self_rc._self.clone()),
            )?
            .into();
            self_rc.bone_pairs.borrow_mut().push(t);
        }
        if ((modulo(
            ((2 as u32) * (*self_rc.bone_pairs_count() as u32)) as i64,
            16 as i64,
        ) as i32)
            > (0 as i32))
        {
            *self_rc.pad2.borrow_mut() = Vec::new();
            let l_pad2 = ((16 as i32)
                - (modulo(
                    ((2 as u32) * (*self_rc.bone_pairs_count() as u32)) as i64,
                    16 as i64,
                ) as i32));
            for _i in 0..l_pad2 {
                self_rc.pad2.borrow_mut().push(_io.read_u1()?.into());
            }
        }
        *self_rc.default_pcms_matrices.borrow_mut() = Vec::new();
        let l_default_pcms_matrices = *self_rc.bone_pairs_count();
        for _i in 0..l_default_pcms_matrices {
            let t = Self::read_into::<_, Mdl_TransformationMatrix>(
                &*_io,
                Some(self_rc._root.clone()),
                Some(self_rc._self.clone()),
            )?
            .into();
            self_rc.default_pcms_matrices.borrow_mut().push(t);
        }
        if ((*_r.header().texture_count() as u32) > (0 as u32)) {
            let t = Self::read_into::<_, Mdl_TextureMetadata>(
                &*_io,
                Some(self_rc._root.clone()),
                Some(self_rc._self.clone()),
            )?
            .into();
            *self_rc.texture_metadata.borrow_mut() = t;
        }
        Ok(())
    }
}
impl Mdl_Model {
    /**
     * Unknown original name.
     */
    pub fn cluster_maps(&self) -> KResult<Ref<OptRc<Mdl_ClusterMaps>>> {
        let _io = self._io.borrow();
        let _rrc = self._root.get_value().borrow().upgrade();
        let _prc = self._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        if self.f_cluster_maps.get() {
            return Ok(self.cluster_maps.borrow());
        }
        let _pos = _io.pos();
        _io.seek(((*self.cluster_map_offset() as u32) + (64 as u32)) as usize)?;
        let t = Self::read_into::<_, Mdl_ClusterMaps>(
            &*_io,
            Some(self._root.clone()),
            Some(self._self.clone()),
        )?
        .into();
        *self.cluster_maps.borrow_mut() = t;
        _io.seek(_pos)?;
        Ok(self.cluster_maps.borrow())
    }
    pub fn cluster_node_normals(&self) -> KResult<Ref<Vec<OptRc<Mdl_S2Vector>>>> {
        let _io = self._io.borrow();
        let _rrc = self._root.get_value().borrow().upgrade();
        let _prc = self._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        if self.f_cluster_node_normals.get() {
            return Ok(self.cluster_node_normals.borrow());
        }
        self.f_cluster_node_normals.set(true);
        if *self.cluster_nodes_have_normals()? {
            let _pos = _io.pos();
            _io.seek(
                ((((((*self.cluster_node_offset() as i32)
                    + (((*self.cluster_node_count() as u32) * (6 as u32)) as i32))
                    as i32)
                    + (64 as i32)) as i32)
                    + (*self.cluster_node_padding_amount()? as i32)) as usize,
            )?;
            *self.cluster_node_normals.borrow_mut() = Vec::new();
            let l_cluster_node_normals = *self.cluster_node_count();
            for _i in 0..l_cluster_node_normals {
                let t = Self::read_into::<_, Mdl_S2Vector>(&*_io, Some(self._root.clone()), None)?
                    .into();
                self.cluster_node_normals.borrow_mut().push(t);
            }
            _io.seek(_pos)?;
        }
        Ok(self.cluster_node_normals.borrow())
    }

    /**
     * This is a helper, not part of the original mdl structure.
     */
    pub fn cluster_node_normals_offset(&self) -> KResult<Ref<i32>> {
        let _io = self._io.borrow();
        let _rrc = self._root.get_value().borrow().upgrade();
        let _prc = self._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        if self.f_cluster_node_normals_offset.get() {
            return Ok(self.cluster_node_normals_offset.borrow());
        }
        self.f_cluster_node_normals_offset.set(true);
        *self.cluster_node_normals_offset.borrow_mut() = ((((((*self.cluster_node_offset() as i32)
            + (((*self.cluster_node_count() as u32) * (6 as u32)) as i32))
            as i32)
            + (64 as i32)) as i32)
            + (*self.cluster_node_padding_amount()? as i32))
            as i32;
        Ok(self.cluster_node_normals_offset.borrow())
    }

    /**
     * This is a helper, not part of the original mdl structure.
     */
    pub fn cluster_node_padding_amount(&self) -> KResult<Ref<i32>> {
        let _io = self._io.borrow();
        let _rrc = self._root.get_value().borrow().upgrade();
        let _prc = self._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        if self.f_cluster_node_padding_amount.get() {
            return Ok(self.cluster_node_padding_amount.borrow());
        }
        self.f_cluster_node_padding_amount.set(true);
        *self.cluster_node_padding_amount.borrow_mut() =
            (if ((((*self.cluster_node_count() as u32) % (8 as u32)) as i32) != (0 as i32)) {
                ((16 as i32)
                    - (modulo(
                        ((*self.cluster_node_count() as u32) * (6 as u32)) as i64,
                        16 as i64,
                    ) as i32))
            } else {
                0
            }) as i32;
        Ok(self.cluster_node_padding_amount.borrow())
    }

    /**
     * Morph targets for facial animation.
     */
    pub fn cluster_nodes(&self) -> KResult<Ref<Vec<OptRc<Mdl_S2Vector>>>> {
        let _io = self._io.borrow();
        let _rrc = self._root.get_value().borrow().upgrade();
        let _prc = self._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        if self.f_cluster_nodes.get() {
            return Ok(self.cluster_nodes.borrow());
        }
        self.f_cluster_nodes.set(true);
        if ((*self.cluster_node_count() as u32) > (0 as u32)) {
            let _pos = _io.pos();
            _io.seek(((*self.cluster_node_offset() as u32) + (64 as u32)) as usize)?;
            *self.cluster_nodes.borrow_mut() = Vec::new();
            let l_cluster_nodes = *self.cluster_node_count();
            for _i in 0..l_cluster_nodes {
                let t = Self::read_into::<_, Mdl_S2Vector>(&*_io, Some(self._root.clone()), None)?
                    .into();
                self.cluster_nodes.borrow_mut().push(t);
            }
            _io.seek(_pos)?;
        }
        Ok(self.cluster_nodes.borrow())
    }

    /**
     * This is a helper, not part of the original mdl structure.
     */
    pub fn cluster_nodes_have_normals(&self) -> KResult<Ref<bool>> {
        let _io = self._io.borrow();
        let _rrc = self._root.get_value().borrow().upgrade();
        let _prc = self._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        if self.f_cluster_nodes_have_normals.get() {
            return Ok(self.cluster_nodes_have_normals.borrow());
        }
        self.f_cluster_nodes_have_normals.set(true);
        *self.cluster_nodes_have_normals.borrow_mut() = (((((((*self.cluster_node_offset() as i32)
            + (((*self.cluster_node_count() as u32) * (6 as u32)) as i32))
            as i32)
            + (64 as i32)) as i32)
            + (*self.cluster_node_padding_amount()? as i32))
            != ((*self.cluster_offset() as u32) + (64 as u32))
                .try_into()
                .unwrap()) as bool;
        Ok(self.cluster_nodes_have_normals.borrow())
    }
    pub fn clusters(&self) -> KResult<Ref<Vec<OptRc<Mdl_Cluster>>>> {
        let _io = self._io.borrow();
        let _rrc = self._root.get_value().borrow().upgrade();
        let _prc = self._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        if self.f_clusters.get() {
            return Ok(self.clusters.borrow());
        }
        self.f_clusters.set(true);
        if ((*self.cluster_count() as u32) > (0 as u32)) {
            let _pos = _io.pos();
            _io.seek(((*self.cluster_offset() as u32) + (64 as u32)) as usize)?;
            *self.clusters.borrow_mut() = Vec::new();
            let l_clusters = *self.cluster_count();
            for _i in 0..l_clusters {
                let t = Self::read_into::<_, Mdl_Cluster>(
                    &*_io,
                    Some(self._root.clone()),
                    Some(self._self.clone()),
                )?
                .into();
                self.clusters.borrow_mut().push(t);
            }
            _io.seek(_pos)?;
        }
        Ok(self.clusters.borrow())
    }

    /**
     * The start of the geometry data.
     */
    pub fn geometry(&self) -> KResult<Ref<OptRc<Mdl_Geometry>>> {
        let _io = self._io.borrow();
        let _rrc = self._root.get_value().borrow().upgrade();
        let _prc = self._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        if self.f_geometry.get() {
            return Ok(self.geometry.borrow());
        }
        let _pos = _io.pos();
        _io.seek(((*self.primitive_headers_offset() as u32) + (64 as u32)) as usize)?;
        let t = Self::read_into::<_, Mdl_Geometry>(
            &*_io,
            Some(self._root.clone()),
            Some(self._self.clone()),
        )?
        .into();
        *self.geometry.borrow_mut() = t;
        _io.seek(_pos)?;
        Ok(self.geometry.borrow())
    }
    pub fn junk_padding(&self) -> KResult<Ref<Vec<u8>>> {
        let _io = self._io.borrow();
        let _rrc = self._root.get_value().borrow().upgrade();
        let _prc = self._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        if self.f_junk_padding.get() {
            return Ok(self.junk_padding.borrow());
        }
        self.f_junk_padding.set(true);
        let _pos = _io.pos();
        _io.seek(((*self.junk_padding_offset() as u32) + (64 as u32)) as usize)?;
        *self.junk_padding.borrow_mut() = _io
            .read_bytes(
                ((*self.cluster_node_offset() as u32) - (*self.junk_padding_offset() as u32))
                    as usize,
            )?
            .into();
        _io.seek(_pos)?;
        Ok(self.junk_padding.borrow())
    }
}

/**
 * And that's a magic number! It's 0x03 0x00 0xff 0xff.
 */
impl Mdl_Model {
    pub fn magic(&self) -> Ref<Vec<u8>> {
        self.magic.borrow()
    }
}
impl Mdl_Model {
    pub fn model_version(&self) -> Ref<u32> {
        self.model_version.borrow()
    }
}

/**
 * Offset to initial bone matrices in model space.
 */
impl Mdl_Model {
    pub fn initial_matrices_offset(&self) -> Ref<u32> {
        self.initial_matrices_offset.borrow()
    }
}

/**
 * Number of bones.
 */
impl Mdl_Model {
    pub fn bone_count(&self) -> Ref<u32> {
        self.bone_count.borrow()
    }
}

/**
 * Offset to skeleton data.
 */
impl Mdl_Model {
    pub fn skeleton_data_offset(&self) -> Ref<u32> {
        self.skeleton_data_offset.borrow()
    }
}

/**
 * Number of bone pairs (for linear blend skinning).
 */
impl Mdl_Model {
    pub fn bone_pairs_count(&self) -> Ref<u32> {
        self.bone_pairs_count.borrow()
    }
}

/**
 * Offset to bone pairs, specified in pairs of bytes.
 */
impl Mdl_Model {
    pub fn bone_pairs_offset(&self) -> Ref<u32> {
        self.bone_pairs_offset.borrow()
    }
}

/**
 * Offset to default parent-child matrices for bone pairs.
 */
impl Mdl_Model {
    pub fn default_pcms_offset(&self) -> Ref<u32> {
        self.default_pcms_offset.borrow()
    }
}

/**
 * Number of disjoint primitives.
 */
impl Mdl_Model {
    pub fn primitive_headers_count(&self) -> Ref<u32> {
        self.primitive_headers_count.borrow()
    }
}

/**
 * Offset to headers describing each primitive.
 */
impl Mdl_Model {
    pub fn primitive_headers_offset(&self) -> Ref<u32> {
        self.primitive_headers_offset.borrow()
    }
}

/**
 * Number of transparent primitive headers, used for separate parts such
 * as hair? On the PS2 version, this field is called "n_vu0_parts",
 * suggesting that these were handled by the VU0 coprocessor, while
 * the opaque primitive headers were handled by the VU1 coprocessor.
 */
impl Mdl_Model {
    pub fn transparent_primitive_headers_count(&self) -> Ref<u32> {
        self.transparent_primitive_headers_count.borrow()
    }
}

/**
 * Offset to transparent primitive headers, used for separate parts such
 * as hair? On the PS2 version, this field is called "n_vu0_parts",
 * suggesting that these were handled by the VU0 coprocessor, while
 * the opaque primitive headers were handled by the VU1 coprocessor.
 */
impl Mdl_Model {
    pub fn transparent_primitive_headers_offset(&self) -> Ref<u32> {
        self.transparent_primitive_headers_offset.borrow()
    }
}

/**
 * Number of texture blocks.
 */
impl Mdl_Model {
    pub fn texture_blocks_count(&self) -> Ref<u32> {
        self.texture_blocks_count.borrow()
    }
}

/**
 * Offset to the texture blocks.
 */
impl Mdl_Model {
    pub fn texture_blocks_offset(&self) -> Ref<u32> {
        self.texture_blocks_offset.borrow()
    }
}

/**
 * Number of unique texture IDs used by the game engine.
 */
impl Mdl_Model {
    pub fn texture_id_count(&self) -> Ref<u32> {
        self.texture_id_count.borrow()
    }
}

/**
 * Offset to texture ID data.
 */
impl Mdl_Model {
    pub fn texture_id_offset(&self) -> Ref<u32> {
        self.texture_id_offset.borrow()
    }
}

/**
 * Offset to a sequence of copied bytes used to pad out the file in the
 * PC version. It starts copying from the start of this header until it
 * reaches the cluster node data. On the PS2 version, this space is used
 * for a block called "texture_id_params".
 */
impl Mdl_Model {
    pub fn junk_padding_offset(&self) -> Ref<u32> {
        self.junk_padding_offset.borrow()
    }
}

/**
 * Number of cluster nodes for this object. Purpose unknown.
 */
impl Mdl_Model {
    pub fn cluster_node_count(&self) -> Ref<u32> {
        self.cluster_node_count.borrow()
    }
}

/**
 * Offset to cluster node data for this object. Purpose unknown.
 */
impl Mdl_Model {
    pub fn cluster_node_offset(&self) -> Ref<u32> {
        self.cluster_node_offset.borrow()
    }
}

/**
 * Number of clusters for this object. Purpose unknown.
 */
impl Mdl_Model {
    pub fn cluster_count(&self) -> Ref<u32> {
        self.cluster_count.borrow()
    }
}

/**
 * Offset to func_data for this object. Purpose unknown.
 */
impl Mdl_Model {
    pub fn cluster_offset(&self) -> Ref<u32> {
        self.cluster_offset.borrow()
    }
}

/**
 * Unknown count.
 */
impl Mdl_Model {
    pub fn func_data_count(&self) -> Ref<u32> {
        self.func_data_count.borrow()
    }
}

/**
 * Unknown offset.
 */
impl Mdl_Model {
    pub fn func_data_offset(&self) -> Ref<u32> {
        self.func_data_offset.borrow()
    }
}

/**
 * Unknown offset.
 */
impl Mdl_Model {
    pub fn hit_offset(&self) -> Ref<u32> {
        self.hit_offset.borrow()
    }
}

/**
 * Unknown offset.
 */
impl Mdl_Model {
    pub fn box_offset(&self) -> Ref<u32> {
        self.box_offset.borrow()
    }
}

/**
 * Unknown flag.
 */
impl Mdl_Model {
    pub fn flag(&self) -> Ref<u32> {
        self.flag.borrow()
    }
}

/**
 * Unknown offset.
 */
impl Mdl_Model {
    pub fn relative_matrices_offset(&self) -> Ref<u32> {
        self.relative_matrices_offset.borrow()
    }
}

/**
 * Unknown offset.
 */
impl Mdl_Model {
    pub fn relative_trans_offset(&self) -> Ref<u32> {
        self.relative_trans_offset.borrow()
    }
}
impl Mdl_Model {
    pub fn reserved(&self) -> Ref<Vec<u8>> {
        self.reserved.borrow()
    }
}

/**
 * Number of vertices.
 */
impl Mdl_Model {
    pub fn vertex_count(&self) -> Ref<u32> {
        self.vertex_count.borrow()
    }
}

/**
 * Offset to vertex data.
 */
impl Mdl_Model {
    pub fn vertex_data_offset(&self) -> Ref<u32> {
        self.vertex_data_offset.borrow()
    }
}

/**
 * Number of transparent vertices.
 */
impl Mdl_Model {
    pub fn transparent_vertex_count(&self) -> Ref<u32> {
        self.transparent_vertex_count.borrow()
    }
}

/**
 * Offset to transparent vertex data.
 */
impl Mdl_Model {
    pub fn transparent_vertex_data_offset(&self) -> Ref<u32> {
        self.transparent_vertex_data_offset.borrow()
    }
}

/**
 * Offset to triangle index data.
 */
impl Mdl_Model {
    pub fn triangle_index_offset(&self) -> Ref<u32> {
        self.triangle_index_offset.borrow()
    }
}

/**
 * Offset to transparent triangle index data.
 */
impl Mdl_Model {
    pub fn transparent_triangle_index_offset(&self) -> Ref<u32> {
        self.transparent_triangle_index_offset.borrow()
    }
}

/**
 * Unknown original name.
 */
impl Mdl_Model {
    pub fn opaque_cluster_map_count(&self) -> Ref<u32> {
        self.opaque_cluster_map_count.borrow()
    }
}

/**
 * Unknown original name.
 */
impl Mdl_Model {
    pub fn transparent_cluster_map_count(&self) -> Ref<u32> {
        self.transparent_cluster_map_count.borrow()
    }
}

/**
 * Unknown original name.
 */
impl Mdl_Model {
    pub fn cluster_map_offset(&self) -> Ref<u32> {
        self.cluster_map_offset.borrow()
    }
}
impl Mdl_Model {
    pub fn pad0(&self) -> Ref<Vec<u8>> {
        self.pad0.borrow()
    }
}

/**
 * Matrices that represent the pose of each bone in model space. This is
 * an array of matrices where `initial_matrices[i]` goes with bone `i`.
 */
impl Mdl_Model {
    pub fn initial_matrices(&self) -> Ref<Vec<OptRc<Mdl_TransformationMatrix>>> {
        self.initial_matrices.borrow()
    }
}

/**
 * A graph having a tree structure that represents the skeleton. This is
 * an array of indices where bone `i` is the parent of
 * `skeleton_tree[i]`. If `skeleton_tree[i]` is 255, then the bone `i`
 * represents a root node.
 */
impl Mdl_Model {
    pub fn skeleton_tree(&self) -> Ref<Vec<u8>> {
        self.skeleton_tree.borrow()
    }
}
impl Mdl_Model {
    pub fn pad1(&self) -> Ref<Vec<u8>> {
        self.pad1.borrow()
    }
}
impl Mdl_Model {
    pub fn bone_pairs(&self) -> Ref<Vec<OptRc<Mdl_SkeletonPair>>> {
        self.bone_pairs.borrow()
    }
}
impl Mdl_Model {
    pub fn pad2(&self) -> Ref<Vec<u8>> {
        self.pad2.borrow()
    }
}

/**
 * Matrices that represent relative transformations between bones. For
 * index `i`, let `parent` equal `bone_pairs[i].parent` and `child`
 * equal `bone_pairs[i].child`. Then `default_pcms_matrices[i]` is equal
 * to `inverse(initial_matrices[child]) * initial_matrices[parent]`.
 */
impl Mdl_Model {
    pub fn default_pcms_matrices(&self) -> Ref<Vec<OptRc<Mdl_TransformationMatrix>>> {
        self.default_pcms_matrices.borrow()
    }
}
impl Mdl_Model {
    pub fn texture_metadata(&self) -> Ref<OptRc<Mdl_TextureMetadata>> {
        self.texture_metadata.borrow()
    }
}
impl Mdl_Model {
    pub fn _io(&self) -> Ref<BytesReader> {
        self._io.borrow()
    }
}

/**
 * Description for a primitive, in the OpenGL sense of the word
 * "primitive". In this case, the primitives are triangle strips, but
 * the triangle list can contain degenerate triangles that are used to
 * separate strips.
 */

#[derive(Default, Debug, Clone)]
pub struct Mdl_PrimitiveHeader {
    pub _root: SharedType<Mdl>,
    pub _parent: SharedType<Mdl_PrimitiveHeaderWrapper>,
    pub _self: SharedType<Self>,
    pad0: RefCell<Vec<u8>>,
    bone_count: RefCell<u32>,
    bone_indices_offset: RefCell<u32>,
    bone_pairs_count: RefCell<u32>,
    bone_pairs_offset: RefCell<u32>,
    texture_index_count: RefCell<u32>,
    texture_index_offset: RefCell<u32>,
    sampler_states_offset: RefCell<u32>,
    material_type: RefCell<Mdl_PrimitiveHeader_MaterialType>,
    unknown_byte0: RefCell<u8>,
    pose_index: RefCell<u8>,
    unknown_byte1: RefCell<u8>,
    backface_culling: RefCell<u32>,
    unknown_float0: RefCell<f32>,
    unknown_float1: RefCell<f32>,
    specular_scale: RefCell<f32>,
    unknown_section0: RefCell<Vec<u8>>,
    pad1: RefCell<Vec<u8>>,
    diffuse_color: RefCell<Vec<f32>>,
    pad2: RefCell<Vec<u8>>,
    ambient_color: RefCell<Vec<f32>>,
    pad3: RefCell<Vec<u8>>,
    specular_color: RefCell<Vec<f32>>,
    pad4: RefCell<Vec<u8>>,
    primitive_start_index: RefCell<u32>,
    primitive_length: RefCell<u32>,
    pad5: RefCell<Vec<u8>>,
    bone_indices: RefCell<Vec<u16>>,
    _io: RefCell<BytesReader>,
    bone_pair_indices_raw: RefCell<Vec<u8>>,
    texture_indices_raw: RefCell<Vec<u8>>,
    f_bone_pair_indices: Cell<bool>,
    bone_pair_indices: RefCell<OptRc<Mdl_IndexList>>,
    f_sampler_states: Cell<bool>,
    sampler_states: RefCell<Vec<u8>>,
    f_texture_indices: Cell<bool>,
    texture_indices: RefCell<OptRc<Mdl_IndexList>>,
}
impl KStruct for Mdl_PrimitiveHeader {
    type Root = Mdl;
    type Parent = Mdl_PrimitiveHeaderWrapper;

    fn read<S: KStream>(
        self_rc: &OptRc<Self>,
        _io: &S,
        _root: SharedType<Self::Root>,
        _parent: SharedType<Self::Parent>,
    ) -> KResult<()> {
        *self_rc._io.borrow_mut() = _io.clone();
        self_rc._root.set(_root.get());
        self_rc._parent.set(_parent.get());
        self_rc._self.set(Ok(self_rc.clone()));
        let _rrc = self_rc._root.get_value().borrow().upgrade();
        let _prc = self_rc._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        *self_rc.pad0.borrow_mut() = _io.read_bytes(4 as usize)?.into();
        *self_rc.bone_count.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.bone_indices_offset.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.bone_pairs_count.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.bone_pairs_offset.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.texture_index_count.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.texture_index_offset.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.sampler_states_offset.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.material_type.borrow_mut() = (_io.read_u1()? as i64).try_into()?;
        *self_rc.unknown_byte0.borrow_mut() = _io.read_u1()?.into();
        *self_rc.pose_index.borrow_mut() = _io.read_u1()?.into();
        *self_rc.unknown_byte1.borrow_mut() = _io.read_u1()?.into();
        *self_rc.backface_culling.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.unknown_float0.borrow_mut() = _io.read_f4le()?.into();
        *self_rc.unknown_float1.borrow_mut() = _io.read_f4le()?.into();
        *self_rc.specular_scale.borrow_mut() = _io.read_f4le()?.into();
        *self_rc.unknown_section0.borrow_mut() = _io.read_bytes(8 as usize)?.into();
        *self_rc.pad1.borrow_mut() = _io.read_bytes(4 as usize)?.into();
        *self_rc.diffuse_color.borrow_mut() = Vec::new();
        let l_diffuse_color = 3;
        for _i in 0..l_diffuse_color {
            self_rc
                .diffuse_color
                .borrow_mut()
                .push(_io.read_f4le()?.into());
        }
        *self_rc.pad2.borrow_mut() = _io.read_bytes(4 as usize)?.into();
        *self_rc.ambient_color.borrow_mut() = Vec::new();
        let l_ambient_color = 3;
        for _i in 0..l_ambient_color {
            self_rc
                .ambient_color
                .borrow_mut()
                .push(_io.read_f4le()?.into());
        }
        *self_rc.pad3.borrow_mut() = _io.read_bytes(4 as usize)?.into();
        *self_rc.specular_color.borrow_mut() = Vec::new();
        let l_specular_color = 3;
        for _i in 0..l_specular_color {
            self_rc
                .specular_color
                .borrow_mut()
                .push(_io.read_f4le()?.into());
        }
        *self_rc.pad4.borrow_mut() = _io.read_bytes(4 as usize)?.into();
        *self_rc.primitive_start_index.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.primitive_length.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.pad5.borrow_mut() = _io.read_bytes(4 as usize)?.into();
        *self_rc.bone_indices.borrow_mut() = Vec::new();
        let l_bone_indices = *self_rc.bone_count();
        for _i in 0..l_bone_indices {
            self_rc
                .bone_indices
                .borrow_mut()
                .push(_io.read_u2le()?.into());
        }
        Ok(())
    }
}
impl Mdl_PrimitiveHeader {
    /**
     * A list of bone pair indices. See bone_indices doc comment, a similar
     * concept applies.
     */
    pub fn bone_pair_indices(&self) -> KResult<Ref<OptRc<Mdl_IndexList>>> {
        let _io = self._io.borrow();
        let _rrc = self._root.get_value().borrow().upgrade();
        let _prc = self._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        if self.f_bone_pair_indices.get() {
            return Ok(self.bone_pair_indices.borrow());
        }
        let _pos = _io.pos();
        _io.seek(((*self.bone_pairs_offset() as u32) - (4 as u32)) as usize)?;
        *self.bone_pair_indices_raw.borrow_mut() = _io
            .read_bytes(((*self.bone_pairs_count() as u32) * (2 as u32)) as usize)?
            .into();
        let bone_pair_indices_raw = self.bone_pair_indices_raw.borrow();
        let _t_bone_pair_indices_raw_io = BytesReader::from(bone_pair_indices_raw.clone());
        let t = Self::read_into::<BytesReader, Mdl_IndexList>(
            &_t_bone_pair_indices_raw_io,
            Some(self._root.clone()),
            None,
        )?
        .into();
        *self.bone_pair_indices.borrow_mut() = t;
        _io.seek(_pos)?;
        Ok(self.bone_pair_indices.borrow())
    }
    pub fn sampler_states(&self) -> KResult<Ref<Vec<u8>>> {
        let _io = self._io.borrow();
        let _rrc = self._root.get_value().borrow().upgrade();
        let _prc = self._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        if self.f_sampler_states.get() {
            return Ok(self.sampler_states.borrow());
        }
        self.f_sampler_states.set(true);
        let _pos = _io.pos();
        _io.seek(((*self.sampler_states_offset() as u32) - (4 as u32)) as usize)?;
        *self.sampler_states.borrow_mut() = Vec::new();
        let l_sampler_states = 4;
        for _i in 0..l_sampler_states {
            self.sampler_states.borrow_mut().push(_io.read_u1()?.into());
        }
        _io.seek(_pos)?;
        Ok(self.sampler_states.borrow())
    }

    /**
     * A list of texture indices? TODO
     */
    pub fn texture_indices(&self) -> KResult<Ref<OptRc<Mdl_IndexList>>> {
        let _io = self._io.borrow();
        let _rrc = self._root.get_value().borrow().upgrade();
        let _prc = self._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        if self.f_texture_indices.get() {
            return Ok(self.texture_indices.borrow());
        }
        let _pos = _io.pos();
        _io.seek(((*self.texture_index_offset() as u32) - (4 as u32)) as usize)?;
        *self.texture_indices_raw.borrow_mut() = _io
            .read_bytes(((*self.texture_index_count() as u32) * (2 as u32)) as usize)?
            .into();
        let texture_indices_raw = self.texture_indices_raw.borrow();
        let _t_texture_indices_raw_io = BytesReader::from(texture_indices_raw.clone());
        let t = Self::read_into::<BytesReader, Mdl_IndexList>(
            &_t_texture_indices_raw_io,
            Some(self._root.clone()),
            None,
        )?
        .into();
        *self.texture_indices.borrow_mut() = t;
        _io.seek(_pos)?;
        Ok(self.texture_indices.borrow())
    }
}
impl Mdl_PrimitiveHeader {
    pub fn pad0(&self) -> Ref<Vec<u8>> {
        self.pad0.borrow()
    }
}

/**
 * Number of bones that this primitive depends on.
 */
impl Mdl_PrimitiveHeader {
    pub fn bone_count(&self) -> Ref<u32> {
        self.bone_count.borrow()
    }
}

/**
 * Offset from this header to a bone list. See bone_indices.
 */
impl Mdl_PrimitiveHeader {
    pub fn bone_indices_offset(&self) -> Ref<u32> {
        self.bone_indices_offset.borrow()
    }
}

/**
 * Number of bone pairs that this primitive depends on.
 */
impl Mdl_PrimitiveHeader {
    pub fn bone_pairs_count(&self) -> Ref<u32> {
        self.bone_pairs_count.borrow()
    }
}

/**
 * Offset to a bone pair indices list. See bone_pair_indices.
 */
impl Mdl_PrimitiveHeader {
    pub fn bone_pairs_offset(&self) -> Ref<u32> {
        self.bone_pairs_offset.borrow()
    }
}

/**
 * Appears to be the texture indices for this primitive?
 */
impl Mdl_PrimitiveHeader {
    pub fn texture_index_count(&self) -> Ref<u32> {
        self.texture_index_count.borrow()
    }
}

/**
 * Appears to be the texture index offset for this primitive?
 */
impl Mdl_PrimitiveHeader {
    pub fn texture_index_offset(&self) -> Ref<u32> {
        self.texture_index_offset.borrow()
    }
}

/**
 * From FF24, this is an offset to ADDRESSU, ADDRESSV, MAGFILTER and
 * MINFILTER sampler states.
 */
impl Mdl_PrimitiveHeader {
    pub fn sampler_states_offset(&self) -> Ref<u32> {
        self.sampler_states_offset.borrow()
    }
}

/**
 * See FrozenFish24's SH2MapTools/Sh2ModelMaterialEditor/Model.py#L75
 */
impl Mdl_PrimitiveHeader {
    pub fn material_type(&self) -> Ref<Mdl_PrimitiveHeader_MaterialType> {
        self.material_type.borrow()
    }
}

/**
 * Possibly material-related, see `material_type`.
 */
impl Mdl_PrimitiveHeader {
    pub fn unknown_byte0(&self) -> Ref<u8> {
        self.unknown_byte0.borrow()
    }
}

/**
 * If zero, this primitive is always visible. Otherwise, it may be
 * hidden and swapped out at various times, e.g. for James's hands.
 */
impl Mdl_PrimitiveHeader {
    pub fn pose_index(&self) -> Ref<u8> {
        self.pose_index.borrow()
    }
}
impl Mdl_PrimitiveHeader {
    pub fn unknown_byte1(&self) -> Ref<u8> {
        self.unknown_byte1.borrow()
    }
}
impl Mdl_PrimitiveHeader {
    pub fn backface_culling(&self) -> Ref<u32> {
        self.backface_culling.borrow()
    }
}

/**
 * From FF24, reported to affect diffuse color somehow.
 */
impl Mdl_PrimitiveHeader {
    pub fn unknown_float0(&self) -> Ref<f32> {
        self.unknown_float0.borrow()
    }
}

/**
 * From FF24, reported to affect ambient color somehow.
 */
impl Mdl_PrimitiveHeader {
    pub fn unknown_float1(&self) -> Ref<f32> {
        self.unknown_float1.borrow()
    }
}

/**
 * From FF24, larger value = smaller specular.
 */
impl Mdl_PrimitiveHeader {
    pub fn specular_scale(&self) -> Ref<f32> {
        self.specular_scale.borrow()
    }
}

/**
 * Unknown purpose.
 */
impl Mdl_PrimitiveHeader {
    pub fn unknown_section0(&self) -> Ref<Vec<u8>> {
        self.unknown_section0.borrow()
    }
}
impl Mdl_PrimitiveHeader {
    pub fn pad1(&self) -> Ref<Vec<u8>> {
        self.pad1.borrow()
    }
}

/**
 * From FF24, this is the diffuse color.
 */
impl Mdl_PrimitiveHeader {
    pub fn diffuse_color(&self) -> Ref<Vec<f32>> {
        self.diffuse_color.borrow()
    }
}
impl Mdl_PrimitiveHeader {
    pub fn pad2(&self) -> Ref<Vec<u8>> {
        self.pad2.borrow()
    }
}

/**
 * From FF24, this is the ambient color.
 */
impl Mdl_PrimitiveHeader {
    pub fn ambient_color(&self) -> Ref<Vec<f32>> {
        self.ambient_color.borrow()
    }
}
impl Mdl_PrimitiveHeader {
    pub fn pad3(&self) -> Ref<Vec<u8>> {
        self.pad3.borrow()
    }
}

/**
 * From FF24, this is the specular color (range 0-128).
 */
impl Mdl_PrimitiveHeader {
    pub fn specular_color(&self) -> Ref<Vec<f32>> {
        self.specular_color.borrow()
    }
}
impl Mdl_PrimitiveHeader {
    pub fn pad4(&self) -> Ref<Vec<u8>> {
        self.pad4.borrow()
    }
}

/**
 * Offset into the triangle index array where the primitive begins.
 */
impl Mdl_PrimitiveHeader {
    pub fn primitive_start_index(&self) -> Ref<u32> {
        self.primitive_start_index.borrow()
    }
}

/**
 * The length of the primitive in the triangle index array.
 */
impl Mdl_PrimitiveHeader {
    pub fn primitive_length(&self) -> Ref<u32> {
        self.primitive_length.borrow()
    }
}
impl Mdl_PrimitiveHeader {
    pub fn pad5(&self) -> Ref<Vec<u8>> {
        self.pad5.borrow()
    }
}

/**
 * The bone index array from this primitive. An important point is that
 * the bone indices specified by a given vertex go into this array, not
 * the overall skeleton array. Unclear why these are u2 if bones are u1?
 */
impl Mdl_PrimitiveHeader {
    pub fn bone_indices(&self) -> Ref<Vec<u16>> {
        self.bone_indices.borrow()
    }
}
impl Mdl_PrimitiveHeader {
    pub fn _io(&self) -> Ref<BytesReader> {
        self._io.borrow()
    }
}
impl Mdl_PrimitiveHeader {
    pub fn bone_pair_indices_raw(&self) -> Ref<Vec<u8>> {
        self.bone_pair_indices_raw.borrow()
    }
}
impl Mdl_PrimitiveHeader {
    pub fn texture_indices_raw(&self) -> Ref<Vec<u8>> {
        self.texture_indices_raw.borrow()
    }
}
#[derive(Debug, PartialEq, Clone)]
pub enum Mdl_PrimitiveHeader_MaterialType {
    Unlit,
    Matte,
    MattePlus,
    Glossy,
    Unknown(i64),
}

impl TryFrom<i64> for Mdl_PrimitiveHeader_MaterialType {
    type Error = KError;
    fn try_from(flag: i64) -> KResult<Mdl_PrimitiveHeader_MaterialType> {
        match flag {
            1 => Ok(Mdl_PrimitiveHeader_MaterialType::Unlit),
            2 => Ok(Mdl_PrimitiveHeader_MaterialType::Matte),
            3 => Ok(Mdl_PrimitiveHeader_MaterialType::MattePlus),
            4 => Ok(Mdl_PrimitiveHeader_MaterialType::Glossy),
            _ => Ok(Mdl_PrimitiveHeader_MaterialType::Unknown(flag)),
        }
    }
}

impl From<&Mdl_PrimitiveHeader_MaterialType> for i64 {
    fn from(v: &Mdl_PrimitiveHeader_MaterialType) -> Self {
        match *v {
            Mdl_PrimitiveHeader_MaterialType::Unlit => 1,
            Mdl_PrimitiveHeader_MaterialType::Matte => 2,
            Mdl_PrimitiveHeader_MaterialType::MattePlus => 3,
            Mdl_PrimitiveHeader_MaterialType::Glossy => 4,
            Mdl_PrimitiveHeader_MaterialType::Unknown(v) => v,
        }
    }
}

impl Default for Mdl_PrimitiveHeader_MaterialType {
    fn default() -> Self {
        Mdl_PrimitiveHeader_MaterialType::Unknown(0)
    }
}

#[derive(Default, Debug, Clone)]
pub struct Mdl_PrimitiveHeaderWrapper {
    pub _root: SharedType<Mdl>,
    pub _parent: SharedType<Mdl_Geometry>,
    pub _self: SharedType<Self>,
    primitive_header_size: RefCell<u32>,
    body: RefCell<OptRc<Mdl_PrimitiveHeader>>,
    _io: RefCell<BytesReader>,
    body_raw: RefCell<Vec<u8>>,
}
impl KStruct for Mdl_PrimitiveHeaderWrapper {
    type Root = Mdl;
    type Parent = Mdl_Geometry;

    fn read<S: KStream>(
        self_rc: &OptRc<Self>,
        _io: &S,
        _root: SharedType<Self::Root>,
        _parent: SharedType<Self::Parent>,
    ) -> KResult<()> {
        *self_rc._io.borrow_mut() = _io.clone();
        self_rc._root.set(_root.get());
        self_rc._parent.set(_parent.get());
        self_rc._self.set(Ok(self_rc.clone()));
        let _rrc = self_rc._root.get_value().borrow().upgrade();
        let _prc = self_rc._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        *self_rc.primitive_header_size.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.body_raw.borrow_mut() = _io
            .read_bytes(((*self_rc.primitive_header_size() as u32) - (4 as u32)) as usize)?
            .into();
        let body_raw = self_rc.body_raw.borrow();
        let _t_body_raw_io = BytesReader::from(body_raw.clone());
        let t = Self::read_into::<BytesReader, Mdl_PrimitiveHeader>(
            &_t_body_raw_io,
            Some(self_rc._root.clone()),
            Some(self_rc._self.clone()),
        )?
        .into();
        *self_rc.body.borrow_mut() = t;
        Ok(())
    }
}
impl Mdl_PrimitiveHeaderWrapper {}
impl Mdl_PrimitiveHeaderWrapper {
    pub fn primitive_header_size(&self) -> Ref<u32> {
        self.primitive_header_size.borrow()
    }
}
impl Mdl_PrimitiveHeaderWrapper {
    pub fn body(&self) -> Ref<OptRc<Mdl_PrimitiveHeader>> {
        self.body.borrow()
    }
}
impl Mdl_PrimitiveHeaderWrapper {
    pub fn _io(&self) -> Ref<BytesReader> {
        self._io.borrow()
    }
}
impl Mdl_PrimitiveHeaderWrapper {
    pub fn body_raw(&self) -> Ref<Vec<u8>> {
        self.body_raw.borrow()
    }
}

#[derive(Default, Debug, Clone)]
pub struct Mdl_S2Vector {
    pub _root: SharedType<Mdl>,
    pub _parent: SharedType<KStructUnit>,
    pub _self: SharedType<Self>,
    x: RefCell<i16>,
    y: RefCell<i16>,
    z: RefCell<i16>,
    _io: RefCell<BytesReader>,
}
impl KStruct for Mdl_S2Vector {
    type Root = Mdl;
    type Parent = KStructUnit;

    fn read<S: KStream>(
        self_rc: &OptRc<Self>,
        _io: &S,
        _root: SharedType<Self::Root>,
        _parent: SharedType<Self::Parent>,
    ) -> KResult<()> {
        *self_rc._io.borrow_mut() = _io.clone();
        self_rc._root.set(_root.get());
        self_rc._parent.set(_parent.get());
        self_rc._self.set(Ok(self_rc.clone()));
        let _rrc = self_rc._root.get_value().borrow().upgrade();
        let _prc = self_rc._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        *self_rc.x.borrow_mut() = _io.read_s2le()?.into();
        *self_rc.y.borrow_mut() = _io.read_s2le()?.into();
        *self_rc.z.borrow_mut() = _io.read_s2le()?.into();
        Ok(())
    }
}
impl Mdl_S2Vector {}
impl Mdl_S2Vector {
    pub fn x(&self) -> Ref<i16> {
        self.x.borrow()
    }
}
impl Mdl_S2Vector {
    pub fn y(&self) -> Ref<i16> {
        self.y.borrow()
    }
}
impl Mdl_S2Vector {
    pub fn z(&self) -> Ref<i16> {
        self.z.borrow()
    }
}
impl Mdl_S2Vector {
    pub fn _io(&self) -> Ref<BytesReader> {
        self._io.borrow()
    }
}

/**
 * Represents a parent-child bone relationship.
 */

#[derive(Default, Debug, Clone)]
pub struct Mdl_SkeletonPair {
    pub _root: SharedType<Mdl>,
    pub _parent: SharedType<Mdl_Model>,
    pub _self: SharedType<Self>,
    parent: RefCell<u8>,
    child: RefCell<u8>,
    _io: RefCell<BytesReader>,
}
impl KStruct for Mdl_SkeletonPair {
    type Root = Mdl;
    type Parent = Mdl_Model;

    fn read<S: KStream>(
        self_rc: &OptRc<Self>,
        _io: &S,
        _root: SharedType<Self::Root>,
        _parent: SharedType<Self::Parent>,
    ) -> KResult<()> {
        *self_rc._io.borrow_mut() = _io.clone();
        self_rc._root.set(_root.get());
        self_rc._parent.set(_parent.get());
        self_rc._self.set(Ok(self_rc.clone()));
        let _rrc = self_rc._root.get_value().borrow().upgrade();
        let _prc = self_rc._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        *self_rc.parent.borrow_mut() = _io.read_u1()?.into();
        *self_rc.child.borrow_mut() = _io.read_u1()?.into();
        Ok(())
    }
}
impl Mdl_SkeletonPair {}
impl Mdl_SkeletonPair {
    pub fn parent(&self) -> Ref<u8> {
        self.parent.borrow()
    }
}
impl Mdl_SkeletonPair {
    pub fn child(&self) -> Ref<u8> {
        self.child.borrow()
    }
}
impl Mdl_SkeletonPair {
    pub fn _io(&self) -> Ref<BytesReader> {
        self._io.borrow()
    }
}

#[derive(Default, Debug, Clone)]
pub struct Mdl_SpriteHeader {
    pub _root: SharedType<Mdl>,
    pub _parent: SharedType<Mdl_TextureContainer>,
    pub _self: SharedType<Self>,
    sprite_id: RefCell<u32>,
    x: RefCell<u16>,
    y: RefCell<u16>,
    width: RefCell<u16>,
    height: RefCell<u16>,
    format: RefCell<Mdl_SpriteHeader_TextureFormat>,
    unknown0: RefCell<u8>,
    importance: RefCell<u16>,
    data_size: RefCell<u32>,
    all_size: RefCell<u32>,
    pad: RefCell<Vec<u8>>,
    unknown1: RefCell<u8>,
    unknown2: RefCell<u8>,
    end_magic: RefCell<u16>,
    _io: RefCell<BytesReader>,
}
impl KStruct for Mdl_SpriteHeader {
    type Root = Mdl;
    type Parent = Mdl_TextureContainer;

    fn read<S: KStream>(
        self_rc: &OptRc<Self>,
        _io: &S,
        _root: SharedType<Self::Root>,
        _parent: SharedType<Self::Parent>,
    ) -> KResult<()> {
        *self_rc._io.borrow_mut() = _io.clone();
        self_rc._root.set(_root.get());
        self_rc._parent.set(_parent.get());
        self_rc._self.set(Ok(self_rc.clone()));
        let _rrc = self_rc._root.get_value().borrow().upgrade();
        let _prc = self_rc._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        *self_rc.sprite_id.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.x.borrow_mut() = _io.read_u2le()?.into();
        *self_rc.y.borrow_mut() = _io.read_u2le()?.into();
        *self_rc.width.borrow_mut() = _io.read_u2le()?.into();
        *self_rc.height.borrow_mut() = _io.read_u2le()?.into();
        *self_rc.format.borrow_mut() = (_io.read_u1()? as i64).try_into()?;
        *self_rc.unknown0.borrow_mut() = _io.read_u1()?.into();
        *self_rc.importance.borrow_mut() = _io.read_u2le()?.into();
        *self_rc.data_size.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.all_size.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.pad.borrow_mut() = _io.read_bytes(4 as usize)?.into();
        *self_rc.unknown1.borrow_mut() = _io.read_u1()?.into();
        *self_rc.unknown2.borrow_mut() = _io.read_u1()?.into();
        *self_rc.end_magic.borrow_mut() = _io.read_u2le()?.into();
        Ok(())
    }
}
impl Mdl_SpriteHeader {}
impl Mdl_SpriteHeader {
    pub fn sprite_id(&self) -> Ref<u32> {
        self.sprite_id.borrow()
    }
}
impl Mdl_SpriteHeader {
    pub fn x(&self) -> Ref<u16> {
        self.x.borrow()
    }
}
impl Mdl_SpriteHeader {
    pub fn y(&self) -> Ref<u16> {
        self.y.borrow()
    }
}
impl Mdl_SpriteHeader {
    pub fn width(&self) -> Ref<u16> {
        self.width.borrow()
    }
}
impl Mdl_SpriteHeader {
    pub fn height(&self) -> Ref<u16> {
        self.height.borrow()
    }
}
impl Mdl_SpriteHeader {
    pub fn format(&self) -> Ref<Mdl_SpriteHeader_TextureFormat> {
        self.format.borrow()
    }
}
impl Mdl_SpriteHeader {
    pub fn unknown0(&self) -> Ref<u8> {
        self.unknown0.borrow()
    }
}
impl Mdl_SpriteHeader {
    pub fn importance(&self) -> Ref<u16> {
        self.importance.borrow()
    }
}

/**
 * Unknown purpose.
 */
impl Mdl_SpriteHeader {
    pub fn data_size(&self) -> Ref<u32> {
        self.data_size.borrow()
    }
}

/**
 * Unknown purpose.
 */
impl Mdl_SpriteHeader {
    pub fn all_size(&self) -> Ref<u32> {
        self.all_size.borrow()
    }
}
impl Mdl_SpriteHeader {
    pub fn pad(&self) -> Ref<Vec<u8>> {
        self.pad.borrow()
    }
}
impl Mdl_SpriteHeader {
    pub fn unknown1(&self) -> Ref<u8> {
        self.unknown1.borrow()
    }
}
impl Mdl_SpriteHeader {
    pub fn unknown2(&self) -> Ref<u8> {
        self.unknown2.borrow()
    }
}
impl Mdl_SpriteHeader {
    pub fn end_magic(&self) -> Ref<u16> {
        self.end_magic.borrow()
    }
}
impl Mdl_SpriteHeader {
    pub fn _io(&self) -> Ref<BytesReader> {
        self._io.borrow()
    }
}
#[derive(Debug, PartialEq, Clone)]
pub enum Mdl_SpriteHeader_TextureFormat {
    Dxt1,
    Dxt2,
    Dxt3,
    Dxt4,
    Dxt5,
    Paletted,
    Rgbx8,
    Rgba8,
    Unknown(i64),
}

impl TryFrom<i64> for Mdl_SpriteHeader_TextureFormat {
    type Error = KError;
    fn try_from(flag: i64) -> KResult<Mdl_SpriteHeader_TextureFormat> {
        match flag {
            0 => Ok(Mdl_SpriteHeader_TextureFormat::Dxt1),
            1 => Ok(Mdl_SpriteHeader_TextureFormat::Dxt2),
            2 => Ok(Mdl_SpriteHeader_TextureFormat::Dxt3),
            3 => Ok(Mdl_SpriteHeader_TextureFormat::Dxt4),
            4 => Ok(Mdl_SpriteHeader_TextureFormat::Dxt5),
            8 => Ok(Mdl_SpriteHeader_TextureFormat::Paletted),
            24 => Ok(Mdl_SpriteHeader_TextureFormat::Rgbx8),
            32 => Ok(Mdl_SpriteHeader_TextureFormat::Rgba8),
            _ => Ok(Mdl_SpriteHeader_TextureFormat::Unknown(flag)),
        }
    }
}

impl From<&Mdl_SpriteHeader_TextureFormat> for i64 {
    fn from(v: &Mdl_SpriteHeader_TextureFormat) -> Self {
        match *v {
            Mdl_SpriteHeader_TextureFormat::Dxt1 => 0,
            Mdl_SpriteHeader_TextureFormat::Dxt2 => 1,
            Mdl_SpriteHeader_TextureFormat::Dxt3 => 2,
            Mdl_SpriteHeader_TextureFormat::Dxt4 => 3,
            Mdl_SpriteHeader_TextureFormat::Dxt5 => 4,
            Mdl_SpriteHeader_TextureFormat::Paletted => 8,
            Mdl_SpriteHeader_TextureFormat::Rgbx8 => 24,
            Mdl_SpriteHeader_TextureFormat::Rgba8 => 32,
            Mdl_SpriteHeader_TextureFormat::Unknown(v) => v,
        }
    }
}

impl Default for Mdl_SpriteHeader_TextureFormat {
    fn default() -> Self {
        Mdl_SpriteHeader_TextureFormat::Unknown(0)
    }
}

#[derive(Default, Debug, Clone)]
pub struct Mdl_TextureContainer {
    pub _root: SharedType<Mdl>,
    pub _parent: SharedType<Mdl_TextureData>,
    pub _self: SharedType<Self>,
    texture_id: RefCell<u32>,
    width: RefCell<u16>,
    height: RefCell<u16>,
    width2: RefCell<u16>,
    height2: RefCell<u16>,
    sprite_count: RefCell<u16>,
    unknown_section: RefCell<Vec<u8>>,
    sprite_headers: RefCell<Vec<OptRc<Mdl_SpriteHeader>>>,
    data: RefCell<Vec<u8>>,
    _io: RefCell<BytesReader>,
}
impl KStruct for Mdl_TextureContainer {
    type Root = Mdl;
    type Parent = Mdl_TextureData;

    fn read<S: KStream>(
        self_rc: &OptRc<Self>,
        _io: &S,
        _root: SharedType<Self::Root>,
        _parent: SharedType<Self::Parent>,
    ) -> KResult<()> {
        *self_rc._io.borrow_mut() = _io.clone();
        self_rc._root.set(_root.get());
        self_rc._parent.set(_parent.get());
        self_rc._self.set(Ok(self_rc.clone()));
        let _rrc = self_rc._root.get_value().borrow().upgrade();
        let _prc = self_rc._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        *self_rc.texture_id.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.width.borrow_mut() = _io.read_u2le()?.into();
        *self_rc.height.borrow_mut() = _io.read_u2le()?.into();
        *self_rc.width2.borrow_mut() = _io.read_u2le()?.into();
        *self_rc.height2.borrow_mut() = _io.read_u2le()?.into();
        *self_rc.sprite_count.borrow_mut() = _io.read_u2le()?.into();
        *self_rc.unknown_section.borrow_mut() = _io.read_bytes(18 as usize)?.into();
        *self_rc.sprite_headers.borrow_mut() = Vec::new();
        let l_sprite_headers = *self_rc.sprite_count();
        for _i in 0..l_sprite_headers {
            let t = Self::read_into::<_, Mdl_SpriteHeader>(
                &*_io,
                Some(self_rc._root.clone()),
                Some(self_rc._self.clone()),
            )?
            .into();
            self_rc.sprite_headers.borrow_mut().push(t);
        }
        *self_rc.data.borrow_mut() = _io
            .read_bytes(
                if ((i64::from(&*self_rc.sprite_headers()[0 as usize].format()) as i32)
                    != (0 as i32))
                {
                    ((*self_rc.width() as u16) * (*self_rc.height() as u16))
                } else {
                    ((((*self_rc.width() as u16) * (*self_rc.height() as u16)) as i32) / (2 as i32))
                        .try_into()
                        .unwrap()
                } as usize,
            )?
            .into();
        Ok(())
    }
}
impl Mdl_TextureContainer {}
impl Mdl_TextureContainer {
    pub fn texture_id(&self) -> Ref<u32> {
        self.texture_id.borrow()
    }
}
impl Mdl_TextureContainer {
    pub fn width(&self) -> Ref<u16> {
        self.width.borrow()
    }
}
impl Mdl_TextureContainer {
    pub fn height(&self) -> Ref<u16> {
        self.height.borrow()
    }
}
impl Mdl_TextureContainer {
    pub fn width2(&self) -> Ref<u16> {
        self.width2.borrow()
    }
}
impl Mdl_TextureContainer {
    pub fn height2(&self) -> Ref<u16> {
        self.height2.borrow()
    }
}
impl Mdl_TextureContainer {
    pub fn sprite_count(&self) -> Ref<u16> {
        self.sprite_count.borrow()
    }
}
impl Mdl_TextureContainer {
    pub fn unknown_section(&self) -> Ref<Vec<u8>> {
        self.unknown_section.borrow()
    }
}
impl Mdl_TextureContainer {
    pub fn sprite_headers(&self) -> Ref<Vec<OptRc<Mdl_SpriteHeader>>> {
        self.sprite_headers.borrow()
    }
}
impl Mdl_TextureContainer {
    pub fn data(&self) -> Ref<Vec<u8>> {
        self.data.borrow()
    }
}
impl Mdl_TextureContainer {
    pub fn _io(&self) -> Ref<BytesReader> {
        self._io.borrow()
    }
}

#[derive(Default, Debug, Clone)]
pub struct Mdl_TextureData {
    pub _root: SharedType<Mdl>,
    pub _parent: SharedType<Mdl>,
    pub _self: SharedType<Self>,
    magic: RefCell<Vec<u8>>,
    unknown: RefCell<Vec<u8>>,
    textures: RefCell<Vec<OptRc<Mdl_TextureContainer>>>,
    _io: RefCell<BytesReader>,
}
impl KStruct for Mdl_TextureData {
    type Root = Mdl;
    type Parent = Mdl;

    fn read<S: KStream>(
        self_rc: &OptRc<Self>,
        _io: &S,
        _root: SharedType<Self::Root>,
        _parent: SharedType<Self::Parent>,
    ) -> KResult<()> {
        *self_rc._io.borrow_mut() = _io.clone();
        self_rc._root.set(_root.get());
        self_rc._parent.set(_parent.get());
        self_rc._self.set(Ok(self_rc.clone()));
        let _rrc = self_rc._root.get_value().borrow().upgrade();
        let _prc = self_rc._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        *self_rc.magic.borrow_mut() = _io.read_bytes(4 as usize)?.into();
        if !(*self_rc.magic() == vec![0x1u8, 0x9u8, 0x99u8, 0x19u8]) {
            return Err(KError::ValidationFailed(ValidationFailedError {
                kind: ValidationKind::NotEqual,
                src_path: "/types/texture_data/seq/0".to_string(),
            }));
        }
        *self_rc.unknown.borrow_mut() = _io.read_bytes(12 as usize)?.into();
        *self_rc.textures.borrow_mut() = Vec::new();
        let l_textures = *_r.header().texture_count();
        for _i in 0..l_textures {
            let t = Self::read_into::<_, Mdl_TextureContainer>(
                &*_io,
                Some(self_rc._root.clone()),
                Some(self_rc._self.clone()),
            )?
            .into();
            self_rc.textures.borrow_mut().push(t);
        }
        Ok(())
    }
}
impl Mdl_TextureData {}

/**
 * And that's a magic number!
 */
impl Mdl_TextureData {
    pub fn magic(&self) -> Ref<Vec<u8>> {
        self.magic.borrow()
    }
}
impl Mdl_TextureData {
    pub fn unknown(&self) -> Ref<Vec<u8>> {
        self.unknown.borrow()
    }
}
impl Mdl_TextureData {
    pub fn textures(&self) -> Ref<Vec<OptRc<Mdl_TextureContainer>>> {
        self.textures.borrow()
    }
}
impl Mdl_TextureData {
    pub fn _io(&self) -> Ref<BytesReader> {
        self._io.borrow()
    }
}

#[derive(Default, Debug, Clone)]
pub struct Mdl_TextureMetadata {
    pub _root: SharedType<Mdl>,
    pub _parent: SharedType<Mdl_Model>,
    pub _self: SharedType<Self>,
    main_texture_ids: RefCell<Vec<u32>>,
    pad: RefCell<Vec<u8>>,
    texture_pairs: RefCell<Vec<OptRc<Mdl_TexturePair>>>,
    _io: RefCell<BytesReader>,
}
impl KStruct for Mdl_TextureMetadata {
    type Root = Mdl;
    type Parent = Mdl_Model;

    fn read<S: KStream>(
        self_rc: &OptRc<Self>,
        _io: &S,
        _root: SharedType<Self::Root>,
        _parent: SharedType<Self::Parent>,
    ) -> KResult<()> {
        *self_rc._io.borrow_mut() = _io.clone();
        self_rc._root.set(_root.get());
        self_rc._parent.set(_parent.get());
        self_rc._self.set(Ok(self_rc.clone()));
        let _rrc = self_rc._root.get_value().borrow().upgrade();
        let _prc = self_rc._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        *self_rc.main_texture_ids.borrow_mut() = Vec::new();
        let l_main_texture_ids = *_prc.as_ref().unwrap().texture_blocks_count();
        for _i in 0..l_main_texture_ids {
            self_rc
                .main_texture_ids
                .borrow_mut()
                .push(_io.read_u4le()?.into());
        }
        if ((((*_prc.as_ref().unwrap().texture_blocks_count() as u32) % (4 as u32)) as i32)
            > (0 as i32))
        {
            *self_rc.pad.borrow_mut() = _io
                .read_bytes(
                    ((16 as i32)
                        - (modulo(
                            ((4 as u32) * (*_prc.as_ref().unwrap().texture_blocks_count() as u32))
                                as i64,
                            16 as i64,
                        ) as i32)) as usize,
                )?
                .into();
        }
        *self_rc.texture_pairs.borrow_mut() = Vec::new();
        let l_texture_pairs = *_prc.as_ref().unwrap().texture_id_count();
        for _i in 0..l_texture_pairs {
            let t = Self::read_into::<_, Mdl_TexturePair>(
                &*_io,
                Some(self_rc._root.clone()),
                Some(self_rc._self.clone()),
            )?
            .into();
            self_rc.texture_pairs.borrow_mut().push(t);
        }
        Ok(())
    }
}
impl Mdl_TextureMetadata {}

/**
 * TODO
 */
impl Mdl_TextureMetadata {
    pub fn main_texture_ids(&self) -> Ref<Vec<u32>> {
        self.main_texture_ids.borrow()
    }
}
impl Mdl_TextureMetadata {
    pub fn pad(&self) -> Ref<Vec<u8>> {
        self.pad.borrow()
    }
}

/**
 * TODO
 */
impl Mdl_TextureMetadata {
    pub fn texture_pairs(&self) -> Ref<Vec<OptRc<Mdl_TexturePair>>> {
        self.texture_pairs.borrow()
    }
}
impl Mdl_TextureMetadata {
    pub fn _io(&self) -> Ref<BytesReader> {
        self._io.borrow()
    }
}

/**
 * TODO
 */

#[derive(Default, Debug, Clone)]
pub struct Mdl_TexturePair {
    pub _root: SharedType<Mdl>,
    pub _parent: SharedType<Mdl_TextureMetadata>,
    pub _self: SharedType<Self>,
    texture_index: RefCell<u32>,
    sprite_id: RefCell<u32>,
    _io: RefCell<BytesReader>,
}
impl KStruct for Mdl_TexturePair {
    type Root = Mdl;
    type Parent = Mdl_TextureMetadata;

    fn read<S: KStream>(
        self_rc: &OptRc<Self>,
        _io: &S,
        _root: SharedType<Self::Root>,
        _parent: SharedType<Self::Parent>,
    ) -> KResult<()> {
        *self_rc._io.borrow_mut() = _io.clone();
        self_rc._root.set(_root.get());
        self_rc._parent.set(_parent.get());
        self_rc._self.set(Ok(self_rc.clone()));
        let _rrc = self_rc._root.get_value().borrow().upgrade();
        let _prc = self_rc._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        *self_rc.texture_index.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.sprite_id.borrow_mut() = _io.read_u4le()?.into();
        if !((*self_rc.sprite_id() as u32) >= (1 as u32)) {
            return Err(KError::ValidationFailed(ValidationFailedError {
                kind: ValidationKind::LessThan,
                src_path: "/types/texture_pair/seq/1".to_string(),
            }));
        }
        Ok(())
    }
}
impl Mdl_TexturePair {}
impl Mdl_TexturePair {
    pub fn texture_index(&self) -> Ref<u32> {
        self.texture_index.borrow()
    }
}
impl Mdl_TexturePair {
    pub fn sprite_id(&self) -> Ref<u32> {
        self.sprite_id.borrow()
    }
}
impl Mdl_TexturePair {
    pub fn _io(&self) -> Ref<BytesReader> {
        self._io.borrow()
    }
}

/**
 * Represents a 4x4 column-major transformation matrix.
 */

#[derive(Default, Debug, Clone)]
pub struct Mdl_TransformationMatrix {
    pub _root: SharedType<Mdl>,
    pub _parent: SharedType<Mdl_Model>,
    pub _self: SharedType<Self>,
    rotation00: RefCell<f32>,
    rotation10: RefCell<f32>,
    rotation20: RefCell<f32>,
    pad0: RefCell<f32>,
    rotation01: RefCell<f32>,
    rotation11: RefCell<f32>,
    rotation21: RefCell<f32>,
    pad1: RefCell<f32>,
    rotation02: RefCell<f32>,
    rotation12: RefCell<f32>,
    rotation22: RefCell<f32>,
    pad2: RefCell<f32>,
    translation_x: RefCell<f32>,
    translation_y: RefCell<f32>,
    translation_z: RefCell<f32>,
    translation_w: RefCell<f32>,
    _io: RefCell<BytesReader>,
}
impl KStruct for Mdl_TransformationMatrix {
    type Root = Mdl;
    type Parent = Mdl_Model;

    fn read<S: KStream>(
        self_rc: &OptRc<Self>,
        _io: &S,
        _root: SharedType<Self::Root>,
        _parent: SharedType<Self::Parent>,
    ) -> KResult<()> {
        *self_rc._io.borrow_mut() = _io.clone();
        self_rc._root.set(_root.get());
        self_rc._parent.set(_parent.get());
        self_rc._self.set(Ok(self_rc.clone()));
        let _rrc = self_rc._root.get_value().borrow().upgrade();
        let _prc = self_rc._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        *self_rc.rotation00.borrow_mut() = _io.read_f4le()?.into();
        *self_rc.rotation10.borrow_mut() = _io.read_f4le()?.into();
        *self_rc.rotation20.borrow_mut() = _io.read_f4le()?.into();
        *self_rc.pad0.borrow_mut() = _io.read_f4le()?.into();
        if !((*self_rc.pad0() as f64) == (0 as f64)) {
            return Err(KError::ValidationFailed(ValidationFailedError {
                kind: ValidationKind::NotEqual,
                src_path: "/types/transformation_matrix/seq/3".to_string(),
            }));
        }
        *self_rc.rotation01.borrow_mut() = _io.read_f4le()?.into();
        *self_rc.rotation11.borrow_mut() = _io.read_f4le()?.into();
        *self_rc.rotation21.borrow_mut() = _io.read_f4le()?.into();
        *self_rc.pad1.borrow_mut() = _io.read_f4le()?.into();
        if !((*self_rc.pad1() as f64) == (0 as f64)) {
            return Err(KError::ValidationFailed(ValidationFailedError {
                kind: ValidationKind::NotEqual,
                src_path: "/types/transformation_matrix/seq/7".to_string(),
            }));
        }
        *self_rc.rotation02.borrow_mut() = _io.read_f4le()?.into();
        *self_rc.rotation12.borrow_mut() = _io.read_f4le()?.into();
        *self_rc.rotation22.borrow_mut() = _io.read_f4le()?.into();
        *self_rc.pad2.borrow_mut() = _io.read_f4le()?.into();
        if !((*self_rc.pad2() as f64) == (0 as f64)) {
            return Err(KError::ValidationFailed(ValidationFailedError {
                kind: ValidationKind::NotEqual,
                src_path: "/types/transformation_matrix/seq/11".to_string(),
            }));
        }
        *self_rc.translation_x.borrow_mut() = _io.read_f4le()?.into();
        *self_rc.translation_y.borrow_mut() = _io.read_f4le()?.into();
        *self_rc.translation_z.borrow_mut() = _io.read_f4le()?.into();
        *self_rc.translation_w.borrow_mut() = _io.read_f4le()?.into();
        if !((*self_rc.translation_w() as f64) == (1 as f64)) {
            return Err(KError::ValidationFailed(ValidationFailedError {
                kind: ValidationKind::NotEqual,
                src_path: "/types/transformation_matrix/seq/15".to_string(),
            }));
        }
        Ok(())
    }
}
impl Mdl_TransformationMatrix {}
impl Mdl_TransformationMatrix {
    pub fn rotation00(&self) -> Ref<f32> {
        self.rotation00.borrow()
    }
}
impl Mdl_TransformationMatrix {
    pub fn rotation10(&self) -> Ref<f32> {
        self.rotation10.borrow()
    }
}
impl Mdl_TransformationMatrix {
    pub fn rotation20(&self) -> Ref<f32> {
        self.rotation20.borrow()
    }
}
impl Mdl_TransformationMatrix {
    pub fn pad0(&self) -> Ref<f32> {
        self.pad0.borrow()
    }
}
impl Mdl_TransformationMatrix {
    pub fn rotation01(&self) -> Ref<f32> {
        self.rotation01.borrow()
    }
}
impl Mdl_TransformationMatrix {
    pub fn rotation11(&self) -> Ref<f32> {
        self.rotation11.borrow()
    }
}
impl Mdl_TransformationMatrix {
    pub fn rotation21(&self) -> Ref<f32> {
        self.rotation21.borrow()
    }
}
impl Mdl_TransformationMatrix {
    pub fn pad1(&self) -> Ref<f32> {
        self.pad1.borrow()
    }
}
impl Mdl_TransformationMatrix {
    pub fn rotation02(&self) -> Ref<f32> {
        self.rotation02.borrow()
    }
}
impl Mdl_TransformationMatrix {
    pub fn rotation12(&self) -> Ref<f32> {
        self.rotation12.borrow()
    }
}
impl Mdl_TransformationMatrix {
    pub fn rotation22(&self) -> Ref<f32> {
        self.rotation22.borrow()
    }
}
impl Mdl_TransformationMatrix {
    pub fn pad2(&self) -> Ref<f32> {
        self.pad2.borrow()
    }
}
impl Mdl_TransformationMatrix {
    pub fn translation_x(&self) -> Ref<f32> {
        self.translation_x.borrow()
    }
}
impl Mdl_TransformationMatrix {
    pub fn translation_y(&self) -> Ref<f32> {
        self.translation_y.borrow()
    }
}
impl Mdl_TransformationMatrix {
    pub fn translation_z(&self) -> Ref<f32> {
        self.translation_z.borrow()
    }
}
impl Mdl_TransformationMatrix {
    pub fn translation_w(&self) -> Ref<f32> {
        self.translation_w.borrow()
    }
}
impl Mdl_TransformationMatrix {
    pub fn _io(&self) -> Ref<BytesReader> {
        self._io.borrow()
    }
}

#[derive(Default, Debug, Clone)]
pub struct Mdl_TransparentPrimitiveHeader {
    pub _root: SharedType<Mdl>,
    pub _parent: SharedType<Mdl_TransparentPrimitiveHeaderWrapper>,
    pub _self: SharedType<Self>,
    pad0: RefCell<Vec<u8>>,
    texture_index_count: RefCell<u32>,
    texture_index_offset: RefCell<u32>,
    marker_offset: RefCell<u32>,
    unknown_count: RefCell<u32>,
    unknown_section0: RefCell<Vec<u8>>,
    pad1: RefCell<u32>,
    unknown_floats0: RefCell<Vec<f32>>,
    pad2: RefCell<u32>,
    unknown_floats1: RefCell<Vec<f32>>,
    unknown_section1: RefCell<Vec<u8>>,
    primitive_start_index: RefCell<u32>,
    primitive_length: RefCell<u32>,
    primitive_index: RefCell<u32>,
    texture_index: RefCell<u32>,
    pad3: RefCell<Vec<u8>>,
    marker: RefCell<Vec<u8>>,
    _io: RefCell<BytesReader>,
}
impl KStruct for Mdl_TransparentPrimitiveHeader {
    type Root = Mdl;
    type Parent = Mdl_TransparentPrimitiveHeaderWrapper;

    fn read<S: KStream>(
        self_rc: &OptRc<Self>,
        _io: &S,
        _root: SharedType<Self::Root>,
        _parent: SharedType<Self::Parent>,
    ) -> KResult<()> {
        *self_rc._io.borrow_mut() = _io.clone();
        self_rc._root.set(_root.get());
        self_rc._parent.set(_parent.get());
        self_rc._self.set(Ok(self_rc.clone()));
        let _rrc = self_rc._root.get_value().borrow().upgrade();
        let _prc = self_rc._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        *self_rc.pad0.borrow_mut() = _io.read_bytes(4 as usize)?.into();
        *self_rc.texture_index_count.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.texture_index_offset.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.marker_offset.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.unknown_count.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.unknown_section0.borrow_mut() = _io.read_bytes(24 as usize)?.into();
        *self_rc.pad1.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.unknown_floats0.borrow_mut() = Vec::new();
        let l_unknown_floats0 = 3;
        for _i in 0..l_unknown_floats0 {
            self_rc
                .unknown_floats0
                .borrow_mut()
                .push(_io.read_f4le()?.into());
        }
        *self_rc.pad2.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.unknown_floats1.borrow_mut() = Vec::new();
        let l_unknown_floats1 = 3;
        for _i in 0..l_unknown_floats1 {
            self_rc
                .unknown_floats1
                .borrow_mut()
                .push(_io.read_f4le()?.into());
        }
        *self_rc.unknown_section1.borrow_mut() = _io.read_bytes(20 as usize)?.into();
        *self_rc.primitive_start_index.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.primitive_length.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.primitive_index.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.texture_index.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.pad3.borrow_mut() = _io.read_bytes(12 as usize)?.into();
        *self_rc.marker.borrow_mut() = _io.read_bytes(4 as usize)?.into();
        Ok(())
    }
}
impl Mdl_TransparentPrimitiveHeader {}
impl Mdl_TransparentPrimitiveHeader {
    pub fn pad0(&self) -> Ref<Vec<u8>> {
        self.pad0.borrow()
    }
}

/**
 * There's only ever one, so could be wrong?
 */
impl Mdl_TransparentPrimitiveHeader {
    pub fn texture_index_count(&self) -> Ref<u32> {
        self.texture_index_count.borrow()
    }
}
impl Mdl_TransparentPrimitiveHeader {
    pub fn texture_index_offset(&self) -> Ref<u32> {
        self.texture_index_offset.borrow()
    }
}
impl Mdl_TransparentPrimitiveHeader {
    pub fn marker_offset(&self) -> Ref<u32> {
        self.marker_offset.borrow()
    }
}
impl Mdl_TransparentPrimitiveHeader {
    pub fn unknown_count(&self) -> Ref<u32> {
        self.unknown_count.borrow()
    }
}
impl Mdl_TransparentPrimitiveHeader {
    pub fn unknown_section0(&self) -> Ref<Vec<u8>> {
        self.unknown_section0.borrow()
    }
}
impl Mdl_TransparentPrimitiveHeader {
    pub fn pad1(&self) -> Ref<u32> {
        self.pad1.borrow()
    }
}
impl Mdl_TransparentPrimitiveHeader {
    pub fn unknown_floats0(&self) -> Ref<Vec<f32>> {
        self.unknown_floats0.borrow()
    }
}
impl Mdl_TransparentPrimitiveHeader {
    pub fn pad2(&self) -> Ref<u32> {
        self.pad2.borrow()
    }
}
impl Mdl_TransparentPrimitiveHeader {
    pub fn unknown_floats1(&self) -> Ref<Vec<f32>> {
        self.unknown_floats1.borrow()
    }
}
impl Mdl_TransparentPrimitiveHeader {
    pub fn unknown_section1(&self) -> Ref<Vec<u8>> {
        self.unknown_section1.borrow()
    }
}

/**
 * Offset into the triangle index array where the primitive begins.
 */
impl Mdl_TransparentPrimitiveHeader {
    pub fn primitive_start_index(&self) -> Ref<u32> {
        self.primitive_start_index.borrow()
    }
}

/**
 * The length of the primitive in the triangle index array.
 */
impl Mdl_TransparentPrimitiveHeader {
    pub fn primitive_length(&self) -> Ref<u32> {
        self.primitive_length.borrow()
    }
}

/**
 * Appears to be an array index for this primitive header.
 */
impl Mdl_TransparentPrimitiveHeader {
    pub fn primitive_index(&self) -> Ref<u32> {
        self.primitive_index.borrow()
    }
}
impl Mdl_TransparentPrimitiveHeader {
    pub fn texture_index(&self) -> Ref<u32> {
        self.texture_index.borrow()
    }
}
impl Mdl_TransparentPrimitiveHeader {
    pub fn pad3(&self) -> Ref<Vec<u8>> {
        self.pad3.borrow()
    }
}

/**
 * And that's a--an almost... magic... number...? Turns out this can be
 * [0x03, 0x03, 0x02, 0x02], or [0x03, 0x03, 0x01, 0x01].
 */
impl Mdl_TransparentPrimitiveHeader {
    pub fn marker(&self) -> Ref<Vec<u8>> {
        self.marker.borrow()
    }
}
impl Mdl_TransparentPrimitiveHeader {
    pub fn _io(&self) -> Ref<BytesReader> {
        self._io.borrow()
    }
}

#[derive(Default, Debug, Clone)]
pub struct Mdl_TransparentPrimitiveHeaderWrapper {
    pub _root: SharedType<Mdl>,
    pub _parent: SharedType<Mdl_Geometry>,
    pub _self: SharedType<Self>,
    transparent_primitive_header_size: RefCell<u32>,
    body: RefCell<OptRc<Mdl_TransparentPrimitiveHeader>>,
    _io: RefCell<BytesReader>,
    body_raw: RefCell<Vec<u8>>,
}
impl KStruct for Mdl_TransparentPrimitiveHeaderWrapper {
    type Root = Mdl;
    type Parent = Mdl_Geometry;

    fn read<S: KStream>(
        self_rc: &OptRc<Self>,
        _io: &S,
        _root: SharedType<Self::Root>,
        _parent: SharedType<Self::Parent>,
    ) -> KResult<()> {
        *self_rc._io.borrow_mut() = _io.clone();
        self_rc._root.set(_root.get());
        self_rc._parent.set(_parent.get());
        self_rc._self.set(Ok(self_rc.clone()));
        let _rrc = self_rc._root.get_value().borrow().upgrade();
        let _prc = self_rc._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        *self_rc.transparent_primitive_header_size.borrow_mut() = _io.read_u4le()?.into();
        *self_rc.body_raw.borrow_mut() = _io
            .read_bytes(
                ((*self_rc.transparent_primitive_header_size() as u32) - (4 as u32)) as usize,
            )?
            .into();
        let body_raw = self_rc.body_raw.borrow();
        let _t_body_raw_io = BytesReader::from(body_raw.clone());
        let t = Self::read_into::<BytesReader, Mdl_TransparentPrimitiveHeader>(
            &_t_body_raw_io,
            Some(self_rc._root.clone()),
            Some(self_rc._self.clone()),
        )?
        .into();
        *self_rc.body.borrow_mut() = t;
        Ok(())
    }
}
impl Mdl_TransparentPrimitiveHeaderWrapper {}
impl Mdl_TransparentPrimitiveHeaderWrapper {
    pub fn transparent_primitive_header_size(&self) -> Ref<u32> {
        self.transparent_primitive_header_size.borrow()
    }
}
impl Mdl_TransparentPrimitiveHeaderWrapper {
    pub fn body(&self) -> Ref<OptRc<Mdl_TransparentPrimitiveHeader>> {
        self.body.borrow()
    }
}
impl Mdl_TransparentPrimitiveHeaderWrapper {
    pub fn _io(&self) -> Ref<BytesReader> {
        self._io.borrow()
    }
}
impl Mdl_TransparentPrimitiveHeaderWrapper {
    pub fn body_raw(&self) -> Ref<Vec<u8>> {
        self.body_raw.borrow()
    }
}

#[derive(Default, Debug, Clone)]
pub struct Mdl_TransparentVertexData {
    pub _root: SharedType<Mdl>,
    pub _parent: SharedType<Mdl_Geometry>,
    pub _self: SharedType<Self>,
    x: RefCell<f32>,
    y: RefCell<f32>,
    z: RefCell<f32>,
    w: RefCell<f32>,
    bone_weights: RefCell<Vec<f32>>,
    normal_x: RefCell<f32>,
    normal_y: RefCell<f32>,
    normal_z: RefCell<f32>,
    unknown1: RefCell<Vec<u8>>,
    u: RefCell<f32>,
    v: RefCell<f32>,
    unknown2: RefCell<Vec<u8>>,
    bone_index: RefCell<u8>,
    unknown3: RefCell<u8>,
    bone_pair_index0: RefCell<u8>,
    unknown4: RefCell<u8>,
    bone_pair_index1: RefCell<u8>,
    unknown5: RefCell<u8>,
    bone_pair_index2: RefCell<u8>,
    unknown6: RefCell<u8>,
    _io: RefCell<BytesReader>,
}
impl KStruct for Mdl_TransparentVertexData {
    type Root = Mdl;
    type Parent = Mdl_Geometry;

    fn read<S: KStream>(
        self_rc: &OptRc<Self>,
        _io: &S,
        _root: SharedType<Self::Root>,
        _parent: SharedType<Self::Parent>,
    ) -> KResult<()> {
        *self_rc._io.borrow_mut() = _io.clone();
        self_rc._root.set(_root.get());
        self_rc._parent.set(_parent.get());
        self_rc._self.set(Ok(self_rc.clone()));
        let _rrc = self_rc._root.get_value().borrow().upgrade();
        let _prc = self_rc._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        *self_rc.x.borrow_mut() = _io.read_f4le()?.into();
        *self_rc.y.borrow_mut() = _io.read_f4le()?.into();
        *self_rc.z.borrow_mut() = _io.read_f4le()?.into();
        *self_rc.w.borrow_mut() = _io.read_f4le()?.into();
        if !((*self_rc.w() as f64) == (1 as f64)) {
            return Err(KError::ValidationFailed(ValidationFailedError {
                kind: ValidationKind::NotEqual,
                src_path: "/types/transparent_vertex_data/seq/3".to_string(),
            }));
        }
        *self_rc.bone_weights.borrow_mut() = Vec::new();
        let l_bone_weights = 4;
        for _i in 0..l_bone_weights {
            self_rc
                .bone_weights
                .borrow_mut()
                .push(_io.read_f4le()?.into());
        }
        *self_rc.normal_x.borrow_mut() = _io.read_f4le()?.into();
        *self_rc.normal_y.borrow_mut() = _io.read_f4le()?.into();
        *self_rc.normal_z.borrow_mut() = _io.read_f4le()?.into();
        let _tmpa = *self_rc.normal_z();
        if !(((((((((*self_rc.normal_x() as f32) * (*self_rc.normal_x() as f32)) as f64)
            + (((*self_rc.normal_y() as f32) * (*self_rc.normal_y() as f32)) as f64))
            as f64)
            + (((*self_rc.normal_z() as f32) * (*self_rc.normal_z() as f32)) as f64))
            as f64)
            - (1.0 as f64))
            < 0.05)
        {
            return Err(KError::ValidationFailed(ValidationFailedError {
                kind: ValidationKind::Expr,
                src_path: "/types/transparent_vertex_data/seq/7".to_string(),
            }));
        }
        *self_rc.unknown1.borrow_mut() = _io.read_bytes(4 as usize)?.into();
        *self_rc.u.borrow_mut() = _io.read_f4le()?.into();
        *self_rc.v.borrow_mut() = _io.read_f4le()?.into();
        *self_rc.unknown2.borrow_mut() = _io.read_bytes(8 as usize)?.into();
        *self_rc.bone_index.borrow_mut() = _io.read_u1()?.into();
        *self_rc.unknown3.borrow_mut() = _io.read_u1()?.into();
        *self_rc.bone_pair_index0.borrow_mut() = _io.read_u1()?.into();
        *self_rc.unknown4.borrow_mut() = _io.read_u1()?.into();
        *self_rc.bone_pair_index1.borrow_mut() = _io.read_u1()?.into();
        *self_rc.unknown5.borrow_mut() = _io.read_u1()?.into();
        *self_rc.bone_pair_index2.borrow_mut() = _io.read_u1()?.into();
        *self_rc.unknown6.borrow_mut() = _io.read_u1()?.into();
        Ok(())
    }
}
impl Mdl_TransparentVertexData {}

/**
 * The x-coordinate of the vertex.
 */
impl Mdl_TransparentVertexData {
    pub fn x(&self) -> Ref<f32> {
        self.x.borrow()
    }
}

/**
 * The y-coordinate of the vertex.
 */
impl Mdl_TransparentVertexData {
    pub fn y(&self) -> Ref<f32> {
        self.y.borrow()
    }
}

/**
 * The z-coordinate of the vertex.
 */
impl Mdl_TransparentVertexData {
    pub fn z(&self) -> Ref<f32> {
        self.z.borrow()
    }
}
impl Mdl_TransparentVertexData {
    pub fn w(&self) -> Ref<f32> {
        self.w.borrow()
    }
}
impl Mdl_TransparentVertexData {
    pub fn bone_weights(&self) -> Ref<Vec<f32>> {
        self.bone_weights.borrow()
    }
}

/**
 * The x-coordinate of the normal vector.
 */
impl Mdl_TransparentVertexData {
    pub fn normal_x(&self) -> Ref<f32> {
        self.normal_x.borrow()
    }
}

/**
 * The y-coordinate of the normal vector.
 */
impl Mdl_TransparentVertexData {
    pub fn normal_y(&self) -> Ref<f32> {
        self.normal_y.borrow()
    }
}

/**
 * The z-coordinate of the normal vector.
 */
impl Mdl_TransparentVertexData {
    pub fn normal_z(&self) -> Ref<f32> {
        self.normal_z.borrow()
    }
}
impl Mdl_TransparentVertexData {
    pub fn unknown1(&self) -> Ref<Vec<u8>> {
        self.unknown1.borrow()
    }
}

/**
 * The texture coordinate along the horizontal axis (x), from 0 to 1.
 */
impl Mdl_TransparentVertexData {
    pub fn u(&self) -> Ref<f32> {
        self.u.borrow()
    }
}

/**
 * The texture coordinate along the vertical axis (y), from 0 to 1.
 */
impl Mdl_TransparentVertexData {
    pub fn v(&self) -> Ref<f32> {
        self.v.borrow()
    }
}
impl Mdl_TransparentVertexData {
    pub fn unknown2(&self) -> Ref<Vec<u8>> {
        self.unknown2.borrow()
    }
}
impl Mdl_TransparentVertexData {
    pub fn bone_index(&self) -> Ref<u8> {
        self.bone_index.borrow()
    }
}
impl Mdl_TransparentVertexData {
    pub fn unknown3(&self) -> Ref<u8> {
        self.unknown3.borrow()
    }
}
impl Mdl_TransparentVertexData {
    pub fn bone_pair_index0(&self) -> Ref<u8> {
        self.bone_pair_index0.borrow()
    }
}
impl Mdl_TransparentVertexData {
    pub fn unknown4(&self) -> Ref<u8> {
        self.unknown4.borrow()
    }
}
impl Mdl_TransparentVertexData {
    pub fn bone_pair_index1(&self) -> Ref<u8> {
        self.bone_pair_index1.borrow()
    }
}
impl Mdl_TransparentVertexData {
    pub fn unknown5(&self) -> Ref<u8> {
        self.unknown5.borrow()
    }
}
impl Mdl_TransparentVertexData {
    pub fn bone_pair_index2(&self) -> Ref<u8> {
        self.bone_pair_index2.borrow()
    }
}
impl Mdl_TransparentVertexData {
    pub fn unknown6(&self) -> Ref<u8> {
        self.unknown6.borrow()
    }
}
impl Mdl_TransparentVertexData {
    pub fn _io(&self) -> Ref<BytesReader> {
        self._io.borrow()
    }
}

#[derive(Default, Debug, Clone)]
pub struct Mdl_VertexData {
    pub _root: SharedType<Mdl>,
    pub _parent: SharedType<Mdl_Geometry>,
    pub _self: SharedType<Self>,
    x: RefCell<f32>,
    y: RefCell<f32>,
    z: RefCell<f32>,
    bone_weight_0: RefCell<f32>,
    bone_weight_1: RefCell<f32>,
    bone_weight_2: RefCell<f32>,
    bone_weight_3: RefCell<f32>,
    normals: RefCell<Vec<i16>>,
    alignment: RefCell<u16>,
    u: RefCell<f32>,
    v: RefCell<f32>,
    bone_index_0: RefCell<u8>,
    bone_index_1: RefCell<u8>,
    bone_index_2: RefCell<u8>,
    bone_index_3: RefCell<u8>,
    _io: RefCell<BytesReader>,
}
impl KStruct for Mdl_VertexData {
    type Root = Mdl;
    type Parent = Mdl_Geometry;

    fn read<S: KStream>(
        self_rc: &OptRc<Self>,
        _io: &S,
        _root: SharedType<Self::Root>,
        _parent: SharedType<Self::Parent>,
    ) -> KResult<()> {
        *self_rc._io.borrow_mut() = _io.clone();
        self_rc._root.set(_root.get());
        self_rc._parent.set(_parent.get());
        self_rc._self.set(Ok(self_rc.clone()));
        let _rrc = self_rc._root.get_value().borrow().upgrade();
        let _prc = self_rc._parent.get_value().borrow().upgrade();
        let _r = _rrc.as_ref().unwrap();
        *self_rc.x.borrow_mut() = _io.read_f4le()?.into();
        *self_rc.y.borrow_mut() = _io.read_f4le()?.into();
        *self_rc.z.borrow_mut() = _io.read_f4le()?.into();
        *self_rc.bone_weight_0.borrow_mut() = _io.read_f4le()?.into();
        if !((*self_rc.bone_weight_0() as f64) >= (0 as f64)) {
            return Err(KError::ValidationFailed(ValidationFailedError {
                kind: ValidationKind::LessThan,
                src_path: "/types/vertex_data/seq/3".to_string(),
            }));
        }
        if !((*self_rc.bone_weight_0() as f64) <= (1 as f64)) {
            return Err(KError::ValidationFailed(ValidationFailedError {
                kind: ValidationKind::GreaterThan,
                src_path: "/types/vertex_data/seq/3".to_string(),
            }));
        }
        *self_rc.bone_weight_1.borrow_mut() = _io.read_f4le()?.into();
        if !((*self_rc.bone_weight_1() as f64) >= (0 as f64)) {
            return Err(KError::ValidationFailed(ValidationFailedError {
                kind: ValidationKind::LessThan,
                src_path: "/types/vertex_data/seq/4".to_string(),
            }));
        }
        if !((*self_rc.bone_weight_1() as f64) <= (1 as f64)) {
            return Err(KError::ValidationFailed(ValidationFailedError {
                kind: ValidationKind::GreaterThan,
                src_path: "/types/vertex_data/seq/4".to_string(),
            }));
        }
        *self_rc.bone_weight_2.borrow_mut() = _io.read_f4le()?.into();
        if !((*self_rc.bone_weight_2() as f64) >= (0 as f64)) {
            return Err(KError::ValidationFailed(ValidationFailedError {
                kind: ValidationKind::LessThan,
                src_path: "/types/vertex_data/seq/5".to_string(),
            }));
        }
        if !((*self_rc.bone_weight_2() as f64) <= (1 as f64)) {
            return Err(KError::ValidationFailed(ValidationFailedError {
                kind: ValidationKind::GreaterThan,
                src_path: "/types/vertex_data/seq/5".to_string(),
            }));
        }
        *self_rc.bone_weight_3.borrow_mut() = _io.read_f4le()?.into();
        if !((*self_rc.bone_weight_3() as f64) >= (0 as f64)) {
            return Err(KError::ValidationFailed(ValidationFailedError {
                kind: ValidationKind::LessThan,
                src_path: "/types/vertex_data/seq/6".to_string(),
            }));
        }
        if !((*self_rc.bone_weight_3() as f64) <= (1 as f64)) {
            return Err(KError::ValidationFailed(ValidationFailedError {
                kind: ValidationKind::GreaterThan,
                src_path: "/types/vertex_data/seq/6".to_string(),
            }));
        }
        *self_rc.normals.borrow_mut() = Vec::new();
        let l_normals = 3;
        for _i in 0..l_normals {
            self_rc.normals.borrow_mut().push(_io.read_s2le()?.into());
        }
        *self_rc.alignment.borrow_mut() = _io.read_u2le()?.into();
        if !((*self_rc.alignment() as u16) == (0 as u16)) {
            return Err(KError::ValidationFailed(ValidationFailedError {
                kind: ValidationKind::NotEqual,
                src_path: "/types/vertex_data/seq/8".to_string(),
            }));
        }
        *self_rc.u.borrow_mut() = _io.read_f4le()?.into();
        *self_rc.v.borrow_mut() = _io.read_f4le()?.into();
        *self_rc.bone_index_0.borrow_mut() = _io.read_u1()?.into();
        *self_rc.bone_index_1.borrow_mut() = _io.read_u1()?.into();
        let _tmpa = *self_rc.bone_index_1();
        if !(((*self_rc.bone_index_1() as u8) == (0 as u8))
            || (*self_rc.bone_index_1() == 255)
            || ((*self_rc.bone_weight_1() as f64) > (0 as f64)))
        {
            return Err(KError::ValidationFailed(ValidationFailedError {
                kind: ValidationKind::Expr,
                src_path: "/types/vertex_data/seq/12".to_string(),
            }));
        }
        *self_rc.bone_index_2.borrow_mut() = _io.read_u1()?.into();
        let _tmpa = *self_rc.bone_index_2();
        if !(((*self_rc.bone_index_2() as u8) == (0 as u8))
            || (*self_rc.bone_index_2() == 255)
            || ((*self_rc.bone_weight_2() as f64) > (0 as f64)))
        {
            return Err(KError::ValidationFailed(ValidationFailedError {
                kind: ValidationKind::Expr,
                src_path: "/types/vertex_data/seq/13".to_string(),
            }));
        }
        *self_rc.bone_index_3.borrow_mut() = _io.read_u1()?.into();
        let _tmpa = *self_rc.bone_index_3();
        if !(((*self_rc.bone_index_3() as u8) == (0 as u8))
            || (*self_rc.bone_index_3() == 255)
            || ((*self_rc.bone_weight_3() as f64) > (0 as f64)))
        {
            return Err(KError::ValidationFailed(ValidationFailedError {
                kind: ValidationKind::Expr,
                src_path: "/types/vertex_data/seq/14".to_string(),
            }));
        }
        Ok(())
    }
}
impl Mdl_VertexData {}

/**
 * The x-coordinate of the vertex.
 */
impl Mdl_VertexData {
    pub fn x(&self) -> Ref<f32> {
        self.x.borrow()
    }
}

/**
 * The y-coordinate of the vertex.
 */
impl Mdl_VertexData {
    pub fn y(&self) -> Ref<f32> {
        self.y.borrow()
    }
}

/**
 * The z-coordinate of the vertex.
 */
impl Mdl_VertexData {
    pub fn z(&self) -> Ref<f32> {
        self.z.borrow()
    }
}

/**
 * The first bone weight of the vertex.
 */
impl Mdl_VertexData {
    pub fn bone_weight_0(&self) -> Ref<f32> {
        self.bone_weight_0.borrow()
    }
}

/**
 * The second bone weight of the vertex.
 */
impl Mdl_VertexData {
    pub fn bone_weight_1(&self) -> Ref<f32> {
        self.bone_weight_1.borrow()
    }
}

/**
 * The third bone weight of the vertex.
 */
impl Mdl_VertexData {
    pub fn bone_weight_2(&self) -> Ref<f32> {
        self.bone_weight_2.borrow()
    }
}

/**
 * The fourth bone weight of the vertex.
 */
impl Mdl_VertexData {
    pub fn bone_weight_3(&self) -> Ref<f32> {
        self.bone_weight_3.borrow()
    }
}
impl Mdl_VertexData {
    pub fn normals(&self) -> Ref<Vec<i16>> {
        self.normals.borrow()
    }
}
impl Mdl_VertexData {
    pub fn alignment(&self) -> Ref<u16> {
        self.alignment.borrow()
    }
}

/**
 * The texture coordinate along the horizontal axis (x), from 0 to 1.
 */
impl Mdl_VertexData {
    pub fn u(&self) -> Ref<f32> {
        self.u.borrow()
    }
}

/**
 * The texture coordinate along the vertical axis (y), from 0 to 1.
 */
impl Mdl_VertexData {
    pub fn v(&self) -> Ref<f32> {
        self.v.borrow()
    }
}

/**
 * The first bone index. This indexes into the primitive bone array, not
 * the overall skeleton array!
 */
impl Mdl_VertexData {
    pub fn bone_index_0(&self) -> Ref<u8> {
        self.bone_index_0.borrow()
    }
}

/**
 * The second bone (or bone pair?) index.
 */
impl Mdl_VertexData {
    pub fn bone_index_1(&self) -> Ref<u8> {
        self.bone_index_1.borrow()
    }
}

/**
 * The third bone (or bone pair?) index.
 */
impl Mdl_VertexData {
    pub fn bone_index_2(&self) -> Ref<u8> {
        self.bone_index_2.borrow()
    }
}

/**
 * The fourth bone (or bone pair?) index.
 */
impl Mdl_VertexData {
    pub fn bone_index_3(&self) -> Ref<u8> {
        self.bone_index_3.borrow()
    }
}
impl Mdl_VertexData {
    pub fn _io(&self) -> Ref<BytesReader> {
        self._io.borrow()
    }
}
