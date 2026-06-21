// Maps each template to the people who must sign it, and which signature
// placeholder in the template each one fills. This is what fixes the core
// logic flaw: a signature placeholder belongs to ONE specific party, so each
// person only ever signs their own block.

export type SignerRole = "owner" | "counterparty";

export type SignerSlot = {
  role: SignerRole;
  /** Human label shown in the UI, e.g. "Disclosing Party". */
  label: string;
  /** The {{placeholder}} key in the template this signer fills. */
  signatureField: string;
};

export type TemplateConfig = {
  id: string;
  name: string;
  signers: SignerSlot[];
};

export const TEMPLATE_CONFIG: Record<string, TemplateConfig> = {
  nda: {
    id: "nda",
    name: "Non-Disclosure Agreement",
    signers: [
      { role: "owner", label: "Disclosing Party", signatureField: "disclosing_party_signature" },
      { role: "counterparty", label: "Receiving Party", signatureField: "receiving_party_signature" },
    ],
  },
  contract: {
    id: "contract",
    name: "Freelance Contract",
    signers: [
      { role: "owner", label: "Freelancer", signatureField: "freelancer_signature" },
      { role: "counterparty", label: "Client", signatureField: "client_signature" },
    ],
  },
  license: {
    id: "license",
    name: "Licensing Agreement",
    signers: [
      { role: "owner", label: "Licensor", signatureField: "licensor_signature" },
      { role: "counterparty", label: "Licensee", signatureField: "licensee_signature" },
    ],
  },
};

export function getTemplateConfig(templateId: string): TemplateConfig | null {
  return TEMPLATE_CONFIG[templateId] || null;
}

export function getSignerSlot(templateId: string, role: SignerRole): SignerSlot | null {
  const cfg = getTemplateConfig(templateId);
  if (!cfg) return null;
  return cfg.signers.find((s) => s.role === role) || null;
}

/** True for any field name that holds a drawn signature. */
export function isSignatureField(fieldName: string) {
  return /signature/i.test(fieldName);
}

/** True for date-like fields (so the UI can show a date picker). */
export function isDateField(fieldName: string) {
  return /(^|[_-])date([_-]|$)|date/i.test(fieldName);
}

/** Turn a placeholder key like "client_name" into "Client Name". */
export function formatFieldLabel(fieldName: string) {
  const parts = fieldName
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return fieldName;
  return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(" ");
}

// Plain-English help for template fields so users aren't staring at cryptic
// labels like "governing_law". label overrides the auto-formatted name;
// placeholder is the example shown in the input; hint is the small caption;
// optional fields don't block sending.
export type FieldMeta = { label?: string; placeholder?: string; hint?: string; optional?: boolean };

export const FIELD_HINTS: Record<string, FieldMeta> = {
  your_name: { label: "Your name", placeholder: "e.g. Jane Doe or Acme Studio" },
  client_name: { label: "Other party's name", placeholder: "e.g. Bob Smith or Globex Inc." },
  term_length: {
    label: "Term length (months)",
    placeholder: "e.g. 12",
    hint: "How many months this agreement stays in effect.",
  },
  governing_law: {
    label: "Governing law",
    placeholder: "e.g. State of California, USA",
    hint: "Which region's laws apply if there's ever a dispute.",
  },
  services_description: { label: "Services", placeholder: "e.g. Logo and brand identity design" },
  payment_amount: { label: "Payment amount", placeholder: "e.g. 2000" },
  payment_currency: { label: "Currency", placeholder: "e.g. USD" },
  payment_terms: { label: "Payment terms", placeholder: "e.g. 50% upfront, 50% on delivery" },
  start_date: { label: "Start date" },
  end_date: { label: "End date" },
  additional_terms: { label: "Additional terms", placeholder: "Anything else you've agreed (optional)", optional: true },
  license_scope: {
    label: "License scope",
    placeholder: "e.g. non-exclusive, worldwide",
    hint: "How the other party is allowed to use the work.",
  },
  work_description: { label: "Work being licensed", placeholder: "e.g. the photos listed in Exhibit A" },
  license_fee: { label: "License fee", placeholder: "e.g. $500 one-time" },
  warranties: { label: "Warranties", placeholder: "e.g. standard", optional: true },
};

export function getFieldMeta(fieldName: string): FieldMeta {
  return FIELD_HINTS[fieldName] || {};
}

/** Extract unique {{placeholder}} keys from template text, in order. */
export function extractPlaceholders(templateText: string): string[] {
  const re = /{{\s*([a-zA-Z0-9_\-]+)\s*}}/g;
  const seen = new Set<string>();
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(templateText))) {
    if (!seen.has(m[1])) {
      seen.add(m[1]);
      out.push(m[1]);
    }
  }
  return out;
}

/** Replace {{key}} / {key} with a value across the whole text. */
export function fillPlaceholder(text: string, key: string, value: string): string {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`{{\\s*${escaped}\\s*}}|{\\s*${escaped}\\s*}`, "g");
  return text.replace(re, value);
}
