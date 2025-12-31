import {
  bindSkeletonToGeometry,
  bindSkeletonToTransparentGeometry,
  createGeometry,
  createMaterial,
  createSkeleton,
  defaultDiffuseMap,
  MaterialType,
  MaterialView,
} from "./sh2/model";
import {
  loadAnimationFromUrl,
  loadModelFromUrl,
  loadModelFromBytes,
  loadDramaDemoFromBytes,
  fetchArrayBuffer,
} from "./load";
import {
  cameraFix,
  clientState,
  defaultParams,
  MuseumMixer,
  preferredParams,
  START_INDEX,
} from "./objects/MuseumState";
import {
  ANIMATION_FRAME_DURATION,
  createRainbowLights,
  disposeResources,
  exportCanvas,
  fitCameraToSelection,
  RenderSideMap,
  WrapMap,
} from "./utils";
import {
  WebGLRenderer,
  Object3D,
  PerspectiveCamera,
  Scene,
  Group,
  SkeletonHelper,
  AmbientLight,
  Skeleton,
  Mesh,
  SkinnedMesh,
  Color,
  ColorManagement,
  SRGBColorSpace,
  ACESFilmicToneMapping,
  PMREMGenerator,
  Clock,
  WebGL1Renderer,
  Material,
  SphereGeometry,
  MeshBasicMaterial,
  Bone,
  RepeatWrapping,
  ClampToEdgeWrapping,
  AnimationClip,
  AnimationMixer,
  MeshStandardMaterial,
  FrontSide,
  DataTexture,
  RawShaderMaterial,
  AnimationAction,
  KeyframeTrack,
} from "three";
import {
  GLTFLoader,
  OrbitControls,
  TransformControls,
  VertexNormalsHelper,
  WebGL,
} from "three/examples/jsm/Addons.js";
import {
  closeAllElements,
  initializeModals,
  isAnyElementOpenOtherThan,
  isElementOpen,
  showContentWarningModal,
  showNotSupportedModal,
  showQuickModal,
  toggleWithBackground,
} from "./modals";
import {
  chrFolders,
  destructureIndex,
  fileArray,
  MuseumFile,
} from "./sh2/files";
import GUI, { Controller } from "lil-gui";
import { acceptModelDrop, applyUpdate } from "./write";
import SilentHill2Model from "./kaitai/Mdl";
import RaycastHelper from "./objects/RaycastHelper";
import logger from "./objects/Logger";
import EditMode, { consoleGui } from "./sh2/edit-mode";
import { TextureViewerStates } from "./objects/TextureViewer";
import { editorState } from "./objects/EditorState";
import Gizmo from "./objects/Gizmo";
import SilentHillAnimation from "./kaitai/Anm";
import SilentHillDramaDemo from "./kaitai/Dds";
import { createAnimationTracks } from "./sh2/animation";
import QuickBar from "./objects/QuickBar";
import ddsList from "./assets/dds-list.json";
import { createCutsceneTracks, INU_CUTSCENE_DURATION } from "./sh2/cutscene";
import "./style.css";
import { isMobile } from "./utils";
import KeybindManager from "./objects/KeybindManager";
import SilentHill1Model from "./kaitai/Ilm";
import KaitaiStream from "./kaitai/runtime/KaitaiStream";
import Sh1anm from "./kaitai/Sh1anm";
import {
  createSh1Animation,
  createSh1Geometry,
  createSh1Skeleton,
  ilmFiles,
  ilmToAnmAssoc,
  ilmToTextureAssoc,
  createSh1Material,
  Sh1LightingMode,
  transparentIlmFiles,
} from "./sh1/sh1";
import PsxTim from "./kaitai/PsxTim";
import { NO_VALUE, Sh1AnimInfo } from "./sh1/sh1-animinfo";
import SilentHill3Model from "./kaitai/Sh3mdl";
import {
  createSh3Material,
  createSh3Geometry,
  sh3ModelFiles,
  createSwizzleTextures,
  Swizzles,
  favoriteSh3ModelFiles,
} from "./sh3/sh3";

const appContainer = document.getElementById("app");
if (!(appContainer instanceof HTMLDivElement)) {
  throw new Error("The app container was not found!");
}
const uiContainer = document.getElementById("ui-container");
if (!(uiContainer instanceof HTMLDivElement)) {
  throw new Error("The UI container was not found!");
}
const quickBarContainer = document.querySelector(".quick-access");
if (!(quickBarContainer instanceof HTMLDivElement)) {
  throw new Error("The quick access container was not found!");
}
export const quickBar = new QuickBar(quickBarContainer);

initializeModals();
acceptModelDrop(appContainer);

const params = new URLSearchParams(window.location.search);
const bypassAboutModal = params.get("bypass-modal");
if (!bypassAboutModal && localStorage.getItem("visited") === null) {
  localStorage.setItem("visited", "true");
}

let glVersion: 0 | 1 | 2 = 0;
if (!WebGL.isWebGLAvailable()) {
  showNotSupportedModal(glVersion);
  throw new Error("WebGL is not available on this browser.");
} else if (!WebGL.isWebGL2Available()) {
  glVersion = 1;
  showNotSupportedModal(glVersion);
} else {
  glVersion = 2;
}
clientState.setGlVersion(glVersion);

const gui = new GUI({ width: 250, container: uiContainer });
gui.domElement.id = "main-gui";

const dataGuiFolder = gui.addFolder("Data");
const gameInput = dataGuiFolder
  .add(clientState.uiParams, "Game", [
    "Silent Hill 1",
    "Silent Hill 2",
    "Silent Hill 3",
  ])
  .onFinishChange(() => {
    render();
  });
const sh1FileInput = dataGuiFolder
  .add(clientState.uiParams, "File (SH1)", ilmFiles)
  .hide()
  .onFinishChange(() => render())
  .listen();
const sh3FileInput = dataGuiFolder
  .add(clientState.uiParams, "File (SH3)", sh3ModelFiles)
  .hide()
  .onFinishChange(() => render())
  .listen();
const scenarioInput = dataGuiFolder
  .add(clientState.uiParams, "Scenario", ["Main Scenario", "Born From A Wish"])
  .onFinishChange((scenarioName: "Main Scenario" | "Born From A Wish") => {
    clientState.rootFolder = scenarioName === "Main Scenario" ? "chr" : "chr2";
  });
const folderInput = dataGuiFolder
  .add(clientState.uiParams, "Folder", chrFolders)
  .onFinishChange((folderName: (typeof chrFolders)[number]) => {
    clientState.folder = folderName;
  });
const possibleFilenames = clientState.getPossibleFilenames();
const fileInput = dataGuiFolder.add(
  clientState.uiParams,
  "Filename",
  possibleFilenames
);
const lockToFolder = dataGuiFolder
  .add(clientState.uiParams, "Lock To Folder")
  .onFinishChange(() => {
    showContentWarningModal(
      () => {
        clientState.uiParams["Lock To Folder"] = false;
        render();
      },
      () => {
        clientState.setFileIndex(clientState.defaultStartIndex);
        const controllers = gui.controllersRecursive();
        controllers.forEach((c) => {
          c.setValue(c.initialValue);
        });
      }
    );
  })
  .listen();
const getSh2SharableLink = () =>
  [
    clientState.rootFolder,
    clientState.folder,
    clientState.file.split(".")[0],
  ].join("-");
const getSh3SharableLink = () =>
  clientState.uiParams["File (SH3)"].replace("/", "-").replace(".mdl", "");
