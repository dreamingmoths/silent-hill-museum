// a lot of this code is duplicate and could be split off into helpers shared
// with sh2, but i'm okay with that for now :)

import {
  Bone,
  BufferGeometry,
  DataTexture,
  Float32BufferAttribute,
  GLSL3,
  Int32BufferAttribute,
  InterpolateLinear,
  KeyframeTrack,
  Matrix3,
  Matrix4,
  Quaternion,
  QuaternionKeyframeTrack,
  RawShaderMaterial,
  RedIntegerFormat,
  Skeleton,
  Uint16BufferAttribute,
  UnsignedIntType,
  Vector2,
  Vector3,
  Vector3Like,
  VectorKeyframeTrack,
} from "three";
import Ilm from "./kaitai/Ilm";
import Sh1anm from "./kaitai/Sh1anm";
import { Tuple } from "./types/common";
import { BufferGeometryUtils } from "three/examples/jsm/Addons.js";
import { ANIMATION_FRAME_DURATION } from "./utils";
import PsxTim from "./kaitai/PsxTim";
import psx_frag from "./glsl/psx_frag.glsl?raw";
import psx_vert from "./glsl/psx_vert.glsl?raw";
import { clientState } from "./objects/MuseumState";

// I mostly just want to quickly create a prototype for sh1 support before
// making any big structural changes to the code

// 🔺 ------- model building ------- 🔺

type GeometryInit = {
  ilm: Ilm;
  skeleton: Skeleton;
  psxTim: PsxTim;
  subset?: Record<string, boolean>;
};

