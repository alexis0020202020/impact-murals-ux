/**
 * Playback for the muted clips on /automotive (`video[data-auto-video]`, drawn by
 * AutoMedia.astro). Each clip is a looping, silent, portrait video laid over its
 * own poster; this module decides when it is worth any bytes or any decoding:
 *
 *   - Nothing is fetched at page load. The clip has no `src` in the markup, only
 *     `data-src`. Observation starts after the window `load` event and the
 *     visitor's first sign of going below the opening screen (a scroll, a touch,
 *     a key press), then an idle moment, so the opening picture, fonts and
 *     scripts are never competing with a clip and a visitor who stays on the
 *     opening screen downloads none. A clip is then attached only when its frame
 *     is within about four fifths of a screen of the viewport.
 *   - A clip plays only while a good share of its frame is on screen, and is
 *     paused as soon as it leaves, when the tab is hidden, or when more clips
 *     than the cap are visible (two on large screens, one on phones and
 *     tablets: the most visible wins). Nothing far off screen keeps decoding.
 *   - No clip is ever attached for a visitor who prefers reduced motion or has
 *     asked for reduced data (Save-Data) or is on a 3G connection or slower: the
 *     poster stays, and the pause button is never shown.
 *   - Every clip has a pause / play button laid over its frame (WCAG 2.2.2). A
 *     clip the visitor paused stays paused. If the browser refuses to autoplay
 *     (a battery saver, say) the poster stays and the same button offers play.
 *   - A clip fades in over its poster only once it has painted a real frame, so
 *     a slow connection leaves the poster in place instead of a black box. A
 *     clip that errors is tried once more, then simply never appears.
 *
 * No `autoplay` attribute is written in the markup: it would start playback
 * before any of the checks above could run. Everything is progressive
 * enhancement: without this script the posters are the whole page.
 */

/** Attach a clip once its frame is this close to the viewport. */
const LOAD_AHEAD = "80% 0px";
/** Play once this share of the frame is visible. */
const PLAY_AT = 0.35;
/** A clip the visitor started by hand stays on until this little of it is visible. */
const LEAVE_AT = 0.1;

type FrameCallbackVideo = HTMLVideoElement & { requestVideoFrameCallback?: (callback: () => void) => number };
type SavingConnection = { saveData?: boolean; effectiveType?: string };

interface Entry {
  video: HTMLVideoElement;
  frame: HTMLElement;
  toggle: HTMLButtonElement | null;
  /** Visible share of the frame, 0 to 1. */
  ratio: number;
  attached: boolean;
  failed: boolean;
  /** The visitor paused it: leave it alone. */
  userPaused: boolean;
  /** The visitor started it by hand: it is exempt from the cap while it stays on screen. */
  pinned: boolean;
  /** The browser refused to autoplay it. */
  blocked: boolean;
  /** It has already been given its one second chance after an error. */
  retried: boolean;
}

function whenFrameReady(video: HTMLVideoElement, onReady: () => void) {
  const withCallback = video as FrameCallbackVideo;
  if (typeof withCallback.requestVideoFrameCallback === "function") {
    withCallback.requestVideoFrameCallback(() => onReady());
    return;
  }
  onReady();
}

function whenIdle(task: () => void) {
  // Safari has no requestIdleCallback.
  if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(() => task(), { timeout: 2000 });
  else setTimeout(task, 200);
}

