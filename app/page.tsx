export default function Home(){return (
<main className="hero-bg min-h-screen text-white">
<div className="min-h-screen flex items-center">
<div className="max-w-6xl mx-auto px-6">
<div className="max-w-3xl">
<div className="inline-block border px-4 py-2 rounded mb-4">PRODE</div>
<h1 className="text-6xl font-bold mb-6">Viví el torneo como nunca antes</h1>
<p className="text-xl mb-8">Pronosticá resultados, competí en rankings y seguí la tabla de grupos en tiempo real.</p>
<div className="flex gap-4">
<a href="/login" className="bg-fuchsia-600 px-6 py-3 rounded">Iniciar sesión</a>
<a href="/registro" className="border px-6 py-3 rounded">Crear cuenta</a>
</div>
</div></div></div>
<section className="bg-black/60 p-8">
<div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
<div><h3>⚽ Predicciones</h3><p>Cargá tus resultados antes de cada partido.</p></div>
<div><h3>🏆 Ranking</h3><p>Competí contra todos los participantes.</p></div>
<div><h3>📱 PWA</h3><p>Instalá la aplicación en tu celular.</p></div>
</div></section>
</main>)}