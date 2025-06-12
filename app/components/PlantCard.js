import Image from 'next/image';
import { FaCheckCircle } from 'react-icons/fa';

export default function PlantCard({ plant, onClick, showCheck = false, checked = false, onCheck }) {
  const { scientificName, family, imageUrl } = plant;
  let previewImage = null;
  if (imageUrl && Array.isArray(imageUrl) && imageUrl.length > 0) {
    previewImage = imageUrl[0];
  } else if (imageUrl && typeof imageUrl === 'string') {
    try {
      const imgs = JSON.parse(imageUrl);
      if (Array.isArray(imgs) && imgs.length > 0) previewImage = imgs[0];
    } catch {}
  }
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-105 hover:shadow-xl cursor-pointer relative"
      onClick={onClick}
    >
      {showCheck && (
        <button
          className={`absolute top-2 right-2 text-2xl focus:outline-none z-10 ${checked ? 'text-green-600' : 'text-gray-300'}`}
          title={checked ? 'Quitar de selección' : 'Seleccionar para el jardín'}
          onClick={e => {
            e.stopPropagation();
            if (onCheck) onCheck(!checked);
          }}
        >
          <FaCheckCircle />
        </button>
      )}
      <div className="aspect-square relative">
        {previewImage ? (
          <Image
            src={previewImage}
            alt={scientificName}
            className="w-full h-full object-cover"
            width={400}
            height={400}
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-green-50">
            <span className="text-gray-400">Sin imagen</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3
          className="font-semibold text-lg text-gray-800 mb-1 font-display truncate max-h-[48px] leading-tight"
          style={{ lineHeight: '1.1', fontSize: scientificName.length > 22 ? '1rem' : '1.125rem' }}
          title={scientificName}
        >
          {scientificName}
        </h3>
        <div className="mt-2 text-sm text-gray-500 font-sans">
          <p>Familia: {family || 'No especificada'}</p>
        </div>
      </div>
    </div>
  );
} 