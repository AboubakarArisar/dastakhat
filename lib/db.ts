import { connectMongoose } from "./mongodb";
import mongoose, { Schema, model } from "mongoose";
import crypto from "crypto";
import fs from "fs";
import path from "path";

export type DocumentStatus = "draft" | "awaiting_signature" | "completed";

export type SignerRecord = {
  role: "owner" | "counterparty";
  label: string;
  name: string;
  email: string;
  signatureField: string;
  signatureDataUrl: string; // "" until signed
  token: string;
  status: "pending" | "signed";
  signedAt: string | null;
};

export type DocRecord = {
  id: string;
  title: string;
  template: string;
  owner_key: string; // anonymous per-browser owner id (scopes the list until real auth)
  owner_name: string;
  owner_email: string;
  client_name: string; // counterparty name (kept for dashboard compatibility)
  content: string; // text fields merged; signature placeholders still present
  signers: SignerRecord[];
  status: DocumentStatus;
  pdf_base64: string | null;
  metadata: any;
  signed: boolean;
  created_at: string;
};

export function generateToken() {
  return crypto.randomBytes(16).toString("hex");
}

// ---------------------------------------------------------------------------
// Mongoose model
// ---------------------------------------------------------------------------
const SignerSchema = new Schema(
  {
    role: String,
    label: String,
    name: String,
    email: String,
    signatureField: String,
    signatureDataUrl: { type: String, default: "" },
    token: String,
    status: { type: String, default: "pending" },
    signedAt: { type: Date, default: null },
  },
  { _id: false }
);

const DocumentSchema = new Schema({
  title: String,
  template: String,
  owner_key: { type: String, index: true },
  owner_name: String,
  owner_email: String,
  client_name: String,
  content: String,
  signers: { type: [SignerSchema], default: [] },
  metadata: Schema.Types.Mixed,
  pdf_base64: String,
  status: { type: String, default: "draft" },
  signed: { type: Boolean, default: false },
  created_at: { type: Date, default: () => new Date() },
});

const DocumentModel: mongoose.Model<any> =
  (mongoose.models?.Document as mongoose.Model<any>) || model<any>("Document", DocumentSchema);

function fromMongo(r: any): DocRecord {
  return {
    id: r._id.toString(),
    title: r.title || r.template || "Document",
    template: r.template,
    owner_key: r.owner_key || "",
    owner_name: r.owner_name || "",
    owner_email: r.owner_email || "",
    client_name: r.client_name || "",
    content: r.content || "",
    signers: (r.signers || []).map((s: any) => ({
      role: s.role,
      label: s.label,
      name: s.name || "",
      email: s.email || "",
      signatureField: s.signatureField || "",
      signatureDataUrl: s.signatureDataUrl || "",
      token: s.token || "",
      status: s.status || "pending",
      signedAt: s.signedAt ? new Date(s.signedAt).toISOString() : null,
    })),
    status: r.status || "draft",
    pdf_base64: r.pdf_base64 || null,
    metadata: r.metadata || {},
    signed: Boolean(r.signed),
    created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// File fallback store (used when MongoDB is unreachable / not configured)
// ---------------------------------------------------------------------------
const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "documents.json");

function fileReadAll(): DocRecord[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) as DocRecord[];
  } catch {
    return [];
  }
}

function fileWriteAll(rows: DocRecord[]) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(rows, null, 2), "utf8");
}

// Pick the backend once Mongo is known unreachable, so we don't pay the 5s
// timeout on every call.
let mongoBroken = false;
async function useMongo(): Promise<boolean> {
  if (mongoBroken) return false;
  if (!process.env.MONGODB_URI && mongoose.connection.readyState !== 1) {
    // No URI configured and not already connected — go straight to file store.
    // (mongodb.ts has a hardcoded fallback URI, so we still try once below.)
  }
  try {
    await connectMongoose();
    return true;
  } catch {
    mongoBroken = true;
    console.warn("MongoDB unreachable — using local file store (.data/documents.json)");
    return false;
  }
}

// ---------------------------------------------------------------------------
// Public API (each op tries Mongo, falls back to the file store)
// ---------------------------------------------------------------------------

