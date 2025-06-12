import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "./context/UserContext";
import Header from "./components/Header";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Virtual Garden",
  description: "Crea tu jardín virtual",
};

export default function RootLayout({ children }) {
  return (
    <UserProvider>
      <html lang="es">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
          <Header />

          <main className="flex-grow">
            {children}
          </main>
          
          <Footer />
        </body>
      </html>
    </UserProvider>
  );
}
