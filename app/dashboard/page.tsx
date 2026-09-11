import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { CreateLinkDialog } from "@/components/create-link-dialog";
import { LinkActions } from "@/components/link-actions";
import { getLinksForUser } from "@/data/links";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const userLinks = await getLinksForUser(userId);

  return (
    <main className="min-h-screen bg-zinc-50 p-6 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto w-full max-w-4xl space-y-8 py-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">LinkShorter</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Your links</h1>
          </div>
          <CreateLinkDialog />
        </div>

        {userLinks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-950">
            <p className="font-medium">No links yet</p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Your shortened links will appear here once you create one.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-zinc-200 overflow-hidden rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
            {userLinks.map((link) => (
              <li key={link.id} className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <a
                      href={`/l/${link.shortCode}`}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                      /{link.shortCode}
                    </a>
                    <p className="mt-1 truncate text-sm text-zinc-600 dark:text-zinc-400">
                      {link.originalUrl}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <time
                      dateTime={link.createdAt.toISOString()}
                      className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400"
                    >
                      {link.createdAt.toLocaleDateString()}
                    </time>
                    <LinkActions link={link} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
