# SismoAlerta América - Aplicación Android

Aplicación gratuita de alertas sísmicas en tiempo real para todo el continente americano. Sin anuncios, sin suscripciones, sin datos vendidos.

## 📱 Características

- **Alertas en tiempo real** de múltiples fuentes (USGS, EMSC, y más)
- **Sistema de niveles de color** (Rojo, Naranja, Amarillo, Verde)
- **Alertas que funcionan en silencio** y con pantalla apagada
- **Flash de emergencia** (patrón SOS para alertas rojas)
- **Sistema "¿Estás Bien?"** post-sismo con Modo Rescate
- **Detección sísmica local** mediante acelerómetro
- **Modo de prueba** para familiarizarse con las alertas
- **Mapa interactivo** con sismos en tiempo real

## 🛠️ Requisitos de Desarrollo

- Node.js 18+
- npm o yarn
- Android Studio (para compilar APK)
- JDK 17+

## 📦 Instalación

```bash
# Navegar al directorio de la app móvil
cd mobile-app

# Instalar dependencias
npm install

# Agregar plataforma Android
npx cap add android

# Sincronizar archivos web con Android
npx cap sync android

# Abrir en Android Studio
npx cap open android
```

## 🔨 Compilación del APK

### Opción 1: Desde Android Studio
1. Abrir el proyecto con `npx cap open android`
2. Build → Generate Signed Bundle / APK
3. Seleccionar APK
4. Crear o usar un keystore existente
5. Compilar versión release

### Opción 2: Desde línea de comandos
```bash
cd android

# APK de debug (para pruebas)
./gradlew assembleDebug

# APK firmada (para distribución)
./gradlew assembleRelease
```

El APK estará en: `android/app/build/outputs/apk/`

## 📁 Estructura del Proyecto

```
mobile-app/
├── src/
│   ├── index.html          # Página principal
│   ├── css/
│   │   └── styles.css      # Estilos de la app
│   └── js/
│       ├── app.js          # Módulo principal
│       ├── api.js          # APIs sísmicas
│       ├── alerts.js       # Sistema de alertas
│       ├── map.js          # Mapa interactivo
│       └── utils.js        # Utilidades
├── android/                 # Proyecto Android nativo
├── capacitor.config.ts     # Configuración Capacitor
└── package.json
```

## 🔧 Configuración

### Permisos Android
La app requiere los siguientes permisos (ya configurados en AndroidManifest.xml):

- `INTERNET` - Conexión a APIs
- `ACCESS_FINE_LOCATION` - Ubicación GPS
- `ACCESS_BACKGROUND_LOCATION` - Ubicación en segundo plano
- `FOREGROUND_SERVICE` - Servicio persistente
- `RECEIVE_BOOT_COMPLETED` - Inicio automático
- `POST_NOTIFICATIONS` - Alertas
- `USE_FULL_SCREEN_INTENT` - Alertas de pantalla completa
- `VIBRATE` - Vibración
- `MODIFY_AUDIO_SETTINGS` - Control de volumen
- `WAKE_LOCK` - Mantener pantalla encendida
- `CAMERA` - Flash de emergencia

### APIs Sísmicas Integradas

| Fuente | Cobertura | URL |
|--------|-----------|-----|
| USGS | Global | earthquake.usgs.gov |
| EMSC | Global | seismicportal.eu |
| CSN Chile | Chile | boostr.cl (wrapper) |
| SSN UNAM | México | (requiere proxy) |

## 🧪 Modo de Prueba

La app incluye un modo de prueba completo que permite simular:
- Alerta ROJA (con flash SOS, vibración, alarma)
- Alerta NARANJA (5 destellos de flash)
- Alerta AMARILLA
- Sistema "¿Estás Bien?" post-sismo

Accesible desde: Dashboard → "Probar el Sistema" o Ajustes → "Ir al Modo de Prueba"

## 📞 Contacto

- **Desarrollador:** JJLF Media
- **Email:** jjlfmedia@gmail.com
- **Ubicación:** Buctzotz, Yucatán, México

## 📄 Licencia

Este proyecto es **100% gratuito y de código abierto**.
Sin fines de lucro. Tu seguridad no tiene precio.

---

*Desarrollado con ❤️ para proteger vidas en América*
