import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { useLingui } from "@lingui/react";
import { ArrowUpRight } from "lucide-react";
import { projectsData } from "../data/projects";

interface WorksPlatesProps {
  /** How many entries to show. Defaults to the whole set. */
  limit?: number;
}

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Entry choreography. One trigger per entry drives the whole sequence through
 * variant propagation: the plate settles, the numeral and name follow, the rule
 * draws across, the metadata lands last.
 *
 * Everything here moves on `transform` and `opacity` only — no blur filter, so
 * the sequence stays on the compositor and holds its frame rate over plates
 * this large.
 */
const PLATE_VARIANTS = {
  hidden: { opacity: 0, y: 24, scale: 1.02 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.1, ease: EASE } },
};

const NUMERAL_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, delay: 0.08, ease: EASE } },
};

/** The name rises out of its own mask, echoing the hero's headline. */
const NAME_VARIANTS = {
  hidden: { y: "108%" },
  visible: { y: "0%", transition: { duration: 1.05, delay: 0.14, ease: EASE } },
};

const RULE_VARIANTS = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 1.2, delay: 0.24, ease: EASE } },
};

const META_VARIANTS = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.34, ease: EASE } },
};

/**
 * Slot geometry for the broken grid.
 *
 * From `md` up the plate, the outlined numeral and the name all share grid
 * row 1: the name starts *inside* the plate's column range and runs past its
 * far edge, so the display type straddles the plate's bottom edge — ink on
 * paper below it, knocked out of the photograph above it.
 *
 * Column spans and aspect ratios are deliberately uneven (medium, letterbox,
 * dominant, medium) so the spread reads as a composed page rather than a
 * repeating row. Entries cycle through the slots, so the rhythm survives any
 * `limit`.
 */
const SLOTS = [
  {
    plate: "md:col-start-1 md:col-end-8",
    aspect: "md:aspect-[16/10]",
    name: "md:col-start-4 md:col-end-13",
    numeral: "md:col-start-10 md:col-end-13",
    topGap: "mt-20 md:mt-0",
  },
  {
    plate: "md:col-start-6 md:col-end-13",
    aspect: "md:aspect-[21/9]",
    name: "md:col-start-1 md:col-end-9",
    numeral: "md:col-start-1 md:col-end-4",
    topGap: "mt-20 md:mt-32",
  },
  {
    plate: "md:col-start-2 md:col-end-10",
    aspect: "md:aspect-[4/3]",
    name: "md:col-start-6 md:col-end-13",
    numeral: "md:col-start-11 md:col-end-13",
    topGap: "mt-20 md:mt-44",
  },
  {
    plate: "md:col-start-1 md:col-end-7",
    aspect: "md:aspect-[3/2]",
    name: "md:col-start-4 md:col-end-13",
    numeral: "md:col-start-8 md:col-end-11",
    topGap: "mt-20 md:mt-36",
  },
] as const;

/**
 * Selected works as an editorial plate spread: monochrome print plates on a
 * broken grid, each one signed by a display-type name that crosses its bottom
 * edge. Hover brings the plate into colour and overprints a vermillion rule.
 */
