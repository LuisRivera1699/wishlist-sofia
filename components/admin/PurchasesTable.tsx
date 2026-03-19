"use client";

import { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS } from "@/lib/types";
import { useAllPurchases } from "@/hooks/usePurchases";
import { useGifts } from "@/hooks/useGifts";
import type { Purchase } from "@/lib/types";

export function PurchasesTable() {
  const { purchases, loading } = useAllPurchases();
  const { gifts } = useGifts();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getGiftName = (giftId: string) =>
    gifts.find((g) => g.id === giftId)?.name ?? giftId;

  async function remove(id: string) {
    if (!confirm("¿Eliminar este registro de compra?")) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, COLLECTIONS.purchases, id));
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return <p className="font-body text-disco-gray">Cargando compras...</p>;
  }

  if (purchases.length === 0) {
    return (
      <p className="font-body text-disco-gray">
        No hay compras directas registradas.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-disco-gray/20">
      <table className="w-full font-body text-sm">
        <thead className="bg-disco-beige/50">
          <tr>
            <th className="text-left p-3 text-disco-deep font-medium">
              Regalo
            </th>
            <th className="text-left p-3 text-disco-deep font-medium">
              Nombre
            </th>
            <th className="text-left p-3 text-disco-deep font-medium">
              Mensaje
            </th>
            <th className="text-left p-3 text-disco-deep font-medium">
              Fecha
            </th>
            <th className="text-left p-3 text-disco-deep font-medium">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-disco-gray/10">
          {purchases.map((p: Purchase) => (
            <tr key={p.id} className="bg-disco-cream hover:bg-disco-beige/30">
              <td className="p-3 text-neutral-800 font-medium">{getGiftName(p.giftId)}</td>
              <td className="p-3 text-neutral-700">{p.name}</td>
              <td className="p-3 text-neutral-700 max-w-xs truncate">
                {p.message || "—"}
              </td>
              <td className="p-3 text-neutral-700">
                {p.createdAt?.toDate?.()
                  ? new Date(p.createdAt.toDate()).toLocaleDateString("es-PE")
                  : "—"}
              </td>
              <td className="p-3">
                <button
                  type="button"
                  onClick={() => remove(p.id)}
                  disabled={deletingId === p.id}
                  className="text-red-700 font-medium hover:underline text-xs disabled:opacity-50"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
