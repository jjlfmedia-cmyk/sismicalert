// SismoAlerta America - Alerts Module with Native Audio Control
import { sleep, VibrationPatterns, Storage, formatDateTime, getCountryFromCoords } from './utils.js';

// Alert state
let currentAlert = null;
let alertAudio = null;
let isTestMode = false;
let flashInterval = null;
let originalVolume = 0;

// Capacitor plugins
let Haptics = null;
let LocalNotifications = null;
let Torch = null;
let Device = null;
let Geolocation = null;

// Audio context for maximum volume
let audioContext = null;
let gainNode = null;

/**
 * Initialize Capacitor plugins
 */
export async function initAlertPlugins() {
  try {
    if (window.Capacitor && window.Capacitor.isNativePlatform()) {
      const modules = await Promise.all([
        import('@capacitor/haptics'),
        import('@capacitor/local-notifications'),
        import('@capawesome/capacitor-torch'),
        import('@capacitor/device')
      ]);
      
      Haptics = modules[0].Haptics;
      LocalNotifications = modules[1].LocalNotifications;
      Torch = modules[2].Torch;
      Device = modules[3].Device;
      
      // Dynamic import for geolocation to keep sync platform clean
      const geoModule = await import('@capacitor/geolocation');
      Geolocation = geoModule.Geolocation;
      
      // Request notification permissions
      const result = await LocalNotifications.requestPermissions();
      console.log('Notification permissions:', result);
      
      // Create notification channel for Android
      await LocalNotifications.createChannel({
        id: 'seismic_alerts',
        name: 'Alertas Sismicas',
        description: 'Notificaciones de alertas sismicas en tiempo real',
        importance: 5, // IMPORTANCE_HIGH
        visibility: 1, // PUBLIC
        sound: 'alert_sound.wav',
        vibration: true,
        lights: true,
        lightColor: '#e63946'
      });
      
      console.log('Alert plugins initialized successfully');
      return true;
    }
  } catch (e) {
    console.warn('Could not initialize native plugins:', e);
  }
  return false;
}

/**
 * Request all necessary permissions
 */
export async function requestAllPermissions() {
  const results = {
    location: false,
    notification: false,
    audio: true
  };
  
  // Request native GPS permission explicitly via Capacitor Geolocation
  if (Geolocation) {
    try {
      const status = await Geolocation.requestPermissions();
      results.location = status.location === 'granted';
      updatePermissionUI('perm-location', results.location);
    } catch (e) {
      console.warn('Native location permission error:', e);
      updatePermissionUI('perm-location', false);
    }
  } else if (navigator.geolocation) {
    try {
      await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 });
      });
      results.location = true;
      updatePermissionUI('perm-location', true);
    } catch (e) {
      updatePermissionUI('perm-location', false);
    }
  }
  
  // Request notification permission
  if (LocalNotifications) {
    try {
      const perm = await LocalNotifications.requestPermissions();
      results.notification = perm.display === 'granted';
      updatePermissionUI('perm-notification', results.notification);
    } catch (e) {
      console.warn('Notification permission error:', e);
      updatePermissionUI('perm-notification', false);
    }
  }
  
  updatePermissionUI('perm-audio', true);
  
  return results;
}

/**
 * Update permission UI status
 */
function updatePermissionUI(elementId, granted) {
  const el = document.querySelector(`#${elementId} .perm-status`);
  if (el) {
    el.textContent = granted ? 'Concedido' : 'Denegado';
    el.className = `perm-status ${granted ? 'granted' : 'denied'}`;
  }
}

/**
 * Initialize Web Audio API for maximum volume
 */
function initAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
  }
  return audioContext;
}

/**
 * Play alert sound at maximum volume using real WAV files
 */
async function playAlertSoundMaxVolume(level) {
  try {
    stopAlertSound();
    
    // Invocar el helper nativo para forzar volumen e ignorar silencio en Android
    if (window.Capacitor && window.Capacitor.isNativePlatform()) {
      try {
        await window.Capacitor.Plugins.NativeAudioHelper.forceMaxVolume();
      } catch (err) {
        console.warn('Native override silence error:', err);
      }
    }
    
    // Map levels to actual WAV files
    const soundMap = {
      'red': 'assets/alert_red.wav',
      'orange': 'assets/alert_orange.wav',
      'yellow': 'assets/alert_yellow.wav',
      'tsunami': 'assets/alert_tsunami.wav'
    };
    
    const src = soundMap[level] || soundMap['yellow'];
    alertAudio = new Audio(src);
    alertAudio.volume = 1.0;
    alertAudio.loop = (level === 'red' || level === 'tsunami');
    await alertAudio.play().catch(e => console.warn('Audio play failed:', e));
    console.log(`Playing ${level} alert sound: ${src}`);
  } catch (e) {
    console.error('Error playing alert sound:', e);
  }
}

