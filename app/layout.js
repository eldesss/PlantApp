import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Plant App - Tu Jardín Digital",
  description: "Aprende sobre plantas y cuida tu jardín",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        {/* Barra de navegación */}
        <nav className="bg-green-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Plant App</h1>
            <div className="space-x-4">
              <a href="/" className="hover:text-green-200">Inicio</a>
              <a href="/plantas" className="hover:text-green-200">Plantas</a>
            </div>
          </div>
        </nav>

        <main className="flex-grow">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-green-900 text-white p-4 mt-auto">
          <div className="container mx-auto text-center">
            <p>© 2024 Plant App - Todos los derechos reservados</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
