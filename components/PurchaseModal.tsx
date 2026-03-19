"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS } from "@/lib/types";
import {
  purchaseFormSchema,
  type PurchaseFormData,
} from "@/lib/purchaseSchema";
import type { Gift } from "@/lib/types";

interface PurchaseModalProps {
  gift: Gift;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PurchaseModal({
  gift,
  onClose,
  onSuccess,
}: PurchaseModalProps) {
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: { name: "", message: "" },
  });

  async function onSubmit(data: PurchaseFormData) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await addDoc(collection(db, COLLECTIONS.purchases), {
        giftId: gift.id,
        name: data.name.trim(),
        message: (data.message ?? "").trim(),
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
      onSuccess?.();
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Error al enviar. Intenta de nuevo."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-disco-black/80" aria-hidden />
        <motion.div
          className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-disco-blackSoft rounded-2xl shadow-xl border border-disco-gold/40"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 sm:p-8">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-display text-xl text-disco-goldLight">
                {gift.type === "multiple"
                  ? `Compré uno: ${gift.name}`
                  : `Lo compré: ${gift.name}`}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="text-disco-silver hover:text-disco-goldLight transition-colors"
                aria-label="Cerrar"
              >
                <span className="text-2xl leading-none">&times;</span>
              </button>
            </div>

            {success ? (
              <div className="text-center py-8">
                <p className="font-body text-disco-goldLight text-lg">
                  Gracias por registrarte ✨
                </p>
                <p className="font-body text-disco-silver mt-2">
                  {gift.type === "multiple"
                    ? "Tu compra ha sido registrada."
                    : "El regalo aparecerá como comprado."}
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-6 rounded-xl bg-disco-gold text-disco-black font-body font-medium px-6 py-2 hover:bg-disco-goldLight transition-colors"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="purchase-name"
                    className="block font-body text-sm font-medium text-disco-goldLight mb-1"
                  >
                    Tu nombre
                  </label>
                  <input
                    id="purchase-name"
                    type="text"
                    {...register("name")}
                    className="w-full rounded-xl border border-disco-silver/30 bg-disco-black px-4 py-2 font-body text-disco-goldLight placeholder:text-disco-silver/60 focus:border-disco-gold focus:outline-none focus:ring-1 focus:ring-disco-gold"
                    placeholder="Tu nombre"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="purchase-message"
                    className="block font-body text-sm font-medium text-disco-goldLight mb-1"
                  >
                    Mensaje (opcional)
                  </label>
                  <textarea
                    id="purchase-message"
                    rows={3}
                    {...register("message")}
                    className="w-full rounded-xl border border-disco-silver/30 bg-disco-black px-4 py-2 font-body text-disco-goldLight placeholder:text-disco-silver/60 focus:border-disco-gold focus:outline-none focus:ring-1 focus:ring-disco-gold resize-none"
                    placeholder="Un mensaje para Sofía..."
                  />
                </div>
                {submitError && (
                  <p className="text-sm text-red-500">{submitError}</p>
                )}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 rounded-xl border border-disco-silver/40 text-disco-goldLight font-body font-medium py-3 hover:bg-disco-blackSoft transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-xl bg-disco-gold text-disco-black font-body font-medium py-3 hover:bg-disco-goldLight transition-colors disabled:opacity-60"
                  >
                    {submitting ? "Enviando..." : "Confirmar"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