export const createSh1Geometry = (init: GeometryInit) => {
  const { ilm, skeleton, psxTim, subset } = init;
  let geom = new BufferGeometry();
  const bones = skeleton.bones;
  for (const bone of bones) {
    bone.updateMatrixWorld(true);
  }

  // first pass: collect metadata before making buffers
  let vertexBufferSize = 0;
  let boneBufferSize = 0;
  let uvBufferSize = 0;
  let normalScratchpadSize = 0;

  for (let objectIndex = 0; objectIndex < ilm.numObjs; objectIndex++) {
    const object = ilm.objs[objectIndex];
    const info = object.body;

    for (let primIndex = 0; primIndex < info.numPrims; primIndex++) {
      const prim = info.prims[primIndex];
      const isTriangle = prim.indices.v3 === 255;

      if (isTriangle) {
        uvBufferSize += 6;
        vertexBufferSize += 9;
        boneBufferSize += 12;
      } else {
        // split quads into two triangles. the PSX GPU does this as well
        uvBufferSize += 12;
        vertexBufferSize += 18;
        boneBufferSize += 24;
      }
    }

    normalScratchpadSize += 3 * info.numNormals;
  }

  // second pass: make buffers
  const SCRATCHPAD_STRIDE = 4 as const;
  const NORMAL_OFFSET = 128 * SCRATCHPAD_STRIDE;
  const SCRATCHPAD_SIZE = 256 * SCRATCHPAD_STRIDE;

  const scratchpadBuffer = new Float32Array(SCRATCHPAD_SIZE);
  const vertexBuffer = new Float32Array(vertexBufferSize);
  const normalBuffer = new Float32Array(vertexBufferSize);
  const uvBuffer = new Float32Array(uvBufferSize);
  const texInfoBuffer = new Int32Array(uvBufferSize);
  const skinIndexBuffer = new Uint16Array(boneBufferSize);
  const skinWeightBuffer = new Float32Array(skinIndexBuffer);

  let vertexIndex = 0;
  let uvIndex = 0;
  let skinIndex = 0;

  const u = (x: number) => x / (psxTim.img.width * 4);
  const v = (x: number) => x / psxTim.img.height;

  const loadFromScratchpad = (
    clut: Ilm.ClutIndex,
    tpage: number,
    uv: Ilm.Uv,
    vIndex: number,
    nIndex: number
  ) => {
    vertexBuffer[vertexIndex] = scratchpadBuffer[vIndex];
    vertexBuffer[vertexIndex + 1] = scratchpadBuffer[vIndex + 1];
    vertexBuffer[vertexIndex + 2] = scratchpadBuffer[vIndex + 2];

    normalBuffer[vertexIndex] = scratchpadBuffer[nIndex];
    normalBuffer[vertexIndex + 1] = scratchpadBuffer[nIndex + 1];
    normalBuffer[vertexIndex + 2] = scratchpadBuffer[nIndex + 2];
    vertexIndex += 3;

    uvBuffer[uvIndex] = u(uv.u);
    uvBuffer[uvIndex + 1] = v(uv.v);
    texInfoBuffer[uvIndex] = (tpage & 0x60) >> 4;
    texInfoBuffer[uvIndex + 1] = clut.y;
    uvIndex += 2;

    skinIndexBuffer[skinIndex] = scratchpadBuffer[vIndex + 3];
    skinIndexBuffer[skinIndex + 1] = 0;
    skinIndexBuffer[skinIndex + 2] = 0;
    skinIndexBuffer[skinIndex + 3] = 0;
    skinWeightBuffer[skinIndex] = 1;
    skinWeightBuffer[skinIndex + 1] = 0;
    skinWeightBuffer[skinIndex + 2] = 0;
    skinWeightBuffer[skinIndex + 3] = 0;
    skinIndex += 4;
  };

  for (let objectIndex = 0; objectIndex < ilm.numObjs; objectIndex++) {
    const id = ilm.idTable[objectIndex];
    const object = ilm.objs[id];
    const info = object.body;
    const boneIndex = object.boneIndex;

    // load vertices into the "scratchpad"
    const xy = info.vertexXy;
    const z = info.vertexZ;
    const normals = info.normals;
    const baseIndex = object.baseIndex;

    const worldMatrix = bones[boneIndex].matrixWorld;
    for (let zIndex = 0; zIndex < z.length; zIndex++) {
      const xyIndex = zIndex * 2;
      const bufferIndex = (zIndex + baseIndex) * SCRATCHPAD_STRIDE;

      const vertex = new Vector3(xy[xyIndex], xy[xyIndex + 1], z[zIndex]);
      vertex.applyMatrix4(worldMatrix);

      scratchpadBuffer[bufferIndex] = vertex.x;
      scratchpadBuffer[bufferIndex + 1] = vertex.y;
      scratchpadBuffer[bufferIndex + 2] = vertex.z;

      // stash the bone index, so if we reuse this we can know what bone it
      // belonged to
      scratchpadBuffer[bufferIndex + 3] = boneIndex;
    }

    const normalMatrix = new Matrix3().getNormalMatrix(worldMatrix);
    for (let normalsIndex = 0; normalsIndex < normals.length; normalsIndex++) {
      const svector = normals[normalsIndex];
      const nbufferIndex =
        NORMAL_OFFSET + (normalsIndex + object.normalBaseIndex) * 3;
      const normal = new Vector3(-svector.x, -svector.y, -svector.z);
      normal.applyNormalMatrix(normalMatrix);
      scratchpadBuffer[nbufferIndex] = normal.x;
      scratchpadBuffer[nbufferIndex + 1] = normal.y;
      scratchpadBuffer[nbufferIndex + 2] = normal.z;
    }

    // now build non-indexed triangle list and uvs
    for (let primIndex = 0; primIndex < info.numPrims; primIndex++) {
      const prim = info.prims[primIndex];
      const clutIndex = prim.clutIndex;

      const vIndices = prim.indices;
      let [i0, i1, i2, i3] = [
        vIndices.v0 * SCRATCHPAD_STRIDE,
        vIndices.v1 * SCRATCHPAD_STRIDE,
        vIndices.v2 * SCRATCHPAD_STRIDE,
        vIndices.v3 * SCRATCHPAD_STRIDE,
      ];
      const nIndices = prim.normalIndices;
      let [i4, i5, i6, i7] = [
        nIndices.v0 * 3 + NORMAL_OFFSET,
        nIndices.v1 * 3 + NORMAL_OFFSET,
        nIndices.v2 * 3 + NORMAL_OFFSET,
        nIndices.v3 * 3 + NORMAL_OFFSET,
      ];

      if (subset?.[object.name] === false) {
        i0 = 0;
        i1 = 0;
        i2 = 0;
        i3 = 0;
      }

      const isQuad = vIndices.v3 != 0xff;

      // 2 -> 1 -> 0
      // ---------- 2 ----------
      loadFromScratchpad(clutIndex, prim.tpageInfo, prim.uv2, i2, i6);

      // ---------- 1 ----------
      loadFromScratchpad(clutIndex, prim.tpageInfo, prim.uv1, i1, i5);

      // ---------- 0 ----------
      loadFromScratchpad(clutIndex, prim.tpageInfo, prim.uv0, i0, i4);

      if (isQuad) {
        // 1 -> 2 -> 3
        // ---------- 1 ----------
        loadFromScratchpad(clutIndex, prim.tpageInfo, prim.uv1, i1, i5);

        // ---------- 2 ----------
        loadFromScratchpad(clutIndex, prim.tpageInfo, prim.uv2, i2, i6);

        // ---------- 3 ----------
        loadFromScratchpad(clutIndex, prim.tpageInfo, prim.uv3, i3, i7);
      }
    }
  }

  geom.setAttribute("position", new Float32BufferAttribute(vertexBuffer, 3));
  geom.setAttribute("normal", new Float32BufferAttribute(normalBuffer, 3));
  geom.setAttribute("skinIndex", new Uint16BufferAttribute(skinIndexBuffer, 4));
  geom.setAttribute(
    "skinWeight",
    new Float32BufferAttribute(skinWeightBuffer, 4)
  );
  geom.setAttribute("uv", new Float32BufferAttribute(uvBuffer, 2));
  geom.setAttribute("texInfo", new Int32BufferAttribute(texInfoBuffer, 2));
  geom = BufferGeometryUtils.mergeVertices(geom);

  return geom;
};

