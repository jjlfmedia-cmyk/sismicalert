import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

interface USGSFeature {
  properties: {
    mag: number;
    place: string;
    time: number;
    url: string;
    title: string;
    type: string;
    tsunami: number;
    felt: number | null;
    sig: number;
    status: string;
    alert: string | null;
  };
  geometry: {
    coordinates: [number, number, number];
  };
  id: string;
}

interface USGSResponse {
  features: USGSFeature[];
  metadata: {
    generated: number;
    count: number;
    title: string;
  };
}

interface Earthquake {
  id: string;
  magnitude: number;
  place: string;
  time: number;
  url: string;
  latitude: number;
  longitude: number;
  depth: number;
  tsunami: number;
  felt: number | null;
  significance: number;
  status: string;
  alert: string | null;
  source: string;
}

// Americas bounding box: roughly -170 to -30 longitude, -60 to 75 latitude
const AMERICAS_BBOX = {
  minLat: -60,
  maxLat: 75,
  minLon: -170,
  maxLon: -30,
};

function isInAmericas(lat: number, lon: number): boolean {
  return (
    lat >= AMERICAS_BBOX.minLat &&
    lat <= AMERICAS_BBOX.maxLat &&
    lon >= AMERICAS_BBOX.minLon &&
    lon <= AMERICAS_BBOX.maxLon
  );
}

async function fetchUSGS(period: string, minMag: string): Promise<Earthquake[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const url = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${minMag}_${period}.geojson`;
    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const data: USGSResponse = await res.json();

    return data.features
      .filter((f) => {
        const [lon, lat] = f.geometry.coordinates;
        return isInAmericas(lat, lon);
      })
      .map((f) => ({
        id: f.id,
        magnitude: f.properties.mag,
        place: f.properties.place,
        time: f.properties.time,
        url: f.properties.url,
        latitude: f.geometry.coordinates[1],
        longitude: f.geometry.coordinates[0],
        depth: f.geometry.coordinates[2],
        tsunami: f.properties.tsunami,
        felt: f.properties.felt,
        significance: f.properties.sig,
        status: f.properties.status,
        alert: f.properties.alert,
        source: "USGS",
      }));
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchEMSC(): Promise<Earthquake[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const url =
      "https://www.seismicportal.eu/fdsnws/event/1/query?format=json&limit=50&minlat=-60&maxlat=75&minlon=-170&maxlon=-30&orderby=time";
    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 120 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    const features = data.features || [];

    return features.map((f: { properties: { source_id: string; mag: number; flynn_region: string; time: string; unid: string; lat: number; lon: number; depth: number; }; id: string }) => ({
      id: `emsc-${f.properties.source_id || f.id}`,
      magnitude: f.properties.mag,
      place: f.properties.flynn_region,
      time: new Date(f.properties.time).getTime(),
      url: `https://www.emsc-csem.org/Earthquake/earthquake.php?id=${f.properties.unid}`,
      latitude: f.properties.lat,
      longitude: f.properties.lon,
      depth: f.properties.depth,
      tsunami: 0,
      felt: null,
      significance: 0,
      status: "reviewed",
      alert: null,
      source: "EMSC",
    }));
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const period = searchParams.get("period") || "day";
  const minMag = searchParams.get("minmag") || "2.5";

  const validPeriods = ["hour", "day", "week", "month"];
  const validMags = ["1.0", "2.5", "4.5", "significant", "all"];

  const safePeriod = validPeriods.includes(period) ? period : "day";
  const safeMag = validMags.includes(minMag) ? minMag : "2.5";

  try {
    const [usgsData, emscData] = await Promise.all([
      fetchUSGS(safePeriod, safeMag),
      fetchEMSC(),
    ]);

    // Merge and deduplicate (prefer USGS data if both report same quake)
    const allQuakes = [...usgsData];
    const usgsIds = new Set(usgsData.map((q) => `${Math.round(q.latitude * 10)}_${Math.round(q.longitude * 10)}_${Math.round(q.time / 60000)}`));

    for (const q of emscData) {
      const key = `${Math.round(q.latitude * 10)}_${Math.round(q.longitude * 10)}_${Math.round(q.time / 60000)}`;
      if (!usgsIds.has(key)) {
        allQuakes.push(q);
      }
    }

    // Sort by time descending
    allQuakes.sort((a, b) => b.time - a.time);

    return Response.json({
      ok: true,
      count: allQuakes.length,
      earthquakes: allQuakes,
      sources: ["USGS", "EMSC"],
      timestamp: Date.now(),
    });
  } catch {
    return Response.json(
      { ok: false, error: "Error fetching earthquake data" },
      { status: 500 }
    );
  }
}
