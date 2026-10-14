/**
 * Every picture and clip on the money pages, as slots.
 *
 * A slot is a place a page reserves for one asset, with the proportion it is
 * laid out for. It resolves in this order (see src/lib/money-media.ts):
 *
 *   1. its own file: `src/assets/money/<stem>.<jpg|jpeg|png|webp|avif>`, with
 *      an optional clip at `public/videos/money/<stem>.mp4`;
 *   2. an existing Automotive asset (`alias`), used only where that work
 *      genuinely evidences what the section says;
 *   3. a designed placeholder that states the asset to source.
 *
 * `<stem>` is the slot in lower case with hyphens: LP_FIRST_MARKS is
 * lp-first-marks. To replace a placeholder, add the file and nothing else:
 * the layout is already built for its proportion.
 *
 * A launch build (MONEY_LIVE) refuses any slot that still resolves to a
 * placeholder, so a page can never ship with a hole where a picture should be.
 * `npm run money:media` lists every slot and its state.
 *
 * Nothing here claims more than the asset shows: `caption` is the honest
 * context, `alt` describes what is visible. Where a slot reuses automotive
 * work, the caption says so.
 */
import type { AutomotiveSlot } from "@/content/automotive";
import type { MoneyKey } from "./pages";

export interface MediaSlot {
  page: MoneyKey;
  /** What the picture shows. Alt text for a real picture. */
  alt: string;
  /** The asset to source. Shown inside a placeholder and in the media report. */
  brief: string;
  /** Layout proportion, width:height. A real picture takes the proportion of its own file. */
  ratio: string;
  /** "essential" assets are the proof the specification asks for; "optional" ones only add to it. */
  priority: "essential" | "optional";
  /** An existing Automotive slot reused here, only where it truly shows what the section claims. */
  alias?: AutomotiveSlot;
  /** The honest context printed under the picture. */
  caption?: string;
  /** Hero pictures load eagerly; everything else is lazy. */
  eager?: boolean;
  /** An aliased asset that also has a clip elsewhere on the page: show only its still here. */
  stillOnly?: boolean;
  /**
   * An existing Automotive clip laid over this slot's OWN still: a different
   * frame of real footage as the poster, the same footage as the loop.
   */
  clipAlias?: AutomotiveSlot;
  /**
   * What the page does while the slot has no real picture, instead of a
   * placeholder (and instead of a launch build refusing it):
   *   "drawing": the page draws its own labelled illustration in the slot's
   *              place (the Workshops page's tile mosaic), replaced the moment
   *              a real file is added;
   *   "omit":    the picture is an addition, so the page simply has none until
   *              a real one exists.
   * Only used where the specification itself names the stand-in.
   */
  fallback?: "drawing" | "omit";
}

