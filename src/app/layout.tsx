
'use client';

import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { type ReactNode } from 'react';


/**
 * Layout raíz de la aplicación.
 * Configura la estructura HTML base, el proveedor de Firebase, el sistema de notificaciones
 * y el contenedor de autenticación que envuelve a toda la aplicación.
 * @param {object} props - Propiedades del layout.
 * @param {ReactNode} props.children - El contenido de la página que se renderizará dentro del layout.
 * @returns {JSX.Element} El layout principal de la aplicación.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="ConstructPablo" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ConstructPablo" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
        <title>ConstructPablo</title>
        <meta name="description" content="Gestiona tus proyectos de construcción con facilidad, online y offline." />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
