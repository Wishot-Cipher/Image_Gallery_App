import React from 'react';
import { Routes, Route } from 'react-router-dom';
// import PrivateRoute from './components/Authentication/PrivateRoute';
// import Gallery from './pages/UploadGallery';
import Login from './pages/Login';
import Register from './pages/Register';
import UploadGallery from './pages/UploadGallery';

const App = () => {
  return (
    // <DndProvider backend={HTML5Backend}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<UploadGallery />} />
      </Routes>
    // </DndProvider>
  );
};

export default App;
