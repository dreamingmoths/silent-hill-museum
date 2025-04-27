import { beforeEach, describe, expect, test } from "vitest";
import SymbolTree from "./SymbolTree";

describe("symbol tree", () => {
  let tree: SymbolTree;
  beforeEach(() => {
    tree = new SymbolTree();
  });
  test("collisions", () => {
    const chr = tree.createUniqueSymbol("chr");
    const chr2 = tree.createUniqueSymbol("chr2");
    tree.createUniqueSymbol("mar", chr);
    tree.createUniqueSymbol("mar", chr2);

    expect(tree.get("chr")).toBeDefined();
    expect(tree.get("chr2")).toBeDefined();
    expect(tree.get("mar")).toBeUndefined();
    expect(tree.get("chrMar")).toBeDefined();
    expect(tree.get("chr2Mar")).toBeDefined();
  });
  test("more complex collisions", () => {
    const sh2 = tree.createUniqueSymbol("sh2");
    const favs = tree.createUniqueSymbol("favs");

    const sh2Chr = tree.createUniqueSymbol("chr", sh2);
    const favsChr = tree.createUniqueSymbol("chr", favs);
    tree.createUniqueSymbol("agl", sh2Chr);
    tree.createUniqueSymbol("agl", favsChr);

    expect(tree.get("sh2ChrAgl")).toBeDefined();
    expect(tree.get("favsChrAgl")).toBeDefined();
    expect(tree.get("agl")).toBeUndefined();
  });
  test("depth", () => {
    const sh2 = tree.createUniqueSymbol("sh2");
    const favs = tree.createUniqueSymbol("favs");
    expect(tree.getDepth()).toStrictEqual(0);

    const sh2Chr = tree.createUniqueSymbol("chr", sh2);
    const favsChr = tree.createUniqueSymbol("chr", favs);
    expect(tree.getDepth()).toStrictEqual(1);

    tree.createUniqueSymbol("agl", sh2Chr);
    tree.createUniqueSymbol("agl", favsChr);

    expect(tree.getDepth()).toStrictEqual(2);
  });
});
