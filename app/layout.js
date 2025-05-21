import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";
import { UserProvider } from "./context/UserContext";

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
        <UserProvider>
          {/* Barra de navegación */}
          <NavBar />
          <main className="flex-grow">
            {children}
          </main>
          {/* Footer */}
          <footer className="bg-green-900 text-white p-4 mt-auto">
            <div className="container mx-auto text-center">
              <p>© 2024 Plant App - Todos los derechos reservados</p>
            </div>
          </footer>
        </UserProvider>
      </body>
    </html>
  );
}
