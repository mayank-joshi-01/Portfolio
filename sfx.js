// Interface sound for the case-file portfolio, built on uisfx with the "mechanical" pack:
// switches, relays and firm detents, the sound of a report being stamped and filed.
// Sound only ever reinforces a visible change; every cue has a visual and ARIA twin.
//
// In the browser, `uisfx` resolves through the import map in index.html (pinned CDN build).
// In tests it resolves to the npm package. Nothing here touches the DOM at import time.

import { createUISFX } from "uisfx";

/** @typedef {import('uisfx').CueName} CueName */
/** @typedef {import('uisfx').PlayingSFX} PlayingSFX */
/** @typedef {import('uisfx').UISFXPlayer} UISFXPlayer */
/** @typedef {import('uisfx').UISFXOptions} UISFXOptions */
/** @typedef {Pick<Storage, 'getItem' | 'setItem'>} PrefStorage */
/**
 * @typedef {object} Pref
 * @property {boolean} enabled
 * @property {number} volume
 */
/**
 * @typedef {object} PlayOpts
 * @property {boolean} [follow] a secondary cue (e.g. a dialog's close event); skipped if this user input already sounded
 */

export const PACK = "mechanical";
export const PREF_KEY = "mj:sound";
export const DEFAULT_VOLUME = 0.7;
/** a cue started on a still-suspended context only counts if a gesture just asked it to resume */
const RESUME_WINDOW_MS = 100;

/**
 * @param {PrefStorage | undefined} storage
 * @returns {Pref}
 */
export function readPref(storage) {
  /** @type {Pref} */
  const pref = { enabled: true, volume: DEFAULT_VOLUME };
  try {
    const raw = storage && storage.getItem(PREF_KEY);
    if (!raw) return pref;
    const saved = JSON.parse(raw);
    if (typeof saved.enabled === "boolean") pref.enabled = saved.enabled;
    if (
      typeof saved.volume === "number" &&
      saved.volume >= 0 &&
      saved.volume <= 1
    )
      pref.volume = saved.volume;
  } catch {
    /* private mode or corrupt value: fall back to defaults */
  }
  return pref;
}

/**
 * @param {PrefStorage | undefined} storage
 * @param {Pref} pref
 */
function writePref(storage, pref) {
  try {
    if (storage) storage.setItem(PREF_KEY, JSON.stringify(pref));
  } catch {
    /* storage blocked: the choice still holds for this visit */
  }
}

/**
 * The single site-wide sound service. The player and its AudioContext are created lazily, on the
 * first genuine user gesture, and never while sound is off.
 *
 * @param {object} [deps]
 * @param {(options: UISFXOptions) => UISFXPlayer} [deps.create]
 * @param {() => AudioContext | undefined} [deps.makeContext]
 * @param {PrefStorage} [deps.storage]
 * @param {() => number} [deps.now]
 * @param {() => boolean} [deps.isHidden]
 */
