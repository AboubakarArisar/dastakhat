import DocumentsClient from "./DocumentsClient";

// No auth right now, so this lists every document (not user-scoped). Named
// "Documents" rather than "Dashboard" to reflect that.
export default function Page() {
  return <DocumentsClient />;
}