const updateLink = (sharable?: boolean) => {
  const baseUrl =
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname;
  if (sharable === false) {
    window.history.pushState({ path: baseUrl }, "", baseUrl);
    return;
  }

  let newUrl = baseUrl;
  switch (clientState.uiParams["Game"]) {
    case "Silent Hill 3":
      newUrl += "?game=sh3&model=" + getSh3SharableLink();
      break;
    case "Silent Hill 1":
      newUrl += "?game=sh1&file=" + clientState.uiParams["File (SH1)"];
      break;
    case "Silent Hill 2":
      newUrl += "?game=sh2&model=" + getSh2SharableLink();
      break;
  }
  window.history.pushState({ path: newUrl }, "", newUrl);
};

dataGuiFolder
  .add(clientState.uiParams, "Sharable Link")
  .onFinishChange(updateLink);
dataGuiFolder.add(clientState.uiParams, "View Structure 🔎");
dataGuiFolder.add(clientState.uiParams, "Next File");
dataGuiFolder.add(clientState.uiParams, "Previous File");
dataGuiFolder.add(clientState.uiParams, "Save Image");
dataGuiFolder.add(clientState.uiParams, "Export to GLTF");
fileInput.onFinishChange((file: (typeof possibleFilenames)[number]) => {
  clientState.file = file;
});
dataGuiFolder.open();

const controlsGuiFolder = gui.addFolder("Controls");
export const toggleEditMode = (value: boolean) => {
  clientState.setMode(value ? "edit" : "viewing");
  if (value) {
    textureViewerButton.hide();
  } else {
    textureViewerButton.show();
  }
};
export const editModeButton = controlsGuiFolder
  .add(clientState.uiParams, "Edit Mode ✨")
  .listen()
  .onFinishChange(toggleEditMode);
const textureViewerButton = controlsGuiFolder
  .add(clientState.uiParams, "Texture Viewer 👀")
  .listen()
  .onFinishChange((value: boolean) => {
    if (value) {
      clientState.getTextureViewer()?.setState(TextureViewerStates.Locked);
    } else {
      clientState.getTextureViewer()?.setState(TextureViewerStates.Inactive);
    }
  });
controlsGuiFolder.add(clientState.uiParams, "Auto-Rotate");
controlsGuiFolder
  .add(clientState.uiParams, "Bone Controls")
  .onFinishChange((value: boolean) => {
    if (value) {
      controlsModeInput.show();
      boneSelector.show();
      return;
    }
    controlsModeInput.hide();
    boneSelector.hide();
    raycastTargets.forEach((target) => {
      target.removeFromParent();
      disposeResources(target);
    });
    raycastTargetsGenerated = false;
    raycastTargets.length = 0;
  });
const boneSelector = controlsGuiFolder
  .add(clientState.uiParams, "Selected Bone", 0, 1, 1)
  .onChange(() => boneTransformGizmo.getTransformControls().removeFromParent())
  .hide()
  .listen();
const controlsModeInput = controlsGuiFolder
  .add(clientState.uiParams, "Controls Mode", ["translate", "rotate"])
  .listen()
  .hide();

const geometryFolder = gui.addFolder("Geometry");
const renderOpaqueInput = geometryFolder
  .add(clientState.uiParams, "Render Opaque")
  .onFinishChange(() => render());
const renderTransparentInput = geometryFolder
  .add(clientState.uiParams, "Render Transparent")
  .onFinishChange(() => render());

let skeletonModeController: Controller | undefined = undefined;
if (clientState.getGlVersion() === 2) {
  skeletonModeController = geometryFolder
    .add(clientState.uiParams, "Skeleton Mode")
    .onFinishChange(() => render());
  geometryFolder
    .add(clientState.uiParams, "Visualize Skeleton")
    .onFinishChange((on: boolean) => {
      if (on && clientState.uiParams["Model Opacity"] > 0.5) {
        clientState.uiParams["Model Opacity"] = 0.5;
      } else if (!on) {
        clientState.uiParams["Model Opacity"] = 1.0;
      }
      render();
    });
} else {
  gameInput.setValue("Silent Hill 2");
  clientState.uiParams["Game"] = "Silent Hill 2";
  clientState.uiParams["Skeleton Mode"] = false;

  controlsGuiFolder.hide();
  geometryFolder.add(clientState.uiParams, "Auto-Rotate");
}
geometryFolder
  .add(clientState.uiParams, "Visualize Normals")
  .onFinishChange(() => render());
const submeshFolder = geometryFolder.addFolder("Submeshes").hide().close();

const materialFolder = gui.addFolder("Material");
materialFolder
  .add(clientState.uiParams, "CLUT Rendering", ["PSX Shader", "Atlas"])
  .listen()
  .onFinishChange(() => render());
materialFolder
  .add(clientState.uiParams, "Render Mode", [
    MaterialView.Flat,
    MaterialView.UV,
    MaterialView.Wireframe,
    MaterialView.Textured,
  ])
  .onFinishChange(() => render());
materialFolder
  .add(clientState.uiParams, "Render Side", [
    "DoubleSide",
    "FrontSide",
    "BackSide",
  ])
  .onFinishChange(() => render())
  .listen();
const wrappingInput = materialFolder
  .add(clientState.uiParams, "Wrapping", [
    "ClampToEdge",
    "Repeat",
    "MirroredRepeat",
  ])
  .onFinishChange(() => render())
  .listen()
  .setValue(clientState.uiParams.Wrapping.replace("Wrapping", ""));
const transparencyInput = materialFolder
  .add(clientState.uiParams, "Transparency")
  .onFinishChange(() => render());
const invertAlphaInput = materialFolder
  .add(clientState.uiParams, "Invert Alpha")
  .onFinishChange(() => render())
  .listen();
const alphaTestInput = materialFolder
  .add(clientState.uiParams, "Alpha Test", 0, 1, 0.01)
  .onFinishChange(() => render())
  .listen();

materialFolder.addColor(clientState.uiParams, "Ambient Color");
materialFolder.add(clientState.uiParams, "Ambient Intensity", 0, 8);
materialFolder
  .add(clientState.uiParams, "Fancy Lighting")
  .onFinishChange((value: boolean) => {
    if (!value && lightGroup) {
      lightGroup?.removeFromParent();
      disposeResources(lightGroup);
      lightGroup = undefined;
      return;
    } else if (value && !lightGroup) {
      render();
    }
  });

const animationsFolder = gui.addFolder("Animation").hide();
let animationController: Controller | undefined = undefined;

let animationsPaused = false;
const animationControls = {
  "Play/Pause": () => {
    for (const mixer of mixers) {
      if (mixer.timeScale) {
        mixer.timeScale = 0;
        animationsPaused = true;
        if (clientState.uiParams["Visualize Normals"]) {
          render();
        }
      } else {
        animationsPaused = false;
        mixer.timeScale = 1;
      }
    }
  },
  Reset: () => {
    for (const mixer of mixers) {
      mixer.setTime(0);
    }
  },
};
animationsFolder.add(animationControls, "Play/Pause");
animationsFolder.add(animationControls, "Reset");

const loadingMessage = document.createElement("div");
loadingMessage.className = "loading-message";
loadingMessage.textContent = "loading...";
appContainer.appendChild(loadingMessage);

const width = appContainer.offsetWidth;
const height = appContainer.offsetHeight;
const renderer = glVersion === 2 ? new WebGLRenderer() : new WebGL1Renderer();
renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);
appContainer.appendChild(renderer.domElement);

Object3D.DEFAULT_UP.multiplyScalar(-1); // -Y is up
const camera = new PerspectiveCamera(75, width / height, 2, 131072);
camera.position.z = 5;

