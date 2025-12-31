import { AnimationAction, AnimationClip } from "three";
import { createDiv } from "../utils";
import { isMobile } from "../utils";

export default class QuickBar {
  public container: HTMLElement;

  public animationProgressBar: HTMLElement;
  public animationTimer = -1;
  private playing = true;
  private _forceClosed = false;

  public constructor(parent: HTMLElement) {
    this.container = this.createNotifcation(parent);
    this.animationProgressBar = createDiv(
      this.container,
      "anm-progress-bar pointer-events-none"
    );
    parent.style.visibility = "visible";
  }

  public createNotifcation(parent: HTMLElement) {
    const div = createDiv(parent, "quick-access-toolbar ui");

    div.addEventListener("pointerdown", () => {
      this._forceClosed = true;
      this.hide(true);
    });

    return div;
  }

  public createAnimationVisualizer(parent: HTMLElement) {
    const div = createDiv(parent, "quick-access-toolbar");

    let pointerIsDown = false;
    let pointerId = -1;
    const shiftTime = (event: PointerEvent) => {
      const percent = event.offsetX / div.offsetWidth; // style computation. it's ok
      if (percent > 0) {
        this.animationTimer = percent;
      }
    };
    div.addEventListener("pointerdown", (event) => {
      event.preventDefault();

      div.setPointerCapture(event.pointerId);
      pointerId = event.pointerId;
      pointerIsDown = true;

      shiftTime(event);
    });

    div.addEventListener("pointermove", (event) => {
      event.preventDefault();
      if (!pointerIsDown) {
        return;
      }
      shiftTime(event);
    });

    const stop = (event: PointerEvent) => {
      event.preventDefault();

      if (pointerId >= 0) {
        div.releasePointerCapture(pointerId);
      }
      pointerId = -1;
      pointerIsDown = false;

      this.animationTimer = -1;
    };

    div.addEventListener("pointerup", stop);
    div.addEventListener("pointercancel", stop);
    div.addEventListener("pointerleave", stop);

    return div;
  }

  public hide(animated = false) {
    if (animated) {
      this.container.classList.add("animated-hidden");
    } else {
      this.container.classList.add("hidden");
    }
  }

  public show() {
    this._forceClosed = false;
    this.container.classList.remove("animated-hidden");
    this.container.classList.remove("hidden");
    this.container.innerHTML = isMobile()
      ? `👀 turn the device <img class="accent spinny-landscape" src="/images/fa-mobile.svg" alt="Turn the device" />`
      : `👀 best viewed in landscape <img class="accent widen-landscape" src="/images/fa-image.svg" alt="Make screen wider" />`;
  }

  public useAnimationVisualizer(action: AnimationAction, clip: AnimationClip) {
    const progressBar = this.animationProgressBar;
    const canUseTranslateX = CSS.supports("transform", "translateX(50cqi)");
    const quickBar = this;
    this.show();

    function animate() {
      const duration = clip.duration;
      if (duration <= 0) {
        return requestAnimationFrame(animate);
      }

      if (!quickBar.playing) {
        action.getMixer().timeScale = 0;

        return requestAnimationFrame(animate);
      } else if (!action.getMixer().timeScale) {
        action.getMixer().timeScale = 1;
      }

      let time = quickBar.animationTimer;

      if (quickBar.animationTimer >= 0) {
        action.getMixer().setTime(time * clip.duration);
      } else {
        time = action.time / duration;
      }

      const percent = 100 * time;

      if (canUseTranslateX) {
        progressBar.style.transform = `translateX(${percent}cqi)`;
      } else {
        progressBar.style.left = `${percent}%`;
      }
      progressBar.innerText = `${percent.toFixed(2)}%(${Math.floor(
        (time * clip.duration) / 5
      )} / ${duration / 5})`;

      return requestAnimationFrame(animate);
    }
    return requestAnimationFrame(animate);
  }

  public togglePause() {
    this.playing = !this.playing;
  }

  public get forceClosed() {
    return this._forceClosed;
  }
}
