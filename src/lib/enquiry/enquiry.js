// SPDX-License-Identifier: GPL-2.0-or-later
import { OFFERS, FORM_NAME, FIELD_LIMITS, createState, normalizeOffer, offerById, selectOffer, validateContact, toPayload } from './model.js';
import { isNetlifyRegistrationProcessed, submitToNetlify } from './netlify-transport.js';

const mounts = new WeakMap();
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const safeLink = value => typeof value === 'string' && !/[\s\\]/.test(value) && ((value.startsWith('/') && !value.startsWith('//')) || /^https:\/\//i.test(value)) ? value : '';

export function mountEnquiry(root, supplied = {}) {
  if (!root) throw new Error('The enquiry mount element is missing.');
  if (mounts.has(root)) return mounts.get(root);
  const doc = root.ownerDocument;
  const win = doc.defaultView;
  const config = { mode: 'preview', offer: '', contactEmail: '', whatsappNumber: '', privacyUrl: '', endpoint: '/', registrationFormId: 'imq-netlify-registration', ...supplied };
  if (!['preview', 'netlify'].includes(config.mode)) throw new Error('Unknown enquiry mode.');
  const initialOffer = normalizeOffer(config.offer) || normalizeOffer(new URL(win.location.href).searchParams.get('offer'));
  let state = createState(initialOffer);
  let step = initialOffer ? 2 : 1;
  let errors = {};
  let busy = false;
  let destroyed = false;
  let status = '';
  let serverError = '';
  let detailsOpen = false;
  let lastSignature = '';
  let requestId = '';
  const prefix = `imq-${win.crypto.randomUUID()}`;
  root.classList.add('imq');

  function id(key) { return `${prefix}-${key}`; }
  function focusHeading() { root.querySelector('[data-focus-heading]')?.focus(); }
  function contactLinks() {
    const links = [];
    const email = String(config.contactEmail).trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      links.push(`<a href="mailto:${escape(encodeURIComponent(email))}?subject=${encodeURIComponent('Impact Murals project enquiry')}">Email us directly</a>`);
    }
    const number = String(config.whatsappNumber).trim().replace(/[+\s()-]/g, '');
    if (/^\d{7,15}$/.test(number)) {
      // Explicit user action only. No automatic redirect, and no personal form data in the URL.
      const message = `Hi, I’d like to discuss ${offerById(state.offer)?.whatsappTopic || 'an art project'} with Impact Murals.`;
      links.push(`<a href="https://wa.me/${number}?text=${encodeURIComponent(message)}" target="_blank" rel="noopener noreferrer">Open WhatsApp</a>`);
    }
    return links.length ? `<div class="imq-direct"><span>Prefer a conversation?</span> ${links.join('<span aria-hidden="true">·</span>')}</div>` : '';
  }
  function field(key, label, { type = 'text', placeholder = '', autocomplete = '', hint = '', required = false } = {}) {
    const err = errors[key] || ((key === 'email' || key === 'phone') && errors.contact);
    const described = [hint ? id(`${key}-hint`) : '', err ? id(`${key}-error`) : ''].filter(Boolean).join(' ');
    return `<div class="imq-field">
      <label for="${id(key)}">${escape(label)}${required ? ' <span class="imq-required">(required)</span>' : ''}</label>
      <input id="${id(key)}" name="${key}" type="${type}" value="${escape(state[key])}" maxlength="${FIELD_LIMITS[key]}" ${required ? 'required' : ''} ${autocomplete ? `autocomplete="${autocomplete}"` : ''} placeholder="${escape(placeholder)}" ${err ? 'aria-invalid="true"' : ''} ${described ? `aria-describedby="${described}"` : ''}>
      ${hint ? `<small id="${id(`${key}-hint`)}">${escape(hint)}</small>` : ''}
      ${err ? `<span class="imq-error" id="${id(`${key}-error`)}">${escape(err)}</span>` : ''}
    </div>`;
  }
  function navigation(back, next, submit = false) {
    return `<div class="imq-actions">${back ? '<button type="button" class="imq-back" data-action="back">Back</button>' : '<span></span>'}<button class="imq-primary" ${submit ? 'type="submit"' : 'type="button" data-action="next"'}>${escape(next)}<span aria-hidden="true">↗</span></button></div>`;
  }
  function stepOne() {
    return `<p class="imq-eyebrow">A STARTING POINT</p><h2 id="${id('heading')}" data-focus-heading tabindex="-1">What are you planning?</h2>
      <p class="imq-intro">Choose the context that fits best. The art itself can take many forms.</p>
      <div class="imq-offers">${OFFERS.map((offer, index) => `<button type="button" class="imq-offer ${offer.id === state.offer ? 'is-selected' : ''}" data-offer="${offer.id}" aria-pressed="${offer.id === state.offer}"><span class="imq-number" aria-hidden="true">0${index + 1}</span><span><strong>${escape(offer.title)}</strong><span class="imq-offer-description">${escape(offer.description)}</span></span><span class="imq-arrow" aria-hidden="true">↗</span></button>`).join('')}</div>`;
  }
  function stepTwo() {
    const offer = offerById(state.offer);
    return `<p class="imq-eyebrow">${escape(offer.pillar)} <button type="button" class="imq-inline" data-action="change-offer">Change</button></p>
      <h2 id="${id('heading')}" data-focus-heading tabindex="-1">Tell us a little about the project.</h2>
      <p class="imq-intro">What are you planning, and where do you see art fitting into it? A few words are enough.</p>
      ${offer.formats.length ? `<fieldset class="imq-format-fieldset"><legend>Anything in particular? <span>(optional, choose any)</span></legend><div class="imq-chips">${offer.formats.map((format, index) => `<label class="imq-chip"><input type="checkbox" name="interests" value="${escape(format)}" ${state.interests.includes(format) ? 'checked' : ''}><span>${escape(format)}</span></label>`).join('')}</div></fieldset>` : ''}
      <div class="imq-field"><label for="${id('brief')}">Your project</label><textarea id="${id('brief')}" name="brief" rows="3" maxlength="${FIELD_LIMITS.brief}" placeholder="Tell us what you know so far: the idea, setting, audience or timing.">${escape(state.brief)}</textarea><small>You can share photos, plans and references when we connect.</small></div>
      <details class="imq-details" ${detailsOpen ? 'open' : ''}><summary>Add location, timing or budget</summary><div class="imq-detail-fields">
        ${field('location', 'Where is the project?', { placeholder: 'A city, venue or area, if known' })}
        ${field('timing', 'When are you planning it?', { placeholder: 'A date, a rough period or flexible' })}
        ${field('budget', 'Do you have a budget range in mind?', { placeholder: 'An amount, a range or not decided yet', hint: 'A range can help us suggest an appropriate approach. Any currency is fine.' })}
      </div></details>
      ${navigation(true, 'Continue to contact')}<p class="imq-skip">You can also leave the details for our first conversation.</p>`;
  }
  function stepThree() {
    const privacyUrl = safeLink(config.privacyUrl);
    return `<p class="imq-eyebrow">Last step</p><h2 id="${id('heading')}" data-focus-heading tabindex="-1">Where can we reach you?</h2>
      <p class="imq-intro">Your name and one way to contact you are enough.</p>
      <div class="imq-summary"><div><strong>${escape(offerById(state.offer).pillar)}</strong><p>${escape(state.brief ? (state.brief.length > 160 ? `${state.brief.slice(0, 160)}…` : state.brief) : 'We’ll review your enquiry and reply about the next step.')}</p></div><button type="button" class="imq-inline" data-action="edit-brief">Edit</button></div>
      ${Object.keys(errors).length ? '<p class="imq-error-banner" role="alert">Please check the highlighted details.</p>' : ''}
      ${field('name', 'Your name', { autocomplete: 'name', required: true })}
      <fieldset class="imq-contact-fieldset"><legend>Email or phone <span>Provide at least one. Both are welcome.</span></legend><div class="imq-contact-grid">
        ${field('email', 'Email', { type: 'email', autocomplete: 'email', placeholder: 'you@example.com' })}
        ${field('phone', 'Phone', { type: 'tel', autocomplete: 'tel', placeholder: '+971 …' })}
      </div></fieldset>
      ${field('company', 'Company / organisation', { autocomplete: 'organization' })}
      <p class="imq-privacy">We’ll use your details only to respond to this enquiry.${privacyUrl ? ` <a href="${escape(privacyUrl)}" target="_blank" rel="noopener noreferrer">Privacy notice</a>.` : ''}</p>
      ${serverError ? `<div class="imq-error-banner" role="alert">${escape(serverError)}</div>` : ''}
      ${navigation(true, config.mode === 'preview' ? 'Test this enquiry' : 'Send enquiry', true)}
      ${config.mode === 'preview' ? '<p class="imq-skip">Preview only. This test will not send or save your details.</p>' : ''}`;
  }
  function completed() {
    const preview = status === 'preview';
    return `<p class="imq-eyebrow">${preview ? 'Preview complete' : 'Thank you'}</p><h2 id="${id('heading')}" data-focus-heading tabindex="-1">${preview ? 'The flow works. Nothing was sent.' : 'Your enquiry has been sent.'}</h2><p class="imq-intro">${preview ? 'This is a demonstration. No request was sent or saved. Live delivery must be configured before launch.' : 'We’ll review it and get back to you.'}</p><div class="imq-summary"><strong>${escape(offerById(state.offer).pillar)}</strong></div><div class="imq-actions"><button type="button" class="imq-back" data-action="${preview ? 'edit-brief' : 'restart'}">${preview ? 'Back to my enquiry' : 'Start another enquiry'}</button>${preview ? '<button type="button" class="imq-inline" data-action="restart">Clear and start again</button>' : ''}</div>`;
  }
  function render({ focus = true } = {}) {
    if (destroyed) return;
    const progress = ['Project', 'Your idea', 'Contact'];
    root.innerHTML = `<section aria-labelledby="${id('heading')}">
      ${config.mode === 'preview' ? '<div class="imq-preview-badge">Preview · no delivery connected</div>' : ''}
      <ol class="imq-progress" aria-label="Enquiry steps">${progress.map((label, index) => `<li ${!status && step === index + 1 ? 'aria-current="step"' : ''} class="${status || step > index + 1 ? 'is-complete' : ''}"><span>${index + 1}</span>${label}</li>`).join('')}</ol>
      <form class="imq-form" name="${FORM_NAME}" novalidate>
        <input type="hidden" name="form-name" value="${FORM_NAME}">
        <div class="imq-trap" aria-hidden="true"><label for="${id('website')}">Leave this field empty</label><input id="${id('website')}" name="website" tabindex="-1" autocomplete="off" value="${escape(state.website)}"></div>
        ${status ? completed() : step === 1 ? stepOne() : step === 2 ? stepTwo() : stepThree()}
      </form>${contactLinks()}
    </section>`;
    root.querySelector('details')?.addEventListener('toggle', event => { detailsOpen = event.target.open; });
    if (focus) focusHeading();
  }
  function sync() {
    for (const element of root.querySelectorAll('input[name], textarea[name]')) {
      if (Object.hasOwn(FIELD_LIMITS, element.name)) state[element.name] = element.value;
    }
    if (step === 2) state.interests = [...root.querySelectorAll('input[name="interests"]:checked')].map(input => input.value);
  }
  function changeStep(target) { sync(); errors = {}; serverError = ''; status = ''; step = target; render(); }
  function setBusy(value) {
    busy = value;
    root.querySelector('form')?.setAttribute('aria-busy', String(value));
    root.querySelectorAll('button, input, textarea').forEach(element => { element.disabled = value; });
    const submit = root.querySelector('button[type="submit"]');
    if (submit) submit.textContent = value ? 'Sending…' : 'Send enquiry';
  }
  async function onSubmit(event) {
    event.preventDefault();
    if (busy || status) return;
    if (step < 3) { if (step === 2) changeStep(3); return; }
    sync();
    errors = validateContact(state);
    if (Object.keys(errors).length) {
      render({ focus: false });
      root.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    if (config.mode === 'preview') { status = 'preview'; render(); return; }
    if (!safeLink(config.privacyUrl) || !isNetlifyRegistrationProcessed(doc.getElementById(config.registrationFormId))) {
      serverError = 'Online enquiries are not connected yet. Nothing was sent. Please use a direct contact option if available.';
      render(); return;
    }
    const signature = JSON.stringify(state);
    if (signature !== lastSignature) { requestId = win.crypto.randomUUID(); lastSignature = signature; }
    const payload = toPayload(state, requestId, win.location.pathname);
    serverError = '';
    setBusy(true);
    try {
      await submitToNetlify(payload, { endpoint: config.endpoint });
      if (destroyed) return;
      status = 'accepted';
      // Remove entered personal data from memory after an accepted request. No browser storage.
      state = createState(state.offer);
      lastSignature = ''; requestId = '';
    } catch {
      if (destroyed) return;
      serverError = 'We couldn’t send your enquiry. Please try again, or contact us by email or WhatsApp.';
    } finally {
      busy = false;
      if (!destroyed) render();
    }
  }
  function onClick(event) {
    const button = event.target.closest('button');
    if (!button || !root.contains(button) || busy) return;
    if (button.dataset.offer) { sync(); state = selectOffer(state, button.dataset.offer); changeStep(2); return; }
    switch (button.dataset.action) {
      case 'next': changeStep(Math.min(3, step + 1)); break;
      case 'back': changeStep(Math.max(1, step - 1)); break;
      case 'change-offer': changeStep(1); break;
      case 'edit-brief': changeStep(2); break;
      case 'restart': state = createState(); step = 1; status = ''; errors = {}; serverError = ''; detailsOpen = false; lastSignature = ''; requestId = ''; render(); break;
    }
  }
  root.addEventListener('click', onClick);
  root.addEventListener('submit', onSubmit);
  render({ focus: false });
  const api = { destroy() { destroyed = true; state = createState(); root.removeEventListener('click', onClick); root.removeEventListener('submit', onSubmit); root.replaceChildren(); mounts.delete(root); } };
  mounts.set(root, api);
  return api;
}