const prefersReducedMotion = clientState.prefersReducedMotion();
let isMobileLayout = false;
const onWindowResize = () => {
  const width = appContainer.offsetWidth;
  const height = appContainer.offsetHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  if (!isMobileLayout && width < 700) {
    isMobileLayout = true;
    gui.close();
    textureViewerButton.hide();
    editModeButton.hide();
    clientState.setMode("viewing");
  } else if (isMobileLayout && width > 700 && gui._closed) {
    isMobileLayout = false;
    if (!isMobile()) {
      if (prefersReducedMotion) {
        gui.openAnimated();
      } else {
        gui.open();
      }
      editModeButton.show();
    }
    textureViewerButton.show();
  }
  portraitModeWarning(width, height);
};
const portraitModeWarning = (width?: number, height?: number) => {
  width ??= appContainer.offsetWidth;
  height ??= appContainer.offsetHeight;
  if (
    clientState.uiParams["Game"] === "Silent Hill 2" &&
    width < height &&
    clientState.file === "inu.mdl" &&
    !quickBar.forceClosed
  ) {
    quickBar.show();
  } else {
    quickBar.hide();
  }
};
onWindowResize();
window.addEventListener("resize", onWindowResize);

const raycastHelper = new RaycastHelper(renderer, camera);
const raycastTargets: Mesh[] = [];
let raycastTargetsGenerated = false;

const onClick = (event: MouseEvent) => {
  if (!clientState.uiParams["Bone Controls"]) {
    return;
  }
  const currentObject = clientState.getCurrentObject();
  for (const skinnedMesh of currentObject?.children.filter(
    (object) => object instanceof SkinnedMesh
  ) ?? []) {
    const bones = skinnedMesh.skeleton.bones;
    if (!bones || !bones.length || !currentObject) {
      return;
    }
    const cast = raycastHelper.cast(event, raycastTargets);
    const nearest = cast.shift();
    const parentBone = nearest?.object.parent;
    if (parentBone instanceof Bone) {
      const index = bones.indexOf(parentBone);
      clientState.uiParams["Selected Bone"] = index;
      boneTransformGizmo.getTransformControls().removeFromParent();
      break;
    }
  }
};
appContainer.addEventListener("click", onClick);

export const scene = new Scene();
const pmremGenerator = new PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(scene).texture;
ColorManagement.enabled = true;
renderer.outputColorSpace = SRGBColorSpace;
renderer.toneMapping = ACESFilmicToneMapping;

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.autoRotate = clientState.uiParams["Auto-Rotate"];
orbitControls.update();
const disableOrbitControls = () => (orbitControls.enabled = false);
const enableOrbitControls = () => (orbitControls.enabled = true);

const boneTransformGizmo = new Gizmo(scene, camera, renderer.domElement);
boneTransformGizmo.setRenderLoop(() => {
  boneTransformGizmo.getTransformControls().mode = clientState.uiParams[
    "Controls Mode"
  ] as "translate" | "rotate" | "scale";
});
boneTransformGizmo.setOnDrag(disableOrbitControls);
boneTransformGizmo.setOnStopDrag(enableOrbitControls);

orbitControls.addEventListener("start", () => {
  mixers.forEach((mixer) => {
    const mixerWithActions = mixer as MuseumMixer;
    const actions = mixerWithActions._actions.filter(
      (action) =>
        action.getClip().name === "camera" ||
        action.getClip().name === "controls"
    );
    if (actions.length) {
      actions.forEach((action) => {
        action.timeScale = 0;
      });
    }
  });
  orbitControls.minDistance = 0;
  orbitControls.minZoom = 0;
});

const modelTransformGizmo = new Gizmo(scene, camera, renderer.domElement);
const modelRenderLoop = (controls: TransformControls) => {
  controls.mode = clientState.uiParams["Controls Mode"] as
    | "translate"
    | "rotate"
    | "scale";
  controls.setRotationSnap(
    (editorState.editorParams["Rotation Step"] / 180) * Math.PI
  );
};
modelTransformGizmo.setRenderLoop(modelRenderLoop);
modelTransformGizmo.setOnDrag(() => {
  disableOrbitControls();
  editorState.modelPropertyDiff.transform =
    clientState.getCurrentObject()?.matrixWorld;
});
modelTransformGizmo.setOnStopDrag(enableOrbitControls);

const originalTransformGizmo = new Gizmo(scene, camera, renderer.domElement);
originalTransformGizmo.setRenderLoop(modelRenderLoop);
originalTransformGizmo.setOnDrag(disableOrbitControls);
originalTransformGizmo.setOnStopDrag(enableOrbitControls);

let helper: SkeletonHelper | undefined;

const clock = new Clock();
let group = new Group();
let lastIndex = -1;
let lastSh1File = "";
let lastSh3File = "";
let lastGame = "";
let mixers: AnimationMixer[] = [];

const editor = new EditMode();

clientState.setOnModeUpdate((oldMode) => {
  const newMode = clientState.getMode();
  document.body.classList.remove(oldMode);
  clientState
    .getTextureViewer()
    ?.setState(
      newMode === "edit" || clientState.uiParams["Texture Viewer 👀"]
        ? TextureViewerStates.Locked
        : TextureViewerStates.Inactive
    );
  document.body.classList.add(newMode);
  if (newMode === "edit") {
    consoleGui.openAnimated();
  } else {
    logger.disablePipeIfExists("editModeLog");
    consoleGui.close();
  }
  onWindowResize();
});

const registerAllKeybinds = ({ quickBar }: { quickBar: QuickBar }) => {
  const keybindManager = new KeybindManager();
  keybindManager.addKeybind(
    "arrowright",
    () => clientState.nextFile(),
    "Next file"
  );
  keybindManager.addKeybind(
    "arrowleft",
    () => clientState.previousFile(),
    "Previous file"
  );
  keybindManager.addKeybind(
    "arrowup",
    () => {
      switch (clientState.uiParams["Game"]) {
        case "Silent Hill 3":
          gameInput.setValue("Silent Hill 2");
          break;
        case "Silent Hill 2":
          gameInput.setValue("Silent Hill 1");
          break;
        case "Silent Hill 1":
          gameInput.setValue("Silent Hill 3");
          break;
      }
      render();
    },
    "Next game"
  );
  keybindManager.addKeybind(
    "arrowdown",
    () => {
      switch (clientState.uiParams["Game"]) {
        case "Silent Hill 1":
          gameInput.setValue("Silent Hill 2");
          break;
        case "Silent Hill 2":
          gameInput.setValue("Silent Hill 3");
          break;
        case "Silent Hill 3":
          gameInput.setValue("Silent Hill 1");
          break;
      }
      render();
    },
    "Previous game"
  );
  keybindManager.addKeybind(
    "f",
    () => clientState.nextRootFolder(),
    "Toggle scenarios"
  );
  keybindManager.addKeybind(
    "r",
    () => {
      clientState.uiParams["Controls Mode"] = "rotate";
      if (clientState.getMode() === "edit") {
        editorState.editorParams["Model Controls"] = true;
      }
    },
    "Rotate mode"
  );
  keybindManager.addKeybind(
    "t",
    () => {
      clientState.uiParams["Controls Mode"] = "translate";
      if (clientState.getMode() === "edit") {
        editorState.editorParams["Model Controls"] = true;
      }
    },
    "Move mode"
  );
  keybindManager.addKeybind(
    "s",
    () => {
      clientState.uiParams["Controls Mode"] = "scale";
      if (clientState.getMode() === "edit") {
        editorState.editorParams["Model Controls"] = true;
      }
    },
    "Scale mode"
  );
  keybindManager.addKeybind(
    "e",
    () => {
      const value = !editModeButton.getValue();
      toggleEditMode(value);
      editModeButton.setValue(value);
    },
    "Edit mode"
  );
  keybindManager.addKeybind(
    "0",
    () => (clientState.uiParams["Render This Frame"] = true),
    "Render the current frame as PNG"
  );
  keybindManager.addKeybind(
    "k",
    () =>
      !isAnyElementOpenOtherThan("keybindsModal") &&
      toggleWithBackground("keybindsModal"),
    "Toggle keybinds modal"
  );
  keybindManager.addKeybind(
    "escape",
    () => closeAllElements(),
    "Close all modals"
  );
  keybindManager.addKeybind("i", () =>
    clientState.uiParams["View Structure 🔎"]()
  );
  keybindManager.addKeybind("space", () => {
    quickBar.togglePause();
  });

  const keybindsModal = document.getElementById("keybinds-modal");
  if (keybindsModal) {
    // list all keybinds
    const entries = Array.from(keybindManager.getDescriptionMap().entries());
    let html = "<table><tbody>";
    for (const [keybind, description] of entries) {
      const keybindHtml = keybind
        .split("/")
        .map((key) => `<kbd>${key}</kbd>`)
        .join("+");
      html += `<tr><td>${keybindHtml}</td>`;
      html += `<td>${description}</td></tr>`;
    }
    html += "</tbody></table>";
    keybindsModal.innerHTML = html;
  }
};

