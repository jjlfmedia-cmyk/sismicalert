// SismoAlerta America - Main App Module
import { fetchAllEarthquakes, filterByPeriod, calculateStats } from './api.js';
import { 
  initAlertPlugins,
  requestAllPermissions,
  showAlert, 
  showTsunamiAlert,
  hideAlert, 
  getAlertHistory, 
  showAreYouOKModal, 
  hideAreYouOKModal,
  activateRescueMode,
  deactivateRescueMode,
  isRescueModeActive,
  sendNotification,
  scheduleTestAlert
} from './alerts.js';
import { 
  initMap, 
  updateMapMarkers, 
  setUserLocation, 
  centerOnUser, 
  refreshMap,
  simulateSeismicWaves,
  simulateRandomEarthquake
} from './map.js';
import { 
  Storage, 
  timeAgo, 
  getMagnitudeColor, 
  getAlertLevel, 
  calculateDistance,
  getRiskLevel,
  getCountryFromCoords,
  formatDateTime,
  sleep
} from './utils.js';

// App state
let earthquakes = [];
let userLocation = null;
let pollingInterval = null;
let isInitialized = false;

// Default settings
const DEFAULT_SETTINGS = {
  minMagnitude: 4.0,
  alertRadius: 300,
  alarmVolume: 100,
  overrideSilence: true,
  flashEnabled: true,
  tsunamiAlerts: true,
  accelerometerEnabled: true,
  autoRescue: true,
  bootStart: true,
  batterySaver: false,
  scheduledTest: false,
  testTime: '09:00',
  language: 'es',
  country: 'auto'
};

/**
 * Initialize the app
 */
async function initApp() {
  console.log('SismoAlerta America - Initializing...');
  
  const splash = document.getElementById('splash-screen');
  
  try {
    // Initialize settings
    initSettings();
    
    // Initialize alert plugins
    const pluginsReady = await initAlertPlugins();
    
    // Show permission modal if needed
    const hasPermissions = Storage.get('permissionsGranted', false);
    if (!hasPermissions) {
      await showPermissionModal();
    }
    
    // Setup event listeners
    setupEventListeners();
    
    // Get user location
    await getUserLocation();
    
    // Fetch initial earthquake data
    await refreshEarthquakeData();
    
    // Initialize map
    initMap();
    
    // Start polling
    startPolling();
    
    // Start accelerometer if enabled
    const settings = getSettings();
    if (settings.accelerometerEnabled) {
      startAccelerometerMonitoring();
    }
    
    // Schedule test if enabled
    if (settings.scheduledTest && settings.testTime) {
      scheduleTestAlert(settings.testTime);
    }
    
    // Check for active rescue mode
    if (isRescueModeActive()) {
      document.getElementById('rescue-inactive').classList.add('hidden');
      document.getElementById('rescue-active').classList.remove('hidden');
    }
    
    isInitialized = true;
    console.log('App initialized successfully');
    
  } catch (error) {
    console.error('Initialization error:', error);
  } finally {
    // Hide splash screen
    setTimeout(() => {
      splash.classList.add('fade-out');
      setTimeout(() => splash.remove(), 500);
    }, 1500);
  }
}

/**
 * Show permission modal
 */
async function showPermissionModal() {
  return new Promise((resolve) => {
    const modal = document.getElementById('permission-modal');
    const btn = document.getElementById('btn-grant-permissions');
    
    modal.classList.remove('hidden');
    
    btn.addEventListener('click', async () => {
      btn.disabled = true;
      btn.textContent = 'Solicitando permisos...';
      
      const results = await requestAllPermissions();
      
      // Check if all granted
      const allGranted = results.location && results.notification;
      
      if (allGranted) {
        Storage.set('permissionsGranted', true);
        modal.classList.add('hidden');
        resolve(true);
      } else {
        btn.disabled = false;
        btn.textContent = 'Reintentar';
        // Still allow to continue
        setTimeout(() => {
          modal.classList.add('hidden');
          resolve(false);
        }, 2000);
      }
    });
  });
}

/**
 * Initialize settings from storage
 */
function initSettings() {
  const saved = Storage.get('settings');
  if (!saved) {
    Storage.set('settings', DEFAULT_SETTINGS);
  }
  updateSettingsUI();
}

/**
 * Get current settings
 */
function getSettings() {
  return Storage.get('settings', DEFAULT_SETTINGS);
}

/**
 * Update settings UI elements
 */
