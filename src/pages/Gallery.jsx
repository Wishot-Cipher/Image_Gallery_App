import React, { useState, useEffect } from "react";
import ImageUploader from "../components/ImageGallery/ImageUploader";
import ImageList from "../components/ImageGallery/ImageList";
import SearchBar from "../components/ImageGallery/SearchBar";
import TagFilter from "../components/ImageGallery/TagFilter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "../firebaseConfig/config";
import { Link } from "react-router-dom";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleUpload = (uploadedImages) => {
    setImages(uploadedImages);
  };

  return (
    <div className=" mx-auto p-6">
      <ToastContainer />
      <h1 className="text-2xl font-semibold mb-4">Image Gallery</h1>
      <div className="mb-4 flex space-x-4">
        {user ? (
          <>
            <ImageUploader onUpload={handleUpload} />
            <TagFilter />
          </>
        ) : (
          <Link to={"/login"}>
            <button className=" bg-slate-600 text-white p-4 rounded-xl flex ml-4 justify-center">
              Log In
            </button>
          </Link>
        )}
      </div>
      <SearchBar />
      <ImageList images={images} loading={loading} />
    </div>
  );
};

export default Gallery;
