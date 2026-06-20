"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { resetPassword } from "@/lib/api";
import { Button, Input, ErrorBanner } from "@/components/ui";

export default function ResetPasswordPage() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await resetPassword(user, password);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cambiar la contraseña");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen field-texture flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-display font-bold text-4xl tracking-tight">
            PRODE<span className="text-[var(--primary)]">IEN</span>
          </h1>
          <p className="text-[var(--text-muted)] text-sm mt-2 font-mono">
            RECUPERAR CONTRASEÑA
          </p>
        </div>

        <div className="bg-[var(--bg-elevated)] border border-[var(--border)] p-8 flex flex-col gap-5">
          {success ? (
            <>
              <p className="text-[var(--success)] text-sm">
                Tu contraseña se actualizó correctamente.
              </p>
              <Link href="/login">
                <Button fullWidth>Volver a iniciar sesión</Button>
              </Link>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {error && <ErrorBanner message={error} />}

              <Input
                id="user"
                label="Usuario"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                autoComplete="username"
                required
              />
              <Input
                id="password"
                label="Nueva contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />

              <Button type="submit" disabled={loading} fullWidth>
                {loading ? "Actualizando…" : "Cambiar contraseña"}
              </Button>

              <p className="text-center text-xs text-[var(--text-muted)] pt-1">
                <Link href="/login" className="text-[var(--accent)] hover:underline">
                  Volver a iniciar sesión
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
