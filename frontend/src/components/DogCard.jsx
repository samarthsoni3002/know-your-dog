function DogCard({ image, breed, description }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-96">
      <img
        src={image}
        alt={breed}
        className="w-full h-64 object-cover rounded-lg"
      />
      <h2 className="text-2xl font-bold text-gray-800 mt-4">Breed: {breed}</h2>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
}

export default DogCard;
