# /automotive: the media

The page is built around real photographs and clips. Every slot below is backed by a file, and a slot with no file **fails the build** (`resolveMedia` throws with the file name it expected), so the page can never ship with a hole where a picture should be. There are no placeholders and no plates.

Nothing on the page names a slot. The identifier of a slot lives in the DOM only, as `data-media-slot="BMW_BINANCE_MAIN"` (with `data-media-state="image | video"`), so any picture can be found without reading the templates.

## The rule

| Kind | Where | Name |
| --- | --- | --- |
| Photograph, or the poster of a clip | `src/assets/automotive/` | `<stem>.jpg` (or `.jpeg`, `.png`, `.webp`, `.avif`) |
| Clip (optional, muted loop) | `public/videos/automotive/` | `<stem>.mp4` |

`<stem>` is the slot identifier in lower case with hyphens: `BMW_BINANCE_MAIN` becomes `bmw-binance-main`.

- **Stills** go through Astro's image pipeline at build time: responsive WebP at up to six widths (360 to 1800, never above the master), with real intrinsic dimensions. A master of 1500 to 2000 px on its long side is all that is needed; the masters in the project are 2000 px or less and under 800 KB each (a test enforces both).
- **A clip needs its still.** The still is the clip's poster: the picture shown until the clip is near the viewport, the picture a reduced-motion or reduced-data visitor sees for good, and what gives the frame its aspect ratio so nothing shifts when the clip arrives. The poster is a real responsive `<img>` (with the alt text) under the clip, so there is no separate `poster` request.
- **Every frame takes the aspect ratio of its own file.** A portrait clip is shown portrait, never cropped into a wide band. The only picture cut by its layout is the opening one, which fills the screen (see below).

## Slots

| Section | Slot | File(s) | Kind and shape | How it is used |
| --- | --- | --- | --- | --- |
| Hero | `AUTOMOTIVE_HERO` | `automotive-hero.jpg` | Still, 16:9 (2000x1125) | The Ferrari mural, edge to edge, with the type over it, from tablets up. The only eager, high-priority picture. |
| | `AUTOMOTIVE_HERO_MOBILE` | `automotive-hero-mobile.jpg` | Still, 1300x1400 | The same wall cut for phones (the woman and both horses): the picture above the type, melting into it. Chosen by media query inside one `<picture>`, so a device downloads one of the two. |
| What we do | `WHAT_WE_DO_MAIN` | `what-we-do-main.mp4` + `.jpg` | Clip, 9:16, 5.4 s | A car drawn and painted on a canvas, sketch to finished artwork. A supporting piece, as tall as the list it stands beside; beside the lead line on phones. |
| Realism and detail | `WORKSHOP_MURAL_MAIN` | `workshop-mural-main.mp4` + `.jpg` | Clip, 9:16, 5.4 s | The artist airbrushing a classic car on a garage wall, kept whole. The larger piece of the pair (`place: "lead"` in `realism.art`). Not captioned: the section's own text speaks for the section. |
| | `PORSCHE_PORTRAIT` | `porsche-portrait.jpg` | Still, about 3:5 (720x1210) | The black-and-white "McQueen Drives Porsche" portrait artwork, from the file `PORTRAIT PORSCHE`. The smaller companion (`place: "side"`). Not captioned, and never presented as the workshop commission. |
| BMW / Binance | `BMW_BINANCE_MAIN` | `bmw-binance-main.mp4` + `.jpg` | Clip, 9:16, 10.8 s | The BMW painted live: the process. |
| | `BMW_BINANCE_DETAIL` | `bmw-binance-detail.jpg` | Still, landscape (780x470) | The finished car: the result. Held to about 940 px so it stays sharp (the photograph is 780 px wide). |
| Exterior | `EXTERIOR_MURAL_MAIN` | `exterior-mural-main.jpg` | Still, 3:4 (1500x2000) | The finished wall in full, scaffolding and windows included: the dominant frame. |
| | `EXTERIOR_MURAL_BEFORE` | `exterior-mural-before.jpg` | Still, 3:4 (1500x2000) | The wall before the mural, smaller, lapping the finished wall's edge, with the label BEFORE. |
| Launch artwork | `JETOUR_LAUNCH` | `jetour-launch.mp4` + `.jpg` | Clip, 9:16, 8.1 s | One of the pair; the pair stands in one row at the same height. |
| | `ICAUR_LAUNCH` | `icaur-launch.mp4` + `.jpg` | Clip, 592x1280, 4.9 s | The other. |