registerAllKeybinds({ quickBar });

let lightGroup: Group | undefined;
let renderIsFinished = true;
let renderTicket = 0;
let submeshListNeedsUpdate = false;

const renderSh2 = async (model: SilentHill2Model) => {
  group = new Group();

  if (editorState.cachedOriginalModel) {
    scene.add(editorState.cachedOriginalModel);
    if (clientState.uiParams["Visualize Skeleton"]) {
      helper = new SkeletonHelper(editorState.cachedOriginalModel);
      scene.add(helper);
    }
  }

  // temporary: separate into opaque & transparent until specularity is implemented?
  // likely need to create more materials for most accurate results
  const opaqueMaterial = await createMaterial(
    model,
    clientState.uiParams["Render Mode"] as MaterialType,
    {
      alphaTest: clientState.uiParams["Alpha Test"],
      transparent: clientState.uiParams["Visualize Skeleton"],
      side: RenderSideMap[
        clientState.uiParams["Render Side"] as
          | "DoubleSide"
          | "FrontSide"
          | "BackSide"
      ],
      opacity: clientState.uiParams["Model Opacity"],
    },
    clientState.uiParams["Invert Alpha"],
    WrapMap[
      clientState.uiParams.Wrapping as
        | "ClampToEdgeWrapping"
        | "RepeatWrapping"
        | "MirroredRepeatWrapping"
    ] ??
      (model.modelData.geometry.primitiveHeaders?.[0]?.body.samplerStates[0] ===
      0x01
        ? RepeatWrapping
        : ClampToEdgeWrapping)
  );
  const transparentMaterial = await createMaterial(
    model,
    clientState.uiParams["Render Mode"] as MaterialType,
    {
      alphaTest: clientState.uiParams["Alpha Test"],
      transparent:
        clientState.uiParams.Transparency ||
        clientState.uiParams["Visualize Skeleton"],
      side: RenderSideMap[
        clientState.uiParams["Render Side"] as
          | "DoubleSide"
          | "FrontSide"
          | "BackSide"
      ],
      opacity: clientState.uiParams["Model Opacity"],
    },
    clientState.uiParams["Invert Alpha"],
    WrapMap[
      clientState.uiParams.Wrapping as
        | "ClampToEdgeWrapping"
        | "RepeatWrapping"
        | "MirroredRepeatWrapping"
    ] ??
      (model.modelData.geometry.primitiveHeaders[0]?.body.samplerStates[0] ===
      0x01
        ? RepeatWrapping
        : ClampToEdgeWrapping),
    opaqueMaterial instanceof Material ? [opaqueMaterial] : opaqueMaterial
  );

  if (
    opaqueMaterial instanceof Material &&
    opaqueMaterial.name === "uv-map" &&
    clientState.uiParams["Render Mode"] !== MaterialView.UV
  ) {
    materialFolder.hide();
  } else {
    materialFolder.show();
  }

  const opaqueGeometry = clientState.uiParams["Render Opaque"]
    ? createGeometry(
        model,
        0,
        !clientState.uiParams["Show All Hand Poses"]
          ? clientState.folder === "jms"
            ? [0, 3, 14]
            : clientState.folder === "mar"
            ? [0, 3, 6]
            : undefined
          : undefined
      )
    : undefined;

  let modelSkeleton: Skeleton | undefined = undefined;
  let opaqueMesh: SkinnedMesh | Mesh | undefined;
  if (opaqueGeometry) {
    opaqueGeometry.name = `${clientState.file}-opaque`;

    if (clientState.uiParams["Skeleton Mode"]) {
      const { skeleton, rootBoneIndices } = createSkeleton(model);
      bindSkeletonToGeometry(model, opaqueGeometry);

      opaqueMesh = new SkinnedMesh(opaqueGeometry, opaqueMaterial);
      rootBoneIndices.forEach((boneIndex) =>
        opaqueMesh?.add(skeleton.bones[boneIndex])
      );
      (opaqueMesh as SkinnedMesh).bind(skeleton);
      modelSkeleton = skeleton;

      if (clientState.uiParams["Visualize Skeleton"]) {
        helper = new SkeletonHelper(opaqueMesh);
        scene.add(helper);
      }
    } else {
      opaqueMesh = new Mesh(opaqueGeometry, opaqueMaterial);
    }
    opaqueMesh.renderOrder = 1;

    logger.debug("Added opaque geometry to mesh!", opaqueGeometry);
    group.add(opaqueMesh);
  }

  const transparentGeometry = clientState.uiParams["Render Transparent"]
    ? createGeometry(model, 1)
    : undefined;
  let transparentMesh: SkinnedMesh | Mesh | undefined;
  if (transparentGeometry) {
    transparentGeometry.name = `${clientState.file}-transparent`;

    if (clientState.uiParams["Skeleton Mode"]) {
      transparentMesh = new SkinnedMesh(
        transparentGeometry,
        transparentMaterial
      );
      transparentMesh.frustumCulled = false;

      if (!opaqueGeometry || !modelSkeleton) {
        const { skeleton, rootBoneIndices } = createSkeleton(model);
        modelSkeleton = skeleton;
        rootBoneIndices.forEach((boneIndex) =>
          transparentMesh?.add(skeleton.bones[boneIndex])
        );
      }
      bindSkeletonToTransparentGeometry(model, transparentGeometry);
      (transparentMesh as SkinnedMesh).bind(modelSkeleton);
      (transparentMesh as SkinnedMesh).normalizeSkinWeights();
    } else {
      transparentMesh = new Mesh(transparentGeometry, transparentMaterial);
    }
    transparentMesh.renderOrder = 2;

    if (clientState.uiParams["Visualize Normals"]) {
      const normalsHelper = new VertexNormalsHelper(
        transparentMesh,
        8,
        0xff0000
      );
      scene.add(normalsHelper);
    }

    logger.debug("Added transparent geometry to mesh!", transparentGeometry);
    group.add(transparentMesh);
  }

  group.userData = {
    silentHillModel: {
      name: clientState.file,
      characterId: model.header.characterId,
    },
  };
  logger.debug("Adding group to scene", group);
  scene.add(group);

  return {
    group,
    opaqueGeometry,
    transparentGeometry,
    opaqueMesh,
    transparentMesh,
    modelSkeleton,
  };
};

let swizzleTextures: Swizzles | null = null;

