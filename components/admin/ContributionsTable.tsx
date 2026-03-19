"use client";

import { useState } from "react";
import Image from "next/image";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS } from "@/lib/types";
import { useAllContributions } from "@/hooks/useContributions";
import { useGifts } from "@/hooks/useGifts";
import type { Contribution } from "@/lib/types";
import type { ContributionStatus } from "@/lib/types";

function StatusBadge({ status }: { status: ContributionStatus }) {
  const styles = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };
  const labels = {
    pending: "Pendiente",
    approved: "Aprobado",
    rejected: "Rechazado",
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

export function ContributionsTable() {
  const { contributions, loading } = useAllContributions();
  const { gifts } = useGifts();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const getGiftName = (giftId: string) =>
    gifts.find((g) => g.id === giftId)?.name ?? giftId;

  async function updateStatus(id: string, status: ContributionStatus) {
    setUpdatingId(id);
    try {
      await updateDoc(doc(db, COLLECTIONS.contributions, id), { status });
    } finally {
      setUpdatingId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar este aporte?")) return;
    setUpdatingId(id);
    try {
      await deleteDoc(doc(db, COLLECTIONS.contributions, id));
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return <p className="font-body text-disco-gray">Cargando aportes...</p>;
  }

  if (contributions.length === 0) {
    return (
      <p className="font-body text-disco-gray">No hay aportes registrados.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-disco-gray/20">
      <table className="w-full font-body text-sm">
        <thead className="bg-disco-beige/50">
          <tr>
            <th className="text-left p-3 text-disco-deep font-medium">
              Nombre
            </th>
            <th className="text-left p-3 text-disco-deep font-medium">
              Regalo
            </th>
            <th className="text-left p-3 text-disco-deep font-medium">
              Monto
            </th>
            <th className="text-left p-3 text-disco-deep font-medium">
              Método
            </th>
            <th className="text-left p-3 text-disco-deep font-medium">
              Comprobante
            </th>
            <th className="text-left p-3 text-disco-deep font-medium">
              Fecha
            </th>
            <th className="text-left p-3 text-disco-deep font-medium">
              Estado
            </th>
            <th className="text-left p-3 text-disco-deep font-medium">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-disco-gray/10">
          {contributions.map((c: Contribution) => (
            <tr key={c.id} className="bg-disco-cream hover:bg-disco-beige/30">
              <td className="p-3 text-neutral-800 font-medium">{c.name}</td>
              <td className="p-3 text-neutral-700">{getGiftName(c.giftId)}</td>
              <td className="p-3 text-neutral-800 font-medium">
                S/ {c.amount.toLocaleString("es-PE")}
              </td>
              <td className="p-3 text-neutral-700">{c.paymentMethod}</td>
              <td className="p-3">
                <a
                  href={c.proofImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-800 font-medium hover:underline hover:text-neutral-600"
                >
                  Ver
                </a>
                <span className="mx-1">|</span>
                <span className="inline-block relative w-10 h-10">
                  <Image
                    src={c.proofImageUrl}
                    alt="Comprobante"
                    fill
                    className="object-cover rounded"
                    sizes="40px"
                  />
                </span>
              </td>
              <td className="p-3 text-neutral-700">
                {c.createdAt?.toDate?.()
                  ? new Date(c.createdAt.toDate()).toLocaleDateString("es-PE")
                  : "—"}
              </td>
              <td className="p-3">
                <StatusBadge status={c.status} />
              </td>
              <td className="p-3">
                <div className="flex flex-wrap gap-1">
                  {c.status !== "approved" && (
                    <button
                      type="button"
                      onClick={() => updateStatus(c.id, "approved")}
                      disabled={updatingId === c.id}
                      className="text-green-700 font-medium hover:underline text-xs disabled:opacity-50"
                    >
                      Aprobar
                    </button>
                  )}
                  {c.status !== "rejected" && (
                    <button
                      type="button"
                      onClick={() => updateStatus(c.id, "rejected")}
                      disabled={updatingId === c.id}
                      className="text-amber-700 font-medium hover:underline text-xs disabled:opacity-50"
                    >
                      Rechazar
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(c.id)}
                    disabled={updatingId === c.id}
                    className="text-red-700 font-medium hover:underline text-xs disabled:opacity-50"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
