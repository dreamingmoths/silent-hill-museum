mod mdl;
use kaitai::{BytesReader, KResult, KStruct, OptRc};
use mdl::Mdl;
use std::{fs, path::Path};

const SH2_DATA_PATH: &str = "assets/sh2/data";

fn read_agl_mdl() -> OptRc<Mdl> {
    let agl_path = Path::new(SH2_DATA_PATH).join("chr/agl/agl.mdl");
    let Ok(stream) = BytesReader::open(&agl_path) else {
        panic!("Failed to read file at {}", agl_path.display());
    };

    let Ok(model): KResult<OptRc<Mdl>> = Mdl::read_into(&stream, None, None) else {
        panic!("Failed to parse mdl file");
    };

    println!("Chara ID: {}", model.header().character_id());
    println!("Vertex count: {}", model.model_data().vertex_count());

    model
}

fn main() {
    read_agl_mdl();
}
