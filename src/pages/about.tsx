import { createFileRoute } from "@tanstack/react-router";
import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { ArrowUpRight, Download } from "lucide-react";
import { aboutData, CONTACT_EMAIL } from "../data/about";
import { Reveal } from "../components/Reveal";
import { FooterCta } from "../components/FooterCta";
import { ScrambleText } from "../components/ScrambleText";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [{ title: "Profile — LEEEIGHT." }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { i18n } = useLingui();
  const cvUrl = i18n.locale === "fr" ? "/Mon cv fr.pdf" : "/Mon cv en.pdf";

  return (
    <>
      {/* ——— Header ——— */}
      <section className="border-b border-line px-4 pb-10 pt-14 md:px-8 md:pb-16 md:pt-24">
        <p className="meta mb-4 text-accent">
          <ScrambleText text={i18n._(msg`Product definition`)} speed={0.5} />
        </p>
        <h1 className="font-display text-[clamp(3rem,11vw,10rem)] font-black uppercase leading-[0.82] tracking-tight">
          <Trans>Profile</Trans>
          <span className="text-accent">.</span>
        </h1>
        <p className="mt-6 max-w-2xl font-serif text-[clamp(1.3rem,2.6vw,2.1rem)] italic leading-snug text-ink-soft">
          <Trans>The art of sculpting the digital.</Trans>
        </p>
      </section>

      {/* ——— Portrait + bio ——— */}
      <section className="grid gap-10 border-b border-line px-4 py-14 md:grid-cols-12 md:px-8 md:py-20">
        <div className="md:col-span-5">
          <Reveal y={40}>
            <figure className="relative">
              <div className="border border-ink bg-paper p-1.5">
                <div className="overflow-hidden bg-paper-deep">
                  <img
                    src="/images/me.webp"
                    alt={i18n._(msg`Lee Makosso — Full-stack developer`)}
                    className="w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <figcaption className="meta mt-2 flex justify-between text-muted">
                <span>
                  <Trans>Lee Makosso — Full-stack developer</Trans>
                </span>
                <span>Fig. 01</span>
              </figcaption>
              <span className="stamp absolute -right-3 -top-4 text-[10px]">
                5+ <Trans>years</Trans>
              </span>
            </figure>
          </Reveal>
        </div>
        <div className="flex flex-col justify-between md:col-span-7">
          <Reveal delay={0.1}>
            <p className="max-w-2xl text-[clamp(1.05rem,1.6vw,1.3rem)] leading-relaxed">
              <Trans>
                Developer passionate about creating innovative web and mobile
                applications. Five years of experience in front-end development,
                two years in back-end. If you appreciate my work, feel free to
                contact me — it would be a pleasure to collaborate with you.
              </Trans>
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="border border-line p-5">
                <span className="meta text-muted">
                  <Trans>Education</Trans>
                </span>
                <p className="mt-3 font-display text-sm font-bold uppercase leading-snug tracking-wide">
                  MIT University
                  <span className="mx-1.5 text-accent">/</span>
                  Groupe Supdeco Dakar
                </p>
              </div>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="group flex flex-col justify-between border border-ink bg-ink p-5 text-paper transition-colors duration-300 hover:bg-transparent hover:text-ink"
              >
                <span className="meta text-paper/60 transition-colors duration-300 group-hover:text-muted">
                  <Trans>Contact me</Trans>
                </span>
                <span className="mt-3 flex items-center justify-between gap-2 font-display text-sm font-bold uppercase tracking-wide">
                  {CONTACT_EMAIL}
                  <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— Expertise spec sheet ——— */}
      <section className="border-b border-line px-4 py-14 md:px-8 md:py-20">
        <Reveal className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-[clamp(2rem,5vw,4rem)] font-black uppercase leading-[0.9] tracking-tight">
            <Trans>Expertise</Trans>
          </h2>
          <span className="meta text-muted">
            <Trans>Measured in years of practice</Trans>
          </span>
        </Reveal>
        <ul>
          {aboutData.expertise.map((item, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <li className="group relative flex items-baseline justify-between gap-4 overflow-hidden border-t border-line py-5 md:py-6">
                <span className="absolute inset-y-0 -left-4 -right-4 origin-bottom scale-y-0 bg-accent transition-transform duration-[450ms] ease-[cubic-bezier(0.83,0,0.17,1)] group-hover:scale-y-100 md:-left-8 md:-right-8" />
                <span className="relative z-10 flex items-baseline gap-4 md:gap-8">
                  <span className="meta text-muted transition-colors duration-300 group-hover:text-[#faf8f4]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="relative z-10 font-display text-[clamp(1.4rem,3.5vw,3rem)] font-black uppercase leading-none tracking-tight transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 group-hover:text-[#faf8f4]">
                    {i18n._(item.label as any)}
                  </span>
                </span>
                <span className="relative z-10 font-display text-[clamp(1.4rem,3.5vw,3rem)] font-black uppercase leading-none text-stroke-thin transition-all duration-500 group-hover:[-webkit-text-stroke-color:#faf8f4]">
                  {i18n._(item.years as any)}
                </span>
              </li>
            </Reveal>
          ))}
          <li className="border-t border-line" aria-hidden="true" />
        </ul>
      </section>

      {/* ——— Technical stack ——— */}
      <section className="border-b border-line px-4 py-14 md:px-8 md:py-20">
        <Reveal className="mb-10">
          <h2 className="font-display text-[clamp(2rem,5vw,4rem)] font-black uppercase leading-[0.9] tracking-tight">
            <Trans>Technical stack</Trans>
          </h2>
          <span className="meta mt-2 block text-muted">
            <Trans>Key proficiencies</Trans>
          </span>
        </Reveal>
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {aboutData.skills.map((group, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div>
                <span className="meta flex items-baseline gap-3 text-muted">
                  <span className="text-accent">{String(i + 1).padStart(2, "0")}</span>
                  {i18n._(group.category as any)}
                </span>
                <div className="mt-4 flex flex-wrap gap-y-2 border-t border-line pt-4 font-display text-lg font-bold uppercase leading-tight tracking-tight">
                  {group.items.map((item, ii) => (
                    <span key={item} className="inline-flex items-baseline">
                      <span>{item}</span>
                      {ii < group.items.length - 1 && (
                        <span className="mx-2 text-line-strong" aria-hidden="true">
                          ·
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— CV plate ——— */}
      <section className="px-4 py-14 md:px-8 md:py-20">
        <Reveal>
          <a
            href={cvUrl}
            download
            className="group flex flex-col gap-6 border border-ink p-6 transition-colors duration-300 hover:bg-ink hover:text-paper md:flex-row md:items-center md:justify-between md:p-10"
          >
            <div>
              <span className="meta text-muted transition-colors duration-300 group-hover:text-paper/60">
                <Trans>Document — PDF</Trans>
              </span>
              <p className="mt-3 font-display text-[clamp(1.6rem,4vw,3.5rem)] font-black uppercase leading-[0.9] tracking-tight">
                Curriculum Vitae
              </p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft transition-colors duration-300 group-hover:text-paper/70">
                <Trans>
                  Download a detailed version of my professional journey.
                </Trans>
              </p>
            </div>
            <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center border border-current transition-transform duration-300 group-hover:translate-y-1">
              <Download className="h-5 w-5" strokeWidth={1.5} />
            </span>
          </a>
        </Reveal>
      </section>

      <FooterCta />
    </>
  );
}
