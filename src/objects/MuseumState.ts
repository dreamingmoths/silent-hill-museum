import {
  chr2Folders,
  chrFolders,
  constructIndex,
  destructureIndex,
  fileArray,
  fileStructure,
  MuseumFile,
  travelAlongLevel,
} from "../sh2/files";
import {
  toggleWithBackground,
  onConfirm,
  showQuickModal,
  isAnyElementOpen,
  showContentWarningModal,
} from "../modals";
import { MaterialView } from "../sh2/model";
import SilentHillModel from "../kaitai/Mdl";
import { disposeResources, exportModel, mod, saveArrayBuffer } from "../utils";
import {
  AnimationAction,
  AnimationClip,
  AnimationMixer,
  Camera,
  Object3D,
  Vector3,
} from "three";
import TextureViewer, { TextureViewerStates } from "./TextureViewer";
import { editorState } from "./EditorState";
import { renderStructToContainer } from "../visualize-struct";
import { anmToMdlAssoc } from "../sh2/animation";
import anmList from "../assets/anm-list.json";
import Ilm from "../kaitai/Ilm";
import { ilmFiles } from "../sh1/sh1";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { favoriteSh3ModelFiles, sh3ModelFiles } from "../sh3/sh3";
import SilentHill3Model from "../kaitai/Sh3mdl";

export const START_INDEX = constructIndex("chr", "favorites", "inu.mdl");
const START_PATH_ARRAY = destructureIndex(START_INDEX);
export const FilePath = {
  RootFolder: 0,
  Folder: 1,
  File: 2,
} as const;
export const GAMES = [
  "Silent Hill 1",
  "Silent Hill 2",
  "Silent Hill 3",
] as const;

