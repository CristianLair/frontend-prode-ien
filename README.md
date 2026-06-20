# Prode IEN — Frontend

Frontend en Next.js (App Router) + TypeScript + Tailwind para el backend
`backend-ien` (Flask + MongoDB Atlas, deployado en Render).

## Identidad visual

Paleta extraída del Moodle de IEN (`--primary: #8c43ef`, acento `--accent: #3097d1`),
adaptada a modo oscuro con estética de scoreboard deportivo. Tipografía:
Space Grotesk (marcadores y títulos), Inter (cuerpo), JetBrains Mono (datos).

## Estructura

```
app/
  login/            Pantalla de login
  registro/         Alta de cuenta
  reset-password/   Recuperar contraseña
  partidos/         Fixture completo, agrupado por grupo, con carga de pronósticos
  predicciones/     Historial de pronósticos del usuario logueado
  ranking/          Tabla de posiciones global
lib/
  api.ts            Cliente tipado de la API (todos los endpoints de backend-ien)
  auth-context.tsx  Contexto de autenticación (token JWT en localStorage)
  use-require-auth.ts  Hook para proteger rutas
components/
  ui.tsx            Button, Input, Badge, Card, ErrorBanner, Spinner
  navbar.tsx         Navegación principal
  match-card.tsx     Tarjeta de partido (scoreboard + carga de pronóstico)
```

## Configuración

1. Copiá `.env.example` a `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Editá `NEXT_PUBLIC_API_URL` con la URL real de tu backend en Render
   (ej. `https://backend-ien.onrender.com`).

## Desarrollo local

```bash
npm install
npm run dev
```

Abrí http://localhost:3000 (si tu backend también corre en 3000 local,
cambiá el puerto del front con `npm run dev -- -p 3001`).

## Deploy en Vercel

1. Subí este proyecto a un repo de GitHub.
2. Importalo en Vercel (vercel.com/new).
3. En la configuración del proyecto, agregá la variable de entorno
   `NEXT_PUBLIC_API_URL` con la URL de tu backend en Render.
4. Deploy. Vercel detecta Next.js automáticamente, no necesita configuración
   adicional.

## Notas importantes

- **CORS**: tu backend ya tiene `flask-cors` habilitado (`CORS(app)` en
  `index.py`), así que debería aceptar requests desde el dominio de Vercel
  sin cambios adicionales. Si lo restringís a un dominio específico más
  adelante, agregá el dominio de Vercel a la whitelist.
- **Token**: el front asume que `/login` devuelve un JWT en el campo `token`
  y lo decodifica para sacar el username (campo `user` o `sub` del payload).
  Si tu JWT usa otro campo, ajustá `decodeUserFromToken` en `lib/auth-context.tsx`.
- **Horario de partidos**: el front interpreta el campo `fecha` de cada
  partido como horario Argentina (UTC-3), igual que el backend después del
  refactor de `_parsear_fecha_partido`. Si cambiás el huso en el backend,
  actualizá también `haComenzado()` en `components/match-card.tsx`.
- **Listas vacías como 404**: el backend devuelve 404 cuando un usuario no
  tiene predicciones cargadas (en vez de 200 con `[]`). El front ya maneja
  ese caso puntual en `app/predicciones/page.tsx`, tratándolo como "sin
  predicciones" en lugar de mostrarlo como error.

## Pendiente / próximos pasos

- Torneos privados entre usuarios (ligas) — todavía no tiene endpoints en
  el backend; cuando se agreguen, la pantalla natural sería `app/torneos/`.
- Predicciones especiales (campeón, goleador) — pendiente de diseño de
  modelo de datos en el backend.
