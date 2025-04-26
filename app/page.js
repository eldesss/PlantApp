import PlantCard from '@/components/plants/PlantCard';

export default function Home() {

  const plants = [
    {
      scientificName: 'Monstera deliciosa',
      family: 'Araceae',
      images: [{ url: 'https://content.elmueble.com/medio/2019/03/25/monstera_f97f4746_800x800.jpg' }],
    },
    {
      scientificName: 'Ficus lyrata',
      family: 'Moraceae',
      images: [{ url: 'https://content.elmueble.com/medio/2019/03/25/monstera_f97f4746_800x800.jpg' }],
    },
    {
      scientificName: 'Sansevieria trifasciata',
      family: 'Asparagaceae',
      images: [{ url: 'https://content.elmueble.com/medio/2019/03/25/monstera_f97f4746_800x800.jpg' }],
    },
    {
      scientificName: 'Sansevieria trifasciata',
      family: 'Asparagaceae',
      images: [{ url: 'https://content.elmueble.com/medio/2019/03/25/monstera_f97f4746_800x800.jpg' }],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-green-800 mb-6 text-center">Biblioteca de Plantas</h1>
        {/* Grid de plantas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-[2000px] mx-auto">
          {plants.map((plant, index) => (
            <PlantCard
              key={index}
              name={plant.scientificName}
              type={plant.family}
              imageUrl={plant.images?.[0]?.url}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
