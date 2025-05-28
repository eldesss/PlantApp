'use client';
import { usePathname } from 'next/navigation';
import NavBar from './NavBar';

export default function LayoutClient({ children }) {
  const pathname = usePathname();
  const hideHeader = pathname === '/';

  return (
    <>
      {!hideHeader && <NavBar />}
      {children}
      {!hideHeader && (
        <footer className="bg-green-600 text-white p-4 mt-auto">
          <div className="container mx-auto text-center">
            <p>© 2025 Virtual Garden - Todos los derechos reservados</p>
          </div>
        </footer>
      )}
    </>
  );
} 