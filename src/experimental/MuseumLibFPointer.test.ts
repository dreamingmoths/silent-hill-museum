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
    const pointer = MuseumLibFPointer.new("sh2", "demo", "papa_agl");
    const files = pointer.files();
    expect(files.length).toBeGreaterThan(0);
    expect(pointer.isNullPointer()).toBeFalsy();
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
    const wpSub = MuseumLibFPointer.new("sh3", "chr", "wp", "wp_sub.kg1");
    const indices = wpSub.getIndices();
    assert(indices !== undefined);

    expect(wpSub.travel(0, -1).toString()).toEqual("sh2");
    expect(wpSub.travel(0, -1).travel(3).toString()).toEqual(
      "sh2->bg->ap->ap.map"
    );
  });

  test("null pointers", () => {
    const wpSub = MuseumLibFPointer.new("sh3", "chr", "wp", "wp_sub.kg1");
    const nullPtr = wpSub.travel(1, 1000);

    expect(nullPtr.isNullPointer()).toBeTruthy();
    expect(nullPtr.toString()).toEqual("sh3->[null]");
    expect(wpSub.isNullPointer()).toBeFalsy();

    const nil = MuseumLibFPointer.new(
      // @ts-expect-error
      "sh1",
      "cheryl"
    );
    expect(nil.isNullPointer()).toBeTruthy();
  });

  test("next", () => {
    const bg = MuseumLibFPointer.new("sh3", "chr", "bg");
    expect(bg.next().toString()).toEqual("sh3->chr->ch");
  });

  test("next files", () => {
    const wp = MuseumLibFPointer.new("sh3", "chr", "wp");
    const wpFiles = wp.files();

    const array: (string | undefined)[] = [];
    let current = wp.travel(3, 0);

    for (let i = 0; i < wpFiles.length; i++) {
      array.push(current.getName());
      current = current.next();
    }

    expect(array).toStrictEqual(wpFiles);
  });

  test("next + travel", () => {
    const cutscene = MuseumLibFPointer.new("sh2", "demo", "fire_agl")
      .travel(3)
      .next();
    expect(cutscene.toString()).toContain("agl.cls");
    expect(cutscene.travel(1).next().getFolderInfo()).toEqual(MuseumLib.demo2);
  });
});
