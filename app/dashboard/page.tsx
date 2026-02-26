import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import DashboardClient from "./DashboardClient";

export default async function Page() {
  const session = await getServerSession(authOptions as any);
  if (!session) redirect('/api/auth/signin');
  return <DashboardClient />;
}
