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
import { useViewportSize } from "../hooks/useViewportSize";
import { ScrambleText } from "../components/ScrambleText";
import { Ticker } from "../components/Ticker";
import { WorksPlates } from "../components/WorksPlates";
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

/** Canvas edge, as a fraction of the viewport's smaller side. */
const BOX_FRACTION = { base: 0.72, md: 0.82 } as const;
const MD_BREAKPOINT = 768;
/** Clearance kept between the mark and the viewport edges. */
const INSET_FRACTION = 0.03;

interface TrailKeyframe {
  /** Scroll progress, 0 at the top of the document and 1 at the bottom. */
  at: number;
  /**
   * Target centre, as a fraction of the viewport. Clamped to whatever the
   * mark's own footprint leaves room for, so a value may deliberately
   * overshoot to mean "as far over as it can go".
   */
  cx: number;
  cy: number;
  scale: number;
}

/**
 * The mark's trail down the page.
 *
 * Each keyframe names where the mark's *centre* should sit, then gets clamped
 * so the mark stays fully on screen. Two properties carry that guarantee
 * between keyframes: linear interpolation of two in-bounds states is itself in
 * bounds (centre and footprint interpolate at the same rate), and the springs
 * below are overdamped, so the smoothed value never overshoots a keyframe.
 *
 * Bounding by the square canvas is deliberately conservative and makes the
 * trail rotation-safe: the monogram's farthest vertex sits inside the canvas's
 * inscribed circle, so spinning it cannot push it out of the box.
 *
 * The ceiling on `scale` is (1 - 2 * INSET_FRACTION) / BOX_FRACTION, which is
 * 1.15 at `md` — the hero sits just under it on purpose.
 *
 * `scale` only ever decreases. An earlier version dipped to 0.58 and came back
 * up to 0.66, and those two direction changes were the part that read as
 * stuttering: the mark shrank, hesitated, grew, hesitated, shrank again.
 * Monotonic scale gives it one clear reading — the mark recedes as you go down
 * the page — and leaves the spring nothing to reverse.
 */
