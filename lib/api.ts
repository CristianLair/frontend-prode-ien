/**
 * Cliente de API para backend-ien (Flask + MongoDB, deployado en Render).
 *
 * Todas las funciones devuelven los datos parseados o lanzan un Error con
 * el mensaje que vino del backend (campo "error" en la respuesta JSON),
 * para que las pantallas puedan mostrar el motivo real del fallo.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

const TOKEN_KEY = "prode_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

interface RequestOptions extends RequestInit {
  auth?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (token) {
      finalHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
  });
  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const body = isJson ? await response.json() : null;

  if (!response.ok) {
    const message =
      (body && (body.error || body.message)) ||
      `Error ${response.status} al conectar con el servidor`;
    throw new Error(message);
  }

  return body as T;
}


export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
}

export function login(user: string, password: string) {
  return request<LoginResponse>("/login", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ user, password }),
  });
}

export function registro(user: string, password: string) {
  return request<{ success: boolean; message: string }>("/registro", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ user, password }),
  });
}

export function resetPassword(user: string, password: string) {
  return request<{ success: boolean; message: string }>("/resetPassword", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ user, password }),
  });
}

export interface Partido {
  _id: string;
  equipo_local: string;
  equipo_visitante: string;
  goles_local: number | null;
  goles_visitante: number | null;
  fecha: string;
  grupo: string | null;
  finalizado: boolean;
}

export function obtenerPartidos() {
  return request<Partido[]>("/partidos");
}

export function obtenerPartido(partidoId: string) {
  return request<Partido>(`/partidos/${partidoId}`);
}


export interface Prediccion {
  _id: string;
  user: string;
  partido_id: string;
  goles_local: number;
  goles_visitante: number;
  puntos_obtenidos: number | null;
  procesado: boolean;
}

export function predecirPartido(
  partidoId: string,
  golesLocal: number,
  golesVisitante: number
) {
  return request<Prediccion>("/predicciones", {
    method: "POST",
    body: JSON.stringify({
      partido_id: partidoId,
      goles_local: golesLocal,
      goles_visitante: golesVisitante,
    }),
  });
}

export function obtenerPrediccionesUsuario() {
  return request<Prediccion[]>("/predicciones");
}

export function obtenerPrediccion(partidoId: string) {
  return request<Prediccion>(`/predicciones/${partidoId}`);
}


export interface PaisPuntaje {
  pais: string;
  puntos: number;
  [key: string]: unknown;
}

export function obtenerPaises() {
  return request<PaisPuntaje[]>("/paises");
}

export function obtenerGrupos() {
  return request<Record<string, unknown>>("/grupos");
}

export function obtenerGrupo(nombreGrupo: string) {
  return request<{ grupo: string; tabla: unknown }>(
    `/grupos/${encodeURIComponent(nombreGrupo)}`
  );
}

export interface RankingEntry {
  _id: string;
  user: string;
  puntos: number;
}

export function obtenerRanking(top: number = 10) {
  return request<{ ranking: RankingEntry[] }>(`/ranking?top=${top}`);
}


export interface Perfil {
  user: string;
  rol?: string;
  puntos?: number;
  [key: string]: unknown;
}

export function obtenerPerfil() {
  return request<Perfil>("/usuarios/perfil");
}

export { ApiError };

class ApiError extends Error {}
