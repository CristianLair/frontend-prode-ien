import { getCountryCode } from "@/lib/country-flags";

interface CountryFlagProps {
  country: string;
  className?: string;
}

/**
 * Renderiza la bandera del país usando flag-icons (clases fi fi-{codigo}).
 * Si el nombre no matchea ningún país conocido, muestra un placeholder
 * neutro en vez de romper o dejar un hueco vacío.
 */
export function CountryFlag({ country, className = "" }: CountryFlagProps) {
  const code = getCountryCode(country);

  if (!code) {
    return (
      <span
        className={`inline-block w-5 h-5 bg-[var(--border-strong)] rounded-full ${className}`}
        title={country}
        aria-label={country}
      />
    );
  }

  return (
    <span
      className={`fi fi-${code} ${className}`}
      title={country}
      aria-label={country}
    />
  );
}
