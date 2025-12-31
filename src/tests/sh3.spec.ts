import { describe, expect, test } from "vitest";
import {
  createSh3Geometry,
  createSh3Material,
  createSwizzleTextures,
  sh3ModelFiles,
} from "../sh3/sh3";
import path from "path";
import SilentHill3Model from "../kaitai/Sh3mdl";
import KaitaiStream from "../kaitai/runtime/KaitaiStream";
import { fetchArrayBuffer } from "../load";
import { at } from "../utils";

const SH3_PATH = path.join(__dirname, "../../public/sh3");
const SWIZZLES_PATH = path.join(__dirname, "../../public/swizzles");

describe("sh3 ps2 mdl", async () => {
  for (let i = 0; i < sh3ModelFiles.length; i++) {
    const filepath = sh3ModelFiles[i];
    const filename = at(filepath.split("/"), -1)!;

    const mdlBytes = await fetchArrayBuffer(path.join(SH3_PATH, filepath));
    const mdlStream = new KaitaiStream(mdlBytes);
    const model = new SilentHill3Model(mdlStream);
    const swizzles = await createSwizzleTextures(SWIZZLES_PATH);

    test(`${filename} (${filepath})`, () => {
      expect(model).toBeDefined();

      const { geometry, parts } = createSh3Geometry(model);

      let vertexCount = 0;
      for (const part of parts) {
        for (const group of part.vifData.groups) {
          vertexCount += group.numVertices;
        }
      }

      createSh3Material(model, swizzles, { device: "cpu" });
      expect(geometry.getAttribute("position").count).toStrictEqual(
        vertexCount
      );
    });
  }
});
