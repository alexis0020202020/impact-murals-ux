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
| What we do | `WHAT_WE_DO_MAIN` | `what-we-do-main.jpg` | Still, 744x1280 (about 0.58), as supplied | One tall picture for the whole section (a white classic Porsche painted on a pale wall under cherry blossom, with an illuminated script sign above it, photographed through a glass panel). It is not one of the four offers and is not captioned. Beside the heading and the list on screens (cut to 0.52, the plate and the sign whole), beside the introduction on tablets, beside the lead line on phones. It was a clip until the media-density pass: that clip is now `CANVAS_PROCESS`. |
| Realism and detail | `FERRARI_REALISM` | `ferrari-realism.jpg` | Still, 1038x760 (1.366) | The Ferrari mural supplied for this section (`THE DETAILS CAR PEOPLE NOTICE.jpg`: a woman between a white and a black horse at two stone windows, a Ferrari at each side), cut to the painted wall (recipe below). The wide piece that anchors the wall (`place: "lead"`); a different picture and a different cut from the opening picture, never the opening picture's file. |
| | `WORKSHOP_MURAL_MAIN` | `workshop-mural-main.mp4` + `.jpg` | Clip, 9:16, 5.4 s | The artist airbrushing a classic car on a garage wall, kept whole (`place: "tall"`). Not captioned: the section's own text speaks for the section. |
| | `PORSCHE_PORTRAIT` | `porsche-portrait.jpg` | Still, about 3:5 (720x1210) | The black-and-white "McQueen Drives Porsche" portrait artwork, from the file `PORTRAIT PORSCHE`. The smaller portrait piece (`place: "side"`). Not captioned, and never presented as the workshop commission. |
| | `CANVAS_PROCESS` | `canvas-process.mp4` + `.jpg` | Clip, 9:16, 5.4 s | The vertical process clip, moved here from the offers section (it was `what-we-do-main.mp4`): a car drawn and painted on a canvas, pencil to finished artwork. Its poster is now the painting almost finished (the frame at 3 s), not the pencil sketch it used to be. `place: "aside"`: on phones it stands beside the lead line. |
| BMW / Binance | `BMW_BINANCE_MAIN` | `bmw-binance-main.mp4` + `.jpg` | Clip, 9:16, 10.8 s | The BMW painted live: the process. |
| | `BMW_BINANCE_DETAIL` | `bmw-binance-detail.jpg` | Still, landscape (780x470) | The finished car: the result. Held to about 940 px so it stays sharp (the photograph is 780 px wide). |
| Exterior | `EXTERIOR_MURAL_MAIN` | `exterior-mural-main.jpg` | Still, 3:4 (1500x2000) | The finished wall in full, scaffolding and windows included: the dominant frame. |
| | `EXTERIOR_MURAL_BEFORE` | `exterior-mural-before.jpg` | Still, 3:4 (1500x2000) | The wall before the mural, smaller, lapping the finished wall's edge, with the label BEFORE. |
| Launch artwork | `JETOUR_LAUNCH` | `jetour-launch.mp4` + `.jpg` | Clip, 9:16, 8.1 s | One of the pair; the pair stands in one row at the same height. |
| | `ICAUR_LAUNCH` | `icaur-launch.mp4` + `.jpg` | Clip, 592x1280, 4.9 s | The other. |
| About ("ARTIST-LED. PROJECT-DRIVEN.") | `STUDIO_AT_WORK` | `studio-at-work.jpg` (poster only) + the homepage's `/videos/impact-murals-studio.mp4` | Clip, 16:9 (1280x720), 11.3 s | The very clip the homepage plays beside the same heading, reused **by address, never copied**: `sharedClips` in `src/lib/automotive-media.ts` reads `studio.media.video` from `src/content/studio.ts`, the same source the homepage section reads. Set beside the approved words, not around them: no caption and no project named. Only its poster is a file of this page (the homepage's own is 400x225). See "The shared studio clip" below. |

