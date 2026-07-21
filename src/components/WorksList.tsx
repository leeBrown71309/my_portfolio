import { Link } from "@tanstack/react-router";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { useLingui } from "@lingui/react";
import { ArrowUpRight } from "lucide-react";
import { projectsData } from "../data/projects";
import type { Project } from "../types/project";

interface WorksListProps {
  limit?: number;
}

/**
 * The works index: monumental rows on hairlines, with a floating
 * image preview that chases the cursor on desktop.
 */
export function WorksList({ limit }: WorksListProps) {
  const { i18n } = useLingui();
  const reduce = useReducedMotion();
  const projects = limit ? projectsData.slice(0, limit) : projectsData;
  const [active, setActive] = useState<Project | null>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 250, damping: 28, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 250, damping: 28, mass: 0.6 });

  const onMouseMove = (e: MouseEvent<HTMLUListElement>) => {
    mx.set(e.clientX + 28);
    my.set(e.clientY - 140);
  };

  return (
    <div className="relative">
      <ul onMouseMove={onMouseMove} onMouseLeave={() => setActive(null)}>
        {projects.map((project, i) => (
          <li key={project.id} className="border-t border-line">
            <Link
              to="/projects/$projectId"
              params={{ projectId: project.id }}
              onMouseEnter={() => setActive(project)}
              className="group relative grid grid-cols-[auto_1fr_auto] items-baseline gap-x-4 overflow-hidden py-6 md:grid-cols-[3rem_1fr_auto_auto_2rem] md:gap-x-8 md:py-9"
            >
              {/* Vermillion flood on hover — bleeds to the viewport edges */}
              <span className="absolute inset-y-0 -left-4 -right-4 origin-bottom scale-y-0 bg-accent transition-transform duration-[450ms] ease-[cubic-bezier(0.83,0,0.17,1)] group-hover:scale-y-100 md:-left-8 md:-right-8" />
              <span className="meta relative z-10 text-muted transition-colors duration-300 group-hover:text-[#faf8f4]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="relative z-10 font-display text-[clamp(1.9rem,6vw,4.5rem)] font-black uppercase leading-[0.9] tracking-tight transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 group-hover:text-[#faf8f4]">
                {project.name}
              </span>
              <span className="meta relative z-10 hidden text-right text-muted transition-colors duration-300 group-hover:text-[#faf8f4]/80 md:inline">
                {i18n._(project.mainCategory)}
              </span>
              <span className="meta relative z-10 text-right text-muted transition-colors duration-300 group-hover:text-[#faf8f4]/80">
                {project.year}
              </span>
              <ArrowUpRight
                className="relative z-10 hidden h-6 w-6 self-center -translate-x-2 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-[#faf8f4] group-hover:opacity-100 md:block"
                strokeWidth={1.5}
              />
              {/* Mobile meta line */}
              <span className="meta relative z-10 col-span-3 mt-2 text-muted transition-colors duration-300 group-hover:text-[#faf8f4]/80 md:hidden">
                {i18n._(project.mainCategory)}
              </span>
            </Link>
          </li>
        ))}
        <li className="border-t border-line" aria-hidden="true" />
      </ul>

      {/* Floating preview — desktop only. Portaled to <body>: inside the
          page tree it's trapped by <main>'s stacking context (z-10), so the
          3D asterisk portal (z-30) would paint on top of it. At body level,
          z-40 sits above the asterisk and below the grain/menu layers. */}
      {!reduce &&
        createPortal(
          <AnimatePresence>
            {active && (
              <motion.div
                key={active.id}
                className="pointer-events-none fixed left-0 top-0 z-40 hidden w-[21rem] md:block"
                style={{ x: sx, y: sy }}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="border border-ink bg-paper p-1.5">
                  <div className="aspect-[4/3] overflow-hidden bg-paper-deep">
                    <img
                      src={active.preview}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1.5">
                    <span className="meta text-muted">{active.name}</span>
                    <span className="meta text-accent">Fig. {String(projects.indexOf(active) + 1).padStart(2, "0")}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
