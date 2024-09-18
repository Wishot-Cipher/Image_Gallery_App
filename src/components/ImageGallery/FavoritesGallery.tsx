import React, { useState } from "react";
import Modal from "react-modal";
import { saveAs } from "file-saver";
import { FaHeart, FaDownload } from "react-icons/fa";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebaseConfig/config";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

export function FavoritesGallery({ favorites, onClose }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  const [user] = useAuthState(auth);
  const firestore = getFirestore();

  // Open modal to view an image
  const openModal = (favorite) => {
    setSelectedFavorite(favorite);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFavorite(null);
  };

  // Handle download of an image
  const handleDownload = async (favorite) => {
    try {
      const response = await fetch(favorite.imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      const blob = await response.blob();
      saveAs(blob, "favorite-photo.png");
    } catch (error) {
      console.error("Error downloading image:", error.message);
      alert(`Failed to download image: ${error.message}`);
    }
  };

  // Handle removing from favorites
  const handleUnfavorite = async (favorite) => {
    if (!user) {
      alert("Please log in to unfavorite images.");
      toast.error("Please log in to unfavorite images.");
      return;
    } else{
        toast.success("Image Removed From Favorite!");
    }

    try {
      const userFavoritesRef = doc(
        firestore,
        "users",
        user.uid,
        "favorites",
        favorite.id
      );
      await deleteDoc(userFavoritesRef);
      alert("Image removed from favorites.");
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
    <div className="bg-white rounded-lg p-6 shadow-xl w-[90%] lg:w-[60%] relative">
      <button
        className="absolute top-4 right-4 bg-red-500 text-white py-1 px-3 rounded-full font-bold shadow-md hover:shadow-lg transition duration-300"
        onClick={onClose}
      >
        Close
      </button>
      <h2 className="text-2xl font-extrabold text-center text-indigo-950 mb-4">
        My Favorites
      </h2>
      {favorites.length === 0 ? (
        <p className="text-center text-gray-500">No favorite images yet!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[70vh]">
          {favorites.map((favorite, index) => (
            <div>
            <div
              key={favorite.id}
              className={`relative flex flex-col items-center transition-transform duration-200 ease-in-out transform hover:scale-105 my-5 shadow-lg rounded-xl bg-gray-300 ${
                index === 0 ? "md:col-span-2" : ""
              }`}
              style={{
                height: index === 0 ? "460px" : "350px",
                boxShadow: "rgba(0, 0, 0, 0.3) 0px 5px 10px",
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                position: "relative",
              }}
            >
              <img
                src={favorite.imageUrl}
                alt={favorite.tags.join(", ") || "Untitled"}
                className="w-full h-full object-cover rounded-xl"
                style={{ pointerEvents: "none" }}
              />
              {favorite.tags && (
                <div className="tags absolute bottom-4 left-4">
                  {favorite.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="tag bg-gradient-to-r from-[#10132E] via-purple-900 to-indigo-950 border-2 border-blue-950 text-white font-bold px-3 py-1.5 rounded-xl text-sm mr-2 mb-2 inline-block"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
  
              {/* Buttons for view, download, and unfavorite */}
            </div>
              <div className="flex justify-between w-full -mt-2 gap-2">
                {/* Increased margin-top from mt-2 to mt-4 */}
                <button
                  onClick={() => handleDownload(favorite)}
                  className="text-white bg-green-700 px-3 py-2 rounded-lg font-bold"
                >
                  <FaDownload className="inline mr-2" /> Download
                </button>
                <button
                  onClick={() => handleUnfavorite(favorite)}
                  className="text-white bg-red-500 px-3 py-2 rounded-lg font-bold"
                >
                  <FaHeart className="inline mr-2" /> Unfavorite
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  
    {/* Modal to view the full-size image */}
    {selectedFavorite && (
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-content relative">
          <img
            src={selectedFavorite.imageUrl}
            alt="Selected Favorite"
            className="w-full h-full object-cover rounded-xl"
          />
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white px-3 bg-red-700 rounded-lg p-2 font-bold"
          >
            Close
          </button>
        </div>
      </Modal>
    )}
  </div>
  
  );
}
