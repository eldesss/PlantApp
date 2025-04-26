export default function PlantCard({ name, type, emoji, imageUrl }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-square relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-green-50">
            <span className="text-4xl">{emoji}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-1">{name}</h3>
        <p className="text-sm text-gray-600">{type}</p>
        <div className="mt-2 text-sm text-gray-500">
          <p>Familia: {type}</p>
          <p>Género: {type}</p>
          <p>Especie: {name}</p>
        </div>
      </div>
    </div>
  );
} 