import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Política de Privacidad — SismoAlerta América",
  description: "Política de privacidad de SismoAlerta América.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="mb-2 text-3xl font-bold text-white sm:text-4xl">Política de Privacidad</h1>
          <p className="mb-10 text-sm text-gray-500">Última actualización: Junio 2026</p>

          <div className="space-y-8 text-gray-400 leading-relaxed">
            <section>
              <h2 className="mb-3 text-xl font-semibold text-white">1. Datos que recopilamos</h2>
              <div className="space-y-3">
                <p>
                  <strong className="text-gray-300">Ubicación GPS:</strong> Se utiliza exclusivamente para determinar tu
                  proximidad a eventos sísmicos y enviarte alertas relevantes. Tu ubicación{" "}
                  <strong className="text-white">nunca se almacena en nuestros servidores</strong> en condiciones
                  normales. Solo se procesa localmente en tu dispositivo.
                </p>
                <p>
                  <strong className="text-gray-300">Email (opcional):</strong> Si decides registrarte, almacenamos tu
                  dirección de email únicamente para enviarte actualizaciones importantes de la aplicación.
                </p>
                <p>
                  <strong className="text-gray-300">Datos del acelerómetro:</strong> Se procesan exclusivamente en tu
                  dispositivo para la detección sísmica local. Estos datos <strong className="text-white">nunca se envían</strong>{" "}
                  a ningún servidor.
                </p>
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-white">2. Datos que NO recopilamos</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Contactos del teléfono</li>
                <li>Mensajes de texto o llamadas</li>
                <li>Fotos o archivos personales</li>
                <li>Historial de navegación</li>
                <li>Datos bancarios o financieros</li>
                <li>Ningún otro dato sensible o personal</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-white">3. Modo Rescate y ubicación</h2>
              <p>
                Durante el Modo Rescate (activado únicamente después de un sismo ≥ 6.0), tu ubicación se comparte de
                forma anónima en el mapa de emergencia para facilitar operaciones de rescate. Esto ocurre solo si:
              </p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>Presionas &quot;Necesito Ayuda&quot;</li>
                <li>No respondes a la verificación &quot;¿Estás Bien?&quot; en el tiempo establecido</li>
              </ul>
              <p className="mt-3">
                Los datos de ubicación del Modo Rescate se eliminan automáticamente de nuestros servidores{" "}
                <strong className="text-white">24 horas después</strong> del evento sísmico. Puedes desactivar el Modo
                Rescate manualmente en cualquier momento.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-white">4. Compartición de datos</h2>
              <p>
                <strong className="text-white">No compartimos tus datos con nadie.</strong> No vendemos, alquilamos ni
                cedemos información personal a terceros, empresas de publicidad ni ninguna otra entidad.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-white">5. Retención de datos</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Email: mientras mantengas tu cuenta activa</li>
                <li>Ubicación normal: no se almacena</li>
                <li>Ubicación Modo Rescate: máximo 24 horas desde el evento</li>
                <li>Formulario de contacto: hasta que se resuelva tu consulta</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-white">6. Eliminación de tu cuenta y datos</h2>
              <p>
                Puedes solicitar la eliminación completa de tu cuenta y todos los datos asociados enviando un email a{" "}
                <a href="mailto:jjlfmedia@gmail.com" className="text-[#e63946] hover:underline">
                  jjlfmedia@gmail.com
                </a>{" "}
                con el asunto &quot;Eliminar cuenta&quot;. Procesaremos tu solicitud en un plazo máximo de 72 horas.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-white">7. Contacto</h2>
              <p>
                Para cualquier consulta relacionada con privacidad, escríbenos a:{" "}
                <a href="mailto:jjlfmedia@gmail.com" className="text-[#e63946] hover:underline">
                  jjlfmedia@gmail.com
                </a>
              </p>
            </section>
          </div>

          <div className="mt-12">
            <a href="/" className="text-sm text-[#e63946] transition-colors hover:text-[#f77f00]">
              ← Volver al inicio
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
