import path from "path";
import { describe, expect, test } from "vitest";
import { fetchRawBytes, loadDramaDemoFromBytes } from "../load";
import SilentHillDramaDemo from "../kaitai/Dds";
import F2 from "../kaitai/F2";
import logger from "../objects/Logger";
import { at } from "../utils";
import fs from "fs";

test("should parse inu animation ", async () => {
  const inu = loadDramaDemoFromBytes(
    await fetchRawBytes(
      path.join(__dirname, "../../public/data/demo/inu/end_inu.dds")
    )
  );
  expect(inu).toBeDefined();
});

const ddsCache = new Map<
  string,
  {
    cutscene: SilentHillDramaDemo | undefined;
  }
>();
const loadDds = async (file: string) =>
  loadDramaDemoFromBytes(await fetchRawBytes(file));
const loadDdsWithCache = async (file: string) => {
  const cached = ddsCache.get(file);
  if (cached) {
    return cached;
  }

  const cutscene = await loadDds(file);
  ddsCache.set(file, { cutscene });
  return cutscene;
};

const getDirectories = (source: string) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => path.join(source, dirent.name));

describe("should parse all dds files without error", async () => {
  const inputDir = path.join(__dirname, "../../public/data");
  const folders = getDirectories(path.join(inputDir, "demo")).concat(
    getDirectories(path.join(inputDir, "demo2"))
  );

  for (const folder of folders) {
    const files = fs
      .readdirSync(folder)
      .filter((value) => value.endsWith(".dds"))
      .map((value) => path.join(folder, value));
    if (files.length === 0) {
      continue;
    }
    describe(folder, async () => {
      for (const file of files) {
        const cutscene = loadDdsWithCache(file);
        test(at(file.split("/"), -1) ?? file, async () => {
          await expect(cutscene).resolves.toBeDefined();
        });
      }
    });
  }
});

test("should cache dds files", () => {
  for (const file of ddsCache.keys()) {
    const { cutscene } = ddsCache.get(file) ?? {};
    if (cutscene === undefined) {
      continue;
    }
    expect(cutscene).toBeDefined();
  }
  expect(ddsCache.size).toEqual(130);
});

test("collect statistics", () => {
  expect(ddsCache.size).toEqual(130);
  const combinationCounts = new Map<
    `(${string}, 0x${string})`,
    { count: number; percent: number }
  >();
  const blockTypeCounts = new Map<string, number>();

  let minCamParam6 = Infinity;
  let maxCamParam6 = -Infinity;
  let minCamParam7 = Infinity;
  let maxCamParam7 = -Infinity;
  for (const file of ddsCache.keys()) {
    const { cutscene } = ddsCache.get(file) ?? {};
    if (cutscene === undefined) {
      continue;
    }
    if (!file.includes("end_inu")) continue;
    expect(cutscene).toBeDefined();
    cutscene.frames.forEach((frame) => {
      frame.instructions?.forEach((instruction) => {
        if (
          instruction.ddsBlock instanceof SilentHillDramaDemo.Empty ||
          instruction.ddsBlock instanceof SilentHillDramaDemo.DdsPlayKey
        ) {
          return;
        }

        instruction.ddsBlock?.info.forEach((info) => {
          const ddsBlockType =
            SilentHillDramaDemo.DramaDemo[instruction.ddsBlockType];
          const key = `(${ddsBlockType}, 0x${info.controlByte.toString(
            16
          )})` as const;
          const c = combinationCounts.get(key) ?? { count: 0, percent: 0 };
          const b = blockTypeCounts.get(ddsBlockType) ?? 0;
          combinationCounts.set(key, {
            count: c.count + 1,
            percent: ((c.count + 1) / (b + 1)) * 100,
          });
          blockTypeCounts.set(ddsBlockType, b + 1);
          if (
            instruction.ddsBlockType ===
            SilentHillDramaDemo.DramaDemo.PLAY_CAMERA
          ) {
            if (info.controlByte === 0x6) {
              if (!(info.ddsBlock instanceof F2)) {
                throw new Error("not an f2");
              }
              minCamParam6 = Math.min(minCamParam6, info.ddsBlock.floatValue);
              maxCamParam6 = Math.max(maxCamParam6, info.ddsBlock.floatValue);
              // logger.debug(info.ddsBlock.floatValue);
            } else if (info.controlByte === 0x7) {
              if (typeof info.ddsBlock !== "number") {
                throw new Error("not an f4");
              }
              minCamParam7 = Math.min(minCamParam7, info.ddsBlock);
              maxCamParam7 = Math.max(maxCamParam7, info.ddsBlock);
              // logger.debug(info.ddsBlock);
            } else if (info.ddsBlock) {
            }
          }
        });
      });
    });
  }
  logger.debug("Combinations of (block type, control byte):");
  logger.debug(
    Array.from(combinationCounts)
      .sort()
      .map((e) => `${e[0]} -> ${e[1].count} (${e[1].percent.toFixed(2)}%)`)
      .join("\n")
  );
  logger.debug("Counts of block types:");
  logger.debug(Array.from(blockTypeCounts).sort().join("\n"));

  logger.debug({ minCamParam6, maxCamParam6, minCamParam7, maxCamParam7 });
});
