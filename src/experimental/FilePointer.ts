export type FoldersRecord = Record<"folders", Record<string, unknown>>;
export type FilesRecord = Record<"files", readonly string[]>;
export type Directory = FoldersRecord & FilesRecord;

export type FolderNamesOf<X extends FoldersRecord> = keyof X["folders"];
export type FolderOf<
  X extends FoldersRecord,
  K extends keyof X["folders"]
> = X["folders"][K];
export type FilesOf<X extends FilesRecord> = X["files"][number];

export type Access<
  X extends Directory | string,
  Key extends string | never
> = X extends Directory
  ? Key extends keyof X["folders"]
    ? X["folders"][Key]
    : Key extends X["files"][number]
    ? X["files"][number] & Key
    : never
  : never;

export type Options<X extends Directory | string | never> = X extends Directory
  ? keyof X["folders"] | X["files"][number]
  : never;

type FPointerOptions<Parent extends Directory, Root extends Directory> = {
  parent: Parent;
  root: Root;
  path: (string | unknown)[];
  name?: string;
  indices?: number[];
};

export default class FilePointer<
  Folder extends Directory,
  Root extends Directory
> {
  private root: Root;
  private parent: Folder;
  private name?: string;

  private index: number;
  private path: (string | unknown)[];
  private indices: number[] | undefined;

  private pathString: string = "";

  public static indexingEnabled: boolean = true;
  private static cachedFolderNames = new Map<string, string[]>();
  public static sortFolderName?: (a: string, b: string) => number;

  public constructor(options: FPointerOptions<Folder, Root>) {
    const { root, parent, name, path, indices } = options;
    this.root = root;
    this.parent = parent;
    this.name = name;
    this.indices = indices;
    this.path = path;
    this.index = this.set(options);
  }

  public toString() {
    return this.pathString;
  }

  public get [Symbol.toStringTag]() {
    return this.toString();
  }

  public getIndex() {
    return this.index;
  }

  public getIndices() {
    return this.indices;
  }

  public getName() {
    return this.name;
  }

  public getFolderInfo() {
    return this.parent;
  }

  public getDepth() {
    return (this.indices?.length ?? this.path.length) - 1;
  }

  public files() {
    return this.parent.files;
  }

  public folders() {
    return this.parent.folders;
  }

  public isNullPointer() {
    return this.name === undefined && this.index < 0;
  }

  public set({ root, parent, name, path }: FPointerOptions<Folder, Root>) {
    this.root = root;
    this.parent = parent;
    this.name = name;
    this.index = name ? parent.files.indexOf(name) : -1;
    this.pathString = path
      .filter((v) => typeof v === "string")
      .map((v) => (v === "" ? "[null]" : v))
      .join("->");
    return this.index;
  }

  protected static computeFolderNames(
    record: Record<string, unknown>,
    cacheKey?: string
  ) {
    const sorted = Object.keys(record).sort(this.sortFolderName);
    if (cacheKey !== undefined) {
      this.cachedFolderNames.set(cacheKey, sorted);
    }
    return sorted;
  }

  public travel(depth: number, offset = 0) {
    if (!this.indices) {
      throw new Error("Indices must be computed to use `travel`");
    }

    let indices = this.indices.slice(0, depth + 1);
    for (let i = depth - indices.length; i >= 0; i--) {
      indices.push(0);
    }

    indices[depth] += offset;
    for (let d = depth + 1; d < indices.length; d++) {
      indices[d] = 0;
    }

    return FilePointer.fromIndexTuple(this.root, ...indices);
  }

  public step(offset: number) {
    let pointer: ReturnType<typeof this.travel> | undefined;
    let d = this.getDepth();

    while (d >= 0) {
      const current = this.travel(d, offset);
      if (!current || current.isNullPointer()) {
        d--;
        continue;
      }

      pointer = current;
      break;
    }

    if (!pointer) {
      return this.travel(0);
    }

    return pointer;
  }

  public next() {
    return this.step(1);
  }

  public prev() {
    return this.step(-1);
  }

  public static fromIndexTuple<
    ResultStructure extends Directory,
    RootStructure extends Directory
  >(structure: RootStructure, ...args: Array<number | undefined>) {
    let currentStructure: Directory = structure;
    let argIndex = 0;
    let path: string[] = args.map(() => "");
    let name: string | undefined = "root";

    if (!this.indexingEnabled) {
      throw new Error("Cannot invert indices if indexing is not enabled");
    }

    for (argIndex = 0; argIndex < args.length; argIndex++) {
      const arg = args[argIndex];
      if (arg === undefined) {
        continue;
      }

      let names = this.computeFolderNames(currentStructure.folders);
      const folderName = names[arg];

      if (folderName !== undefined) {
        path[argIndex] = folderName;
        name = folderName;
        currentStructure = currentStructure.folders[folderName] as Directory;
        continue;
      }

      const indexBoundary = names.length;
      const filename = currentStructure.files[arg - indexBoundary] as
        | string
        | undefined;

      path[argIndex] = filename ?? "";
      name = filename;

      break;
    }

    return new this<ResultStructure, typeof structure>({
      parent: currentStructure as ResultStructure,
      root: structure,
      name,
      path,
      indices: args.filter((a) => a !== undefined) as number[],
    });
  }

  protected static fromPath<
    ResultStructure extends Directory,
    RootStructure extends Directory
  >(structure: RootStructure, ...args: Array<string | undefined>) {
    let currentStructure: Directory = structure;
    let argIndex = 0;
    let indexVector = args.map(() => -1);
    let name: string | undefined = "root";

    for (argIndex = 0; argIndex < args.length; argIndex++) {
      const arg = args[argIndex];
      if (arg === undefined) {
        continue;
      }
      name = arg;

      let indexBoundary = 0;
      if (this.indexingEnabled !== false) {
        const cacheKey = args[argIndex - 1] ?? "root";
        let names = this.cachedFolderNames.get(cacheKey);
        if (names === undefined) {
          names = this.computeFolderNames(currentStructure.folders, cacheKey);
        }
        indexBoundary = names.length;

        const index = names.indexOf(arg);
        indexVector[argIndex] = index;
      }

      if (arg in currentStructure.folders) {
        currentStructure = currentStructure.folders[arg] as Directory;
        continue;
      }

      const index = currentStructure.files.indexOf(arg);
      if (index < 0) {
        name = undefined;
      }
      indexVector[argIndex] = index + indexBoundary;
      break;
    }

    return new this<ResultStructure, typeof structure>({
      parent: currentStructure as ResultStructure,
      root: structure,
      name: name,
      path: args,
      indices: indexVector.filter((i) => i !== -1),
    });
  }
}