/**
 * Stop alert sound
 */
function stopAlertSound() {
  if (alertAudio) {
    try {
      if (alertAudio.stop) {
        alertAudio.stop();
      } else if (alertAudio.pause) {
        alertAudio.pause();
      }
    } catch (e) {
      // Ignore
    }
    alertAudio = null;
  }
}

/**
 * Trigger flash/torch
 */
async function triggerFlash(level) {
  if (!Torch) {
    console.log('Torch plugin not available');
    return;
  }
  
  try {
    const { isAvailable } = await Torch.isAvailable();
    if (!isAvailable) {
      console.log('Flash not available on this device');
      return;
    }
    
    console.log(`Triggering flash for ${level} alert`);
    
    if (level === 'red' || level === 'tsunami') {
      // SOS pattern: 3 short, 3 long, 3 short
      await flashSOS();
    } else if (level === 'orange') {
      // 5 quick flashes
      await flash5();
    }
  } catch (e) {
    console.warn('Flash error:', e);
  }
}

/**
 * Flash SOS pattern
 */
async function flashSOS() {
  if (!Torch) return;
  
  const short = 200;
  const long = 600;
  const gap = 200;
  
  try {
    // S: 3 short
    for (let i = 0; i < 3; i++) {
      await Torch.enable();
      await sleep(short);
      await Torch.disable();
      await sleep(gap);
    }
    
    await sleep(gap * 2);
    
    // O: 3 long
    for (let i = 0; i < 3; i++) {
      await Torch.enable();
      await sleep(long);
      await Torch.disable();
      await sleep(gap);
    }
    
    await sleep(gap * 2);
    
    // S: 3 short
    for (let i = 0; i < 3; i++) {
      await Torch.enable();
      await sleep(short);
      await Torch.disable();
      await sleep(gap);
    }
    
    console.log('SOS flash pattern completed');
  } catch (e) {
    console.warn('SOS flash error:', e);
    await Torch.disable().catch(() => {});
  }
}

/**
 * Flash 5 times quickly
 */
async function flash5() {
  if (!Torch) return;
  
  try {
    for (let i = 0; i < 5; i++) {
      await Torch.enable();
      await sleep(150);
      await Torch.disable();
      await sleep(150);
    }
    console.log('5-flash pattern completed');
  } catch (e) {
    console.warn('Flash5 error:', e);
    await Torch.disable().catch(() => {});
  }
}

/**
 * Trigger vibration
 */
