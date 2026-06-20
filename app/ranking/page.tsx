"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Spinner, ErrorBanner } from "@/components/ui";
import { useRequireAuth } from "@/lib/use-require-auth";
import { useAuth } from "@/lib/auth-context";
import { RankingEntry, obtenerRanking } from "@/lib/api";

export default function RankingPage() {
  const { isLoading: authLoading } = useRequireAuth();
  const { user } = useAuth();
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    async function cargar() {
      setLoading(true);
      setError(null);
      try {
        const res = await obtenerRanking(50);
        setRanking(res.ranking);
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo cargar el ranking");
      } finally {
        setLoading(false);
      }
    }

    cargar();
  }, [authLoading]);

  if (authLoading) return null;

  return (
    <div className="min-h-screen field-texture">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl">Ranking general</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">
            Tabla de posiciones de todos los participantes.
          </p>
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        )}

        {error && <ErrorBanner message={error} />}

        {!loading && !error && ranking.length === 0 && (
          <p className="text-[var(--text-muted)] text-center py-16">
            Todavía no hay puntajes cargados.
          </p>
        )}

        {!loading && ranking.length > 0 && (
          <div className="border border-[var(--border)]">
            {ranking.map((entry, i) => {
     
              const esYo = entry.user === user;
              const posicion = i + 1;
         
              return (
                <div
                key={entry._id}
                className={`flex items-center gap-4 px-4 py-3 border-b border-[var(--border)] last:border-b-0 ${
                  esYo ? "bg-[var(--primary-soft)]" : "bg-[var(--bg-elevated)]"
                }`}
              >
                  <span
                    className={`font-display font-bold text-lg w-8 tabular-nums ${
                      posicion <= 3 ? "text-[var(--primary)]" : "text-[var(--text-faint)]"
                    }`}
                  >
                    {posicion}
                  </span>
                  <span className="flex-1 font-medium">
                    {entry.user}
                    {esYo && (
                      <span className="text-[var(--accent)] text-xs font-mono ml-2">
                        (vos)
                      </span>
                    )}
                  </span>
                  <span className="font-display font-bold tabular-nums text-lg">
                    {entry.puntos}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
