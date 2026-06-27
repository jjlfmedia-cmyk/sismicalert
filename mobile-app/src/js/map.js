// SismoAlerta America - Map Module with Seismic Wave Animation
import { getMagnitudeColor, formatDateTime, timeAgo, calculateDistance } from './utils.js';

let map = null;
let markersLayer = null;
let userMarker = null;
let waveAnimationLayer = null;

// Dark map tiles
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_ATTRIBUTION = 'OpenStreetMap contributors, CARTO';

/**
 * Initialize the map
 */
export function initMap(containerId = 'map') {
  if (map) return map;
  
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('Map container not found');
    return null;
  }
  
  // Initialize Leaflet map centered on Americas
  map = L.map(containerId, {
    center: [10, -80],
    zoom: 3,
    minZoom: 2,
    maxZoom: 18,
    zoomControl: false,
    attributionControl: false
  });
  
  // Add dark tiles
  L.tileLayer(TILE_URL, {
    attribution: TILE_ATTRIBUTION,
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);
  
  // Add zoom control to bottom right
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  
  // Create layers
  markersLayer = L.layerGroup().addTo(map);
  waveAnimationLayer = L.layerGroup().addTo(map);
  
  // Handle resize
  setTimeout(() => map.invalidateSize(), 100);
  
  return map;
}

/**
 * Update earthquake markers on map
 */
export function updateMapMarkers(earthquakes) {
  if (!map || !markersLayer) {
    console.warn('Map not initialized');
    return;
  }
  
  // Clear existing markers
  markersLayer.clearLayers();
  
  // Add new markers
  earthquakes.forEach(eq => {
    const color = getMarkerColor(eq.magnitude);
    const size = getMarkerSize(eq.magnitude);
    
    const marker = L.circleMarker([eq.latitude, eq.longitude], {
      radius: size,
      fillColor: color,
      color: '#fff',
      weight: 1,
      opacity: 0.9,
      fillOpacity: 0.7
    });
    
    // Create popup content without emojis
    const popupContent = `
      <div style="font-family: -apple-system, sans-serif; min-width: 180px; color: #fff;">
        <div style="font-size: 24px; font-weight: 800; color: ${color}; margin-bottom: 4px;">
          M ${eq.magnitude.toFixed(1)}
        </div>
        <div style="font-size: 14px; font-weight: 500; margin-bottom: 8px;">
          ${eq.place || 'Ubicacion desconocida'}
        </div>
        <div style="font-size: 12px; color: #a0aec0;">
          <p>Tiempo: ${timeAgo(eq.time)}</p>
          <p>Coord: ${eq.latitude.toFixed(2)}, ${eq.longitude.toFixed(2)}</p>
          <p>Profundidad: ${eq.depth?.toFixed(0) || 'N/A'} km</p>
          <p>Fuente: ${eq.source}</p>
        </div>
      </div>
    `;
    
    marker.bindPopup(popupContent, {
      className: 'dark-popup'
    });
    
    markersLayer.addLayer(marker);
    
    // Add static pulse effect for recent large earthquakes
    if (eq.magnitude >= 5 && Date.now() - eq.time < 3600000) {
      addStaticPulseEffect(eq.latitude, eq.longitude, color);
    }
  });
}

/**
 * Get marker color based on magnitude
 */
function getMarkerColor(magnitude) {
  if (magnitude >= 6) return '#e63946';
  if (magnitude >= 5) return '#f77f00';
  if (magnitude >= 4) return '#fcbf49';
  return '#2a9d8f';
}

/**
 * Get marker size based on magnitude
 */
function getMarkerSize(magnitude) {
  if (magnitude >= 7) return 16;
  if (magnitude >= 6) return 12;
  if (magnitude >= 5) return 10;
  if (magnitude >= 4) return 8;
  return 6;
}

/**
 * Add static pulse effect
 */
