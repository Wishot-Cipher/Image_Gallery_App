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
        <nav className="bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-500 p-4 flex justify-between items-center sticky top-0 backdrop-blur-lg h-[12vh]">
          <div className="text-white">
            <h1 className="text-2xl font-bold">
              <img src={logo} alt="Logo" className="object-cover max-w-[65%]" />
            </h1>
          </div>
          <Link to={"/login"}>
            <button className="bg-white text-indigo-500 py-2 px-6 rounded-full text-lg font-semibold shadow-md hover:shadow-lg transition duration-300">
              Login
            </button>
          </Link>
        </nav>
      )}

      {user && (
        <div className="flex justify-between p-4 bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-500">
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
