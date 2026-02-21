import { createFileRoute } from "@tanstack/react-router";
import { Trans, t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Mail,
  Linkedin,
  Github,
  Instagram,
  ArrowUpRight,
  Globe,
  Clock,
  Sparkles,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

import { MagneticChar, MagneticCard } from "../components/Magnetic";

function ContactPage() {
  const { i18n } = useLingui();
  const [time, setTime] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const bigTextX = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const bigTextX2 = useTransform(scrollYProgress, [0, 1], [-300, 300]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
          <Trans>CONTACT CONTACT CONTACT</Trans>
        </motion.div>
        <motion.div
          style={{ x: bigTextX2 }}
          className="text-[25vw] font-eight leading-none whitespace-nowrap self-end text-white/5"
        >
          <Trans>PARLONS-EN PARLONS-EN PARLONS-EN</Trans>
        </motion.div>
      </div>

      <div className="relative z-10 px-6 md:px-12 pt-32 pb-24 max-w-[1700px] mx-auto min-h-screen flex flex-col">
        {/* Header */}
        <div className="mb-24">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-primary-500 font-mono text-[10px] uppercase tracking-[0.6em] mb-8 block"
          >
            <Trans>ME CONTACTER</Trans>
          </motion.span>
          <h1 className="text-7xl md:text-[12rem] font-eight text-white tracking-tighter leading-[0.75] mb-12 flex flex-wrap gap-x-[0.2em]">
            {i18n
              ._(t`Travaillons ensemble.`)
              .split(" ")
              .map((word, i) => (
                <span key={i} className="flex whitespace-nowrap">
                  {word.split("").map((c, j) => (
                    <MagneticChar key={j} char={c} range={100} strength={0.4} />
                  ))}
                </span>
              ))}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-auto">
          {/* Email Card - Massive and Central */}
          <div className="lg:col-span-8">
            <MagneticCard className="h-full flex flex-col justify-between min-h-[450px]">
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-primary-400" />
                </div>
                <div className="text-right">
                  <span className="text-primary-400 font-mono text-[10px] tracking-widest uppercase">
                    <Trans>Prêt pour l'aventure ?</Trans>
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-white/20 font-gimbal text-[10px] uppercase tracking-widest mb-6">
                  <Trans>Envoyez-moi un message</Trans>
                </h3>
                <a
                  href="mailto:leeeight71@gmail.com"
                  className="block group relative overflow-hidden"
                >
                  <span className="text-white text-5xl md:text-8xl font-eight tracking-tighter group-hover:text-primary-500 transition-colors duration-500 flex flex-wrap">
                    {"leeeight71@gmail.com".split("").map((c, i) => (
                      <MagneticChar
                        key={i}
                        char={c}
                        range={100}
                        strength={0.4}
                      />
                    ))}
                  </span>
                  <motion.div
                    className="h-px bg-primary-500 mt-4 origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.6, ease: "circOut" }}
                  />
                </a>
              </div>

              <div className="flex items-center gap-4 text-white/40">
                <Sparkles className="w-5 h-5 text-primary-500/50" />
                <p className="text-lg font-outfit">
                  <Trans>
                    Ouvert aux opportunités de collaboration partout dans le
                    monde.
                  </Trans>
                </p>
              </div>
            </MagneticCard>
          </div>

          {/* Socials & Info */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {/* Info Box */}
            <MagneticCard className="flex flex-col gap-10">
              <div className="flex justify-between items-end">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-primary-500">
                    <Globe className="w-4 h-4 translate-y-px" />
                    <span className="text-[10px] font-mono uppercase tracking-widest">
                      <Trans>Localisation</Trans>
                    </span>
                  </div>
                  <span className="text-white text-2xl font-eight uppercase tracking-tighter">
                    Sénégal, Dakar
                  </span>
                </div>
                <div className="flex flex-col items-end gap-2 text-right">
                  <div className="flex items-center gap-2 text-primary-500">
                    <span className="text-[10px] font-mono uppercase tracking-widest">
                      <Trans>Heure Locale</Trans>
                    </span>
                    <Clock className="w-4 h-4 translate-y-px" />
                  </div>
                  <span className="text-white text-2xl font-eight uppercase tracking-tighter">
                    {time.toLocaleTimeString(i18n.locale, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5">
                <p className="text-white/40 font-outfit text-base leading-relaxed">
                  <Trans>
                    Travailler de manière asynchrone permet une meilleure
                    concentration et des résultats plus précis. Contactez-moi
                    par mail pour entamer la discussion.
                  </Trans>
                </p>
              </div>
            </MagneticCard>

            {/* Discrete Socials Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: Linkedin,
                  label: "LinkedIn",
                  href: "https://linkedin.com/in/leemakosso",
                },
                {
                  icon: Github,
                  label: "GitHub",
                  href: "https://github.com/leeeight",
                },
                {
                  icon: Instagram,
                  label: "Insta",
                  href: "https://instagram.com/leeeight",
                },
                {
                  icon: Globe,
                  label: "Dribbble",
                  href: "https://dribbble.com/lee-eight",
                },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col justify-between p-6 rounded-3xl bg-white/2 border border-white/5 hover:border-primary-500/30 transition-all group aspect-square"
                >
                  <social.icon className="w-6 h-6 text-white/20 group-hover:text-primary-400 group-hover:scale-110 transition-all" />
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 font-mono text-[10px] uppercase tracking-widest group-hover:text-white">
                      {social.label}
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-white/10 group-hover:text-primary-400" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay z-50" />
    </div>
  );
}
