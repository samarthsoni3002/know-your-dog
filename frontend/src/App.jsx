import { useState } from "react";
import DogCard from "./components/DogCard";

function App() {
  const [imageUrl, setImageUrl] = useState(null);
  const [dogBreed, setDogBreed] = useState("");
  const [breedInfo, setBreedInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUrl(URL.createObjectURL(file));
    setDogBreed("");
    setBreedInfo("");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setDogBreed(data.breed || "Unknown");
      setBreedInfo(data.info || "No information available.");
    } catch (err) {
      console.error(err);
      setDogBreed("Error");
      setBreedInfo("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 space-y-6">
      <h1 className="text-5xl font-extrabold text-gray-800 mt-15 mb-10">
        Know Your Dog 🐶
      </h1>

      {imageUrl && (
        <DogCard
          image={imageUrl}
          breed={loading ? "Detecting..." : dogBreed}
          description={loading ? "Analyzing breed info..." : breedInfo}
        />
      )}

      <label className="cursor-pointer bg-blue-600 text-white px-6 py-3 text-lg rounded hover:bg-blue-700 transition">
        {imageUrl ? "Upload Again" : "Upload Image"}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </label>
    </div>
  );
}

export default App;
