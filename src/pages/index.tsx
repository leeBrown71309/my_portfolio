import { createFileRoute, Link } from "@tanstack/react-router";
import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { lazy, Suspense } from "react";
import { createPortal } from "react-dom";
import { ClientOnly } from "../components/ClientOnly";
import { ScrambleText } from "../components/ScrambleText";
import { Ticker } from "../components/Ticker";
import { WorksList } from "../components/WorksList";
import { Reveal } from "../components/Reveal";
import { Magnetic } from "../components/Magnetic";
import { FooterCta } from "../components/FooterCta";

const AsteriskScene = lazy(() => import("../components/three/AsteriskScene"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "LEEEIGHT. — Creative Developer Portfolio" }],
  }),
  component: HomePage,
});

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The 3D asterisk travels down the page on scroll — drifting from right
 * to left and shrinking as you read, smoothed by springs. Portaled to
 * <body> so the route's clip-path transition never traps it.
 */
function ScrollAsterisk() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const rawX = useTransform(scrollYProgress, [0, 0.32, 0.62, 1], ["50vw", "4vw", "46vw", "10vw"]);
  const rawY = useTransform(scrollYProgress, [0, 0.32, 0.62, 1], ["24vh", "38vh", "58vh", "72vh"]);
  const rawScale = useTransform(scrollYProgress, [0, 0.32, 0.62, 1], [1, 0.5, 0.66, 0.42]);
  const rawRotate = useTransform(scrollYProgress, [0, 1], [0, 40]);

  const spring = { stiffness: 55, damping: 18, mass: 0.8 };
  const x = useSpring(rawX, spring);
  const y = useSpring(rawY, spring);
  const scale = useSpring(rawScale, spring);
  const rotate = useSpring(rawRotate, spring);

  const content = (
    <ClientOnly>
      <Suspense fallback={null}>
        {/* Light: multiply ("ink on paper"); Dark: screen (glow).
            The accent rim light keeps a brighter orange edge in both modes. */}
        <AsteriskScene color="#ff4d00" />
      </Suspense>
    </ClientOnly>
  );

  if (reduce) {
    return createPortal(
      <div className="pointer-events-none fixed right-[-18vw] top-[3%] z-[30] h-[52vmin] w-[52vmin] opacity-70 mix-blend-multiply md:right-[-4vw] md:top-[12vh] md:h-[82vmin] md:w-[82vmin] md:opacity-100 dark:mix-blend-screen">
        {content}
      </div>,
      document.body,
    );
  }

  return createPortal(
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[30] h-[62vmin] w-[62vmin] opacity-70 mix-blend-multiply md:h-[82vmin] md:w-[82vmin] md:opacity-100 dark:mix-blend-screen"
      style={{ x, y, scale, rotate, transformOrigin: "center" }}
    >
      {content}
    </motion.div>,
    document.body,
  );
}