function updateSettingsUI() {
  const settings = getSettings();
  
  // Sliders
  const minMagSlider = document.getElementById('setting-min-mag');
  const radiusSlider = document.getElementById('setting-radius');
  const volumeSlider = document.getElementById('setting-volume');
  
  if (minMagSlider) {
    minMagSlider.value = settings.minMagnitude;
    document.getElementById('min-mag-value').textContent = settings.minMagnitude.toFixed(1);
  }
  
  if (radiusSlider) {
    radiusSlider.value = settings.alertRadius;
    document.getElementById('radius-value').textContent = `${settings.alertRadius} km`;
  }
  
  if (volumeSlider) {
    volumeSlider.value = settings.alarmVolume;
    document.getElementById('volume-value').textContent = `${settings.alarmVolume}%`;
  }
  
  // Toggles
  const toggles = {
    'setting-override-silence': 'overrideSilence',
    'setting-flash': 'flashEnabled',
    'setting-tsunami': 'tsunamiAlerts',
    'setting-accelerometer': 'accelerometerEnabled',
    'setting-auto-rescue': 'autoRescue',
    'setting-boot-start': 'bootStart',
    'setting-battery-saver': 'batterySaver',
    'setting-scheduled-test': 'scheduledTest'
  };
  
  for (const [id, key] of Object.entries(toggles)) {
    const el = document.getElementById(id);
    if (el) el.checked = settings[key] ?? DEFAULT_SETTINGS[key];
  }
  
  // Time input
  const timeInput = document.getElementById('setting-test-time');
  if (timeInput) timeInput.value = settings.testTime || '09:00';
  
  // Selects
  const countrySelect = document.getElementById('setting-country');
  if (countrySelect) countrySelect.value = settings.country || 'auto';
}

/**
 * Save settings
 */
function saveSettings(key, value) {
  const settings = getSettings();
  settings[key] = value;
  Storage.set('settings', settings);
}

/**
 * Get user location
 */
async function getUserLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation not available');
      document.getElementById('user-location').textContent = 'Ubicacion no disponible';
      resolve(null);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        
        updateLocationDisplay();
        resolve(userLocation);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        document.getElementById('user-location').textContent = 'Ubicacion no disponible';
        resolve(null);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

/**
 * Update location display
 */
function updateLocationDisplay() {
  if (!userLocation) return;
  
  const country = getCountryFromCoords(userLocation.latitude, userLocation.longitude);
  document.getElementById('user-location').textContent = country.name;
  
  // Update emergency number
  const flagEl = document.getElementById('country-flag');
  const nameEl = document.querySelector('.country-name');
  const phoneEl = document.querySelector('.phone-number');
  
  if (flagEl) flagEl.textContent = country.code;
  if (nameEl) nameEl.textContent = country.name;
  if (phoneEl) {
    phoneEl.textContent = country.emergency;
    phoneEl.href = `tel:${country.emergency}`;
  }
}

/**
 * Refresh earthquake data
 */
async function refreshEarthquakeData() {
  try {
    updateConnectionStatus(true);
    
    const result = await fetchAllEarthquakes();
    earthquakes = result.earthquakes;
    
    // Update last update time
    document.getElementById('last-update').textContent = 
      `Actualizado ${new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}`;
    
    // Update UI
    updateDashboard();
    updateMapMarkers(earthquakes);
    
    // Check for alerts
    checkForAlerts(earthquakes);
    
  } catch (error) {
    console.error('Error fetching earthquake data:', error);
    updateConnectionStatus(false);
  }
}

/**
 * Update connection status indicator
 */
function updateConnectionStatus(online) {
  const status = document.getElementById('connection-status');
  if (online) {
    status.className = 'connection-status online';
    status.querySelector('.status-text').textContent = 'Conectado';
  } else {
    status.className = 'connection-status offline';
    status.querySelector('.status-text').textContent = 'Sin conexion';
  }
}

/**
 * Update dashboard with earthquake data
 */
