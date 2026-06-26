# 📱 Guía Completa para Compilar el APK de SismoAlerta América

Esta guía te llevará paso a paso desde cero hasta tener el APK listo para distribuir.

---

## 📋 REQUISITOS PREVIOS

### 1. Instalar Node.js (versión 18 o superior)

**Windows:**
1. Ve a https://nodejs.org/
2. Descarga la versión LTS (Long Term Support)
3. Ejecuta el instalador y sigue los pasos
4. Reinicia tu computadora

**Mac:**
```bash
# Usando Homebrew
brew install node
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Verificar instalación:**
```bash
node --version   # Debe mostrar v18.x.x o superior
npm --version    # Debe mostrar 9.x.x o superior
```

---

### 2. Instalar Java JDK 17

**Windows:**
1. Ve a https://adoptium.net/
2. Descarga "Temurin 17 (LTS)" para Windows
3. Ejecuta el instalador
4. Durante la instalación, marca "Set JAVA_HOME variable"

**Mac:**
```bash
brew install openjdk@17
```

**Linux:**
```bash
sudo apt install openjdk-17-jdk
```

**Verificar instalación:**
```bash
java --version   # Debe mostrar openjdk 17.x.x
```

---

### 3. Instalar Android Studio

1. Ve a https://developer.android.com/studio
2. Descarga Android Studio para tu sistema operativo
3. Ejecuta el instalador
4. Durante la instalación, asegúrate de instalar:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (opcional, para emulador)

**Configurar Android Studio por primera vez:**
1. Abre Android Studio
2. Haz clic en "More Actions" → "SDK Manager"
3. En la pestaña "SDK Platforms":
   - Marca "Android 14.0 (UpsideDownCake)" o la más reciente
   - Marca "Android 7.0 (Nougat)" - API Level 24 (mínimo requerido)
4. En la pestaña "SDK Tools":
   - Marca "Android SDK Build-Tools"
   - Marca "Android SDK Command-line Tools"
   - Marca "Android SDK Platform-Tools"
5. Haz clic en "Apply" y espera que se descargue todo

---

### 4. Configurar Variables de Entorno

**Windows:**
1. Busca "Variables de entorno" en el menú inicio
2. Haz clic en "Variables de entorno..."
3. En "Variables del sistema", añade:
   - `ANDROID_HOME` = `C:\Users\TU_USUARIO\AppData\Local\Android\Sdk`
   - `JAVA_HOME` = `C:\Program Files\Eclipse Adoptium\jdk-17.x.x`
4. Edita la variable `Path` y añade:
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\tools`
   - `%ANDROID_HOME%\tools\bin`

**Mac/Linux:** Añade esto a tu `~/.bashrc` o `~/.zshrc`:
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

Luego ejecuta:
```bash
source ~/.bashrc   # o source ~/.zshrc
```

---

## 🚀 COMPILACIÓN DEL APK

### Paso 1: Navegar al directorio del proyecto

Abre una terminal (Command Prompt, PowerShell, o Terminal) y navega al directorio:

```bash
cd ruta/hacia/tu/proyecto/mobile-app
```

Por ejemplo:
```bash
# Windows
cd C:\Users\TuUsuario\Proyectos\sismoalerta\mobile-app

# Mac/Linux
cd ~/Proyectos/sismoalerta/mobile-app
```

---

### Paso 2: Instalar dependencias de Node.js

```bash
npm install
```

Esto instalará todas las dependencias listadas en `package.json`:
- @capacitor/core
- @capacitor/android
- @capacitor/geolocation
- @capacitor/local-notifications
- @capacitor/haptics
- @capacitor/motion
- @capacitor/network
- @capacitor/device
- @capacitor/preferences
- @capacitor-community/torch

**Espera a que termine.** Verás algo como:
```
added 150 packages in 45s
```

---

### Paso 3: Agregar la plataforma Android

```bash
npx cap add android
```

Esto creará la carpeta `android/` con todo el proyecto Android nativo.

**Salida esperada:**
```
✔ Adding native android project in android in 5.23s
✔ Syncing Gradle...
✔ add in 8.45s
```

---

### Paso 4: Sincronizar archivos web con Android

```bash
npx cap sync android
```

Esto copia los archivos de `src/` al proyecto Android y sincroniza los plugins.

**Salida esperada:**
```
✔ Copying web assets from src to android/app/src/main/assets/public in 245ms
✔ Creating capacitor.config.json in android/app/src/main/assets in 2ms
✔ copy android in 312ms
✔ Updating Android plugins in 15ms
✔ update android in 1.23s
```

---

### Paso 5: Abrir el proyecto en Android Studio

```bash
npx cap open android
```

Esto abrirá Android Studio con el proyecto cargado.

**Primera vez que abres el proyecto:**
1. Android Studio te pedirá que descargues algunas dependencias de Gradle
2. Haz clic en "OK" o "Sync Now" si aparece un banner amarillo
3. Espera a que termine la sincronización (puede tardar varios minutos la primera vez)
4. En la esquina inferior derecha verás el progreso

---

### Paso 6: Verificar que todo compiló correctamente

1. En Android Studio, ve a **Build → Make Project** (o presiona Ctrl+F9 / Cmd+F9)
2. Espera a que termine
3. En la parte inferior, en "Build Output", debe decir:
   ```
   BUILD SUCCESSFUL in Xs
   ```

Si hay errores, revisa:
- Que Java 17 esté correctamente configurado
- Que el Android SDK esté instalado
- Que las variables de entorno estén correctas

