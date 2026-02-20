import { createFileRoute } from "@tanstack/react-router";
import { Trans, t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Download,
  ExternalLink,
  GraduationCap,
  Layout,
  Sparkles,
  Code2,
  Database,
  Globe,
  Layers,
  Wrench,
  Terminal,
} from "lucide-react";
import { useRef } from "react";
import { useLoading } from "../context/LoadingContext";
import { aboutData } from "../data/about";
import { MagneticChar, MagneticCard } from "../components/Magnetic";

const AnimatedCreativeIcon = () => (
  <motion.svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-primary-400"
  >
    <motion.path
      d="M16 24L22 30L34 18"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={{
        initial: { pathLength: 0, opacity: 0 },
        animate: { pathLength: 1, opacity: 1 },
        hover: { pathLength: [1, 0, 1], scale: 1.1 },
      }}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.8, ease: "easeInOut" }}
    />
    <motion.rect
      x="8"
      y="8"
      width="32"
      height="32"
      rx="6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeDasharray="4 4"
      variants={{
        hover: { rotate: 180, scale: 0.9 },
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    />
    <motion.circle
      cx="24"
      cy="24"
      r="20"
      stroke="currentColor"
      strokeWidth="0.5"
      strokeOpacity="0.2"
      variants={{
        hover: { scale: 1.2, strokeOpacity: 0.5 },
      }}
      transition={{ duration: 0.4 }}
    />
  </motion.svg>
);

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

const ExperienceStat = ({
  label,
  years,
  delay = 0,
}: {
  label: string;
  years: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.8 }}
    className="flex items-center justify-between border-b border-white/5 py-4 group hover:bg-white/2 px-4 -mx-4 transition-colors rounded-xl"
  >
    <span className="text-white/40 font-gimbal text-[10px] uppercase tracking-widest group-hover:text-primary-400 group-hover:translate-x-2 transition-all">
      {label}
    </span>
    <span className="text-white font-eight text-lg">{years}</span>
  </motion.div>
);

