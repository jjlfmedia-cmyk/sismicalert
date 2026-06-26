"use client";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DownloadModal({ isOpen, onClose, onConfirm }: DownloadModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#1a1f2e] p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-white"
          aria-label="Cerrar"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Icon */}
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e63946]/10">
          <svg className="h-7 w-7 text-[#e63946]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        <h3 className="mb-2 text-xl font-bold text-white">Antes de instalar — Información importante</h3>

        <p className="mb-4 text-sm leading-relaxed text-gray-300">
          Es posible que tu teléfono muestre un aviso de seguridad al instalar este archivo. Esto es{" "}
          <strong className="text-white">completamente normal</strong> cuando una aplicación se instala fuera de
          Google Play Store. SismoAlerta América es una aplicación de seguridad pública, sin código malicioso,
          desarrollada con el único propósito de alertarte ante sismos. No recopila datos sensibles ni espía tu
          dispositivo.
        </p>

        <div className="mb-6 rounded-xl bg-[#0a0f1e] p-4">
          <h4 className="mb-3 text-sm font-semibold text-white">📋 Pasos de instalación:</h4>
          <ol className="space-y-2 text-sm text-gray-300">
            <li className="flex gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e63946]/20 text-xs font-bold text-[#e63946]">1</span>
              Descarga el archivo APK en tu teléfono
            </li>
            <li className="flex gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e63946]/20 text-xs font-bold text-[#e63946]">2</span>
              Abre el archivo desde tus descargas
            </li>
            <li className="flex gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e63946]/20 text-xs font-bold text-[#e63946]">3</span>
              Si aparece &quot;Aplicación bloqueada&quot;, toca &quot;Más información&quot; o &quot;Instalar de todas formas&quot;
            </li>
            <li className="flex gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e63946]/20 text-xs font-bold text-[#e63946]">4</span>
              Si te pide activar &quot;Fuentes desconocidas&quot;, ve a Ajustes → Seguridad y actívalo
            </li>
            <li className="flex gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e63946]/20 text-xs font-bold text-[#e63946]">5</span>
              Toca &quot;Instalar&quot; y espera que termine
            </li>
            <li className="flex gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e63946]/20 text-xs font-bold text-[#e63946]">6</span>
              Abre la app y concede los permisos que solicita (son necesarios para detectar sismos)
            </li>
          </ol>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onConfirm}
            className="btn-download flex-1 rounded-xl px-6 py-3 text-sm font-semibold text-white"
          >
            ✅ Entendido, descargar
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-gray-400 transition-colors hover:border-white/20 hover:text-white"
          >
            ❌ Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
