"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const STORAGE_KEY = "pwa-install-dismissed-at";
const RETRY_AFTER_MS = 1000 * 60 * 60 * 24;

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    const ua = window.navigator.userAgent;
    const iosDevice = /iphone|ipad|ipod/i.test(ua);
    setIsIos(iosDevice);

    if (standalone) return;

    const lastDismissed = localStorage.getItem(STORAGE_KEY);
    const canRetry = !lastDismissed || Date.now() - Number(lastDismissed) > RETRY_AFTER_MS;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (canRetry) {
        setShowPopup(true);
      }
    };
    window.addEventListener("beforeinstallprompt", handler);
    if (iosDevice && canRetry) {
      setShowPopup(true);
    }

    const installedHandler = () => {
      setShowPopup(false);
      setDeferredPrompt(null);
      localStorage.removeItem(STORAGE_KEY);
    };
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) {
      setShowPopup(false);
      return;
    }
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "dismissed") {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    }
    setShowPopup(false);
    setDeferredPrompt(null);
  };

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setShowPopup(false);
  };

  return { showPopup, isIos, isStandalone, promptInstall, dismiss };
}