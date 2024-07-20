import React, { useState, useEffect, forwardRef } from "react";
import Modal from "react-modal";
import { saveAs } from 'file-saver';
import { getStorage, ref as storageRef, getDownloadURL } from "firebase/storage";
import downloadIcon from "../../assets/downloadImg.png"; // Ensure correct path to your download icon
import { firestore } from "../../firebaseConfig/config"; // Ensure correct path to your Firebase storage config
import { useAuthState } from 'react-firebase-hooks/auth'; // Import authentication hook
import { auth } from "../../firebaseConfig/config"; // Ensure correct path to your Firebase auth config

Modal.setAppElement("#root"); // Assuming your root element has the id 'root'

export const Photo = forwardRef(
  ({ url, index, faded, style, tags, ...props }, ref) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState('');
    const [user] = useAuthState(auth); // Get authentication state

    useEffect(() => {
      const fetchDownloadUrl = async () => {
        try {
          console.log('Fetching download URL for:', url.url);
          const storageReference = storageRef(firestore, url.url);
          const fetchedUrl = await getDownloadURL(storageReference);
          console.log('Fetched URL:', fetchedUrl);
          setDownloadUrl(fetchedUrl);
        } catch (error) {
          console.error("Error fetching download URL:", error);
        }
      };

      fetchDownloadUrl();
    }, [url.url]);

    const handleDownload = async (e) => {
      e.stopPropagation();
      e.preventDefault();

      try {
        console.log('Download URL:', downloadUrl);
        const response = await fetch(downloadUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        
        const blob = await response.blob();
        saveAs(blob, 'photo.png');

      } catch (error) {
        console.error('Error downloading image:', error.message);
        alert(`Failed to download image: ${error.message}`);
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
          } ${index === 0 ? "h-[460px]" : "h-[350px] lg:h-[290px]"} block`}
        >
          <img
            src={downloadUrl}
            alt="photo"
            className="w-full h-full object-cover rounded-xl"
            style={{ pointerEvents: "none" }}
          />
          {tags && (
            <div className="tags absolute bottom-4 left-4">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="tag bg-gradient-to-r from-pink-600 to-blue-700 border-2 border-blue-500 text-white font-bold px-3 py-1.5 rounded-xl text-sm mr-2 mb-2 inline-block"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={openModal}
          className="mb-6 text-white bg-blue-500 px-4 py-2 rounded-lg md:hidden w-full"
        >
          View
        </button>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Image Modal"
          className="modal"
          overlayClassName="modal-overlay"
        >
          <div className="modal-content">
            <img
              src={downloadUrl}
              alt="photo"
              className="w-full h-full object-cover rounded-xl"
            />

            {user && ( // Conditionally render the download button
              <button
                onClick={handleDownload}
                className="text-black font-bold bg-white px-3 border border-blue-500 py-1 rounded-full flex items-center justify-center mt-4"
                style={{ pointerEvents: "auto" }}
              >
                <img src={downloadIcon} alt="Download" className="w-5 h-5 mr-1" />
                Download
              </button>
            )}
            
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white bg-red-500 px-2 py-1 rounded-full"
              style={{ pointerEvents: "auto" }}
            >
              Close
            </button>
          </div>
        </Modal>
      </>
    );
  }
);

export default Photo;
