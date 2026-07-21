import { createFileRoute } from "@tanstack/react-router";
import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { ArrowUpRight } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";
import { ClientOnly } from "../components/ClientOnly";
import { Reveal } from "../components/Reveal";
import { ScrambleText, HoverScramble } from "../components/ScrambleText";
import { EMAIL, socials } from "../data/about";
import { useIsDark } from "../hooks/useIsDark";

const GlobeScene = lazy(() => import("../components/three/GlobeScene"));

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [{ title: "Contact — LEEEIGHT." }],
  }),
  component: ContactPage,
});

function LocalTime() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Africa/Dakar",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{time} GMT+0</span>;
}

function ContactPage() {
  const { i18n } = useLingui();
  const isDark = useIsDark();

  return (
    <>
      {/* ——— Header ——— */}
      <section className="border-b border-line px-4 pb-10 pt-14 md:px-8 md:pb-16 md:pt-24">
        <p className="meta mb-4 text-accent">
          <ScrambleText text={i18n._(msg`Get in touch`)} speed={0.5} />
        </p>
        <h1 className="font-display font-black uppercase leading-[0.82] tracking-tight">
          <span className="block text-[clamp(2.9rem,10.5vw,9.5rem)]">
            <Trans>Let's work</Trans>
          </span>
          <span className="text-stroke block text-[clamp(2.9rem,10.5vw,9.5rem)]">
            <Trans>together</Trans>
            <span className="text-accent" style={{ WebkitTextStroke: "0" }}>
              .
            </span>
          </span>
        </h1>
      </section>

      {/* ——— Email + globe ——— */}
      <section className="grid gap-10 border-b border-line px-4 py-14 md:grid-cols-12 md:px-8 md:py-20">
        <div className="flex flex-col justify-between gap-10 md:col-span-7">
          <Reveal>
            <span className="meta text-muted">
              <Trans>Ready for the adventure?</Trans>
            </span>
            <a
              href={`mailto:${EMAIL}`}
              className="group mt-4 block break-all font-display text-[clamp(1.5rem,4.2vw,3.4rem)] font-black uppercase leading-[0.95] tracking-tight transition-colors duration-300 hover:text-accent"
            >
              <HoverScramble text={EMAIL} />
              <ArrowUpRight
                className="ml-1 inline h-[0.8em] w-[0.8em] align-baseline transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </a>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-soft">
              <Trans>
                Working asynchronously allows for better focus and more precise
                results. Send me an email to start the discussion — open to
                collaboration opportunities everywhere in the world.
              </Trans>
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="grid grid-cols-2 gap-px border border-line bg-line">
              <div className="bg-paper p-5">
                <dt className="meta text-muted">
                  <Trans>Location</Trans>
                </dt>
                <dd className="mt-2 font-display text-sm font-bold uppercase tracking-wide">
                  Dakar, Senegal
                </dd>
              </div>
              <div className="bg-paper p-5">
                <dt className="meta text-muted">
                  <Trans>Local time</Trans>
                </dt>
                <dd className="mt-2 font-display text-sm font-bold uppercase tracking-wide">
                  <LocalTime />
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>

        {/* Globe */}
        <div className="md:col-span-5">
          <Reveal y={40}>
            <figure>
              <div className="border border-ink bg-paper p-1.5">
                <div className="relative aspect-square overflow-hidden">
                  <ClientOnly
                    fallback={
                      <div className="flex h-full items-center justify-center">
                        <span className="meta text-muted">14.7167°N, 17.4677°W</span>
                      </div>
                    }
                  >
                    <Suspense fallback={null}>
                      <GlobeScene color={isDark ? "#f2f1ec" : "#141412"} />
                    </Suspense>
                  </ClientOnly>
                </div>
              </div>
              <figcaption className="meta mt-2 flex justify-between text-muted">
                <span>
                  <Trans>Base of operations — Dakar</Trans>
                </span>
                <span>Fig. 01</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ——— Socials index ——— */}
      <section className="px-4 py-14 md:px-8 md:py-20">
        <Reveal className="mb-8 flex items-baseline justify-between gap-4">
          <h2 className="font-display text-[clamp(2rem,5vw,4rem)] font-black uppercase leading-[0.9] tracking-tight">
            <Trans>Elsewhere</Trans>
          </h2>
          <span className="meta text-muted">(04)</span>
        </Reveal>
        <ul>
          {socials.map((social, i) => (
            <Reveal key={social.label} delay={i * 0.05}>
              <li>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative flex items-baseline gap-4 overflow-hidden border-t border-line py-5 md:gap-8 md:py-6"
                >
                  <span className="absolute inset-y-0 -left-4 -right-4 origin-bottom scale-y-0 bg-accent transition-transform duration-[450ms] ease-[cubic-bezier(0.83,0,0.17,1)] group-hover:scale-y-100 md:-left-8 md:-right-8" />
                  <span className="meta relative z-10 text-muted transition-colors duration-300 group-hover:text-[#faf8f4]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="relative z-10 font-display text-[clamp(1.6rem,4.5vw,3.5rem)] font-black uppercase leading-none tracking-tight transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 group-hover:text-[#faf8f4]">
                    {social.label}
                  </span>
                  <ArrowUpRight
                    className="relative z-10 ml-auto h-6 w-6 shrink-0 self-center -translate-x-2 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-[#faf8f4] group-hover:opacity-100"
                    strokeWidth={1.5}
                  />
                </a>
              </li>
            </Reveal>
          ))}
          <li className="border-t border-line" aria-hidden="true" />
        </ul>
      </section>
    </>
  );
}