// 🩻 ------- skeleton building ------- 🩻

export const createSh1Skeleton = (anm: Sh1anm) => {
  const bones: Array<Bone> = [];

  const scale = (x: number) => x * (1 << anm.scaleLog2);
  const frameInfo = anm.frames[0];

  for (let i = 0; i < anm.numBones; i++) {
    const boneInfo = anm.bones[i];

    const bone = new Bone();
    bone.name = `${i}`;

    // use the first frame as initial matrices
    const matrix = new Matrix4();

    let t: Vector3Like | undefined = undefined;
    if (boneInfo.rotationIndex >= 0) {
      t = boneInfo.bindTranslation;

      smatrix(matrix, frameInfo.rotations[boneInfo.rotationIndex].value);
    } else {
      t =
        frameInfo.translations[boneInfo.translationIndex] ??
        boneInfo.bindTranslation;
    }
    matrix.setPosition(scale(t.x), scale(t.y), scale(t.z));

    bone.applyMatrix4(matrix);

    bones.push(bone);
  }

  for (let i = 0; i < anm.numBones; i++) {
    const restPose = anm.bones[i];
    const parentBoneIndex = restPose.parent;
    if (parentBoneIndex >= 0) {
      bones[parentBoneIndex].add(bones[i]);
    }
  }

  return new Skeleton(bones);
};

const smatrix = (matrix: Matrix4, qMatrix: number[]) => {
  // q1.7
  const entries = qMatrix.map((v) => v / 0x80) as Tuple<number, 9>;
  matrix.setFromMatrix3(new Matrix3(...entries));
  return matrix;
};

// 🎬 ------- animation building ------- 🎬

