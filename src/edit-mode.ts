import GUI, { Controller } from "lil-gui";
import { clientState } from "./objects/MuseumState";
import TextureViewer from "./objects/TextureViewer";
import { applyUpdate, fileCallback, sharedSerializationData } from "./write";
import logger from "./objects/Logger";
import EditorState, { editorState } from "./objects/EditorState";
import {
  Autoscale,
  BonemapMethod,
  BonemapType,
  ModelParams,
  SilentHillModelTypes,
} from "./objects/SerializableModel";
import SilentHillModel from "./kaitai/Mdl";
import { ModelPropertyDiffJson } from "./write-worker";
import { onConfirm, showQuickModal } from "./modals";
import ghostParams from "./assets/ghost-params.json";

export const consoleGui = new GUI({
  title: "Output",
  autoPlace: false,
});

export default class EditMode {
  public editorGui: GUI;
  public sidebarButtonsContainer: HTMLDivElement;
  public tryExampleButton: Controller;
  public bonemapTextarea: HTMLTextAreaElement;

  public constructor() {
    const sidebar = document.getElementById("sidebar");
    if (!(sidebar instanceof HTMLDivElement)) {
      throw Error("Could not find sidebar div element!");
    }
    const sidebarButtonsContainer = sidebar.querySelector(".sidebar-buttons");
    if (!(sidebarButtonsContainer instanceof HTMLDivElement)) {
      throw Error("Could not find sidebar buttons element!");
    }
    const filepicker: HTMLInputElement | null =
      document.querySelector(".filepicker");
    filepicker?.addEventListener("change", () => {
      const file = filepicker?.files?.[0];
      if (file) {
        fileCallback(file);
      }
    });
    const editorGui = new GUI({ container: sidebar, title: "Options" });
    const rerenderButton = editorGui.add(
      {
        Rerender: async () => {
          const object = clientState.getCurrentObject();
          if (!object) {
            return;
          }
          applyUpdate();
        },
      },
      "Rerender"
    );

    const tryExampleButton = editorGui.add(
      {
        "try the example model!": async () => {
          showQuickModal(
            `<p>this will load <span class="accent"><code>Low Poly Ghost</code></span> ` +
              `by user <strong>Jenna Ward</strong> on Sketchfab! it's a really cute model, ` +
              `please go give it a like ` +
              `<a href="https://sketchfab.com/3d-models/low-poly-ghost-62e2b3e9db77443b88a7341ac0032e3b">on sketchfab</a> :)</p>` +
              `<p>it's licensed under <a href="https://creativecommons.org/licenses/by/4.0/">CC-BY 4.0</a>, so by proceeding, ` +
              `you agree to adhere to the restrictions of this license.</p>`,
            undefined,
            { confirm: { okText: "amazing!", cancelText: "nevermind" } }
          );
          onConfirm(async () => {
            const resp = await fetch("/glb/low-poly-ghost/low-poly-ghost.glb");
            const blob = await resp.blob();
            const file = new File([blob], "low-poly-ghost.glb", {
              type: "model/gltf-binary",
            });
            if (!fileCallback(file)) {
              return;
            }

            const unsub = clientState.subscribeToUpdates(() => {
              showQuickModal(
                "<p>done! <strong>use preset params?</strong> (intended for characters such as " +
                  `<a href="/?model=chr-jms-hll_jms"><code>hll_jms.mdl</code></a>, ` +
                  "but it may also work on other models such as " +
                  `<a href="/?model=chr-item-c1b"><code>c1b.mdl</code></a>.)</p>` +
                  "<p><em>more notes</em>:</p> <p>when it loads, click 'export current' to download it! " +
                  "<p>note that for best results with james, you need to export all `jms` models.</p>",
                undefined,
                {
                  confirm: {
                    okText: "sure, use preset!",
                    cancelText: "hmm i'll figure it out",
                  },
                }
              );
              onConfirm(() => {
                loadJsonParams(ghostParams);
              });
              unsub();
            });
          });
        },
      },
      "try the example model!"
    );
    tryExampleButton.domElement.classList.add("try-example-button");
    this.tryExampleButton = tryExampleButton;

    const exportButton = editorGui.add(
      {
        "Export Current": async () => {
          const object = clientState.getCurrentObject();
          if (!object) {
            return;
          }
          clientState.requestSave();
          applyUpdate();
        },
      },
      "Export Current"
    );
    const resetModel = async () => {
      const file = clientState.getCurrentFile();
      if (!file) {
        return;
      }
      editorState.resetSerializationState();
      fileCallback(file);
    };
    const resetButton = editorGui.add(
      {
        "Reset Model": resetModel,
      },
      "Reset Model"
    );
    tryExampleButton.domElement.querySelector(
      "button div"
    )!.innerHTML += ` <span class="accent">[new!]</span>`;
    filepicker?.parentElement?.appendChild(tryExampleButton.domElement);
    sidebarButtonsContainer.appendChild(exportButton.domElement);
    sidebarButtonsContainer.appendChild(resetButton.domElement);
    sidebarButtonsContainer.appendChild(rerenderButton.domElement);
    editorGui
      .add(
        editorState.editorParams,
        "Model Type",
        Object.values(SilentHillModelTypes)
      )
      .listen()
      .onFinishChange(() => editorState.updateSerializationParams());
    editorGui
      .add(editorState.editorParams, "Auto-Scale", Object.values(Autoscale))
      .onFinishChange(() => this.updateAndReset());
    editorGui
      .add(
        editorState.editorParams,
        "Bonemap Method",
        Object.values(BonemapMethod)
      )
      .onFinishChange((value: BonemapType) => {
        if (value === BonemapMethod.Manual) {
          bonemapTextarea.style.display = "block";
          bonemapButton.style.display = "block";
        } else {
          bonemapTextarea.style.display = "none";
          bonemapButton.style.display = "none";
        }
        applyUpdate();
      });
    editorGui.add(editorState.editorParams, "Collapse Target", 0, 255, 1);
    editorGui
      .add(editorState.editorParams, "Flip Y")
      .onFinishChange(() => this.updateAndReset());
    editorGui
      .add(editorState.editorParams, "Show Original")
      .onFinishChange((show: boolean) => {
        editorState.serializerNeedsUpdate()
          ? applyUpdate()
          : clientState.triggerUpdate();
        if (show) {
          originalModelControls.show();
        } else {
          originalModelControls.hide();
        }
      });
    editorGui.add(editorState.editorParams, "Model Controls");
    editorGui.add(
      editorState.editorParams,
      "Rotation Step",
      Number.MIN_VALUE,
      180
    );

    const hatesConfetti = localStorage.getItem("hatesConfetti");
    editorState.editorParams["Confetti"] = clientState.prefersReducedMotion()
      ? false
      : hatesConfetti !== null
      ? hatesConfetti === "false"
      : true;
    const bread = editorGui.add(editorState.editorParams, "🍞 It's Bread");
    const breadContainer = editorGui.addFolder("...").hide();
    const croissant = breadContainer.add(
      {
        "more coming soon!": () => {
          breadify(croissant.domElement, [
            "💖",
            "💚",
            "💛",
            "🧡",
            "💜",
            "❤️",
            "💙",
            "🤍",
            "🖤",
          ]);
        },
      },
      "more coming soon!"
    );
    breadContainer.add(
      {
        "Copy Params To Clipboard": async () => {
          breadify(croissant.domElement, ["📋", "📎"]);
          await navigator.clipboard.writeText(
            JSON.stringify({
              params: editorState.getSerializationParams(),
              editorParams: editorState.editorParams,
              modelParams: editorState.getSerializationParams(),
              diff: editorState.getModelPropertyDiff(),
            })
          );
        },
      },
      "Copy Params To Clipboard"
    );

    const loadJsonParams = (params: object | string) => {
      try {
        let parsed: any;

        if (typeof params === "string") {
          parsed = JSON.parse(params);
        } else if (typeof params !== "object") {
          throw new Error("Clipboard contents were invalid");
        } else {
          parsed = params as any;
        }

        if (typeof parsed["modelParams"] !== "object") {
          throw new Error("Failed to parse serialization params");
        }
        if (typeof parsed["editorParams"] !== "object") {
          throw new Error("Failed to parse editor params");
        }
        if (typeof parsed["diff"] !== "object") {
          throw new Error("Failed to parse transform diff");
        }
        const { editorParams, modelParams, diff } = parsed as {
          editorParams: EditorState["editorParams"];
          modelParams: Partial<ModelParams>;
          diff: ModelPropertyDiffJson;
        };
        editorState.initializePropertyDiff();
        editorState.resetSerializationState();
        Object.assign(editorState.editorParams, {
          "Flip Y": editorParams["Flip Y"],
          "Backface Culling": editorParams["Backface Culling"],
          "Material Type": editorParams["Material Type"],
          "Auto-Scale": editorParams["Auto-Scale"],
          "Collapse Target": editorParams["Collapse Target"],
          "Bonemap Method": editorParams["Bonemap Method"],
        });
        delete modelParams.materialIndices;
        delete modelParams.textureIndices;
        delete modelParams.textureIdStart;
        editorState.updateSerializationParams(modelParams);
        editorState.setModelPropertyDiffFromJson(diff);
        editorGui.controllersRecursive().forEach((c) => {
          c.updateDisplay();
        });
        applyUpdate();
      } catch (e) {
        logger.debug(e);
        showQuickModal(`<code style="text-wrap: wrap">${e}</code>`);
      }
    };
    breadContainer.add(
      {
        "Paste Params From Clipboard": async () => {
          breadify(croissant.domElement, ["📋", "📎"]);
          const unclippy = await navigator.clipboard.readText();
          loadJsonParams(unclippy);
        },
      },
      "Paste Params From Clipboard"
    );
    breadContainer.add(editorState.editorParams, "Backface Culling", [
      "Default",
      "On",
      "Off",
    ]);
    breadContainer.add(
      editorState.editorParams,
      "Material Type",
      Object.values(SilentHillModel.PrimitiveHeader.MaterialType)
        .filter((value) => isNaN(parseInt(String(value))))
        .concat("Default")
    );

    const EMOJIS = ["🍞"];
    bread.onFinishChange((v: boolean) => {
      if (v) {
        breadContainer.show();
      } else {
        breadContainer.hide();
      }

      breadify(bread.domElement);
    });

    const breadify = (element: HTMLElement, emojis = EMOJIS) => {
      if (!editorState.editorParams["Confetti"]) {
        return;
      }
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const SIZE = 200;

      for (let i = 0; i < 20; i++) {
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        const particle = document.createElement("span");
        particle.className = "particle";
        particle.textContent = emoji;

        const dx = `${(Math.random() - 0.5) * SIZE}px`;
        const dy = `${(Math.random() - 0.5) * SIZE}px`;

        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        particle.style.setProperty("--dx", dx);
        particle.style.setProperty("--dy", dy);

        document.body.appendChild(particle);

        particle.addEventListener("animationend", () => {
          particle.remove();
        });
      }
    };
    const originalModelControls = editorGui
      .add(editorState.editorParams, "Base Model Controls")
      .onFinishChange(() =>
        editorState.serializerNeedsUpdate()
          ? applyUpdate()
          : clientState.triggerUpdate()
      )
      .hide();

    const bonemapTextarea = document.createElement("textarea");
    bonemapTextarea.classList.add("bonemap-textarea");
    bonemapTextarea.value = JSON.stringify({ 0: 0 }, null, 4);
    bonemapTextarea.addEventListener("keydown", (event) =>
      event.stopPropagation()
    );
    bonemapTextarea.style.display = "none";
    this.bonemapTextarea = bonemapTextarea;
    editorState.setOnUpdate(() => this.updateBonemap());

    const bonemapButton = document.createElement("button");
    bonemapButton.classList.add("bonemap-button");
    bonemapButton.innerHTML = "OK";
    bonemapButton.style.display = "none";
    bonemapButton.addEventListener("click", () => {
      editorState.updateSerializationParams({
        bonemap: JSON.parse(bonemapTextarea.value),
      });
      applyUpdate();
    });

    editorGui.domElement.appendChild(bonemapTextarea);
    editorGui.domElement.appendChild(bonemapButton);

    const confettiToggle = breadContainer.add(
      editorState.editorParams,
      "Confetti"
    );
    confettiToggle.onFinishChange((value: boolean) => {
      localStorage.setItem("hatesConfetti", String(!value));
      editorState.editorParams["Confetti"] = value;
    });

    this.editorGui = editorGui;
    this.sidebarButtonsContainer = sidebarButtonsContainer;
    this.toggleOptionsIfNeeded();

    const outputLogWrapper = document.querySelector(".output-log-wrapper");
    const outputLog = outputLogWrapper?.querySelector(".output-log");
    if (
      outputLog instanceof HTMLElement &&
      outputLogWrapper instanceof HTMLElement
    ) {
      outputLogWrapper.appendChild(consoleGui.domElement);
      consoleGui.$children.appendChild(outputLog);
      consoleGui.close();
      logger.addPipe(
        {
          onMessage: (level, message, ...optionalParams) => {
            const sanitizedMessage = [message, ...optionalParams]
              .filter((value) => typeof value !== "object")
              .join(" ");
            const levelText = `[${level}]`;
            if (sanitizedMessage) {
              outputLog.innerHTML += `<p class="${level}">${levelText} ${sanitizedMessage}</p>`;
            }
            outputLog.scrollTop = outputLog.scrollHeight;
          },
          clear: () => (outputLog.innerHTML = ""),
          allowedLevels: ["debug", "error", "warn", "info"],
          enabled: false,
        },
        "editModeLog"
      );
    } else {
      throw Error("Did not find output log!");
    }

    const textureViewerGui = new GUI({
      container: sidebar,
      title: "Texture Viewer",
    });
    textureViewerGui.$children.remove();
    textureViewerGui.domElement.classList.add(
      "root",
      "texture-viewer-container"
    );
    const textureViewerContentDiv = document.createElement("div");
    textureViewerContentDiv.classList.add("texture-viewer", "content");
    textureViewerGui.domElement.appendChild(textureViewerContentDiv);
    const textureViewer = new TextureViewer(sidebar);
    clientState.setTextureViewer(textureViewer);
  }

  public updateBonemap() {
    this.bonemapTextarea.value = JSON.stringify(
      sharedSerializationData.bonemap,
      null,
      4
    );
  }

  public toggleOptionsIfNeeded() {
    if (!clientState.getCustomModel()) {
      this.sidebarButtonsContainer.style.display = "none";
      this.tryExampleButton.show();
      this.editorGui.hide();
    } else {
      this.sidebarButtonsContainer.style.display = "block";
      this.tryExampleButton.hide();
      this.editorGui.show();
    }
  }

  public updateAndReset() {
    const file = clientState.getCurrentFile();
    if (!file) {
      return;
    }
    editorState.updateSerializationParams();
    editorState.initializePropertyDiff();
    fileCallback(file);
  }
}
