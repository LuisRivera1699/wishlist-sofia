"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { storage, db } from "@/lib/firebase";
import { COLLECTIONS } from "@/lib/types";
import {
  contributionFormSchema,
  type ContributionFormData,
} from "@/lib/contributionSchema";
import type { Gift } from "@/lib/types";

interface ContributionModalProps {
  gift: Gift;
  onClose: () => void;
}

export function ContributionModal({ gift, onClose }: ContributionModalProps) {
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContributionFormData>({
    resolver: zodResolver(contributionFormSchema),
    defaultValues: {
      name: "",
      amount: undefined,
      paymentMethod: undefined,
      proof: undefined,
      message: "",
    },
  });

  async function onSubmit(data: ContributionFormData) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const file = data.proof[0];
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const path = `wishlist_proofs/${timestamp}_${safeName}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const proofImageUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, COLLECTIONS.contributions), {
        name: data.name.trim(),
        amount: Number(data.amount),
        paymentMethod: data.paymentMethod,
        proofImageUrl,
        status: "pending",
        giftId: gift.id,
        message: (data.message ?? "").trim() || undefined,
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Error al enviar. Intenta de nuevo.",
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
                Aportar a: {gift.name}
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
                  Gracias por tu aporte 💙
                </p>
                <p className="font-body text-disco-silver mt-2">
                  Validaremos tu comprobante pronto.
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
              <>
                <p className="font-body text-disco-silver mb-4">
                  Puedes realizar tu aporte mediante:
                </p>
                <ul className="bg-disco-black rounded-xl p-4 mb-6 space-y-3 font-body text-disco-goldLight text-sm border border-disco-gold/20">
                  <li>
                    <strong>Yape/Plin Sofía:</strong> 955170938
                  </li>
                  <li>
                    <strong>Yape/Plin Luis:</strong> 957329602
                  </li>
                  <li>
                    <strong>Interbank Soles:</strong>
                    <br />
                    N° de cuenta: 8983271089114
                    <br />
                    CCI: 00389801327108911445
                  </li>
                  <li>
                    <strong>Interbank dólares:</strong>
                    <br />
                    N° de cuenta: 2893407312123
                    <br />
                    CCI: 00328901340731212365
                  </li>
                </ul>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block font-body text-sm font-medium text-disco-goldLight mb-1"
                    >
                      Nombre
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...register("name")}
                      className="w-full rounded-xl border border-disco-silver/30 bg-disco-blackSoft border-disco-silver/20 px-4 py-2 font-body text-disco-goldLight placeholder:text-disco-silver/60 focus:border-disco-gold focus:outline-none focus:ring-1 focus:ring-disco-gold"
                      placeholder="Tu nombre"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="amount"
                      className="block font-body text-sm font-medium text-disco-goldLight mb-1"
                    >
                      Monto depositado (S/)
                    </label>
                    <input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      {...register("amount", { valueAsNumber: true })}
                      className="w-full rounded-xl border border-disco-silver/30 bg-disco-blackSoft border-disco-silver/20 px-4 py-2 font-body text-disco-goldLight placeholder:text-disco-silver/60 focus:border-disco-gold focus:outline-none focus:ring-1 focus:ring-disco-gold"
                      placeholder="0.00"
                    />
                    {errors.amount && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.amount.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="paymentMethod"
                      className="block font-body text-sm font-medium text-disco-goldLight mb-1"
                    >
                      Método usado
                    </label>
                    <select
                      id="paymentMethod"
                      {...register("paymentMethod")}
                      className="w-full rounded-xl border border-disco-silver/30 bg-disco-blackSoft border-disco-silver/20 px-4 py-2 font-body text-disco-goldLight placeholder:text-disco-silver/60 focus:border-disco-gold focus:outline-none focus:ring-1 focus:ring-disco-gold"
                    >
                      <option value="">Elige una opción</option>
                      <option value="Yape Sofía">Yape Sofía</option>
                      <option value="Yape Luis">Yape Luis</option>
                      <option value="Interbank Soles">Interbank Soles</option>
                      <option value="Interbank dólares">
                        Interbank dólares
                      </option>
                    </select>
                    {errors.paymentMethod && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.paymentMethod.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="proof"
                      className="block font-body text-sm font-medium text-disco-goldLight mb-1"
                    >
                      Comprobante de pago
                    </label>
                    <input
                      id="proof"
                      type="file"
                      accept="image/*"
                      {...register("proof")}
                      className="w-full rounded-xl border border-disco-silver/30 bg-disco-blackSoft border-disco-silver/20 px-4 py-2 font-body text-disco-goldLight placeholder:text-disco-silver/60 text-sm file:mr-2 file:rounded-lg file:border-0 file:bg-disco-gold file:px-3 file:py-1 file:text-disco-goldLight"
                    />
                    {errors.proof && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.proof.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block font-body text-sm font-medium text-disco-goldLight mb-1"
                    >
                      Nota o mensaje (opcional)
                    </label>
                    <textarea
                      id="message"
                      rows={2}
                      {...register("message")}
                      className="w-full rounded-xl border border-disco-silver/30 bg-disco-black px-4 py-2 font-body text-disco-goldLight placeholder:text-disco-silver/60 focus:border-disco-gold focus:outline-none focus:ring-1 focus:ring-disco-gold resize-none"
                      placeholder="Un mensaje para acompañar tu aporte..."
                    />
                  </div>

                  {submitError && (
                    <p className="text-sm text-red-600">{submitError}</p>
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
                      {submitting ? "Enviando..." : "Enviar aporte"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
