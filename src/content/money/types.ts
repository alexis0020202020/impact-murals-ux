/**
 * Shapes shared by the content of the nine money pages.
 *
 * Each page keeps its own content module (the pages are different
 * compositions, not one template), but the small repeating pieces (a
 * question, a guide, a step, a ruled row) have one shape so the shared
 * components can draw them.
 */

export interface Faq {
  q: string;
  a: string;
}

/** A supporting guide: `title` is the anchor text, `why` the one line that says what the reader gets. */
export interface GuideRef {
  href: string;
  title: string;
  why: string;
}

/** One step of a ledger. `gate` marks a decision point after the step. */
export interface Step {
  title: string;
  body: string;
  gate?: string;
}

/** One ruled row: a name in display type and its text, optionally leading to another page. */
export interface Row {
  name: string;
  text: string;
  /** Where the row leads: a money page, a capability page or a gated route. */
  href?: string;
  linkLabel?: string;
  /** A third short line (an output, a "worth knowing"). */
  note?: string;
}

/** A plain link in a sentence or a list. */
export interface LinkRef {
  label: string;
  href: string;
}

/**
 * How the page starts a conversation. The labels are the specification's.
 * The prefilled WhatsApp text and the email subject and body carry the service
 * (and the useful first questions) into the message.
 */
export interface PageCta {
  primary: string;
  /** Label of the quiet second route when it is WhatsApp. */
  secondaryWhatsApp?: string;
  /** Label of the quiet second route when it is email. */
  secondaryEmail?: string;
  /** Pin the second route to one channel. Unset: email while the form is not connected, WhatsApp once it is. */
  secondaryChannel?: "email" | "whatsapp";
  whatsapp: string;
  emailSubject: string;
  emailBody: string;
  /** Prefix of the `data-track` names the integration point exposes. */
  track: string;
}

/** The closing block: heading, two short paragraphs and the sentence under them. */
export interface Closing {
  headline: string;
  lead: string;
  body: string;
}

/** A fee-factor group: a short heading and the variables it names. */
export interface FactorGroup {
  title: string;
  items: string[];
}
