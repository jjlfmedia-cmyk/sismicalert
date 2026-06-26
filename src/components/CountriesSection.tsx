"use client";

const countries = [
  { flag: "🇨🇦", name: "Canadá", sources: ["NRCan / Earthquakes Canada", "USGS"] },
  { flag: "🇺🇸", name: "Estados Unidos", sources: ["USGS", "EMSC", "ShakeAlert (Costa Oeste)"] },
  { flag: "🇲🇽", name: "México", sources: ["SSN UNAM", "CIRES/SASMEX", "USGS"] },
  { flag: "🇬🇹", name: "Guatemala", sources: ["INSIVUMEH", "USGS"] },
  { flag: "🇧🇿", name: "Belice", sources: ["USGS", "EMSC"] },
  { flag: "🇸🇻", name: "El Salvador", sources: ["MARN", "USGS"] },
  { flag: "🇭🇳", name: "Honduras", sources: ["USGS", "EMSC"] },
  { flag: "🇳🇮", name: "Nicaragua", sources: ["INETER", "USGS"] },
  { flag: "🇨🇷", name: "Costa Rica", sources: ["OVSICORI", "RSN UCR", "USGS"] },
  { flag: "🇵🇦", name: "Panamá", sources: ["IGC UP", "USGS"] },
  { flag: "🇨🇴", name: "Colombia", sources: ["SGC", "USGS"] },
  { flag: "🇻🇪", name: "Venezuela", sources: ["FUNVISIS", "USGS"] },
  { flag: "🇬🇾", name: "Guyana", sources: ["USGS", "EMSC"] },
  { flag: "🇸🇷", name: "Surinam", sources: ["USGS", "EMSC"] },
  { flag: "🇬🇫", name: "Guayana Francesa", sources: ["USGS", "EMSC", "IPGP"] },
  { flag: "🇧🇷", name: "Brasil", sources: ["USP Sismologia", "USGS"] },
  { flag: "🇪🇨", name: "Ecuador", sources: ["IGEPN", "USGS"] },
  { flag: "🇵🇪", name: "Perú", sources: ["IGP", "USGS"] },
  { flag: "🇧🇴", name: "Bolivia", sources: ["OSC San Calixto", "USGS"] },
  { flag: "🇨🇱", name: "Chile", sources: ["CSN", "USGS"] },
  { flag: "🇵🇾", name: "Paraguay", sources: ["USGS", "EMSC"] },
  { flag: "🇦🇷", name: "Argentina", sources: ["INPRES", "USGS"] },
  { flag: "🇺🇾", name: "Uruguay", sources: ["USGS", "EMSC"] },
  { flag: "🇨🇺", name: "Cuba", sources: ["CENAIS", "USGS"] },
  { flag: "🇯🇲", name: "Jamaica", sources: ["Earthquake Unit UWI", "USGS"] },
  { flag: "🇭🇹", name: "Haití", sources: ["URGeo", "USGS"] },
  { flag: "🇩🇴", name: "Rep. Dominicana", sources: ["USGS", "EMSC"] },
  { flag: "🇵🇷", name: "Puerto Rico", sources: ["Red Sísmica PR", "USGS"] },
  { flag: "🇹🇹", name: "Trinidad y Tobago", sources: ["UWI SRC", "USGS"] },
];

export default function CountriesSection() {
  return (
    <section id="paises" className="relative py-20 sm:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a1f2e]/20 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-16 text-center">
          <span className="mb-3 inline-block rounded-full bg-[#e63946]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#e63946]">
            Cobertura
          </span>
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Países Cubiertos</h2>
          <p className="mx-auto max-w-2xl text-gray-400">
            Monitoreo sísmico de todo el continente americano con fuentes de datos locales e internacionales para cada
            país.
          </p>
        </div>

        {/* Americas map visual - simplified SVG */}
        <div className="mb-12 flex justify-center">
          <div className="relative w-full max-w-md">
            <svg viewBox="0 0 400 600" className="h-auto w-full opacity-20">
              {/* Simplified Americas outline */}
              <path
                d="M180,50 L200,45 L220,50 L240,55 L250,70 L260,90 L255,110 L250,130 L260,140 L270,150 L275,170 L270,185 L260,190 L250,200 L240,210 L230,220 L220,230 L210,240 L200,250 L190,260 L180,270 L175,280 L170,290 L175,300 L180,310 L185,320 L195,330 L200,340 L210,350 L215,360 L220,380 L225,400 L220,420 L210,440 L200,460 L190,470 L185,480 L180,500 L175,520 L165,540 L155,550 L150,540 L145,520 L148,500 L150,480 L155,460 L160,440 L158,420 L150,400 L145,380 L140,360 L135,340 L125,320 L120,300 L118,280 L120,260 L125,240 L135,220 L140,200 L150,180 L155,160 L150,140 L148,120 L150,100 L155,80 L165,65 L175,55 Z"
                fill="#e63946"
                stroke="#e63946"
                strokeWidth="1"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-black text-white">{countries.length}</div>
                <div className="text-sm font-medium text-gray-400">Países cubiertos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Country grid */}
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {countries.map((country, i) => (
            <div key={i} className="country-card rounded-xl p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-2xl">{country.flag}</span>
                <h4 className="text-sm font-semibold text-white">{country.name}</h4>
              </div>
              <div className="flex flex-wrap gap-1">
                {country.sources.map((source, j) => (
                  <span
                    key={j}
                    className="rounded-md bg-[#0a0f1e]/50 px-2 py-0.5 text-[10px] text-gray-500"
                  >
                    {source}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          La cobertura se expande continuamente. USGS y EMSC proporcionan datos globales para todos los países.
          <br />
          Las fuentes locales ofrecen mayor precisión y velocidad de detección en cada región.
        </p>
      </div>
    </section>
  );
}