export function WorksPlates({ limit }: WorksPlatesProps) {
  const { i18n } = useLingui();
  const reduce = useReducedMotion();
  const projects = limit ? projectsData.slice(0, limit) : projectsData;

  return (
    <ul>
      {projects.map((project, i) => {
        const slot = SLOTS[i % SLOTS.length];
        const index = String(i + 1).padStart(2, "0");

        return (
          <motion.li
            key={project.id}
            className={i === 0 ? undefined : slot.topGap}
            initial={reduce ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* The paper background is load-bearing: it guarantees the blended
                name an opaque backdrop whatever the route wrapper does to the
                stacking context above it. */}
            <Link
              to="/projects/$projectId"
              params={{ projectId: project.id }}
              className="works-plate group grid grid-cols-12 gap-x-4 bg-paper md:gap-x-8"
            >
              {/* ——— The plate ——— */}
              <motion.div
                variants={PLATE_VARIANTS}
                className={`col-span-12 row-start-1 self-start ${slot.plate}`}
              >
                <div
                  className={`relative aspect-[4/3] overflow-hidden bg-paper-deep ${slot.aspect}`}
                >
                  <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]">
                    <img
                      src={project.preview}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                    {/* Ink pass — the plate stays monochrome until you touch
                        it. Desktop only: on touch there is no hover to
                        resolve it, so the work shows in colour from the start. */}
                    <img
                      src={project.preview}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 hidden h-full w-full object-cover grayscale contrast-125 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-0 md:block"
                    />
                  </div>
                  {/* The plate dissolves into paper along its bottom edge —
                      the boundary the name crosses. Stops are tuned in
                      styles.css against the blend maths. */}
                  <span
                    aria-hidden="true"
                    className="plate-fade absolute inset-0 hidden md:block"
                  />
                </div>
              </motion.div>

              {/* ——— Outlined index numeral, set in the empty gutter ——— */}
              <motion.span
                aria-hidden="true"
                variants={NUMERAL_VARIANTS}
                className={`plate-numeral row-start-1 hidden self-start font-display text-[clamp(4rem,8vw,9rem)] font-black leading-none tracking-tight md:block ${slot.numeral}`}
              >
                {index}
              </motion.span>

              {/* ——— The name, crossing the plate's bottom edge ——— */}
              {/* Three deliberate oddities here:
                  1. The font-size lives on the h3 so the straddle offset can
                     be expressed in `em` — it has to track the display size,
                     not the inherited body size, and stay independent of how
                     many lines the name wraps to.
                  2. That offset carries the mask's `pb` on top of the 0.34em
                     straddle, since the padding lifts the glyphs off the box
                     floor. The mask needs the padding: at `leading-[0.85]`
                     the line box is tighter than the cap height.
                  3. It is a negative margin rather than a translate, and that
                     is not interchangeable here. `translate` forms an isolated
                     blending group, which severed the blended span below from
                     the paper backdrop it has to blend against — the name then
                     painted its own raw colour instead, which read as white.
                     Margins shift the box without forming a group. */}
              <h3
                className={`col-span-12 row-start-2 mt-4 text-[clamp(1.9rem,5vw,4.5rem)] md:row-start-1 md:mb-[-0.42em] md:mt-0 md:self-end ${slot.name}`}
              >
                <span className="block overflow-hidden pb-[0.08em]">
                  <motion.span
                    variants={NAME_VARIANTS}
                    className="plate-name block text-balance font-display font-black uppercase leading-[0.85] tracking-[-0.02em] text-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5 dark:text-ink"
                  >
                    {project.name}
                  </motion.span>
                </span>
              </h3>

              {/* ——— Meta rail ——— */}
              <div className="relative col-span-12 row-start-3 mt-6 pt-3 md:row-start-2 md:mt-12">
                {/* The rule draws itself across on reveal; the vermillion one
                    overprints it on hover. */}
                <motion.span
                  variants={RULE_VARIANTS}
                  className="absolute inset-x-0 top-0 h-px origin-left bg-line"
                />
                <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
                <motion.div
                  variants={META_VARIANTS}
                  className="grid grid-cols-12 items-baseline gap-x-4 md:gap-x-8"
                >
                  <span className="meta col-span-2 text-accent md:col-span-1">
                    {index}
                  </span>
                  <span className="meta col-span-6 text-muted">
                    {i18n._(project.mainCategory)}
                  </span>
                  <span className="meta col-span-3 text-right text-muted md:col-span-4">
                    {project.year}
                  </span>
                  <ArrowUpRight
                    className="col-span-1 h-4 w-4 justify-self-end text-muted transition-[transform,color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    strokeWidth={1.5}
                  />
                </motion.div>
              </div>
            </Link>
          </motion.li>
        );
      })}
    </ul>
  );
}
