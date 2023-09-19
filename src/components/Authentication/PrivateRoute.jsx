// src/components/Authentication/PrivateRoute.jsx
import React from "react";
import { Route, Navigate, Routes } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebaseConfig/config";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [user] = useAuthState(auth);

  return (
    <Routes>
      <Route
        {...rest}
        element={user ? <Component /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default PrivateRoute;
