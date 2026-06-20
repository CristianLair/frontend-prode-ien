"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const links = [
  { href: "/partidos", label: "Fixture" },
  { href: "/predicciones", label: "Mis pronósticos" },
  { href: "/ranking", label: "Ranking" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-[var(--border)] bg-[var(--bg-elevated)]">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/partidos" className="font-display font-bold text-lg tracking-tight">
            PRODE<span className="text-[var(--primary)]">IEN</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "text-[var(--primary)] border-b-2 border-[var(--primary)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-[var(--text-muted)] font-mono hidden sm:inline">
              {user}
            </span>
          )}
          <button
            onClick={logout}
            className="text-xs uppercase tracking-wide text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors"
          >
            Salir
          </button>
        </div>
      </div>
      {/* Nav mobile */}
      <nav className="sm:hidden flex border-t border-[var(--border)]">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex-1 text-center py-2.5 text-xs font-medium uppercase tracking-wide ${
                active
                  ? "text-[var(--primary)] bg-[var(--primary-soft)]"
                  : "text-[var(--text-muted)]"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
