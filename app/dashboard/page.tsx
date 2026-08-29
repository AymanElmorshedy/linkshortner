import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 p-6 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <h1 className="text-4xl font-semibold tracking-tight">Dashboard</h1>
    </main>
  );
}
