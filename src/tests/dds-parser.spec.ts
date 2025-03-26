import path from "path";
import { describe, expect, test } from "vitest";
import { fetchRawBytes, loadDramaDemoFromBytes } from "../load";
import { globby } from "globby";

test("should parse inu animation ", async () => {
  const inu = loadDramaDemoFromBytes(
    await fetchRawBytes(
      path.join(__dirname, "../../public/data/demo/inu/end_inu.dds")
    )
  );
  expect(inu).toBeDefined();
});

describe("dds parser", async () => {
  const inputDir = path.join(__dirname, "../../public/data");
  const folders = (
    await globby([`${inputDir}/*/*`], { onlyDirectories: true })
  ).map((path) => path.split("data/").at(-1)!);

  for (const folder of folders) {
    const files = await globby([`${inputDir}/${folder}/*.dds`]);
    if (files.length === 0) {
      continue;
    }
    describe(folder, async () => {
      for (const file of files) {
        test(file.split("/").at(-1)!, async () => {
          const cutscene = loadDramaDemoFromBytes(await fetchRawBytes(file));
          expect(cutscene).toBeDefined();
        });
      }
    });
  }
});
