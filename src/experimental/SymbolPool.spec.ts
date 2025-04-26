import { beforeEach, describe, expect, test } from "vitest";
import SymbolPool from "./SymbolPool";

describe("symbol pool", () => {
  let pool: SymbolPool;
  beforeEach(() => {
    pool = new SymbolPool();
  });
  test("collisions", () => {
    const chr = pool.createUniqueSymbol("chr");
    const chr2 = pool.createUniqueSymbol("chr2");
    pool.createUniqueSymbol("mar", chr);
    pool.createUniqueSymbol("mar", chr2);

    expect(pool.get("chr")).toBeDefined();
    expect(pool.get("chr2")).toBeDefined();
    expect(pool.get("mar")).toBeUndefined();
    expect(pool.get("chrMar")).toBeDefined();
    expect(pool.get("chr2Mar")).toBeDefined();
  });
  test("more complex collisions", () => {
    const sh2 = pool.createUniqueSymbol("sh2");
    const favs = pool.createUniqueSymbol("favs");

    const sh2Chr = pool.createUniqueSymbol("chr", sh2);
    const favsChr = pool.createUniqueSymbol("chr", favs);
    pool.createUniqueSymbol("agl", sh2Chr);
    pool.createUniqueSymbol("agl", favsChr);

    expect(pool.get("sh2ChrAgl")).toBeDefined();
    expect(pool.get("favsChrAgl")).toBeDefined();
    expect(pool.get("agl")).toBeUndefined();
  });
  test("depth", () => {
    const sh2 = pool.createUniqueSymbol("sh2");
    const favs = pool.createUniqueSymbol("favs");
    expect(pool.getDepth()).toStrictEqual(0);

    const sh2Chr = pool.createUniqueSymbol("chr", sh2);
    const favsChr = pool.createUniqueSymbol("chr", favs);
    expect(pool.getDepth()).toStrictEqual(1);

    pool.createUniqueSymbol("agl", sh2Chr);
    pool.createUniqueSymbol("agl", favsChr);

    expect(pool.getDepth()).toStrictEqual(2);
  });
});
