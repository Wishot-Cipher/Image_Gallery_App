import React, { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchBar from "./SearchBar";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { database } from "../../firebaseConfig/config";

const ImageUploader = ({handleSearch, searchResults }) => {
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [tags, setTags] = useState("");

  const handleImageUpload = (e) => {
    const files = e.target.files;
    const fileArray = Array.from(files);
    setImages([...images, ...fileArray]);
  };

  const handleTagInputChange = (e) => {
    setTags(e.target.value);
  };

  const handleUpload = () => {
    const storage = getStorage();
    setIsUploading(true);

    images.forEach((image) => {
      const storageRef = ref(storage, image.name);
      uploadBytes(storageRef, image)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref)
            .then((downloadURL) => {
              const tagsArray = tags.split(",").map((tag) => tag.trim());

              const imagesCollectionRef = collection(database, "images");

              addDoc(imagesCollectionRef, {
                url: downloadURL,
                altText: image.name,
                tags: tagsArray,
              })
                .then(() => {
                  toast.success("Image uploaded successfully!");
                  setIsUploading(false);
                  setImages([]);
                  setTags("");
                })
                .catch((error) => {
                  console.error("Error adding document:", error);
                });
            })
            .catch((error) => {
              console.error("Error getting download URL:", error);
            });
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          toast.error("Image upload failed. Error: " + error);
          setIsUploading(false);
        });
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white border rounded-lg shadow-lg mb-16 mt-6">
      <SearchBar handleSearch={handleSearch} />
      <h2 className="text-xl font-bold mb-4 text-center">Upload Image</h2>
      <div className="relative mb-4">
        <label
          htmlFor="file-upload"
          className="bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center justify-center cursor-pointer"
        >
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          <span className="text-gray-800">Upload Images</span>
        </label>
        <input
          id="file-upload"
          type="file"
          required
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {images.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2 text-center">Selected Images</h2>
          <div className="flex flex-wrap">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={image.name}
                  className="w-16 h-16 object-cover m-1 rounded"
                />
                <button
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full text-xs"
                  onClick={() => {
                    const updatedImages = [...images];
                    updatedImages.splice(index, 1);
                    setImages(updatedImages);
                  }}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-1 font-bold">Tags (comma-separated)</label>
        <input
          type="text"
          value={tags}
          onChange={handleTagInputChange}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <button
        onClick={handleUpload}
        className={`bg-gradient-to-r from-pink-400 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lx hover:bg-slate-800 w-[50%] mx-auto block ${
          images.length === 0 ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isUploading || images.length === 0}
      >
        {isUploading ? "Uploading..." : "Upload Images"}
      </button>

      {/* Display Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2 text-center">Search Results</h2>
          <div className="flex flex-wrap">
            {searchResults.map((result) => (
              <div key={result.id} className="relative">
                <img
                  src={result.url}
                  alt={result.altText}
                  className="w-16 h-16 object-cover m-1 rounded"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
