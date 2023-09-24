import React, { useState, useEffect } from "react";
import ImageUploader from "./ImageUploader";
import logo from "../../assets/unnamed.gif";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebaseConfig/config";
import { Link } from "react-router-dom";

export function Grid({
  children,
  columns,
  handleSearch,
  searchResults,
  totalPages,
  currentPage,
  setCurrentPage
}) {
  const [user] = useAuthState(auth);
  const [scrollToTop, setScrollToTop] = useState(false);

  useEffect(() => {
    if (scrollToTop) {
      window.scrollTo({
        top: 200,
        behavior: "smooth"
      });
      setScrollToTop(false);
    }
  }, [scrollToTop]);

  function handlePageChange(page) {
    console.log("Changing page to:", page);
    setCurrentPage(page);
    setScrollToTop(true);
  }


  return (
    <div>
      {!user && (
        <div>
          <nav className="bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-500 p-4 flex justify-between items-center backdrop-blur-lg h-[10vh] lg:h-[11vh]">
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
              <button className="bg-white text-indigo-500 py-2 px-6 rounded-full text-lg font-semibold shadow-md hover:shadow-lg transition duration-300">
                Login
              </button>
            </Link>
          </nav>
        </div>
      )}

      {user && (
        <div className="flex justify-between py-4 px-2 lg:px-4 bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-500 h-[78px] lg:h-[11vh]">
          <div className="text-white ">
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
            <button className="bg-white text-indigo-500 py-2 px-6 rounded-full text-lg font-semibold shadow-md hover:shadow-lg transition duration-300">
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
      <h2 className="  mt-8 mb-4 underline text-3xl font-extrabold my-3 text-center text-[#BE123C] text-shadow" id="sroll">
        Image Gallery
      </h2>
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
                      ? "bg-gradient-to-r from-pink-400 via-purple-200 to-indigo-400 cursor-not-allowed border-2 border-indigo-400"
                      : "bg-gradient-to-r from-pink-600 via-purple-500 to-indigo-700 border-2 border-indigo-700 text-white hover:bg-blue-700"
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
                      ? "bg-gradient-to-r from-pink-400 via-purple-200 to-indigo-400 cursor-not-allowed border-2 border-indigo-400"
                      : "bg-gradient-to-r from-pink-600 via-purple-500 to-indigo-700 border-2 border-indigo-700 text-white hover:bg-blue-700"
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
      <footer className="bg-gray-100 text-center py-4 fixed bottom-0 w-full shadow-md">
        <span className="text-slate-600 font-extrabold text-shadow text-lg">© 2023 Image Gallery by Wishot</span>
      </footer>
    </div>
  );
}
