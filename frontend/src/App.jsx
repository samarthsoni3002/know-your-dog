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
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      console.log("Raw response:", res); // NEW

      console.log("Returned JSON:", data); // NEW
      setDogBreed(data.breed || "Unknown");
      setBreedInfo(data.info || "No additional info found.");
    } catch (err) {
      console.error(err);
      setDogBreed("Error");
      setBreedInfo("Could not retrieve information.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6">
        Upload Image
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </label>

      {imageUrl && (
        <DogCard
          image={imageUrl}
          breed={loading ? "Detecting..." : dogBreed}
          description={loading ? "Analyzing breed info..." : breedInfo}
        />
      )}
    </div>
  );
}

export default App;
