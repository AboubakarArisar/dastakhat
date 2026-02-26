import { connectMongoose } from "./mongodb";
import mongoose, { Schema, model } from "mongoose";

const DocumentSchema = new Schema({
  template: String,
  client_name: String,
  metadata: Schema.Types.Mixed,
  pdf_base64: String,
  created_at: { type: Date, default: () => new Date() },
});

const DocumentModel = (mongoose.models && mongoose.models.Document) ? mongoose.models.Document : model('Document', DocumentSchema);

export async function saveDocument({ template, clientName, metadata, pdfBase64 }: { template: string; clientName: string; metadata: any; pdfBase64: string; }) {
  await connectMongoose();
  const doc = await DocumentModel.create({ template, client_name: clientName, metadata: metadata || {}, pdf_base64: pdfBase64 });
  return doc._id.toString();
}

export async function listDocuments() {
  await connectMongoose();
  const rows = await DocumentModel.find({}, { pdf_base64: 0 }).sort({ created_at: -1 }).lean().exec();
  return rows.map((r: any) => ({ id: r._id.toString(), template: r.template, client_name: r.client_name, metadata: r.metadata, created_at: r.created_at }));
}

export async function getDocumentPdfBase64(id: string) {
  await connectMongoose();
  const row = await DocumentModel.findById(id).lean().exec();
  return row?.pdf_base64 || null;
}
