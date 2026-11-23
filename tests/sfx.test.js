import { describe, it, expect, beforeEach, vi } from "vitest";
import { cueNames, getPlaybackMode } from "uisfx";
import {
  createSiteSound,
  mountSiteSound,
  readPref,
  isActivation,
  PACK,
  PREF_KEY,
  boot,
} from "../sfx.js";

/** In-memory Storage stand-in */
function memStorage(init = {}) {
  const m = new Map(Object.entries(init));
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    m,
  };
}

/** A fake AudioContext that starts suspended and runs once resumed */
function fakeContext() {
  const ctx = {
    state: "suspended",
    resume: vi.fn(() => {
      ctx.state = "running";
      return Promise.resolve();
    }),
    close: vi.fn(() => {
      ctx.state = "closed";
      return Promise.resolve();
    }),
  };
  return ctx;
}

/** A fake uisfx player that records every call */
function fakePlayer() {
  const log = [];
  const handles = [];
  const player = {
    log,
    handles,
    options: null,
    play: vi.fn((cue, opts) => {
      const h = {
        cue,
        loop: !!(opts && opts.loop),
        stopped: false,
        stop: vi.fn(() => (h.stopped = true)),
        ended: Promise.resolve(),
      };
      handles.push(h);
      log.push(cue);
      return h;
    }),
    setEnabled: vi.fn(),
    setVolume: vi.fn(),
    setPack: vi.fn(),
    stopAll: vi.fn(() => handles.forEach((h) => (h.stopped = true))),
    destroy: vi.fn(() => Promise.resolve()),
  };
  return player;
}

function setup({ storage = memStorage(), hidden = false } = {}) {
  let t = 1000;
  const ctx = fakeContext();
  const player = fakePlayer();
  const create = vi.fn((options) => {
    player.options = options;
    return player;
  });
  const state = { hidden };
  const sound = createSiteSound({
    create,
    makeContext: () => ctx,
    storage,
    now: () => t,
    isHidden: () => state.hidden,
  });
  return {
    sound,
    ctx,
    player,
    create,
    storage,
    state,
    advance: (ms) => (t += ms),
  };
}