export function createSiteSound(deps = {}) {
  const create = deps.create || createUISFX;
  const now = deps.now || (() => performance.now());
  const isHidden = deps.isHidden || (() => false);
  const makeContext =
    deps.makeContext ||
    (() => {
      const AC =
        typeof window === "undefined" ? undefined : window.AudioContext;
      return AC ? new AC({ latencyHint: "interactive" }) : undefined;
    });
  const storage = deps.storage;
  const pref = readPref(storage);

  /** @type {AudioContext | undefined} */
  let ctx;
  /** @type {UISFXPlayer | undefined} */
  let ui;
  let resumeAskedAt = -Infinity;
  /** a cue has already played for the latest user input: one cue per interaction */
  let soundedForInput = false;
  let disposed = false;
  /** @type {Map<CueName, PlayingSFX>} */
  const loops = new Map();

  /** Create (once) and resume the context. Only call from a trusted gesture handler, synchronously. */
  function wake() {
    if (disposed || !pref.enabled) return;
    if (!ctx) {
      ctx = makeContext();
      if (!ctx) return;
      ui = create({
        pack: PACK,
        volume: pref.volume,
        enabled: pref.enabled,
        context: ctx,
      });
    }
    if (ctx.state !== "running") {
      resumeAskedAt = now();
      ctx.resume().catch(() => {});
    }
  }

  function audible() {
    if (disposed || !pref.enabled || !ctx || !ui || isHidden()) return false;
    if (ctx.state === "running") return true;
    // resume() was just requested by this gesture; the cue will start a few ms later, not stale
    return (
      ctx.state === "suspended" && now() - resumeAskedAt < RESUME_WINDOW_MS
    );
  }

  /**
   * Play a one-shot cue. Returns null whenever it is suppressed: muted, before any gesture,
   * page hidden, or the context could not start.
   * @param {CueName} cue
   * @param {PlayOpts} [opts]
   * @returns {PlayingSFX | null}
   */
  function play(cue, opts = {}) {
    if (!audible() || !ui) return null;
    if (opts.follow && soundedForInput) return null;
    const handle = ui.play(cue);
    if (handle) soundedForInput = true;
    return handle;
  }

  /**
   * Start a loop for a visible process. Idempotent: a second start returns the running handle.
   * @param {CueName} cue
   * @returns {PlayingSFX | null}
   */
  function startLoop(cue) {
    const running = loops.get(cue);
    if (running) return running;
    if (!audible() || !ui) return null;
    const handle = ui.play(cue, { loop: true });
    if (handle) loops.set(cue, handle);
    return handle;
  }

  /** @param {CueName} cue */
  function stopLoop(cue) {
    const handle = loops.get(cue);
    loops.delete(cue);
    if (handle) handle.stop();
  }

  function stopLoops() {
    for (const cue of [...loops.keys()]) stopLoop(cue);
  }

  /** Silence everything now: retained loops first, then whatever else is still ringing. */
  function hush() {
    stopLoops();
    if (ui) ui.stopAll();
  }

  /**
   * Run an async task with an optional loop while it is pending, and sound its real outcome.
   * The loop stops on every exit path; failure is rethrown; an aborted task plays no error.
   * @template T
   * @param {() => Promise<T>} task
   * @param {{ loop?: CueName, success?: CueName, failure?: CueName, signal?: AbortSignal }} [cues]
   * @returns {Promise<T>}
   */
  async function track(task, cues = {}) {
    if (cues.loop) startLoop(cues.loop);
    let result;
    try {
      result = await task();
    } catch (error) {
      if (cues.loop) stopLoop(cues.loop);
      const cancelled =
        (cues.signal && cues.signal.aborted) ||
        (error instanceof Error && error.name === "AbortError");
      if (!cancelled && cues.failure) play(cues.failure);
      throw error;
    } finally {
      if (cues.loop) stopLoop(cues.loop);
    }
    if (cues.success) play(cues.success);
    return result;
  }

  /**
   * Turn sound on or off and remember it. Turning on is itself a gesture, so it wakes the context.
   * @param {boolean} on
   */
  function setEnabled(on) {
    if (!on) hush();
    pref.enabled = on;
    writePref(storage, pref);
    if (ui) ui.setEnabled(on);
    if (on) {
      if (ui) ui.setPack(PACK);
      wake();
    }
  }

  /** @param {number} volume 0..1 */
  function setVolume(volume) {
    pref.volume = Math.min(1, Math.max(0, volume));
    writePref(storage, pref);
    if (ui) ui.setVolume(pref.volume);
  }

  /** Final teardown: stop, destroy the player, then close the context this service created. */
  async function dispose() {
    if (disposed) return;
    disposed = true;
    hush();
    const player = ui;
    const context = ctx;
    ui = undefined;
    ctx = undefined;
    if (player) await player.destroy();
    if (context && context.state !== "closed") await context.close();
  }

  return {
    play,
    startLoop,
    stopLoop,
    stopLoops,
    hush,
    track,
    wake,
    setEnabled,
    setVolume,
    dispose,
    isEnabled: () => pref.enabled,
    getVolume: () => pref.volume,
    activeLoops: () => [...loops.keys()],
    /** a new user input starts a new interaction */
    noteInput: () => {
      soundedForInput = false;
    },
  };
}

