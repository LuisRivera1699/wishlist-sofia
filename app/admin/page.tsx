"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { GiftsAdmin } from "@/components/admin/GiftsAdmin";
import { ContributionsTable } from "@/components/admin/ContributionsTable";
import { PurchasesTable } from "@/components/admin/PurchasesTable";

export default function AdminPage() {
  const { user, signOut, isAdmin } = useAuth();

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-disco-black">
      <header className="bg-disco-blackSoft border-b border-disco-gold/30 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="font-display text-xl text-disco-gold">
            Panel Admin
          </h1>
          <div className="flex items-center gap-4">
            <span className="font-body text-sm text-disco-silver">
              {user?.email}
            </span>
            <Link
              href="/"
              className="font-body text-sm text-disco-gold hover:underline"
            >
              Ver web
            </Link>
            <button
              type="button"
              onClick={() => signOut()}
              className="font-body text-sm text-disco-silver hover:text-disco-goldLight"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        <GiftsAdmin />
        <section>
          <h2 className="font-display text-2xl text-disco-gold mb-4">
            Aportes
          </h2>
          <ContributionsTable />
        </section>
        <section>
          <h2 className="font-display text-2xl text-disco-gold mb-4">
            Compras directas
          </h2>
          <PurchasesTable />
        </section>
      </main>
    </div>
  );
}