export async function createDocument(input: {
  title: string;
  template: string;
  ownerKey?: string;
  ownerName: string;
  ownerEmail: string;
  clientName: string;
  content: string;
  signers: SignerRecord[];
  status: DocumentStatus;
  metadata?: any;
  pdfBase64?: string | null;
  signed?: boolean;
}): Promise<DocRecord> {
  const base = {
    title: input.title,
    template: input.template,
    owner_key: input.ownerKey || "",
    owner_name: input.ownerName,
    owner_email: input.ownerEmail,
    client_name: input.clientName,
    content: input.content,
    signers: input.signers,
    status: input.status,
    metadata: input.metadata || {},
    pdf_base64: input.pdfBase64 || null,
    signed: Boolean(input.signed),
  };

  if (await useMongo()) {
    const doc = await DocumentModel.create({ ...base, created_at: new Date() });
    return fromMongo(doc.toObject());
  }

  const rows = fileReadAll();
  const record: DocRecord = {
    id: generateToken(),
    ...base,
    created_at: new Date().toISOString(),
  };
  rows.unshift(record);
  fileWriteAll(rows);
  return record;
}

// Lighten a record for list views: drop the heavy signature images and full
// content (the dashboard only needs status + signer progress + tokens).
function toListItem(r: DocRecord): DocRecord {
  return {
    ...r,
    content: "",
    pdf_base64: null,
    signers: r.signers.map((s) => ({ ...s, signatureDataUrl: s.signatureDataUrl ? "(signed)" : "" })),
  };
}

// Scoped to one owner key. Without a key we return nothing rather than leaking
// every user's documents (there's no auth yet, so the key is the only boundary).
export async function listDocuments(ownerKey?: string): Promise<DocRecord[]> {
  if (!ownerKey) return [];
  if (await useMongo()) {
    const rows = await DocumentModel.find({ owner_key: ownerKey }, { pdf_base64: 0 })
      .sort({ created_at: -1 })
      .lean()
      .exec();
    return rows.map(fromMongo).map(toListItem);
  }
  return fileReadAll()
    .filter((r) => r.owner_key === ownerKey)
    .map(toListItem);
}

export async function getDocumentById(id: string): Promise<DocRecord | null> {
  if (await useMongo()) {
    try {
      const row = await DocumentModel.findById(id).lean().exec();
      return row ? fromMongo(row) : null;
    } catch {
      return null;
    }
  }
  return fileReadAll().find((r) => r.id === id) || null;
}

export async function getDocumentByToken(token: string): Promise<{ doc: DocRecord; signer: SignerRecord } | null> {
  let doc: DocRecord | null = null;
  if (await useMongo()) {
    const row = await DocumentModel.findOne({ "signers.token": token }).lean().exec();
    doc = row ? fromMongo(row) : null;
  } else {
    doc = fileReadAll().find((r) => r.signers.some((s) => s.token === token)) || null;
  }
  if (!doc) return null;
  const signer = doc.signers.find((s) => s.token === token);
  if (!signer) return null;
  return { doc, signer };
}

export async function getDocumentPdfBase64(id: string): Promise<string | null> {
  if (await useMongo()) {
    const row = await DocumentModel.findById(id).lean().exec();
    return (row as any)?.pdf_base64 || null;
  }
  return fileReadAll().find((r) => r.id === id)?.pdf_base64 || null;
}

export async function saveSignerSignature(token: string, signatureDataUrl: string): Promise<DocRecord | null> {
  const found = await getDocumentByToken(token);
  if (!found) return null;
  const { doc } = found;

  const signers = doc.signers.map((s) =>
    s.token === token ? { ...s, signatureDataUrl, status: "signed" as const, signedAt: new Date().toISOString() } : s
  );
  const allSigned = signers.every((s) => s.status === "signed");
  const status: DocumentStatus = allSigned ? "completed" : "awaiting_signature";

  await updateDocument(doc.id, { signers, status });
  return { ...doc, signers, status };
}

export async function updateDocument(
  id: string,
  patch: Partial<Pick<DocRecord, "signers" | "status" | "pdf_base64" | "signed">>
): Promise<void> {
  if (await useMongo()) {
    await DocumentModel.findByIdAndUpdate(id, patch).exec();
    return;
  }
  const rows = fileReadAll();
  const idx = rows.findIndex((r) => r.id === id);
  if (idx >= 0) {
    rows[idx] = { ...rows[idx], ...patch } as DocRecord;
    fileWriteAll(rows);
  }
}

export async function deleteDocument(id: string): Promise<boolean> {
  if (await useMongo()) {
    const res = await DocumentModel.findByIdAndDelete(id).exec();
    return Boolean(res);
  }
  const rows = fileReadAll();
  const next = rows.filter((r) => r.id !== id);
  if (next.length === rows.length) return false;
  fileWriteAll(next);
  return true;
}
