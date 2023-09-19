// src/components/ImageGallery/TagFilter.js
import React, { useState } from 'react';

const TagFilter = ({ handleFilter }) => {
  const [tag, setTag] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFilter(tag);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <h2 className="text-xl font-semibold mb-2">Filter by Tag</h2>
      <input
        type="text"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        placeholder="Tag"
        className="mb-2 p-2 border border-gray-300 rounded"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700"
      >
        Apply
      </button>
    </form>
  );
};

export default TagFilter;
