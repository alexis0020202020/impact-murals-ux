/**
 * Starts every not-yet-playing background video under `root` once it is near
 * the viewport, unless the visitor prefers reduced motion — in which case
 * each stays on its `poster` (or first frame) instead of looping.
 *
 * No `autoplay` attribute is ever written in markup for these videos: setting
 * it would start playback before this check can run, so a reduced-motion
 * visitor would see the video start and then stop rather than never play.
 *
 * Deferred via IntersectionObserver rather than played immediately: several
 * of these master videos are reused lower on a page (homepage teasers, the
 * commercial block on a long article), and calling `.play()` fetches real
 * data regardless of the `preload` hint, so playing everything on load would
 * download every below-the-fold video before it is ever seen. One already in
 * view on load still starts right away — the observer fires immediately for
 * an already-intersecting element. `preload="metadata"` in markup lets the
 * browser fetch just the small header (dimensions/duration, not the video
 * body) up front without this observer's involvement; the real body fetch
 * still only starts once this observer decides a panel is worth it.
 *
 * `rootMargin` is deliberately generous (an approximate viewport-height's
 * worth) rather than the visible viewport itself: a below-the-fold section
 * scrolled towards at ordinary reading speed needs real lead time for its
 * multi-megabyte master clip to fetch and decode a first frame before the
 * section is actually on screen, or the visitor sees the poster hang past
 * the point they expected the loop to already be running. It stays well
 * short of "the whole page", so a video several screens down still waits
 * for genuine scroll intent before it opens a connection.
 *
 * A FractureReveal panel shows exactly one `<video data-fracture-video>` on
 * top of its (now video-less) poster shards — see FractureReveal.astro. It
 * only fades in once BOTH the shard entrance has settled (signalled by
 * fracture.ts's `fracturesettled` event on the panel) and the video has an
 * actual rendered frame ready, never on `loadedmetadata` alone, which can
 * still describe a black frame. `armFractureHandoff` owns that wait; a
 * stalled connection or a playback error simply never reveals it, leaving
 * the assembled poster shards in place indefinitely rather than risking a
 * black flash or a hard image-to-video cut.
 *
 * Each component embedding a video (OfferMedia, FractureReveal,
 * EditorialCommercialIntro) calls this itself with `document`, so the same
 * page can invoke it several times; the WeakSet stops a video already being
 * watched from being handed to a second, redundant observer.
 */
const observedVideos = new WeakSet<HTMLVideoElement>();
let observer: IntersectionObserver | undefined;

/**
 * Resolves once `video` has an actual rendered frame, not merely enough
 * buffered data to start. `requestVideoFrameCallback` (Chrome, Firefox,
 * Safari 15.4+) reports the first frame genuinely presented for compositing.
 * Where it is unavailable, `loadeddata` is the strongest fallback event (it
 * guarantees the frame at the current position has decoded, unlike
 * `loadedmetadata`, which only guarantees dimensions/duration are known); the
 * extra double `requestAnimationFrame` gives that decoded frame one real
 * paint before the caller treats it as ready.
 */
function whenFrameReady(video: HTMLVideoElement, onReady: () => void) {
  const withFrameCallback = video as HTMLVideoElement & {
    requestVideoFrameCallback?: (callback: () => void) => number;
  };
  if (typeof withFrameCallback.requestVideoFrameCallback === "function") {
    withFrameCallback.requestVideoFrameCallback(() => onReady());
    return;
  }

  const settle = () => requestAnimationFrame(() => requestAnimationFrame(onReady));
  if (video.readyState >= 2) {
    settle();
    return;
  }
  video.addEventListener("loadeddata", settle, { once: true });
}

/**
 * Reveals a fracture panel's single video only once its shards have visibly
 * reassembled AND it has a real frame ready, whichever finishes last. Never
 * reveals on a video `error` or a stalled load: the assembled poster is the
 * safe fallback, not a black or half-loaded video.
 */
function armFractureHandoff(video: HTMLVideoElement) {
  const panel = video.closest<HTMLElement>("[data-fracture-panel]");
  if (!panel) return;

  let settled = panel.dataset.fractureSettled === "true";
  let ready = false;

  const reveal = () => {
    if (settled && ready) video.classList.add("is-ready");
  };

  if (!settled) {
    panel.addEventListener("fracturesettled", () => { settled = true; reveal(); }, { once: true });
  }

  whenFrameReady(video, () => { ready = true; reveal(); });
}

function startVideo(video: HTMLVideoElement) {
  if (video.hasAttribute("data-fracture-video")) armFractureHandoff(video);

  const play = () => video.play().catch(() => {});
  if (video.readyState >= 3) {
    play();
    return;
  }
  video.addEventListener("canplay", play, { once: true });
  video.load();
}

function getObserver(): IntersectionObserver {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const video = entry.target as HTMLVideoElement;
          obs.unobserve(video);
          startVideo(video);
        }
      },
      { rootMargin: "1200px" }
    );
  }
  return observer;
}

export function initAutoplayVideo(root: ParentNode) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  root.querySelectorAll<HTMLVideoElement>("video[data-autoplay-video]").forEach((video) => {
    if (observedVideos.has(video)) return;
    observedVideos.add(video);
    getObserver().observe(video);
  });
}
