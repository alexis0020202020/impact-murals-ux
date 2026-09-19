/**
 * Page-level copy for /discuss-a-project.
 *
 * The questionnaire itself (its steps, options, validation and payload) now
 * lives in the standalone module at `src/lib/enquiry/`. Only the surrounding
 * page wording is editable here.
 */
export const enquiryCopy = {
  eyebrow: "DISCUSS A PROJECT",
  heading: "TELL US ABOUT YOUR PROJECT.",
  lead: "Choose the starting point closest to your project and share what you know so far. Three short steps are enough to begin the conversation."
} as const;