function updateDashboard() {
  const settings = getSettings();
  const last24h = filterByPeriod(earthquakes, 'day');
  
  // Update recent quakes list
  const recentList = document.getElementById('recent-quakes');
  const recentQuakes = last24h.slice(0, 5);
  
  if (recentQuakes.length === 0) {
    recentList.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <p>Sin actividad sismica reciente</p>
      </div>
    `;
  } else {
    recentList.innerHTML = recentQuakes.map(eq => {
      const color = getMagnitudeColor(eq.magnitude);
      const distance = userLocation 
        ? Math.round(calculateDistance(userLocation.latitude, userLocation.longitude, eq.latitude, eq.longitude))
        : null;
      
      return `
        <div class="quake-item">
          <div class="quake-mag ${color}">${eq.magnitude.toFixed(1)}</div>
          <div class="quake-info">
            <div class="quake-place">${eq.place || 'Ubicacion desconocida'}</div>
            <div class="quake-meta">
              <span>${timeAgo(eq.time)}</span>
              ${distance ? `<span>${distance} km</span>` : ''}
              <span>${eq.source}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
  
  // Update stats
  const stats = calculateStats(last24h, userLocation?.latitude, userLocation?.longitude);
  document.getElementById('stat-total').textContent = stats.total;
  document.getElementById('stat-major').textContent = stats.major;
  document.getElementById('stat-nearby').textContent = stats.nearby;
  document.getElementById('stat-max').textContent = stats.maxMagnitude > 0 ? stats.maxMagnitude.toFixed(1) : '--';
  
  // Update risk level
  updateRiskIndicator(last24h);
}

/**
 * Update risk indicator
 */
function updateRiskIndicator(earthquakes) {
  if (!userLocation) return;
  
  const riskLevel = getRiskLevel(earthquakes, userLocation.latitude, userLocation.longitude);
  const indicator = document.getElementById('risk-indicator');
  const circle = indicator.querySelector('.risk-circle');
  const levelText = indicator.querySelector('.risk-level');
  
  circle.className = 'risk-circle';
  
  switch (riskLevel) {
    case 'CRITICO':
      circle.classList.add('red');
      break;
    case 'ALTO':
      circle.classList.add('orange');
      break;
    case 'MODERADO':
      circle.classList.add('yellow');
      break;
    default:
      circle.classList.add('green');
  }
  
  levelText.textContent = riskLevel;
}

/**
 * Check for new alerts
 */
function checkForAlerts(earthquakes) {
  if (!userLocation) return;
  
  const settings = getSettings();
  const lastCheck = Storage.get('lastAlertCheck', 0);
  
  // Check only new earthquakes since last check
  const newQuakes = earthquakes.filter(eq => eq.time > lastCheck);
  
  for (const eq of newQuakes) {
    const distance = calculateDistance(
      userLocation.latitude, 
      userLocation.longitude, 
      eq.latitude, 
      eq.longitude
    );
    
    const level = getAlertLevel(eq.magnitude, distance, settings);
    
    if (level !== 'none' && level !== 'green') {
      const alertData = {
        ...eq,
        distance
      };
      
      // Show alert based on level
      if (level === 'red') {
        showAlert('red', alertData);
        
        // Schedule "Are you OK?" check for major quakes
        if (eq.magnitude >= 6 && distance < 300 && settings.autoRescue) {
          setTimeout(() => {
            if (!isRescueModeActive()) {
              showAreYouOKModal(eq.magnitude);
            }
          }, 8 * 60 * 1000); // 8 minutes
        }
        
        // Check for tsunami risk (coastal + large magnitude + shallow)
        if (eq.magnitude >= 7 && eq.depth < 70 && settings.tsunamiAlerts) {
          setTimeout(() => {
            showTsunamiAlert({
              magnitude: eq.magnitude,
              place: eq.place,
              height: `${(eq.magnitude - 5).toFixed(1)}m estimado`,
              level: 'EVACUACION INMEDIATA'
            });
          }, 2000);
        }
        
      } else if (level === 'orange') {
        showAlert('orange', alertData);
      } else if (level === 'yellow') {
        sendNotification(
          'Aviso Sismico',
          `Sismo M${eq.magnitude.toFixed(1)} a ${Math.round(distance)} km - ${eq.place}`
        );
      }
    }
  }
  
  Storage.set('lastAlertCheck', Date.now());
}

/**
 * Start polling for earthquake data
 */
function startPolling() {
  const settings = getSettings();
  const interval = settings.batterySaver ? 120000 : 45000;
  
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
  
  pollingInterval = setInterval(refreshEarthquakeData, interval);
  console.log(`Polling started: every ${interval/1000}s`);
}

/**
 * Start accelerometer monitoring
 */
function startAccelerometerMonitoring() {
  if (!window.DeviceMotionEvent) {
    console.warn('Accelerometer not available');
    return;
  }
  
  let highAccelCount = 0;
  const THRESHOLD = 3.5;
  const DURATION_THRESHOLD = 5;
  
  window.addEventListener('devicemotion', (event) => {
    const acc = event.accelerationIncludingGravity;
    if (!acc) return;
    
    const total = Math.sqrt(acc.x**2 + acc.y**2 + acc.z**2);
    const deviation = Math.abs(total - 9.81);
    
    if (deviation > THRESHOLD) {
      highAccelCount++;
      
      if (highAccelCount >= DURATION_THRESHOLD) {
        console.log('Seismic motion detected via accelerometer!');
        handleLocalSeismicDetection(deviation);
        highAccelCount = 0;
      }
    } else {
      highAccelCount = Math.max(0, highAccelCount - 1);
    }
  });
  
  console.log('Accelerometer monitoring started');
}

/**
 * Handle local seismic detection
 */
function handleLocalSeismicDetection(intensity) {
  const recentQuakes = earthquakes.filter(eq => {
    if (!userLocation) return false;
    const age = Date.now() - eq.time;
    const distance = calculateDistance(
      userLocation.latitude, userLocation.longitude,
      eq.latitude, eq.longitude
    );
    return age < 300000 && distance < 200;
  });
  
  if (recentQuakes.length > 0 || intensity > 5) {
    sendNotification(
      'Deteccion Local',
      'Se detecto movimiento sismico a traves del sensor de tu dispositivo.'
    );
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Tab navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const tab = item.dataset.tab;
      switchTab(tab);
    });
  });
  
  // Alert dismiss buttons
  document.getElementById('alert-dismiss').addEventListener('click', hideAlert);
  document.getElementById('tsunami-dismiss').addEventListener('click', hideAlert);
  
  // Are You OK buttons
  document.getElementById('btn-im-ok').addEventListener('click', () => {
    hideAreYouOKModal();
    sendNotification('Nos alegra que estes bien!', 'Mantente alerta ante posibles replicas.');
  });
  
  document.getElementById('btn-need-help').addEventListener('click', () => {
    hideAreYouOKModal();
    activateRescueMode();
  });
  
  document.getElementById('btn-more-time').addEventListener('click', () => {
    hideAreYouOKModal();
    setTimeout(() => {
      showAreYouOKModal(6.0);
    }, 5 * 60 * 1000);
  });
  
  // Rescue buttons
  document.getElementById('btn-im-safe')?.addEventListener('click', deactivateRescueMode);
  
  // Map controls
  document.getElementById('map-locate')?.addEventListener('click', () => {
    if (userLocation) {
      centerOnUser(userLocation.latitude, userLocation.longitude);
    }
  });
  
  document.getElementById('map-refresh')?.addEventListener('click', () => {
    refreshEarthquakeData();
  });
  
  document.getElementById('map-simulate')?.addEventListener('click', () => {
    runMapSimulation();
  });
  
  document.getElementById('map-period')?.addEventListener('change', (e) => {
    const filtered = filterByPeriod(earthquakes, e.target.value);
    updateMapMarkers(filtered);
  });
  
  // Alert history filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderAlertHistory(btn.dataset.filter);
    });
  });
  
  // Guide tabs
  document.querySelectorAll('.guide-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.guide-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.guide-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`guide-${tab.dataset.guide}`).classList.add('active');
    });
  });
  
  // Settings sliders
  document.getElementById('setting-min-mag')?.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    document.getElementById('min-mag-value').textContent = val.toFixed(1);
    saveSettings('minMagnitude', val);
  });
  
  document.getElementById('setting-radius')?.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    document.getElementById('radius-value').textContent = `${val} km`;
    saveSettings('alertRadius', val);
  });
  
  document.getElementById('setting-volume')?.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    document.getElementById('volume-value').textContent = `${val}%`;
    saveSettings('alarmVolume', val);
  });
  
  // Settings toggles
  const toggleHandlers = {
    'setting-override-silence': 'overrideSilence',
    'setting-flash': 'flashEnabled',
    'setting-tsunami': 'tsunamiAlerts',
    'setting-accelerometer': 'accelerometerEnabled',
    'setting-auto-rescue': 'autoRescue',
    'setting-boot-start': 'bootStart',
    'setting-battery-saver': 'batterySaver',
    'setting-scheduled-test': 'scheduledTest'
  };
  
  for (const [id, key] of Object.entries(toggleHandlers)) {
    document.getElementById(id)?.addEventListener('change', (e) => {
      saveSettings(key, e.target.checked);
      
      if (key === 'batterySaver') {
        startPolling();
      }
      
      if (key === 'scheduledTest' && e.target.checked) {
        const time = document.getElementById('setting-test-time').value;
        scheduleTestAlert(time);
      }
    });
  }
  
  document.getElementById('setting-test-time')?.addEventListener('change', (e) => {
    saveSettings('testTime', e.target.value);
    const settings = getSettings();
    if (settings.scheduledTest) {
      scheduleTestAlert(e.target.value);
    }
  });
  
  // Test mode buttons
  document.getElementById('test-mode-btn')?.addEventListener('click', () => switchTab('test'));
  document.getElementById('btn-test-mode')?.addEventListener('click', () => switchTab('test'));
  document.getElementById('btn-close-test')?.addEventListener('click', () => switchTab('settings'));
  
  // Test alerts
  document.getElementById('test-red')?.addEventListener('click', () => runTestAlert('red'));
  document.getElementById('test-orange')?.addEventListener('click', () => runTestAlert('orange'));
  document.getElementById('test-yellow')?.addEventListener('click', () => runTestAlert('yellow'));
  document.getElementById('test-tsunami')?.addEventListener('click', () => runTestTsunami());
  document.getElementById('test-rescue')?.addEventListener('click', () => runTestRescue());
  document.getElementById('test-map-simulation')?.addEventListener('click', () => {
    switchTab('map');
    setTimeout(runMapSimulation, 500);
  });
}

