"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { DiscoBall } from "./decorations/DiscoBall";
import { Sparkles } from "./decorations/Sparkles";

export function Hero() {
  return (
    <section className="hero-section relative flex flex-col items-center justify-center overflow-hidden bg-disco-black">
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/atmo-67f01.firebasestorage.app/o/popipo.jpg?alt=media&token=7c99a440-03b7-46fe-977b-a92f1ae7eb5e"
          alt="Cumpleaños de Sofía"
          fill
          className="object-cover md:object-contain"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-disco-black/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-disco-black/30 via-transparent to-disco-black/60" />
      </motion.div>

      {/* SVG decorations */}
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-10 opacity-60">
        <DiscoBall className="w-16 h-16 sm:w-24 sm:h-24" />
      </div>
      <div className="absolute top-6 left-4 sm:top-12 sm:left-8 z-10">
        <Sparkles className="w-12 h-12 sm:w-16 sm:h-16" />
      </div>
      <div className="absolute bottom-20 right-6 sm:bottom-24 sm:right-12 z-10">
        <Sparkles className="w-10 h-10 sm:w-14 sm:h-14 scale-x-[-1]" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        <motion.p
          className="font-display text-disco-goldLight text-sm sm:text-base tracking-[0.3em] uppercase mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Mi cumpleaños
        </motion.p>
        <motion.h1
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-disco-goldLight font-medium tracking-tight"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          Sofía
        </motion.h1>
        <motion.p
          className="font-body text-disco-silver text-lg sm:text-xl mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          23 de Marzo
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-10"
        >
          <a
            href="#lista"
            className="inline-block rounded-full bg-disco-gold text-disco-black font-body font-medium px-8 py-3 shadow-lg hover:bg-disco-goldLight hover:text-disco-black transition-colors duration-300"
          >
            Mi lista de deseos
          </a>
        </motion.div>
      </div>
    </section>
  );
}
