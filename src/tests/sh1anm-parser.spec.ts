import fs from "fs";
import path from "path";
import { describe, test, expect } from "vitest";
import { fetchRawBytes } from "../load";
import Ilm from "../kaitai/Ilm";
import Sh1anm from "../kaitai/Sh1anm";
import KaitaiStream from "../kaitai/runtime/KaitaiStream";
import { ilmToAnmAssoc, anmToIlmAssoc } from "../sh1";
import logger from "../objects/Logger";

const ILM_PATH = path.join(__dirname, "../../public/sh1/CHARA");
const ANM_PATH = path.join(__dirname, "../../public/sh1/ANIM");

// just guesses

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
        const boneIndex = o.boneIndex;
        maxBoneIndex = Math.max(boneIndex, maxBoneIndex);
      }

      expect(anm.numBones).toBeGreaterThan(maxBoneIndex);

      if (anmFile === "SPD.ANM") {
        logger.debug(anm.numBones);
      }
      if (maxBoneIndex <= 22) {
        logger.debug(anmFile, ilmFile);
      }
    });
  });
});
