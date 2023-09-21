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
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { firestore } from "../firebaseConfig/config";
import { auth } from "../firebaseConfig/config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UploadGallery = ({ searchResults, handleSearch }) => {
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const mouse = useSensor(MouseSensor);
  const touch = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });
  const sensors = useSensors(mouse, touch);
  const [loggedIn, setLoggedIn] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);

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
    const storageRef = ref(firestore);
  
    listAll(storageRef)
      .then((res) => {
        const promises = res.items.map((item) => getDownloadURL(item));
        return Promise.all(promises);
      })
      .then((downloadURLs) => {
        setItems(downloadURLs);
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  }, []);

  useEffect(() => {
    const filtered = items.filter((item) =>
      searchResults.some((searchItem) => searchItem.id === item.id)
    );

    if (searchResults.length > 0) {
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [searchResults, items]);

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

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

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
      <SortableContext items={filteredItems} strategy={rectSortingStrategy}>
        <Grid
          columns={4}
          searchResults={searchResults}
          handleSearch={handleSearch}
        >
          {searchResults.length > 0
            ? searchResults.map((url, index) => (
                <SortablePhoto key={url.id} url={url.url} index={index} />
              ))
            : filteredItems.map((url, index) => (
                <SortablePhoto key={url} url={url} index={index} />
              ))}
        </Grid>
      </SortableContext>

      <DragOverlay adjustScale={true}>
        {activeId ? (
          <Photo url={activeId} index={items.indexOf(activeId)} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default UploadGallery;
