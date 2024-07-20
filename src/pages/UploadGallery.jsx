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
import { database, auth } from "../firebaseConfig/config";
import {
  collection,
  getDocs,
  query,
  orderBy,
  onSnapshot, // Added for real-time updates
} from "firebase/firestore";
import ReactSpinner from "../components/ImageGallery/ReactSpinner";

const UploadGallery = ({ searchResults, handleSearch }) => {
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [paginatedItems, setPaginatedItems] = useState([]);

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

  const fetchImages = async () => {
    try {
      const imagesCollectionRef = collection(database, "images");
      const orderedData = query(
        imagesCollectionRef,
        orderBy("createdAt", "desc") // Sort by createdAt in descending order
      );

      const unsubscribe = onSnapshot(orderedData, (querySnapshot) => {
        const imageData = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const url = data.url;
          const tags = data.tags || [];
          const id = doc.id;
          const createdAt = data.createdAt;

          imageData.push({ id, url, tags, createdAt });
        });

        setItems(imageData);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    }
  };

  const paginatedData = (page) => {
    const start = (page - 1) * 10;
    const end = start + 10;
    let filteredData = items.slice(start, end);

    setPaginatedItems(filteredData);
    setTotalPages(Math.ceil(items.length / 10));

    if (currentPage > Math.ceil(items.length / 10)) {
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    paginatedData(currentPage);
    // searchResults(currentPage);
  }, [currentPage, items, searchResults]);

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

    if (over && active.id !== over.id) {
      setPaginatedItems((paginatedItems) => {
        const oldIndex = paginatedItems.findIndex((item) => item.id === active.id);
        const newIndex = paginatedItems.findIndex((item) => item.id === over.id);

        return arrayMove(paginatedItems, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {isLoading ? (
          <ReactSpinner />
        ) : (
          <SortableContext
            items={paginatedItems}
            strategy={rectSortingStrategy}
          >
            <Grid
              columns={4}
              searchResults={searchResults}
              handleSearch={handleSearch}
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            >
              {searchResults.length > 0
                ? searchResults.map((sort, index) => (
                    <SortablePhoto
                      key={sort.id}
                      id={sort.id}
                      url={sort}
                      index={index}
                      tags={sort.tags}
                    />
                  ))
                : paginatedItems.map((item, index) => (
                    <SortablePhoto
                      key={item.id}
                      id={item.id}
                      url={item}
                      index={index}
                      tags={item.tags}
                    />
                  ))}
            </Grid>
          </SortableContext>
        )}

        <DragOverlay adjustScale={true} dropAnimation={null}>
          {activeId ? (
            <Photo
              url={activeId}
              index={paginatedItems.findIndex((item) => item.id === activeId)}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
};

export default UploadGallery;
