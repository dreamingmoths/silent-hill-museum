import { describe, expect, test } from "vitest";

import SilentHillModel from "../kaitai/Mdl";
import SilentHillAnimation from "../kaitai/Anm";

import anmFileStructure from "../assets/anm-structure.json";
import { anmToMdlAssoc } from "../animation";
import { destructureIndex, fileArray } from "../files";
import { loadAnimationFromUrl, loadModelFromUrl } from "../load";
import path from "path";
import logger from "../objects/Logger";

const lfshStructure = anmFileStructure.chr;
const bfawStructure = anmFileStructure.chr2;
const demoLfshStructure = anmFileStructure.demo;
const demoBfawStructure = anmFileStructure.demo2;

const lfshFolders = Object.keys(
  lfshStructure
) as (keyof typeof lfshStructure)[];
const bfawFolders = Object.keys(
  bfawStructure
) as (keyof typeof bfawStructure)[];
const demoLfshFolders = Object.keys(
  demoLfshStructure
) as (keyof typeof demoLfshStructure)[];
const demoBfawFolders = Object.keys(
  demoBfawStructure
) as (keyof typeof demoBfawStructure)[];

const map: {
  [folder: string]: {
    [filename: string]: { anmPath: string; mdlPath: string };
  };
} = {};

lfshFolders.forEach((folderName) => {
  map[folderName] = {};
  lfshStructure[folderName].forEach((filename) => {
    let mdlPath: string = anmToMdlAssoc(filename, folderName);

    map[folderName][filename] = {
      mdlPath: `../../public/data/chr/${mdlPath}`,
      anmPath: `../../public/data/chr/${folderName}/${filename}`,
    };
  });
});
bfawFolders.forEach((folderName) => {
  bfawStructure[folderName].forEach((filename) => {
    const mdlSubpath =
      folderName === "mar" ? "mar/lxx_mar.mdl" : "wp/rwp_chinanife.mdl";
    map[folderName][filename] = {
      mdlPath: `../../public/data/chr2/${mdlSubpath}`,
      anmPath: `../../public/data/chr2/${folderName}/${filename}`,
    };
  });
});

demoLfshFolders.forEach((folderName) => {
  const mapKey = "[demo] " + folderName;
  map[mapKey] ??= {};
  demoLfshStructure[folderName].forEach((filename) => {
    const index = fileArray.findIndex(
      (value) =>
        value.includes(".mdl") && filename.split(".")[0] === value.split(".")[0]
    );
    if (index < 0) {
      return;
    }
    const [folder, subfolder, name] = destructureIndex(index);
    const mdlPath = `../../public/data/${folder}/${subfolder}/${name}`;
    const anmPath = `../../public/data/demo/${folderName}/${filename}`;
    map[mapKey][filename] = {
      mdlPath,
      anmPath,
    };
  });
});
demoBfawFolders.forEach((folderName) => {
  const mapKey = "[demo] " + folderName;
  map[mapKey] ??= {};
  demoBfawStructure[folderName].forEach((filename) => {
    const index = fileArray.findIndex(
      (value) =>
        value.includes(".mdl") && filename.split(".")[0] === value.split(".")[0]
    );
    if (index < 0) {
      return;
    }
    const [folder, subfolder, name] = destructureIndex(index);
    map[mapKey][filename] = {
      mdlPath: `../../public/data/${folder}/${subfolder}/${name}`,
      anmPath: `../../public/data/demo2/${folderName}/${filename}`,
    };
  });
});

for (const [folderName, fileMap] of Object.entries(map)) {
  describe(folderName, () => {
    for (const filename in fileMap) {
      test(filename, async () => {
        let mdl: SilentHillModel | undefined = undefined;
        let anm: SilentHillAnimation | undefined = undefined;
        let error: unknown | undefined = undefined;
        const { mdlPath, anmPath } = fileMap[filename];
        try {
          mdl = await loadModelFromUrl(path.join(__dirname, mdlPath));
          if (mdl === undefined) {
            throw new Error(`${fileMap[filename].mdlPath} failed to load`);
          }
          anm = await loadAnimationFromUrl(path.join(__dirname, anmPath), mdl);
          anm?._read();
          anm?._fetchInstances();
        } catch (e) {
          error = e;
          logger.debug(filename, e);
        }
        expect(mdl).toBeDefined();
        expect(anm).toBeDefined();
        expect(error).toBeUndefined();
      });
    }
  });
}
