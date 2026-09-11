export default function TestPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground">
      <section className="w-full max-w-2xl rounded-2xl border border-border bg-card p-8 text-center shadow-2xl shadow-black/20 sm:p-12">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          LinkShorter
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Test page
        </h1>
        <p className="mt-4 text-muted-foreground">hello word !</p>
        <a
          href="/"
          className="mt-8 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
        >
          Back to home
        </a>
      </section>
    </main>
  );
}