describe("pack and cue mapping", () => {
  it("uses the mechanical pack, at volume 0.7, with the saved enabled state and its own context", () => {
    const { sound, create, ctx } = setup({
      storage: memStorage({ [PREF_KEY]: '{"enabled":true}' }),
    });
    sound.wake();
    expect(create).toHaveBeenCalledTimes(1);
    expect(create.mock.calls[0][0]).toEqual({
      pack: "mechanical",
      volume: 0.7,
      enabled: true,
      context: ctx,
    });
    expect(PACK).toBe("mechanical");
  });

  it("every cue the page plays is a real one-shot uisfx cue", async () => {
    const { readFile } = await import("node:fs/promises");
    const html = await readFile(
      new URL("../index.html", import.meta.url),
      "utf8",
    );
    const used = new Set(
      [...html.matchAll(/sfx\((?:[^?;]*\?'([a-z-]+)':)?'([a-z-]+)'/g)].flatMap(
        (m) => m.slice(1).filter(Boolean),
      ),
    );
    for (const m of html.matchAll(/(?:success|failure):'([a-z-]+)'/g))
      used.add(m[1]);
    used.add("toggle-on"); // played by mountSiteSound
    expect([...used].sort()).toEqual([
      "close",
      "collapse",
      "copy",
      "error",
      "expand",
      "open",
      "reward",
      "select",
      "toggle-on",
    ]);
    for (const cue of used) {
      expect(cueNames).toContain(cue);
      expect(getPlaybackMode(cue)).toBe("one-shot");
    }
  });
});

describe("unlock and suppression", () => {
  it("creates nothing and plays nothing before a user gesture", () => {
    const { sound, create, player } = setup();
    expect(sound.play("open")).toBeNull();
    expect(sound.startLoop("loading")).toBeNull();
    expect(create).not.toHaveBeenCalled();
    expect(player.play).not.toHaveBeenCalled();
  });

  it("plays a cue in the same gesture that asked the context to resume", () => {
    const s = setup();
    s.ctx.resume = vi.fn(() => new Promise(() => {})); // still suspended in this task
    s.sound.wake();
    expect(s.sound.play("open")).not.toBeNull();
  });

  it("drops stale cues if the context never started after a gesture", () => {
    const s = setup();
    s.ctx.resume = vi.fn(() => new Promise(() => {}));
    s.sound.wake();
    s.advance(500);
    expect(s.sound.play("copy")).toBeNull();
  });

  it("plays after unlock and handles the player returning null", () => {
    const s = setup();
    s.sound.wake();
    expect(s.sound.play("expand")).not.toBeNull();
    s.player.play.mockReturnValueOnce(null);
    expect(s.sound.play("collapse")).toBeNull();
  });

  it("stays silent while the page is hidden", () => {
    const s = setup();
    s.sound.wake();
    s.state.hidden = true;
    expect(s.sound.play("reward")).toBeNull();
  });

  it("a follow-up cue is skipped when this input already sounded, and plays after new input", () => {
    const s = setup();
    s.sound.wake();
    s.sound.noteInput();
    s.sound.play("expand");
    expect(s.sound.play("close", { follow: true })).toBeNull();
    s.sound.noteInput(); // e.g. Esc pressed right after opening
    expect(s.sound.play("close", { follow: true })).not.toBeNull();
    expect(s.player.log).toEqual(["expand", "close"]);
  });

  it("never creates a context while sound is off", () => {
    const s = setup({
      storage: memStorage({ [PREF_KEY]: '{"enabled":false,"volume":0.7}' }),
    });
    s.sound.wake();
    expect(s.create).not.toHaveBeenCalled();
    expect(s.sound.play("open")).toBeNull();
  });
});

describe("async outcomes", () => {
  it("plays success only after the task resolves", async () => {
    const s = setup();
    s.sound.wake();
    let resolve;
    const p = s.sound.track(() => new Promise((r) => (resolve = r)), {
      success: "copy",
      failure: "error",
    });
    await Promise.resolve();
    expect(s.player.log).toEqual([]);
    resolve("ok");
    await expect(p).resolves.toBe("ok");
    expect(s.player.log).toEqual(["copy"]);
  });

  it("plays error only after the task fails, and rethrows", async () => {
    const s = setup();
    s.sound.wake();
    let reject;
    const p = s.sound.track(() => new Promise((_, r) => (reject = r)), {
      success: "copy",
      failure: "error",
    });
    await Promise.resolve();
    expect(s.player.log).toEqual([]);
    reject(new Error("denied"));
    await expect(p).rejects.toThrow("denied");
    expect(s.player.log).toEqual(["error"]);
  });

  it("plays no error when the task was cancelled", async () => {
    const s = setup();
    s.sound.wake();
    const ac = new AbortController();
    ac.abort();
    const abort = Object.assign(new Error("aborted"), { name: "AbortError" });
    await expect(
      s.sound.track(() => Promise.reject(abort), {
        failure: "error",
        signal: ac.signal,
      }),
    ).rejects.toBe(abort);
    expect(s.player.log).toEqual([]);
  });
});

describe("loops", () => {
  it("loop start is idempotent", () => {
    const s = setup();
    s.sound.wake();
    const a = s.sound.startLoop("processing");
    const b = s.sound.startLoop("processing");
    expect(a).toBe(b);
    expect(s.player.play).toHaveBeenCalledTimes(1);
    expect(s.player.play).toHaveBeenCalledWith("processing", { loop: true });
  });

  it("stops the loop before the success outcome", async () => {
    const s = setup();
    s.sound.wake();
    await s.sound.track(
      async () => {
        expect(s.sound.activeLoops()).toEqual(["processing"]);
      },
      { loop: "processing", success: "complete" },
    );
    expect(s.player.handles[0].stopped).toBe(true);
    expect(s.player.log).toEqual(["processing", "complete"]);
    expect(s.sound.activeLoops()).toEqual([]);
  });

  it("stops the loop before the failure outcome", async () => {
    const s = setup();
    s.sound.wake();
    await expect(
      s.sound.track(() => Promise.reject(new Error("x")), {
        loop: "loading",
        failure: "error",
      }),
    ).rejects.toThrow();
    expect(s.player.handles[0].stopped).toBe(true);
    expect(s.player.log).toEqual(["loading", "error"]);
    expect(s.sound.activeLoops()).toEqual([]);
  });

  it("stops the loop on cancellation without an error cue", async () => {
    const s = setup();
    s.sound.wake();
    const ac = new AbortController();
    const p = s.sound.track(
      () =>
        new Promise((_, rej) =>
          ac.signal.addEventListener("abort", () =>
            rej(Object.assign(new Error("a"), { name: "AbortError" })),
          ),
        ),
      { loop: "loading", failure: "error", signal: ac.signal },
    );
    ac.abort();
    await expect(p).rejects.toThrow();
    expect(s.player.handles[0].stopped).toBe(true);
    expect(s.player.log).toEqual(["loading"]);
  });

  it("muting stops and forgets every loop, then stops everything else", () => {
    const s = setup();
    s.sound.wake();
    s.sound.startLoop("scanning");
    s.sound.setEnabled(false);
    expect(s.player.handles[0].stopped).toBe(true);
    expect(s.sound.activeLoops()).toEqual([]);
    expect(s.player.stopAll).toHaveBeenCalled();
    expect(s.player.setEnabled).toHaveBeenLastCalledWith(false);
    // stop came before disable, so mute is immediate
    expect(s.player.stopAll.mock.invocationCallOrder[0]).toBeLessThan(
      s.player.setEnabled.mock.invocationCallOrder[0],
    );
  });

  it("dispose stops loops, destroys the player, then closes the context it created", async () => {
    const s = setup();
    s.sound.wake();
    s.sound.startLoop("loading");
    await s.sound.dispose();
    expect(s.player.handles[0].stopped).toBe(true);
    expect(s.player.destroy).toHaveBeenCalledTimes(1);
    expect(s.ctx.close).toHaveBeenCalledTimes(1);
    expect(s.player.destroy.mock.invocationCallOrder[0]).toBeLessThan(
      s.ctx.close.mock.invocationCallOrder[0],
    );
    expect(s.sound.play("open")).toBeNull();
  });
});

describe("preference persistence", () => {
  it("defaults to on at 0.7 and tolerates bad storage", () => {
    expect(readPref(undefined)).toEqual({ enabled: true, volume: 0.7 });
    expect(readPref(memStorage({ [PREF_KEY]: "{not json" }))).toEqual({
      enabled: true,
      volume: 0.7,
    });
    const throwing = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };
    expect(readPref(throwing)).toEqual({ enabled: true, volume: 0.7 });
    expect(() =>
      createSiteSound({ storage: throwing }).setEnabled(false),
    ).not.toThrow();
  });

  it("persists mute and volume across a reload", () => {
    const storage = memStorage();
    const first = setup({ storage });
    first.sound.setEnabled(false);
    first.sound.setVolume(0.4);
    expect(JSON.parse(storage.getItem(PREF_KEY))).toEqual({
      enabled: false,
      volume: 0.4,
    });
    const second = setup({ storage });
    expect(second.sound.isEnabled()).toBe(false);
    expect(second.sound.getVolume()).toBe(0.4);
  });

  it("re-enabling reapplies the pack and wakes audio from the toggle gesture", () => {
    const s = setup();
    s.sound.wake();
    s.sound.setEnabled(false);
    s.sound.setEnabled(true);
    expect(s.player.setEnabled).toHaveBeenLastCalledWith(true);
    expect(s.player.setPack).toHaveBeenCalledWith("mechanical");
    expect(s.sound.play("toggle-on")).not.toBeNull();
  });
});

