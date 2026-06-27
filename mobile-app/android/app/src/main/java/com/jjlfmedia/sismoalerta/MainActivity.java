package com.jjlfmedia.sismoalerta;

import android.content.Context;
import android.media.AudioManager;
import android.os.Build;
import android.os.Bundle;
import android.os.PowerManager;
import android.view.Window;
import android.view.WindowManager;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

public class MainActivity extends BridgeActivity {

    private PowerManager.WakeLock wakeLock;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Despertar la pantalla y mostrar encima de pantalla de bloqueo
        Window window = getWindow();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
        } else {
            window.addFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED
                    | WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON);
        }
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
                | WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD);

        // Registrar el plugin nativo inline
        registerPlugin(NativeAudioHelper.class);
    }

    @CapacitorPlugin(name = "NativeAudioHelper")
    public static class NativeAudioHelper extends Plugin {

        @PluginMethod
        public void forceMaxVolume(PluginCall call) {
            try {
                Context context = getContext();
                AudioManager audioManager = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
                if (audioManager != null) {
                    // Salir del modo silencio si está activo
                    audioManager.setRingerMode(AudioManager.RINGER_MODE_NORMAL);
                    audioManager.setMode(AudioManager.MODE_NORMAL);
                    audioManager.setSpeakerphoneOn(true);
                    
                    // Poner volumen al máximo en canal de música (multimedia)
                    int maxMusic = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
                    audioManager.setStreamVolume(AudioManager.STREAM_MUSIC, maxMusic, AudioManager.FLAG_PLAY_SOUND);

                    // Poner volumen al máximo en canal de alarma
                    int maxAlarm = audioManager.getStreamMaxVolume(AudioManager.STREAM_ALARM);
                    audioManager.setStreamVolume(AudioManager.STREAM_ALARM, maxAlarm, AudioManager.FLAG_PLAY_SOUND);
                }
                call.resolve();
            } catch (Exception e) {
                call.reject(e.getMessage());
            }
        }

        @PluginMethod
        public void acquireWakeLock(PluginCall call) {
            try {
                Context context = getContext();
                PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
                if (pm != null) {
                    MainActivity activity = (MainActivity) getActivity();
                    if (activity.wakeLock != null && activity.wakeLock.isHeld()) {
                        activity.wakeLock.release();
                    }
                    activity.wakeLock = pm.newWakeLock(
                        PowerManager.SCREEN_BRIGHT_WAKE_LOCK | PowerManager.ACQUIRE_CAUSES_WAKEUP | PowerManager.ON_AFTER_RELEASE,
                        "SismoAlerta::WakelockTag"
                    );
                    activity.wakeLock.acquire(45000); // Expiración a los 45 seg
                }
                call.resolve();
            } catch (Exception e) {
                call.reject(e.getMessage());
            }
        }

        @PluginMethod
        public void requestBatteryBypass(PluginCall call) {
            try {
                Context context = getContext();
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    android.content.Intent intent = new android.content.Intent();
                    String packageName = context.getPackageName();
                    PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
                    if (pm != null && !pm.isIgnoringBatteryOptimizations(packageName)) {
                        intent.setAction(android.provider.Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
                        intent.setData(android.net.Uri.parse("package:" + packageName));
                        intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
                        context.startActivity(intent);
                    }
                }
                call.resolve();
            } catch (Exception e) {
                call.reject(e.getMessage());
            }
        }
    }
}
