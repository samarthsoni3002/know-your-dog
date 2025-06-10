function DogCard({ image, breed, description }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xl transition-all">
      <img
        src={image}
        alt={breed}
        className="w-full object-contain rounded-xl"
      />

      <h2 className="text-2xl font-bold text-gray-800 mt-4">
        Breed: <span className="text-blue-600">{breed}</span>
      </h2>
      <p className="mt-2 text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

export default DogCard;
