// SismoAlerta América - Utility Functions

/**
 * Sleep for a given number of milliseconds
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @returns distance in kilometers
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Get time ago string from timestamp
 */
export function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `hace ${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `hace ${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `hace ${days}d`;
}

/**
 * Get alert level based on magnitude and distance
 */
export function getAlertLevel(magnitude, distanceKm, settings) {
  const minMag = settings.minMagnitude || 4.0;
  const maxRadius = settings.alertRadius || 300;
  
  if (magnitude < minMag) return 'none';
  
  if (magnitude >= 6.0 && distanceKm <= 300) return 'red';
  if (magnitude >= 6.0 && distanceKm <= 600) return 'orange';
  if (magnitude >= 5.0 && distanceKm <= maxRadius) return 'orange';
  if (magnitude >= 4.0 && distanceKm <= maxRadius) return 'yellow';
  
  return 'green';
}

/**
 * Get magnitude color class
 */
export function getMagnitudeColor(mag) {
  if (mag >= 6) return 'red';
  if (mag >= 5) return 'orange';
  if (mag >= 4) return 'yellow';
  return 'green';
}

/**
 * Get risk level based on nearby activity
 */
export function getRiskLevel(earthquakes, userLat, userLon) {
  if (!earthquakes || earthquakes.length === 0) return 'BAJO';
  
  const last24h = Date.now() - 24 * 60 * 60 * 1000;
  const recent = earthquakes.filter(eq => eq.time > last24h);
  
  let maxRisk = 0;
  for (const eq of recent) {
    const dist = calculateDistance(userLat, userLon, eq.latitude, eq.longitude);
    if (eq.magnitude >= 6 && dist < 500) maxRisk = Math.max(maxRisk, 4);
    else if (eq.magnitude >= 5 && dist < 300) maxRisk = Math.max(maxRisk, 3);
    else if (eq.magnitude >= 4 && dist < 200) maxRisk = Math.max(maxRisk, 2);
    else if (dist < 100) maxRisk = Math.max(maxRisk, 1);
  }
  
  if (maxRisk >= 4) return 'CRÍTICO';
  if (maxRisk >= 3) return 'ALTO';
  if (maxRisk >= 2) return 'MODERADO';
  if (maxRisk >= 1) return 'BAJO';
  return 'BAJO';
}

/**
 * Format coordinates
 */
