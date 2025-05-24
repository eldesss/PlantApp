import Link from 'next/link';

const Navigation = () => {
  return (
    <div className="flex space-x-4">
      <Link href="/" className="text-gray-800 hover:text-green-600 transition-colors duration-200">
        Biblioteca
      </Link>
      <Link href="/jardin" className="text-gray-800 hover:text-green-600 transition-colors duration-200">
        Mi Jardín
      </Link>
      <Link href="/plantas" className="text-gray-800 hover:text-green-600 transition-colors duration-200">
        Identificar
      </Link>
    </div>
  );
};

export default Navigation; 