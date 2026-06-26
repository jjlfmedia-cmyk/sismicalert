"use client";

import { useState, useEffect } from "react";

interface Earthquake {
  id: string;
  magnitude: number;
  place: string;
  time: number;
  latitude: number;
  longitude: number;
  depth: number;
  source: string;
}

function getMagnitudeColor(mag: number): string {
  if (mag >= 6) return "#e63946";
  if (mag >= 5) return "#f77f00";
  if (mag >= 4) return "#fcbf49";
  return "#2a9d8f";
}

function getMagnitudeLabel(mag: number): string {
  if (mag >= 7) return "Mayor";
  if (mag >= 6) return "Fuerte";
  if (mag >= 5) return "Moderado";
  if (mag >= 4) return "Ligero";
  return "Menor";
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `hace ${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `hace ${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `hace ${days}d`;
}

export default function LiveEarthquakes() {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        const res = await fetch("/api/earthquakes?period=day&minmag=2.5");
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();
        if (mounted && data.ok) {
          setEarthquakes(data.earthquakes.slice(0, 20));
          setLastUpdate(data.timestamp);
          setError(false);
        }
      } catch {
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 60000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#e63946]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#e63946]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e63946] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e63946]" />
            </span>
            En vivo
          </span>
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Actividad Sísmica Reciente</h2>
          <p className="mx-auto max-w-2xl text-gray-400">
            Sismos registrados en las últimas 24 horas en el continente americano. Datos proporcionados por USGS y EMSC.
          </p>
          {lastUpdate && (
            <p className="mt-2 text-xs text-gray-600">
              Última actualización: {new Date(lastUpdate).toLocaleTimeString("es")} — Se actualiza cada 60 segundos
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e63946] border-t-transparent" />
            <span className="ml-3 text-gray-400">Cargando datos sísmicos...</span>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-[#e63946]/20 bg-[#e63946]/5 p-8 text-center">
            <p className="text-gray-400">
              No se pudieron cargar los datos sísmicos. Los servidores podrían estar temporalmente inaccesibles.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {earthquakes.map((eq) => (
              <div
                key={eq.id}
                className="glass-card group cursor-default rounded-xl p-4 transition-all hover:border-white/10"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-black text-white"
                    style={{ backgroundColor: getMagnitudeColor(eq.magnitude) }}
                  >
                    {eq.magnitude.toFixed(1)}
                  </div>
                  <div className="text-right">
                    <span
                      className="rounded-md px-2 py-0.5 text-[10px] font-semibold"
                      style={{
                        backgroundColor: `${getMagnitudeColor(eq.magnitude)}20`,
                        color: getMagnitudeColor(eq.magnitude),
                      }}
                    >
                      {getMagnitudeLabel(eq.magnitude)}
                    </span>
                  </div>
                </div>
                <h4 className="mb-1 text-sm font-medium text-white line-clamp-2">
                  {eq.place || "Ubicación desconocida"}
                </h4>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{timeAgo(eq.time)}</span>
                  <span>Prof. {eq.depth.toFixed(0)} km</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-gray-600">
                  <span>
                    {eq.latitude.toFixed(2)}°, {eq.longitude.toFixed(2)}°
                  </span>
                  <span className="rounded bg-white/5 px-1.5 py-0.5">{eq.source}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && earthquakes.length === 0 && (
          <div className="rounded-2xl border border-[#2a9d8f]/20 bg-[#2a9d8f]/5 p-8 text-center">
            <p className="text-gray-400">
              No se han registrado sismos significativos en las últimas horas. ¡Buenas noticias!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
