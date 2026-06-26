// SismoAlerta América - API Module
import { deduplicateQuakes } from './utils.js';

const API_TIMEOUT = 5000;

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(url, timeout = API_TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Fetch from USGS API
 */
async function fetchUSGS() {
  try {
    const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson';
    const response = await fetchWithTimeout(url);
    const data = await response.json();
    
    return data.features
      .filter(f => {
        const [lon, lat] = f.geometry.coordinates;
        // Filter to Americas
        return lat >= -60 && lat <= 75 && lon >= -170 && lon <= -30;
      })
      .map(f => ({
        id: f.id,
        magnitude: f.properties.mag,
        place: f.properties.place,
        time: f.properties.time,
        latitude: f.geometry.coordinates[1],
        longitude: f.geometry.coordinates[0],
        depth: f.geometry.coordinates[2],
        source: 'USGS'
      }));
  } catch (error) {
    console.warn('USGS API error:', error.message);
    return [];
  }
}

/**
 * Fetch from EMSC (European-Mediterranean Seismological Centre)
 */
async function fetchEMSC() {
  try {
    const url = 'https://www.seismicportal.eu/fdsnws/event/1/query?format=json&limit=50&minlat=-60&maxlat=75&minlon=-170&maxlon=-30&orderby=time';
    const response = await fetchWithTimeout(url);
    const data = await response.json();
    
    return (data.features || []).map(f => ({
      id: `emsc-${f.properties.source_id || f.id}`,
      magnitude: f.properties.mag,
      place: f.properties.flynn_region,
      time: new Date(f.properties.time).getTime(),
      latitude: f.properties.lat,
      longitude: f.properties.lon,
      depth: f.properties.depth,
      source: 'EMSC'
    }));
  } catch (error) {
    console.warn('EMSC API error:', error.message);
    return [];
  }
}

/**
 * Fetch from SSN Mexico (simplified - may need CORS proxy in production)
 */
async function fetchSSNMexico() {
  try {
    // SSN doesn't have a public JSON API with CORS, so we'd need a proxy
    // For now, return empty (USGS covers Mexico well)
    return [];
  } catch (error) {
    console.warn('SSN Mexico API error:', error.message);
    return [];
  }
}

/**
 * Fetch from Chile CSN (via third-party API)
 */
async function fetchChileCSN() {
  try {
    // Try boostr.cl wrapper
    const url = 'https://api.boostr.cl/earthquakes.json';
    const response = await fetchWithTimeout(url);
    const data = await response.json();
    
    if (data.status === 'success' && data.data) {
      return data.data.slice(0, 20).map(eq => ({
        id: `csn-${eq.id || Date.now()}`,
        magnitude: parseFloat(eq.magnitude),
        place: eq.reference,
        time: new Date(eq.local_time).getTime(),
        latitude: parseFloat(eq.latitude),
        longitude: parseFloat(eq.longitude),
        depth: parseFloat(eq.depth),
        source: 'CSN Chile'
      }));
    }
    return [];
  } catch (error) {
    console.warn('Chile CSN API error:', error.message);
    return [];
  }
}

/**
 * Main function to fetch all earthquake data
 */
export async function fetchAllEarthquakes() {
  console.log('Fetching earthquake data from all sources...');
  
  const results = await Promise.allSettled([
    fetchUSGS(),
    fetchEMSC(),
    fetchSSNMexico(),
    fetchChileCSN()
  ]);
  
  const allQuakes = [];
  const sources = [];
  
  results.forEach((result, index) => {
    const sourceNames = ['USGS', 'EMSC', 'SSN México', 'CSN Chile'];
    if (result.status === 'fulfilled' && result.value.length > 0) {
      allQuakes.push(...result.value);
      sources.push(sourceNames[index]);
    }
  });
  
  const deduplicated = deduplicateQuakes(allQuakes);
  
  console.log(`Fetched ${deduplicated.length} earthquakes from ${sources.length} sources`);
  
  return {
    earthquakes: deduplicated,
    sources,
    timestamp: Date.now()
  };
}

/**
 * Filter earthquakes by time period
 */
export function filterByPeriod(earthquakes, period = 'day') {
  const now = Date.now();
  let cutoff;
  
  switch (period) {
    case 'hour':
      cutoff = now - 60 * 60 * 1000;
      break;
    case 'day':
      cutoff = now - 24 * 60 * 60 * 1000;
      break;
    case 'week':
      cutoff = now - 7 * 24 * 60 * 60 * 1000;
      break;
    case 'month':
      cutoff = now - 30 * 24 * 60 * 60 * 1000;
      break;
    default:
      cutoff = now - 24 * 60 * 60 * 1000;
  }
  
  return earthquakes.filter(eq => eq.time >= cutoff);
}

/**
 * Filter earthquakes by magnitude
 */
export function filterByMagnitude(earthquakes, minMag = 0) {
  return earthquakes.filter(eq => eq.magnitude >= minMag);
}

/**
 * Filter earthquakes by distance from user
 */
export function filterByDistance(earthquakes, userLat, userLon, maxDistanceKm) {
  const { calculateDistance } = require('./utils.js');
  
  return earthquakes.filter(eq => {
    const dist = calculateDistance(userLat, userLon, eq.latitude, eq.longitude);
    return dist <= maxDistanceKm;
  });
}

/**
 * Calculate statistics for earthquake data
 */
export function calculateStats(earthquakes, userLat, userLon) {
  const last24h = Date.now() - 24 * 60 * 60 * 1000;
  const recent = earthquakes.filter(eq => eq.time >= last24h);
  
  const stats = {
    total: recent.length,
    major: recent.filter(eq => eq.magnitude >= 5).length,
    nearby: 0,
    maxMagnitude: 0
  };
  
  if (userLat && userLon) {
    const { calculateDistance } = require('./utils.js');
    stats.nearby = recent.filter(eq => {
      const dist = calculateDistance(userLat, userLon, eq.latitude, eq.longitude);
      return dist <= 500;
    }).length;
  }
  
  if (recent.length > 0) {
    stats.maxMagnitude = Math.max(...recent.map(eq => eq.magnitude));
  }
  
  return stats;
}
