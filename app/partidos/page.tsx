"use client";

import { useEffect, useState, useMemo } from "react";
import { Navbar } from "@/components/navbar";
import { MatchCard } from "@/components/match-card";
import { Spinner, ErrorBanner } from "@/components/ui";
import { useRequireAuth } from "@/lib/use-require-auth";
import {
  Partido,
  Prediccion,
  obtenerPartidos,
  obtenerPrediccionesUsuario,
} from "@/lib/api";

export default function PartidosPage() {
  const { isLoading: authLoading } = useRequireAuth();
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [predicciones, setPredicciones] = useState<Record<string, Prediccion>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    async function cargar() {
      setLoading(true);
      setError(null);
      try {
        const [partidosRes, prediccionesRes] = await Promise.all([
          obtenerPartidos(),
          obtenerPrediccionesUsuario().catch(() => []), // puede no tener ninguna
        ]);
        setPartidos(partidosRes);
        const map: Record<string, Prediccion> = {};
        for (const p of prediccionesRes) map[p.partido_id] = p;
        setPredicciones(map);
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudieron cargar los partidos");
      } finally {
        setLoading(false);
      }
    }

    cargar();
  }, [authLoading]);

  const grupos = useMemo(() => {
    const map = new Map<string, Partido[]>();
    for (const p of partidos) {
      const key = p.grupo ?? "Sin grupo";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [partidos]);

  function handlePrediccionGuardada(p: Prediccion) {
    setPredicciones((prev) => ({ ...prev, [p.partido_id]: p }));
  }

  if (authLoading) return null;

  return (
    <div className="min-h-screen field-texture">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl">Fixture</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">
            Cargá tu pronóstico antes de que arranque cada partido.
          </p>
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        )}

        {error && <ErrorBanner message={error} />}

        {!loading && !error && partidos.length === 0 && (
          <p className="text-[var(--text-muted)] text-center py-16">
            Todavía no hay partidos cargados.
          </p>
        )}

        {!loading &&
          grupos.map(([grupo, partidosDelGrupo]) => (
            <section key={grupo} className="mb-10">
              <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--text-faint)] mb-3 pb-2 border-b border-[var(--border)]">
                {grupo}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {partidosDelGrupo.map((partido) => (
                  <MatchCard
                    key={partido._id}
                    partido={partido}
                    prediccion={predicciones[partido._id]}
                    onPrediccionGuardada={handlePrediccionGuardada}
                  />
                ))}
              </div>
            </section>
          ))}
      </main>
    </div>
  );
}
