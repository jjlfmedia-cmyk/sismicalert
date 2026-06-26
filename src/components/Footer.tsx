"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-[#0a0f1e]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo and description */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e63946]">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M2 12h3l3-9 4 18 4-18 3 9h3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white">
                Sismo<span className="text-[#e63946]">Alerta</span> América
              </span>
            </div>
            <p className="mb-4 max-w-md text-sm text-gray-500 leading-relaxed">
              Aplicación gratuita de alertas sísmicas en tiempo real para todo el continente americano. Sin anuncios, sin
              suscripciones, sin datos vendidos. Tu seguridad no tiene precio.
            </p>
            <p className="text-sm text-gray-600">
              📧{" "}
              <a href="mailto:jjlfmedia@gmail.com" className="text-gray-400 transition-colors hover:text-white">
                jjlfmedia@gmail.com
              </a>
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Enlaces</h4>
            <ul className="space-y-2">
              {[
                { href: "#inicio", label: "Inicio" },
                { href: "#que-es", label: "¿Qué es?" },
                { href: "#caracteristicas", label: "Características" },
                { href: "#paises", label: "Países" },
                { href: "#contacto", label: "Contacto" },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-gray-500 transition-colors hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Legal</h4>
            <ul className="space-y-2">
              {[
                { href: "/privacidad", label: "Política de Privacidad" },
                { href: "/terminos", label: "Términos de Servicio" },
                { href: "/cookies", label: "Política de Cookies" },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-gray-500 transition-colors hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-gray-600">
            © {currentYear} SismoAlerta América. Todos los derechos reservados.
          </p>
          <p className="text-xs text-gray-600">
            Desarrollado con ❤️ por{" "}
            <a href="mailto:jjlfmedia@gmail.com" className="text-gray-400 transition-colors hover:text-white">
              JJLF Media
            </a>
            . Proyecto sin fines de lucro.
          </p>
        </div>
      </div>
    </footer>
  );
}
