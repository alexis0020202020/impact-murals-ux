/**
 * What every money page shares: how a conversation starts, the one studio
 * line, the direct-route labels and the provisional investment note.
 *
 * Plain TypeScript, no framework imports (the tests load it directly).
 */
import { global } from "@/content/global";
import type { MoneyPage } from "./pages";
import type { PageCta } from "./types";

export const moneyConversion = {
  /**
   * Whether the guided enquiry form really delivers to the studio.
   *
   * It does not yet: `global.enquiry.mode` is "preview" and no privacy notice
   * is published, so the form is an interface prototype. While this is false
   * every primary call to action opens WhatsApp with the service already named,
   * and the quiet second route is email. Flip it only after a controlled test
   * shows real receipt, truthful confirmation, failure recovery and mobile
   * completion (docs/money-pages/IMPLEMENTATION.md, "Must fix before
   * publication").
   */
  formConnected: false
} as const;

/** The one deliberately repeated sentence: a footer-level studio line, never page copy. */
export const studioLine =
  "Impact Murals is an artist-led art direction and production studio in Dubai. The project decides the artist and the artistic language.";

export const directRoutes = {
  whatsappLabel: "WHATSAPP",
  emailLabel: "EMAIL",
  location: "Dubai, UAE"
} as const;

export function whatsappHref(message: string): string {
  return `${global.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function mailtoHref(subject: string, body: string): string {
  return `mailto:${global.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function enquiryHref(offer: string): string {
  return `/discuss-a-project?offer=${offer}`;
}

export interface ResolvedCta {
  primary: { label: string; href: string; kind: "form" | "whatsapp"; track: string };
  secondary?: { label: string; href: string; kind: "email" | "whatsapp"; track: string };
  /** The two direct routes for the closing block, each carrying this page's message. */
  whatsapp: string;
  email: string;
}

/** Turns a page's call-to-action copy into the links it should render in the current state. */
export function resolveCta(page: MoneyPage, cta: PageCta, connected: boolean = moneyConversion.formConnected): ResolvedCta {
  const whatsapp = whatsappHref(cta.whatsapp);
  const email = mailtoHref(cta.emailSubject, cta.emailBody);

  const primary = connected
    ? { label: cta.primary, href: enquiryHref(page.offer), kind: "form" as const, track: `${cta.track}_primary_form` }
    : { label: cta.primary, href: whatsapp, kind: "whatsapp" as const, track: `${cta.track}_primary_whatsapp` };

  const channel = cta.secondaryChannel ?? (connected ? "whatsapp" : "email");
  const label = channel === "email" ? cta.secondaryEmail : cta.secondaryWhatsApp;
  const secondary =
    label !== undefined
      ? channel === "email"
        ? { label, href: email, kind: "email" as const, track: `${cta.track}_secondary_email` }
        : { label, href: whatsapp, kind: "whatsapp" as const, track: `${cta.track}_secondary_whatsapp` }
      : undefined;

  return { primary, secondary, whatsapp, email };
}

/**
 * PROVISIONAL. The studio's own range from the Automotive page, reused as an
 * editorial note on the three pages where a single original work or a single
 * performance is the purchase and the range is plausible. It is the owner's
 * wording, not a quotation: whether it belongs on these pages at all is an
 * open editorial decision (docs/money-pages/IMPLEMENTATION.md, "Provisional
 * decisions"). The other pages explain fee factors and say that projects are
 * scoped individually, because no honest range exists for them.
 */
export const provisionalInvestment = {
  currency: "AED",
  amount: "8,000–25,000+",
  lead: "Typical project investment, depending on scale, artistic complexity and production requirements.",
  flexible: "If you're working within a defined budget, we can usually shape the format and scope around it.",
  deposit: "A deposit is required to secure the project and begin creative development, typically 50%."
} as const;

/** The pages that carry the provisional investment note. */
export const investmentPages = ["live-painting", "corporate-artwork", "custom-canvas"] as const;