export const createSh1Animation = (anm: Sh1anm) => {
  const boneCount = anm.numBones;

  const scale = (x: number) => x * (1 << anm.scaleLog2);

  const timeBuffer = new Float32Array(anm.numFrames);
  const transformBuffers: Array<{
    translations?: Float32Array;
    rotations?: Float32Array;
  }> = [];

  for (let boneIndex = 0; boneIndex < anm.numBones; boneIndex++) {
    const bone = anm.bones[boneIndex];
    transformBuffers[boneIndex] = {};
    if (bone.translationIndex >= 0) {
      transformBuffers[boneIndex].translations = new Float32Array(
        3 * anm.numFrames
      );
    }
    if (bone.rotationIndex >= 0) {
      transformBuffers[boneIndex].rotations = new Float32Array(
        4 * anm.numFrames
      );
    }
  }

  for (let frameIndex = 0; frameIndex < anm.frames.length; frameIndex++) {
    const frame = anm.frames[frameIndex];

    for (let boneIndex = 0; boneIndex < boneCount; boneIndex++) {
      const bone = anm.bones[boneIndex];
      const translations = transformBuffers[boneIndex].translations;
      const rotations = transformBuffers[boneIndex].rotations;

      if (translations && (boneIndex === 0 || bone.translationIndex !== 0)) {
        const transform = frame.translations[bone.translationIndex];

        const buffer = translations;
        const bufferIndex = 3 * frameIndex;
        buffer[bufferIndex] = scale(transform.x);
        buffer[bufferIndex + 1] = scale(transform.y);
        buffer[bufferIndex + 2] = scale(transform.z);
      }

      if (rotations) {
        const transform = frame.rotations[bone.rotationIndex];

        const quat = new Quaternion().setFromRotationMatrix(
          smatrix(new Matrix4(), transform.value)
        );

        const buffer = rotations;
        const bufferIndex = 4 * frameIndex;
        buffer[bufferIndex] = quat.x;
        buffer[bufferIndex + 1] = quat.y;
        buffer[bufferIndex + 2] = quat.z;
        buffer[bufferIndex + 3] = quat.w;
      }
    }
  }
  for (let i = 0; i < anm.numFrames; i++) {
    timeBuffer[i] = i * ANIMATION_FRAME_DURATION;
  }

  const tracks: Array<KeyframeTrack> = [];
  for (let boneIndex = 0; boneIndex < anm.numBones; boneIndex++) {
    const translations = transformBuffers[boneIndex].translations;
    const rotations = transformBuffers[boneIndex].rotations;
    if (translations) {
      tracks.push(
        new VectorKeyframeTrack(
          `sh1model.bones[${boneIndex}].position`,
          timeBuffer,
          translations,
          InterpolateLinear
        )
      );
    }
    if (rotations) {
      tracks.push(
        new QuaternionKeyframeTrack(
          `sh1model.bones[${boneIndex}].quaternion`,
          timeBuffer,
          rotations,
          InterpolateLinear
        )
      );
    }
  }

  return tracks;
};

// 🌠 ------- texture building ------- 🌠

const clut = (x: number) => (x / 31) * 255;

export const createSh1Material = (psxTim: PsxTim, bpp = 4) => {
  if (bpp !== 4) {
    throw new Error("BPP must be 4");
  }

  const clutInfo = psxTim.clut;
  const clutWidth = clutInfo.width;
  const clutHeight = clutInfo.height;
  const clutTexture = new Uint8Array(4 * clutWidth * clutHeight);

  let clutIndex = 0;
  for (let i = 0; i < psxTim.clut.body.length; i += 2) {
    const clut16 = psxTim.clut.body[i] | (psxTim.clut.body[i + 1] << 8);
    const r = clut(clut16 & 0x1f);
    const g = clut((clut16 >> 5) & 0x1f);
    const b = clut((clut16 >> 10) & 0x1f);
    const a = (clut16 >> 15) & 0x1;
    clutTexture[clutIndex] = r;
    clutTexture[clutIndex + 1] = g;
    clutTexture[clutIndex + 2] = b;

    const rgbIsZero = r + g + b === 0;
    if (rgbIsZero && a === 0) {
      clutTexture[clutIndex + 3] = 0;
    } else if (!rgbIsZero && a === 1) {
      clutTexture[clutIndex + 3] = 255; // should be semi-transparent
    } else {
      clutTexture[clutIndex + 3] = 255;
    }

    clutIndex += 4;
  }

  const imageWidth = psxTim.img.width * 4;
  const imageHeight = psxTim.img.height;
  const imageTexture = new Uint8Array(imageWidth * imageHeight);

  let pixelIndex = 0;
  for (let i = 0; i < psxTim.img.body.length; i += 2) {
    const clut4 = psxTim.img.body[i] | (psxTim.img.body[i + 1] << 8);
    imageTexture[pixelIndex] = clut4 & 0xf;
    imageTexture[pixelIndex + 1] = (clut4 >> 4) & 0xf;
    imageTexture[pixelIndex + 2] = (clut4 >> 8) & 0xf;
    imageTexture[pixelIndex + 3] = (clut4 >> 12) & 0xf;
    pixelIndex += 4;
  }

  const viewer = clientState.getTextureViewer();
  if (viewer) {
    viewer.attach([
      viewer.createDataTexture(imageTexture, imageWidth, imageHeight, {
        grayscale: true,
        interpolation: "nearest",
      }),
      viewer.createDataTexture(clutTexture, clutWidth, clutHeight, {
        grayscale: false,
        interpolation: "nearest",
      }),
    ]);
  }

  const clutDataTexture = new DataTexture(clutTexture, clutWidth, clutHeight);
  clutDataTexture.needsUpdate = true;

  const imgDataTexture = new DataTexture(
    new Uint32Array(imageTexture),
    imageWidth,
    imageHeight,
    RedIntegerFormat,
    UnsignedIntType
  );
  imgDataTexture.needsUpdate = true;

  const mat = new RawShaderMaterial({
    vertexShader: psx_vert,
    fragmentShader: psx_frag,
    uniforms: {
      clutTexture: { value: clutDataTexture },
      imgTexture: { value: imgDataTexture },
      imgSize: { value: new Vector2(imageWidth, imageHeight) },
      ambientLightColor: { value: new Vector3(1, 1, 1) },
      opacity: { value: 1 },
      alphaTest: { value: 0.01 },
      uTime: { value: 0 },
      lightingMode: { value: Sh1LightingMode.Matte },
    },
    glslVersion: GLSL3,
  });

  mat.uniformsNeedUpdate = true;

  return mat;
};

