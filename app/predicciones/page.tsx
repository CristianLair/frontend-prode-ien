"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Badge, Spinner, ErrorBanner, Card } from "@/components/ui";
import { CountryFlag } from "@/components/country-flag";
import { useRequireAuth } from "@/lib/use-require-auth";
import {
  Prediccion,
  Partido,
  obtenerPrediccionesUsuario,
  obtenerPartidos,
} from "@/lib/api";

export default function PrediccionesPage() {
  const { isLoading: authLoading } = useRequireAuth();
  const [predicciones, setPredicciones] = useState<Prediccion[]>([]);
  const [partidosMap, setPartidosMap] = useState<Record<string, Partido>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    async function cargar() {
      setLoading(true);
      setError(null);
      try {
        const [predRes, partidosRes] = await Promise.all([
          obtenerPrediccionesUsuario(),
          obtenerPartidos(),
        ]);
        setPredicciones(predRes);
        const map: Record<string, Partido> = {};
        for (const p of partidosRes) map[p._id] = p;
        setPartidosMap(map);
      } catch (err) {
        // El backend devuelve 404 si el usuario no tiene predicciones cargadas;
        // lo tratamos como lista vacía, no como error real.
        const msg = err instanceof Error ? err.message : "";
        if (!msg.toLowerCase().includes("no tiene predicciones")) {
          setError(msg || "No se pudieron cargar tus pronósticos");
        }
      } finally {
        setLoading(false);
      }
    }

    cargar();
  }, [authLoading]);

  const totalPuntos = predicciones.reduce(
    (acc, p) => acc + (p.puntos_obtenidos ?? 0),
    0
  );

  if (authLoading) return null;

  return (
    <div className="min-h-screen field-texture">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl">Mis pronósticos</h1>
            <p className="text-[var(--text-muted)] text-sm mt-1">
              Historial de marcadores que pronosticaste.
            </p>
          </div>
          <div className="text-right">
            <p className="font-display font-bold text-3xl tabular-nums text-[var(--primary)]">
              {totalPuntos}
            </p>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
              puntos
            </p>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        )}

        {error && <ErrorBanner message={error} />}

        {!loading && !error && predicciones.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[var(--text-muted)] mb-4">
              Todavía no cargaste ningún pronóstico.
            </p>
            <Link href="/partidos" className="text-[var(--accent)] hover:underline text-sm">
              Ir al fixture →
            </Link>
          </div>
        )}

        {!loading && predicciones.length > 0 && (
          <div className="flex flex-col gap-2">
            {predicciones.map((pred) => {
              const partido = partidosMap[pred.partido_id];
              return (
                <Card key={pred._id} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm flex items-center gap-1.5">
                      {partido ? (
                        <>
                          <CountryFlag country={partido.equipo_local} className="w-4 h-4 rounded-sm bg-cover shrink-0" />
                          <span className="font-medium">{partido.equipo_local}</span>
                          <span className="text-[var(--text-faint)]"> vs </span>
                          <span className="font-medium">{partido.equipo_visitante}</span>
                          <CountryFlag country={partido.equipo_visitante} className="w-4 h-4 rounded-sm bg-cover shrink-0" />
                        </>
                      ) : (
                        <span className="text-[var(--text-faint)]">Partido no encontrado</span>
                      )}
                    </span>
                    <span className="font-mono text-sm text-[var(--text-muted)]">
                      ({pred.goles_local}-{pred.goles_visitante})
                    </span>
                  </div>

                  {pred.procesado ? (
                    <Badge tone={(pred.puntos_obtenidos ?? 0) > 0 ? "success" : "danger"}>
                      {(pred.puntos_obtenidos ?? 0) > 0
                        ? `+${pred.puntos_obtenidos} pts`
                        : "0 pts"}
                    </Badge>
                  ) : (
                    <Badge tone="warning">Pendiente</Badge>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
