"use client";

import { motion } from "framer-motion";
import { GeometricStrip } from "./decorations/GeometricStrip";
import { Sparkles } from "./decorations/Sparkles";

export function ExplanatorySection() {
  return (
    <motion.section
      id="explicacion"
      className="relative py-20 sm:py-28 px-4 bg-disco-blackSoft overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <GeometricStrip className="absolute top-0 left-0 right-0 h-1 opacity-60" />
      <GeometricStrip className="absolute bottom-0 left-0 right-0 h-1 opacity-60 rotate-180" />
      <Sparkles className="absolute top-4 left-4 w-12 h-12 opacity-50" />
      <Sparkles className="absolute top-4 right-4 w-12 h-12 opacity-50 scale-x-[-1]" />
      <div className="relative max-w-2xl mx-auto text-center">
        <p className="font-body text-disco-silver text-lg sm:text-xl leading-relaxed">
          Para mi cumpleaños preparé una lista de cosas que me encantaría recibir.
          Si quieres regalarme algo, puedes hacer tu aporte aquí ✨
        </p>
      </div>
    </motion.section>
  );
}
