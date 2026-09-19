// SPDX-License-Identifier: GPL-2.0-or-later
import { FORM_NAME, NETLIFY_FIELDS } from './model.js';

export function encodeSubmission(payload) {
  const body = new URLSearchParams({ 'form-name': FORM_NAME });
  for (const field of NETLIFY_FIELDS) body.set(field, String(payload[field] ?? ''));
  return body.toString();
}

export async function submitToNetlify(payload, { endpoint = '/', fetchImpl = globalThis.fetch, timeoutMs = 15000 } = {}) {
  // Restrict configuration to same-origin paths. Never send prospect data to an arbitrary configured host.
  if (typeof endpoint !== 'string' || !/^\/[A-Za-z0-9/_.-]*$/.test(endpoint) || endpoint.startsWith('//')) {
    throw new Error('The form endpoint must be a same-origin path.');
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encodeSubmission(payload),
      credentials: 'same-origin',
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`The form service returned HTTP ${response.status}.`);
    // This means the endpoint accepted the HTTP request, not that an email was delivered.
    return { status: 'accepted' };
  } finally { clearTimeout(timeout); }
}

export function isNetlifyRegistrationProcessed(form) {
  return Boolean(form && form.getAttribute('name') === FORM_NAME
    && !form.hasAttribute('data-netlify') && !form.hasAttribute('netlify')
    && form.querySelector('input[name="form-name"]')?.value === FORM_NAME);
}
