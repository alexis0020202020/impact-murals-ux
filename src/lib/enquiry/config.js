// Safe default: PREVIEW ONLY. No outgoing request, email, WhatsApp or stored lead.
// Fill these with confirmed Impact Murals details; no Graffiti.ae contacts are inherited.
export default Object.freeze({
  mode: 'preview', // 'netlify' only after form detection + target deployment verification.
  offer: '', // Optional: 'art-for-brands', 'art-for-places', 'public-art' or 'unsure'.
  contactEmail: '',
  whatsappNumber: '', // International digits only. Example format: country code + local number.
  privacyUrl: '', // Existing site-relative privacy page, or https URL. Must exist before live launch.
  endpoint: '/',
  registrationFormId: 'imq-netlify-registration'
});
