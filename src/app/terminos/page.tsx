import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Términos de Servicio — SismoAlerta América",
  description: "Términos de servicio de SismoAlerta América.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="mb-2 text-3xl font-bold text-white sm:text-4xl">Términos de Servicio</h1>
          <p className="mb-10 text-sm text-gray-500">Última actualización: Junio 2026</p>

          <div className="space-y-8 text-gray-400 leading-relaxed">
            <section>
              <h2 className="mb-3 text-xl font-semibold text-white">1. Aceptación de los términos</h2>
              <p>
                Al descargar, instalar o utilizar SismoAlerta América (&quot;la App&quot;), aceptas estos términos de
                servicio. Si no estás de acuerdo, por favor no utilices la aplicación.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-white">2. Descripción del servicio</h2>
              <p>
                SismoAlerta América es una aplicación gratuita que proporciona alertas sísmicas en tiempo real para el
                continente americano. La app consume datos de múltiples fuentes sísmicas oficiales (USGS, EMSC, y
                servicios geológicos locales) para informar a los usuarios sobre actividad sísmica.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-white">3. Gratuidad</h2>
              <p>
                La aplicación es y será siempre <strong className="text-white">completamente gratuita</strong>. No
                contiene anuncios, suscripciones, compras dentro de la app ni funciones premium de pago.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-white">4. Limitación de responsabilidad</h2>
              <p>
                La aplicación se proporciona &quot;tal cual&quot;, sin garantía de disponibilidad continua ni de
                precisión absoluta en la detección sísmica. SismoAlerta América y JJLF Media:
              </p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>
                  <strong className="text-gray-300">No garantizan</strong> la detección de todos los sismos ni la
                  entrega de todas las alertas
                </li>
                <li>
                  <strong className="text-gray-300">No son responsables</strong> de daños causados por fallos en la
                  detección o retrasos en las alertas
                </li>
                <li>
                  <strong className="text-gray-300">No reemplazan</strong> los sistemas oficiales de alerta sísmica de
                  cada país ni los servicios de emergencia
                </li>
                <li>
                  <strong className="text-gray-300">Dependen</strong> de la disponibilidad de las APIs de terceros
                  (USGS, EMSC, etc.)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-white">5. Uso permitido</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Uso personal, no comercial</li>
                <li>Compartir la app con otras personas para su protección</li>
                <li>Reportar errores y sugerir mejoras</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-white">6. Uso prohibido</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Utilizar la app para crear falsas alarmas sísmicas</li>
                <li>Modificar el código fuente para fines maliciosos</li>
                <li>Redistribuir la app con modificaciones que incluyan malware o publicidad</li>
                <li>Utilizar la información de la app para causar pánico público</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-white">7. Propiedad intelectual</h2>
              <p>
                El nombre &quot;SismoAlerta América&quot;, el logotipo y el diseño de la aplicación son propiedad de
                JJLF Media. Los datos sísmicos son propiedad de sus respectivas fuentes (USGS, EMSC, y servicios
                geológicos nacionales).
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-white">8. Modificaciones</h2>
              <p>
                Nos reservamos el derecho de actualizar estos términos de servicio. Los cambios significativos se
                comunicarán a través del sitio web y/o notificación en la app.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-white">9. Contacto</h2>
              <p>
                Para consultas sobre estos términos:{" "}
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
