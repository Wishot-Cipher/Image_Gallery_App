// DraggableImage.jsx
import React, { useState } from 'react';

const DraggableImage = ({ id, src, alt, index, onDrop }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', index);
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = () => {
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const draggedIndex = e.dataTransfer.getData('text/plain');
    onDrop(parseInt(draggedIndex), index);
    setIsDragging(false);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      className={`draggable-image ${isDragging ? 'dragging' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
    >
      <img src={src} alt={alt} className="rounded-lg mb-2" />
    </div>
  );
};

export default DraggableImage;