async function triggerVibration(level) {
  const patterns = {
    red: [500, 200, 500, 200, 500, 200, 500, 200, 500],
    tsunami: [1000, 300, 1000, 300, 1000, 300, 1000],
    orange: [300, 100, 300, 100, 300],
    yellow: [200, 100, 200]
  };
  
  const pattern = patterns[level] || [200];
  
  if (Haptics) {
    try {
      // Use Capacitor Haptics for stronger vibration
      for (let i = 0; i < pattern.length; i++) {
        if (i % 2 === 0) {
          await Haptics.vibrate({ duration: pattern[i] });
        } else {
          await sleep(pattern[i]);
        }
        if (!currentAlert) break;
      }
    } catch (e) {
      // Fallback to navigator.vibrate
      if (navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    }
  } else if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

/**
 * Show full screen alert
 */
export async function showAlert(level, data, isTest = false) {
  isTestMode = isTest;
  currentAlert = { level, data, time: Date.now() };
  
  const overlay = document.getElementById('alert-overlay');
  const title = document.getElementById('alert-title');
  const magnitude = document.getElementById('alert-magnitude');
  const message = document.getElementById('alert-message');
  const details = document.getElementById('alert-details');
  const testBanner = document.getElementById('test-banner');
  
  // Set content based on level
  overlay.className = `alert-overlay level-${level}`;
  
  if (level === 'red') {
    title.textContent = 'ALERTA SISMICA INMEDIATA';
  } else if (level === 'orange') {
    title.textContent = 'ALERTA ALTA';
  } else {
    title.textContent = 'AVISO SISMICO';
  }
  
  magnitude.textContent = `M ${data.magnitude.toFixed(1)}`;
  
  const prefix = isTest ? 'SIMULACION - Magnitud' : 'Magnitud';
  if (isTest) {
    message.textContent = `${prefix}: ${data.magnitude.toFixed(1)} - Distancia simulada: ${data.distance} km`;
  } else {
    const distanceText = data.distance < 100 
      ? `ZONA DE RIESGO - A solo ${Math.round(data.distance)} km de ti`
      : `A ${Math.round(data.distance)} km de tu ubicacion`;
    message.textContent = distanceText;
  }
  
  details.innerHTML = `
    <p><strong>Ubicacion:</strong> ${data.place || 'Region desconocida'}</p>
    <p><strong>Hora:</strong> ${formatDateTime(data.time || Date.now())}</p>
    <p><strong>Profundidad:</strong> ${data.depth ? data.depth.toFixed(0) + ' km' : 'N/A'}</p>
    <p><strong>Fuente:</strong> ${data.source || 'Multiples APIs'}</p>
  `;
  
  testBanner.classList.toggle('hidden', !isTest);
  overlay.classList.remove('hidden');
  
  // Despertar la pantalla de bloqueo nativamente en Android
  if (window.Capacitor && window.Capacitor.isNativePlatform()) {
    try {
      await window.Capacitor.Plugins.NativeAudioHelper.acquireWakeLock();
    } catch(err) {}
  }
  
  // Trigger all alert effects
  const settings = Storage.get('settings', {});
  
  // Play sound at maximum volume
  if (settings.overrideSilence !== false) {
    await playAlertSoundMaxVolume(level);
  }
  
  // Vibration
  triggerVibration(level);
  
  // Flash
  if (settings.flashEnabled !== false && (level === 'red' || level === 'orange')) {
    triggerFlash(level);
  }
  
  // Save to history if not test
  if (!isTest) {
    saveAlertToHistory(level, data);
  }
}

/**
 * Show tsunami alert
 */
export async function showTsunamiAlert(data, isTest = false) {
  isTestMode = isTest;
  currentAlert = { level: 'tsunami', data, time: Date.now() };
  
  const overlay = document.getElementById('tsunami-overlay');
  const level = document.getElementById('tsunami-level');
  const message = document.getElementById('tsunami-message');
  
  level.textContent = data.level || 'EVACUACION INMEDIATA';
  
  if (isTest) {
    message.textContent = 'SIMULACION - Alerta de tsunami de prueba. Alejate de la costa.';
  } else {
    message.textContent = `Tsunami detectado. Altura estimada: ${data.height || 'desconocida'}. ${data.place || ''}`;
  }
  
  overlay.classList.remove('hidden');
  
  // Trigger all effects
  const settings = Storage.get('settings', {});
  
  if (settings.overrideSilence !== false) {
    await playAlertSoundMaxVolume('tsunami');
  }
  
  triggerVibration('tsunami');
  
  if (settings.flashEnabled !== false) {
    triggerFlash('tsunami');
  }
  
  if (!isTest) {
    saveAlertToHistory('tsunami', data);
  }
}

/**
 * Hide alert overlay
 */
export function hideAlert() {
  document.getElementById('alert-overlay').classList.add('hidden');
  document.getElementById('tsunami-overlay').classList.add('hidden');
  stopAlertEffects();
  currentAlert = null;
  isTestMode = false;
}

/**
 * Stop all alert effects
 */
function stopAlertEffects() {
  stopAlertSound();
  
  // Stop flash
  if (Torch) {
    Torch.disable().catch(() => {});
  }
  
  // Cancel alert state flag to break flash loops
  currentAlert = null;
  
  // Stop vibration
  if (Haptics) {
    Haptics.vibrate({ duration: 0 }).catch(() => {});
  }
  if (navigator.vibrate) {
    navigator.vibrate(0);
  }
}

/**
 * Save alert to history
 */
function saveAlertToHistory(level, data) {
  const history = Storage.get('alertHistory', []);
  
  history.unshift({
    id: Date.now(),
    level,
    magnitude: data.magnitude,
    place: data.place,
    distance: data.distance,
    time: data.time || Date.now(),
    receivedAt: Date.now()
  });
  
  // Keep only last 100 alerts
  if (history.length > 100) {
    history.pop();
  }
  
  Storage.set('alertHistory', history);
}

/**
 * Get alert history
 */
export function getAlertHistory() {
  return Storage.get('alertHistory', []);
}

/**
 * Send local notification that wakes screen and shows on lock screen
 */
export async function sendNotification(title, body, data = {}, isAlert = false) {
  if (LocalNotifications) {
    try {
      await LocalNotifications.schedule({
        notifications: [{
          id: Math.floor(Date.now() / 1000),
          title,
          body,
          channelId: 'seismic_alerts',
          ongoing: isAlert,
          autoCancel: !isAlert,
          sound: null,
          extra: data,
          // Mostrar en pantalla bloqueada
          visibility: 1, // PUBLIC
          // Prioridad máxima para despertar pantalla
          importance: 5
        }]
      });
    } catch (e) {
      console.warn('Notification error:', e);
    }
  } else if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body });
  }
}

