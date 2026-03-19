"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ProgressBar } from "./ProgressBar";
import {
  totalApprovedByGiftId,
  countApprovedByGiftId,
} from "@/hooks/useContributions";
import { hasPurchaseForGift, countPurchasesByGiftId } from "@/hooks/usePurchases";
import type { Gift } from "@/lib/types";
import type { Contribution, Purchase } from "@/lib/types";

interface GiftCardProps {
  gift: Gift;
  contributions: Contribution[];
  purchases: Purchase[];
  onAportar?: (gift: Gift) => void;
  onCompre?: (gift: Gift) => void;
}

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80";

export function GiftCard({
  gift,
  contributions,
  purchases,
  onAportar,
  onCompre,
}: GiftCardProps) {
  const isPurchaseType = gift.type === "purchase";
  const isMultipleType = gift.type === "multiple";
  const hasPurchase = hasPurchaseForGift(purchases, gift.id);
  const purchaseCount = countPurchasesByGiftId(purchases, gift.id);
  const totalRaised = totalApprovedByGiftId(contributions, gift.id);
  const contributorCount = countApprovedByGiftId(contributions, gift.id);
  const percentage =
    gift.totalCost > 0 ? (totalRaised / gift.totalCost) * 100 : 0;
  const isComplete = percentage >= 100;

  return (
    <motion.article
      className="bg-disco-blackSoft rounded-2xl shadow-xl overflow-hidden flex flex-col h-full border border-disco-gold/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative aspect-[4/3] bg-disco-black">
        <Image
          src={gift.imageUrl || PLACEHOLDER_IMAGE}
          alt={gift.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <h3 className="font-display text-xl text-disco-goldLight mb-2">
          {gift.name}
        </h3>
        <p className="font-body text-disco-silver text-sm mb-4 flex-1">
          {gift.description}
        </p>

        {isMultipleType ? (
          <div className="space-y-2 mt-auto">
            {purchaseCount > 0 && (
              <p className="font-body text-disco-gold font-medium text-center py-2 mb-2">
                {purchaseCount === 1
                  ? "Ya se ha comprado 1"
                  : `Ya se han comprado ${purchaseCount}`}
              </p>
            )}
            {onCompre && (
              <button
                type="button"
                onClick={() => onCompre(gift)}
                className="w-full rounded-xl bg-disco-gold text-disco-black font-body font-medium py-3 hover:bg-disco-goldLight transition-colors duration-300"
              >
                Compré uno
              </button>
            )}
          </div>
        ) : isPurchaseType ? (
          <>
            {gift.totalCost > 0 && (
              <p className="font-body text-disco-gold font-medium text-sm mb-3">
                Precio: S/ {gift.totalCost.toLocaleString("es-PE")}
              </p>
            )}
            {hasPurchase ? (
              <>
                <p className="font-body text-disco-gold font-medium text-center py-2 mb-2">
                  Comprado ✨
                </p>
                <p className="font-body text-disco-silver text-sm text-center">
                  Este regalo ya fue comprado por uno de los amigos.
                </p>
              </>
            ) : (
              <div className="space-y-2 mt-auto">
                {gift.purchaseLink && (
                  <a
                    href={gift.purchaseLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full rounded-xl border border-disco-gold text-disco-gold font-body font-medium py-3 text-center hover:bg-disco-gold/10 transition-colors duration-300"
                  >
                    Ver en tienda
                  </a>
                )}
                {onCompre && (
                  <button
                    type="button"
                    onClick={() => onCompre(gift)}
                    className="w-full rounded-xl bg-disco-gold text-disco-black font-body font-medium py-3 hover:bg-disco-goldLight transition-colors duration-300"
                  >
                    Lo compré!
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <p className="font-body text-disco-silver text-sm mb-2">
              {contributorCount === 1
                ? "1 persona ha aportado"
                : `${contributorCount} personas han aportado`}
            </p>
            <ProgressBar
              totalCost={gift.totalCost}
              totalRaised={totalRaised}
              className="mb-4"
            />
            {isComplete ? (
              <p className="font-body text-disco-gold font-medium text-center py-2">
                Completado ✨
              </p>
            ) : onAportar ? (
              <button
                type="button"
                onClick={() => onAportar(gift)}
                className="w-full rounded-xl bg-disco-gold text-disco-black font-body font-medium py-3 hover:bg-disco-goldLight transition-colors duration-300"
              >
                Aportar
              </button>
            ) : null}
          </>
        )}
      </div>
    </motion.article>
  );
}
