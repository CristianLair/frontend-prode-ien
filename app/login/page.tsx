"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button, Input, ErrorBanner } from "@/components/ui";

export default function LoginPage() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(user, password);
      router.push("/partidos");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión");
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
            MUNDIAL 2026 · PRONÓSTICOS
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[var(--bg-elevated)] border border-[var(--border)] p-8 flex flex-col gap-5"
        >
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
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <Button type="submit" disabled={loading} fullWidth>
            {loading ? "Ingresando…" : "Acceder"}
          </Button>

          <div className="flex justify-between text-xs text-[var(--text-muted)] pt-1">
            <Link href="/reset-password" className="hover:text-[var(--accent)]">
              Olvidé mi contraseña
            </Link>
            <Link href="/registro" className="hover:text-[var(--accent)]">
              Crear cuenta
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
