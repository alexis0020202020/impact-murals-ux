/**
 * Studio-wide facts and contact details.
 * Values written as REPLACE_* are unconfirmed and must be filled in before launch.
 */
export const global = {
  name: "Impact Murals",
  domain: "https://impactmurals.ae",
  locale: "en_AE",
  areaServed: "United Arab Emirates",

  contact: {
    email: "alexis@impactmurals.ae",
    /** E.164, used for tel: and wa.me links. */
    phone: "+971581957567",
    /** Display form. */
    phoneDisplay: "+971 58 195 7567",
    /** wa.me expects digits only, no plus sign and no spaces. */
    whatsapp: "https://wa.me/971581957567",
    /** Digits only. The enquiry module builds its own wa.me link from this. */
    whatsappNumber: "971581957567",
    /** Shown near the form so early enquiries feel welcome. */
    invitation: "Have a location, a brief, or simply an early idea?"
  },

  /**
   * Privacy notice URL. The enquiry module refuses to send in live mode while
   * this is empty, which is deliberate: personal data must not be collected
   * without a published notice. Set this to the real page before going live.
   */
  privacyUrl: "",

  enquiry: {
    /**
     * "preview" completes the flow and sends nothing. Switch to "netlify" only
     * after the form is detected on the deployed site and a privacy notice
     * exists. The module independently blocks live sending if either is
     * missing, so this flag alone cannot create a false confirmation.
     */
    mode: "preview" as "preview" | "netlify"
  },

  /** Empty until real, permitted social accounts are confirmed. */
  socialLinks: [] as Array<{ label: string; href: string }>,

  form: {
    /**
     * "ui-only" means the form is an interface prototype. It does not submit
     * anywhere and must not pretend to. Connect a real delivery service and
     * change this value before launch.
     */
    mode: "ui-only" as "ui-only" | "netlify" | "custom",
    id: "project-form",
    noticeHeading: "This form is not connected yet",
    notice:
      "The enquiry form is an interface prototype. It does not send anything at the moment. Please email or message the studio directly instead."
  }
} as const;
