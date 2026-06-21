import CreateClient from "./CreateClient";

// Auth temporarily disabled on the frontend. The NextAuth route and helpers are
// still in place — re-add the getServerSession guard here to require sign-in again.
export default function Page() {
  return <CreateClient />;
}
