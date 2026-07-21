import { Link } from "@tanstack/react-router";
import { Trans } from "@lingui/macro";
import { ArrowLeft } from "lucide-react";

export function NotFound() {
  return (
    <section className="flex min-h-[calc(100dvh-4rem)] flex-col justify-center px-4 py-20 md:px-8">
      <span className="meta text-accent">
        <Trans>Error — Entry missing</Trans>
      </span>
      <h1 className="text-stroke mt-4 font-display text-[clamp(6rem,26vw,22rem)] font-black uppercase leading-[0.8] tracking-tight">
        404
      </h1>
      <p className="mt-6 max-w-md font-serif text-[clamp(1.2rem,2.4vw,1.8rem)] italic leading-snug text-ink-soft">
        <Trans>
          It seems you've branched out into a page that was never indexed.
        </Trans>
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-3 bg-ink px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wide text-paper transition-colors duration-300 hover:bg-accent"
        >
          <Trans>Return to the index</Trans>
        </Link>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="group inline-flex items-center gap-2 border border-ink px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-300 hover:bg-ink hover:text-paper"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
          <Trans>Previous page</Trans>
        </button>
      </div>
    </section>
  );
}
