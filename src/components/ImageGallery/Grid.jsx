import React from "react";
import ImageUploader from "./ImageUploader";
import logo from "../../assets/unnamed.gif";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebaseConfig/config";
import { Link } from "react-router-dom";

export function Grid({ children, columns, handleSearch, searchResults }) {
  const [user] = useAuthState(auth);

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
        <div className="flex justify-between p-4 bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-500 h-[10vh] lg:h-[11vh]">
          <div className="text-white">
            <h1 className="text-2xl font-bold">Gallery</h1>
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
          <h2 className="  mt-8 mb-4 underline text-3xl font-extrabold my-3 text-center text-[#BE123C] text-shadow">
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
    </div>
  );
}
