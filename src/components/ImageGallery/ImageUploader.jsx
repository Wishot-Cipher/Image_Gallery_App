import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ImageUploader = ({ onUpload }) => {
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = (e) => {
    const files = e.target.files;
    const fileArray = Array.from(files);
    setImages([...images, ...fileArray]);
  };

  const handleUpload = () => {
    const storage = getStorage();
    setIsUploading(true);

    images.forEach((image) => {
      const storageRef = ref(storage, image.name);
      uploadBytes(storageRef, image)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref) // Get download URL from the reference
            .then((downloadURL) => {
              toast.success('Image uploaded successfully!');
              setIsUploading(false);
              onUpload([{ url: downloadURL, altText: image.name }, ...images]);
            })
            .catch((error) => {
              console.error('Error getting download URL:', error);
            });
        })
        .catch((error) => {
          console.error('Error uploading image:', error);
          toast.error('Image upload failed.');
          setIsUploading(false);
        });
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Upload Image</h2>
      <input
        type="file"
        multiple
        onChange={handleImageUpload}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700"
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload Images'}
      </button>
      <ToastContainer />
    </div>
  );
};

export default ImageUploader;
