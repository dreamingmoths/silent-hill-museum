import fs from "fs";
import path from "path";
import { describe, test, expect } from "vitest";
import { fetchRawBytes } from "../load";
import Ilm from "../kaitai/Ilm";
import Sh1anm from "../kaitai/Sh1anm";
import KaitaiStream from "../kaitai/runtime/KaitaiStream";

const ILM_PATH = path.join(__dirname, "../../public/sh1/CHARA");
const ANM_PATH = path.join(__dirname, "../../public/sh1/ANIM");

// just guesses
const ilmToAnmArray = [
  ["HERO", "HR"],
  ["BOS2", "BOS"],
  ["TDRA", "TAR"],
  ["BLISA", "BLS"],
  ["DARIA", "DA"],
  ["DARIA", "DA2"],
  ["DARIA", "TDA"],
  ["SIBYL", "SBL"],
  ["PRSD", "PRS"],
  ["LISA", "LS"],
  ["DG2", "DOG"],
  ["CLD3", "CLD2"],
  ["CLD4", "CLD2"],
  ["BD2", "BIRD"],
  ["BAR", "BAR_LAST"],
  ["KAU", "KAU2"],
  ["SIBYL", "SBL2"],
  ["HERO", "HR_E01"],
  ["SIBYL", "SBL_LAST"],
  ["SNK", "SPD"],
] as const;
type SpecialIlmName = (typeof ilmToAnmArray)[number][0];
type SpecialAnmName = (typeof ilmToAnmArray)[number][1];

const ilmToAnmMap = new Map(ilmToAnmArray);

const ilmToAnmAssoc = (ilmName: string) => {
  let name = ilmName.toUpperCase().replace(".ILM", "");

  return (ilmToAnmMap.get(name as SpecialIlmName) ?? name) + ".ANM";
};

const anmToIlmMap = new Map(
  ilmToAnmArray.map((pair) => pair.slice().reverse()) as Array<
    [SpecialAnmName, SpecialIlmName]
  >
);

const anmToIlmAssoc = (anmName: string) => {
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

// TODO: parse the partial animations
// @ts-ignore
const parsePartialAnm = (baseAnm: Sh1anm, partialStream: KaitaiStream) => {
  baseAnm.magic = 0;
  baseAnm._m_frameData = undefined;
  baseAnm._io = partialStream;
  baseAnm.frameData; // access frame data to call setter
  return baseAnm;
};

const getFileList = (dir: string, ext: string) => {
  return fs
    .readdirSync(dir)
    .filter((file) => file.toUpperCase().endsWith(ext.toUpperCase()));
};

describe("ilm + sh1anm", () => {
  const ilmFiles = getFileList(ILM_PATH, ".ILM");
  const anmFiles = getFileList(ANM_PATH, ".ANM");

  ilmFiles.forEach((ilmFile) => {
    const anmFile = ilmToAnmAssoc(ilmFile);
    test(`${ilmFile} + ${anmFile}`, async () => {
      expect(anmFiles).toContain(anmFile);

      const ilmBytes = await fetchRawBytes(path.join(ILM_PATH, ilmFile));
      const anmBytes = await fetchRawBytes(path.join(ANM_PATH, anmFile));

      const ilmStream = new KaitaiStream(ilmBytes);
      const ilm = new Ilm(ilmStream);
      expect(ilm).toBeDefined();
      expect(ilm.magic[0]).toEqual(0x30);

      const anmStream = new KaitaiStream(anmBytes);
      const anm = new Sh1anm(anmStream);
      expect(anm).toBeDefined();
    });
  });

  anmFiles.forEach((anmFile) => {
    if (anmFile.startsWith("HB_") || anmFile.startsWith("HBM")) {
      return;
    }
    if (anmFile === "DUMMY.ANM") {
      return;
    }
    if (anmFile === "SPD.ANM") {
      // i don't know what this belongs to?
      return;
    }

    const ilmFile = anmToIlmAssoc(anmFile);
    test(`${anmFile} + ${ilmFile}`, async () => {
      expect(ilmFiles).toContain(ilmFile);

      const ilmBytes = await fetchRawBytes(path.join(ILM_PATH, ilmFile));
      const anmBytes = await fetchRawBytes(path.join(ANM_PATH, anmFile));

      const ilmStream = new KaitaiStream(ilmBytes);
      const ilm = new Ilm(ilmStream);
      expect(ilm).toBeDefined();
      expect(ilm.magic[0]).toEqual(0x30);

      const anmStream = new KaitaiStream(anmBytes);
      const anm = new Sh1anm(anmStream);
      expect(anm).toBeDefined();

      let maxBoneIndex = -1;
      for (const o of ilm.objs) {
        const boneIndex = parseInt(o._unnamed0);
        maxBoneIndex = Math.max(boneIndex, maxBoneIndex);
      }

      expect(anm.numBones).toBeGreaterThan(maxBoneIndex);

      if (anmFile === "SPD.ANM") {
        console.debug(anm.numBones);
      }
      if (maxBoneIndex <= 22) {
        console.debug(anmFile, ilmFile);
      }
    });
  });
});
