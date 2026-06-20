/**
 * Mapeo de nombre de país (en español, como se guarda en backend-ien)
 * a código ISO 3166-1 alfa-2, usado por flag-icons para renderizar la
 * bandera correspondiente.
 *
 * Cubre los seleccionados confirmados/probables del Mundial 2026 (48 equipos)
 * más algunas variantes de escritura comunes (con/sin tilde, abreviaturas)
 * para tolerar pequeñas diferencias en cómo se cargó cada partido en Mongo.
 *
 * Si un nombre no está en este mapa, getCountryCode() devuelve null y el
 * componente <CountryFlag> muestra un ícono genérico en lugar de romper.
 */
export const COUNTRY_TO_ISO: Record<string, string> = {
  // Anfitriones
  "México": "mx",
  "Mexico": "mx",
  "MEX": "mx",
  "Estados Unidos": "us",
  "USA": "us",
  "EE.UU.": "us",
  "Canadá": "ca",
  "Canada": "ca",

  // Conmebol
  "Argentina": "ar",
  "Brasil": "br",
  "Uruguay": "uy",
  "Colombia": "co",
  "Ecuador": "ec",
  "Paraguay": "py",
  "Bolivia": "bo",
  "Venezuela": "ve",
  "Perú": "pe",
  "Peru": "pe",

  // Concacaf
  "Panamá": "pa",
  "Panama": "pa",
  "Costa Rica": "cr",
  "Honduras": "hn",
  "Jamaica": "jm",
  "Curazao": "cw",
  "Haití": "ht",
  "Haiti": "ht",
  "Surinam": "sr",
  "Guatemala": "gt",
  "El Salvador": "sv",

  // Europa (UEFA)
  "España": "es",
  "Espana": "es",
  "Francia": "fr",
  "Inglaterra": "gb-eng",
  "Alemania": "de",
  "Italia": "it",
  "Portugal": "pt",
  "Países Bajos": "nl",
  "Holanda": "nl",
  "Bélgica": "be",
  "Belgica": "be",
  "Croacia": "hr",
  "Suiza": "ch",
  "Dinamarca": "dk",
  "Austria": "at",
  "Escocia": "gb-sct",
  "Noruega": "no",
  "Eslovenia": "si",
  "Gales": "gb-wls",
  "Serbia": "rs",
  "Ucrania": "ua",
  "Polonia": "pl",
  "Suecia": "se",
  "República Checa": "cz",
  "Republica Checa": "cz",
  "Grecia": "gr",
  "Turquía": "tr",
  "Turquia": "tr",
  "Irlanda del Norte": "gb-nir",
  "Albania": "al",
  "Eslovaquia": "sk",

  // Conmebol/Asia (AFC)
  "Japón": "jp",
  "Japon": "jp",
  "Corea del Sur": "kr",
  "Irán": "ir",
  "Iran": "ir",
  "Arabia Saudita": "sa",
  "Australia": "au",
  "Jordania": "jo",
  "Uzbekistán": "uz",
  "Uzbekistan": "uz",
  "Qatar": "qa",
  "Catar": "qa",
  "Corea del Norte": "kp",

  // África (CAF)
  "Marruecos": "ma",
  "Senegal": "sn",
  "Túnez": "tn",
  "Tunez": "tn",
  "Egipto": "eg",
  "Argelia": "dz",
  "Ghana": "gh",
  "Costa de Marfil": "ci",
  "Sudáfrica": "za",
  "Sudafrica": "za",
  "Cabo Verde": "cv",

  // Oceanía (OFC)
  "Nueva Zelanda": "nz",
};

export function getCountryCode(nombrePais: string): string | null {
  const directo = COUNTRY_TO_ISO[nombrePais];
  if (directo) return directo;

  // Intento de fallback: comparar normalizando tildes y mayúsculas,
  // por si en Mongo está cargado con distinta capitalización o sin tilde.
  const normalizado = nombrePais
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  for (const [nombre, codigo] of Object.entries(COUNTRY_TO_ISO)) {
    const nombreNormalizado = nombre
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
    if (nombreNormalizado === normalizado) return codigo;
  }

  return null;
}