const TRAIL: TrailKeyframe[] = [
  // Hero: as large as full visibility allows, pushed right of the headline.
  { at: 0, cx: 0.8, cy: 0.46, scale: 1.02 },
  { at: 0.36, cx: 0.12, cy: 0.4, scale: 0.74 },
  // Over the vermillion band, held left so it clears that section's copy.
  { at: 0.68, cx: 0.16, cy: 0.58, scale: 0.58 },
  // Footer: parked in the gap right of "Let's talk", on its centre line.
  { at: 1, cx: 0.8, cy: 0.75, scale: 0.44 },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * Measures the viewport, then hands off to the animated body.
 *
 * The split is load-bearing rather than tidiness. `useSpring` captures its
 * initial value when it mounts, so if those hooks ran during the first render —
 * before the viewport is measured, when `box` is 0 and every keyframe collapses
 * to 0 — the springs would latch onto translate(0, 0) and then visibly glide
 * the mark in from the top-left corner on every page load. Mounting them only
 * once the size is known lets them start on the real hero position.
 */
function ScrollAsterisk() {
  const { width, height } = useViewportSize();
  if (!width || !height) return null;
  return <AsteriskTrail width={width} height={height} />;
}

interface AsteriskTrailProps {
  width: number;
  height: number;
}

/**
 * The 3D monogram travels down the page on scroll — drifting right to left and
 * shrinking as you read, smoothed by springs. Portaled to <body> so the route's
 * clip-path transition never traps it.
 */
function AsteriskTrail({ width, height }: AsteriskTrailProps) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const vmin = Math.min(width, height);
  const box = vmin * (width >= MD_BREAKPOINT ? BOX_FRACTION.md : BOX_FRACTION.base);
  const inset = vmin * INSET_FRACTION;

  /**
   * Keyframes for the box's top-left corner. `scale` is taken about the box's
   * centre, so placing the centre on the trail point keeps it there at any
   * scale — which is what the previous version got wrong: it translated the
   * corner, leaving the mark half a box-width past every intended position.
   */
  const corners = (axis: "cx" | "cy", extent: number) =>
    TRAIL.map((keyframe) => {
      const half = (box * keyframe.scale) / 2 + inset;
      // If the mark cannot fit at all, centre it and overflow evenly rather
      // than favouring one edge.
      const centre =
        2 * half >= extent
          ? extent / 2
          : clamp(keyframe[axis] * extent, half, extent - half);
      return centre - box / 2;
    });

  const offsets = TRAIL.map((keyframe) => keyframe.at);
  const rawX = useTransform(scrollYProgress, offsets, corners("cx", width));
  const rawY = useTransform(scrollYProgress, offsets, corners("cy", height));
  const rawScale = useTransform(
    scrollYProgress,
    offsets,
    TRAIL.map((keyframe) => keyframe.scale),
  );
  const rawRotate = useTransform(scrollYProgress, [0, 1], [0, 40]);

  // Overdamped (damping 18 > critical 2*sqrt(55*0.8) = 13.3), so the smoothed
  // trail settles without overshooting the clamped keyframes.
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

  const className =
    "pointer-events-none fixed left-0 top-0 z-[30] opacity-70 mix-blend-multiply md:opacity-100 dark:mix-blend-screen";

  if (reduce) {
    return createPortal(
      <div
        className={className}
        style={{
          width: box,
          height: box,
          transform: `translate(${corners("cx", width)[0]}px, ${corners("cy", height)[0]}px) scale(${TRAIL[0].scale})`,
        }}
      >
        {content}
      </div>,
      document.body,
    );
  }

  return createPortal(
    <motion.div
      className={className}
      // willChange promotes this to its own compositor layer, so scaling it
      // transforms the existing raster instead of repainting a layer this large
      // on every frame.
      style={{
        width: box,
        height: box,
        x,
        y,
        scale,
        rotate,
        transformOrigin: "center",
        willChange: "transform",
      }}
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
        <Reveal className="mb-14 md:mb-24">
          <h2 className="font-wide border-b border-line pb-5 font-display text-[clamp(2.5rem,7.5vw,6.5rem)] font-black uppercase leading-[0.82] tracking-[-0.02em]">
            <Trans>Selected works</Trans>
            <span className="text-accent">.</span>
          </h2>
        </Reveal>
        <WorksPlates limit={4} />
        {/* The one action for this intent, placed where the reader runs out of
            plates. `text-[#141412]` on hover rather than `text-ink`: the accent
            never swaps with the theme, so its label must not either — bone on
            vermillion only reaches 2.9:1. */}
        <Reveal className="mt-20 flex justify-end md:mt-28" y={20}>
          <Magnetic strength={0.25}>
            <Link
              to="/projects"
              className="group inline-flex items-center gap-4 bg-ink px-7 py-4 font-display text-sm font-bold uppercase tracking-wide text-paper transition-colors duration-300 hover:bg-accent "
            >
              <Trans>Full index</Trans> (06)
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Magnetic>
        </Reveal>
      </section>

      {/* ——————————————— PROFILE TEASER ——————————————— */}
      {/* The page's one colour block. `vermillion-island` re-points the local
          tokens at ink-on-vermillion, so the markup below keeps using the
          system's semantic classes and the type stays legible in both themes. */}
      <section className="vermillion-island grid gap-8 border-t border-line bg-paper px-4 py-20 md:grid-cols-12 md:px-8 md:py-28">
        <div className="md:col-span-4">
          <span className="meta text-muted">
            <Trans>Profile</Trans> — Sec. 03
          </span>
        </div>
        <div className="md:col-span-8">
          <Reveal>
            {/* The one element that stays ink on the vermillion: the island
                pins the inherited colour to white, so the headline needs to
                ask for `text-ink` explicitly. */}
            <p className="font-serif text-[clamp(1.7rem,3.5vw,2.9rem)] italic leading-[1.15] text-ink">
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
