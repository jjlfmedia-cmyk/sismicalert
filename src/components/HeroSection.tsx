"use client";

import { useState, useEffect } from "react";
import DownloadModal from "./DownloadModal";

export default function HeroSection() {
  const [showModal, setShowModal] = useState(false);
  const [downloadCount, setDownloadCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/downloads")
      .then((r) => r.json())
      .then((d) => setDownloadCount(d.count))
      .catch(() => {});
  }, []);

  const handleDownload = () => {
    // Record download
    fetch("/api/downloads", { method: "POST" }).catch(() => {});
    setShowModal(false);
    // In production, this would trigger an actual APK download
    alert("La aplicación APK estará disponible próximamente. ¡Gracias por tu interés!");
  };

  return (
    <>
      <section id="inicio" className="seismic-grid relative min-h-screen overflow-hidden pt-20">
        {/* Animated background elements */}
        <div className="pointer-events-none absolute inset-0">
          {/* Seismic pulse rings */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="animate-wave absolute h-40 w-40 rounded-full border border-[#e63946]/10 sm:h-64 sm:w-64" />
            <div className="animate-wave absolute h-40 w-40 rounded-full border border-[#e63946]/10 sm:h-64 sm:w-64" style={{ animationDelay: "1s" }} />
            <div className="animate-wave absolute h-40 w-40 rounded-full border border-[#e63946]/10 sm:h-64 sm:w-64" style={{ animationDelay: "2s" }} />
          </div>

          {/* Glowing orbs */}
          <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-[#e63946]/5 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-[#f77f00]/5 blur-3xl" />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col items-center justify-center px-4 text-center sm:px-6">
          {/* Logo */}
          <div className="animate-slide-up mb-6">
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e63946] to-[#c1121f] shadow-lg shadow-[#e63946]/30 sm:h-24 sm:w-24">
              <svg viewBox="0 0 24 24" className="h-10 w-10 text-white sm:h-12 sm:w-12" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 12h3l3-9 4 18 4-18 3 9h3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="animate-pulse-seismic absolute inset-0 rounded-2xl bg-[#e63946]/30" />
            </div>
          </div>

          {/* Title */}
          <h1 className="animate-slide-up mb-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-7xl" style={{ animationDelay: "0.1s" }}>
            Sismo<span className="gradient-text">Alerta</span>{" "}
            <span className="text-gray-400">América</span>
          </h1>

          {/* Tagline */}
          <p className="animate-slide-up mb-8 max-w-2xl text-lg text-gray-400 sm:text-xl md:text-2xl" style={{ animationDelay: "0.2s" }}>
            Alertas sísmicas en tiempo real.{" "}
            <span className="font-semibold text-white">Gratis.</span> Para toda América.
          </p>

          {/* Download button */}
          <div className="animate-slide-up mb-6" style={{ animationDelay: "0.3s" }}>
            <button
              onClick={() => setShowModal(true)}
              className="btn-download group flex items-center gap-3 rounded-2xl px-8 py-4 text-lg font-bold text-white sm:px-10 sm:py-5 sm:text-xl"
            >
              <svg className="h-6 w-6 transition-transform group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Descargar APK Gratis
            </button>
          </div>

          {/* Sub-info */}
          <div className="animate-slide-up mb-8 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-500 sm:gap-4 sm:text-sm" style={{ animationDelay: "0.4s" }}>
            <span className="flex items-center gap-1">
              <span className="text-green-400">✓</span> Android 7.0+
            </span>
            <span className="hidden sm:inline text-gray-700">·</span>
            <span className="flex items-center gap-1">
              <span className="text-green-400">✓</span> Sin anuncios
            </span>
            <span className="hidden sm:inline text-gray-700">·</span>
            <span className="flex items-center gap-1">
              <span className="text-green-400">✓</span> Sin suscripción
            </span>
            <span className="hidden sm:inline text-gray-700">·</span>
            <span className="flex items-center gap-1">
              <span className="text-green-400">✓</span> Código abierto
            </span>
          </div>

          {/* Version and counter */}
          <div className="animate-slide-up flex flex-col items-center gap-2 text-xs text-gray-600" style={{ animationDelay: "0.5s" }}>
            <span>Versión 1.0.0 — Junio 2026</span>
            {downloadCount !== null && downloadCount > 0 && (
              <span className="rounded-full bg-white/5 px-3 py-1">
                📥 {downloadCount.toLocaleString()} descargas
              </span>
            )}
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      <DownloadModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDownload}
      />
    </>
  );
}
