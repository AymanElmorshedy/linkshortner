"use client";

import { Show, SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && userId) {
      router.push("/dashboard");
    }
  }, [isLoaded, userId, router]);

  if (!isLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
        <div className="text-lg font-medium">Loading...</div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <div className="text-xl font-semibold tracking-tight">LinkShorter</div>

        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button variant="outline">Sign in</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button>Sign up</Button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-5xl flex-1 items-center px-6 pb-16 pt-8">
        <div className="grid w-full gap-12 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:grid-cols-[1.2fr_0.8fr] md:p-12">
          <div className="space-y-6">
            <div className="inline-flex rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
              Smart links, simplified
            </div>

            <h1 className="max-w-xl text-4xl font-semibold tracking-tight md:text-6xl">
              Turn long links into short, memorable ones.
            </h1>

            <p className="max-w-lg text-lg text-zinc-600 dark:text-zinc-300">
              Create polished short URLs, track audience engagement, and keep your links organized in one place.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Show when="signed-out">
                <SignUpButton mode="modal">
                  <button className="rounded-full bg-zinc-950 px-5 py-3 text-base font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200">
                    Create your account
                  </button>
                </SignUpButton>
              </Show>

              <Show when="signed-in">
                <div className="rounded-full border border-zinc-200 bg-zinc-100 px-5 py-3 text-base font-medium text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50">
                  You&apos;re signed in
                </div>
              </Show>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-zinc-100 p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
                  <span>Original</span>
                  <span>https://example.com/very/long/url</span>
                </div>
                <div className="h-px bg-zinc-200 dark:bg-zinc-700" />
                <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
                  <span>Short</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">linkshorter.app/abc123</span>
                </div>
                <div className="rounded-xl bg-zinc-950 p-4 text-sm text-white dark:bg-white dark:text-zinc-950">
                  <p className="font-medium">Ready to share.</p>
                  <p className="mt-1 text-zinc-300 dark:text-zinc-700">Fast, clean, and secure.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
