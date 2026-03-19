"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { storage, db } from "@/lib/firebase";
import { COLLECTIONS } from "@/lib/types";
import type { Gift } from "@/lib/types";

const giftSchema = z
  .object({
    name: z.string().min(1, "Nombre requerido"),
    description: z.string().min(1, "Descripción requerida"),
    type: z.enum(["contribution", "purchase"]),
    totalCost: z.number().min(0),
    purchaseLink: z.string().url().optional().or(z.literal("")),
    image: z
      .custom<FileList>()
      .optional()
      .refine(
        (files) => !files?.length || files[0]?.type?.startsWith("image/"),
        "Debe ser una imagen"
      ),
  })
  .refine(
    (data) =>
      data.type !== "contribution" || data.totalCost > 0,
    { message: "El costo debe ser mayor a 0 para aportes", path: ["totalCost"] }
  );

type GiftFormData = z.infer<typeof giftSchema>;

interface GiftFormModalProps {
  gift?: Gift | null;
  onClose: () => void;
  onSaved: () => void;
}

export function GiftFormModal({
  gift,
  onClose,
  onSaved,
}: GiftFormModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!gift;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<GiftFormData>({
    resolver: zodResolver(giftSchema),
    defaultValues: gift
      ? {
          name: gift.name,
          description: gift.description,
          totalCost: gift.totalCost,
          type: gift.type ?? "contribution",
          purchaseLink: gift.purchaseLink ?? "",
        }
      : { type: "contribution", purchaseLink: "" },
  });

  const giftType = watch("type");

  async function onSubmit(data: GiftFormData) {
    if (!isEdit && (!data.image?.length || !data.image[0])) {
      setError("Sube una imagen para el regalo");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      let imageUrl = gift?.imageUrl ?? "";

      if (data.image?.length && data.image[0]) {
        const file = data.image[0];
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const path = `wishlist_gifts/${timestamp}_${safeName}`;
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(storageRef);
      }

      const payload = {
        name: data.name.trim(),
        description: data.description.trim(),
        totalCost: Number(data.totalCost),
        imageUrl,
        type: data.type,
        purchaseLink: data.type === "purchase" && data.purchaseLink?.trim()
          ? data.purchaseLink.trim()
          : null,
      };

      if (isEdit && gift) {
        await updateDoc(doc(db, COLLECTIONS.gifts, gift.id), {
          ...payload,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, COLLECTIONS.gifts), {
          ...payload,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al guardar. Intenta de nuevo."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-disco-deep/50">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-disco-cream rounded-2xl shadow-xl p-6">
        <h3 className="font-display text-xl text-disco-deep mb-4">
          {isEdit ? "Editar regalo" : "Nuevo regalo"}
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block font-body text-sm font-medium text-disco-deep mb-1">
              Nombre
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full rounded-xl border border-disco-gray/30 bg-white px-4 py-2 font-body text-disco-deep"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block font-body text-sm font-medium text-disco-deep mb-1">
              Tipo
            </label>
            <select
              {...register("type")}
              className="w-full rounded-xl border border-disco-gray/30 bg-white px-4 py-2 font-body text-disco-deep"
            >
              <option value="contribution">Aporte (varios aportan)</option>
              <option value="purchase">Compra directa (un amigo compra)</option>
            </select>
          </div>
          {giftType === "purchase" && (
            <div>
              <label className="block font-body text-sm font-medium text-disco-deep mb-1">
                Link de compra (opcional)
              </label>
              <input
                type="url"
                {...register("purchaseLink")}
                placeholder="https://..."
                className="w-full rounded-xl border border-disco-gray/30 bg-white px-4 py-2 font-body text-disco-deep"
              />
              {errors.purchaseLink && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.purchaseLink.message}
                </p>
              )}
            </div>
          )}
          <div>
            <label className="block font-body text-sm font-medium text-disco-deep mb-1">
              Descripción
            </label>
            <textarea
              rows={3}
              {...register("description")}
              className="w-full rounded-xl border border-disco-gray/30 bg-white px-4 py-2 font-body text-disco-deep"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>
          <div>
            <label className="block font-body text-sm font-medium text-disco-deep mb-1">
              Costo total (S/)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register("totalCost", { valueAsNumber: true })}
              className="w-full rounded-xl border border-disco-gray/30 bg-white px-4 py-2 font-body text-disco-deep"
            />
            {errors.totalCost && (
              <p className="mt-1 text-sm text-red-600">
                {errors.totalCost.message}
              </p>
            )}
          </div>
          <div>
            <label className="block font-body text-sm font-medium text-disco-deep mb-1">
              Imagen {isEdit && "(dejar vacío para mantener la actual)"}
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("image")}
              className="w-full rounded-xl border border-disco-gray/30 bg-white px-4 py-2 font-body text-sm"
            />
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
            )}
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-disco-gray/40 text-disco-deep font-body py-3"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-xl bg-disco-deep text-disco-cream font-body py-3 disabled:opacity-60"
            >
              {submitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
