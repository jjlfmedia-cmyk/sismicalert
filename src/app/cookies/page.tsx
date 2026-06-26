import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Política de Cookies — SismoAlerta América",
  description: "Política de cookies de SismoAlerta América.",
};

export default function CookiesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="mb-2 text-3xl font-bold text-white sm:text-4xl">Política de Cookies</h1>
          <p className="mb-10 text-sm text-gray-500">Última actualización: Junio 2026</p>

          <div className="space-y-8 text-gray-400 leading-relaxed">
            <section>
              <h2 className="mb-3 text-xl font-semibold text-white">1. ¿Qué son las cookies?</h2>
              <p>
                Las cookies son pequeños archivos de texto que se almacenan en tu navegador web cuando visitas un sitio.
                Se utilizan para recordar preferencias, mantener sesiones de usuario y mejorar la experiencia de
                navegación.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-white">2. Cookies que utilizamos</h2>
              <p>
                El sitio web de SismoAlerta América utiliza únicamente{" "}
                <strong className="text-white">cookies técnicas esenciales</strong>:
              </p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>
                  <strong className="text-gray-300">Cookies de sesión:</strong> Necesarias para mantener tu sesión si
                  inicias sesión en tu cuenta. Se eliminan al cerrar el navegador.
                </li>
                <li>
                  <strong className="text-gray-300">Cookies de preferencias:</strong> Almacenan tus preferencias de
                  idioma o configuración del sitio.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-white">3. Cookies que NO utilizamos</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong className="text-gray-300">Cookies de seguimiento:</strong> No rastreamos tu actividad en línea
                </li>
                <li>
                  <strong className="text-gray-300">Cookies publicitarias:</strong> No mostramos anuncios ni
                  compartimos datos con redes publicitarias
                </li>
                <li>
                  <strong className="text-gray-300">Cookies de terceros:</strong> No incluimos cookies de servicios de
                  análisis como Google Analytics
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-white">4. Cómo gestionar las cookies</h2>
              <p>
                Puedes desactivar las cookies desde la configuración de tu navegador web. Ten en cuenta que desactivar
                las cookies técnicas podría afectar el funcionamiento del sitio (por ejemplo, no podrás mantener tu
                sesión iniciada).
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-white">5. Contacto</h2>
              <p>
                Si tienes preguntas sobre nuestra política de cookies:{" "}
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
