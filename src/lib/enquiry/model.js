// SPDX-License-Identifier: GPL-2.0-or-later
export const OFFERS = Object.freeze([
  {
    id: 'brands', title: 'For a brand or event', pillar: 'Art for Brands', whatsappTopic: 'a brand project',
    description: 'Art for campaigns, launches, products, live experiences and collaborations.',
    formats: ['Live painting / event', 'Launch / campaign', 'Artwork for products or packaging', 'Branded environment / mural', 'Artist collaboration / limited edition', 'Art conceived for photo or film', 'Something else']
  },
  {
    id: 'places', title: 'For a place', pillar: 'Art for Places', whatsappTopic: 'art for a place',
    description: 'Art for interiors, hospitality, retail, workplaces and developments.',
    formats: ['Commissioned artwork / canvas', 'Mural for an interior', 'Art across several spaces', 'Art selection / curation', 'Site-specific installation', 'Something else']
  },
  {
    id: 'public-art', title: 'For a public site or large-scale project', pillar: 'Public Art & Large-Scale Murals', whatsappTopic: 'a public art project',
    description: 'Public art, facades, large-scale murals and programmes across multiple sites.',
    formats: ['Public artwork / installation', 'Facade / architectural surface', 'Large-scale mural', 'Ground / pavement artwork', 'Multi-site programme', 'Produce an existing approved artwork', 'Something else']
  },
  {
    id: 'unsure', title: 'Something else / not sure yet', pillar: 'Other',
    description: 'Tell us the idea, even if it crosses these areas or is still taking shape.',
    formats: []
  }
]);

export const FORM_NAME = 'impact-project-enquiry';
export const FIELD_LIMITS = Object.freeze({ name: 100, email: 254, phone: 40, company: 150, brief: 3000, location: 160, timing: 160, budget: 120, website: 200 });
export const NETLIFY_FIELDS = Object.freeze(['request_id', 'offer', 'offer_label', 'interests', 'brief', 'location', 'timing', 'budget', 'name', 'email', 'phone', 'company', 'source_path', 'website']);

export function normalizeOffer(value) {
  const aliases = { 'art-for-brands': 'brands', 'art-for-places': 'places', 'public-art': 'public-art', brands: 'brands', places: 'places', unsure: 'unsure' };
  return Object.hasOwn(aliases, value) ? aliases[value] : '';
}

export function offerById(value) { return OFFERS.find(offer => offer.id === normalizeOffer(value)); }

export function createState(offer = '') {
  return { offer: normalizeOffer(offer), interests: [], brief: '', location: '', timing: '', budget: '', name: '', email: '', phone: '', company: '', website: '' };
}

export function selectOffer(state, value) {
  const offer = offerById(value);
  if (!offer) throw new Error('Unknown offer');
  // Keep the general brief and contact details; only drop choices that do not belong to the new route.
  return { ...state, offer: offer.id, interests: state.interests.filter(item => offer.formats.includes(item)) };
}

export function validateContact(state) {
  const errors = {};
  if (!state.name.trim()) errors.name = 'Please add your name.';
  const email = state.email.trim();
  const phone = state.phone.trim();
  if (!email && !phone) errors.contact = 'Add an email address or a phone number, whichever you prefer.';
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Please check your email address.';
  const digits = phone.replace(/\D/g, '');
  if (phone && (!/^\+?[\d\s().-]+$/.test(phone) || digits.length < 7 || digits.length > 15)) errors.phone = 'Please check your phone number. Include a country code if possible.';
  for (const [field, limit] of Object.entries(FIELD_LIMITS)) {
    if (typeof state[field] === 'string' && state[field].length > limit) errors[field] = `Please keep this under ${limit} characters.`;
  }
  return errors;
}

export function safeSourcePath(value = '/') {
  // Do not collect search strings, referrers, UTM data or contact information from URLs.
  try { return new URL(value, 'https://example.invalid').pathname.slice(0, 500); }
  catch { return '/'; }
}

export function toPayload(state, requestId, sourcePath = '/') {
  const offer = offerById(state.offer);
  if (!offer) throw new Error('Please choose a project type.');
  if (Object.keys(validateContact(state)).length) throw new Error('Please check your contact details.');
  const payload = {
    request_id: requestId,
    offer: offer.id,
    offer_label: offer.pillar,
    interests: state.interests.filter(item => offer.formats.includes(item)).join(' | '),
    source_path: safeSourcePath(sourcePath)
  };
  for (const [field, limit] of Object.entries(FIELD_LIMITS)) payload[field] = String(state[field] ?? '').trim().slice(0, limit);
  return payload;
}