function HomePage() {
  const { i18n } = useLingui();
  const reduce = useReducedMotion();

  const rise = (delay: number) => ({
    initial: reduce ? false : { y: "112%" },
    animate: { y: "0%" },
    transition: { duration: 1, delay, ease: EASE },
  });

  return (
    <>
      {/* ——————————————— HERO ——————————————— */}
      <section className="relative flex min-h-[calc(100dvh-4rem)] flex-col border-b border-line">
        {/* Meta strip */}
        <motion.div
          className="meta grid grid-cols-2 gap-2 border-b border-line px-4 py-3 text-muted md:grid-cols-3 md:px-8"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span>
            <Trans>Located in Dakar</Trans>
          </span>
          <span className="hidden text-center md:inline">
            <Trans>Full-stack Developer</Trans>
          </span>
          <span className="text-right">
            <Trans>UI/UX Designer</Trans>
          </span>
        </motion.div>

        {/* Stamp */}
        <motion.div
          className="stamp absolute right-6 top-16 z-20 hidden text-[10px] md:block"
          initial={reduce ? false : { opacity: 0, scale: 1.4, rotate: -12 }}
          animate={{ opacity: 1, scale: 1, rotate: -4 }}
          transition={{ duration: 0.5, delay: 1.4, ease: EASE }}
        >
          <Trans>Available for projects</Trans>
        </motion.div>

        {/* 3D asterisk — travels down the page on scroll (portaled to body) */}
        <ScrollAsterisk />

        {/* Headline block */}
        <div className="relative z-10 flex flex-1 flex-col justify-center px-4 py-12 md:px-8">
          <p className="meta mb-4 text-accent md:mb-6">
            <ScrambleText text={i18n._(msg`Hey, I am`)} speed={0.5} />
          </p>
          <h1 className="font-display font-black uppercase tracking-[-0.02em]">
            <span className="block overflow-hidden pb-1">
              <motion.span
                className="font-wide block text-[clamp(3.5rem,17vw,15rem)] leading-[0.8]"
                {...rise(0.35)}
              >
                Lee
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-2">
              <motion.span
                className="text-stroke block text-[clamp(3.5rem,17vw,15rem)] leading-[0.8]"
                {...rise(0.47)}
              >
                Makosso
              </motion.span>
            </span>
          </h1>

          <div className="mt-8 flex flex-col gap-8 md:mt-12 md:flex-row md:items-end md:justify-between">
            <motion.div
              className="max-w-xl"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
            >
              <p className="font-serif text-[clamp(1.35rem,2.6vw,2rem)] italic leading-snug">
                <Trans>But you can call me</Trans>{" "}
                <span className="not-italic font-display font-bold">LEE</span>.
              </p>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
                <Trans>
                  Graphic designer, UI/UX designer &amp; full-stack developer. I
                  sculpt digital interfaces where aesthetics meet performance.
                </Trans>
              </p>
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.05, ease: EASE }}
            >
              <Magnetic strength={0.25}>
                <a
                  href="#works"
                  className="group inline-flex items-center gap-4 bg-ink px-7 py-4 font-display text-sm font-bold uppercase tracking-wide text-paper transition-colors duration-300 hover:bg-accent"
                >
                  <Trans>View works</Trans>
                  <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
                </a>
              </Magnetic>
            </motion.div>
          </div>
        </div>

        {/* Ticker */}
        <Ticker className="meta border-t border-line py-3 text-muted">
          <span className="mx-6">
            <Trans>Available for projects</Trans>
          </span>
          <span className="text-accent">✳</span>
          <span className="mx-6">
            <Trans>Full-stack development</Trans>
          </span>
          <span className="text-accent">✳</span>
          <span className="mx-6">
            <Trans>UI/UX design</Trans>
          </span>
          <span className="text-accent">✳</span>
          <span className="mx-6">
            <Trans>Graphic design</Trans>
          </span>
          <span className="text-accent">✳</span>
        </Ticker>
      </section>

      {/* ——————————————— SELECTED WORKS ——————————————— */}
      <section id="works" className="scroll-mt-16 px-4 py-20 md:px-8 md:py-28">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4 md:mb-14">
          <h2 className="font-display text-[clamp(2.5rem,7vw,6rem)] font-black uppercase leading-[0.85] tracking-tight">
            <Trans>Selected works</Trans>
          </h2>
          <span className="meta text-muted">
            <Trans>2024 — 2026</Trans> / 06 <Trans>cases</Trans>
          </span>
        </Reveal>
        <WorksList limit={4} />
        <Reveal className="mt-8 flex justify-end">
          <Link
            to="/projects"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
          >
            <span className="u-link">
              <Trans>Full index</Trans> (06)
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
          </Link>
        </Reveal>
      </section>

      {/* ——————————————— PROFILE TEASER ——————————————— */}
      <section className="grid gap-8 border-t border-line px-4 py-20 md:grid-cols-12 md:px-8 md:py-28">
        <div className="md:col-span-4">
          <span className="meta text-muted">
            <Trans>Profile</Trans> — Sec. 03
          </span>
        </div>
        <div className="md:col-span-8">
          <Reveal>
            <p className="font-serif text-[clamp(1.7rem,3.5vw,2.9rem)] italic leading-[1.15]">
              <Trans>The art of sculpting the digital.</Trans>
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink-soft">
              <Trans>
                Developer passionate about creating innovative web and mobile
                applications. Five years of front-end experience, two years of
                back-end — and a designer's eye on every line of code.
              </Trans>
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <Link
              to="/about"
              className="group mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors hover:text-accent"
            >
              <span className="u-link">
                <Trans>About me</Trans>
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>

      <FooterCta />
    </>
  );
}
