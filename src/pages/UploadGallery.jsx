import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { Grid } from "../components/ImageGallery/Grid";
import { SortablePhoto } from "../components/ImageGallery/SortablePhoto";
import { Photo } from "../components/ImageGallery/Photo";
import { database, firestore } from "../firebaseConfig/config";
import { auth } from "../firebaseConfig/config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { collection, getDocs, doc } from "firebase/firestore";
// import { LoaderComponent } from "./LoaderComponent"; // Import your LoaderComponent
import ReactSpinner from "../components/ImageGallery/ReactSpinner";

const UploadGallery = ({ searchResults, handleSearch }) => {
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state
  const mouse = useSensor(MouseSensor);
  const touch = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });
  const sensors = useSensors(mouse, touch);
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

  useEffect(() => {
    setIsLoading(true); // Set loading to true before fetching

    const fetchImages = async () => {
      try {
        const imagesCollectionRef = collection(database, "images");
        const querySnapshot = await getDocs(imagesCollectionRef);

        const imageData = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const url = data.url;
          const tags = data.tags || [];
          const id = doc.id; // Use the document ID as a unique identifier

          imageData.push({ id, url, tags });
        });

        setItems(imageData);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    fetchImages();
  }, []);

  function handleDragStart(event) {
    if (!loggedIn) {
      toast.error("🦄 User not logged in. Drag disabled", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      event.cancel();
      return;
    }
    setActiveId(event.active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    console.log("active:", active);
    console.log("over:", over);

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {isLoading ? (
        <ReactSpinner /> // Show loader while fetching
      ) : (
        <SortableContext items={items} strategy={rectSortingStrategy}>
          <Grid
            columns={4}
            searchResults={searchResults}
            handleSearch={handleSearch}
          >
            {searchResults.length > 0
              ? searchResults.map((sort, index) => (
                  <SortablePhoto
                    key={index}
                    id={sort.id} // Include the id as a unique identifier
                    url={sort}
                    index={index}
                    tags={sort.tags}
                  />
                ))
              : items.map((item, index) => (
                  <SortablePhoto
                    key={index}
                    id={item.id} // Include the id as a unique identifier
                    url={item}
                    index={index}
                    tags={item.tags}
                  />
                ))}
          </Grid>
        </SortableContext>
      )}

      <DragOverlay adjustScale={true}>
        {activeId ? (
          <Photo url={activeId} index={items.findIndex((item) => item.id === activeId)} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default UploadGallery;