/**
 * Show Are You OK modal
 */
export function showAreYouOKModal(magnitude, isTest = false) {
  const modal = document.getElementById('are-you-ok-modal');
  const magSpan = document.getElementById('ayu-magnitude');
  const testBanner = document.getElementById('ayu-test-banner');
  const countdown = document.getElementById('ayu-countdown');
  
  magSpan.textContent = magnitude.toFixed(1);
  testBanner.classList.toggle('hidden', !isTest);
  modal.classList.remove('hidden');
  
  // Play 'estás bien' sound
  try {
    stopAlertSound();
    alertAudio = new Audio('assets/estas_bien.wav');
    alertAudio.volume = 1.0;
    alertAudio.play().catch(e => console.warn('Are you ok sound failed:', e));
  } catch(e) {}
  
  
  if (!isTest) {
    // Start 3-minute countdown
    let remaining = 180;
    const timer = setInterval(() => {
      remaining--;
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      countdown.textContent = `Tiempo restante: ${mins}:${secs.toString().padStart(2, '0')}`;
      
      if (remaining <= 0) {
        clearInterval(timer);
        activateRescueMode();
        hideAreYouOKModal();
      }
    }, 1000);
    
    modal.dataset.timer = timer;
  }
}

/**
 * Hide Are You OK modal
 */
export function hideAreYouOKModal() {
  const modal = document.getElementById('are-you-ok-modal');
  modal.classList.add('hidden');
  stopAlertSound();
  
  if (modal.dataset.timer) {
    clearInterval(parseInt(modal.dataset.timer));
    delete modal.dataset.timer;
  }
}

/**
 * Activate rescue mode
 */
export function activateRescueMode() {
  console.log('Activating rescue mode...');
  Storage.set('rescueMode', {
    active: true,
    startTime: Date.now(),
    expiresAt: Date.now() + (5 * 60 * 60 * 1000) // 5 hours
  });
  
  document.getElementById('rescue-inactive').classList.add('hidden');
  document.getElementById('rescue-active').classList.remove('hidden');
  
  sendNotification(
    'Modo Rescate Activo',
    'Tu ubicacion esta siendo compartida para tu seguridad. Puedes desactivarlo en cualquier momento.'
  );
}

/**
 * Deactivate rescue mode
 */
export function deactivateRescueMode() {
  console.log('Deactivating rescue mode...');
  Storage.remove('rescueMode');
  
  document.getElementById('rescue-inactive').classList.remove('hidden');
  document.getElementById('rescue-active').classList.add('hidden');
}

/**
 * Check if rescue mode is active
 */
export function isRescueModeActive() {
  const rescueMode = Storage.get('rescueMode');
  if (!rescueMode || !rescueMode.active) return false;
  
  if (Date.now() > rescueMode.expiresAt) {
    deactivateRescueMode();
    return false;
  }
  
  return true;
}

/**
 * Schedule a test alert at specific time
 */
export function scheduleTestAlert(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  const now = new Date();
  const scheduledTime = new Date();
  
  // Forzar que el cálculo sea puramente en la zona horaria del dispositivo local
  scheduledTime.setHours(hours, minutes, 0, 0);
  
  if (scheduledTime.getTime() <= now.getTime()) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }
  
  const delay = scheduledTime.getTime() - now.getTime();
  
  console.log(`Simulacro programado localmente para: ${scheduledTime.toString()} (dentro de ${Math.round(delay/1000)}s)`);
  
  Storage.set('scheduledTest', {
    time: timeString,
    nextRun: scheduledTime.getTime()
  });
  
  // Limpiar cualquier timeout previo antes de programar
  if (window.testAlertTimeout) {
    clearTimeout(window.testAlertTimeout);
  }
  
  window.testAlertTimeout = setTimeout(() => {
    const testData = {
      magnitude: 6.5,
      place: 'Prueba programada automatica',
      distance: 50,
      time: Date.now(),
      depth: 10,
      source: 'Sistema de Prueba'
    };
    showAlert('red', testData, true);
    
    // Reprogramar para el día siguiente
    scheduleTestAlert(timeString);
  }, delay);
}
