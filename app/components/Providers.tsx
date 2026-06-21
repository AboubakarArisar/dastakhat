"use client";
import React from "react";
// import { SessionProvider } from "next-auth/react";

// Auth temporarily disabled on the frontend. Nothing uses the session right now,
// so we skip SessionProvider to avoid the /api/auth/session round-trip.
// To re-enable auth: wrap children in <SessionProvider>{children}</SessionProvider>.
export default function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
