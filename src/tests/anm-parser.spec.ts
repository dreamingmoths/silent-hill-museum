import { describe, expect, test } from "vitest";

import fs from "fs";
import path from "path";

import KaitaiStream from "../kaitai/runtime/KaitaiStream";
import Mdl from "../kaitai/Mdl";
import Anm from "../kaitai/Anm";

import anmFileStructure from "./anm-structure.json";

const lfshStructure = anmFileStructure.chr;
const bfawStructure = anmFileStructure.chr2;
const lfshFolders = Object.keys(
  lfshStructure
) as (keyof typeof lfshStructure)[];

const map: {
  [folder: string]: { [filename: string]: { mdl: Buffer; anm: Buffer } };
} = {};

lfshFolders.forEach((folderName) => {
  map[folderName] = {};
  lfshStructure[folderName].forEach((filename) => {
    let mdlPath: string;
    switch (folderName) {
      case "jms":
        mdlPath = "jms/lll_jms.mdl";
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

    map[folderName][filename] = {
      mdl: fs.readFileSync(
        path.join(__dirname, `../../public/mdl/chr/${mdlPath}`)
      ),
      anm: fs.readFileSync(
        path.join(__dirname, `../../public/mdl/chr/${folderName}/${filename}`)
      ),
    };
  });
});

(["mar", "wp"] as const).forEach((folderName) => {
  bfawStructure[folderName].forEach((filename) => {
    const mdlPath =
      folderName === "mar" ? "mar/lxx_mar.mdl" : "wp/rwp_chinanife.mdl";
    map[folderName][filename] = {
      mdl: fs.readFileSync(
        path.join(__dirname, `../../public/mdl/chr2/${mdlPath}`)
      ),
      anm: fs.readFileSync(
        path.join(__dirname, `../../public/mdl/chr2/${folderName}/${filename}`)
      ),
    };
  });
});

for (const [folderName, fileMap] of Object.entries(map)) {
  describe(folderName, () => {
    for (const name in fileMap) {
      let anm: Anm | undefined = undefined;
      let error: unknown | undefined = undefined;
      try {
        const mdl = new Mdl(new KaitaiStream(fileMap[name].mdl));
        mdl._read();
        anm = new Anm(
          new KaitaiStream(fileMap[name].anm),
          undefined,
          undefined,
          mdl
        );
        anm._read();
        anm._fetchInstances();
      } catch (e) {
        console.log(e);
        error = e;
      }
      test(name, () => {
        expect(anm).toBeDefined();
        expect(error).toBeUndefined();
      });
    }
  });
}
