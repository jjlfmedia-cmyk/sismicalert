"use client";

import { useState } from "react";

const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#que-es", label: "¿Qué es?" },
  { href: "#caracteristicas", label: "Características" },
  { href: "#como-funciona", label: "Cómo Funciona" },
  { href: "#paises", label: "Países" },
  { href: "#rescate", label: "Rescate" },
  { href: "#contacto", label: "Contacto" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0f1e]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <a href="#inicio" className="flex items-center gap-2">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-[#e63946]">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M2 12h3l3-9 4 18 4-18 3 9h3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="absolute inset-0 animate-ping rounded-lg bg-[#e63946] opacity-20" />
          </div>
          <span className="text-lg font-bold text-white">
            Sismo<span className="text-[#e63946]">Alerta</span>
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#inicio"
            className="rounded-lg bg-[#e63946] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#c1121f]"
          >
            Descargar APK
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="border-t border-white/5 bg-[#0a0f1e]/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#inicio"
              onClick={() => setIsOpen(false)}
              className="mt-2 rounded-lg bg-[#e63946] px-4 py-2 text-center text-sm font-semibold text-white"
            >
              Descargar APK
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
