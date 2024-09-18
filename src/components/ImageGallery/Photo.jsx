import React, { useState, useEffect, forwardRef } from "react";
import Modal from "react-modal";
import { saveAs } from "file-saver";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebaseConfig/config";
import ReactSpinner from "../ImageGallery/ReactSpinner";
import { FaHeart, FaShareAlt } from "react-icons/fa"; // Icons for favorite and share
import { toast } from "react-toastify";

Modal.setAppElement("#root");

export const Photo = forwardRef(
  ({ url, index, faded, style, tags, ...props }, ref) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [user] = useAuthState(auth);
    const [isFavorite, setIsFavorite] = useState(false);
    const firestore = getFirestore();
    const storage = getStorage(); // Initialize Firebase storage

    // Fetch download URL
    useEffect(() => {
      const fetchDownloadUrl = async () => {
        try {
          setLoading(true); // Set loading before fetching the URL
          const storageReference = storageRef(storage, url.url); // Ensure correct storage ref usage
          const fetchedUrl = await getDownloadURL(storageReference);
          setDownloadUrl(fetchedUrl);
        } catch (error) {
          console.error("Error fetching download URL:", error);
        } finally {
          setLoading(false); // Set loading to false after fetching
        }
      };

      fetchDownloadUrl();
    }, [url.url, storage]);

    // Check if the image is already favorited when component mounts
    useEffect(() => {
      if (user) {
        const checkFavoriteStatus = async () => {
          try {
            const docRef = doc(
              firestore,
              "users",
              user.uid,
              "favorites",
              url.id
            );
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
              setIsFavorite(true);
            } else {
              setIsFavorite(false);
            }
          } catch (error) {
            console.error("Error checking favorite status:", error);
          }
        };

        checkFavoriteStatus();
      }
    }, [user, url.id, firestore]);

    // Handle download
    const handleDownload = async (e) => {
      e.stopPropagation();
      e.preventDefault();

      try {
        const response = await fetch(downloadUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        const blob = await response.blob();
        saveAs(blob, "photo.png");
      } catch (error) {
        console.error("Error downloading image:", error.message);
        alert(`Failed to download image: ${error.message}`);
      }
    };

    // Handle favorite toggle
    const handleFavorite = async () => {
      if (!user) {
        alert("Please log in to favorite images.");
        toast.warning("Please log in to favorite images.");
        return;
      }

      const userFavoritesRef = doc(
        firestore,
        "users",
        user.uid,
        "favorites",
        url.id
      );

      try {
        if (isFavorite) {
          await deleteDoc(userFavoritesRef);
          setIsFavorite(false);
        toast.error("Image Removed From Favorite.");
        } else {
          await setDoc(userFavoritesRef, {
            imageUrl: downloadUrl,
            tags: tags || [],
            timestamp: new Date(),
          });
          setIsFavorite(true);
        toast.success("Image Added To Favorite!");

        }
      } catch (error) {
        console.error("Error updating favorite status:", error);
      }
    };

    const handleShare = (e) => {
      e.stopPropagation();
      const shareData = {
        title: "Check out this image",
        text: "Check out this cool photo I found!",
        url: downloadUrl,
      };
      if (navigator.share) {
        navigator
          .share(shareData)
          .catch((error) => console.error("Error sharing:", error));
      } else {
        alert("Sharing is not supported on your browser.");
      }
    };

    const openModal = (e) => {
      e.stopPropagation();
      setIsModalOpen(true);
    };

    const closeModal = (e) => {
      e.stopPropagation();
      setIsModalOpen(false);
    };

    return (
      <>
        <div
          ref={ref}
          style={{
            opacity: faded ? "0.2" : "1",
            transformOrigin: "0 0",
            width: "100%",
            height: index === 0 ? "460px" : "350px",
            boxShadow: "rgba(0, 0, 0, 0.3) 0px 5px 10px",
            transition: "transform 0.2s ease-in-out",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            position: "relative",
            ...style,
          }}
          {...props}
          className={`rounded-xl bg-transparent bg-gray-300 ${
            index === 0 ? "md:col-span-2 mb-0" : "md:mb-0"
          }
          ${index === 0 ? "h-[460px]" : "h-[350px] lg:h-[290px]"} block`}
        >
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <ReactSpinner />
            </div>
          ) : (
            <img
              src={downloadUrl}
              alt="photo"
              className="w-full h-full object-cover rounded-xl"
              style={{ pointerEvents: "none" }}
            />
          )}
          {tags && (
            <div className="tags absolute bottom-4 left-4">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="tag bg-gradient-to-r from-[#10132E] via-purple-900 to-indigo-950 border-2 border-blue-950 text-white font-bold px-3 py-1.5 rounded-xl text-sm mr-2 mb-2 inline-block"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between mt-2 md:hidden gap-2">
          <button
            onClick={openModal}
            className="mb-6 text-white bg-indigo-950 px-3 h-12 rounded-lg md:hidden w-5/6 font-bold  -mt-2"
          >
            View
          </button>

          <button
            onClick={handleFavorite}
            className={`inline-flex h-12 items-center justify-center rounded-md border border-slate-800 md:hidden -mt-2
    ${
      isFavorite
        ? "bg-red-700 text-white font-bold text-lg"
        : "bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] text-slate-300"
    } 
    bg-[length:200%_100%] px-4 font-medium 
    transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 
    focus:ring-offset-slate-50 animate-shimmer w-2/6`}
          >
            <FaHeart className="mr-2 text-2xl" />
            {/* Increased the icon size */}
          </button>

          <button
            onClick={handleShare}
            className=" inline-flex h-12 items-center justify-center mb-6 text-white bg-green-700 px-4 py-3  rounded-lg md:hidden 2/6 font-bold -mt-2 animate-shimmer"
          >
            <FaShareAlt className="mr-2 text-2xl" />
          </button>
        </div>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Image Modal"
          className="modal"
          overlayClassName="modal-overlay"
        >
          <div className="modal-content">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <ReactSpinner />
              </div>
            ) : (
              <img
                src={downloadUrl}
                alt="photo"
                className="w-full h-full object-cover rounded-xl"
              />
            )}

            {user && (
              <button
                onClick={handleDownload}
                className="text-black font-bold bg-white px-3 border border-blue-500 py-1 rounded-full flex items-center mt-4"
              >
                Download
              </button>
            )}

            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white px-3 bg-red-700 rounded-lg p-2 font-bold"
            >
              Close
            </button>
          </div>
        </Modal>
      </>
    );
  }
);
