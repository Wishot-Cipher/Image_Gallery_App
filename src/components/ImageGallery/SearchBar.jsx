import React, { useState } from "react";

const SearchBar = ({ handleSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    handleSearch(value);
    console.log("Search Query:", value); // Add this line
  };
  const handleRefresh = () =>{
     setSearchQuery("")
  }

  return (
    <div className="relative flex items-center">
      <input
        type="text"
        value={searchQuery}
        onChange={handleChange}
        placeholder="Search by tag..."
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        autoComplete="off" // Add this line
      />

      <button
        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2"
        onClick={handleRefresh}
      >
        Reset
      </button>
    </div>
  );
};

export default SearchBar;
