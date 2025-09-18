import {
  Vector3,
  PointLight,
  VectorKeyframeTrack,
  InterpolateDiscrete,
  InterpolateLinear,
  NumberKeyframeTrack,
  ColorKeyframeTrack,
  Light,
} from "three";
import SilentHillDramaDemo from "./kaitai/Dds";
import F2 from "./kaitai/F2";
import logger from "./objects/Logger";
import { ANIMATION_FRAME_DURATION } from "./utils";

export const createCutsceneTracks = (
  dds: SilentHillDramaDemo | undefined,
  name: string
) => {
  if (!dds) {
    return {};
  }
  const ddsLights: Light[] = [];
  const cameraPositions: number[] = [];
  const cameraTargets: number[] = [];
  const characterPositions: number[] = [];
  const characterTimes: number[] = [];
  const cameraTimes: number[] = [];
  const cameraTargetTimes: number[] = [];
  const cameraFovs: number[] = [];
  const cameraFovTimes: number[] = [];
  const lightInfoMap: {
    color: { colors: number[]; times: number[] };
    range: { ranges: number[]; times: number[] };
    position: { positions: number[]; times: number[] };
  }[] = [];

  let characterOrigin = new Vector3(0, 0, 0);
  let cameraOrigin = new Vector3(0, 0, 0);
  let cameraTargetOrigin = new Vector3(0, 0, 0);
  let zoomOrigin = 1;

  const frames = dds.frames;
  const foundIndex = dds.characterNames.findIndex(
    (c) => c.name1.split("_pos")[0] === name?.replace(".mdl", "")
  );

  frameLoop: for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];
    if (!frame.instructions) {
      continue;
    }
    for (const instruction of frame.instructions) {
      if (instruction.ddsBlockType === 3) {
        const charaIndex = instruction.controlByte - dds.totalLightCount - 2;
        if (charaIndex !== foundIndex) {
          continue;
        }
        (
          instruction.ddsBlock as SilentHillDramaDemo.DdsPlayCharacter
        ).info.forEach((info) => {
          const block = info.ddsBlock;
          if (!block || block instanceof SilentHillDramaDemo.Empty) {
            return;
          }
          let position = new Vector3(block.x, block.y, block.z);
          if ((instruction.demoStatus & 0x02) > 0) {
            characterOrigin = position;
          } else {
            position.add(characterOrigin);
          }
          characterPositions.push(-position.x, position.y, -position.z);
          characterTimes.push(ANIMATION_FRAME_DURATION * i);
        });
      } else if (
        instruction.ddsBlock instanceof SilentHillDramaDemo.DdsPlayCamera
      ) {
        const SCALE = 1.14702;
        const TO_DEG = 180 / Math.PI;
        const getFovAngle = (z: number) =>
          2 * (Math.atan(256 / (SCALE * z)) * TO_DEG);
        instruction.ddsBlock.info.forEach((info) => {
          const block = info.ddsBlock;
          if (!block || block instanceof SilentHillDramaDemo.Empty) {
            return;
          } else if (typeof block === "number") {
            zoomOrigin = block;
            cameraFovs.push(getFovAngle(zoomOrigin));
            cameraFovTimes.push(ANIMATION_FRAME_DURATION * i);
            return;
          } else if (block instanceof F2) {
            cameraFovs.push(getFovAngle(zoomOrigin + block.floatValue));
            cameraFovTimes.push(ANIMATION_FRAME_DURATION * i);
            return;
          }
          let position = new Vector3(block.x, block.y, block.z);
          if (info.controlByte === 0x03) {
            if ((instruction.demoStatus & 0x02) > 0) {
              cameraOrigin = position;
            } else {
              position.add(cameraOrigin);
            }
            cameraPositions.push(-position.x, position.y, -position.z);
            cameraTimes.push(ANIMATION_FRAME_DURATION * i);
          } else {
            if ((instruction.demoStatus & 0x02) > 0) {
              cameraTargetOrigin = position;
            } else {
              position.add(cameraTargetOrigin);
            }
            cameraTargets.push(-position.x, position.y, -position.z);
            cameraTargetTimes.push(ANIMATION_FRAME_DURATION * i);
          }
        });
      } else if (
        instruction.ddsBlock instanceof SilentHillDramaDemo.DdsPlayLight
      ) {
        const lightIndex = instruction.controlByte - 2;
        const isPointLight = lightIndex < dds.pointLightCount;
        if (ddsLights[lightIndex] === undefined) {
          if (isPointLight) {
            const pointLight = new PointLight();
            pointLight.decay = 0.0025; // ??
            ddsLights[lightIndex] = pointLight;
          } else {
            continue;
          }
        }
        if (isPointLight) {
          const lightInfo: (typeof lightInfoMap)[number] = lightInfoMap[
            lightIndex
          ] ?? {
            color: {
              colors: [],
              times: [],
            },
            range: {
              ranges: [],
              times: [],
            },
            position: {
              positions: [],
              times: [],
            },
          };
          lightInfoMap[lightIndex] = lightInfo;
          instruction.ddsBlock.info.forEach((info) => {
            if (
              info.ddsBlock instanceof SilentHillDramaDemo.F2Vector ||
              info.ddsBlock instanceof SilentHillDramaDemo.F4Vector
            ) {
              const v = info.ddsBlock;
              if (info.controlByte === 0x8) {
                lightInfo.color.colors.push(0.5, 0.5, 0.5);
                lightInfo.color.times.push(ANIMATION_FRAME_DURATION * i);
              } else {
                lightInfo.position.positions.push(-v.x, v.y, -v.z);
                lightInfo.position.times.push(ANIMATION_FRAME_DURATION * i);
              }
            } else if (info.ddsBlock instanceof SilentHillDramaDemo.F2Vector2) {
              const v = info.ddsBlock;
              lightInfo.range.ranges.push(v.x); //, v.y);
              lightInfo.range.times.push(ANIMATION_FRAME_DURATION * i);
            }
          });
        }
      }
    }
  }
  const tracks = {
    character: [
      new VectorKeyframeTrack(
        `.position`,
        characterTimes,
        characterPositions,
        name === "b_hul.mdl" ? InterpolateDiscrete : InterpolateLinear
      ),
    ],
    camera: [
      new VectorKeyframeTrack(
        `.position`,
        cameraTimes,
        cameraPositions,
        InterpolateLinear
      ),
      new NumberKeyframeTrack(
        `.fov`,
        cameraFovTimes,
        cameraFovs,
        InterpolateDiscrete
      ),
    ],
    controls: [
      new VectorKeyframeTrack(
        `.target`,
        cameraTargetTimes,
        cameraTargets,
        InterpolateLinear
      ),
    ],
    lights: lightInfoMap.map((value) => [
      new VectorKeyframeTrack(
        ".position",
        value.position.times,
        value.position.positions,
        InterpolateDiscrete
      ),
      new ColorKeyframeTrack(
        ".color",
        value.color.times,
        value.color.colors,
        InterpolateDiscrete
      ),
      new NumberKeyframeTrack(
        ".distance",
        value.range.times,
        value.range.ranges,
        InterpolateDiscrete
      ),
    ]),
  };
  logger.debug({ cameraPositions });
  logger.debug({ lightInfo: lightInfoMap });
  logger.debug({ ddsLights });
  return { tracks, ddsLights };
};

export const INU_CUTSCENE_DURATION = 794 / 24;
