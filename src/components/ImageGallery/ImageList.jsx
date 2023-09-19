import React, { useState, useEffect } from "react";
import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";
import DraggableImage from "./DraggableImage";
import { auth } from "../../firebaseConfig/config";
import ReactSpinner, { ReactSpinnerMobile } from "./ReactSpinner";
// import SkeletonLoader from "../../components/ImageGallery/SkeletonLoader";

const ImageList = ({ loading }) => {
  const [images, setImages] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);
    const myStorage = () => {
      const storage = getStorage();
      const storageRef = ref(storage);
  
      listAll(storageRef)
        .then((res) => {
          const promises = res.items.map((item) => getDownloadURL(item));
          return Promise.all(promises);
        })
        .then((downloadURLs) => {
          const imageList = downloadURLs.map((url, index) => ({
            id: index,
            url,
            altText: "Alt Text",
          }));
          setImages(imageList);
        })
        .catch((error) => {
          console.error("Error fetching images:", error);
        });
    }
  useEffect(() => {
  myStorage()
  }, []);

  const handleDrop = (fromIndex, toIndex) => {
    const updatedImages = [...images];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    setImages(updatedImages);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {loading ? (
        <>
          <div className="lg:hidden flex justify-center text-center spinner-container">
            <ReactSpinnerMobile />
          </div>
          <div className=" lg:block hidden">
            <ReactSpinner />
          </div>
        </>
      ) : (
        images.map((image, index) => (
          <div key={image.id}>
            {loggedIn ? (
              <DraggableImage
                id={image.id}
                src={image.url}
                alt={image.altText}
                index={index}
                onDrop={handleDrop}
                className="w-full h-48 object-cover rounded"
              />
            ) : (
              <img
                src={image.url}
                alt={image.altText}
                className="w-full h-48 object-cover rounded"
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ImageList;
