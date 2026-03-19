"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS } from "@/lib/types";
import type { Purchase } from "@/lib/types";

function snapshotToPurchases(
  snapshot: QuerySnapshot<DocumentData>
): Purchase[] {
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt,
  })) as Purchase[];
}

export function useAllPurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, COLLECTIONS.purchases),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setPurchases(snapshotToPurchases(snapshot));
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err as Error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  return { purchases, loading, error };
}

export function hasPurchaseForGift(
  purchases: Purchase[],
  giftId: string
): boolean {
  return purchases.some((p) => p.giftId === giftId);
}

export function countPurchasesByGiftId(
  purchases: Purchase[],
  giftId: string
): number {
  return purchases.filter((p) => p.giftId === giftId).length;
}
