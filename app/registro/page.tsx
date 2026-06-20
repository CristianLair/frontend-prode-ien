"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button, Input, ErrorBanner } from "@/components/ui";

export default function RegistroPage() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { registro } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      await registro(user, password);
      router.push("/partidos");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la cuenta");
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
            CREAR CUENTA
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
            autoComplete="new-password"
            required
          />
          <Input
            id="confirmPassword"
            label="Repetir contraseña"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />

          <Button type="submit" disabled={loading} fullWidth>
            {loading ? "Creando cuenta…" : "Crear cuenta"}
          </Button>

          <p className="text-center text-xs text-[var(--text-muted)] pt-1">
            ¿Ya tenés cuenta?{" "}
            <Link href="/login" className="text-[var(--accent)] hover:underline">
              Iniciá sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
