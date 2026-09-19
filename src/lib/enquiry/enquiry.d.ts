export interface EnquiryConfig {
  mode?: 'preview' | 'netlify';
  offer?: string;
  contactEmail?: string;
  whatsappNumber?: string;
  privacyUrl?: string;
  endpoint?: string;
  registrationFormId?: string;
}
export interface EnquiryInstance { destroy(): void; }
export function mountEnquiry(root: Element, config?: EnquiryConfig): EnquiryInstance;
