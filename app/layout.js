import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "./context/UserContext";
import LayoutClient from "./components/LayoutClient";

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
          <LayoutClient>
            <main className="flex-grow">
              {children}
            </main>
          </LayoutClient>
        </UserProvider>
      </body>
    </html>
  );
}
