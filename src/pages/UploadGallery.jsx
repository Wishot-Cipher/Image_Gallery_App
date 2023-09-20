import React, { useState, useEffect } from "react";
import { DndContext, closestCenter, MouseSensor, TouchSensor, DragOverlay, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Grid } from "../components/ImageGallery/Grid";
import { SortablePhoto } from "../components/ImageGallery/SortablePhoto";
import { Photo } from "../components/ImageGallery/Photo";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { firestore } from "../firebaseConfig/config";
import { auth } from "../firebaseConfig/config";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const UploadGallery = () => {
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const [loggedIn, setLoggedIn] = useState(false);
  const [isTouchHold, setIsTouchHold] = useState(false);

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
    let touchTimer;

    const touchStartHandler = () => {
      touchTimer = setTimeout(() => {
        setIsTouchHold(true);
      }, 2000); // 2 seconds delay
    };

    const touchEndHandler = () => {
      clearTimeout(touchTimer);
      setIsTouchHold(false);
    };

    window.addEventListener('touchstart', touchStartHandler);
    window.addEventListener('touchend', touchEndHandler);

    return () => {
      window.removeEventListener('touchstart', touchStartHandler);
      window.removeEventListener('touchend', touchEndHandler);
    };
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

  function handleDragStart(event) {
    if (!loggedIn || isTouchHold) {
      toast.error('🦄 User not logged in or touch hold detected. Drag disabled', {
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
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <Grid columns={4}>
          {items.map((url, index) => (
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
