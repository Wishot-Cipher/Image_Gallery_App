import React, { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/unnamed.gif"
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
          getDownloadURL(snapshot.ref) // Get download URL from the reference
            .then((downloadURL) => {
              toast.success("Image uploaded successfully!");
              setIsUploading(false);
              onUpload([{ url: downloadURL, altText: image.name }, ...images]);
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
    <>
      {/* <div
        className="text-white text-md sticky top-0 bg-opacity-80 backdrop-blur-lx p-4 bg-slate-700 px-4 py-2 my-4 lg_pro:mb-8 rounded-sm shadow-xl block"
      >
        <div>
          <img src={logo} alt="wisht logo" className="object-cover max-w-[20%] w-14"/>
        </div>
        <div>

        </div>
      </div> */}
      <div className="max-w-4xl mx-auto p-6 bg-white border rounded-lg shadow-lg mb-16">
        <Link
          to="/"
          className="text-white text-md bg-slate-700 px-4 py-2 my-4 lg_pro:mb-8 rounded-lg shadow-xl block"
        >
          <SearchBar />
        </Link>
        <h2 className="text-xl font-bold mb-4 text-center">Upload Image</h2>
        <input
          type="file"
          multiple
          onChange={handleImageUpload}
          className="mb-4 p-2 border rounded-xl w-full"
        />
        <button
          onClick={handleUpload}
          className="bg-gradient-to-r from-pink-400 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lx hover:bg-slate-800 w-[50%] mx-auto block"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Images"}
        </button>
      </div>
    </>
  );
};

export default ImageUploader;