**Adding another realistic artwork.** The realism section ("THE DETAILS CAR PEOPLE NOTICE.") is about automotive realism as a whole, not about the four pieces it shows today, and it draws whatever is listed in `realism.art` (`src/content/automotive.ts`) in reading order. To add a piece: put its master at `src/assets/automotive/<stem>.jpg` (and a clip `<stem>.mp4` if it moves), add its slot to `automotiveSlots`, add `{ slot, place, alt }` to `realism.art`, and document the slot in the table above (tests require every slot to be documented, backed by a file and described). The stylesheet places a piece by its role (`.auto-real-item--lead`, `--tall`, `--side`, `--aside` in `src/styles/automotive.css`): on screens the pieces share one row in which each takes a share equal to its own proportion, so a fifth piece joins that row (it gets smaller, so decide whether the wall should instead become two rows), and on phones and tablets every role has its own placement, so a new piece needs one there. Do not caption a piece and do not describe it in the section's text.

**The wall's composition (media-density pass).** The section is built for proof per screen, not for length. From 1024 px the four pieces stand in one row on one baseline at one height, edge to edge (the three text columns above keep the page's margins), which is what makes the section shorter than it was with two pieces; between 600 and 1023 px the wide piece spans the width and the three tall pieces share the row under it; on phones the process clip stands beside the lead line, the wide piece and the two portrait pieces run edge to edge, and nothing is a stacked thumbnail. The reading order is the wide still, the process clip, the workshop clip, the portrait: a black-and-white still at each end and the two clips between, and it is also the tab order of the two pause buttons on every size (on a phone the process clip is the first clip on screen, then the workshop clip).

The brief had slots with no supplied material: `BMW_SUMMIT_SECONDARY` (no photograph of the summit booth, so it is the single "Also:" line), `WORKSHOP_MURAL_DETAIL` (no close-up) and `ABOUT_ALEXIS` (no portrait, so About is set in type). `EXTERIOR_MURAL_DETAIL` became `EXTERIOR_MURAL_BEFORE`. `WHAT_WE_DO_MAIN` was already the one slot the deck added.

The visual redesign (Part 17 of the handoff) retired four pictures: the Ferrari as its own section (`FERRARI_PRIVATE_MAIN`, `FERRARI_PRIVATE_DETAIL`, because the Ferrari is now the opening picture and must not repeat further down) and the two Creative Range pictures (`CREATIVE_RANGE_01` is now `PORSCHE_PORTRAIT`; the wheel close-up `CREATIVE_RANGE_02` repeated the opening picture). They can be recut from `FERRARI REALISTIC MURAL` (see the table below) if a section ever needs them.

## How the supplied files were prepared

The supplied folder (`landing page autommotive`, outside the project) is read-only and nothing in it was altered.

**Clips.** The five originals were 83 MB in total: HEVC (`hvc1`) with an AAC audio track, 7.7 to 14.7 Mbps, with the index at the end of the file. HEVC plays unreliably in Chrome, Firefox and Edge, and an index at the end makes playback wait for the whole file, so each clip was re-encoded to **H.264 High, 30 fps, 720x1280 (iCAUR 592x1280, as supplied), 1.4 to 1.8 Mbps, no audio, index first**, and trimmed to its strongest passages (the BMW logo card, the agency end card and a white flash were cut; the Jetour clip was brought down from 1080x1920 at 60 fps). The five clips are now **8.5 MB in total** (BMW 2.76 MB, Jetour 2.09 MB, what-we-do 1.56 MB, workshop 1.05 MB, iCAUR 1.03 MB). A test checks every clip in the folder is H.264, has its index first, has no audio and is under 3 MB.

**Posters.** One frame per clip, taken from the finished clip: the painting almost finished (canvas-process, the frame at 3 s; the pencil-sketch frame it had while it stood in the offers section was weak as a poster for a realism wall), the hood close-up with the roundel (BMW), the artist at the garage mural (workshop), the SUV with the guest inside (Jetour), the white SUV under the banners (iCAUR).

**Stills.** Phone photographs carry an EXIF rotation, so each was rotated to its true orientation first. Then:

| File | Source | Crop (source pixels) |
| --- | --- | --- |
| `automotive-hero.jpg` | `FERRARI REALISTIC MURAL` (2252x2443) | 2133x1200 from (11, 189), resized to 2000x1125: the 16:9 frame of the owner's Canva reference (both stone windows, the woman, the car and its wheel), without the lit signature |
| `automotive-hero-mobile.jpg` | `FERRARI REALISTIC MURAL` | 1300x1400 from (420, 285): the white horse, the woman and the black horse whole, the bonnet below, the road at the foot (a quiet zone for the type to melt into) |
| `porsche-portrait.jpg` | `PORTRAIT PORSCHE` (912x1280) | 720x1210 from (120, 0): the whole poster title in frame, without the neighbouring prints |
| `exterior-mural-main.jpg` | `20260911_035129` | full width, 3:4 from (0, 250), resized to 1500 wide |
| `exterior-mural-before.jpg` | `RR BEFORE` | full width, 3:4 from (0, 750), so the number "77" sits at the same height as in the finished view |
| `bmw-binance-detail.jpg` | `AGMC-x-BBW-3-780x470` | whole frame |
| `ferrari-realism.jpg` | `THE DETAILS CAR PEOPLE NOTICE.` (1080x1152, supplied for the realism wall) | 1038x760 from (0, 165): the painted wall from the stone above the windows to the road, without the ceiling band at the top, the stairs and the lit signature at the foot (the signature starts a few pixels lower, so the cut is made just above it). Both wheels with their badges are whole. A few pixels of the glass rail and its hazard tape remain in the bottom-left corner, as in the original: they cannot be cropped without cutting the wheel. Re-encoded once at quality 90 (the source is already a compressed JPEG). |
| `what-we-do-main.jpg` | the photograph supplied for the offers section (744x1280) | none: kept byte for byte as supplied |
| `studio-at-work.jpg` | frame 0 of `/videos/impact-murals-studio.mp4` (1280x720) | the clip's own first frame, captured at full size (the homepage poster is 400x225), so the clip fades in over the picture it starts with |
| `canvas-process.jpg` | frame at 3 s of `canvas-process.mp4` (720x1280) | none |

Recutting the retired Ferrari pictures: the main frame was the whole photograph resized to 1800 wide; the close-up was 1120x1040 from (460, 280); the wheel was 962x770 from (1290, 930).

All are re-encoded as progressive JPEG at quality 88, so the build's WebP step starts from a clean master.

### Supplied but not used

| File | Why |
| --- | --- |
| `RR MURAL AFTER` | A second view of the finished exterior wall with a person in the frame, and a different mural on the neighbouring wall; the cleaner `20260911_035129` view says the same thing without bringing a second subject in. |
| `20260814_200545` | The Ferrari wall again, from the stairs: 40 per cent of the frame is the skylight and the rest repeats the opening picture. |
| The BMW logo card, the agency end card and the white flash in the clips | Cut: not work, and a brand card at the start would read as a different client. |
| The two Canva reference files in the folder | Design references (the hero, and a BMW composition), not artwork. |

### The shared studio clip (what to know before changing it)

`/videos/impact-murals-studio.mp4` belongs to the homepage and is **not** one of this page's clips, so the rules above (H.264, index first, no audio, under 3 MB) are not applied to it. It is **HEVC (`hvc1`) with an audio track, 9.4 MB, 11.3 s, with its index at the end of the file**. On this page it behaves like every other clip (silent, deferred until its frame is near the viewport after the first scroll, played only while visible, never loaded under reduced motion, Save-Data or a 3G connection, with the pause button), and a browser that cannot decode HEVC simply keeps the poster (the clip's error path is the page's own: one retry, then the poster stays and the button is removed). It was reused as it is because the brief asked for the exact existing video and no duplicate file; a light H.264 re-encode (about 2 MB, index first, no audio, with the same ffmpeg command as above) would start faster and play in every browser, but it would be a second file and the homepage should then use it too. That is a decision for the owner.

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