const renderSh3 = async () => {
  const filename = clientState.uiParams["File (SH3)"];
  const ticket = ++renderTicket;
  const bytes = await fetchArrayBuffer(`sh3/${filename}`);
  if (!swizzleTextures) {
    swizzleTextures = await createSwizzleTextures();
  }

  if (renderTicket !== ticket) {
    return null;
  }

  const model = new SilentHill3Model(new KaitaiStream(bytes));
  const { geometry } = createSh3Geometry(model, {
    maxEquipmentId: filename === "en/en_bhr.mdl" ? 2 : undefined,
  });
  const device =
    clientState.uiParams["CLUT Rendering"] === "PSX Shader" ? "gpu" : "cpu";
  const { materials } = createSh3Material(model, swizzleTextures, {
    device,
  });
  if (device === "cpu") {
    // delete unnecessary texInfo attribute in case we try to export
    geometry.deleteAttribute("texInfo");
  }
  for (const material of Array.isArray(materials) ? materials : [materials]) {
    const side =
      RenderSideMap[
        clientState.uiParams["Render Side"] as
          | "DoubleSide"
          | "FrontSide"
          | "BackSide"
      ];
    material.side = side;
  }

  // clientState.getTextureViewer()?.attach(images);
  let mesh: Mesh | SkinnedMesh = new SkinnedMesh();
  let modelSkeleton: Skeleton | undefined = undefined;
  if (mesh instanceof SkinnedMesh) {
    mesh = new SkinnedMesh(geometry, materials);

    const { skeleton, rootBoneIndices } = createSkeleton(model);
    rootBoneIndices.forEach((boneIndex) => mesh.add(skeleton.bones[boneIndex]));
    (mesh as SkinnedMesh).bind(skeleton);
    modelSkeleton = skeleton;

    if (clientState.uiParams["Visualize Skeleton"]) {
      helper = new SkeletonHelper(mesh);
      scene.add(helper);
    }
  } else {
    mesh = new Mesh(geometry, materials);
  }
  const group = new Group();
  group.add(mesh);
  scene.add(group);
  clientState.setCurrentObject(group);
  clientState.setCurrentViewerModel(model);

  if (clientState.uiParams["Visualize Normals"]) {
    const normalsHelper = new VertexNormalsHelper(mesh, 8, 0xff0000);
    scene.add(normalsHelper);
  }

  return {
    group,
    opaqueGeometry: geometry,
    transparentGeometry: undefined,
    opaqueMesh: mesh,
    transparentMesh: undefined,
    modelSkeleton,
  };
};

const renderSh1 = async () => {
  const ticket = ++renderTicket;

  /* begin async stuff */
  const modelName: string = clientState.uiParams["File (SH1)"];
  const anmName = ilmToAnmAssoc(modelName);

  const ilm = new SilentHill1Model(
    new KaitaiStream(await fetchArrayBuffer(`sh1/CHARA/${modelName}.ILM`))
  );
  clientState.setCurrentViewerIlm(ilm);
  const anm = new Sh1anm(
    new KaitaiStream(await fetchArrayBuffer(`sh1/ANIM/${anmName}`))
  );
  logger.info("Parsed SH1 model and animation", { ilm, anm });

  let psxTim: PsxTim | undefined = undefined;
  try {
    psxTim = new PsxTim(
      new KaitaiStream(
        await fetchArrayBuffer(`sh1/${ilmToTextureAssoc(modelName)}.TIM`)
      )
    );
  } catch (e) {
    psxTim = new PsxTim(
      new KaitaiStream(await fetchArrayBuffer(`sh1/CHARA/HERO.TIM`))
    );
    logger.error(e);
  }

  /* end async stuff */
  if (renderTicket !== ticket) {
    return null;
  }

  // #region <submesh folder>
  const submeshTable = clientState.uiParams["Submeshes To Show"];
  submeshTable[ilm.name] ??= {};
  const submeshList = submeshTable[ilm.name];
  if (submeshListNeedsUpdate) {
    let preset: (() => void) | null = null;

    if (ilm.name.startsWith("PRS")) {
      const makePrsFilter = (i: number, rerender = true) => {
        return () => {
          for (const submesh of ilm.objs) {
            const name = submesh.name;
            if (name.startsWith("RHAND")) {
              submeshList[name] = name[5] === "2";
              continue;
            }
            if (!name.startsWith("HEAD") && !name.startsWith("NECK")) {
              submeshList[name] = true;
              continue;
            }
            const int = parseInt(name[4]);
            submeshList[name] = int === i || int > 3;
          }
          if (rerender) {
            render();
          }
        };
      };
      const prsButtons = {
        "Puppet I": makePrsFilter(1),
        "Puppet II": makePrsFilter(2),
        "Puppet III": makePrsFilter(3),
      } as const;
      submeshFolder.add(prsButtons, "Puppet I");
      submeshFolder.add(prsButtons, "Puppet II");
      submeshFolder.add(prsButtons, "Puppet III");
      preset = makePrsFilter(1, false);
    } else if (ilm.name === "FAT") {
      preset = () => {
        for (const submesh of ilm.objs) {
          const name = submesh.name;
          if (
            (name.startsWith("LHEAD") || name.startsWith("RHEAD")) &&
            parseInt(name[5]) > 4
          ) {
            submeshList[name] = false;
            continue;
          }
          submeshList[name] = true;
        }
      };
    }
    preset?.();

    for (const submesh of ilm.objs) {
      const name = submesh.name;
      if (!preset) {
        submeshList[name] = true;
        if (
          !["BTFY", "COC", "MOTH", "WORM"].includes(ilm.name) &&
          (name.includes("RHAND2") ||
            name.includes("RHAND3") ||
            name.includes("RHAND4") ||
            name.includes("LHAND2") ||
            name.includes("FLAURO") ||
            name.includes("KEY") ||
            name.includes("RAGLA"))
        ) {
          submeshList[name] = false;
        }
      }
      submeshFolder.add(submeshList, name).onChange(() => render());
    }

    submeshFolder.show();
    submeshListNeedsUpdate = false;
  }
  // #endregion <submesh folder>

  const skeleton = createSh1Skeleton(anm);
  const geom = createSh1Geometry({
    ilm,
    skeleton,
    psxTim,
    subset: submeshList,
  });

  const materialOptions =
    clientState.uiParams["CLUT Rendering"] === "PSX Shader"
      ? ({ type: "shader" } as const)
      : ({
          type: "atlas",
          geometry: geom,
        } as const);
  const materialResult = createSh1Material(psxTim, materialOptions);
  const viewer = clientState.getTextureViewer();
  if (viewer) {
    viewer.attach(
      materialResult.textures.map((info) =>
        viewer.createFromUint8Array(...info)
      )
    );
  }

  const sh1Material = materialResult.material;
  sh1Material.transparent = clientState.uiParams["Transparency"];

  const side =
    RenderSideMap[
      clientState.uiParams["Render Side"] as
        | "DoubleSide"
        | "FrontSide"
        | "BackSide"
    ];
  sh1Material.side = side;

  const material =
    clientState.uiParams["Render Mode"] === MaterialView.Textured
      ? sh1Material
      : new MeshStandardMaterial({
          map:
            clientState.uiParams["Render Mode"] === MaterialView.UV
              ? (() => {
                  const t = new DataTexture(defaultDiffuseMap, 128, 128);
                  t.needsUpdate = true;
                  return t;
                })()
              : undefined,
          wireframe:
            clientState.uiParams["Render Mode"] === MaterialView.Wireframe,
          alphaTest: clientState.uiParams["Alpha Test"],
          transparent: clientState.uiParams["Visualize Skeleton"],
          side,
          opacity: clientState.uiParams["Model Opacity"],
        });

  const mesh = new SkinnedMesh(geom, material);
  mesh.add(skeleton.bones[0]);
  mesh.bind(skeleton);
  mesh.name = "sh1model";
  mesh.frustumCulled = false;

  if (clientState.uiParams["Visualize Skeleton"]) {
    helper = new SkeletonHelper(mesh);
    scene.add(helper);
  }

  const group = new Group();
  scene.add(group);
  group.add(mesh);

  const mixer = new AnimationMixer(group);
  const tracks = createSh1Animation(anm);

  // #region <anim info section>
  const clips: AnimationClip[] = [];
  const actions: AnimationAction[] = [];

  const animInfos = Sh1AnimInfo[ilm.name as keyof typeof Sh1AnimInfo];
  if (animInfos) {
    const animMap: Record<string, () => void> = {};

    for (let i = 0; i < animInfos.length; i++) {
      const animInfo = animInfos[i];
      let animStart = animInfo[1];
      const animEnd = animInfo[2];

      let type = "animation";
      if (animStart === NO_VALUE) {
        animStart = animEnd;
        type = "start frame";
        // just skipping these for now
        continue;
      }

      // TODO: use the duration?
      // const animDuration =
      //   typeof animInfo[0] === "number" ? animInfo[0] : animInfo[0]();
      // const frameDelta = 30 / FROM_Q12(animDuration);

      const trim = (t: KeyframeTrack) => {
        const start = animStart * ANIMATION_FRAME_DURATION;
        const end = animEnd * ANIMATION_FRAME_DURATION;
        const snippet = t.clone().trim(start, end).shift(-start);
        return snippet;
      };

      const clip = new AnimationClip(anmName, -1, tracks.map(trim));
      const clipAction = mixer.clipAction(clip);
      clips.push(clip);
      actions.push(clipAction);

      const key = `${type} ${i}`;
      animMap[key] = () => {
        mixer.stopAllAction();
        clipAction.play();
      };
    }

    animationController?.destroy();
    animationController = animationsFolder
      .add(clientState.uiParams, "Current Animation", Object.keys(animMap))
      .show();
    animationController.onFinishChange((animation: keyof typeof animMap) => {
      animMap[animation]();
    });
  } else {
    animationController?.hide();
  }
  animationsFolder.show();

  if (!animInfos || clientState.uiParams["Current Animation"] === "[none]") {
    // just play whole file
    const clip = new AnimationClip(anmName, -1, tracks);
    const clipAction = mixer.clipAction(clip);
    clipAction.play();
    if (animationsPaused) {
      mixer.timeScale = 0.0;
    }
  }
  // #endregion <anim info section>

  mixers.push(mixer);

  quickBar.show();
  loadingMessage.remove();

  return {
    group,
    opaqueGeometry: geom,
    transparentGeometry: undefined,
    opaqueMesh: mesh,
    transparentMesh: undefined,
    modelSkeleton: skeleton,
  };
};

