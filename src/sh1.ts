// a lot of this code is duplicate and could be split off into helpers shared
// with sh2, but i'm okay with that for now :)

import {
  Bone,
  BufferGeometry,
  Float32BufferAttribute,
  InterpolateLinear,
  KeyframeTrack,
  Matrix3,
  Matrix4,
  Quaternion,
  QuaternionKeyframeTrack,
  Skeleton,
  Uint16BufferAttribute,
  Vector3,
  Vector3Like,
  VectorKeyframeTrack,
} from "three";
import Ilm from "./kaitai/Ilm";
import Sh1anm from "./kaitai/Sh1anm";
import { Tuple } from "./types/common";
import { BufferGeometryUtils } from "three/examples/jsm/Addons.js";

// I mostly just want to quickly create a prototype for sh1 support before
// making any big structural changes to the code

// 🔺 ------- model building ------- 🔺

export const createSh1Geometry = (ilm: Ilm, skeleton: Skeleton) => {
  let geom = new BufferGeometry();
  const bones = skeleton.bones;
  for (const bone of bones) {
    bone.updateMatrixWorld(true);
  }

  // first pass: collect metadata before making buffers
  let vertexBufferSize = 0;
  let uvBufferSize = 0;
  let boneBufferSize = 0;

  for (let objectIndex = 0; objectIndex < ilm.numObjs; objectIndex++) {
    const object = ilm.objs[objectIndex];
    const info = object.body;

    for (let primIndex = 0; primIndex < info.numPrims; primIndex++) {
      const prim = info.prims[primIndex];
      const isTriangle = prim.indices.v3 === 255;

      if (isTriangle) {
        vertexBufferSize += 9;
        uvBufferSize += 6;
        boneBufferSize += 12;
      } else {
        // split quads into two triangles. the PSX GPU does this as well
        vertexBufferSize += 18;
        uvBufferSize += 12;
        boneBufferSize += 24;
      }
    }
  }

  // second pass: make buffers
  const scratchpadBuffer = new Float32Array(128 * 4);
  const vertexBuffer = new Float32Array(vertexBufferSize);
  const uvBuffer = new Float32Array(uvBufferSize);
  const skinIndexBuffer = new Uint16Array(boneBufferSize);
  const skinWeightBuffer = new Float32Array(skinIndexBuffer);

  let vertexIndex = 0;
  let uvIndex = 0;
  let skinIndex = 0;

  const u = (x: number) => x / 0xff;
  const v = (x: number) => 2 * (1.0 - x / 0xff);
  const loadFromScratchpad = (uv: Ilm.Uv, index: number) => {
    vertexBuffer[vertexIndex] = scratchpadBuffer[index];
    vertexBuffer[vertexIndex + 1] = scratchpadBuffer[index + 1];
    vertexBuffer[vertexIndex + 2] = scratchpadBuffer[index + 2];
    vertexIndex += 3;

    uvBuffer[uvIndex] = u(uv.u);
    uvBuffer[uvIndex + 1] = v(uv.v);
    uvIndex += 2;

    skinIndexBuffer[skinIndex] = scratchpadBuffer[index + 3];
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
    const baseIndex = object.baseIndex;
    for (let zIndex = 0; zIndex < z.length; zIndex++) {
      const xyIndex = zIndex * 2;
      const bufferIndex = (zIndex + baseIndex) * 4;

      const vertex = new Vector3(xy[xyIndex], xy[xyIndex + 1], z[zIndex]);
      vertex.applyMatrix4(bones[boneIndex].matrixWorld);

      scratchpadBuffer[bufferIndex] = vertex.x;
      scratchpadBuffer[bufferIndex + 1] = vertex.y;
      scratchpadBuffer[bufferIndex + 2] = vertex.z;

      // stash the bone index, so if we reuse this we can know what bone it
      // belonged to
      scratchpadBuffer[bufferIndex + 3] = boneIndex;
    }

    // now build non-indexed triangle list and uvs
    for (let primIndex = 0; primIndex < info.numPrims; primIndex++) {
      const prim = info.prims[primIndex];

      const indices = prim.indices;
      let [i0, i1, i2, i3] = [
        indices.v0 * 4,
        indices.v1 * 4,
        indices.v2 * 4,
        indices.v3 * 4,
      ];

      // temporary patch until the active bone indices flag is implemented
      if (
        object.name.includes("RHAND2") ||
        object.name.includes("FLAURO") ||
        object.name.includes("KEY") ||
        object.name.includes("RAGLA")
      ) {
        i0 = 0;
        i1 = 0;
        i2 = 0;
      }

      const isQuad = indices.v3 != 0xff;

      // 2 -> 1 -> 0
      // ---------- 2 ----------
      loadFromScratchpad(prim.uv2, i2);

      // ---------- 1 ----------
      loadFromScratchpad(prim.uv1, i1);

      // ---------- 0 ----------
      loadFromScratchpad(prim.uv0, i0);

      if (isQuad) {
        // 1 -> 2 -> 3
        // ---------- 1 ----------
        loadFromScratchpad(prim.uv1, i1);

        // ---------- 2 ----------
        loadFromScratchpad(prim.uv2, i2);

        // ---------- 3 ----------
        loadFromScratchpad(prim.uv3, i3);
      }
    }
  }

  geom.setAttribute("position", new Float32BufferAttribute(vertexBuffer, 3));
  geom.setAttribute("skinIndex", new Uint16BufferAttribute(skinIndexBuffer, 4));
  geom.setAttribute(
    "skinWeight",
    new Float32BufferAttribute(skinWeightBuffer, 4)
  );
  geom.setAttribute("uv", new Float32BufferAttribute(uvBuffer, 2));
  geom = BufferGeometryUtils.mergeVertices(geom);

  return geom;
};

