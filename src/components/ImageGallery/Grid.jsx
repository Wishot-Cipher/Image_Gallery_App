import React, { useState, useEffect } from "react";
import ImageUploader from "./ImageUploader";
import logo from "../../assets/unnamed.gif";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebaseConfig/config";
import { Link } from "react-router-dom";
import fav from "../../assets/fav.jfif"
import { FavoritesGallery } from "./FavoritesGallery";
import { getFirestore, collection, getDocs } from "firebase/firestore";

export function Grid({
  children,
  columns,
  handleSearch,
  searchResults,
  totalPages,
  currentPage,
  setCurrentPage,
}) {
  const [user] = useAuthState(auth);
  const [scrollToTop, setScrollToTop] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false); // Modal for favorites
  const [favorites, setFavorites] = useState([]); // Initialize favorites as an empty array
  const firestore = getFirestore();

  // Scroll to top when page changes
  useEffect(() => {
    if (scrollToTop) {
      window.scrollTo({
        top: 200,
        behavior: "smooth",
      });
      setScrollToTop(false);
    }
  }, [scrollToTop]);

  function handlePageChange(page) {
    setCurrentPage(page);
    setScrollToTop(true);
  }

  // Fetch user's favorite photos from Firestore
  const fetchFavorites = async () => {
    if (!user) return;
    try {
      const favoritesCollection = collection(
        firestore,
        "users",
        user.uid,
        "favorites"
      );
      const favoritesSnapshot = await getDocs(favoritesCollection);
      const fetchedFavorites = favoritesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Fetched favorites:", fetchedFavorites); // Check what is being fetched
      setFavorites(fetchedFavorites);
      setShowFavorites(true);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  return (
    <div>
      {!user && (
        <div>
          <nav className="bg-gradient-to-r from-[#10132E] via-purple-950 to-indigo-950 p-4 flex justify-between items-center backdrop-blur-lg h-[10vh] lg:h-[11vh]">
            <div className="text-white">
              <h1 className="text-2xl font-bold flex items-center">
                <img
                  src={logo}
                  alt="Logo"
                  className="object-cover max-w-[25%] mr-2"
                />
                Gallery App
              </h1>
            </div>
            <Link to={"/login"}>
              <button className="bg-white text-indigo-950 py-2 px-6 rounded-full text-lg font-semibold shadow-md hover:shadow-lg transition duration-300">
                Login
              </button>
            </Link>
          </nav>
        </div>
      )}

      {user && (
        <div className="flex justify-between py-4 px-2 lg:px-4 bg-gradient-to-r from-[#10132E] via-purple-950 to-indigo-950 h-[78px] lg:h-[11vh]">
          <div className="text-white">
            <h1 className="text-2xl font-bold flex items-center -mt-2.5">
              <img
                src={logo}
                alt="Logo"
                className="object-cover max-w-[25%] mr-2"
              />
              Gallery App
            </h1>
          </div>
          <Link to="/login">
            <button className="bg-white text-[#10132e] py-2 px-6 rounded-full text-lg font-bold shadow-md hover:shadow-lg transition duration-300">
              Logout
            </button>
          </Link>
        </div>
      )}

      {user && (
        <ImageUploader
          searchResults={searchResults}
          handleSearch={handleSearch}
        />
      )}

      <div
        className="mt-8 mb-4"
        id="scroll"
      >
        <div className="flex items-center md:justify-center space-x-4 justify-around">
          <h2 className="md:text-3xl font-extrabold text-indigo-950 text-shadow text-2xl">
            <span className="underline">Explore Now!</span>
          </h2>
          
          <button
            className="bg-gradient-to-r from-[#10132E] via-purple-900 to-indigo-950 text-white py-1 md:py-2 px-4 rounded-lg font-bold shadow-md hover:shadow-lg transition duration-300 flex justify-center align-middle"
            onClick={fetchFavorites} // Fetch favorites on click
            >
              <span className="mt-2 mr-1">Favorites</span>
            
            <img src={fav} alt="favorite image" className=" w-10 rounded-full" />
          </button>
            </div>
      </div>

      <div
        style={{
          display: "grid",
          gridGap: 12,
          padding: 10,
        }}
        className="md:grid-cols-3 lg:flex lg:items-center mx-2"
      >
        {children}
      </div>

      <div className="flex justify-center my-5 mb-16">
        {totalPages > 1 && searchResults.length === 0 && (
          <nav>
            <ul className="flex">
              <li className={`mx-1 ${currentPage === 1 ? "opacity-50" : ""}`}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={`px-4 py-2 rounded-xl ${
                    currentPage === 1
                      ? "bg-gradient-to-r from-[#10132e] via-purple-200 to-indigo-400 cursor-not-allowed border-2 border-indigo-400 font-bold text-gray-950"
                      : "bg-gradient-to-r from-[#10132e] via-purple-900 to-indigo-950 border-2 border-indigo-900 text-white hover:bg-blue-900 font-bold"
                  }`}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>
              <li
                className={`mx-1 ${
                  currentPage === totalPages ? "opacity-50" : ""
                }`}
              >
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={`px-4 py-2 rounded-xl ${
                    currentPage === totalPages
                      ? "bg-gradient-to-r from-[#10132e] via-purple-200 to-indigo-400 cursor-not-allowed border-2 border-indigo-400 font-bold text-gray-950"
                      : "bg-gradient-to-r from-[#10132e] via-purple-900 to-indigo-950 border-2 border-indigo-900 text-white hover:bg-blue-900 font-bold"
                  }`}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>

      {/* Render the Favorites component when showFavorites is true */}
      {showFavorites && (
        <FavoritesGallery
          favorites={favorites} // Pass the fetched favorites array to the FavoritesGallery component
          onClose={() => setShowFavorites(false)} // Close the modal when "Close" is clicked
        />
      )}

      <footer className="bg-gray-100 text-center py-4 fixed bottom-0 w-full shadow-lg">
        <span className="text-[#10132E] opacity-95 font-extrabold text-shadow text-lg">
          © 2023 Image Gallery By Wishot
        </span>
      </footer>
    </div>
  );
}
