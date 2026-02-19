import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Trans } from "@lingui/macro";

export const NotFound = () => {
  return (
    <div className="min-h-screen w-full bg-[#070b14] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 blur-[120px] rounded-full" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full border-dashed"
        />
      </div>

      <div className="relative z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-[15rem] md:text-[25rem] font-eight text-white/5 leading-none select-none"
        >
          404
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="-mt-20 md:-mt-40"
        >
          <h2 className="text-4xl md:text-6xl font-eight text-white uppercase tracking-tighter mb-6">
            <Trans>Page Perdue</Trans>
          </h2>
          <p className="text-white/40 font-outfit text-lg md:text-xl max-w-md mx-auto mb-12">
            <Trans>
              Il semblerait que vous ayez bifurqué vers un univers numérique
              inexistant.
            </Trans>
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link
              to="/"
              className="flex items-center gap-3 bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-full transition-all group"
            >
              <Home className="w-5 h-5" />
              <span className="font-eight text-sm uppercase tracking-widest">
                <Trans>Retourner à l'accueil</Trans>
              </span>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-full transition-all border border-white/10 hover:border-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-eight text-sm uppercase tracking-widest">
                <Trans>Page précédente</Trans>
              </span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Aesthetic Grain */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay z-50" />
    </div>
  );
};
