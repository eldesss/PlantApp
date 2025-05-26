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
        <footer className="bg-green-900 text-white p-4 mt-auto">
          <div className="container mx-auto text-center">
            <p>© 2024 Plant App - Todos los derechos reservados</p>
          </div>
        </footer>
      )}
    </>
  );
} 