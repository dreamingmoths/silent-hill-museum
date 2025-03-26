import logger from "./objects/Logger";
import KaitaiStream from "./kaitai/runtime/KaitaiStream";
import SilentHillModel from "./kaitai/Mdl";
import SilentHillAnimation from "./kaitai/Anm";
import SilentHillDramaDemo from "./kaitai/Dds";

// We can write a more general version of this soon.

export type ModelCache = { [url: string]: SilentHillModel | undefined };
export const modelCache: ModelCache = {};

export type AnimationCache = { [url: string]: SilentHillAnimation | undefined };
export const animationCache: AnimationCache = {};

export const fetchRawBytes = async (url: string): Promise<ArrayBuffer> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not OK: ${response.statusText}`);
    }
    return await response.arrayBuffer();
  } catch (error) {
    logger.error("There was a problem with the fetch operation:", error);
    throw error;
  }
};

export const loadDramaDemoFromBytes = (bytes: ArrayBuffer) => {
  const stream = new KaitaiStream(bytes);
  const cutscene = new SilentHillDramaDemo(stream);
  cutscene._read();
  cutscene._fetchInstances();
  return cutscene;
};

export const loadModelFromBytes = (bytes: ArrayBuffer) => {
  const stream = new KaitaiStream(bytes);
  const model = new SilentHillModel(stream);
  model._read();
  model._fetchInstances();
  return model;
};

export const loadModelFromUrl = async (url: string) => {
  logger.info(`Attempting to load model ${url}`);
  if (url in modelCache) {
    return modelCache[url];
  }
  if (!url.endsWith(".mdl")) {
    logger.warn("Cannot load files other than .mdl.");
    return undefined;
  }
  const bytes = await fetchRawBytes(url);
  if (bytes.byteLength === 0) {
    logger.warn("File is empty.");
    modelCache[url] = undefined;
    return undefined;
  }
  const model = loadModelFromBytes(bytes);
  modelCache[url] = model;
  return model;
};

export const loadAnimationFromBytes = (
  bytes: ArrayBuffer,
  model: SilentHillModel
) => {
  const stream = new KaitaiStream(bytes);
  const animation = new SilentHillAnimation(
    stream,
    undefined,
    undefined,
    model
  );
  animation._read();
  animation._fetchInstances();
  return animation;
};

export const loadAnimationFromUrl = async (
  url: string,
  model: SilentHillModel
) => {
  logger.info(`Attempting to load animation ${url}`);
  if (url in animationCache) {
    return animationCache[url];
  }
  const bytes = await fetchRawBytes(url);
  if (bytes.byteLength === 0) {
    logger.warn("File is empty.");
    animationCache[url] = undefined;
    return undefined;
  }
  const animation = loadAnimationFromBytes(bytes, model);
  animationCache[url] = animation;
  return animation;
};
