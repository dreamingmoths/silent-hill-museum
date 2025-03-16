import {
  Euler,
  Quaternion,
  VectorKeyframeTrack,
  QuaternionKeyframeTrack,
  Skeleton,
  Bone,
  InterpolateLinear,
} from "three";
import SilentHillAnimation from "./kaitai/Anm";

type BoneInfo = {
  bone: Bone;

  position: number[];
  positionTimes: number[];

  rotation: number[];
  rotationTimes: number[];

  timeCursor: number;
  frameDuration: number;
};
export const createAnimationTracks = (
  animation: SilentHillAnimation,
  skeleton: Skeleton
) => {
  const boneInfo: BoneInfo[] = [];
  const anmTypes = new Set<any>();

  const blocks = animation.blocks;
  const model = animation.model;

  for (let i = 0; i < blocks.length; i++) {
    const block: SilentHillAnimation.Block = blocks[i];

    for (let j = 0; j < 8; j++) {
      const boneIndex = ((i << 3) % block.numTransformsPerFrame) + j;
      if (boneIndex >= model.modelData.boneCount) {
        continue;
      }
      if (block.header[j] === undefined) {
        continue;
      }
      boneInfo[boneIndex] ??= {
        bone: skeleton.bones[boneIndex],
        position: [],
        positionTimes: [],
        rotation: [],
        rotationTimes: [],
        timeCursor: 0,
        frameDuration: 5,
      };
      const transform = block.transforms[j];
      if (!anmTypes.has(block.header[j].type)) {
        const typeName =
          SilentHillAnimation.TransformHeader.TransformType[
            block.header[j].type
          ];
        console.log(
          `block ${i} has header type ${block.header[j].type} (${typeName})`
        );
      }
      anmTypes.add(block.header[j].type);
      // if (block.header[j].type > 2) {
      //   // stop when we reach an invalid transform type
      //   i = blocks.length;
      //   break;
      // }
      processAnimationTransform(transform, boneInfo[boneIndex]);
    }
  }

  console.log({ boneInfo });
  console.log({ anmTypes });

  const tracks = boneInfo
    .flatMap(({ position, rotation, rotationTimes, positionTimes }, index) => [
      position.length
        ? new VectorKeyframeTrack(
            `.bones[${index}].position`,
            positionTimes,
            position,
            InterpolateLinear
          )
        : undefined,
      rotation.length
        ? new QuaternionKeyframeTrack(
            `.bones[${index}].quaternion`,
            rotationTimes,
            rotation,
            InterpolateLinear
          )
        : undefined,
    ])
    .filter((tr) => tr !== undefined);

  console.log({ tracks });

  return tracks;
};

const rotateEuler = (
  boneInfo: BoneInfo,
  rotation: SilentHillAnimation.Rotation
) => {
  const euler = new Euler().set(rotation.x, rotation.y, rotation.z, "ZYX");
  const quat = new Quaternion().setFromEuler(euler);
  boneInfo.rotation.push(quat.x, quat.y, quat.z, quat.w);
  rotationTimestamp(boneInfo);
};
const translate = (
  boneInfo: BoneInfo,
  translation:
    | SilentHillAnimation.Translation16
    | SilentHillAnimation.Translation16Padded
    | SilentHillAnimation.Translation32
) => {
  boneInfo.position.push(translation.x, translation.y, translation.z);
  positionTimestamp(boneInfo);
};
const rotationTimestamp = (boneInfo: BoneInfo) => {
  boneInfo.rotationTimes.push(boneInfo.timeCursor * boneInfo.frameDuration);
};
const positionTimestamp = (boneInfo: BoneInfo) => {
  boneInfo.positionTimes.push(boneInfo.timeCursor * boneInfo.frameDuration);
};
const advanceFrame = (boneInfo: BoneInfo) => {
  boneInfo.timeCursor++;
};

type AnimationTransform = SilentHillAnimation.Block["transforms"][number];
export const processAnimationTransform = (
  transform: AnimationTransform | undefined,
  boneInfo: BoneInfo
) => {
  if (transform && "translation" in transform && !("axis" in transform)) {
    translate(boneInfo, transform.translation);
    rotateEuler(boneInfo, transform.rotation);
  } else if (boneInfo.position.length) {
    boneInfo.position.push(...boneInfo.position.slice(-3));
    positionTimestamp(boneInfo);
  }

  if (transform instanceof SilentHillAnimation.Rotation) {
    rotateEuler(boneInfo, transform);
  } else if (boneInfo.rotation.length) {
    boneInfo.rotation.push(...boneInfo.rotation.slice(-4));
    rotationTimestamp(boneInfo);
  }

  advanceFrame(boneInfo);
};

export const anmToMdlAssoc = (
  filename: string,
  folderName?: string,
  isDemo = false
): string => {
  let mdlPath: string | undefined = undefined;
  folderName ??= filename.split(".")[0];

  switch (folderName) {
    case "jms":
      mdlPath = isDemo
        ? `jms/${filename.replace(".anm", ".mdl")}`
        : "jms/lll_jms.mdl";
      break;

    case "wp":
      mdlPath = "wp/wp_csaw.mdl";
      break;

    case "mar":
    case "edi":
      mdlPath = filename.startsWith("p_")
        ? `${folderName}/hhh_${folderName}.mdl`
        : `${folderName}/lll_${folderName}.mdl`;
      break;

    case "item":
      mdlPath =
        "item/" +
        (filename.startsWith("p_")
          ? filename.replace("p_", "")
          : filename
        ).replace(".anm", ".mdl");
      break;

    default:
      mdlPath = `${folderName}/${folderName}.mdl`;
  }
  return mdlPath;
};
