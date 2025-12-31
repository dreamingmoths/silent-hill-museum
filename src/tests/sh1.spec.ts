import fs from "fs";
import path from "path";
import { describe, test, expect } from "vitest";
import { fetchArrayBuffer } from "../load";
import Ilm from "../kaitai/Ilm";
import Sh1anm from "../kaitai/Sh1anm";
import KaitaiStream from "../kaitai/runtime/KaitaiStream";
import { ilmToAnmAssoc, anmToIlmAssoc, ilmToTextureAssoc } from "../sh1/sh1";
import logger from "../objects/Logger";
import PsxTim from "../kaitai/PsxTim";

const ILM_PATH = path.join(__dirname, "../../public/sh1/CHARA");
const ANM_PATH = path.join(__dirname, "../../public/sh1/ANIM");

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

      const ilmBytes = await fetchArrayBuffer(path.join(ILM_PATH, ilmFile));
      const anmBytes = await fetchArrayBuffer(path.join(ANM_PATH, anmFile));

      const ilmStream = new KaitaiStream(ilmBytes);
      const ilm = new Ilm(ilmStream);
      expect(ilm).toBeDefined();
      expect(ilm.magic[0]).toEqual(0x30);

      const anmStream = new KaitaiStream(anmBytes);
      const anm = new Sh1anm(anmStream);
      expect(anm).toBeDefined();
    });

    const imageFile = ilmToTextureAssoc(ilmFile.replace(".ILM", "")) + ".TIM";
    test(`${imageFile}`, async () => {
      let imageBytes;
      try {
        imageBytes = await fetchArrayBuffer(path.join(ILM_PATH, imageFile));
      } catch (e) {
        return;
      }

      const imageStream = new KaitaiStream(imageBytes);
      const image = new PsxTim(imageStream);
      expect(image).toBeDefined();
      expect(image.bpp).toBe(0);
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

      const ilmBytes = await fetchArrayBuffer(path.join(ILM_PATH, ilmFile));
      const anmBytes = await fetchArrayBuffer(path.join(ANM_PATH, anmFile));

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
