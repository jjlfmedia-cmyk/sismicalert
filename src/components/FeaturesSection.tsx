"use client";

const features = [
  {
    icon: "🌍",
    title: "Cobertura Completa de América",
    description:
      "Desde Canadá hasta Argentina, incluyendo el Caribe y Centroamérica. Monitoreo continuo de todo el continente con múltiples fuentes de datos por país.",
  },
  {
    icon: "⚡",
    title: "Alertas en Tiempo Real",
    description:
      "Consulta múltiples APIs sísmicas cada 30-60 segundos. Te avisa en segundos cuando se detecta un sismo cerca de tu ubicación.",
  },
  {
    icon: "🔴",
    title: "Sistema de Niveles de Color",
    description:
      "Cuatro niveles de alerta (Rojo, Naranja, Amarillo, Verde) con acciones claras para cada uno. Nunca más confusión sobre qué hacer.",
  },
  {
    icon: "📡",
    title: "Múltiples APIs Simultáneas",
    description:
      "USGS, EMSC, y fuentes locales de cada país. Si una fuente falla, las demás continúan. Redundancia = más vidas salvadas.",
  },
  {
    icon: "📴",
    title: "Funciona en Silencio y Pantalla Apagada",
    description:
      "Las alertas rojas encienden tu pantalla, suben el volumen automáticamente y suenan aunque el teléfono esté en modo silencioso.",
  },
  {
    icon: "🆓",
    title: "100% Gratuita, Siempre",
    description:
      "Sin anuncios, sin suscripciones, sin funciones premium. Todo es libre y abierto. Tu seguridad no debe tener precio.",
  },
  {
    icon: "📱",
    title: "Detección Sísmica Local",
    description:
      "Usa el acelerómetro de tu dispositivo como sensor sísmico complementario. Funciona incluso sin internet como primera capa de detección.",
  },
  {
    icon: "🆘",
    title: 'Sistema "¿Estás Bien?"',
    description:
      "Tras un sismo mayor, te pregunta si estás bien. Si no respondes, activa el Modo Rescate para que otros puedan ayudarte a través del mapa de emergencia.",
  },
  {
    icon: "🗺️",
    title: "Mapa Sísmico en Vivo",
    description:
      "Visualiza todos los sismos de las últimas 24 horas, 7 días o 30 días en un mapa interactivo con información detallada de cada evento.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="caracteristicas" className="relative py-20 sm:py-28">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a1f2e]/30 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-16 text-center">
          <span className="mb-3 inline-block rounded-full bg-[#e63946]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#e63946]">
            Características
          </span>
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Todo lo que necesitas para estar protegido
          </h2>
          <p className="mx-auto max-w-2xl text-gray-400">
            Diseñada para salvar vidas con tecnología accesible, mensajes claros y múltiples capas de protección.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={i}
              className="feature-card group rounded-2xl p-6"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0a0f1e] text-2xl">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