describe("gesture detection", () => {
  const ev = (type, extra = {}) => ({ type, isTrusted: true, ...extra });
  it("accepts clicks, keys and mouse presses; rejects synthetic events, Escape and touch pointerdown", () => {
    expect(isActivation(ev("click"))).toBe(true);
    expect(isActivation(ev("keydown", { key: "Enter" }))).toBe(true);
    expect(isActivation(ev("pointerdown", { pointerType: "mouse" }))).toBe(
      true,
    );
    expect(isActivation(ev("touchend"))).toBe(true);
    expect(isActivation(ev("keydown", { key: "Escape" }))).toBe(false);
    expect(isActivation(ev("pointerdown", { pointerType: "touch" }))).toBe(
      false,
    );
    expect(isActivation({ type: "click", isTrusted: false })).toBe(false);
  });
});

describe("SSR safety", () => {
  it("importing and booting outside a browser touches nothing", () => {
    expect(typeof window).toBe("undefined");
    expect(boot()).toBeNull();
    expect(() => createSiteSound()).not.toThrow();
  });
});

describe("DOM wiring (jsdom)", () => {
  /** @type {import('jsdom').JSDOM} */
  let dom;
  beforeEach(async () => {
    const { JSDOM } = await import("jsdom");
    dom = new JSDOM(
      `<button id="a" data-sound-toggle aria-pressed="true" hidden>Sound<b data-sound-state>On</b></button>
       <button id="b" data-sound-toggle aria-pressed="true" hidden>Sound<b data-sound-state>On</b></button>`,
    );
  });

  /** jsdom cannot forge isTrusted, so events marked here stand in for real user gestures */
  const real = new WeakSet();
  const trusted = (event) => {
    real.add(event);
    return event;
  };
  const accept = (e) =>
    real.has(e) &&
    isActivation({
      type: e.type,
      key: e.key,
      pointerType: e.pointerType,
      isTrusted: true,
    });

  it("reveals the toggles and reflects the saved state", () => {
    const s = setup({
      storage: memStorage({ [PREF_KEY]: '{"enabled":false,"volume":0.7}' }),
    });
    mountSiteSound(dom.window.document, s.sound, { accept });
    const a = dom.window.document.getElementById("a");
    expect(a.hidden).toBe(false);
    expect(a.getAttribute("aria-pressed")).toBe("false");
    expect(a.querySelector("[data-sound-state]").textContent).toBe("Off");
  });

  it("a keyboard or pointer click on the toggle plays exactly one cue and syncs every toggle", () => {
    const s = setup({
      storage: memStorage({ [PREF_KEY]: '{"enabled":false,"volume":0.7}' }),
    });
    const doc = dom.window.document;
    mountSiteSound(doc, s.sound, { accept });
    const a = doc.getElementById("a");
    // a keyboard activation dispatches keydown, then click: still one cue
    a.dispatchEvent(
      trusted(
        new dom.window.KeyboardEvent("keydown", {
          key: "Enter",
          bubbles: true,
        }),
      ),
    );
    a.dispatchEvent(
      trusted(new dom.window.MouseEvent("click", { bubbles: true })),
    );
    expect(s.player.log).toEqual(["toggle-on"]);
    expect(doc.getElementById("b").getAttribute("aria-pressed")).toBe("true");
    // turning off is silent and immediate
    a.dispatchEvent(
      trusted(new dom.window.MouseEvent("click", { bubbles: true })),
    );
    expect(s.player.log).toEqual(["toggle-on"]);
    expect(s.player.stopAll).toHaveBeenCalled();
    expect(
      doc.getElementById("b").querySelector("[data-sound-state]").textContent,
    ).toBe("Off");
  });

  it("pointerdown, pointerup and click of one press create a single player", () => {
    const s = setup();
    const doc = dom.window.document;
    mountSiteSound(doc, s.sound, { accept });
    for (const type of ["pointerdown", "pointerup", "click"]) {
      const e = new dom.window.MouseEvent(type, { bubbles: true });
      Object.defineProperty(e, "pointerType", { value: "mouse" });
      doc.body.dispatchEvent(trusted(e));
    }
    expect(s.create).toHaveBeenCalledTimes(1);
    expect(s.ctx.resume).toHaveBeenCalledTimes(1);
  });

  it("untrusted events never unlock audio", () => {
    const s = setup();
    mountSiteSound(dom.window.document, s.sound);
    dom.window.document.body.dispatchEvent(
      new dom.window.MouseEvent("click", { bubbles: true }),
    );
    expect(s.create).not.toHaveBeenCalled();
  });

  it("hiding the page stops running loops", () => {
    const s = setup();
    const doc = dom.window.document;
    mountSiteSound(doc, s.sound, { accept });
    s.sound.wake();
    s.sound.startLoop("loading");
    Object.defineProperty(doc, "hidden", { value: true, configurable: true });
    doc.dispatchEvent(new dom.window.Event("visibilitychange"));
    expect(s.player.handles[0].stopped).toBe(true);
    expect(s.sound.activeLoops()).toEqual([]);
  });

  it("unmount removes listeners and stops loops; remounting does not duplicate playback", () => {
    const s = setup({
      storage: memStorage({ [PREF_KEY]: '{"enabled":false,"volume":0.7}' }),
    });
    const doc = dom.window.document;
    const unmount = mountSiteSound(doc, s.sound, { accept });
    unmount();
    const a = doc.getElementById("a");
    a.dispatchEvent(
      trusted(new dom.window.MouseEvent("click", { bubbles: true })),
    );
    expect(s.sound.isEnabled()).toBe(false); // the old listener is gone
    mountSiteSound(doc, s.sound, { accept });
    a.dispatchEvent(
      trusted(new dom.window.MouseEvent("click", { bubbles: true })),
    );
    expect(s.player.log).toEqual(["toggle-on"]);
    expect(s.create).toHaveBeenCalledTimes(1);
  });

  it("boot runs once per page and exposes a single service", async () => {
    const { JSDOM } = await import("jsdom");
    const page = new JSDOM("<button data-sound-toggle hidden>Sound</button>");
    vi.stubGlobal("window", page.window);
    vi.stubGlobal("document", page.window.document);
    try {
      const first = boot();
      expect(first).not.toBeNull();
      expect(boot()).toBe(first);
      expect(page.window.siteSound).toBe(first);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
