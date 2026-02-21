import { createFileRoute, Link } from "@tanstack/react-router";
import { Trans } from "@lingui/macro";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useLingui } from "@lingui/react";
import { projectsData } from "../data/projects";
import type { Project } from "../types/project";
import { useLoading } from "../context/LoadingContext";

export const Route = createFileRoute("/projects/")({
  component: ProjectsPage,
});

function ProjectsPage() {
  const { i18n } = useLingui();
  const { isLoading } = useLoading();
  const projects = projectsData as Project[];
  const [hoveredProject, setHoveredProject] = useState<Project | null>(
    projects[0] || null,
  );

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.4,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any },
    },
  };

  return (
    <div className="h-screen w-full bg-[#070b14] overflow-hidden relative">
      <AnimatePresence mode="wait">
        {!isLoading && (
          <motion.div
            key="projects-page-content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="h-full w-full flex flex-col md:flex-row relative"
          >
            {/* Editorial Grid Overlay */}
            <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-12 pointer-events-none opacity-[0.03] z-0">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="border-r border-white h-full last:border-r-0"
                />
              ))}
            </div>

            {/* Left Side: Dynamic preview Image */}
            <div className="hidden md:flex w-1/2 h-full items-center justify-center pt-48 pb-12 px-12 lg:px-24 relative z-10 border-r border-white/5">
              <Link
                to="/projects/$projectId"
                params={{ projectId: hoveredProject?.id || "" }}
                className="relative w-full aspect-4/5 max-h-70vh group overflow-hidden bg-neutral-900/50 rounded-lg cursor-pointer"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={hoveredProject?.id || "empty"}
                    initial={{ scale: 1.1, opacity: 0, filter: "blur(20px)" }}
                    animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                    exit={{ scale: 0.95, opacity: 0, filter: "blur(20px)" }}
                    transition={{
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1] as any,
                    }}
                    className="absolute inset-0 w-full h-full"
                  >
                    {hoveredProject?.preview ? (
                      <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-[2s] group-hover:scale-110"
                        style={{
                          backgroundImage: `url(${hoveredProject.preview})`,
                        }}
                        aria-label={hoveredProject.name}
                      >
                        <div className="absolute inset-0 bg-linear-to-t from-[#070b14]/80 via-transparent to-transparent opacity-60" />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/10 font-eight text-4xl italic">
                        IMAGE
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Decorative elements on the image box */}
                <div className="absolute top-6 left-6 flex items-center gap-3">
                  <div className="w-8 h-px bg-primary-500" />
                  <span className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase">
                    Aperçu du projet
                  </span>
                </div>

                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                  <motion.div
                    key={hoveredProject?.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-col"
                  >
                    <span className="text-primary-500 font-mono text-[10px] uppercase tracking-widest mb-1">
                      {hoveredProject &&
                        i18n._(hoveredProject.mainCategory as any)}
                    </span>
                    <span className="text-white/40 font-mono text-[9px] uppercase tracking-widest">
                      {hoveredProject?.year}
                    </span>
                  </motion.div>
                  <div className="text-white/20 font-eight text-6xl">
                    {projects.findIndex((p) => p.id === hoveredProject?.id) +
                      1 <
                    10
                      ? `0${projects.findIndex((p) => p.id === hoveredProject?.id) + 1}`
                      : projects.findIndex((p) => p.id === hoveredProject?.id) +
                        1}
                  </div>
                </div>
              </Link>
            </div>

            {/* Right Side: Scrollable Project List */}
            <div className="w-full md:w-1/2 h-full flex flex-col z-10">
              <div className="pt-32 md:pt-48 pb-12 px-8 lg:px-16 shrink-0">
                <motion.div variants={itemVariants}>
                  <span className="text-primary-500 font-mono text-[10px] uppercase tracking-[0.4em] block mb-2">
                    <Trans>Sélection de projets</Trans>
                  </span>
                  <h1 className="text-white text-5xl lg:text-[7rem] font-eight tracking-tight leading-none mb-4 uppercase flex items-start gap-4">
                    <Trans>PROJETS</Trans>
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                      className="text-primary-500 text-sm md:text-base lg:text-2xl font-mono mt-2 lg:mt-6"
                    >
                      (
                      {projects.length < 10
                        ? `0${projects.length}`
                        : projects.length}
                      )
                    </motion.span>
                  </h1>
                  <p className="text-white/30 font-dm-sans text-sm md:text-base max-w-sm">
                    <Trans>
                      Une sélection de travaux où l'esthétique rencontre
                      l'ingénierie créative.
                    </Trans>
                  </p>
                </motion.div>
              </div>

              <div className="grow overflow-y-auto custom-scrollbar px-8 lg:px-16 pb-40">
                <div className="flex flex-col gap-0 divide-y divide-white/5 border-t border-white/5">
                  {projects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      variants={itemVariants}
                      onMouseEnter={() => setHoveredProject(project)}
                      className="group relative"
                    >
                      <Link
                        to="/projects/$projectId"
                        params={{ projectId: project.id }}
                        className="flex flex-col py-10 lg:py-14 group-hover:pl-4 transition-all duration-500"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex flex-col lg:flex-row lg:items-end gap-2 lg:gap-6">
                            <span className="text-white/20 font-mono text-xs md:text-sm lg:mb-2 group-hover:text-primary-500 transition-colors">
                              {index + 1 < 10 ? `0${index + 1}` : index + 1}
                            </span>
                            <h2 className="text-white text-4xl lg:text-8xl font-eight tracking-tight transition-transform duration-500 group-hover:translate-x-4 uppercase">
                              {project.name}
                            </h2>
                          </div>
                          <div className="hidden lg:block">
                            <motion.div
                              whileHover={{ rotate: 45 }}
                              className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary-500 group-hover:text-primary-500 transition-colors"
                            >
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="7" y1="17" x2="17" y2="7"></line>
                                <polyline points="7 7 17 7 17 17"></polyline>
                              </svg>
                            </motion.div>
                          </div>
                        </div>

                        <div className="flex gap-4 items-center transition-all duration-500 group-hover:translate-x-6 opacity-40 group-hover:opacity-100">
                          <span className="text-[10px] uppercase font-mono tracking-widest text-primary-500">
                            {i18n._(project.mainCategory as any)}
                          </span>
                          <div className="w-1 h-1 rounded-full bg-white/20" />
                          <span className="text-[10px] uppercase font-mono tracking-widest text-white/40">
                            {project.year}
                          </span>
                        </div>
                      </Link>

                      {/* Background Hover Effect */}
                      <div className="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/2 transition-colors duration-500 -z-10" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative Navigation Element */}
            <div className="absolute bottom-8 left-8 items-center gap-6 z-20 pointer-events-none opacity-20 hidden md:flex">
              <span className="text-[9px] font-mono uppercase tracking-[0.5em] text-white vertical-text">
                <Trans>Faire défiler pour explorer</Trans>
              </span>
              <div className="w-px h-24 bg-linear-to-b from-primary-500 to-transparent" />
            </div>

            {/* Extreme background noise for editorial feel */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none mix-blend-overlay z-5" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
