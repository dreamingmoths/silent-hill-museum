import { CamelCaseParser } from "./CamelCaseParser";

export type SymbolInfo = {
  name: string;
  description: string;
  substructures: Record<string, SymbolInfo>;
  elements: Array<string>;
  parent?: SymbolInfo;
  depth: number;
};
type SymbolMap = Map<string, SymbolInfo>;

/**
 * This "symbol tree" provides a way of generating unique names for elements in
 * a tree-like structure of strings.
 * @example ```ts
 *  const season = tree.createUniqueSymbol("season");
    const water = tree.createUniqueSymbol("water");
    tree.createUniqueSymbol("fall", season).name === "seasonFall";
    tree.createUniqueSymbol("fall", water).name === "waterFall";
 * ```
 */
export default class SymbolTree {
  public symbols: SymbolMap = new Map();
  private maxDepth = -1;

  public get(name: string) {
    return this.symbols.get(name);
  }

  public getDepth() {
    return this.maxDepth;
  }

  public createUniqueSymbol(symbolName: string, parent?: SymbolInfo) {
    const symbols = this.symbols;

    symbolName = this.sanitizeSymbolName(symbolName);
    let symbolInfo = symbols.get(symbolName);
    if (symbolInfo === undefined) {
      // No collision, set the symbol.
      symbolInfo = this.createSymbol({ parent: parent, name: symbolName });
      return symbolInfo;
    }

    if (parent === undefined) {
      throw new Error("Parent must be specified to handle collisions");
    }

    const existingParent = symbolInfo.parent;
    if (existingParent === undefined) {
      throw new Error(`Symbol ${symbolName} has no parent`);
    }
    const newName = this.buildSymbolName(existingParent.name, symbolName);
    this.renameSymbol(symbolName, newName);

    return this.createSymbol({
      parent: parent,
      name: this.buildSymbolName(parent.name, symbolName),
    });
  }

  private sanitizeSymbolName(symbolName: string) {
    return symbolName.replace(/\s/g, "_").replace(/[^A-Za-z0-9_]/g, "");
  }

  private buildSymbolName(...values: string[]) {
    return CamelCaseParser.toCamelCase(...values);
  }

  private createSymbol(
    info: Partial<SymbolInfo> & { name: string }
  ): SymbolInfo {
    const name = info.name;
    const camel = new CamelCaseParser(name);

    const depth = (info.parent?.depth ?? -1) + 1;
    this.maxDepth = Math.max(depth, this.maxDepth);

    const symbolInfo = {
      description: camel.last().toLowerCase(),
      substructures: {},
      elements: [],
      depth: depth,
      ...info,
    };
    this.symbols.set(name, symbolInfo);
    return symbolInfo;
  }

  public renameSymbol(deadName: string, newName: string) {
    const symbols = this.symbols;
    const symbolInfo = symbols.get(deadName);

    if (symbolInfo === undefined) {
      throw new Error(`Failed to rename symbol - cannot resolve ${deadName}`);
    }

    symbols.delete(deadName);
    const parent = symbolInfo?.parent;
    if (parent === undefined) {
      throw new Error(
        `Collision on "${deadName}" and cannot automatically generate new name`
      );
    }
    symbolInfo.name = newName;
    symbols.set(newName, symbolInfo);

    return symbolInfo;
  }
}
