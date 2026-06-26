"use client";

export default function WhatIsSection() {
  return (
    <section id="que-es" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Text content */}
          <div>
            <span className="mb-3 inline-block rounded-full bg-[#e63946]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#e63946]">
              Acerca del proyecto
            </span>
            <h2 className="mb-6 text-3xl font-bold leading-tight text-white sm:text-4xl">
              ¿Qué es SismoAlerta América?
            </h2>

            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>
                SismoAlerta América es una aplicación <strong className="text-white">completamente gratuita</strong> de
                alertas sísmicas en tiempo real, diseñada para proteger a los habitantes de todo el continente americano.
              </p>
              <p>
                Nace de una realidad dolorosa: la mayoría de los países de América{" "}
                <strong className="text-white">no tienen sistemas de alerta sísmica pública</strong> accesibles desde
                el teléfono celular. Muchos países no cuentan con altavoces de alerta en las calles como el sistema
                SASMEX de México. La gente muere porque no está preparada ni avisada.
              </p>
              <p>
                El devastador terremoto de Venezuela en junio de 2026 demostró otro problema crítico: cuando los
                sistemas existentes enviaron alertas, muchos usuarios{" "}
                <strong className="text-white">no entendieron el mensaje</strong>. Pensaron que se trataba de una
                notificación informativa sobre un sismo lejano, no de una alerta de emergencia inmediata. Esta confusión
                costó vidas.
              </p>
              <p>
                <strong className="text-[#e63946]">SismoAlerta América existe para resolver exactamente ese problema.</strong>
              </p>
            </div>

            {/* Key differentiators */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-[#1a1f2e] p-4">
                <div className="mb-2 text-2xl">🆓</div>
                <h4 className="text-sm font-semibold text-white">100% Gratuita</h4>
                <p className="text-xs text-gray-500">Sin anuncios, sin pagos, sin datos vendidos</p>
              </div>
              <div className="rounded-xl bg-[#1a1f2e] p-4">
                <div className="mb-2 text-2xl">📡</div>
                <h4 className="text-sm font-semibold text-white">Multi-API</h4>
                <p className="text-xs text-gray-500">Múltiples fuentes simultáneas por país</p>
              </div>
              <div className="rounded-xl bg-[#1a1f2e] p-4">
                <div className="mb-2 text-2xl">🎯</div>
                <h4 className="text-sm font-semibold text-white">Mensajes Claros</h4>
                <p className="text-xs text-gray-500">Nunca ambiguos: &quot;cerca de ti&quot; o &quot;lejos&quot;</p>
              </div>
              <div className="rounded-xl bg-[#1a1f2e] p-4">
                <div className="mb-2 text-2xl">🔐</div>
                <h4 className="text-sm font-semibold text-white">Sin Espionaje</h4>
                <p className="text-xs text-gray-500">Tu ubicación nunca se almacena</p>
              </div>
            </div>
          </div>

          {/* Visual / alert preview */}
          <div className="relative">
            <div className="glass-card mx-auto max-w-sm rounded-3xl p-6 shadow-2xl">
              {/* Phone mockup header */}
              <div className="mb-4 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-gray-600" />
                <div className="h-2 w-12 rounded-full bg-gray-700" />
              </div>

              {/* Alert example - RED */}
              <div className="mb-4 overflow-hidden rounded-2xl border border-[#e63946]/30 bg-[#e63946]/10 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-3 w-3 animate-pulse rounded-full bg-[#e63946]" />
                  <span className="text-xs font-bold text-[#e63946]">⚠️ ALERTA SÍSMICA</span>
                </div>
                <p className="text-sm font-semibold text-white">
                  Sismo M 6.2 a 45 km de tu ubicación
                </p>
                <p className="mt-1 text-xs text-gray-300">
                  ⚠️ ZONA DE RIESGO — PROTÉGETE AHORA
                </p>
              </div>

              {/* Alert example - ORANGE */}
              <div className="mb-4 overflow-hidden rounded-2xl border border-[#f77f00]/30 bg-[#f77f00]/10 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#f77f00]" />
                  <span className="text-xs font-bold text-[#f77f00]">ALERTA ALTA</span>
                </div>
                <p className="text-sm text-white">Sismo M 5.3 detectado cerca de ti</p>
                <p className="mt-1 text-xs text-gray-400">Mantente alerta y prepárate</p>
              </div>

              {/* Alert example - YELLOW */}
              <div className="mb-4 overflow-hidden rounded-2xl border border-[#fcbf49]/30 bg-[#fcbf49]/10 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#fcbf49]" />
                  <span className="text-xs font-bold text-[#fcbf49]">AVISO</span>
                </div>
                <p className="text-sm text-white">Sismo M 4.1 a 280 km</p>
                <p className="mt-1 text-xs text-gray-400">Sin peligro inmediato</p>
              </div>

              {/* Alert example - GREEN */}
              <div className="overflow-hidden rounded-2xl border border-[#2a9d8f]/30 bg-[#2a9d8f]/10 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#2a9d8f]" />
                  <span className="text-xs font-bold text-[#2a9d8f]">INFORMATIVO</span>
                </div>
                <p className="text-sm text-white">Sismo M 3.2 a 650 km</p>
                <p className="mt-1 text-xs text-gray-400">Este sismo NO representa riesgo para ti</p>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#e63946]/5 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-[#f77f00]/5 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