const render = () => {
  if (isElementOpen("contentWarningModal")) {
    return;
  }

  renderIsFinished = false;

  const isSh1 = clientState.uiParams.Game === "Silent Hill 1";
  const isSh2 = clientState.uiParams.Game === "Silent Hill 2";
  const isSh3 = clientState.uiParams.Game === "Silent Hill 3";

  const modelCallback = async (
    model?: SilentHill2Model | undefined,
    cleanupResources = true,
    animation?: SilentHillAnimation,
    dds?: SilentHillDramaDemo,
    name?: string
  ) => {
    if (model !== undefined) {
      logger.debug("Parsed model structure", model);
    }
    if (model === undefined && isSh2) {
      return;
    }

    if (cleanupResources) {
      disposeResources(group);
      mixers.forEach((mixer) => {
        mixer.stopAllAction();
        mixer.timeScale = -1;
      });
      mixers.length = 0;
      helper?.dispose();
      group.clear();
      scene.clear();
    }

    let light = scene.children.find((c) => c.name === "ambient-light");
    if (!light) {
      light = new AmbientLight(
        clientState.uiParams["Ambient Color"],
        clientState.uiParams["Ambient Intensity"]
      );
      light.name = "ambient-light";
      scene.add(light);
    }

    raycastTargetsGenerated = false;
    raycastTargets.length = 0;

    let result:
      | Awaited<ReturnType<typeof renderSh2>>
      | Awaited<ReturnType<typeof renderSh1>>
      | Awaited<ReturnType<typeof renderSh3>>
      | undefined = undefined;
    if (isSh3) {
      const maybeResult = await renderSh3();
      if (!maybeResult) {
        return;
      }
      result = maybeResult;
    } else if (isSh1) {
      const maybeResult = await renderSh1();
      if (!maybeResult) {
        return;
      }
      result = maybeResult;
    } else if (model !== undefined) {
      const maybeResult = await renderSh2(model);
      if (!maybeResult) {
        return;
      }
      result = maybeResult;
    } else {
      throw new Error("Model is not an instance of SilentHill2Model");
    }

    const {
      opaqueGeometry,
      transparentGeometry,
      opaqueMesh,
      transparentMesh,
      modelSkeleton,
    } = result;
    group = result.group;

    const currentObject =
      isSh2 && clientState.file === "inu.mdl" ? scene : group;
    clientState.setCurrentObject(currentObject);
    if (isSh2) {
      clientState.getTextureViewer()?.attach(currentObject);
    }

    if (
      clientState.uiParams["Visualize Normals"] &&
      opaqueMesh &&
      (isSh2 || animationsPaused)
    ) {
      const normalsHelper = new VertexNormalsHelper(opaqueMesh, 8, 0xff0000);
      scene.add(normalsHelper);
    }

    if (
      !clientState.getCustomModel() &&
      (opaqueGeometry !== undefined || transparentGeometry !== undefined)
    ) {
      const fix = cameraFix[filename as MuseumFile];
      // if (k == 0) {
      fitCameraToSelection(camera, orbitControls, [group]);
      // }
      if (fix !== undefined) {
        orbitControls.target.copy(fix.controlsTarget);
        camera.position.copy(fix.cameraPosition);
        orbitControls.update();
      }
    }

    let lightAnimate: (deltaTime: number) => void | undefined;
    if (clientState.uiParams["Fancy Lighting"] && !lightGroup) {
      const { lightGroup: fancyLightingGroup, animate: fancyLightingAnimate } =
        createRainbowLights(group, 20);
      lightGroup = fancyLightingGroup;
      lightAnimate = fancyLightingAnimate;
    }

    if (isSh2) {
      if (
        !clientState.getCustomModel() &&
        clientState.folder === "favorites" &&
        clientState.file === "org.mdl"
      ) {
        modelSkeleton?.bones[0]?.rotateZ(Math.PI / 2);
        modelSkeleton?.bones[6]?.rotateZ(-Math.PI / 2);
        modelSkeleton?.bones[7]?.rotateZ(-Math.PI / 2);
        modelSkeleton?.bones[8]?.rotateZ(Math.PI / 2);
      }
    }

    const mesh = opaqueMesh ?? transparentMesh;
    let mixer: AnimationMixer | undefined;

    if (
      isSh2 &&
      clientState.file === "inu.mdl" &&
      animation &&
      mesh &&
      modelSkeleton
    ) {
      mixer = new AnimationMixer(mesh);
      (mixer as MuseumMixer).isInuAnm = true;
      mixers.push(mixer);

      const tracks = createAnimationTracks(animation, modelSkeleton);
      tracks.forEach((track) => track.trim(0, INU_CUTSCENE_DURATION));
      const clip = new AnimationClip(
        clientState.file.replace(".mdl", ".anm"),
        -1,
        tracks
      );

      const opaqueAction = mixer.clipAction(clip);
      opaqueAction.play();

      const { tracks: ddsTracks, ddsLights } = createCutsceneTracks(
        dds,
        name ?? ""
      );
      if (ddsTracks) {
        const ddsClip = new AnimationClip(
          name ?? clientState.file.replace(".mdl", ".anm"),
          -1,
          ddsTracks.character
        );

        const ddsAction = mixer.clipAction(ddsClip);
        ddsAction.play();
        logger.debug({ ddsClip });
        const transparentDdsAction = mixer.clipAction(ddsClip, transparentMesh);
        transparentDdsAction.play();

        if (name === "inu.mdl") {
          const ddsCameraClip = new AnimationClip(
            "camera",
            -1,
            ddsTracks.camera
          );
          const ddsCameraAction = mixer.clipAction(ddsCameraClip, camera);
          ddsCameraAction.play();
          const ddsControlsClip = new AnimationClip(
            "controls",
            -1,
            ddsTracks.controls
          );
          const ddsControlsAction = mixer.clipAction(
            ddsControlsClip,
            //@ts-ignore
            orbitControls
          );
          ddsControlsAction.play();

          ddsLights.forEach((ddsLight, index) => {
            scene.add(ddsLight);
            const ddsLightClip = new AnimationClip(
              `ddsLight${index}`,
              -1,
              ddsTracks.lights[index]
            );
            const ddsLightAction = mixer!.clipAction(ddsLightClip, ddsLight);
            ddsLightAction.play();
          });
        }
      }
      if (ddsTracks && name === "inu.mdl") {
        new GLTFLoader().loadAsync("/glb/end_inu.glb").then((data) => {
          scene.add(data.scene);
          data.scene.rotateZ(Math.PI);
          data.scene.rotateY(Math.PI);
          data.scene.children.forEach((child) => child.scale.set(1, 1, 1));
          data.scene.updateMatrixWorld(true);
          data.scene.traverse((o) => {
            if (o instanceof Mesh) {
              if (o.material instanceof MeshStandardMaterial) {
                o.material.metalness = 0;
                o.material.side = FrontSide;
              }
            }
          });
          loadingMessage.remove();
        });
      }

      if (opaqueMesh && transparentMesh) {
        const transparentAction = mixer.clipAction(clip, transparentMesh);
        transparentAction.play();
      }
    } else {
      quickBar.hide();
      loadingMessage.remove();
    }

    const maxBoneSelection = (modelSkeleton?.bones.length ?? 1) - 1;
    boneSelector.max(maxBoneSelection);
    if (maxBoneSelection === 0) {
      boneSelector.hide();
    } else if (clientState.uiParams["Bone Controls"]) {
      boneSelector.show();
    }

    boneTransformGizmo.setOnAdded(() => {
      if (!raycastTargetsGenerated) {
        raycastTargetsGenerated = true;
        const modelBones = modelSkeleton?.bones ?? [];
        const bones = modelBones;
        bones.forEach((bone) => {
          const sphere = new SphereGeometry(8);
          const material = new MeshBasicMaterial({
            opacity: 0.5,
            transparent: true,
          });
          const mesh = new Mesh(sphere, material);
          raycastTargets.push(mesh);
          bone.add(mesh);
        });
      }
    });

    clientState.setCurrentAnimationClipsFromMixers(mixers as MuseumMixer[]);

    function animate() {
      if (!renderIsFinished) {
        // prevent animation loop if render is not finished
        // todo: maybe add a loading indicator
        return;
      }

      const delta = clock.getDelta();
      mixers.forEach((mixer) => {
        mixer.update(delta);
        if (
          (mixer as MuseumMixer).isInuAnm &&
          mixer.time >= INU_CUTSCENE_DURATION
        ) {
          mixer.setTime(0);
        }
      });
      orbitControls.autoRotate = clientState.uiParams["Auto-Rotate"];
      orbitControls.update();
      camera.updateProjectionMatrix();
      modelTransformGizmo.render(
        clientState.getMode() === "edit" &&
          editorState.editorParams["Model Controls"],
        group
      );
      boneTransformGizmo.render(
        !!modelSkeleton && clientState.uiParams["Bone Controls"],
        modelSkeleton?.bones[clientState.uiParams["Selected Bone"]]
      );
      originalTransformGizmo.render(
        clientState.getMode() === "edit" &&
          editorState.editorParams["Base Model Controls"],
        editorState.cachedOriginalModel
      );

      if (light instanceof AmbientLight) {
        light.color = new Color(clientState.uiParams["Ambient Color"]);
        light.intensity = clientState.uiParams["Ambient Intensity"];
      }
      if (opaqueMesh?.material instanceof RawShaderMaterial) {
        const uniforms = opaqueMesh.material.uniforms;
        uniforms.transparent.value = opaqueMesh.material.transparent;
        uniforms.opacity.value = clientState.uiParams["Model Opacity"];
        uniforms.ambientLightColor.value = new Color(
          clientState.uiParams["Ambient Color"]
        ).multiplyScalar(clientState.uiParams["Ambient Intensity"]);
        uniforms.alphaTest.value = clientState.uiParams["Alpha Test"];
        uniforms.uTime.value += delta;
        if (clientState.uiParams["Fancy Lighting"]) {
          uniforms.lightingMode.value = Sh1LightingMode.Diffuse;
        } else {
          uniforms.lightingMode.value = Sh1LightingMode.Matte;
        }
        if (clientState.uiParams["Visualize Normals"]) {
          uniforms.lightingMode.value = Sh1LightingMode.NormalMap;
        }
      }
      lightAnimate?.(delta);

      if (
        !clientState.getCustomModel() &&
        isSh2 &&
        clientState.folder === "favorites" &&
        clientState.file === "org.mdl"
      ) {
        modelSkeleton?.bones[2]?.rotateZ(delta * -0.005);
        modelSkeleton?.bones[3]?.rotateZ(delta * -0.0025);
      }

      renderer.render(scene, camera);

      if (clientState.uiParams["Render This Frame"]) {
        exportCanvas(
          appContainer,
          clientState.getCurrentContentName() + ".png"
        );
        clientState.uiParams["Render This Frame"] = false;
      }
    }

    renderIsFinished = true;
    clientState.notifyRenderFinished();
    if (!dds || name === clientState.file) {
      renderer.setAnimationLoop(null);
      renderer.setAnimationLoop(animate);
    }
    onWindowResize();
    return group;
  };

  if (isSh1 || isSh3) {
    scenarioInput.hide();
    folderInput.hide();
    fileInput.hide();
    lockToFolder.hide();
    sh1FileInput.show();
    sh3FileInput.hide();
    wrappingInput.hide();
    renderOpaqueInput.hide();
    renderTransparentInput.hide();
    skeletonModeController?.hide();
    editModeButton.hide();
    clientState.setMode("viewing");
    editModeButton.setValue(false);
    textureViewerButton.show();
    invertAlphaInput.hide();
    transparencyInput.hide();
    textureViewerButton.show();

    if (clientState.getGlVersion() === 1) {
      showQuickModal(
        "<p>WebGL 2 is required for Silent Hill 1 models for now.</p>" +
          "<p>This is because the models require animations to be properly displayed.</p>"
      );
      throw new Error("WebGL 1 not supported for Silent Hill 1 models");
    }
  } else {
    scenarioInput.show();
    folderInput.show();
    fileInput.show();
    lockToFolder.show();
    sh1FileInput.hide();
    wrappingInput.show();
    renderOpaqueInput.show();
    renderTransparentInput.show();
    skeletonModeController?.show();
    editModeButton.show();
    invertAlphaInput.show();
    transparencyInput.show();
    animationsFolder.hide();
    submeshFolder.hide();
    sh3FileInput.hide();
    textureViewerButton.show();
  }
  if (isSh3) {
    sh1FileInput.hide();
    sh3FileInput.show();

    clientState.uiParams["Texture Viewer 👀"] = false;
    clientState.getTextureViewer()?.setState(TextureViewerStates.Inactive);
    textureViewerButton.hide();
  }

  const filename: string = isSh2
    ? clientState.file
    : isSh3
    ? clientState.uiParams["File (SH3)"]
    : clientState.uiParams["File (SH1)"];
  const currentFileIndex = clientState.getFileIndex();
  const gameChanged = lastGame !== clientState.uiParams["Game"];
  const sh1FileChanged = isSh1 && lastSh1File !== filename;
  const sh2FileChanged = lastIndex !== currentFileIndex;
  const sh3FileChanged = isSh3 && lastSh3File !== filename;
  if (gameChanged || sh2FileChanged || sh1FileChanged || sh3FileChanged) {
    if (
      ((isSh1 && filename !== "LISA") ||
        (isSh3 && !favoriteSh3ModelFiles.includes(filename)) ||
        clientState.folder !== "favorites") &&
      !clientState.hasAcceptedContentWarning()
    ) {
      loadingMessage.remove();
      showContentWarningModal(
        () => {
          clientState.uiParams["Lock To Folder"] = false;
          render();
        },
        () => {
          if (isSh2) {
            clientState.setFileIndex(START_INDEX);
            return;
          }
          if (isSh1) {
            clientState.uiParams["File (SH1)"] = (lastSh1File ||
              "LISA") as (typeof ilmFiles)[number];
          } else if (isSh3) {
            clientState.uiParams["File (SH3)"] = lastSh3File || "pl/chhaa.mdl";
          }
          render();
        }
      );
      return;
    }

    lastSh1File = clientState.uiParams["File (SH1)"];
    lastSh3File = clientState.uiParams["File (SH3)"];
    lastGame = clientState.uiParams.Game;

    lastIndex = currentFileIndex;
    if (isSh2 && filename in preferredParams) {
      Object.assign(
        clientState.uiParams,
        preferredParams[filename as keyof typeof preferredParams]
      );
    } else if (isSh2) {
      Object.assign(clientState.uiParams, defaultParams);
    }
    if (gameChanged && isSh3) {
      alphaTestInput.setValue(0.2);
    } else if (gameChanged && !isSh3) {
      alphaTestInput.setValue(0.01);
    }
    clientState.uiParams["Selected Bone"] = 0;
    clientState.uiParams["Current Animation"] = "[none]";

    fileInput.setValue(clientState.file);
    scenarioInput.setValue(
      clientState.rootFolder === "chr" ? "Main Scenario" : "Born From A Wish"
    );
    folderInput.setValue(clientState.folder);
    folderInput.options(clientState.getPossibleFolders());
    fileInput.options(clientState.getPossibleFilenames());

    const children = submeshFolder.children.slice();
    for (let i = 0; i < children.length; i++) {
      children[i].destroy();
    }
    submeshListNeedsUpdate = true;
    submeshFolder.openAnimated(false);

    disposeResources(lightGroup);
    lightGroup = undefined;

    clientState.releaseCustomModel();

    if (clientState.file === "inu.mdl") {
      portraitModeWarning();
    }

    // where is the transparency bit stored?
    if (isSh1) {
      if (transparentIlmFiles.has(clientState.uiParams["File (SH1)"])) {
        clientState.uiParams.Transparency = true;
      } else {
        clientState.uiParams.Transparency = false;
      }
      clientState.uiParams["Render Side"] = "FrontSide";
    }

    if (clientState.uiParams["Sharable Link"] && !!history.pushState) {
      updateLink();
    }
  }

  editor.toggleOptionsIfNeeded();
  const customModel = clientState.getCustomModel();
  if (customModel !== undefined) {
    if (
      clientState.getMode() === "edit" &&
      editorState.serializerNeedsUpdate()
    ) {
      applyUpdate();
      return;
    }

    if (
      clientState.getMode() === "edit" &&
      editorState.editorParams["Show Original"] &&
      !editorState.cachedOriginalModel
    ) {
      loadModelFromUrl(clientState.fullPath).then(async (original) => {
        const cachedOriginalModel = await modelCallback(original);
        if (cachedOriginalModel) {
          cachedOriginalModel.parent = null;
        }
        cachedOriginalModel?.traverse((object) => {
          if (object instanceof Mesh) {
            const materials =
              object.material instanceof Material
                ? [object.material]
                : object.material;
            materials.forEach((material: Material) => {
              material.transparent = true;
              material.opacity = 0.5;
            });
          }
        });
        editorState.cachedOriginalModel = cachedOriginalModel;

        const model = loadModelFromBytes(customModel.contents);
        model._read();
        modelCallback(model, false);
      });
    } else {
      if (
        !editorState.editorParams["Show Original"] &&
        editorState.cachedOriginalModel instanceof Group
      ) {
        disposeResources(editorState.cachedOriginalModel);
        editorState.cachedOriginalModel = undefined;
      }
      const model = loadModelFromBytes(customModel.contents);
      model._read();
      modelCallback(model);
    }
    return;
  }

  if (isSh2 && clientState.file === "inu.mdl") {
    (async () => {
      let bytes,
        path,
        index = -1;
      if (clientState.file === "inu.mdl") {
        path = "/data/demo/inu/end_inu.dds";
      } else {
        const split = clientState.uiParams.Animation?.split("/") ?? [];
        if (split.length === 3) {
          split.splice(0, 0, "", "data");
        }
        index = ddsList.findIndex((name) => name.includes(split[3]!));
        path = `/data/${index >= 219 ? "demo2" : "demo"}/${ddsList[index]!}/${
          ddsList[index + 1] ?? ""
        }`;
      }
      bytes = await fetchArrayBuffer(path);
      const dds = loadDramaDemoFromBytes(bytes);

      const argArray: Array<Parameters<typeof modelCallback>> = [];
      let loaded = 0;
      async function spawnCharacter(i = 0) {
        const name = dds.characterNames[i];
        if (name === undefined) {
          return;
        }
        const mdlName = (name.name1.split("_pos")[0] +
          ".mdl") as (typeof fileArray)[number];
        const modelIndex = fileArray.indexOf(mdlName);
        const path = destructureIndex(modelIndex).join("/");

        const model = await loadModelFromUrl("/data/" + path);

        if (clientState.file !== "inu.mdl") {
          // file changed while loading
          return;
        }
        let anm: SilentHillAnimation | undefined;
        if (model !== undefined) {
          anm = await loadAnimationFromUrl(
            `/data/${index >= 219 ? "demo2" : "demo"}/${
              ddsList[index] ?? "inu"
            }/${mdlName}`.replace(".mdl", ".anm"),
            model
          );
        }

        if (i === 0) {
          clientState.setCurrentViewerModel(model);
        }
        argArray.push([model, undefined, anm, dds, mdlName]);
        loaded++;
        loadingMessage.textContent = `loading... (${loaded}/${
          dds.characterNames.length + 1
        })`;
      }

      Promise.all(
        dds.characterNames.map((_, i) => {
          return spawnCharacter(i);
        })
      ).then(() => {
        argArray.forEach((args, index) => {
          args[1] = index === 0;
          modelCallback(...args);
        });
      });
    })();
    return;
  }

  if (isSh1 || isSh3) {
    modelCallback();
    return;
  }

  loadModelFromUrl(clientState.fullPath).then(async (model) => {
    clientState.setCurrentViewerModel(model);
    modelCallback(model);
  });
};

(window as any).render = render;
(window as any).scene = scene;
(window as any).state = clientState;
(window as any).mixers = mixers;

render();
clientState.setOnUpdate(render);
