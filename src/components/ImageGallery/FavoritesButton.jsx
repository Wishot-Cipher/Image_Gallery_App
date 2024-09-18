import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebaseConfig/config";
import { FavoritesGallery } from "./FavoritesGallery";

export function FavoritesButton() {
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [user] = useAuthState(auth);
  const firestore = getFirestore();

  useEffect(() => {
    if (user) {
      const fetchFavorites = async () => {
        try {
          const favoritesCollectionRef = collection(
            firestore,
            "users",
            user.uid,
            "favorites"
          );
          const querySnapshot = await getDocs(favoritesCollectionRef);
          const fetchedFavorites = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setFavorites(fetchedFavorites);
        } catch (error) {
          console.error("Error fetching favorites:", error);
        }
      };

      fetchFavorites();
    }
  }, [user, firestore]);

  const openFavorites = () => {
    setIsFavoritesOpen(true);
  };

  const closeFavorites = () => {
    setIsFavoritesOpen(false);
  };

  return (
    <div>
      <button
        onClick={openFavorites}
        className="bg-indigo-600 text-white p-2 rounded-lg"
      >
        View Favorites
      </button>

      {isFavoritesOpen && (
        <FavoritesGallery favorites={favorites} onClose={closeFavorites} />
      )}
    </div>
  );
}