/** @typedef {ReturnType<typeof createSiteSound>} SiteSound */

/**
 * Is this event a user activation that browsers accept for starting audio?
 * Touch pointerdown and Escape are not; the click or touchend that follows them is.
 * @param {Event} e
 */
export function isActivation(e) {
  if (!e.isTrusted) return false;
  if (e.type === "keydown")
    return /** @type {KeyboardEvent} */ (e).key !== "Escape";
  if (e.type === "pointerdown")
    return /** @type {PointerEvent} */ (e).pointerType !== "touch";
  return e.type === "click" || e.type === "touchend" || e.type === "pointerup";
}

const GESTURES = ["pointerdown", "pointerup", "keydown", "click", "touchend"];

/**
 * Wire the service to a document: gesture unlock, sound toggles ([data-sound-toggle]), and
 * stopping loops whenever the page is hidden. Returns an unmount function.
 * @param {Document} doc
 * @param {SiteSound} sound
 * @param {{ accept?: (e: Event) => boolean }} [opts] which events count as a user activation
 */
export function mountSiteSound(doc, sound, { accept = isActivation } = {}) {
  const toggles = /** @type {HTMLButtonElement[]} */ ([
    ...doc.querySelectorAll("[data-sound-toggle]"),
  ]);

  function render() {
    const on = sound.isEnabled();
    for (const b of toggles) {
      b.setAttribute("aria-pressed", on ? "true" : "false");
      const state = b.querySelector("[data-sound-state]");
      if (state) state.textContent = on ? "On" : "Off";
    }
  }

  /** @param {Event} e */
  const onGesture = (e) => {
    if (e.isTrusted || accept(e)) sound.noteInput();
    if (accept(e)) sound.wake();
  };
  /** @param {Event} e */
  const onToggle = (e) => {
    e.preventDefault();
    const on = !sound.isEnabled();
    sound.setEnabled(on);
    render();
    if (on) sound.play("toggle-on");
  };
  const onVisibility = () => {
    if (doc.hidden) sound.hush();
  };
  const onPageHide = () => sound.hush();

  for (const type of GESTURES)
    doc.addEventListener(type, onGesture, { capture: true, passive: true });
  for (const b of toggles) {
    b.addEventListener("click", onToggle);
    b.hidden = false;
  }
  doc.addEventListener("visibilitychange", onVisibility);
  const win = doc.defaultView;
  if (win) win.addEventListener("pagehide", onPageHide);
  render();

  return function unmount() {
    for (const type of GESTURES)
      doc.removeEventListener(type, onGesture, { capture: true });
    for (const b of toggles) b.removeEventListener("click", onToggle);
    doc.removeEventListener("visibilitychange", onVisibility);
    if (win) win.removeEventListener("pagehide", onPageHide);
    sound.hush();
  };
}

/**
 * Browser entry point. Safe to call more than once and safe outside a browser (returns null).
 * Exposes the service as window.siteSound for the page's inline script.
 * @returns {SiteSound | null}
 */
export function boot() {
  if (typeof window === "undefined" || typeof document === "undefined")
    return null;
  const w = /** @type {Window & { siteSound?: SiteSound }} */ (window);
  if (w.siteSound) return w.siteSound;
  /** @type {PrefStorage | undefined} */
  let storage;
  try {
    storage = window.localStorage;
  } catch {
    storage = undefined;
  }
  const sound = createSiteSound({ storage, isHidden: () => document.hidden });
  mountSiteSound(document, sound);
  w.siteSound = sound;
  return sound;
}
