import { AnimationAction, AnimationClip } from "three";
import { createDiv } from "../utils";

export default class QuickAccess {
  public container: HTMLElement;

  public animationProgressBar: HTMLElement;
  public animationTimer = -1;

  public constructor(parent: HTMLElement) {
    this.container = this.createAnimationVisualizer(parent);
    this.animationProgressBar = createDiv(
      this.container,
      "anm-progress-bar pointer-events-none"
    );
  }

  public createAnimationVisualizer(parent: HTMLElement) {
    const div = createDiv(parent, "quick-access-toolbar ui");

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

  public hide() {
    this.container.style.display = "none";
  }

  public show() {
    this.container.style.display = "flex";
  }

  public useAnimationVisualizer(action: AnimationAction, clip: AnimationClip) {
    const progressBar = this.animationProgressBar;
    const canUseTranslateX = CSS.supports("transform", "translateX(50cqi)");
    const quickAccess = this;
    this.show();

    function animate() {
      const duration = clip.duration;
      if (duration <= 0) {
        return requestAnimationFrame(animate);
      }

      let time = quickAccess.animationTimer;

      if (quickAccess.animationTimer >= 0) {
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
}