export function initAutomotiveVideo(root: ParentNode = document) {
  const videos = Array.from(root.querySelectorAll<HTMLVideoElement>("video[data-auto-video]"));
  if (!videos.length || !("IntersectionObserver" in window)) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const connection = (navigator as Navigator & { connection?: SavingConnection }).connection;
  // 3G and below: a clip of one to three megabytes would still be arriving as the visitor leaves its section.
  const saving = Boolean(connection?.saveData) || /^(slow-2g|2g|3g)$/.test(connection?.effectiveType ?? "");
  if (reduced.matches || saving) return;

  const wide = window.matchMedia("(min-width: 1024px)");
  const entries = new Map<HTMLVideoElement, Entry>();
  let stopped = false;
  let queued = false;

  for (const video of videos) {
    const frame = video.closest<HTMLElement>(".auto-frame");
    if (!frame || !video.dataset.src) continue;
    entries.set(video, {
      video,
      frame,
      toggle: frame.querySelector<HTMLButtonElement>("[data-video-toggle]"),
      ratio: 0,
      attached: false,
      failed: false,
      userPaused: false,
      pinned: false,
      blocked: false,
      retried: false
    });
  }

  const setState = (entry: Entry, state: "idle" | "loading" | "playing" | "paused") => {
    entry.frame.dataset.videoState = state;
  };

  /** The button shows play only when the clip is stopped for a reason the visitor can act on. */
  const syncToggle = (entry: Entry) => {
    const toggle = entry.toggle;
    if (!toggle) return;
    const offer = entry.userPaused || entry.blocked;
    toggle.dataset.paused = String(offer);
    const label = offer ? toggle.dataset.labelPlay : toggle.dataset.labelPause;
    if (label) toggle.setAttribute("aria-label", label);
  };

  const attach = (entry: Entry) => {
    if (entry.attached || entry.failed) return;
    entry.attached = true;
    setState(entry, "loading");
    entry.video.preload = "auto";
    entry.video.src = entry.video.dataset.src ?? "";
    entry.video.load();
  };

  const start = (entry: Entry) => {
    if (!entry.video.paused) return;
    const promise = entry.video.play();
    if (promise) {
      promise.catch(() => {
        // Autoplay refused (battery saver, data saver): keep the poster; the button offers play.
        entry.blocked = true;
        syncToggle(entry);
      });
    }
  };

  const halt = (entry: Entry) => {
    if (!entry.video.paused) entry.video.pause();
  };

  const update = () => {
    queued = false;
    if (stopped) return;

    for (const entry of entries.values()) {
      if (entry.pinned && entry.ratio < LEAVE_AT) entry.pinned = false;
      if (!entry.attached && entry.ratio >= PLAY_AT) attach(entry);
    }

    const candidates = [...entries.values()]
      .filter((entry) => entry.attached && !entry.failed && !entry.userPaused && entry.ratio >= PLAY_AT && !document.hidden)
      .sort((a, b) => b.ratio - a.ratio);
    const pinned = [...entries.values()].filter((entry) => entry.pinned && !entry.failed && !entry.userPaused && !document.hidden);
    const room = Math.max(0, (wide.matches ? 2 : 1) - pinned.length);
    const allowed = new Set<Entry>([...pinned, ...candidates.filter((entry) => !entry.pinned).slice(0, room)]);

    for (const entry of entries.values()) {
      if (allowed.has(entry)) start(entry);
      else halt(entry);
    }
  };

  const schedule = () => {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(update);
  };

  for (const entry of entries.values()) {
    const { video, toggle } = entry;

    video.addEventListener("playing", () => {
      entry.blocked = false;
      setState(entry, "playing");
      syncToggle(entry);
      whenFrameReady(video, () => video.classList.add("is-live"));
    });
    video.addEventListener("pause", () => {
      if (entry.attached && !entry.failed) setState(entry, "paused");
    });
    video.addEventListener("error", () => {
      // One quiet retry for a dropped connection; after that the clip never appears and the poster stays.
      if (!entry.retried) {
        entry.retried = true;
        window.setTimeout(() => {
          video.load();
          schedule();
        }, 1500);
        return;
      }
      entry.failed = true;
      video.classList.remove("is-live");
      setState(entry, "idle");
      if (toggle) toggle.hidden = true;
    });

    toggle?.addEventListener("click", () => {
      if (video.paused) {
        entry.userPaused = false;
        entry.blocked = false;
        entry.pinned = true;
        attach(entry);
        start(entry);
      } else {
        entry.userPaused = true;
        entry.pinned = false;
        video.pause();
      }
      syncToggle(entry);
    });
  }

  const loadObserver = new IntersectionObserver(
    (records) => {
      for (const record of records) {
        if (!record.isIntersecting) continue;
        const entry = entries.get(record.target as HTMLVideoElement);
        if (entry) attach(entry);
        loadObserver.unobserve(record.target);
      }
    },
    { rootMargin: LOAD_AHEAD }
  );

  const playObserver = new IntersectionObserver(
    (records) => {
      for (const record of records) {
        const entry = entries.get(record.target as HTMLVideoElement);
        if (entry) entry.ratio = record.intersectionRatio;
      }
      schedule();
    },
    { threshold: [0, 0.1, 0.2, 0.35, 0.5, 0.75, 1] }
  );

  const begin = () => {
    if (stopped) return;
    for (const entry of entries.values()) {
      if (entry.toggle) entry.toggle.hidden = false;
      syncToggle(entry);
      loadObserver.observe(entry.video);
      playObserver.observe(entry.video);
    }
  };

  /*
    Observation starts only once the visitor shows intent to go below the opening
    screen: the first scroll, wheel, touch, key press or click, or a page that
    opened already scrolled (a reload, an anchor). A visitor who stays on the
    opening screen downloads no clip at all. The page has fully loaded by then.
  */
  const arm = () => {
    if (window.scrollY > 0) {
      whenIdle(begin);
      return;
    }
    const events = ["scroll", "wheel", "touchstart", "keydown", "pointerdown"] as const;
    const go = () => {
      events.forEach((name) => window.removeEventListener(name, go));
      whenIdle(begin);
    };
    events.forEach((name) => window.addEventListener(name, go, { passive: true }));
  };
  if (document.readyState === "complete") arm();
  else window.addEventListener("load", arm, { once: true });

  document.addEventListener("visibilitychange", schedule);
  wide.addEventListener("change", schedule);
  window.addEventListener("pagehide", () => entries.forEach(halt));
  // Coming back through the back/forward cache: pick up where the visible clips left off.
  window.addEventListener("pageshow", schedule);

  // A visitor who turns reduced motion on mid-visit gets stillness at once.
  reduced.addEventListener("change", () => {
    if (!reduced.matches) return;
    stopped = true;
    for (const entry of entries.values()) {
      halt(entry);
      if (entry.toggle) entry.toggle.hidden = true;
    }
  });
}