---

### Paso 7: Generar el APK firmado

#### Opción A: APK de Debug (para pruebas)

En Android Studio:
1. Ve a **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Espera a que termine
3. Aparecerá una notificación "APK(s) generated successfully"
4. Haz clic en "locate" para abrir la carpeta

El APK estará en:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

#### Opción B: APK de Release (para distribución)

**Primero, crear un Keystore (solo la primera vez):**

1. En Android Studio, ve a **Build → Generate Signed Bundle / APK**
2. Selecciona "APK" y haz clic en "Next"
3. Haz clic en "Create new..." para crear un nuevo keystore
4. Llena los campos:
   - **Key store path:** Elige dónde guardar el archivo (ej: `sismoalerta-key.jks`)
   - **Password:** Crea una contraseña segura (GUÁRDALA, la necesitarás siempre)
   - **Alias:** `sismoalerta`
   - **Password (del alias):** Puede ser la misma u otra
   - **Validity (years):** 25 (o más)
   - **Certificate:**
     - First and Last Name: `JJLF Media`
     - Organization: `JJLF Media`
     - City: `Buctzotz`
     - State: `Yucatan`
     - Country Code: `MX`
5. Haz clic en "OK"

**Generar el APK firmado:**

1. Ahora en la ventana de firma, selecciona tu keystore
2. Ingresa las contraseñas
3. Haz clic en "Next"
4. Selecciona:
   - Build Variants: **release**
   - Signature Versions: Marca **V1 (Jar Signature)** y **V2 (Full APK Signature)**
5. Haz clic en "Create"
6. Espera a que termine

El APK firmado estará en:
```
android/app/build/outputs/apk/release/app-release.apk
```

---

### Paso 8: Renombrar el APK (opcional)

Renombra el APK para distribución:

**Windows (Command Prompt):**
```cmd
cd android\app\build\outputs\apk\release
rename app-release.apk SismoAlerta-America-v1.0.0.apk
```

**Mac/Linux:**
```bash
cd android/app/build/outputs/apk/release
mv app-release.apk SismoAlerta-America-v1.0.0.apk
```

---

## ✅ VERIFICACIÓN

### Probar el APK en un dispositivo real:

1. **Conecta tu teléfono Android por USB**
2. En tu teléfono, activa "Depuración USB" en Opciones de desarrollador
3. En Android Studio, tu dispositivo aparecerá en la barra superior
4. Haz clic en el botón ▶️ (Run) para instalar y ejecutar

### Probar en un emulador:

1. En Android Studio, ve a **Tools → Device Manager**
2. Haz clic en "Create Device"
3. Selecciona un teléfono (ej: Pixel 6)
4. Selecciona una imagen del sistema (ej: API 33)
5. Haz clic en "Finish"
6. Inicia el emulador y ejecuta la app

---

## 🔧 SOLUCIÓN DE PROBLEMAS COMUNES

### Error: "SDK location not found"
```
Crea un archivo `local.properties` en la carpeta `android/` con:
sdk.dir=C:\\Users\\TU_USUARIO\\AppData\\Local\\Android\\Sdk
(En Windows usa \\\\ en lugar de \\)
```

### Error: "Gradle sync failed"
1. En Android Studio: **File → Invalidate Caches / Restart**
2. Selecciona "Invalidate and Restart"
3. Espera a que reinicie y vuelva a sincronizar

### Error: "Java version mismatch"
1. En Android Studio: **File → Project Structure → SDK Location**
2. Verifica que "JDK location" apunte a Java 17

### Error: "AAPT2 error"
```bash
# Limpia el proyecto y vuelve a compilar
cd android
./gradlew clean
./gradlew assembleDebug
```

### La app no se instala en el teléfono:
1. Asegúrate de haber activado "Instalar desde fuentes desconocidas"
2. Ve a Ajustes → Seguridad → Fuentes desconocidas → Activa para tu navegador/explorador de archivos

---

## 📦 DISTRIBUCIÓN

Una vez tengas el APK listo:

1. **Súbelo a tu sitio web** para descarga directa
2. **Compártelo por Google Drive, Dropbox, etc.**
3. **Envíalo por Telegram, WhatsApp** (cuidado con límites de tamaño)

El APK firmado con release es el que debes distribuir. El APK de debug es solo para pruebas durante desarrollo.

---

## 📝 NOTAS IMPORTANTES

- **GUARDA TU KEYSTORE** en un lugar seguro. Si lo pierdes, no podrás actualizar la app.
- **GUARDA LAS CONTRASEÑAS** del keystore. Sin ellas no podrás firmar actualizaciones.
- El APK de release está optimizado y es más pequeño que el de debug.
- Cada vez que hagas cambios en el código, debes ejecutar `npx cap sync android` antes de compilar.

---

## 🔄 ACTUALIZAR LA APP

Cuando hagas cambios en el código:

```bash
# 1. Sincronizar cambios
npx cap sync android

# 2. Abrir Android Studio
npx cap open android

# 3. Build → Generate Signed Bundle / APK → APK
# (Usa el mismo keystore para que sea reconocida como actualización)
```

---

## 💬 SOPORTE

Si tienes problemas:
- **Email:** jjlfmedia@gmail.com
- **Proyecto:** JJLF Media - Buctzotz, Yucatán, México

---

*¡Listo! Ahora tienes tu APK de SismoAlerta América compilado y listo para salvar vidas.* 🌎🔴