/**
 * Switch active tab
 */
function switchTab(tabId) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.tab === tabId);
  });
  
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === `tab-${tabId}`);
  });
  
  if (tabId === 'map') {
    refreshMap();
    if (userLocation) {
      setUserLocation(userLocation.latitude, userLocation.longitude);
    }
  }
  
  if (tabId === 'alerts') {
    renderAlertHistory('all');
  }
}

/**
 * Render alert history
 */
function renderAlertHistory(filter = 'all') {
  const history = getAlertHistory();
  const container = document.getElementById('alerts-list');
  
  const filtered = filter === 'all' 
    ? history 
    : history.filter(a => a.level === filter);
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <p>No hay alertas ${filter !== 'all' ? 'de este tipo' : ''}</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = filtered.map(alert => {
    const color = getMagnitudeColor(alert.magnitude);
    return `
      <div class="alert-history-item level-${alert.level}">
        <div class="alert-history-mag bg-${color}">${alert.magnitude.toFixed(1)}</div>
        <div class="alert-history-info">
          <div class="alert-history-place">${alert.place || 'Ubicacion desconocida'}</div>
          <div class="alert-history-meta">
            ${formatDateTime(alert.receivedAt)} - ${Math.round(alert.distance)} km
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Run test alert
 */
async function runTestAlert(level) {
  const testData = {
    magnitude: level === 'red' ? 7.1 : level === 'orange' ? 5.4 : 4.2,
    place: 'Simulacion de prueba del sistema',
    distance: level === 'red' ? 45 : level === 'orange' ? 120 : 80,
    time: Date.now(),
    depth: 15,
    source: 'Sistema de Prueba'
  };
  
  showAlert(level, testData, true);
  
  // Auto-dismiss after 15 seconds
  await sleep(15000);
  hideAlert();
  
  sendNotification(
    'Prueba completada',
    `Asi se vera y escuchara una alerta de nivel ${level.toUpperCase()}.`
  );
}

/**
 * Run tsunami test
 */
async function runTestTsunami() {
  showTsunamiAlert({
    magnitude: 8.2,
    place: 'Costa del Pacifico (simulacion)',
    height: '3.5m estimado',
    level: 'EVACUACION INMEDIATA'
  }, true);
  
  await sleep(15000);
  hideAlert();
  
  sendNotification('Prueba completada', 'Asi se vera una alerta de tsunami.');
}

/**
 * Run test rescue mode
 */
function runTestRescue() {
  showAreYouOKModal(6.5, true);
}

/**
 * Run map simulation
 */
function runMapSimulation() {
  const simData = simulateRandomEarthquake();
  
  // Also show alert
  setTimeout(() => {
    showAlert('red', {
      ...simData,
      distance: 50
    }, true);
  }, 2000);
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Handle visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    refreshEarthquakeData();
  }
});

// Handle online/offline events
window.addEventListener('online', () => {
  updateConnectionStatus(true);
  refreshEarthquakeData();
});

window.addEventListener('offline', () => {
  updateConnectionStatus(false);
});
