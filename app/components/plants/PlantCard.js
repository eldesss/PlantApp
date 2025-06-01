import { FaCheck } from 'react-icons/fa';
import Image from 'next/image';

export default function PlantCard({ plant, onClick }) {
  const { scientificName, family, imageUrl} = plant;
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
        <h3 className="font-semibold text-lg text-gray-800 mb-1 font-display">{scientificName}</h3>
        <div className="mt-2 text-sm text-gray-500 font-sans">
          <p>Familia: {family || 'No especificada'}</p>
        </div>
      </div>
    </div>
  );
} 