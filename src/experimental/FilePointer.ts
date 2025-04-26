export type FoldersRecord = Record<"folders", Record<string, unknown>>;
export type FilesRecord = Record<"files", readonly string[]>;
export type FolderEntry = FoldersRecord & FilesRecord;

export type FolderNamesOf<X extends FoldersRecord> = keyof X["folders"];
export type FolderOf<
  X extends FoldersRecord,
  K extends keyof X["folders"]
> = X["folders"][K];
export type FilesOf<X extends FilesRecord> = X["files"][number];

export type Access<
  X extends FolderEntry | string,
  Key extends string | never
> = X extends FolderEntry
  ? Key extends keyof X["folders"]
    ? X["folders"][Key]
    : Key extends X["files"][number]
    ? X["files"][number] & Key
    : never
  : never;

export type Options<X extends FolderEntry | string | never> =
  X extends FolderEntry ? keyof X["folders"] | X["files"][number] : never;

export type Tuple<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : TupleOf<T, N, []>
  : never;
type TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N
  ? R
  : TupleOf<T, N, [T, ...R]>;

type FPointerOptions<T extends FolderEntry, R extends FolderEntry> = {
  parent: T;
  root: R;
  name: string;
  path: (string | unknown)[];
  indices?: number[];
};

export default class FilePointer<
  Folder extends FolderEntry,
  Root extends FolderEntry
> {
  private root: Root;
  private parent: Folder;
  private name: string;

  private index: number;
  private indices: number[] | undefined;

  private pathString: string = "";

  public static indexingEnabled: boolean = true;
  private static cachedFolderNames = new Map<string, string[]>();
  public static sortFolderName?: (a: string, b: string) => number;

  public constructor(options: FPointerOptions<Folder, Root>) {
    const { root, parent, name, indices } = options;
    this.root = root;
    this.parent = parent;
    this.name = name;
    this.indices = indices;
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

  public files() {
    return this.parent.files;
  }

  public folders() {
    return this.parent.folders;
  }

  public set({ parent, name, path }: FPointerOptions<Folder, Root>) {
    this.parent = parent;
    this.name = name;
    this.index = parent.files.indexOf(name);
    this.pathString = path.filter((v) => typeof v === "string").join("->");
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

  public travel(depth: number, offset: number) {
    if (!this.indices) {
      throw new Error("Indices must be computed to use `travel`");
    }
    const indices = this.indices.slice();
    indices[depth] += offset;
    for (let d = depth + 1; d < indices.length; d++) {
      indices[d] = 0;
    }
    return FilePointer.invertIndices(this.root, ...indices);
  }

  public static invertIndices<
    ResultStructure extends FolderEntry,
    RootStructure extends FolderEntry
  >(structure: RootStructure, ...args: Array<number | undefined>) {
    let currentStructure: FolderEntry = structure;
    let argIndex = 0;
    let path = args.map(() => "");

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
        currentStructure = currentStructure.folders[folderName] as FolderEntry;
        continue;
      }

      const indexBoundary = names.length;
      const filename = currentStructure.files[arg - indexBoundary];
      path[argIndex] = filename;
      break;
    }

    return new this<ResultStructure, typeof structure>({
      parent: currentStructure as ResultStructure,
      root: structure,
      name: path[path.length - 1] ?? "root",
      path,
      indices: args.filter((a) => a !== undefined) as number[],
    });
  }

  protected static followPath<
    ResultStructure extends FolderEntry,
    RootStructure extends FolderEntry
  >(structure: RootStructure, ...args: Array<string | undefined>) {
    let currentStructure: FolderEntry = structure;
    let argIndex = 0;
    let indexVector = args.map(() => -1);

    for (argIndex = 0; argIndex < args.length; argIndex++) {
      const arg = args[argIndex];
      if (arg === undefined) {
        continue;
      }

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
        currentStructure = currentStructure.folders[arg] as FolderEntry;
        continue;
      }

      const index = currentStructure.files.indexOf(arg);
      if (index < 0) {
        throw new Error("Critical: Invalid file pointer");
      }
      indexVector[argIndex] = index + indexBoundary;
      break;
    }

    return new this<ResultStructure, typeof structure>({
      parent: currentStructure as ResultStructure,
      root: structure,
      name: args[argIndex] ?? "pointer",
      path: args,
      indices: indexVector.filter((i) => i !== -1),
    });
  }
}
