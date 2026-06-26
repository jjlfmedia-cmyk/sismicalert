import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "SismoAlerta América — Alertas Sísmicas en Tiempo Real",
  description:
    "Aplicación gratuita de alertas sísmicas para toda América. Sin anuncios, sin suscripción. Protege tu vida con alertas en tiempo real.",
  keywords: "sismo, alerta sísmica, terremoto, earthquake, América, alertas, gratis",
  openGraph: {
    title: "SismoAlerta América",
    description: "Alertas sísmicas en tiempo real. Gratis. Para toda América.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
