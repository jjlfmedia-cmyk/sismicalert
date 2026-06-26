"use client";

export default function RescueSection() {
  return (
    <section id="rescate" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-16 text-center">
          <span className="mb-3 inline-block rounded-full bg-[#f77f00]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#f77f00]">
            Sistema Post-Sismo
          </span>
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Sistema &quot;¿Estás Bien?&quot; y Modo Rescate
          </h2>
          <p className="mx-auto max-w-2xl text-gray-400">
            Una de las funciones más importantes de la app. Inspirada en la tragedia de Venezuela (junio 2026), donde
            miles de personas desaparecieron. Este sistema puede ayudar a localizar sobrevivientes.
          </p>
        </div>

        {/* Timeline flow */}
        <div className="mx-auto max-w-4xl">
          {/* Step 1 - Earthquake */}
          <div className="relative mb-8 flex gap-6">
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e63946] text-xl">
                🔴
              </div>
              <div className="mt-2 h-full w-px bg-gradient-to-b from-[#e63946] to-[#f77f00]" />
            </div>
            <div className="glass-card flex-1 rounded-2xl p-6">
              <div className="mb-1 text-xs font-semibold text-[#e63946]">MOMENTO DEL SISMO</div>
              <h3 className="mb-2 text-lg font-bold text-white">Alerta de Emergencia</h3>
              <p className="text-sm text-gray-400">
                Se detecta sismo ≥ 6.0 a menos de 300 km. La pantalla se enciende, suena la alarma a máximo volumen, se
                muestra la alerta roja con instrucciones claras de protección.
              </p>
            </div>
          </div>

          {/* Step 2 - 8 minutes */}
          <div className="relative mb-8 flex gap-6">
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f77f00] text-xl">
                🟠
              </div>
              <div className="mt-2 h-full w-px bg-gradient-to-b from-[#f77f00] to-[#fcbf49]" />
            </div>
            <div className="glass-card flex-1 rounded-2xl p-6">
              <div className="mb-1 text-xs font-semibold text-[#f77f00]">8 MINUTOS DESPUÉS</div>
              <h3 className="mb-2 text-lg font-bold text-white">Verificación &quot;¿Estás Bien?&quot;</h3>
              <p className="mb-4 text-sm text-gray-400">
                Pantalla completa con fondo naranja, sonido tranquilizador (no de pánico), a volumen moderado. Te
                pregunta si estás bien.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-lg bg-[#2a9d8f]/20 px-3 py-1.5 text-xs font-semibold text-[#2a9d8f]">
                  ✅ ESTOY BIEN
                </span>
                <span className="rounded-lg bg-[#e63946]/20 px-3 py-1.5 text-xs font-semibold text-[#e63946]">
                  🆘 NECESITO AYUDA
                </span>
                <span className="rounded-lg bg-[#fcbf49]/20 px-3 py-1.5 text-xs font-semibold text-[#fcbf49]">
                  ⏳ MÁS TIEMPO
                </span>
              </div>
            </div>
          </div>

          {/* Step 3 - No response */}
          <div className="relative mb-8 flex gap-6">
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fcbf49] text-xl">
                ⏱️
              </div>
              <div className="mt-2 h-full w-px bg-gradient-to-b from-[#fcbf49] to-[#e63946]" />
            </div>
            <div className="glass-card flex-1 rounded-2xl p-6">
              <div className="mb-1 text-xs font-semibold text-[#fcbf49]">SIN RESPUESTA EN 3 MINUTOS</div>
              <h3 className="mb-2 text-lg font-bold text-white">Activación Automática del Modo Rescate</h3>
              <p className="text-sm text-gray-400">
                Si no respondes, el sistema activa el Modo Rescate automáticamente. Tu ubicación se comparte de forma
                anónima en el mapa de emergencia para que equipos de rescate puedan localizarte.
              </p>
            </div>
          </div>

          {/* Step 4 - Rescue mode */}
          <div className="relative flex gap-6">
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e63946] text-xl">
                🆘
              </div>
            </div>
            <div className="glass-card flex-1 rounded-2xl border-[#e63946]/20 p-6">
              <div className="mb-1 text-xs font-semibold text-[#e63946]">MODO RESCATE ACTIVO</div>
              <h3 className="mb-2 text-lg font-bold text-white">Monitoreo por 5 Horas</h3>
              <p className="mb-4 text-sm text-gray-400">
                GPS de alta precisión envía tu ubicación cada 2 minutos. Apareces como punto rojo en el mapa de
                emergencia. Se desactiva automáticamente después de 5 horas o cuando confirmes que estás bien.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="text-green-400">✓</span> GPS balanceado para ahorrar batería
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="text-green-400">✓</span> Reducción automática si batería &lt; 15%
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="text-green-400">✓</span> Ubicación 100% anónima en el mapa
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="text-green-400">✓</span> Datos eliminados automáticamente en 24 horas
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="text-green-400">✓</span> Desactivable manualmente en cualquier momento
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency numbers */}
        <div className="mt-16 rounded-2xl border border-white/5 bg-[#1a1f2e]/50 p-6 sm:p-10">
          <h3 className="mb-6 text-center text-xl font-bold text-white">
            📞 Números de Emergencia por País
          </h3>
          <p className="mb-6 text-center text-sm text-gray-400">
            La app detecta automáticamente tu país y muestra el número de emergencia correspondiente.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {[
              { flag: "🇲🇽", name: "México", number: "911" },
              { flag: "🇺🇸", name: "EE.UU.", number: "911" },
              { flag: "🇨🇦", name: "Canadá", number: "911" },
              { flag: "🇻🇪", name: "Venezuela", number: "171" },
              { flag: "🇨🇱", name: "Chile", number: "132" },
              { flag: "🇨🇴", name: "Colombia", number: "123" },
              { flag: "🇦🇷", name: "Argentina", number: "911" },
              { flag: "🇵🇪", name: "Perú", number: "115" },
              { flag: "🇬🇹", name: "Guatemala", number: "122" },
              { flag: "🇸🇻", name: "El Salvador", number: "911" },
              { flag: "🇨🇷", name: "Costa Rica", number: "911" },
              { flag: "🇪🇨", name: "Ecuador", number: "911" },
              { flag: "🇧🇷", name: "Brasil", number: "193" },
              { flag: "🇧🇴", name: "Bolivia", number: "110" },
              { flag: "🇵🇦", name: "Panamá", number: "911" },
              { flag: "🇭🇳", name: "Honduras", number: "911" },
              { flag: "🇳🇮", name: "Nicaragua", number: "118" },
              { flag: "🇨🇺", name: "Cuba", number: "106" },
              { flag: "🇩🇴", name: "Rep. Dom.", number: "911" },
              { flag: "🇵🇷", name: "Puerto Rico", number: "911" },
            ].map((item, i) => (
              <div key={i} className="rounded-lg bg-[#0a0f1e]/50 p-3 text-center">
                <span className="text-lg">{item.flag}</span>
                <p className="text-xs text-gray-400">{item.name}</p>
                <p className="text-sm font-bold text-white">{item.number}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
