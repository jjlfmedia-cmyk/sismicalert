"use client";

const steps = [
  {
    number: "01",
    icon: "📡",
    title: "Recopilación de Datos",
    description:
      "Múltiples APIs sísmicas de toda América (USGS, EMSC, servicios geológicos locales) envían datos en tiempo real sobre actividad sísmica.",
    color: "#2a9d8f",
  },
  {
    number: "02",
    icon: "🔄",
    title: "Procesamiento Inteligente",
    description:
      "Los datos se cruzan, verifican y clasifican por magnitud, distancia y ubicación del usuario. Se eliminan duplicados y falsos positivos.",
    color: "#fcbf49",
  },
  {
    number: "03",
    icon: "📱",
    title: "Alerta al Usuario",
    description:
      "Si un sismo representa riesgo para tu ubicación, la app te alerta inmediatamente con el nivel de color correspondiente y acciones claras.",
    color: "#f77f00",
  },
  {
    number: "04",
    icon: "🆘",
    title: "Protección Post-Sismo",
    description:
      'Tras sismos mayores (≥ 6.0), se activa el sistema "¿Estás Bien?" y el Modo Rescate para coordinar ayuda y localizar personas.',
    color: "#e63946",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-16 text-center">
          <span className="mb-3 inline-block rounded-full bg-[#e63946]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#e63946]">
            Proceso
          </span>
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">¿Cómo funciona?</h2>
          <p className="mx-auto max-w-2xl text-gray-400">
            Un sistema de múltiples capas que combina datos de APIs oficiales con sensores locales de tu dispositivo.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-12 hidden h-px w-full translate-x-1/2 bg-gradient-to-r from-white/10 to-transparent lg:block" />
              )}
              <div className="glass-card rounded-2xl p-6">
                <div
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg text-xs font-black"
                  style={{ backgroundColor: `${step.color}20`, color: step.color }}
                >
                  {step.number}
                </div>
                <div className="mb-3 text-3xl">{step.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-white">{step.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Accelerometer section */}
        <div className="mt-16 rounded-2xl border border-white/5 bg-[#1a1f2e]/50 p-6 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <span className="text-2xl">📱</span>
                <h3 className="text-xl font-bold text-white">Detección Sísmica Local</h3>
              </div>
              <p className="mb-4 text-gray-400 leading-relaxed">
                Tu teléfono tiene un acelerómetro — el mismo sensor que rota la pantalla. SismoAlerta lo usa como{" "}
                <strong className="text-white">sensor sísmico complementario</strong> para detectar vibraciones
                anormales.
              </p>
              <p className="mb-4 text-gray-400 leading-relaxed">
                Si el acelerómetro detecta vibración sostenida por más de 2-3 segundos con una aceleración superior a
                3.5 m/s², combinada con datos de las APIs, la app emite una alerta. Esta función{" "}
                <strong className="text-white">funciona incluso sin internet</strong>.
              </p>
              <div className="flex items-center gap-2 rounded-lg bg-[#e63946]/10 p-3">
                <span className="text-sm text-[#e63946]">⚠️</span>
                <p className="text-xs text-gray-300">
                  Esta es una capa complementaria de detección, no reemplaza los datos de las agencias sísmicas oficiales.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative h-48 w-48">
                {/* Seismograph animation */}
                <svg viewBox="0 0 200 200" className="h-full w-full">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(230,57,70,0.1)" strokeWidth="1" />
                  <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(230,57,70,0.08)" strokeWidth="1" />
                  <circle cx="100" cy="100" r="50" fill="none" stroke="rgba(230,57,70,0.06)" strokeWidth="1" />
                  {/* Seismic wave */}
                  <path
                    d="M 20 100 L 40 100 L 50 70 L 60 130 L 70 60 L 80 140 L 90 50 L 100 150 L 110 55 L 120 135 L 130 65 L 140 125 L 150 80 L 160 100 L 180 100"
                    fill="none"
                    stroke="#e63946"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.8"
                  />
                  <circle cx="100" cy="100" r="4" fill="#e63946" className="animate-pulse-dot" />
                </svg>
                <div className="animate-pulse-seismic absolute inset-0 rounded-full border border-[#e63946]/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
