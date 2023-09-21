import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import { collection, query, where, getDocs } from "firebase/firestore";
import { database } from './firebaseConfig/config';
import UploadGallery from './pages/UploadGallery';


const App = () => {
 const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (searchQuery) => {
    try {
      const imagesRef = collection(database, "images");
      const q = query(imagesRef, where("tags", "array-contains", searchQuery));
      const querySnapshot = await getDocs(q);

      const searchResults = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSearchResults(searchResults);
      console.log("Search Query:", searchQuery);
    } catch (error) {
      console.error("Error searching images:", error);
    }
  };
  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<UploadGallery handleSearch={handleSearch} searchResults={searchResults} />} />
      </Routes>
  );
};

export default App;
