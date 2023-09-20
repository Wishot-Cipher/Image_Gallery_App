import React, { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/unnamed.gif";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

const ImageUploader = ({ onUpload }) => {
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = (e) => {
    const files = e.target.files;
    const fileArray = Array.from(files);
    setImages([...images, ...fileArray]);
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
              toast.success("Image uploaded successfully!");
              setIsUploading(false);
              onUpload([{ url: downloadURL, altText: image.name }, ...images]);
              setImages([]); // Clear images array after upload
            })
            .catch((error) => {
              console.error("Error getting download URL:", error);
            });
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          toast.error("Image upload failed.");
          setIsUploading(false);
        });
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white border rounded-lg shadow-lg mb-16">
      <Link
        to="/"
        className="text-white text-md bg-slate-700 px-4 py-2 my-4 lg_pro:mb-8 rounded-lg shadow-xl block"
      >
        <SearchBar />
      </Link>
      <h2 className="text-xl font-bold mb-4 text-center">Upload Image</h2>
      <div className="relative mb-4">
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
      </div>

      {/* Display selected images */}
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

      <button
        onClick={handleUpload}
        className={`bg-gradient-to-r from-pink-400 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lx hover:bg-slate-800 w-[50%] mx-auto block ${
          images.length === 0 ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isUploading || images.length === 0}
      >
        {isUploading ? "Uploading..." : "Upload Images"}
      </button>
    </div>
  );
};

export default ImageUploader;
