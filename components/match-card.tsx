"use client";

import { useState } from "react";
import { Partido, Prediccion, predecirPartido } from "@/lib/api";
import { Badge, Button } from "@/components/ui";
import { CountryFlag } from "@/components/country-flag";

interface MatchCardProps {
  partido: Partido;
  prediccion?: Prediccion;
  onPrediccionGuardada: (p: Prediccion) => void;
}

function formatFecha(fecha: string): string {
  const [fechaParte, horaParte] = fecha.split(" ");
  if (!fechaParte || !horaParte) return fecha;

  const [, mes, dia] = fechaParte.split("-");
  return `${dia}/${mes} · ${horaParte}hs`;
}

function haComenzado(fecha: string): boolean {
  const [fechaParte, horaParte] = fecha.split(" ");
  if (!fechaParte || !horaParte) return false;

  const isoArgentina = `${fechaParte}T${horaParte}:00-03:00`;
  const fechaPartido = new Date(isoArgentina);

  if (isNaN(fechaPartido.getTime())) return false;

  return new Date() >= fechaPartido;
}

export function MatchCard({
  partido,
  prediccion,
  onPrediccionGuardada,
}: MatchCardProps) {
  const [golesLocal, setGolesLocal] = useState(
    prediccion?.goles_local?.toString() ?? ""
  );

  const [golesVisitante, setGolesVisitante] = useState(
    prediccion?.goles_visitante?.toString() ?? ""
  );

  const [editing, setEditing] = useState(!prediccion);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bloqueado = partido.finalizado || haComenzado(partido.fecha);

  async function handleGuardar() {
    setError(null);

    const gl = parseInt(golesLocal, 10);
    const gv = parseInt(golesVisitante, 10);

    if (isNaN(gl) || isNaN(gv) || gl < 0 || gv < 0) {
      setError("Ingresá un marcador válido");
      return;
    }

    setSaving(true);

    try {
      const nueva = await predecirPartido(partido._id, gl, gv);
      onPrediccionGuardada(nueva);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-[var(--bg-elevated)] border border-[var(--border)]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-input)]">
        <span className="text-xs font-mono text-[var(--text-muted)] uppercase">
          {partido.grupo ?? "Fixture"}
        </span>

        <span className="text-xs font-mono text-[var(--text-muted)]">
          {formatFecha(partido.fecha)}
        </span>
      </div>

      <div className="px-4 py-5">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex items-center justify-end gap-2 min-w-0">
            <span className="font-display font-bold text-lg md:text-xl text-right">
              {partido.equipo_local}
            </span>

            <CountryFlag
              country={partido.equipo_local}
              className="w-6 h-6 rounded-sm bg-cover shrink-0"
            />
          </div>

          {partido.finalizado ? (
            <div className="font-display font-bold text-3xl tabular-nums tracking-tight px-2">
              {partido.goles_local} : {partido.goles_visitante}
            </div>
          ) : (
            <div className="font-display font-bold text-2xl tabular-nums tracking-tight text-[var(--text-faint)] px-2">
              VS
            </div>
          )}

          <div className="flex items-center gap-2 min-w-0">
            <CountryFlag
              country={partido.equipo_visitante}
              className="w-6 h-6 rounded-sm bg-cover shrink-0"
            />

            <span className="font-display font-bold text-lg md:text-xl">
              {partido.equipo_visitante}
            </span>
          </div>
        </div>

        {partido.finalizado && (
          <div className="text-center mt-3">
            <Badge tone="neutral">Finalizado</Badge>
          </div>
        )}
      </div>

      <div className="border-t border-[var(--border)] px-4 py-4">
        {error && (
          <p className="text-xs text-[var(--danger)] mb-2">{error}</p>
        )}

        {bloqueado && !prediccion && (
          <p className="text-xs text-[var(--text-faint)] text-center py-1">
            Ya no se pueden cargar pronósticos para este partido.
          </p>
        )}

        {bloqueado && prediccion && !editing ? (
          <PrediccionResumen prediccion={prediccion} />
        ) : !bloqueado && editing ? (
          <div className="space-y-5">
            <div className="grid grid-cols-3 items-center mt-2">
              <div className="flex justify-center">
                <input
                  type="number"
                  min={0}
                  max={20}
                  inputMode="numeric"
                  value={golesLocal}
                  onChange={(e) => setGolesLocal(e.target.value)}
                  className="score-input w-16 h-12 text-center bg-[var(--bg-input)] border border-[var(--border-strong)] font-mono text-lg tabular-nums focus:border-[var(--accent)] outline-none"
                />
              </div>

              <div className="flex justify-center">
                <span className="text-[var(--text-faint)] font-display text-xl">
                  -
                </span>
              </div>

              <div className="flex justify-center">
                <input
                  type="number"
                  min={0}
                  max={20}
                  inputMode="numeric"
                  value={golesVisitante}
                  onChange={(e) => setGolesVisitante(e.target.value)}
                  className="score-input w-16 h-12 text-center bg-[var(--bg-input)] border border-[var(--border-strong)] font-mono text-lg tabular-nums focus:border-[var(--accent)] outline-none"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                variant="primary"
                onClick={handleGuardar}
                disabled={saving}
                className="min-w-[180px]"
              >
                {saving ? "Guardando…" : "Pronosticar"}
              </Button>
            </div>
          </div>
        ) : !bloqueado && prediccion ? (
          <div className="flex items-center justify-between">
            <PrediccionResumen prediccion={prediccion} />

            <button
              onClick={() => setEditing(true)}
              className="text-xs text-[var(--accent)] hover:underline"
            >
              Editar
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function PrediccionResumen({
  prediccion,
}: {
  prediccion: Prediccion;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-[var(--text-muted)]">Tu pronóstico:</span>

      <span className="font-mono font-semibold">
        {prediccion.goles_local} - {prediccion.goles_visitante}
      </span>

      {prediccion.procesado &&
        prediccion.puntos_obtenidos !== null && (
          <Badge
            tone={
              prediccion.puntos_obtenidos > 0
                ? "success"
                : "danger"
            }
          >
            {prediccion.puntos_obtenidos > 0
              ? `+${prediccion.puntos_obtenidos} pts`
              : "0 pts"}
          </Badge>
        )}
    </div>
  );
}