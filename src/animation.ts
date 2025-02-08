import {
  Euler,
  Quaternion,
  VectorKeyframeTrack,
  InterpolateSmooth,
  QuaternionKeyframeTrack,
  Skeleton,
  Bone,
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
  let skipThisFrame = true; // ???

  const blocks = animation.blocks;
  const model = animation.model;

  for (let i = 0; i < blocks.length; i++) {
    const block: SilentHillAnimation.Block = blocks[i];

    for (let j = 0; j < 8; j += 1) {
      const boneIndex =
        (((i << 3) % block.numTransformsPerFrame) + j) %
        model.modelData.boneCount;
      if (boneIndex === 0) {
        // ignore every other frame?
        skipThisFrame = !skipThisFrame;
      }
      if (skipThisFrame) {
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
      if (transform === undefined) {
        break;
      }
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
            InterpolateSmooth
          )
        : undefined,
      rotation.length
        ? new QuaternionKeyframeTrack(
            `.bones[${index}].quaternion`,
            rotationTimes,
            rotation
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
const rotateAxisAngle = (
  boneInfo: BoneInfo,
  transform:
    | SilentHillAnimation.IsometryWithAxis16
    | SilentHillAnimation.IsometryWithAxis16Padded
    | SilentHillAnimation.IsometryWithAxis32
    | SilentHillAnimation.InterpolatedIsometry16
    | SilentHillAnimation.InterpolatedIsometry32
    | SilentHillAnimation.RotationWithAxis
) => {
  const quat = new Quaternion().setFromAxisAngle(
    {
      x: transform.axis.x,
      y: transform.axis.y,
      z: transform.axis.z,
    },
    transform.angle / 32768.0
  );
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
  if (translation instanceof SilentHillAnimation.Translation32) {
    boneInfo.position.push(translation.x, translation.y, translation.z);
  } else {
    boneInfo.position.push(
      translation.x.floatValue,
      translation.y.floatValue,
      translation.z.floatValue
    );
  }
  positionTimestamp(boneInfo);
};
const translateInterpolated = (
  boneInfo: BoneInfo,
  transform:
    | SilentHillAnimation.InterpolatedIsometry16
    | SilentHillAnimation.InterpolatedIsometry32
) => {
  // ???
  if (transform instanceof SilentHillAnimation.InterpolatedIsometry32) {
    boneInfo.position.push(
      transform.translationEnd.x,
      transform.translationEnd.y,
      transform.translationEnd.z
    );
  } else {
    boneInfo.position.push(
      transform.translationEnd.x.floatValue,
      transform.translationEnd.y.floatValue,
      transform.translationEnd.z.floatValue
    );
  }
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
  transform: AnimationTransform,
  boneInfo: BoneInfo
) => {
  if (transform === undefined) {
    return false;
  }
  if ("translation" in transform) {
    translate(boneInfo, transform.translation);
  } else if ("translationStart" in transform) {
    translateInterpolated(boneInfo, transform);
  }
  if ("axis" in transform) {
    rotateAxisAngle(boneInfo, transform);
  } else if ("rotation" in transform) {
    rotateEuler(boneInfo, transform.rotation);
  } else if (transform instanceof SilentHillAnimation.Rotation) {
    rotateEuler(boneInfo, transform);
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