function AboutPage() {
  const { i18n } = useLingui();
  const { isLoading } = useLoading();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const bigTextX = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const bigTextX2 = useTransform(scrollYProgress, [0, 1], [-200, 200]);

  const cvLink = i18n.locale === "fr" ? "/Mon cv fr.pdf" : "/Mon cv en.pdf";

  return (
    <div
      ref={containerRef}
      className="bg-[#070b14] min-h-screen selection:bg-primary-500/30 overflow-x-hidden"
    >
      {/* Background Floating Typography */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20 flex flex-col justify-between py-24 select-none mix-blend-plus-lighter">
        <motion.div
          style={{ x: bigTextX }}
          className="text-[25vw] font-eight leading-none whitespace-nowrap text-white/5"
        >
          CREATIVE CREATIVE CREATIVE
        </motion.div>
        <motion.div
          style={{ x: bigTextX2 }}
          className="text-[25vw] font-eight leading-none whitespace-nowrap self-end"
        >
          DEVELOPER DEVELOPER DEVELOPER
        </motion.div>
      </div>

      <div className="relative z-10 px-6 md:px-12 pt-32 pb-24 max-w-[1800px] mx-auto">
        {/* SECTION 1: HERO & CORE IDENTITY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isLoading ? { opacity: 0 } : { opacity: 1, y: 0 }}
            className="lg:col-span-8"
          >
            <MagneticCard
              className="h-full flex flex-col justify-end min-h-[500px] md:min-h-[600px] relative"
              strength={0.1}
            >
              <div className="absolute top-12 left-12">
                <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center overflow-hidden">
                  <AnimatedCreativeIcon />
                </div>
              </div>

              <div className="max-w-3xl">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-primary-500 font-mono text-[10px] uppercase tracking-[0.5em] mb-6 block"
                >
                  <Trans>DÉFINITION DU PRODUIT</Trans>
                </motion.span>
                <h1 className="text-5xl md:text-8xl font-eight text-white tracking-tighter leading-[0.9] mb-8 flex flex-wrap gap-x-[0.3em]">
                  {i18n
                    ._(t`L'art de sculpter le digital.`)
                    .split(" ")
                    .map((word, i) => (
                      <span key={i} className="flex whitespace-nowrap">
                        {word.split("").map((c, j) => (
                          <MagneticChar
                            key={j}
                            char={c}
                            range={50}
                            strength={0.4}
                          />
                        ))}
                      </span>
                    ))}
                </h1>
                <p className="text-white/60 font-outfit text-xl md:text-2xl leading-relaxed">
                  <Trans>
                    Développeur passionnée par la création de sites et
                    d'applications web/mobile innovantes. Expérience de 5 ans en
                    développement front-end et 2ans en back-end. Si vous
                    appréciez mon travail, n'hésitez pas à me contacter ce
                    serait un plaisir de collaborer avec vous.
                  </Trans>
                </p>
              </div>
            </MagneticCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isLoading ? { opacity: 0 } : { opacity: 1, scale: 1 }}
            className="lg:col-span-4"
          >
            <div className="relative h-full aspect-4/5 lg:aspect-auto group overflow-hidden rounded-[2.5rem] border border-white/10">
              <div className="absolute inset-0 bg-primary-900/20 group-hover:bg-transparent transition-colors duration-700 z-10" />
              <img
                src="/images/about-me.webp"
                alt="Lee Makosso"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop";
                }}
              />
              <div className="absolute bottom-8 left-8 right-8 z-20 flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-white font-eight text-2xl uppercase">
                    Lee Makosso
                  </span>
                  <span className="text-primary-400 font-mono text-[10px] tracking-widest uppercase">
                    <Trans>Creative Director</Trans>
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-md"
                >
                  <Sparkles className="w-5 h-5 text-white/50" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* SECTION 2: BENTO GRID EXPERIENCE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Card: Skills Cloud (PROMINENT - Highlighted) */}
          <motion.div
            className="lg:col-span-2 flex flex-col"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <MagneticCard className="flex flex-col h-full relative group/skills overflow-hidden border-primary-500/30 bg-primary-500/5 backdrop-blur-sm">
              {/* Highlight Background Effect */}
              <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary-500/10 blur-[100px] rounded-full group-hover/skills:bg-primary-500/20 transition-colors duration-1000" />

              <div className="flex items-center justify-between mb-12 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary-500/20 flex items-center justify-center border border-primary-500/40">
                    <Code2 className="w-7 h-7 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-eight text-3xl uppercase tracking-tighter leading-none mb-1">
                      <Trans>Technical Stack</Trans>
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                      <span className="text-primary-400/60 font-mono text-[10px] uppercase tracking-widest">
                        <Trans>Core Proficiencies</Trans>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 relative z-10">
                {aboutData.skills.map((cat, i) => {
                  const Icon =
                    {
                      "Web Foundation": Globe,
                      Languages: Terminal,
                      Frameworks: Layers,
                      "Architecture & Data": Database,
                      "Tools & CMS": Wrench,
                    }[i18n._(cat.category as any)] || Code2;

                  return (
                    <div key={i} className="group/cat">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover/cat:bg-primary-500 group-hover/cat:scale-110 transition-all duration-500">
                          <Icon className="w-4 h-4 text-white/40 group-hover/cat:text-white transition-colors" />
                        </div>
                        <h4 className="text-white/30 font-mono text-[11px] uppercase tracking-[0.2em] group-hover/cat:text-white transition-colors">
                          {i18n._(cat.category as any)}
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {cat.items.map((skill, j) => (
                          <motion.span
                            key={j}
                            whileHover={{ scale: 1.05, y: -2 }}
                            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-white/50 text-[10px] font-mono uppercase tracking-tighter hover:bg-primary-500 hover:text-white hover:border-primary-500/50 transition-all duration-300 cursor-default"
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </MagneticCard>
          </motion.div>

          {/* Column for Education and Expertise */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            {/* Card: Education */}
            <div className="flex-1">
              <MagneticCard className="flex flex-col justify-between h-full min-h-[250px] group/edu">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover/edu:bg-primary-500/10 group-hover/edu:border-primary-500/20 transition-all duration-500">
                    <GraduationCap className="w-6 h-6 text-white/40 group-hover/edu:text-primary-400 transition-colors" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white/20 font-mono text-[10px] uppercase tracking-widest mb-4">
                    <Trans>Éducation</Trans>
                  </h3>
                  <p className="text-white text-2xl font-eight uppercase leading-tight group-hover:text-primary-400 transition-colors">
                    <Trans>MIT university | Groupe Supdeco Dakar</Trans>
                  </p>
                </div>
              </MagneticCard>
            </div>

            {/* Card: Expertise Summary */}
            <div className="flex-1">
              <MagneticCard className="flex flex-col h-full bg-[#0a0f1a] border-white/5">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                    <Layout className="w-5 h-5 text-white/40" />
                  </div>
                  <div className="bg-primary-500/10 px-3 py-1 rounded-full border border-primary-500/20">
                    <span className="text-primary-400 font-eight text-sm">
                      5+ YEARS
                    </span>
                  </div>
                </div>

                <h2 className="text-white font-eight text-2xl mb-6 uppercase tracking-tighter shadow-sm">
                  <Trans>Expertise</Trans>
                </h2>

                <div className="space-y-1">
                  {aboutData.expertise.map((item, i) => (
                    <ExperienceStat
                      key={i}
                      label={i18n._(item.label as any)}
                      years={i18n._(item.years as any)}
                      delay={(i + 1) * 0.1}
                    />
                  ))}
                </div>
              </MagneticCard>
            </div>
          </div>
        </div>

        {/* SECTION 3: CTA & DOWNLOAD */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <a
            href={cvLink}
            target="_blank"
            rel="noopener noreferrer"
            className="lg:col-span-3 group relative overflow-hidden rounded-[2.5rem] bg-primary-600 p-12 flex flex-col md:flex-row items-center justify-between transition-all hover:bg-primary-500"
          >
            <div className="relative z-10 text-center md:text-left mb-8 md:mb-0">
              <h2 className="text-white font-eight text-4xl md:text-5xl tracking-tighter uppercase mb-2">
                <Trans>Curriculum Vitae</Trans>
              </h2>
              <p className="text-white/60 font-outfit text-lg">
                <Trans>
                  Téléchargez une version détaillée de mon parcours
                  professionnel.
                </Trans>
              </p>
            </div>
            <div className="relative z-10 w-20 h-20 rounded-full bg-white text-primary-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <Download className="w-8 h-8" />
            </div>

            {/* Decorative circle */}
            <div className="absolute -bottom-1/2 -right-1/4 w-[500px] h-[500px] bg-white/10 blur-[100px] rounded-full" />
          </a>

          <MagneticCard className="flex flex-col justify-center items-center text-center group/card">
            <a
              href="mailto:hello@leeeight.com"
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover/card:bg-primary-500/20 transition-colors">
                <ExternalLink className="w-6 h-6 text-white/40 group-hover/card:text-white transition-colors" />
              </div>
              <span className="text-white/40 font-gimbal text-[10px] uppercase tracking-widest mb-1">
                <Trans>Get in touch</Trans>
              </span>
              <span className="text-white font-eight text-lg">
                hello@leeeight.com
              </span>
            </a>
          </MagneticCard>
        </div>
      </div>

      {/* Extreme background noise */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay z-50" />
    </div>
  );
}