export const mediaSlots = {
  // ---- Live Painting ------------------------------------------------------
  LP_REEL_BMW: {
    page: "live-painting",
    alt: "An artist at work on a BMW M5 Touring outside Dubai's Coca-Cola Arena: a Binance logo in yellow on the black bonnet, blue graphic work around it",
    brief: "Live performance loop, vertical",
    ratio: "9:16",
    priority: "essential",
    alias: "BMW_BINANCE_MAIN",
    caption: "BMW M5 TOURING / DUBAI, 2025",
    eager: true
  },
  LP_REEL_JETOUR: {
    page: "live-painting",
    alt: "An artist spray-painting graphic lettering onto a Jetour SUV at a launch event, a guest smiling through the window",
    brief: "Live performance loop, vertical",
    ratio: "9:16",
    priority: "essential",
    alias: "JETOUR_LAUNCH",
    caption: "JETOUR / LAUNCH EVENT",
    eager: true
  },
  LP_REEL_ICAUR: {
    page: "live-painting",
    alt: "Arabic calligraphy being hand-painted onto the bonnet and door of an iCAUR SUV at a launch event",
    brief: "Live performance loop, vertical",
    ratio: "0.4625",
    priority: "essential",
    alias: "ICAUR_LAUNCH",
    caption: "iCAUR / LAUNCH",
    eager: true
  },
  LP_FIRST_MARKS: {
    page: "live-painting",
    alt: "The first strokes of Arabic calligraphy in yellow paint on the white bonnet of an iCAUR SUV",
    brief: "The first marks on a blank surface, with the audience near",
    ratio: "0.4625",
    priority: "essential",
    caption: "FIRST MARKS / iCAUR LAUNCH"
  },
  LP_THE_BUILD: {
    page: "live-painting",
    alt: "A guest films a Jetour SUV on her phone while the graphic lettering on its side is still being painted at a launch event",
    brief: "The work in progress, with a guest watching",
    ratio: "0.5625",
    priority: "essential",
    caption: "THE BUILD / JETOUR LAUNCH"
  },
  LP_THE_REVEAL: {
    page: "live-painting",
    alt: "The finished BMW M5 Touring with a hand-painted blue and yellow graffiti livery, outdoors with a city skyline behind it and guests standing around it",
    brief: "The finished piece in the room, with guests",
    ratio: "1.66",
    priority: "essential",
    alias: "BMW_BINANCE_DETAIL",
    caption: "THE REVEAL / BMW M5 TOURING, DUBAI"
  },
  LP_PROOF_BMW: {
    page: "live-painting",
    alt: "The bonnet of a BMW M5 Touring painted live with a yellow Binance logo and blue graphic work, a guest in the background",
    brief: "Finished vehicle, close view",
    ratio: "0.5625",
    priority: "essential",
    alias: "BMW_BINANCE_MAIN",
    stillOnly: true
  },
  LP_PROOF_JETOUR: {
    page: "live-painting",
    alt: "Hand-painted graphic lettering on the side of a Jetour SUV, spray cans resting on a protective sheet on the floor beneath it",
    brief: "Finished vehicle, close view",
    ratio: "0.5625",
    priority: "essential"
  },
  LP_PROOF_ICAUR: {
    page: "live-painting",
    alt: "The front of a white iCAUR SUV in a showroom, Arabic calligraphy hand-painted across its bonnet",
    brief: "Finished vehicle, close view",
    ratio: "0.4625",
    priority: "essential"
  },
  LP_PREP: {
    page: "live-painting",
    alt: "An artist's sketches and references laid beside a prepared surface before a live painting",
    brief: "The artist preparing: sketches or references beside the surface",
    ratio: "4:5",
    priority: "essential"
  },
  LP_SETUP_WIDE: {
    page: "live-painting",
    alt: "A wide view of a live painting set-up at an event: the surface, the artist's zone, the audience and the people for scale",
    brief: "A wider setup view: surface, artist zone, audience, people for scale",
    ratio: "12:5",
    priority: "essential"
  },
  // ---- Corporate Artwork --------------------------------------------------
  CA_HERO: {
    page: "corporate-artwork",
    alt: "A monochrome mural of a classic Ferrari parked in a garage, airbrushed by hand onto the wall of a working automotive workshop, the artist in a respirator beside it for scale",
    brief: "A finished original in a working office, with a person or furniture in frame for scale",
    ratio: "9:16",
    priority: "essential",
    alias: "WORKSHOP_MURAL_MAIN",
    stillOnly: true,
    caption: "HAND-PAINTED MURAL / AUTOMOTIVE WORKSHOP",
    eager: true
  },
  CA_BRIEF_DETAIL: {
    page: "corporate-artwork",
    alt: "Close detail of a hand-painted monochrome mural: a woman in a white dress and two horses at stone-framed windows, airbrushed in fine tonal gradation",
    brief: "A close detail of original brushwork or airbrush work",
    ratio: "4:3",
    priority: "essential",
    caption: "DETAIL / HAND-PAINTED MURAL"
  },
  CA_PROTECT: {
    page: "corporate-artwork",
    alt: "An occupied office prepared for painting: floor covered, furniture wrapped and the wall masked",
    brief: "Protection in an occupied space: floor covered, furniture wrapped, wall prepared",
    ratio: "9:16",
    priority: "essential"
  },
  CA_IN_PROGRESS: {
    page: "corporate-artwork",
    alt: "An artist in a respirator airbrushing a monochrome classic-car mural onto a workshop wall, the wall edges masked with blue tape",
    brief: "The work in progress inside a working building",
    ratio: "9:16",
    priority: "essential",
    clipAlias: "WORKSHOP_MURAL_MAIN",
    caption: "WORK IN PROGRESS / AUTOMOTIVE WORKSHOP"
  },
  CA_CLEAN_DOWN: {
    page: "corporate-artwork",
    alt: "The same space after the work: surfaces cleaned, furniture back in place and the finished wall",
    brief: "The same space after the work: surfaces clean, furniture back, the wall finished",
    ratio: "9:16",
    priority: "essential"
  },
  // ---- Custom Canvas ------------------------------------------------------
  CC_HERO: {
    page: "custom-canvas",
    alt: "A large black-and-white hand-painted portrait of a racing driver above a white Porsche race car numbered 48, with big lettering across the top",
    brief: "A finished canvas on a wall, with a person or furniture in frame for scale",
    ratio: "0.595",
    priority: "essential",
    alias: "PORSCHE_PORTRAIT",
    stillOnly: true,
    eager: true
  },
  CC_DETAIL: {
    page: "custom-canvas",
    alt: "Close detail of a small painting on canvas: the chrome headlamp, bumper and deep red bodywork of a vintage car, the weave of the canvas showing at the edge of the painted area",
    brief: "A macro detail of real paint on canvas, photographed, not a print close-up",
    ratio: "1.204",
    priority: "essential",
    caption: "DETAIL / BRUSHWORK"
  },
  CC_MAKING: {
    page: "custom-canvas",
    alt: "A vintage car painted on a small canvas, from the first pencil lines to the finished artwork held up to the camera",
    brief: "The artist's hand at work on a canvas",
    ratio: "0.5625",
    priority: "essential",
    alias: "CANVAS_PROCESS",
    caption: "STUDIO WORK / PENCIL LINES TO FINISHED PAINTING"
  },
  CC_STEP_SKETCH: {
    page: "custom-canvas",
    alt: "Pencil lines of a vintage car's front end drawn on a canvas panel, its edges masked with blue tape, the artist's hand holding the pencil",
    brief: "The sketch on the canvas",
    ratio: "0.8",
    priority: "essential",
    caption: "SKETCH"
  },
  CC_STEP_UNDERPAINT: {
    page: "custom-canvas",
    alt: "The darkest tones going in over the pencil drawing of the vintage car, the canvas panel turned and re-taped",
    brief: "The underpainting",
    ratio: "0.8",
    priority: "essential",
    caption: "UNDERPAINTING"
  },
  CC_STEP_DEVELOP: {
    page: "custom-canvas",
    alt: "The red bodywork and chrome of the vintage car developed on the canvas panel, the tape still on its edges",
    brief: "The painting in development",
    ratio: "0.8",
    priority: "essential",
    caption: "DEVELOPMENT"
  },
  CC_STEP_DETAIL: {
    page: "custom-canvas",
    alt: "A fine brush adding sky and highlights around the headlamp of the painted vintage car, the artist's hand in frame",
    brief: "Detail work",
    ratio: "0.8",
    priority: "essential",
    caption: "DETAIL"
  },
  CC_STEP_FINISHED: {
    page: "custom-canvas",
    alt: "The finished small painting of a vintage car against a blue sky, the tape removed, the artist's hands holding the canvas",
    brief: "The finished work",
    ratio: "0.8",
    priority: "essential",
    caption: "FINISHED"
  },
  CC_EDGE: {
    page: "custom-canvas",
    alt: "The edge and corner of a finished canvas: the stretcher depth, the finish of the painted edge and the framing detail",
    brief: "The edge or finish of a real canvas: corner, stretcher depth, framing detail",
    ratio: "4:3",
    priority: "essential"
  },
  // ---- Hotel Artwork ------------------------------------------------------
  HT_PLATE: {
    page: "hotel-artwork",
    alt: "Cherry blossom branches in pink and grey, hand-painted across a pale wall: a detail of a mural",
    brief: "One real original-art plate, or a studio sample panel labelled as one",
    ratio: "2.13",
    priority: "essential",
    caption: "HAND-PAINTED MURAL DETAIL / STUDIO WORK",
    eager: true
  },
  HT_SAMPLES: {
    page: "hotel-artwork",
    alt: "Three macro details of finished sample panels, each with the finish used noted beneath",
    brief: "Three macro details of finished sample panels, each with its real finish noted",
    ratio: "3:1",
    priority: "essential"
  },
  // ---- Live Customisation -------------------------------------------------
  LC_MATERIALS: {
    page: "live-customisation",
    alt: "Material test pieces, each with the technique and finish noted beneath it",
    brief: "Real material tests: three objects, each with its technique and finish noted",
    ratio: "4:1",
    priority: "essential"
  },
  LC_STATION: {
    page: "live-customisation",
    alt: "A real live customisation station at an event: the artist's table, the stock and the collection area",
    brief: "A real station or collection view from a live customisation event",
    ratio: "4:3",
    priority: "essential"
  },
  // ---- Art Installations --------------------------------------------------
  INS_ACCESS: {
    page: "art-installations",
    alt: "A tall hand-painted chrome figure on the wall of a building, scaffolding standing against the wall beside it",
    brief: "A real installation or making view with scale and surroundings",
    ratio: "0.75",
    priority: "essential",
    alias: "EXTERIOR_MURAL_MAIN",
    stillOnly: true,
    caption: "SCAFFOLD ACCESS ON A BUILDING-SCALE MURAL."
  },
  // ---- Art for Interior Designers & Architects ----------------------------
  DS_PLATE: {
    page: "designers",
    alt: "A black-and-white hand-painted mural of a woman in a long white dress between a white horse and a black horse at two stone windows",
    brief: "One finished original-art plate, shown beside a plan",
    ratio: "1.778",
    priority: "essential",
    alias: "AUTOMOTIVE_HERO",
    stillOnly: true,
    caption: "HAND-PAINTED MURAL / STUDIO WORK",
    eager: true
  },
  // ---- Public Art ---------------------------------------------------------
  PA_WALL: {
    page: "public-art",
    alt: "A building-scale exterior mural in black and white, a winged figure on a pedestal, with scaffolding at its side",
    brief: "The exterior wall at full height",
    ratio: "0.75",
    priority: "essential",
    alias: "EXTERIOR_MURAL_MAIN",
    stillOnly: true,
    caption: "PRIVATE COMMISSION / EXTERIOR MURAL",
    eager: true
  },
  PA_BEFORE: {
    page: "public-art",
    alt: "The same exterior wall before the mural: a plain white pillar with the number 77, a service wall of air-conditioning units and parked cars beside it",
    brief: "The wall before the work",
    ratio: "0.75",
    priority: "essential",
    alias: "EXTERIOR_MURAL_BEFORE",
    stillOnly: true,
    caption: "BEFORE"
  },
  PA_SCAFFOLD: {
    page: "public-art",
    alt: "The foot of a large exterior mural: a mobile scaffold tower against the wall, the painted base of the figure and the building entrance beside it",
    brief: "Documentary access imagery: scaffold, lift or platform at the wall",
    ratio: "1.667",
    priority: "essential",
    caption: "SCAFFOLD ACCESS AT THE FOOT OF THE WALL."
  },
  PA_PREP: {
    page: "public-art",
    alt: "A wall surface prepared for painting: cleaned, repaired and primed",
    brief: "The prepared surface: cleaned, repaired and primed, before any paint",
    ratio: "0.75",
    priority: "essential"
  },
  PA_PAINTED: {
    page: "public-art",
    alt: "A detail of the finished exterior mural: the wings and upper body of the winged figure in black, white and grey",
    brief: "The painted wall: a detail of the finished work",
    ratio: "0.75",
    priority: "essential",
    caption: "PAINTED"
  },
  PA_RANGE_PHOTOREAL: {
    page: "public-art",
    alt: "A black-and-white photoreal mural of a woman in a long white dress between a white horse and a black horse at two stone windows",
    brief: "A mural of one character",
    ratio: "1.366",
    priority: "essential",
    alias: "FERRARI_REALISM",
    stillOnly: true,
    caption: "PHOTOREAL MURAL / STUDIO WORK"
  },
  PA_RANGE_GRAPHIC: {
    page: "public-art",
    alt: "A mural of pink cherry blossom branches against a pale wall above a line drawing of a classic sports car",
    brief: "A mural of a second character",
    ratio: "0.581",
    priority: "essential",
    alias: "WHAT_WE_DO_MAIN",
    stillOnly: true,
    caption: "ILLUSTRATED INTERIOR MURAL / STUDIO WORK"
  },
  PA_RANGE_SCRIPT: {
    page: "public-art",
    alt: "Arabic calligraphy hand-painted across the bonnet and door of a white SUV at a launch event",
    brief: "A third register: calligraphy or graphic work",
    ratio: "0.4625",
    priority: "essential",
    alias: "ICAUR_LAUNCH",
    stillOnly: true,
    caption: "ARABIC CALLIGRAPHY, PAINTED LIVE ON A VEHICLE / iCAUR LAUNCH"
  },

  // ---- Corporate Art Workshops (provisional: nothing real exists yet) ------
  // The alt text of a slot with no picture yet describes the brief. When the
  // real file is added, rewrite it to say what that picture actually shows.
  WS_HERO_PIECE: {
    page: "corporate-workshops",
    alt: "A finished shared artwork assembled from many individually painted square sections, made by a company group in an artist-led workshop",
    brief: "The finished shared artwork, assembled from many hands, or a clearly labelled pilot piece",
    ratio: "3:2",
    priority: "essential",
    fallback: "drawing",
    caption: "SHARED WORK / CORPORATE WORKSHOP"
  },
  WS_HERO_GROUP: {
    page: "corporate-workshops",
    alt: "A team of colleagues painting sections of a shared artwork, guided by an artist, at a corporate venue",
    brief: "A group at work, small, lapping the corner of the finished piece",
    ratio: "4:3",
    priority: "optional",
    fallback: "omit",
    caption: "THE GROUP AT WORK"
  },
  WS_FACILITATION: {
    page: "corporate-workshops",
    alt: "An artist introducing a technique to a group of colleagues seated at long tables, each with a canvas section in front of them",
    brief: "The artist working with participants: facilitation, not a performance. Real session footage or a labelled pilot",
    ratio: "11:5",
    priority: "essential",
    caption: "THE ARTIST WITH THE GROUP"
  },
  WS_SETUP: {
    page: "corporate-workshops",
    alt: "A workshop room set up before the session: protected tables, laid-out materials and a drying rack",
    brief: "Real setup: tables, protection, materials and the drying area before the group arrives",
    ratio: "4:3",
    priority: "optional",
    fallback: "omit",
    caption: "SETUP BEFORE THE GROUP ARRIVES"
  },
  WS_OUT_TILES: {
    page: "corporate-workshops",
    alt: "The finished painted tiles from a group session laid out on a table, each section different",
    brief: "End result 1: the finished tiles, laid out",
    ratio: "4:3",
    priority: "essential",
    fallback: "drawing"
  },
  WS_OUT_ASSEMBLED: {
    page: "corporate-workshops",
    alt: "The painted tiles assembled into one finished image",
    brief: "End result 2: the sections assembled into one work",
    ratio: "4:3",
    priority: "essential",
    fallback: "drawing"
  },
  WS_OUT_WALL: {
    page: "corporate-workshops",
    alt: "The finished shared artwork installed on the wall of an office",
    brief: "End result 3: the work on a wall in the client's space",
    ratio: "4:3",
    priority: "essential",
    fallback: "drawing"
  }
} as const satisfies Record<string, MediaSlot>;

export type MoneySlotId = keyof typeof mediaSlots;

/** File stem for a slot: `LP_FIRST_MARKS` becomes `lp-first-marks`. */
export function slotStem(id: string): string {
  return id.toLowerCase().replaceAll("_", "-");
}

/** "9:16" or "0.4625" as the number CSS needs (width divided by height). */
export function ratioValue(ratio: string): number {
  if (ratio.includes(":")) {
    const [w, h] = ratio.split(":").map(Number);
    return Number((w / h).toFixed(4));
  }
  return Number(ratio);
}
