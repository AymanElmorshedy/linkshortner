"use client";

import { Show, SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: "⚡",
    title: "Create in seconds",
    description: "Turn any long URL into a clean, shareable short link without slowing down your workflow.",
  },
  {
    icon: "📈",
    title: "Track what works",
    description: "Monitor traffic, discover your top links, and understand which campaigns are driving clicks.",
  },
  {
    icon: "🔒",
    title: "Built for trust",
    description: "Keep your links secure with personal dashboards and organization-aware access for every team member.",
  },
];

const metrics = [
  { value: "3x", label: "faster sharing" },
  { value: "24/7", label: "link visibility" },
  { value: "99.9%", label: "uptime confidence" },
];

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
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="text-lg font-medium">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
            L
          </div>
          <div className="text-xl font-semibold tracking-tight">LinkShorter</div>
        </div>

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

      <section className="mx-auto w-full max-w-6xl px-6 pb-20 pt-6 lg:px-8">
        <div className="overflow-hidden rounded-[32px] border border-border bg-card shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
          <div className="grid gap-10 px-6 py-8 md:px-10 md:py-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:px-12 lg:py-14">
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Smart links, simplified
              </div>

              <div className="space-y-5">
                <h1 className="max-w-xl text-4xl font-semibold tracking-[-0.06em] text-balance md:text-5xl lg:text-6xl">
                  Turn long URLs into short links people actually remember.
                </h1>

                <p className="max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
                  LinkShorter helps teams share cleaner links, track click performance, and stay organized across every campaign, profile, and product update.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Show when="signed-out">
                  <SignUpButton mode="modal">
                    <Button size="lg" className="h-11 rounded-full px-5 text-sm font-medium">
                      Create your account
                    </Button>
                  </SignUpButton>
                </Show>

                <Show when="signed-in">
                  <div className="rounded-full border border-border bg-muted px-4 py-2 text-sm font-medium text-foreground">
                    You&apos;re signed in
                  </div>
                </Show>

                <SignInButton mode="modal">
                  <Button variant="outline" size="lg" className="h-11 rounded-full px-5 text-sm font-medium">
                    View demo
                  </Button>
                </SignInButton>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-border bg-muted/50 p-4">
                    <div className="text-2xl font-semibold tracking-tight text-foreground">{metric.value}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-full max-w-md rounded-[28px] border border-border bg-background/70 p-4 shadow-2xl shadow-black/30 backdrop-blur-sm">
                <div className="rounded-[22px] border border-border bg-muted/60 p-4">
                  <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    <span>Original</span>
                    <span className="rounded-full border border-border px-2 py-1">live</span>
                  </div>

                  <div className="mt-4 rounded-xl border border-border bg-background/90 p-3 text-sm text-muted-foreground">
                    https://www.example.com/marketing/campaign/launch/2026/announcement
                  </div>

                  <div className="mt-5 flex items-center justify-center text-3xl text-primary">→</div>

                  <div className="mt-4 rounded-xl border border-border bg-primary/8 p-3">
                    <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Short link</div>
                    <div className="mt-2 text-lg font-semibold text-foreground">linkshorter.app/launch-24</div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-border bg-background p-3">
                      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Clicks</div>
                      <div className="mt-2 text-2xl font-semibold text-foreground">12.4k</div>
                    </div>
                    <div className="rounded-xl border border-border bg-background p-3">
                      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">CTR</div>
                      <div className="mt-2 text-2xl font-semibold text-foreground">6.8%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-24 lg:px-8">
        <div className="mb-8 text-center">
          <div className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">Why teams choose LinkShorter</div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-2xl text-primary">
                {feature.icon}
              </div>
              <h2 className="mt-5 text-xl font-semibold tracking-tight text-foreground">{feature.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-card/50">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 px-6 py-12 text-center lg:flex-row lg:text-left lg:px-8">
          <div>
            <div className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">Built for growth</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">Share faster. Measure smarter. Stay in control.</h2>
          </div>

          <Show when="signed-out">
            <SignUpButton mode="modal">
              <Button size="lg" className="h-11 rounded-full px-6">
                Get started free
              </Button>
            </SignUpButton>
          </Show>
        </div>
      </section>
    </main>
  );
}