export function formatCoords(lat, lon) {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(2)}°${latDir}, ${Math.abs(lon).toFixed(2)}°${lonDir}`;
}

/**
 * Get country from coordinates (simplified)
 */
export function getCountryFromCoords(lat, lon) {
  // Simplified country detection based on bounding boxes
  const countries = [
    { code: 'MX', name: 'México', flag: '🇲🇽', bounds: { minLat: 14, maxLat: 33, minLon: -118, maxLon: -86 }, emergency: '911' },
    { code: 'US', name: 'Estados Unidos', flag: '🇺🇸', bounds: { minLat: 24, maxLat: 50, minLon: -125, maxLon: -66 }, emergency: '911' },
    { code: 'CA', name: 'Canadá', flag: '🇨🇦', bounds: { minLat: 42, maxLat: 84, minLon: -141, maxLon: -52 }, emergency: '911' },
    { code: 'VE', name: 'Venezuela', flag: '🇻🇪', bounds: { minLat: 0, maxLat: 12, minLon: -73, maxLon: -60 }, emergency: '171' },
    { code: 'CO', name: 'Colombia', flag: '🇨🇴', bounds: { minLat: -4, maxLat: 14, minLon: -82, maxLon: -66 }, emergency: '123' },
    { code: 'CL', name: 'Chile', flag: '🇨🇱', bounds: { minLat: -56, maxLat: -17, minLon: -76, maxLon: -66 }, emergency: '132' },
    { code: 'AR', name: 'Argentina', flag: '🇦🇷', bounds: { minLat: -56, maxLat: -21, minLon: -74, maxLon: -53 }, emergency: '911' },
    { code: 'PE', name: 'Perú', flag: '🇵🇪', bounds: { minLat: -18, maxLat: 0, minLon: -82, maxLon: -68 }, emergency: '115' },
    { code: 'EC', name: 'Ecuador', flag: '🇪🇨', bounds: { minLat: -5, maxLat: 2, minLon: -81, maxLon: -75 }, emergency: '911' },
    { code: 'GT', name: 'Guatemala', flag: '🇬🇹', bounds: { minLat: 13, maxLat: 18, minLon: -93, maxLon: -88 }, emergency: '122' },
    { code: 'CR', name: 'Costa Rica', flag: '🇨🇷', bounds: { minLat: 8, maxLat: 11, minLon: -86, maxLon: -82 }, emergency: '911' },
    { code: 'PA', name: 'Panamá', flag: '🇵🇦', bounds: { minLat: 7, maxLat: 10, minLon: -83, maxLon: -77 }, emergency: '911' },
    { code: 'BR', name: 'Brasil', flag: '🇧🇷', bounds: { minLat: -34, maxLat: 6, minLon: -74, maxLon: -34 }, emergency: '193' },
    { code: 'BO', name: 'Bolivia', flag: '🇧🇴', bounds: { minLat: -23, maxLat: -9, minLon: -70, maxLon: -57 }, emergency: '110' },
    { code: 'PR', name: 'Puerto Rico', flag: '🇵🇷', bounds: { minLat: 17, maxLat: 19, minLon: -68, maxLon: -65 }, emergency: '911' },
    { code: 'DO', name: 'República Dominicana', flag: '🇩🇴', bounds: { minLat: 17, maxLat: 20, minLon: -72, maxLon: -68 }, emergency: '911' },
    { code: 'SV', name: 'El Salvador', flag: '🇸🇻', bounds: { minLat: 13, maxLat: 15, minLon: -90, maxLon: -87 }, emergency: '911' },
    { code: 'HN', name: 'Honduras', flag: '🇭🇳', bounds: { minLat: 13, maxLat: 17, minLon: -90, maxLon: -83 }, emergency: '911' },
    { code: 'NI', name: 'Nicaragua', flag: '🇳🇮', bounds: { minLat: 10, maxLat: 15, minLon: -88, maxLon: -82 }, emergency: '118' },
    { code: 'CU', name: 'Cuba', flag: '🇨🇺', bounds: { minLat: 19, maxLat: 24, minLon: -85, maxLon: -74 }, emergency: '106' },
  ];
  
  for (const country of countries) {
    const { minLat, maxLat, minLon, maxLon } = country.bounds;
    if (lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon) {
      return country;
    }
  }
  
  // Default to Mexico if not found
  return countries[0];
}

/**
 * Generate unique ID for deduplication
 */
export function generateQuakeId(lat, lon, time, magnitude) {
  // Round to reduce precision for matching
  const roundedLat = Math.round(lat * 10);
  const roundedLon = Math.round(lon * 10);
  const roundedTime = Math.round(time / 60000); // Round to minute
  const roundedMag = Math.round(magnitude * 10);
  return `${roundedLat}_${roundedLon}_${roundedTime}_${roundedMag}`;
}

/**
 * Deduplicate earthquakes from multiple sources
 */
export function deduplicateQuakes(earthquakes) {
  const seen = new Map();
  const result = [];
  
  for (const eq of earthquakes) {
    const id = generateQuakeId(eq.latitude, eq.longitude, eq.time, eq.magnitude);
    if (!seen.has(id)) {
      seen.set(id, true);
      result.push(eq);
    }
  }
  
  return result.sort((a, b) => b.time - a.time);
}

/**
 * Format date time
 */
export function formatDateTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString('es', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Local storage helpers
 */
export const Storage = {
  get(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  },
  
  remove(key) {
    localStorage.removeItem(key);
  }
};

/**
 * Vibration patterns
 */
export const VibrationPatterns = {
  red: [500, 200, 500, 200, 500, 200, 500],
  orange: [300, 100, 300, 100, 300],
  yellow: [200, 100, 200],
  notification: [100]
};