export default class MuseumState {
  public constructor() {
    if (typeof window === "undefined") {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const model = params.get("model");
    const game = params.get("game");
    const modelSplit = model?.split("-");

    switch (game) {
      case "sh1":
        this.uiParams["Game"] = "Silent Hill 1";
        this.uiParams["File (SH1)"] =
          (params.get("file") as (typeof ilmFiles)[number]) ?? "HERO";
        return;
      case "sh3":
        this.uiParams["Game"] = "Silent Hill 3";
        const [folder, name] = modelSplit!;
        this.uiParams["File (SH3)"] =
          (params.get("file") as (typeof sh3ModelFiles)[number]) ??
          `${folder}/${name}.mdl`;
        return;
    }

    if (modelSplit && modelSplit.length !== 3) {
      throw new Error(
        "Invalid model format. Expected exactly three parts separated by hyphens."
      );
    } else if (!modelSplit) {
      return;
    }
    this.uiParams["Game"] = "Silent Hill 2";
    modelSplit[2] += ".mdl";
    this.defaultStartIndex = constructIndex(
      ...(modelSplit as Parameters<typeof constructIndex>)
    );
    this.setFileIndex(this.defaultStartIndex);
    this.uiParams.Animation = this.suggestAnimationPath();
    this.updateUiFromState();
  }

  private fileIndex = START_INDEX;
  private filePathArray = START_PATH_ARRAY;
  public defaultStartIndex = START_INDEX;
  private glVersion = 2;
  private currentObject?: Object3D;
  private textureViewer?: TextureViewer;
  private mode: "viewing" | "edit" = "viewing";
  private saveRequested = false;
  private updateCallbacks: Array<() => void> = [];
  private onModeUpdate?: (previousMode: "viewing" | "edit") => void;
  public onAfterRender?: () => void;

  private currentViewerModel?: SilentHill3Model | SilentHillModel;
  private currentViewerIlm?: Ilm;
  private customModel?: {
    contents: Uint8Array;
    model: SilentHillModel;
  };
  private currentFile?: File;
  private currentAnimationClips: AnimationClip[] = [];

  public getCurrentContentName(): string {
    switch (this.uiParams["Game"]) {
      case "Silent Hill 1": {
        return this.uiParams["File (SH1)"];
      }

      case "Silent Hill 2": {
        return this.file;
      }

      case "Silent Hill 3": {
        return this.uiParams["File (SH3)"];
      }
    }

    throw new Error("Unknown game selected");
  }

  public setFileIndex(index: number) {
    this.fileIndex = index;
    this.computeFilePathArray();
    this.onUpdate();
  }

  public getFileIndex() {
    return this.fileIndex;
  }

  private computeFilePathArray() {
    this.filePathArray = destructureIndex(this.fileIndex);
  }

  public get rootFolder() {
    return this.filePathArray[FilePath.RootFolder];
  }

  public set rootFolder(rootFolder) {
    const newIndex = constructIndex(rootFolder);
    this.setFileIndex(newIndex + FilePath.File);
  }

  public get folder() {
    const folder = this.filePathArray[FilePath.Folder];
    return folder;
  }

  public set folder(folder) {
    const newIndex = constructIndex(this.rootFolder, folder);
    this.setFileIndex(newIndex + FilePath.Folder);
  }

  public get file() {
    return this.filePathArray[FilePath.File];
  }

  public set file(filename) {
    const newIndex = constructIndex(this.rootFolder, this.folder, filename);
    this.setFileIndex(newIndex);
  }

  public get fullPath() {
    return `/data/${clientState.rootFolder}/${clientState.folder}/${clientState.file}`;
  }

  public nextFile() {
    switch (this.uiParams["Game"]) {
      case "Silent Hill 1": {
        this.uiParams["File (SH1)"] =
          ilmFiles[
            (ilmFiles.indexOf(this.uiParams["File (SH1)"]) + 1) %
              ilmFiles.length
          ];
        this.onUpdate();
        return;
      }
      case "Silent Hill 3": {
        const sh3Index = this.getSh3ModelFiles().indexOf(
          `${clientState.uiParams["File (SH3)"]}`
        );
        if (sh3Index === favoriteSh3ModelFiles.length - 1) {
          if (this.uiParams["Favorites Mode"]) {
            if (!this.hasAcceptedContentWarning()) {
              showContentWarningModal(
                () => {
                  this.nextFile();
                  this.uiParams["Favorites Mode"] = false;
                },
                () => {
                  this.uiParams["Favorites Mode"] = true;
                }
              );
              return;
            } else {
              this.uiParams["Favorites Mode"] = false;
            }
          }
        }
        clientState.uiParams["File (SH3)"] =
          this.getSh3ModelFiles()[
            (sh3Index + 1) % this.getSh3ModelFiles().length
          ];
        this.onUpdate();
        break;
      }
      case "Silent Hill 2": {
        const newIndex = travelAlongLevel(
          this.fileIndex,
          FilePath.File,
          1,
          this.uiParams["Lock To Folder"]
        );
        this.setFileIndex(newIndex);
      }
    }
  }

  public previousFile() {
    switch (this.uiParams["Game"]) {
      case "Silent Hill 1": {
        this.uiParams["File (SH1)"] =
          ilmFiles[
            mod(
              ilmFiles.indexOf(this.uiParams["File (SH1)"]) - 1,
              ilmFiles.length
            )
          ];
        this.onUpdate();
        return;
      }
      case "Silent Hill 3": {
        const sh3Index = this.getSh3ModelFiles().indexOf(
          `${clientState.uiParams["File (SH3)"]}`
        );
        clientState.uiParams["File (SH3)"] =
          this.getSh3ModelFiles()[
            mod(sh3Index - 1, this.getSh3ModelFiles().length)
          ];
        this.onUpdate();
        break;
      }
      case "Silent Hill 2": {
        const newIndex = travelAlongLevel(
          this.fileIndex,
          FilePath.File,
          -1,
          this.uiParams["Lock To Folder"]
        );
        this.setFileIndex(newIndex);
      }
    }
  }

  public nextFolder() {
    const newIndex = travelAlongLevel(this.fileIndex, FilePath.Folder, -1);
    this.setFileIndex(newIndex + FilePath.Folder);
  }

  public previousFolder() {
    const newIndex = travelAlongLevel(this.fileIndex, FilePath.Folder, 1);
    this.setFileIndex(newIndex + FilePath.Folder);
  }

  public nextRootFolder() {
    const newIndex = travelAlongLevel(this.fileIndex, FilePath.RootFolder, 1);
    this.setFileIndex(newIndex + FilePath.File);
  }

  public previousRootFolder() {
    const newIndex = travelAlongLevel(this.fileIndex, FilePath.RootFolder, -1);
    this.setFileIndex(newIndex + FilePath.File);
  }

  public getPossibleFilenames() {
    const folders = fileStructure[this.rootFolder];
    return folders[this.folder as keyof typeof folders];
  }

  public getSh3ModelFiles() {
    if (this.uiParams["Favorites Mode"]) {
      return favoriteSh3ModelFiles;
    }
    return sh3ModelFiles;
  }

  public getPossibleFolders() {
    return this.rootFolder === "chr" ? chrFolders : chr2Folders;
  }

  public setOnUpdate(onUpdate: () => void) {
    this.subscribeToUpdates(onUpdate);
  }

  public triggerUpdate() {
    this.onUpdate();
  }

  public setOnModeUpdate(onUpdate: (mode: "viewing" | "edit") => void) {
    this.onModeUpdate = onUpdate;
  }

  public requestSave() {
    this.saveRequested = true;
  }

  public setCurrentViewerModel(
    model: SilentHill3Model | SilentHillModel | undefined
  ) {
    this.currentViewerIlm = undefined;
    this.currentViewerModel = model;
  }

  public setCurrentViewerIlm(ilm: Ilm | undefined) {
    this.currentViewerModel = undefined;
    this.currentViewerIlm = ilm;
  }

  public setCustomModel(model: typeof this.customModel) {
    this.customModel = model;
    if (this.saveRequested && model?.contents) {
      this.saveRequested = false;
      let filename: string = this.file;
      if (editorState.getSerializationParams().modelType === "NotexModel") {
        filename = filename.replace(".mdl", "_notex.mdl");
      }
      saveArrayBuffer(model.contents, filename);
    }
    this.onUpdate();
  }

  /**
   * Deletes a custom model and its state.
   */
  public releaseCustomModel() {
    this.customModel = undefined;
    editorState.resetSerializationState();
    disposeResources(editorState.cachedOriginalModel);
    editorState.cachedOriginalModel = undefined;
  }

  public getCustomModel() {
    return this.customModel;
  }

  public setCurrentFile(file: File) {
    this.currentFile = file;
  }

  public getCurrentFile() {
    return this.currentFile;
  }

  public setGlVersion(glVersion: 0 | 1 | 2) {
    this.glVersion = glVersion;
  }

  public getGlVersion() {
    return this.glVersion;
  }

  public setCurrentObject(object: Object3D) {
    this.currentObject = object;
  }

  public getCurrentObject() {
    return this.currentObject;
  }

  public setTextureViewer(viewer: TextureViewer) {
    this.textureViewer = viewer;
  }

  public getTextureViewer() {
    return this.textureViewer;
  }

  public hasAcceptedContentWarning() {
    if (typeof localStorage === "undefined") {
      return false;
    }
    return !!localStorage.getItem("contentWarningAcceptedV2");
  }

  public getMode() {
    return this.mode;
  }

  public setMode(mode: "viewing" | "edit") {
    const old = this.mode;
    const isEditMode = mode === "edit";
    this.mode = mode;
    this.uiParams["Edit Mode ✨"] = isEditMode;
    this.textureViewer?.setState(
      isEditMode || this.uiParams["Texture Viewer 👀"]
        ? TextureViewerStates.Locked
        : TextureViewerStates.Inactive
    );
    this.onModeUpdate?.(old);
    return mode;
  }

  public toggleMode() {
    this.setMode(this.mode === "viewing" ? "edit" : "viewing");
  }

  public updateUiFromState() {
    Object.assign(this.uiParams, {
      Scenario:
        this.rootFolder === "chr" ? "Main Scenario" : "Born From A Wish",
      Folder: this.folder,
      Filename: this.file,
    });
  }

  public getAllAnimationPaths() {
    // silly stuff, temporary
    let rootFolder = "";
    let anmFolder: string = "";
    const list: string[] = [];
    for (const name of anmList) {
      if (
        name === "demo" ||
        name === "demo2" ||
        name === "chr" ||
        name === "chr2"
      ) {
        rootFolder = name;
      }
      if (!name.includes(".anm")) {
        anmFolder = name;
        continue;
      }
      list.push(`${rootFolder}/${anmFolder}/${name}`);
    }
    return list;
  }

  public suggestAnimationPath() {
    let rootFolder = "";
    let anmFile: string = "";
    let anmFolder: string = "";
    let isDemo = false;
    for (const name of anmList) {
      if (
        name === "demo" ||
        name === "demo2" ||
        name === "chr" ||
        name === "chr2"
      ) {
        rootFolder = name;
      }
      if (!name.includes(".anm")) {
        if (name.includes("demo")) {
          isDemo = true;
        }
        anmFolder = name;
        continue;
      }
      let searchFolder = anmFolder;
      if (isDemo) {
        const index = fileArray.findIndex(
          (value) => value === name.replace(".anm", ".mdl")
        );
        if (index >= 0) {
          const [_, subfolder, __] = destructureIndex(index);
          searchFolder = subfolder;
        }
      }
      const mdl = anmToMdlAssoc(
        name,
        this.folder === "favorites" ? undefined : searchFolder,
        isDemo
      );
      if (mdl === `${this.folder}/${this.file}`) {
        anmFile = name;
        break;
      }
    }
    let path =
      anmFile && anmFolder
        ? `/data/${rootFolder}/${anmFolder}/${anmFile}`
        : undefined;
    if (this.file === "inu.mdl") {
      path = "/data/demo/inu/inu.anm";
    }
    if (this.file === "agl.mdl") {
      path = "/data/demo/fire_agl/agl.anm";
    }
    if (this.file === "hhh_jms.mdl") {
      path = "/data/demo/sankaku1/hhh_jms.anm";
    }

    return path;
  }

  public setCurrentAnimationClipsFromMixers(mixers: MuseumMixer[]) {
    const clips: AnimationClip[] = [];
    for (const mixer of mixers) {
      for (const action of mixer._actions) {
        clips.push(action.getClip());
      }
    }
    this.currentAnimationClips = clips;
    return clips;
  }

  public getCurrentAnimationClips() {
    return this.currentAnimationClips;
  }

  public subscribeToUpdates(callback: () => void) {
    this.updateCallbacks.push(callback);
    return () => {
      const index = this.updateCallbacks.indexOf(callback);
      if (index < 0) {
        return false;
      }
      this.updateCallbacks.splice(index, 1);
      return true;
    };
  }

  public notifyRenderFinished() {
    this.onAfterRender?.();
    this.onAfterRender = undefined;
  }

  private onUpdate() {
    this.updateCallbacks.forEach((callback) => callback());
  }

  private _prefersReducedMotion: boolean | undefined = undefined;
  public prefersReducedMotion() {
    const result =
      this._prefersReducedMotion ??
      !!window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
    this._prefersReducedMotion = result;
    return result;
  }

  public uiParams = {
    Game: "Silent Hill 3" /* randomArrayElement(GAMES) */,
    "File (SH1)": "LISA" as (typeof ilmFiles)[number],
    "File (SH3)": "pl/chhaa.mdl" as (typeof sh3ModelFiles)[number],
    "Favorites Mode": true,
    Scenario: this.rootFolder === "chr" ? "Main Scenario" : "Born From A Wish",
    Folder: this.folder,
    Filename: this.file,
    Animation: this.suggestAnimationPath() as string | undefined,
    "Edit Mode ✨": this.mode === "edit",
    "Texture Viewer 👀": false,
    "Lock To Folder": false,
    "Sharable Link": false,
    "Next File": () => this.nextFile(),
    "Previous File": () => this.previousFile(),
    "Save Image": () => (this.uiParams["Render This Frame"] = true),
    "View Structure 🔎": () => {
      if (isAnyElementOpen()) {
        return;
      }
      renderStructToContainer(
        showQuickModal(undefined, "struct-visualizer"),
        this.getCustomModel()?.model ??
          this.currentViewerModel ??
          this.currentViewerIlm ??
          {}
      );
    },
    "Export to GLTF": () => {
      const onReady = () => {
        toggleWithBackground("disclaimerModal", true);
        onConfirm(() => {
          const object = this.getCurrentObject();
          if (object === undefined) {
            return;
          }
          exportModel(
            object,
            this.getCurrentContentName(),
            this.getCurrentAnimationClips()
          );
          toggleWithBackground("blenderExportModal", true);
        });
      };
      if (
        this.uiParams.Game !== "Silent Hill 2" &&
        clientState.uiParams["CLUT Rendering"] !== "Atlas"
      ) {
        if (this.uiParams.Game !== "Silent Hill 1") {
          clientState.uiParams["Texture Viewer 👀"] = true;
        }
        clientState.uiParams["CLUT Rendering"] = "Atlas";
        this.onAfterRender = onReady;
        this.onUpdate();
      } else {
        onReady();
      }
    },

    "Auto-Rotate": false,
    "Bone Controls": false,
    "Controls Mode": "rotate",
    "Selected Bone": 0,

    "Render Opaque": true,
    "Render Transparent": true,
    "Skeleton Mode": this.glVersion === 2,
    "Show All Hand Poses": false,
    "Visualize Skeleton": false,
    "Visualize Normals": false,

    "CLUT Rendering": "PSX Shader",
    "Render Mode": MaterialView.Textured as string,
    "Ambient Color": 0xffffff,
    "Ambient Intensity": 1.0,
    Transparency: true,
    "Alpha Test": 0.01,
    "Invert Alpha": false,
    "Model Opacity": 1.0,
    "Render Side": "DoubleSide",
    Wrapping: "Default",
    "Fancy Lighting": false,

    "Render This Frame": false,
    "Content Warning Accepted": this.hasAcceptedContentWarning(),

    "Current Animation": "[none]",
    "Submeshes To Show": {} as Record<string, Record<string, boolean>>,
  };
}

export const clientState = new MuseumState();

/**
 * Preferred clientState.params for models that are best viewed with certain settings.
 * May be needed as certain properties haven't been reverse-engineered yet.
 */
export const preferredParams: {
  [File in MuseumFile]?: Partial<typeof clientState.uiParams>;
} = {
  "inu.mdl": {
    "Render Side": "FrontSide",
  },
  "nef.mdl": {
    "Render Side": "DoubleSide",
  },
  "i_radio.mdl": {
    Transparency: false,
    "Alpha Test": 0,
  },
  "noa.mdl": {
    "Render Side": "DoubleSide",
  },
  "nor.mdl": {
    "Render Side": "DoubleSide",
  },
  "rhhh_mar.mdl": {
    "Render Side": "BackSide",
  },
  "x_keygate.mdl": {
    "Invert Alpha": true,
  },
  "x_ringcopper.mdl": {
    "Alpha Test": 0,
  },
  "x_lighter.mdl": {
    "Alpha Test": 0,
  },
  "rlxx_mar.mdl": {
    "Render Side": "BackSide",
  },
  "rwp_colt.mdl": {
    "Render Side": "BackSide",
  },
};
export const cameraFix: {
  [File in MuseumFile]?: {
    cameraPosition: Vector3;
    controlsTarget: Vector3;
  };
} = {
  "bos.mdl": {
    controlsTarget: new Vector3(
      -58.17799245068679,
      -626.735509717446,
      -169.58143575897614
    ),
    cameraPosition: new Vector3(
      12.92254067950762,
      -573.3331804019333,
      943.5324793077427
    ),
  },
};
export const serializeViewState = (
  camera: Camera,
  orbitControls: OrbitControls,
  mixers?: AnimationMixer[]
) => {
  return {
    controlsTarget: orbitControls.target,
    cameraPosition: camera.position,
    mixers:
      mixers && mixers.length > 0
        ? mixers.map((mixer) => ({
            time: mixer.time,
            timeScale: mixer.timeScale,
          }))
        : undefined,
  };
};
export const defaultParams = Object.assign(
  {},
  ...Object.values(preferredParams).map((o) =>
    Object.fromEntries(
      Object.keys(o).map((k) => [
        k,
        clientState.uiParams[k as keyof typeof clientState.uiParams],
      ])
    )
  )
);

export type MuseumMixer = AnimationMixer & {
  _actions: AnimationAction[];
  isInuAnm?: boolean;
};
