"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import DocumentCard from "../components/DocumentCard";

export default function DashboardClient() {
  const [docs, setDocs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/documents")
      .then((r) => r.json())
      .then((d) => setDocs(d.documents || []));
  }, []);

  return (
    <div>
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        {docs.length === 0 ? (
          <div className="text-gray-600">No documents yet. Create one to get started.</div>
        ) : (
          <div className="grid gap-4">
            {docs.map((d) => (
              <DocumentCard key={d.id} doc={d} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