**Adding another realistic artwork.** The realism section ("THE DETAILS CAR PEOPLE NOTICE.") is about automotive realism as a whole, not about the two pieces it shows today, and it draws whatever is listed in `realism.art` (`src/content/automotive.ts`) in reading order. To add a piece: put its master at `src/assets/automotive/<stem>.jpg` (and a clip `<stem>.mp4` if it moves), add its slot to `automotiveSlots`, add `{ slot, place, alt }` to `realism.art`, and document the slot in the table above (tests require every slot to be documented, backed by a file and described). The stylesheet places a piece by its role (`.auto-real-item--lead` and `--side` in `src/styles/automotive.css`, at phone, tablet and screen sizes); a third piece needs a placement there, which is a layout decision for the pass that adds it. Do not caption a piece and do not describe it in the section's text.

The brief had slots with no supplied material: `BMW_SUMMIT_SECONDARY` (no photograph of the summit booth, so it is the single "Also:" line), `WORKSHOP_MURAL_DETAIL` (no close-up) and `ABOUT_ALEXIS` (no portrait, so About is set in type). `EXTERIOR_MURAL_DETAIL` became `EXTERIOR_MURAL_BEFORE`. `WHAT_WE_DO_MAIN` was already the one slot the deck added.

The visual redesign (Part 17 of the handoff) retired four pictures: the Ferrari as its own section (`FERRARI_PRIVATE_MAIN`, `FERRARI_PRIVATE_DETAIL`, because the Ferrari is now the opening picture and must not repeat further down) and the two Creative Range pictures (`CREATIVE_RANGE_01` is now `PORSCHE_PORTRAIT`; the wheel close-up `CREATIVE_RANGE_02` repeated the opening picture). They can be recut from `FERRARI REALISTIC MURAL` (see the table below) if a section ever needs them.

## How the supplied files were prepared

The supplied folder (`landing page autommotive`, outside the project) is read-only and nothing in it was altered.

**Clips.** The five originals were 83 MB in total: HEVC (`hvc1`) with an AAC audio track, 7.7 to 14.7 Mbps, with the index at the end of the file. HEVC plays unreliably in Chrome, Firefox and Edge, and an index at the end makes playback wait for the whole file, so each clip was re-encoded to **H.264 High, 30 fps, 720x1280 (iCAUR 592x1280, as supplied), 1.4 to 1.8 Mbps, no audio, index first**, and trimmed to its strongest passages (the BMW logo card, the agency end card and a white flash were cut; the Jetour clip was brought down from 1080x1920 at 60 fps). The five clips are now **8.5 MB in total** (BMW 2.76 MB, Jetour 2.09 MB, what-we-do 1.56 MB, workshop 1.05 MB, iCAUR 1.03 MB). A test checks every clip in the folder is H.264, has its index first, has no audio and is under 3 MB.

**Posters.** One frame per clip, taken from the finished clip: the finished canvas (what-we-do), the hood close-up with the roundel (BMW), the artist at the garage mural (workshop), the SUV with the guest inside (Jetour), the white SUV under the banners (iCAUR).

**Stills.** Phone photographs carry an EXIF rotation, so each was rotated to its true orientation first. Then:

| File | Source | Crop (source pixels) |
| --- | --- | --- |
| `automotive-hero.jpg` | `FERRARI REALISTIC MURAL` (2252x2443) | 2133x1200 from (11, 189), resized to 2000x1125: the 16:9 frame of the owner's Canva reference (both stone windows, the woman, the car and its wheel), without the lit signature |
| `automotive-hero-mobile.jpg` | `FERRARI REALISTIC MURAL` | 1300x1400 from (420, 285): the white horse, the woman and the black horse whole, the bonnet below, the road at the foot (a quiet zone for the type to melt into) |
| `porsche-portrait.jpg` | `PORTRAIT PORSCHE` (912x1280) | 720x1210 from (120, 0): the whole poster title in frame, without the neighbouring prints |
| `exterior-mural-main.jpg` | `20260911_035129` | full width, 3:4 from (0, 250), resized to 1500 wide |
| `exterior-mural-before.jpg` | `RR BEFORE` | full width, 3:4 from (0, 750), so the number "77" sits at the same height as in the finished view |
| `bmw-binance-detail.jpg` | `AGMC-x-BBW-3-780x470` | whole frame |

Recutting the retired Ferrari pictures: the main frame was the whole photograph resized to 1800 wide; the close-up was 1120x1040 from (460, 280); the wheel was 962x770 from (1290, 930).

All are re-encoded as progressive JPEG at quality 88, so the build's WebP step starts from a clean master.

### Supplied but not used

