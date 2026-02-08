import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Trans } from "@lingui/macro";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import projectsData from "../data/projects.json";
import { Project } from "../types/project";
import { useLoading } from "../context/LoadingContext";
import { ArrowLeft, ExternalLink, ChevronRight } from "lucide-react";
import React from "react";
import { useMotionValue, useSpring } from "framer-motion";

const MagneticChar = ({ char }: { char: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const tx = useSpring(x, springConfig);
  const ty = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    if (Math.abs(distanceX) < 40 && Math.abs(distanceY) < 40) {
      x.set(distanceX * 0.35);
      y.set(distanceY * 0.35);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: tx, y: ty }}
      className="inline-block cursor-default select-none transition-colors duration-300 hover:text-primary-500"
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  );
};

export const Route = createFileRoute("/projects/$projectId")({
  component: ProjectDetailsPage,
});

function ProjectDetailsPage() {
  const { projectId } = useParams({ from: "/projects/$projectId" });
  const { isLoading } = useLoading();
  const project = (projectsData as Project[]).find((p) => p.id === projectId);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const bigTextX = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const bigTextX2 = useTransform(scrollYProgress, [0, 1], [-200, 200]);

  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 1.1]);
  const yBanner = useTransform(scrollY, [0, 400], [0, 100]);
  const scrollIndicatorY = useTransform(scrollY, [0, 200], [0, 40]);

  if (!project) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#070b14] text-white">
        <Trans>Project not found</Trans>
      </div>
    );
  }

  const nextProject = (projectsData as Project[]).find(
    (_, i) =>
      (projectsData as Project[])[
        (i - 1 + (projectsData as Project[]).length) %
          (projectsData as Project[]).length
      ].id === projectId,
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any },
    },
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full bg-[#070b14] text-white overflow-x-hidden"
    >
      <AnimatePresence mode="wait">
        {!isLoading && (
          <motion.div
            key={project.id}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="relative"
          >
            {/* Background Floating Typography */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-20 flex flex-col justify-between py-24 select-none mix-blend-plus-lighter">
              <motion.div
                style={{ x: bigTextX }}
                className="text-[25vw] font-eight leading-none whitespace-nowrap text-white/5"
              >
                {project.name.toUpperCase()} {project.name.toUpperCase()}
              </motion.div>
              <motion.div
                style={{ x: bigTextX2 }}
                className="text-[25vw] font-eight leading-none whitespace-nowrap self-end text-white/5"
              >
                {project.mainCategory.toUpperCase()}{" "}
                {project.mainCategory.toUpperCase()}
              </motion.div>
            </div>
            {/* Navigation Header */}
            <motion.nav
              variants={itemVariants}
              className="fixed top-0 left-0 w-full z-200 p-8 mt-15 md:mt-10 md:p-12 flex justify-between items-center mix-blend-difference pointer-events-none"
            >
              <Link
                to="/projects"
                className="-ml-2 md:-ml-5 lg:ml-5 group flex items-center gap-4 transition-all pointer-events-auto"
              >
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                  <ArrowLeft size={18} />
                </div>
              </Link>
              <div className="text-[10px] lg:mr-10 font-mono uppercase tracking-[0.5em] opacity-40">
                {project.year} / {project.mainCategory}
              </div>
            </motion.nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col justify-end p-6 md:p-24 pb-20 md:pb-32 overflow-hidden">
              <motion.div
                style={{
                  opacity,
                  scale,
                  y: yBanner,
                }}
                className="absolute inset-0 z-0 will-change-transform"
              >
                <div
                  className="w-full h-full bg-cover bg-center transition-all duration-[2s]"
                  style={{ backgroundImage: `url(${project.banner})` }}
                />
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#070b14]/20 to-[#070b14]" />
              </motion.div>

              <div className="relative z-10 max-w-7xl md:mt-20">
                <motion.span
                  variants={itemVariants}
                  className="text-primary-500 font-mono text-sm font-bold uppercase tracking-[0.4em] block mb-6"
                >
                  {project.categories.join(" • ")}
                </motion.span>
                <motion.h1
                  variants={itemVariants}
                  className="text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] font-eight tracking-tighter leading-[0.85] uppercase mb-8 md:mb-12 flex flex-wrap gap-x-[0.1em]"
                >
                  {project.name.split(" ").map((word, wordIdx) => (
                    <span key={wordIdx} className="flex whitespace-nowrap">
                      {word.split("").map((char, charIdx) => (
                        <MagneticChar key={charIdx} char={char} />
                      ))}
                    </span>
                  ))}
                </motion.h1>

                <div className="flex flex-col lg:flex-row gap-8 md:gap-16 md:items-end">
                  <motion.p
                    variants={itemVariants}
                    className="text-xl md:text-3xl font-dm-sans text-white/60 max-w-2xl leading-tight"
                  >
                    {project.description}
                  </motion.p>

                  {project.url && (
                    <motion.div variants={itemVariants}>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full lg:w-auto group flex items-center justify-center gap-6 py-6 px-10 rounded-full border border-white/10 hover:border-primary-500 transition-colors"
                      >
                        <span className="font-eight text-sm uppercase tracking-widest group-hover:text-primary-500 transition-colors">
                          <Trans>Visit Website</Trans>
                        </span>
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all duration-500">
                          <ExternalLink size={20} />
                        </div>
                      </a>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Scroll Indicator */}
              <motion.div
                style={{ y: scrollIndicatorY }}
                className="absolute bottom-12 right-12 hidden md:flex flex-col items-center gap-6 text-white/40"
              >
                <span className="text-[9px] font-mono uppercase tracking-[0.5em] vertical-text">
                  <Trans>Scroll for details</Trans>
                </span>
                <div className="w-px h-24 bg-linear-to-b from-white to-transparent" />
              </motion.div>
            </section>

            {/* Project Details Grid */}
            <section className="px-8 md:px-24 py-32 border-t border-white/5 bg-[#070b14]">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-24">
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col gap-4"
                >
                  <span className="text-[10px] font-mono text-primary-500 uppercase tracking-widest">
                    Client
                  </span>
                  <span className="text-xl md:text-2xl font-eight uppercase">
                    {project.client}
                  </span>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex flex-col gap-4"
                >
                  <span className="text-[10px] font-mono text-primary-500 uppercase tracking-widest">
                    Role
                  </span>
                  <span className="text-xl md:text-2xl font-eight uppercase">
                    {project.role.role}
                  </span>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex flex-col gap-4"
                >
                  <span className="text-[10px] font-mono text-primary-500 uppercase tracking-widest">
                    Year
                  </span>
                  <span className="text-xl md:text-2xl font-eight uppercase">
                    {project.year}
                  </span>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex flex-col gap-4"
                >
                  <span className="text-[10px] font-mono text-primary-500 uppercase tracking-widest">
                    Tech
                  </span>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-mono border border-white/10 px-3 py-1 rounded-full hover:border-primary-500/50 hover:text-primary-500 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Content Sections */}
            <div className="flex flex-col gap-32 pb-48">
              {project.sections.map((section, idx) => (
                <section key={idx} className="px-8 md:px-24">
                  <div className="max-w-7xl mx-auto">
                    <motion.div
                      variants={itemVariants}
                      className="mb-16 max-w-3xl"
                    >
                      <h2 className="text-3xl md:text-6xl font-eight uppercase mb-8 leading-none">
                        {section.title}
                      </h2>
                      <p className="text-lg md:text-2xl text-white/50 font-dm-sans leading-relaxed">
                        {section.description}
                      </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                      {section.images.map((img, imgIdx) => (
                        <motion.div
                          key={imgIdx}
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                          className={`relative overflow-hidden group aspect-16/10 rounded-lg bg-neutral-900 ${
                            section.images.length === 1
                              ? "md:col-span-2 aspect-21/9"
                              : ""
                          }`}
                        >
                          <img
                            src={img}
                            alt={`${section.title} ${imgIdx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>
              ))}
            </div>

            {/* Next Project Footer */}
            {nextProject && (
              <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="relative h-screen flex flex-col items-center justify-center p-8 border-t border-white/5"
              >
                <span className="text-[10px] font-mono text-primary-500 uppercase tracking-[1em] mb-12">
                  <Trans>Next Project</Trans>
                </span>

                <Link
                  to="/projects/$projectId"
                  params={{ projectId: nextProject.id }}
                  className="group flex flex-col items-center text-center"
                >
                  <h3 className="text-6xl md:text-[12rem] font-eight tracking-tighter uppercase transition-all duration-500 group-hover:text-primary-500 group-hover:scale-95 leading-none">
                    {nextProject.name}
                  </h3>

                  <div className="mt-12 w-20 h-20 rounded-full border border-white/20 flex items-center justify-center group-hover:border-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-all duration-500 animate-bounce">
                    <ChevronRight size={40} />
                  </div>
                </Link>

                {/* Background Shadow Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 overflow-hidden">
                  <span className="text-[30vw] font-eight uppercase text-white/2 select-none whitespace-nowrap">
                    {nextProject.name}
                  </span>
                </div>
              </motion.section>
            )}

            {/* Extreme background noise for editorial feel */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none mix-blend-overlay z-0" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
