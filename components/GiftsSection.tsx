"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGifts } from "@/hooks/useGifts";
import { useApprovedContributions } from "@/hooks/useContributions";
import { useAllPurchases } from "@/hooks/usePurchases";
import { GiftCard } from "./GiftCard";
import { ContributionModal } from "./ContributionModal";
import { PurchaseModal } from "./PurchaseModal";
import { StarBurst } from "./decorations/StarBurst";
import type { Gift } from "@/lib/types";

export function GiftsSection() {
  const { gifts, loading, error } = useGifts();
  const { contributions } = useApprovedContributions();
  const { purchases } = useAllPurchases();
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [selectedGiftForPurchase, setSelectedGiftForPurchase] =
    useState<Gift | null>(null);

  function handleAportar(gift: Gift) {
    if (gift.type === "purchase") {
      setSelectedGiftForPurchase(gift);
    } else {
      setSelectedGift(gift);
    }
  }

  function handleCompre(gift: Gift) {
    setSelectedGiftForPurchase(gift);
  }

  return (
    <section
      id="lista"
      className="relative py-20 sm:py-28 px-4 bg-disco-black overflow-hidden"
    >
      <StarBurst
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.03] pointer-events-none"
        aria-hidden
      />
      <div className="relative max-w-6xl mx-auto">
        <motion.h2
          className="font-display text-3xl sm:text-4xl text-disco-gold text-center mb-12"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          Mi lista de deseos
        </motion.h2>

        {loading && (
          <p className="text-center font-body text-disco-silver">
            Cargando lista...
          </p>
        )}
        {error && (
          <p className="text-center font-body text-red-500">
            No pudimos cargar los regalos. Revisa tu conexión.
          </p>
        )}
        {!loading && !error && gifts.length === 0 && (
          <p className="text-center font-body text-disco-silver">
            Pronto agregaré mis deseos aquí.
          </p>
        )}
        {!loading && !error && gifts.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gifts.map((gift) => (
              <GiftCard
                key={gift.id}
                gift={gift}
                contributions={contributions}
                purchases={purchases}
                onAportar={handleAportar}
                onCompre={handleCompre}
              />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedGift && (
          <ContributionModal
            gift={selectedGift}
            onClose={() => setSelectedGift(null)}
          />
        )}
        {selectedGiftForPurchase && (
          <PurchaseModal
            gift={selectedGiftForPurchase}
            onClose={() => setSelectedGiftForPurchase(null)}
            onSuccess={() => setSelectedGiftForPurchase(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