| File | Why |
| --- | --- |
| `RR MURAL AFTER` | A second view of the finished exterior wall with a person in the frame, and a different mural on the neighbouring wall; the cleaner `20260911_035129` view says the same thing without bringing a second subject in. |
| `20260814_200545` | The Ferrari wall again, from the stairs: 40 per cent of the frame is the skylight and the rest repeats the opening picture. |
| The BMW logo card, the agency end card and the white flash in the clips | Cut: not work, and a brand card at the start would read as a different client. |
| The two Canva reference files in the folder | Design references (the hero, and a BMW composition), not artwork. |

## The opening picture

`Hero.astro` writes it as one `<picture>`: a `<source media="(max-width: 767px)">` for the phone crop and an `<img>` for everything else, each with its own real width and height (so nothing shifts), `loading="eager"` and `fetchpriority="high"` on the `<img>`, both lists of WebP files built by `responsiveSet()` in `src/lib/automotive-media.ts`. On screens the picture fills the hero and is steered by `object-position` in `src/styles/automotive.css` (`.auto-hero-art img`, per breakpoint). A soft shade (`.auto-hero-veil`) sits under the type and the logo; the contrast of every line over it was measured on the rendered pixels at four widths.

## Video loading and playback

All of it is `src/lib/automotive-video.ts`; the markup is `AutoMedia.astro`. There is no `autoplay` attribute and no `src` in the markup: a clip is a `<video muted loop playsinline preload="none">` with its URL in `data-src`, over its poster.

- **Nothing is fetched at page load.** Observation begins after the window `load` event and the visitor's first scroll, wheel, touch, key press or click (or immediately on a page that opens already scrolled), then an idle moment. A visitor who stays on the opening screen downloads no clip.
- **A clip is attached** when its frame is within about four fifths of a screen of the viewport, and **plays** when 35 per cent of it is visible. It **pauses** the moment it leaves, when the tab is hidden, and when more clips than the cap are visible (two on large screens, one on phones and tablets: the most visible wins).
- **It never starts** for a visitor who prefers reduced motion, has asked for reduced data (Save-Data) or is on a 3G connection or slower (where the browser reports it): the poster stays, the pause button is never shown, and no clip bytes are requested. Turning reduced motion on mid-visit stops everything at once.
- **A clip fades in over its poster** only once it has painted a real frame. On a slow connection the poster simply stays; a clip that errors is tried once more, then never appears (and its button is removed). Clips pause on page hide and resume on a back/forward-cache restore.
- **Pause / play button** (WCAG 2.2.2): the whole frame is the target, with a small square at its corner shown on hover, on keyboard focus and whenever the clip is stopped by the visitor or refused by the browser. A clip the visitor paused stays paused. It has an accessible name (`Pause video: <what it shows>`), is hidden until the script takes over, and is the only focusable part of a clip (the video itself is `aria-hidden`).
- **Without script** the posters are the page.

## Tuning

- **Crop**: only the opening picture is cut by its layout. Its two crops are the files above; the part of the wide one that shows is `object-position` on `.auto-hero-art img` (45% 70% on screens, 38% 55% on tablets, 50% 40% on phones). Every other frame takes the aspect ratio of its own file.
- **Sizes**: a portrait frame is limited to a share of the viewport height by `--cap` (set per section in the stylesheet), so a tall clip is whole on screen on a laptop. The Launch pair is one flex row whose items take their own aspect ratios as their share (`--ra`, `--rb`, written by `Launch.astro`), which makes the two the same height at every width; the Exterior grid is told the wall's ratio (`--r-main`) so the next column begins where the picture ends.
- **Alt text** lives next to the copy in `src/content/automotive.ts`. A test requires one description per picture, each distinct and descriptive.
- **Size limits**: masters 2000 px or less on the long side and under 800 KB; clips under 3 MB. Both are tested.
- **A new clip**: export it as below, name it `<stem>.mp4`, and add a poster `<stem>.jpg` (`ffmpeg -ss 2.5 -i clip.mp4 -frames:v 1 -q:v 3 poster.jpg`).

```sh
ffmpeg -i in.mp4 -vf "scale=720:-2,fps=30" -c:v libx264 -profile:v high -crf 24 -preset slow \
  -pix_fmt yuv420p -movflags +faststart -an out.mp4
```

- **Link preview**: the opening picture, cropped to the 1200x630 JPEG messengers read, becomes the preview when the link is sent.

## Checking a change

```sh
npm run dev -- --host 127.0.0.1
```

Open `/automotive`. Then `npm run check`, `npm test`, and `CONTENT_SOURCE=fixtures npm run build` (a plain `npm run build` is refused without Airtable credentials, by design).