function addStaticPulseEffect(lat, lon, color) {
  const pulseIcon = L.divIcon({
    className: 'pulse-marker',
    html: `
      <div style="
        width: 30px;
        height: 30px;
        background: ${color};
        border-radius: 50%;
        opacity: 0.4;
        animation: pulse-map 2s ease-out infinite;
      "></div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
  
  const pulseMarker = L.marker([lat, lon], { icon: pulseIcon, interactive: false });
  markersLayer.addLayer(pulseMarker);
}

/**
 * Simulate seismic waves expanding from epicenter
 */
export function simulateSeismicWaves(lat, lon, magnitude, duration = 10000) {
  if (!map || !waveAnimationLayer) return;
  
  console.log(`Simulating seismic waves at ${lat}, ${lon} with M${magnitude}`);
  
  // Center map on epicenter
  map.setView([lat, lon], 6);
  
  // Clear previous animations
  waveAnimationLayer.clearLayers();
  
  // Add epicenter marker
  const epicenterIcon = L.divIcon({
    className: 'epicenter-marker',
    html: `
      <div class="epicenter-dot" style="
        width: 20px;
        height: 20px;
        background: #e63946;
        border: 3px solid #fff;
        border-radius: 50%;
        box-shadow: 0 0 20px #e63946;
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
  
  const epicenter = L.marker([lat, lon], { icon: epicenterIcon });
  waveAnimationLayer.addLayer(epicenter);
  
  // Create expanding wave circles
  const waveCount = 5;
  const waveInterval = duration / waveCount;
  const maxRadius = magnitude * 50000; // meters
  
  for (let i = 0; i < waveCount; i++) {
    setTimeout(() => {
      createExpandingWave(lat, lon, maxRadius, duration - (i * waveInterval));
    }, i * waveInterval);
  }
  
  // Clean up after animation
  setTimeout(() => {
    waveAnimationLayer.clearLayers();
  }, duration + 2000);
}

/**
 * Create a single expanding wave
 */
function createExpandingWave(lat, lon, maxRadius, duration) {
  const wave = L.circle([lat, lon], {
    radius: 0,
    color: '#e63946',
    fillColor: '#e63946',
    fillOpacity: 0.3,
    weight: 2,
    opacity: 0.8
  });
  
  waveAnimationLayer.addLayer(wave);
  
  const startTime = Date.now();
  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const currentRadius = progress * maxRadius;
    const opacity = 0.8 * (1 - progress);
    const fillOpacity = 0.3 * (1 - progress);
    
    wave.setRadius(currentRadius);
    wave.setStyle({
      opacity: opacity,
      fillOpacity: fillOpacity
    });
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      waveAnimationLayer.removeLayer(wave);
    }
  };
  
  requestAnimationFrame(animate);
}

/**
 * Set user location on map
 */
export function setUserLocation(lat, lon) {
  if (!map) return;
  
  // Remove existing user marker
  if (userMarker) {
    map.removeLayer(userMarker);
  }
  
  // Create user marker
  const userIcon = L.divIcon({
    className: 'user-marker',
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background: #3b82f6;
        border: 3px solid #fff;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
  
  userMarker = L.marker([lat, lon], { icon: userIcon })
    .bindPopup('Tu ubicacion')
    .addTo(map);
}

/**
 * Center map on user location
 */
export function centerOnUser(lat, lon) {
  if (!map) return;
  map.setView([lat, lon], 8);
}

/**
 * Center map on a specific earthquake and open its popup
 */
export function centerOnEarthquake(lat, lon, zoom = 7) {
  if (!map) return;
  map.setView([lat, lon], zoom);
  markersLayer.eachLayer(layer => {
    if (layer.getLatLng) {
      const pos = layer.getLatLng();
      if (Math.abs(pos.lat - lat) < 0.02 && Math.abs(pos.lng - lon) < 0.02) {
        setTimeout(() => layer.openPopup(), 350);
      }
    }
  });
}

/**
 * Refresh map size
 */
export function refreshMap() {
  if (map) {
    setTimeout(() => map.invalidateSize(), 100);
  }
}

/**
 * Simulate a random earthquake for testing
 */
export function simulateRandomEarthquake() {
  // Random location in Americas
  const lat = -30 + Math.random() * 60; // -30 to 30
  const lon = -120 + Math.random() * 50; // -120 to -70
  const magnitude = 5 + Math.random() * 2.5; // 5.0 to 7.5
  
  console.log(`Simulating earthquake at ${lat.toFixed(2)}, ${lon.toFixed(2)} with M${magnitude.toFixed(1)}`);
  
  // Show waves on map
  simulateSeismicWaves(lat, lon, magnitude, 15000);
  
  return {
    latitude: lat,
    longitude: lon,
    magnitude: magnitude,
    place: 'Simulacion de sismo de prueba',
    time: Date.now(),
    depth: 10 + Math.random() * 50,
    source: 'Sistema de Prueba'
  };
}

// Add CSS for map animations
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse-map {
    0% { transform: scale(1); opacity: 0.4; }
    100% { transform: scale(3); opacity: 0; }
  }
  
  .dark-popup .leaflet-popup-content-wrapper {
    background: #1a1f2e;
    color: #fff;
    border-radius: 12px;
  }
  
  .dark-popup .leaflet-popup-tip {
    background: #1a1f2e;
  }
  
  .epicenter-dot {
    animation: epicenter-pulse 1s ease-in-out infinite;
  }
  
  @keyframes epicenter-pulse {
    0%, 100% { transform: scale(1); box-shadow: 0 0 20px #e63946; }
    50% { transform: scale(1.2); box-shadow: 0 0 40px #e63946; }
  }
`;
document.head.appendChild(style);
