"use client";

import { Show, SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import {
  ArrowRight,
  BarChart3,
  Check,
  Globe2,
  Link2,
  MousePointerClick,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Zap,
    title: "Create in seconds",
    description:
      "Turn any long URL into a clean, memorable short link without slowing down your workflow.",
  },
  {
    icon: BarChart3,
    title: "Track what works",
    description:
      "See clicks at a glance and understand which links and campaigns are driving real engagement.",
  },
  {
    icon: ShieldCheck,
    title: "Built for trust",
    description:
      "Keep every link organized in one secure workspace that is ready for your team to use.",
  },
];

const benefits = [
  "Unlimited link organization",
  "Simple, shareable short URLs",
  "Analytics that are easy to understand",
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
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="size-4 animate-pulse" />
          Loading LinkShorter...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <a href="#" className="flex items-center gap-3" aria-label="LinkShorter home">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
            <Link2 className="size-4" />
          </span>
          <span className="text-lg font-semibold tracking-tight">LinkShorter</span>
        </a>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a className="transition-colors hover:text-foreground" href="#features">
            Features
          </a>
          <a className="transition-colors hover:text-foreground" href="#how-it-works">
            How it works
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm">Get started</Button>
            </SignUpButton>
          </Show>
        </div>
      </header>

      <section className="relative mx-auto w-full max-w-7xl px-6 pb-20 pt-12 lg:px-10 lg:pb-28 lg:pt-20">
        <div className="pointer-events-none absolute -left-32 top-4 size-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-20 size-96 rounded-full bg-chart-2/10 blur-3xl" />

        <div className="relative grid items-center gap-14 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" />
              The simple way to share better links
            </div>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.07em] text-balance sm:text-6xl lg:text-7xl">
              Short links.
              <br />
              <span className="text-muted-foreground">Big possibilities.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Make every link easier to share, easier to remember, and easier to measure. LinkShorter
              gives you one clear place to manage your digital presence.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Show when="signed-out">
                <SignUpButton mode="modal">
                  <Button size="lg" className="h-12 rounded-full px-6">
                    Start shortening for free
                    <ArrowRight className="size-4" />
                  </Button>
                </SignUpButton>
              </Show>
              <a href="#how-it-works">
                <Button variant="outline" size="lg" className="h-12 rounded-full px-6">
                  See how it works
                </Button>
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
              {benefits.map((benefit) => (
                <span key={benefit} className="flex items-center gap-2">
                  <Check className="size-4 text-primary" />
                  {benefit}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg" id="how-it-works">
            <div className="absolute -inset-4 rounded-[2rem] border border-primary/10 bg-primary/5 blur-sm" />
            <div className="relative rounded-[2rem] border border-border bg-card p-4 shadow-2xl shadow-black/30">
              <div className="rounded-[1.5rem] border border-border bg-background p-5">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Link2 className="size-4" />
                    </span>
                    Your link
                  </div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-primary">
                    Live
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="rounded-xl border border-border bg-muted/40 p-4">
                    <div className="mb-2 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                      Original URL
                    </div>
                    <p className="truncate text-sm text-muted-foreground">
                      example.com/campaign/summer-launch
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <span className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-primary">
                      <ArrowRight className="size-4 rotate-90" />
                    </span>
                  </div>
                  <div className="rounded-xl border border-primary/20 bg-primary/10 p-4">
                    <div className="mb-2 text-[10px] font-medium uppercase tracking-widest text-primary/70">
                      Short link
                    </div>
                    <p className="font-medium text-foreground">linkshorter.app/summer</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-border bg-card p-3">
                    <MousePointerClick className="size-4 text-muted-foreground" />
                    <p className="mt-2 text-lg font-semibold">12.4k</p>
                    <p className="text-[10px] text-muted-foreground">Clicks</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-3">
                    <Globe2 className="size-4 text-muted-foreground" />
                    <p className="mt-2 text-lg font-semibold">24</p>
                    <p className="text-[10px] text-muted-foreground">Countries</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-3">
                    <BarChart3 className="size-4 text-muted-foreground" />
                    <p className="mt-2 text-lg font-semibold">6.8%</p>
                    <p className="text-[10px] text-muted-foreground">CTR</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-y border-border bg-card/40">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Everything in one place</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Your links, working harder for you.
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Skip the clutter and focus on sharing. LinkShorter keeps the essentials fast, focused, and easy to use.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="rounded-2xl border border-border bg-background p-6">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-8 px-6 py-20 sm:flex-row sm:items-center lg:px-10">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Ready when you are</p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Start sharing links people remember.
          </h2>
        </div>
        <Show when="signed-out">
          <SignUpButton mode="modal">
            <Button size="lg" className="h-12 rounded-full px-6">
              Create your free account
              <ArrowRight className="size-4" />
            </Button>
          </SignUpButton>
        </Show>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 text-sm text-muted-foreground lg:px-10">
          <span className="font-medium text-foreground">LinkShorter</span>
          <span>Shorten. Share. Grow.</span>
        </div>
      </footer>
    </main>
  );
}
