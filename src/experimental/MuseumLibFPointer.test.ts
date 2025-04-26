import { assert, describe, expect, test } from "vitest";
import MuseumLibFPointer, { MuseumLib } from "./MuseumLibFPointer";

describe("MuseumLibFPointer", () => {
  test("get file pointer", () => {
    const fpointer = MuseumLibFPointer.new("sh3", "pcchr", "ch", "chdaa.mdl");
    expect(fpointer.getName()).toStrictEqual("chdaa.mdl");
    expect(fpointer.getFolderInfo().files.indexOf("chdaa.mdl")).toStrictEqual(
      fpointer.getIndex()
    );
    expect(fpointer.getFolderInfo()).toStrictEqual(MuseumLib.pcchrCh);
  });

  test("folder pointer", () => {
    const fpointer = MuseumLibFPointer.new("sh3", "sound", "sdb");
    expect(fpointer.toString()).toStrictEqual("sh3->sound->sdb");

    const parent = fpointer.getFolderInfo();
    expect(parent.files.every((file) => file.endsWith(".sdb"))).toBeTruthy();

    MuseumLibFPointer.new("sh3", "chr", "pl", "chhaa_basic2_flam.anm");
  });

  test("sh2", () => {
    const files = MuseumLibFPointer.new("sh2", "demo", "papa_agl").files();
    console.log(files);
  });

  test("vector repr", () => {
    const files = MuseumLibFPointer.new("sh2", "demo", "papa_agl");

    const indices = files.getIndices();
    assert(indices !== undefined);

    const inversion = MuseumLibFPointer.fromIndexTuple(
      MuseumLib.games,
      ...indices
    );
    expect(inversion.toString()).toEqual("sh2->demo->papa_agl");
  });

  test("traveling along levels", () => {
    const files = MuseumLibFPointer.new("sh3", "chr", "wp", "wp_sub.kg1");
    const indices = files.getIndices();
    assert(indices !== undefined);

    const newFiles = files.travel(0, -1);
    expect(newFiles.toString()).toEqual("sh2->bg->ap->ap.map");
  });
});
