"use client";

import { useInstallPrompt } from "@/hooks/useInstallPrompt";

export default function InstallPwaPopup() {
  const { showPopup, isIos, promptInstall, dismiss } = useInstallPrompt();
  if (!showPopup) return null;
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-80 bg-zinc-900 text-white border border-white/20 rounded-xl p-4 shadow-xl z-50">
      <div className="flex justify-between items-start gap-3">
        <div>
          <p className="font-semibold mb-1">📱 Instalá PRODE</p>
          {isIos ? (
            <p className="text-sm text-white/80">
              Tocá el botón <span className="font-medium">Compartir</span> y luego{" "}
              <span className="font-medium">"Agregar a pantalla de inicio"</span>.
            </p>
          ) : (
            <p className="text-sm text-white/80">
              Instalá la app para acceder más rápido y desde tu celular.
            </p>
          )}
        </div>
        <button onClick={dismiss} className="text-white/60 hover:text-white text-sm">
          ✕
        </button>
      </div>

      {!isIos && (
        <button
          onClick={promptInstall}
          className="mt-3 w-full bg-fuchsia-600 px-4 py-2 rounded-lg font-medium"
        >
          Instalar app
        </button>
      )}
    </div>
  );
}