// 🩻 ------- skeleton building ------- 🩻

export const createSh1Skeleton = (anm: Sh1anm) => {
  const bones: Array<Bone> = [];

  const scale = (x: number) => x * (1 << anm.scaleLog2);
  for (let i = 0; i < anm.numBones; i++) {
    const restPose = anm.bindPoses[i];
    const parentBoneIndex = restPose.bone;

    // use the first frame as initial matrices
    const matrix = new Matrix4();
    const frameInfo = anm.frameData[i];

    let t: Vector3Like;
    if (frameInfo instanceof Sh1anm.Rotation) {
      t = restPose.translation;

      smatrix(matrix, frameInfo.value);
    } else {
      t = frameInfo;
    }
    matrix.setPosition(scale(t.x), scale(t.y), scale(t.z));

    const bone = new Bone();
    bone.name = `${i}`;
    bone.applyMatrix4(matrix);

    if (parentBoneIndex !== 0xff) {
      bones[parentBoneIndex].add(bone);
    }

    bones.push(bone);
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
  const boneCount = anm.bonesPerFrame;

  const TIME_SCALE = 5;
  const scale = (x: number) => x * (1 << anm.scaleLog2);

  const timeBuffer = new Float32Array(anm.numFrames);
  const transformBuffers: Array<Float32Array> = [];

  for (let boneIndex = 0; boneIndex < anm.numTranslationBones; boneIndex++) {
    transformBuffers[boneIndex] = new Float32Array(3 * anm.numFrames);
  }
  for (
    let boneIndex = anm.numTranslationBones;
    boneIndex < anm.bonesPerFrame;
    boneIndex++
  ) {
    transformBuffers[boneIndex] = new Float32Array(4 * anm.numFrames);
  }

  for (let i = 0; i < anm.frameData.length; i++) {
    const transform = anm.frameData[i];
    const boneIndex = i % boneCount;
    const frameIndex = Math.floor(i / boneCount);

    if (transform instanceof Sh1anm.Translation) {
      const buffer = transformBuffers[boneIndex];
      const bufferIndex = 3 * frameIndex;
      buffer[bufferIndex] = scale(transform.x);
      buffer[bufferIndex + 1] = scale(transform.y);
      buffer[bufferIndex + 2] = scale(transform.z);
    } else {
      const quat = new Quaternion().setFromRotationMatrix(
        smatrix(new Matrix4(), transform.value)
      );

      const buffer = transformBuffers[boneIndex];
      const bufferIndex = 4 * frameIndex;
      buffer[bufferIndex] = quat.x;
      buffer[bufferIndex + 1] = quat.y;
      buffer[bufferIndex + 2] = quat.z;
      buffer[bufferIndex + 3] = quat.w;
    }
  }
  for (let i = 0; i < anm.numFrames; i++) {
    timeBuffer[i] = i * TIME_SCALE;
  }

  const tracks: Array<KeyframeTrack> = [];
  for (let boneIndex = 0; boneIndex < anm.numTranslationBones; boneIndex++) {
    tracks.push(
      new VectorKeyframeTrack(
        `sh1model.bones[${boneIndex}].position`,
        timeBuffer,
        transformBuffers[boneIndex],
        InterpolateLinear
      )
    );
  }
  for (
    let boneIndex = anm.numTranslationBones;
    boneIndex < anm.bonesPerFrame;
    boneIndex++
  ) {
    tracks.push(
      new QuaternionKeyframeTrack(
        `sh1model.bones[${boneIndex}].quaternion`,
        timeBuffer,
        transformBuffers[boneIndex],
        InterpolateLinear
      )
    );
  }

  return tracks;
};

// 🗂️ ------- file structure associations ------- 🗂️
export const ilmToAnmArray = [
  ["HERO", "HR"],
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
  ["SIBYL", "SBL_LAST"],
  ["SNK", "SPD"],
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
