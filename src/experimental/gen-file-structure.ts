import fs from "fs";
import path from "path";
import SymbolPool, { SymbolInfo } from "./SymbolPool";

const buildFileTree = (
  filepath: string,
  symbolPool: SymbolPool,
  parent?: SymbolInfo
) => {
  const items = fs.readdirSync(filepath, { withFileTypes: true });
  const name = path.basename(filepath);

  const symbolInfo = symbolPool.createUniqueSymbol(name, parent);

  for (const item of items) {
    const fullPath = path.join(filepath, item.name);

    if (item.isDirectory()) {
      const substructure = buildFileTree(fullPath, symbolPool, symbolInfo);
      symbolInfo.substructures[substructure.name] = substructure;
    } else {
      symbolInfo.elements.push(item.name);
    }
  }

  return symbolInfo;
};

const generateTs = (pool: SymbolPool, PREFIX = "MuseumLib") => {
  // first generate any import declarations
  const importDecl = `import FilePointer, { Access, Options, SymbolEntry } from "./FilePointer";`;

  // now generate a big map of symbol name -> structure
  let symbolToStructureExport = `export const ${PREFIX} = {`;
  let definitions = "";
  let depth0Symbol: SymbolInfo | undefined = undefined;

  // iterate starting from the leaf nodes. `const` statements cannot be hoisted,
  // so we need to define the structures that have no dependencies first.
  for (let d = pool.getDepth(); d >= 0; d--) {
    for (const [name, info] of pool.symbols.entries()) {
      if (info.depth !== d) {
        continue;
      }
      if (info.depth === 0) {
        depth0Symbol = info;
      }

      // <definition>
      const symbol = `${PREFIX}_${name}`;
      definitions += `const ${symbol} = {`;

      // generate folder map: folder name -> pointer to folder structure
      definitions += `folders: {${Object.values(info.substructures)
        .map(
          (substruct) =>
            `"${substruct.description}": ${PREFIX}_${substruct.name}`
        )
        .join(", ")}},\n`;

      // generate file array
      definitions += `files: [${Object.values(info.elements)
        .map((file) => `"${file}"`)
        .join(", ")}],\n`;

      definitions += "} as const;\n";
      symbolToStructureExport += `"${name}": ${symbol},\n`;
      // </definition>
    }
  }

  // this is a rooted tree, so we need to find the root (the "depth 0 symbol")
  if (!depth0Symbol) {
    throw new Error("Did not find an entry point");
  }
  const prefixedRootName = `${PREFIX}.${depth0Symbol.name}`;
  symbolToStructureExport += "\n} as const;";

  // a class definition is exported extending the base class, inheriting its
  // static methods and overriding them with stronger typing
  let classdef = `\n\nexport default class ${PREFIX}FPointer<S extends SymbolEntry> extends FilePointer<S, typeof ${prefixedRootName}> {\n`;
  classdef += "public static new<\n";

  // gen ts types
  for (let d = 0; d < pool.getDepth(); d++) {
    classdef += `Depth${d}Arg extends Options<${
      d === 0 ? `typeof ${prefixedRootName}` : `Depth${d - 1}Value`
    }>,\n`;
    if (d !== pool.getDepth() - 1) {
      classdef += `Depth${d}Value extends Access<${
        d === 0 ? `typeof ${prefixedRootName}` : `Depth${d - 1}Value`
      }, Depth${d}Arg>,\n`;
    }
  }

  classdef += ">(\n";

  // gen args
  for (let d = 0; d < pool.getDepth(); d++) {
    classdef += `arg${d}?: Depth${d}Arg,\n`;
  }

  classdef += ") {\n";

  // gen body
  let typeparams = "";
  for (let d = pool.getDepth() - 2; d >= 0; d--) {
    typeparams += `Depth${d}Value extends SymbolEntry ? Depth${d}Value : \n`;
  }
  typeparams += "never";

  classdef += `return MuseumLibFPointer.followPath<${typeparams}>(${prefixedRootName},\n`;
  classdef += [...Array(pool.getDepth()).keys()]
    .map((d) => `arg${d}`)
    .join(",\n");
  classdef += `);`;
  classdef += "}}";

  return [importDecl, definitions, symbolToStructureExport, classdef].join(
    "\n"
  );
};

const main = () => {
  const directory = process.argv[2];

  if (!directory) {
    console.error("Please provide a folder path as an argument.");
    process.exit(1);
  }

  if (!fs.existsSync(directory) || !fs.lstatSync(directory).isDirectory()) {
    console.error("Provided path is not a valid directory.");
    process.exit(1);
  }

  const pool = new SymbolPool();
  buildFileTree(directory, pool);
  console.log(generateTs(pool));
};

main();
