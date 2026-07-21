import { createFileRoute } from "@tanstack/react-router";
import { Trans } from "@lingui/macro";
import { WorksList } from "../components/WorksList";
import { Reveal } from "../components/Reveal";
import { FooterCta } from "../components/FooterCta";
import { ScrambleText } from "../components/ScrambleText";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/macro";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [{ title: "Works — LEEEIGHT." }],
  }),
  component: ProjectsIndexPage,
});

function ProjectsIndexPage() {
  const { i18n } = useLingui();

  return (
    <>
      <section className="border-b border-line px-4 pb-10 pt-14 md:px-8 md:pb-16 md:pt-24">
        <p className="meta mb-4 text-accent">
          <ScrambleText text={i18n._(msg`Index of cases`)} speed={0.5} />
        </p>
        <h1 className="font-display text-[clamp(3.5rem,13vw,12rem)] font-black uppercase leading-[0.82] tracking-tight">
          <Trans>Works</Trans>
          <span className="text-accent">.</span>
        </h1>
        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4">
          <p className="max-w-md text-[15px] leading-relaxed text-ink-soft">
            <Trans>
              A selection of works where aesthetics meet creative engineering.
            </Trans>
          </p>
          <span className="meta text-muted">
            (06) <Trans>entries — scroll to explore</Trans>
          </span>
        </div>
      </section>

      <section className="px-4 pb-20 pt-10 md:px-8 md:pb-28 md:pt-14">
        <Reveal>
          <WorksList />
        </Reveal>
      </section>

      <FooterCta />
    </>
  );
}
