"use client";

const apiSources = [
  {
    name: "USGS",
    fullName: "United States Geological Survey",
    url: "earthquake.usgs.gov",
    coverage: "Global (toda América)",
    features: ["GeoJSON en tiempo real", "Sin API key", "Actualizaciones cada minuto"],
    flag: "🇺🇸",
  },
  {
    name: "EMSC",
    fullName: "European-Mediterranean Seismological Centre",
    url: "seismicportal.eu",
    coverage: "Global (incluyendo América)",
    features: ["API REST gratuita", "Datos verificados", "Múltiples fuentes"],
    flag: "🇪🇺",
  },
  {
    name: "SSN UNAM",
    fullName: "Servicio Sismológico Nacional",
    url: "ssn.unam.mx",
    coverage: "México",
    features: ["Datos oficiales mexicanos", "Alta precisión local", "Alertas SASMEX"],
    flag: "🇲🇽",
  },
  {
    name: "CSN Chile",
    fullName: "Centro Sismológico Nacional",
    url: "csn.uchile.cl",
    coverage: "Chile",
    features: ["Red sísmica nacional", "Zona alta actividad", "Datos en tiempo real"],
    flag: "🇨🇱",
  },
  {
    name: "FUNVISIS",
    fullName: "Fundación Venezolana de Investigaciones Sismológicas",
    url: "funvisis.gob.ve",
    coverage: "Venezuela",
    features: ["Monitoreo nacional", "Red de estaciones", "Alertas locales"],
    flag: "🇻🇪",
  },
  {
    name: "SGC",
    fullName: "Servicio Geológico Colombiano",
    url: "sgc.gov.co",
    coverage: "Colombia",
    features: ["Red sismológica nacional", "Volcanes activos", "Datos oficiales"],
    flag: "🇨🇴",
  },
  {
    name: "IGP Perú",
    fullName: "Instituto Geofísico del Perú",
    url: "igp.gob.pe",
    coverage: "Perú",
    features: ["Subducción de Nazca", "Alta actividad", "Monitoreo 24/7"],
    flag: "🇵🇪",
  },
  {
    name: "INPRES",
    fullName: "Instituto Nacional de Prevención Sísmica",
    url: "inpres.gob.ar",
    coverage: "Argentina",
    features: ["Red nacional", "Zona andina", "Datos verificados"],
    flag: "🇦🇷",
  },
];

export default function APISourcesSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-16 text-center">
          <span className="mb-3 inline-block rounded-full bg-[#e63946]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#e63946]">
            Fuentes de Datos
          </span>
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            APIs Sísmicas Integradas
          </h2>
          <p className="mx-auto max-w-2xl text-gray-400">
            Consumimos datos de múltiples fuentes oficiales simultáneamente. Si una falla, las demás continúan funcionando.
            <strong className="text-white"> Redundancia = más vidas salvadas.</strong>
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {apiSources.map((source, i) => (
            <div key={i} className="glass-card rounded-xl p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-2xl">{source.flag}</span>
                <div>
                  <h4 className="text-sm font-bold text-white">{source.name}</h4>
                  <p className="text-[10px] text-gray-500">{source.fullName}</p>
                </div>
              </div>
              <p className="mb-2 text-xs text-gray-400">{source.coverage}</p>
              <div className="space-y-1">
                {source.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-1 text-[10px] text-gray-500">
                    <span className="text-[#2a9d8f]">✓</span>
                    {feature}
                  </div>
                ))}
              </div>
              <a
                href={`https://${source.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block text-[10px] text-[#e63946] hover:underline"
              >
                {source.url} →
              </a>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-white/5 bg-[#1a1f2e]/50 p-6 text-center sm:p-8">
          <div className="mb-4 text-3xl">📡</div>
          <h3 className="mb-2 text-lg font-bold text-white">¿Por qué múltiples APIs?</h3>
          <p className="mx-auto max-w-2xl text-sm text-gray-400 leading-relaxed">
            Cada agencia sísmica tiene sus propias estaciones de monitoreo. Al combinar datos de{" "}
            <strong className="text-white">USGS, EMSC y servicios geológicos locales</strong>, obtenemos mayor
            cobertura, velocidad y precisión. Si un servicio está caído o lento, los demás continúan proporcionando
            datos. Esto es especialmente crítico durante desastres, cuando la infraestructura puede fallar.
          </p>
        </div>
      </div>
    </section>
  );
}
