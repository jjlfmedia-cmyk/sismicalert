"use client";

import { useState } from "react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    messageType: "pregunta",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", messageType: "pregunta", message: "" });
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Error al enviar");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Error de conexión. Intenta de nuevo.");
    }
  };

  return (
    <section id="contacto" className="relative py-20 sm:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a1f2e]/20 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-16 text-center">
          <span className="mb-3 inline-block rounded-full bg-[#e63946]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#e63946]">
            Contacto
          </span>
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">¿Tienes preguntas o sugerencias?</h2>
          <p className="mx-auto max-w-2xl text-gray-400">
            Respondemos en un plazo de 24 a 72 horas. Para reportes urgentes de errores en alertas, escríbenos
            directamente al email.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact form */}
          <div className="glass-card rounded-2xl p-6 sm:p-8">
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#2a9d8f]/20 text-3xl">
                  ✅
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">¡Mensaje enviado!</h3>
                <p className="mb-6 text-gray-400">Responderemos en 24-72 horas.</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="rounded-lg bg-white/10 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-300">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#0a0f1e] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-[#e63946]/50"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#0a0f1e] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-[#e63946]/50"
                    placeholder="tu@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="messageType" className="mb-1.5 block text-sm font-medium text-gray-300">
                    Tipo de mensaje
                  </label>
                  <select
                    id="messageType"
                    value={formData.messageType}
                    onChange={(e) => setFormData({ ...formData, messageType: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#0a0f1e] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#e63946]/50"
                  >
                    <option value="pregunta">Pregunta</option>
                    <option value="bug">Reporte de bug</option>
                    <option value="sugerencia">Sugerencia</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-gray-300">
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full resize-none rounded-xl border border-white/10 bg-[#0a0f1e] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-[#e63946]/50"
                    placeholder="Escribe tu mensaje aquí..."
                  />
                </div>

                {status === "error" && (
                  <div className="rounded-lg bg-[#e63946]/10 p-3 text-sm text-[#e63946]">{errorMsg}</div>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="btn-download w-full rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {status === "sending" ? "Enviando..." : "Enviar Mensaje"}
                </button>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">📧 Email Directo</h3>
              <a
                href="mailto:jjlfmedia@gmail.com"
                className="text-lg font-medium text-[#e63946] transition-colors hover:text-[#f77f00]"
              >
                jjlfmedia@gmail.com
              </a>
              <p className="mt-2 text-sm text-gray-400">
                Para reportes urgentes de errores en alertas, escríbenos directamente.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">📍 Ubicación del Proyecto</h3>
              <p className="text-gray-400">Buctzotz, Yucatán, México</p>
              <p className="mt-2 text-sm text-gray-500">
                Proyecto desarrollado de forma independiente por JJLF Media.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">🌐 Redes y Proyectos</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>📻 JJLF Radio</p>
                <p>📰 Enfoque Noticias</p>
                <p>🎙️ Dúo de Podcast</p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#2a9d8f]/20 bg-[#2a9d8f]/5 p-6">
              <h3 className="mb-2 text-lg font-semibold text-white">💚 Proyecto Sin Fines de Lucro</h3>
              <p className="text-sm text-gray-400">
                SismoAlerta América es un proyecto 100% gratuito, sin anuncios, sin suscripciones y sin datos vendidos.
                Existe únicamente para proteger vidas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