export const Sh1LightingMode = {
  Matte: 0,
  Diffuse: 1,
  Fancy: 2,
  NormalMap: 3,
} as const;

// 🗂️ ------- file structure associations ------- 🗂️
export const ilmToAnmArray = [
  ["BOS", "BOS"],
  ["BOS2", "BOS"],
  ["TDRA", "TDA"],
  ["BLISA", "BLS"],
  ["DARIA", "DA2"],
  ["DARIA", "TDA"],
  ["DARIA", "DA"],
  ["SIBYL", "SBL"],
  ["PRSD", "PRS"],
  ["LISA", "LS"],
  ["DG2", "DOG"],
  ["CLD3", "CLD2"],
  ["CLD4", "CLD2"],
  ["BD2", "BIRD"],
  ["BAR", "BAR_LAST"],
  ["KAU", "KAU2"],
  ["KAU", "KAU"],
  ["SIBYL", "SBL2"],
  ["HERO", "HR_E01"],
  ["HERO", "HR"],
  ["SIBYL", "SBL_LAST"],
  // ["SNK", "SPD"],
] as const;
type SpecialIlmName = (typeof ilmToAnmArray)[number][0];
type SpecialAnmName = (typeof ilmToAnmArray)[number][1];
const ilmToAnmMap = new Map(ilmToAnmArray);
const anmToIlmMap = new Map(
  ilmToAnmArray.map((pair) => pair.slice().reverse()) as Array<
    [SpecialAnmName, SpecialIlmName]
  >
);

export const ilmToAnmAssoc = (ilmName: string) => {
  let name = ilmName.toUpperCase().replace(".ILM", "");

  return (ilmToAnmMap.get(name as SpecialIlmName) ?? name) + ".ANM";
};
export const anmToIlmAssoc = (anmName: string) => {
  let name = anmName.toUpperCase().replace(".ANM", "");

  const ilmName = anmToIlmMap.get(name as SpecialAnmName);
  if (ilmName) {
    return ilmName + ".ILM";
  }

  if (name.endsWith("_LAST")) {
    return name.replace("_LAST", ".ILM");
  }

  return name + ".ILM";
};

export const ilmToTextureAssoc = (name: string) => {
  switch (name) {
    case "WRM":
      return "CHARA/WORM";
    case "BIRD":
      return "CHARA/REBIRD";
    case "MTH":
      return "CHARA/MOTH";
    case "MAN":
      return "TEST/DEV";
  }
  return `CHARA/${name}`;
};

export const ilmFiles = [
  "AR",
  "BAR",
  "BD2",
  "BFLU",
  "BIG",
  "BIRD",
  "BLISA",
  "BOS",
  // "BOS2",
  "BTFY",
  "CAT",
  "CKN",
  "CLD1",
  "CLD2",
  "CLD3",
  "CLD4",
  "COC",
  "DARIA",
  "DEAD",
  "DG2",
  "DOB",
  "DOC",
  "DOG",
  "EI",
  "FAT",
  "FRG",
  "HERO",
  "ICU",
  "JACK",
  "KAU",
  "LISA",
  "LITL",
  "MAN",
  "MAR",
  "MKY",
  "MSB",
  "MTH",
  "OST",
  "PRS",
  "PRSD",
  "ROD",
  "SIBYL",
  "SLT",
  "SNK",
  "SRL",
  "TAR",
  "TDRA",
  "WRM",
] as const;
