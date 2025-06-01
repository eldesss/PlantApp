import Image from 'next/image';

export default function PlantModal({ plant, onClose }) {
  if (!plant) return null;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
      <div className="relative bg-white rounded-xl shadow-2xl p-8 max-w-md w-full z-10" onClick={e => e.stopPropagation()}>
        <button className="absolute top-3 right-3 text-green-700 hover:text-green-900 text-2xl font-bold" onClick={onClose} aria-label="Cerrar">×</button>
        <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">{scientificName}</h2>
        <div className="flex flex-col items-center">
          {previewImage ? (
            <Image src={previewImage} alt={scientificName} className="w-60 h-60 object-cover rounded-lg border mb-4" width={240} height={240} unoptimized />
          ) : (
            <div className="w-60 h-60 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 border mb-4 text-4xl">?</div>
          )}
          <div className="text-gray-700 text-center">
            <p className="mb-2"><span className="font-semibold">Familia:</span> {family || 'No especificada'}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 